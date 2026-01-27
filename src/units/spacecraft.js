import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';

import {CombatUnit} from './combat-unit.js';

class Spacecraft extends CombatUnit{//cac phuong tien bay ngoai khong gian

	constructor(params){
		super(params);
		this._behavior_id=-1;
		
		this._lock_dimension_Y_in_all_behaviors=false;//ko dich chuyen len xuong theo truc Y
	}
	
	start_hunting_behavior_1(){
		let randomNumber,_rand;
		randomNumber = Math.random();
		_rand = Math.floor(randomNumber * 5) + 3;
		let _approach_min_distance=100;
		let _unit1=this;
		let _condition1_fc=()=>{
			const _unit2=_unit1._target_object;
			if(typeof _unit2==='undefined'||_unit2===null||_unit2.Dead)
				return false;
			if(_unit1.Position.distanceTo(_unit2.Position)>200)
				return false;
			
			return true;
		};
		let _get_speed_fc_1=()=>{
			let _distance=_unit1.Position.distanceTo(_unit1._target_object.Position);
			if(_distance>1500)
				return 200;
			if(_distance>1000)
				return 100;
			if(_distance>500)
				return 70;
			if(_distance>300)
				return 30;
			return 20;
		};
		
		this._behaviors=[
			{name:'APPROACH-TARGET-2',time:4,params:{perform_num:0,limit_perform_num:999999,speed:_get_speed_fc_1,min_distance:_approach_min_distance,finish_condition1:_condition1_fc}},
			{name:'ATTACK-TARGETS-2',time:_rand,params:{perform_num:0,limit_perform_num:999999,speed1:30,speed2:30,shoot_distance:200,min_distance:100,finish_condition1:null}},
			{name:'RUN-AWAY-2',time:6,params:{perform_num:0,limit_perform_num:999999,speed:70,max_distance:1300,finish_condition1:null}},
			{name:'RUN-AWAY-2',time:4,params:{perform_num:0,limit_perform_num:999999,speed:70,max_distance:600,finish_condition1:null}}
		  ];
		  
		  this.perform_next_behavior();
	}
	start_attack_satellite_behavior_1(){
		let _approach_time=13;
		this._behaviors=[
		    {name:'APPROACH-TARGET-1',time:_approach_time,params:{perform_num:0,limit_perform_num:1,speed:50,min_distance:50,finish_condition1:null}},
			{name:'ATTACK-TARGETS-1',time:999999,params:{perform_num:0,limit_perform_num:999999,speed1:25,speed2:20,shoot_distance:320,min_distance:100,finish_condition1:null}}
		  ];
		  
		  this.perform_next_behavior();
		
	};
	start_move_to_front_of_target_behavior_1(){
		this._behaviors=[
		    {name:'MOVE-TO-FRONT-OF-TARGET-1',time:999999,params:{perform_num:0,limit_perform_num:999999,distance:150,finish_condition1:null}}
		  ];
		  
		  this.perform_next_behavior();
	}
	
	CheckTarget(timeInSeconds){
		
		if(typeof this._target_object==='undefined'||this._target_object===null||this._target_object.Dead){
			//let _all_enemy_units=this._game._unitMG.get_all_other_team_unit(this._player_id);
			for(let i=0;i<this._game._unitMG._full_unit.length;i++){
				const _tunit=this._game._unitMG._full_unit[i];
				if(!_tunit.Dead&&_tunit._is_enemy===false){
					this._target_object=_tunit;
					return;
				}
			}
			if(this._player_id!=this._game._playerID)
				this._target_object=this._game._me;
		}
		
		if(!this._behaviors)return;
		if(this._behaviors.length===0)return;
		
		if(this._target_object===this._game._me)
			if(this._game._gear_box.is_parking())
				return;//khi player dang dung' yen thi tat ca cac unit se tap trung tai 1 diem truoc mat player
		
		const _behavior_name=this.get_current_behavior_name();
		
		if(_behavior_name==='ATTACK-TARGETS-1'){
			this.attack_target_1(timeInSeconds);
			return;
		}
		if(_behavior_name==='ATTACK-TARGETS-2'){
			this.attack_target_2(timeInSeconds);
			return;
		}
			
		if(_behavior_name==='RUN-AWAY'){
			this.run_away(timeInSeconds);
			return;
		}
		if(_behavior_name==='RUN-AWAY-2'){
			this.run_away_2(timeInSeconds);
			return;
		}
		
		if(_behavior_name==='APPROACH-TARGET-1'){
			this.approach_target_1(timeInSeconds);
			return;
		}
		if(_behavior_name==='APPROACH-TARGET-2'){
			this._origin_pos2=null;//chuan bi cho RUN-AWAY-2
			this.approach_target_2(timeInSeconds);
			return;
		}
		if(_behavior_name==='MOVE-TO-FRONT-OF-TARGET-1'){
			this.move_to_front_of_target(timeInSeconds);
			return;
		}
	}
	
	get_current_behavior_name(){
		const _behavior=this._behaviors[this._behavior_id];
		return _behavior.name;
	}
	get_current_behavior_time(){
		const _behavior=this._behaviors[this._behavior_id];
		return _behavior.time;
	}
	get_current_behavior_parameters(){
		const _behavior=this._behaviors[this._behavior_id];
		return _behavior.params;
	}
	get_current_behavior_finish_condition1(){
		const _behavior=this._behaviors[this._behavior_id];
		return _behavior.condition1;
	}
	update_perform_counter(){
		const _behavior=this._behaviors[this._behavior_id];
		_behavior.perform_num++;
	}
	
	perform_next_behavior(){
		
		if(this._behaviors.length===0)return;
		
		if(this._behavior_id>-1){
			const _condition1=this.get_current_behavior_finish_condition1();
			if(_condition1!=null)if(_condition1()===false)return;
		}
		
		this._behavior_id++;
		if(this._behavior_id>=this._behaviors.length)this._behavior_id=0;
		
		const _behavior_name=this.get_current_behavior_name();
		const _behavior_time=this.get_current_behavior_time();
		
		this.update_perform_counter();
		
		this._behavior_params=this.get_current_behavior_parameters();
		if(this._behavior_params.perform_num>this._behavior_params.limit_perform_num){
			this.perform_next_behavior();
		}
		
		if(_behavior_name==='ATTACK-TARGETS-1'){
			this._target_pos_to_attack=null;
			this._game.add_to_timer(()=>{
				this.perform_next_behavior();
			},_behavior_time);
			return;
		}
		if(_behavior_name==='ATTACK-TARGETS-2'){
			this._game.add_to_timer(()=>{
				this.perform_next_behavior();
			},_behavior_time);
			return;
		}
		if(_behavior_name==='RUN-AWAY'){
			this._target_pos_to_run=null;
			this._game.add_to_timer(()=>{
				this.perform_next_behavior();
			},_behavior_time);
			return;
		}
		if(_behavior_name==='RUN-AWAY-2'){
			this._target_pos_to_run=null;
			this._game.add_to_timer(()=>{
				this.perform_next_behavior();
			},_behavior_time);
			return;
		}
		if(_behavior_name==='APPROACH-TARGET-1'){
			this._game.add_to_timer(()=>{
				this.perform_next_behavior();
			},_behavior_time);
			return;
		}
		if(_behavior_name==='APPROACH-TARGET-2'){
			this._approach_taret_pos_2=null;
			this._game.add_to_timer(()=>{
				this.perform_next_behavior();
			},_behavior_time);
			return;
		}
		if(_behavior_name==='MOVE-TO-FRONT-OF-TARGET-1'){
			this._game.add_to_timer(()=>{
				this.perform_next_behavior();
			},_behavior_time);
			return;
		}
	}
	
	move_to_front_of_target(timeInSeconds){//di chuyen vao phía trước mặt target
		
	}

	run_away_2(timeInSeconds){
		
		if(typeof this._origin_pos2==='undefined'||this._origin_pos2===null){
			this._origin_pos2=this.Position;
			const _rand1=this._game._utils.get_random_in_range(1,4);
			const _angle=Math.PI;
			//const _angle=Math.random() * (Math.PI - Math.PI / 2) + Math.PI / 2;//random tu PI/2 => PI
			const _speed=500;
			if(_rand1===1)this.turnLeft(_angle,_speed,()=>{});
			if(_rand1===2)this.turnRight(_angle,_speed,()=>{});
			
			if(_rand1===3)
				if(!this._lock_dimension_Y_in_all_behaviors){
					this.turnUp(_angle,_speed,()=>{});
					//this.turnLeft(_angle,_speed,()=>{});
				}
				else
					this.turnLeft(_angle,_speed,()=>{});
			if(_rand1===4)
				if(!this._lock_dimension_Y_in_all_behaviors){
					this.turnDown(_angle,_speed,()=>{});
					//this.turnRight(_angle,_speed,()=>{});
				}
				else
					this.turnRight(_angle,_speed,()=>{});
				
				
			//console.log("HELLO!!!!!");
		}
		
		const _distance=this._origin_pos2.distanceTo(this.Position);
		if(_distance>this._behavior_params.max_distance){
				//return;
		}
		
		this.move_forward(timeInSeconds*this._behavior_params.speed);
		
	}

	run_away(timeInSeconds){
			
			const _distance=this._target_object.Position.distanceTo(this.Position);
			if(_distance>this._behavior_params.max_distance){
				
				return;
			}
		
			if(!this._target_pos_to_run||this._target_pos_to_run===null){
				this._target_pos_to_run=this.get_back_point(3000);
				/*
				const _rand=this._game._utils.get_random_in_range(1,4);
				if(_rand===1)this._target_pos_to_run=this.get_back_point(3000);
				else if(_rand===2)this._target_pos_to_run=this.get_ahead_point(3000);
				else if(_rand===3){
					const _left_point=this.get_left_point();
					this._target_pos_to_run=this._game._utils.findPointOnLine(this.Position,_left_point,3000);
				}
				else{
					const _right_point=this.get_right_point();
					this._target_pos_to_run=this._game._utils.findPointOnLine(this.Position,_right_point,3000);
				}
				*/
				//this._target_pos_to_run.y+=350;
				//this._target_pos_to_run.z+=2500;
			}
			
			const _pos=this._utils.calculateSymmetricPoint(this.Position,this._target_pos_to_run);
			this._model.lookAt(_pos);
			this._params.camera.lookAt(_pos);
			//this.move_to_position(this._target_pos_to_run,1,()=>{});
			this._model.position.copy(this._utils.translatePoint(this.get_world_position(),
									  this._target_pos_to_run,timeInSeconds*this._behavior_params.speed));	
			
	}
	
	approach_target_1(timeInSeconds){//tien' lai gan theo duong thang
		if(!this._target_object||this._target_object===null||this._target_object.Dead)
			return;
		
		let _speed=this._behavior_params.speed;
		if(typeof _speed === 'function')_speed=_speed();
		this._model.lookAt(this._target_object.Position);
		const _distance=this._target_object.Position.distanceTo(this.Position);
		//console.log(_distance);
		if(_distance>this._behavior_params.min_distance){
			this._model.position.copy(this._utils.translatePoint(this.Position.clone(),
				this._target_object.Position.clone(),timeInSeconds*_speed));	
			
			//this.move_forward(timeInSeconds*5);
		}
		else{
			this._game._utils.rotateAboutPoint(this._model, this._target_object.Position, this._game._utils.axisY,timeInSeconds*0.001, true);
		}
		
	}
	
	//Giai quyet tinh huong khi player-ship bay di xa, cac enemy-ship duoi theo tao thanh 1 hang` dai`
	approach_target_2(timeInSeconds){//tien lai gan vi tri ben phai/trai/tren/duoi target
		if(!this._target_object||this._target_object===null||this._target_object.Dead)
			return;
		
		if(typeof this._approach_taret_pos_2==='undefined'||this._approach_taret_pos_2===null){
			const _rand1=this._game._utils.get_random_in_range(1,4);
			const _rand2=this._game._utils.get_random_in_range(200,300);
			
			if(_rand1===1)this._approach_taret_pos_2=this._target_object.getRightPos(_rand2);
			if(_rand1===2)this._approach_taret_pos_2=this._target_object.getLeftPos(_rand2);
			if(_rand1===3)this._approach_taret_pos_2=this._target_object.getFrontPos(_rand2*3);
			if(_rand1===4)this._approach_taret_pos_2=this._target_object.getFrontLeftPos(_rand2*3,_rand2/2);
			if(_rand1>4)this._approach_taret_pos_2=this._target_object.getFrontRightPos(_rand2*3,_rand2/2);
			
			/*
			if(_rand1===3)
				if(!this._lock_dimension_Y_in_all_behaviors)
					this._approach_taret_pos_2=this._target_object.getAbovePos(_rand2);
				else
					this._approach_taret_pos_2=this._target_object.getRightPos(_rand2);
			if(_rand1===4)
				if(!this._lock_dimension_Y_in_all_behaviors)
					this._approach_taret_pos_2=this._target_object.getBellowPos(_rand2);
				else
					this._approach_taret_pos_2=this._target_object.getLeftPos(_rand2);
			*/
		}
		
		let _speed=this._behavior_params.speed;
		if(typeof _speed === 'function')_speed=_speed();
		this.look_at(this._approach_taret_pos_2);
		const _distance=this._approach_taret_pos_2.distanceTo(this.Position);
		//console.log(_distance);
		if(_distance>10){
			//this._model.position.copy(this._utils.translatePoint(this.Position.clone(),
				//this._target_object.Position.clone(),timeInSeconds*_speed));	
			
			this.move_forward(timeInSeconds*_speed);
		}
	}
	
	attack_target_1(timeInSeconds){	//lai gan tu tu
		if(!this._target_pos_to_attack||this._target_pos_to_attack===null){
			this._target_pos_to_attack=[
				(Math.random() * 145) + 45,
				(Math.random() * 145) + 45,
				(Math.random() * 145) + 45
			];
		}
		
		const _player_pos=this._target_object._model.position;
		const _player_direct=new THREE.Vector3();
		this._target_object._model.getWorldDirection(_player_direct);
			
		this._target_pos=this._utils.findPointB(_player_pos.x,_player_pos.y,_player_pos.z,
											-_player_direct.x,-_player_direct.y,-_player_direct.z,
											200);
		this._target_pos.x+=this._target_pos_to_attack[0];
		this._target_pos.y+=this._target_pos_to_attack[1];
		this._target_pos.z+=this._target_pos_to_attack[2];
		
		const _distance1=this._target_object.Position.distanceTo(this.Position);
		const _distance2=this._target_pos.distanceTo(this.Position);
		
		//const _rate=this._game._entities['_controls2']._acceleration.x/this._game._entities['_controls2']._origin_speed;
		
		if(_distance2<300){
			
			//do model 3D có tư thế default bị ngược
			let _pos=this._utils.calculateSymmetricPoint(this.Position,this._target_object.Position);
			this._model.lookAt(_pos);
			this._params.camera.lookAt(_pos);
			
			if(_distance1<this._behavior_params.shoot_distance){
				this.Fire();
				
			}
				//console.log("Distance="+_distance2);
			    
				const entityValues = Object.values(this._game._entities);
				const sphericalEntities = entityValues.filter(_object => _object._is_spherical_entity);
				for (const _object of sphericalEntities) {//để tránh trường hợp bay vào bên trong planet
					const _radius = _object.get_radius();
					const _distance = this._target_pos.distanceTo(_object.get_world_position());
					if (_distance < _radius + 10) {
						return;
					}
				}

				//const _step=_distance2/3;//càng tới gần thì càng chậm lại
				
				if(_distance2>this._behavior_params.min_distance)
				if(_distance2>this._behavior_params.speed2){
					this._model.position.copy(this._utils.translatePoint(this._model.position,
					this._target_pos,timeInSeconds*this._behavior_params.speed1));	
				}
				
			
		}
		else{
			
			this._model.position.copy(this._utils.translatePoint(this.Position,
				this._target_pos,timeInSeconds*(_distance2/4)));	
		}
	}
	
	attack_target_2(timeInSeconds){
		if(!this._inited_huting_params){
			this._inited_huting_params=true;
			
			this._stepX=0;
			this._stepY=0;
			this._stepZ=0;
			this._stepNum=10;
			const min = 0.02;
			const max = 0.1;
			
			const randomValue = Math.random();// Tạo một số ngẫu nhiên từ 0 đến 1
			this._direct = randomValue < 0.5 ? 1 : -1;// Quyết định giá trị là 1 hoặc -1
		}
		const _enemy_pos=this._params.model.position;
		const _distance=this._target_object._params.model.position.distanceTo(_enemy_pos);
		const _player_pos=this._target_object.get_world_position();
		const _player_direct=new THREE.Vector3();
		const _min_distance=270;
		
		if(this._lock_target===true&&_distance<=_min_distance){
			if(!this._lock_fire)
				this.look_at(_player_pos);
			
			this.Fire();
			
			if(typeof this._rot_direct==='undefined')
				this._rot_direct =this._game._utils.get_random_in_range(1,4);
				//this._rot_direct = Math.random() < 0.5;//true or false
			
			let _point1;
				if(this._rot_direct===1)
				  _point1=this._target_object.getFrontLeftPos(1000,300);
				else if(this._rot_direct===2)
				  _point1=this._target_object.getFrontRightPos(1000,300);
			    else if(this._rot_direct===3)
				  _point1=this._target_object.getFrontAbovePos(1000,300);
			    else
				  _point1=this._target_object.getFrontBellowPos(1000,300);
			  
			const _point2=this._game._utils.findPointOnLine(_enemy_pos, _point1, 1000);
			this._model.position.copy(this._game._utils.translatePoint(this._model.position,
			_point2,timeInSeconds*40));	
			
			
			
			/*
			if(!this._virtual_obj_trans){
				
				this._virtual_obj_trans=new THREE.Vector3(_enemy_pos.x-_player_pos.x,
														  _enemy_pos.y-_player_pos.y,
														  _enemy_pos.z-_player_pos.z);
			}
				
				const _dx=_enemy_pos.x-_player_pos.x;
				const _dy=_enemy_pos.y-_player_pos.y;
				const _dz=_enemy_pos.z-_player_pos.z;
			
				const _px=_enemy_pos.x+(this._virtual_obj_trans.x-_dx)+(timeInSeconds*this._game._utils.get_random_in_range(-5,5));
				const _py=_enemy_pos.y+(this._virtual_obj_trans.y-_dy)+(timeInSeconds*this._game._utils.get_random_in_range(-5,5));
				const _pz=_enemy_pos.z+(this._virtual_obj_trans.z-_dz)+(timeInSeconds*this._game._utils.get_random_in_range(-5,5));
				//const _py=_enemy_pos.y;
				//const _pz=_enemy_pos.z;
				this._model.position.set(_px,_py,_pz);
				//this.move_to_position(points[_counter],_speed,_fc2);
				*/
				
				return;
		}
		
		if(_distance<=_min_distance){
			this._lock_target=true;
			if(_distance<=_min_distance*3/4){
				const _t_pos=this.get_back_point(5000);
				this._model.position.copy(this._utils.translatePoint(this._model.position,
				_t_pos,timeInSeconds*5));	
			}
		}
		else{
			this.look_at(_player_pos);
			this.move_forward(timeInSeconds*this._behavior_params.speed1);
		}
		
		
	}
	
	
}
export{Spacecraft};