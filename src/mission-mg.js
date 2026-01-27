import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/loaders/GLTFLoader.js';

import {Utils} from './units/utils.js';
import {agent} from './agent.js';

import {MissionList} from './mission-list.js';

import {MissionDataMG} from './mission-data.js';

import {SpaceShip6} from './units/space-ship-6.js';

//import {Earth} from './core/earth.js';
//import {SolarSystem} from './core/solar-system.js';


const _NUM_BOIDS = 100;
const _BOID_SPEED = 50;
const _BOID_ACCELERATION = _BOID_SPEED / 2.5;
const _BOID_FORCE_MAX = _BOID_ACCELERATION / 20.0;
const _BOID_FORCE_ORIGIN = 50;
const _BOID_FORCE_ALIGNMENT = 10;
const _BOID_FORCE_SEPARATION = 20;
const _BOID_FORCE_COLLISION = 50;
const _BOID_FORCE_COHESION = 5;
const _BOID_FORCE_WANDER = 3;

let _container=null;
//let _stop_mission=true;

class MissionMG{//Tạo và quản lý các nhiệm vụ
	constructor(params){
		this._params=params;
		this._game=params.game;
		
		this._unit_list=new Array();
		this._mission_id=null;
		this._mission_data=null;
		
		this._utils=new Utils();
		this._mission_complete_fc=function(){};
		//_stop_mission=false;
		
		this._player_mission_data=new MissionDataMG({game:this._game});
		//this._player_mission_data=this._game._player_mission_data;
		//this._player_mission_data=params.player_mission_data;
		this._player_mission_data.load_data();//***Can xem xet tinh huong khi mission-data chua kip load ma mission da bat dau
		
		this._game.add_to_update_function_list(()=>{
			if(this._mission_id!=null){
				if(this._mission_id===1){
					this.update_mission_1(timeInSeconds);
				}
				if(this._mission_id===3){
					
				}
			}
		});
	}
	/*
	Update(timeInSeconds){
		if(this._mission_id!=null){
			if(this._mission_id===1){
				this.update_mission_1(timeInSeconds);
			}
			if(this._mission_id===3){
				
			}
		}
	}
	*/
	create_option(universe,fc_list){//Hien tai dang de auto click vao mission2
		if(_container!=null)return;
		
		_container=document.createElement("div");
		_container.style.position="absolute";
		_container.style.width="60%";
		_container.style.height="40%";
		_container.style.left="20%";
		_container.style.top="20%";
		_container.style.textAlign="center";
		_container.style.backgroundColor="rgba(0,0,0, 0.7)";
		_container.style.border="2px turquoise solid";
		_container.style.borderRadius="5px";
		_container.style.zIndex="9999999999";
		_container.style.boxShadow="0 0 10px 5px #33BBFF";
		
		_container.innerHTML+="<br/><br/>";
		
		let _num=fc_list.length;
		for(let i=0;i<_num;i++){
			let _mission_frame=document.createElement("div");
			_mission_frame.style.width="120px";
			_mission_frame.style.height="120px";
			_mission_frame.style.backgroundColor="rgba(0,0,0, 0.4)";
			_mission_frame.style.border="2px turquoise solid";
			_mission_frame.style.borderRadius="5px";
			_mission_frame.style.textAlign="center";
			_mission_frame.style.display="inline-block";
			_mission_frame.style.marginRight="50px";
			_mission_frame.style.color="white";
			_mission_frame.style.backgroundImage = 'url("resources/icons/mission'+(i+1)+'.png")'; 
			_mission_frame.style.backgroundSize = 'contain';
			_mission_frame.style.boxShadow="0 0 10px 5px #33BBFF";
			//_mission_frame.style.verticalAlign="middle";
			
			_mission_frame.innerHTML="Mission "+(i+1);
			
			_mission_frame.addEventListener("click",()=>{
				_container.remove();
				_container=null;
				fc_list[i]();
				
				//this.universe(i+1,universe,);
			});
			
			_container.appendChild(_mission_frame);
			
			if(i===1){
				try{
					_container.remove();
				_container=null;
				fc_list[i]();
				return;
				}
				catch(e){};
			}
		}
		
		let _close=document.createElement("button");
		_close.innerHTML="X";
		_close.style.position="absolute";
		_close.style.top="0px";
		_close.style.right="0px";
		_close.style.width="30px";
		_close.style.height="30px";
		_close.style.backgroundColor="white";
		//_close.style.color="white";
		_container.appendChild(_close);
		_close.addEventListener("click",()=>{
			_container.remove();
			_container=null;
		});
		
		document.body.appendChild(_container);
	}
	
	init_mission(id,_universe,_fc,_stop_mission_fc){
		this._mission_id=id;
		
		this._stop_mission_fc=_stop_mission_fc;
		this._unit_list=new Array();
		
		for(let i=0;i<this._unit_list.length;i++){
			this._game._RemoveEntity_ByValue(this._unit_list[i]);
		}
		this._unit_list=new Array();
		this._mission_data={};
		
		try{
		if(id===1){
			this.init_mission_1(_universe);
			this.init_mission_step_2(_fc);
		}
		if(id===2){
			
			//alert(this._player_mission_data.get_mission_2_data());
			const _mission_list=new MissionList({game:this._game,data:this._player_mission_data.get_mission_2_data()});
				_mission_list.create_list(()=>{
					let _missionLevel=localStorage.getItem("mission-level");
					if(typeof _missionLevel==='undefined'||_missionLevel===null)
						_missionLevel=1;
					this._missionLevel=parseInt(_missionLevel);
					if(this._player_mission_data._mission2.passed_level(this._missionLevel))
						this._replay_mission_2_level=true;
					else
						this._replay_mission_2_level=false;
					//alert(_missionLevel);
					this.init_mission_step_2(_fc);
					this.init_mission_2();
					try{// để ko xảy ra lỗi khi thay đổi bên file game class
					//this._game._mission_icon.remove();
					//this._game._entities["_controls2"]._move.fire=true;
					//this._game.remove_message_icon();
					}catch(e){alert(e.stack);}
				});
			
		}
			
		if(id===3){
			this.init_mission_3();
			this.init_mission_step_2(_fc);
		}
			
		}catch(e){alert(e.toString());alert(e.stack);}	
		
		
		
	}
	
	init_mission_step_2(_fc){
		let _stop_btn=document.createElement("img");
		_stop_btn.style.width="50px";
		_stop_btn.style.height="50px";
		_stop_btn.style.position="absolute";
		_stop_btn.style.bottom="30px";
		_stop_btn.style.left="49%";
		_stop_btn.src="./resources/icons/stop.png";
		//document.body.appendChild(_stop_btn);
		_stop_btn.addEventListener("click",()=>{
			_stop_btn.remove();
			//_stop_mission=true;
			this._mission_complete_fc=function(){};
			this._stop_mission_fc();
		});
		
		let _startTime=performance.now();//thoi diem bat dau mission(de tinh' diem?)
		this._game._me._lock_speed_up_skill=true;
		this._mission_complete_fc=()=>{
			this._game._graphics.create_divider(this._game._root_div,"rgba(0, 0, 0, 0.1)");
			let _finishTime=performance.now();//thoi diem finish mission
			const _totalTime=_finishTime-_startTime;//tong? thoi gian hoan thanh mission(second)
			this.calculate_result(_totalTime);
			
			_stop_btn.remove();
			_fc();
			this._game._me._lock_speed_up_skill=false;
			//this._game._me._inventory.save_data();
		};
	}
	
	calculate_result(_totalTime){
		const _minutes=(_totalTime/1000)/60;
		let _star_num=0;
		if(_minutes<10)_star_num=1;
		if(_minutes<5)_star_num=2;
		if(_minutes<3)_star_num=3;
		
		let _lucky_wheel_turn_num=0;
		//let _infinity_stone_num=0;
		if(_star_num===1){
			_lucky_wheel_turn_num=this._game._parameters._mission_2_lucky_wheel_turn_num_reward[0];
		}
		if(_star_num===2){
			_lucky_wheel_turn_num=this._game._parameters._mission_2_lucky_wheel_turn_num_reward[1];
		}
		if(_star_num===3){
			_lucky_wheel_turn_num=this._game._parameters._mission_2_lucky_wheel_turn_num_reward[2];
		}
		this._game._item_package.add_item(-1,_lucky_wheel_turn_num);
		
		this._mission_2_reward_item_num=_lucky_wheel_turn_num;
		this._mission_2_reward_item_name="lucky wheel turns";
		
		this._player_mission_data.finish_level_mission(this._mission_id,this._missionLevel,_star_num);
	}
	
	clear_enemy_ships(){
		for(let i=0;i<this._unit_list.length;i++){
			let _ship=this._unit_list[i];
			_ship.remove();
			this._game._graphics.Scene.remove(this.cruiser);
		}
		this._unit_list=new Array();
	}
	
	init_mission_1(_universe){//Nhiem vu tieu diet doan quan van tai?
		//Đầu tiên tìm trong data 1 starsystem ngẫu nhiên thỏa mãn điều kiện(đây chỉ là data)
		//Sau đó move player đến vị trí starsystem để hệ thống tự động create starsystem
		//Sau đó tìm class starsystem nào thỏa mãn điều kiện(có thể là system tương ứng với data vừa tìm được cũng có thể system khac cũng đủ điều kiện)
		const min_planet_num=2;
		const _randomStarsystem=_universe.get_current_galaxy().get_random_starsystem_data_with_condition_1(min_planet_num);
		if(_randomStarsystem===null){
			alert("Something went wrong. Can not find star system!");
			return false;//ko co ket qua
		}
		
		const _data=_randomStarsystem[0];//alert(_data.position[0]);
		const _system_id=_data.id;
		const _system_array_id=_randomStarsystem[1];//id trong array
		const _star_id=_randomStarsystem[2];//id(trong array starList) cua star co chua so luong planet nhu yeu cau
		
		const _pos=_data.starList[0].position;
		const _starradius=_data.starList[0].radius*this._game._config.magnification_factor;
		//alert();
		const _px=_pos[0]*this._game._config.magnification_factor;
		const _py=_pos[1]*this._game._config.magnification_factor;
		const _pz=_pos[2]*this._game._config.magnification_factor;//alert(_px);alert(_py);alert(_pz);
		this._game._entities['player']._model.position.set(_px,_py+_starradius+100,_pz);
		_universe.get_current_galaxy().create_neighboring_star_systems(new THREE.Vector3(_px,_py,_pz),15000);
		
		const _result=_universe.get_current_galaxy().get_random_starsystem_class_with_condition_1(min_planet_num);
		const _star_system=_result[0];
		const _star=_result[1];
		const _planet1=_star._planet_list[0];
		const _planetPos1=_planet1.get_world_position();
		const _planet2=_star._planet_list[1];
		const _planetPos2=_planet2.get_world_position();
		
		this._game._entities['player']._model.position.set(_planetPos1.x,_planetPos1.y+_planet1.get_radius()+100,_planetPos1.z);
		
		//Khi dịch chuyển player đến gần planet thì sẽ tự động create base rồi
		//Nhưng gọi lại cho chắc chắn
		this._game._baseMG.create_base_for_planet(_planet1);
		this._game._baseMG.create_base_for_planet(_planet2);
		
		const _base_list_1=this._game._baseMG.get_planet_base_list(_planet1);
		const _base_list_2=this._game._baseMG.get_planet_base_list(_planet2);
		
		const _base_1=_base_list_1[0];
		const _base_2=_base_list_2[0];
		
		//const _distance=_base_1.get_world_position().distanceTo(_base_2.get_world_position());
		const _transport_unit_num=20;//so luong cac unit van tai
		const _points=findPointsOnLine(_base_1.get_world_position(),_base_2.get_world_position(),
										_transport_unit_num);//cac diem nam giua 2 base
							
		const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 							
		for(var i=0;i<_points.length;i++){
			let _point=_points[i];
			//let geometry = new THREE.SphereGeometry( 30, 32, 16 ); 
			//let sphere = new THREE.Mesh( geometry, material ); 
			//this._game._graphics.Scene.add( sphere );
			//sphere.position.copy(_point);
			let _ship=this._game._unitMG.create_enemy_transport_ship_1(_point);
			_ship._direct=true;
			this._game._graphics.Scene.add(_ship._model);
			
			this._unit_list.push(_ship);
		}
		this._game._me._model.position.set(_points[10].x,_points[10].y+60,_points[10].z);
		this._game._me._model.lookAt(_base_1.get_world_position());
		
		this._mission_data['units']=this._unit_list;
		this._mission_data['start-position-1']=_base_1.get_world_position();
		this._mission_data['end-position-1']=_base_2.get_world_position();
	}
	
	update_mission_1(timeInSeconds){
		
		
		let _unit,_target_point;
		let _found=false;
		for(let i=0;i<this._mission_data['units'].length;i++){
			_unit=this._mission_data['units'][i];
			if(_unit.Dead)continue;
			
			_found=true;
			
			if(_unit._direct===true){
				_target_point=this._mission_data['end-position-1'];
			}
			else{
				_target_point=this._mission_data['start-position-1'];
			}
			
			_unit._model.lookAt(_target_point);
			_unit._model.position.copy(this._utils.translatePoint(_unit._model.position,
									  _target_point,timeInSeconds*20));	
			
			if(_unit._model.position.distanceTo(_target_point)<30){
				_unit._direct=!_unit._direct;
			}
		}
		
		if(!_found){//toan bo unit da bi tieu diet - Mission Complete
			this._mission_complete_fc();
			this._mission_complete_fc=function(){};
		}
	}
	
	init_mission_2(){
		this._game._me._lock_speed_up_skill=true;
		this._game._gear_box.switch_gear_by_title("P");
		this._game._gear_box.switch_gear_by_title("G");
		this._game._gear_box.switch_gear_by_title(1);
		this._game._gear_box._lock_parking_mode=true;
		this._game._gear_box.hide_panel();
		this._game._gear_box._lock=true;
		this._game.move_to_earth();
		
		
		let _mission_type;
		if(this._missionLevel>15){
		if(this._missionLevel%2!=0)
			_mission_type=1;//1 so enemy-ship se tan' cong ve tinh
		else
			_mission_type=2;//them nhiem vu danh' chan ten lua cua ke dich
		}
		_mission_type=null;
		
		const _min_wave_num=1;
		const _max_wave_num=2;
		const _min_visible_num=8;
		const _max_visible_num=12;
		
		let _visible_num=_min_visible_num+Math.floor(this._missionLevel/10);
		if(_visible_num>_max_visible_num)_visible_num=_max_visible_num;
		
		let _wave_num=_min_wave_num+Math.floor(this._missionLevel/12);
		if(_wave_num>_max_wave_num)_wave_num=_max_wave_num;
		
		let _total_num=_wave_num*_visible_num;
		
		
		let _attack_satellite_ship_num=0;//so tau cua ke dich se tan' cong cac ve tinh
		
		let _init_fc_1=()=>{};
		let _init_fc_2=()=>{};
		
		this._game._sound.play("alarm1");
		
		if(_mission_type===1){
			this._game.show_message_box_2('notice','New Mission!',
			"Destroy enemy ships and protect earth's satellites",10);
			_attack_satellite_ship_num=0;
			
		}
		if(_mission_type===2){
			this._game.show_message_box_2('notice','New Mission!',
			"Destroy enemy ships and intercept their missiles to protect the base",10);
			_attack_satellite_ship_num=0;
			
			
			_init_fc_1=()=>{
				
				let _time_container=document.createElement("div");
				_time_container.style.position="absolute";
				_time_container.style.width="50px";
				_time_container.style.left="47%";
				_time_container.style.top="10%";
				_time_container.style.textAlign="center";
				_time_container.style.color="white";
				_time_container.style.zIndex="999999";
				_time_container.style.fontSize="30px";
				document.body.appendChild(_time_container);
				
				const _m_pos1=this._game._me.get_ahead_point(12000);//phai dam bao player-ship dang nhin ve huong trai dat
				let _missile=this._game._unitMG.create_cruise_missile_2(_m_pos1);
				_missile._speed=10;
				_missile._is_enemy=true;
				_missile._target_object=this._game._service_base;
				this._game._graphics.Scene.add(_missile._model);
				
				const material = new THREE.LineBasicMaterial({
					color: 0xffffff
				});
				const points = [];
				points.push( _missile.Position );
				points.push( this._game._service_base.get_world_position() );
				const geometry = new THREE.BufferGeometry().setFromPoints( points );
				let line = new THREE.Line( geometry, material );
				this._game._graphics.Scene.add( line );
			
				let _countdown_fc=()=>{
					const _distance=parseInt(_missile.Position.distanceTo(this._game._service_base.get_world_position()));
					_time_container.innerHTML =_distance-50;
					
					if(_distance<50){
						_missile.SelfDestroy();
					}
				};
				_missile.add_to_after_dead_function_list(()=>{
					this._game.remove_function_from_list_3(_countdown_fc);
					_time_container.remove();
					this._game._graphics.Scene.remove( line );
				});
				this._game.add_to_function_list_3(_countdown_fc);
			};
			
		}
		
		if(_attack_satellite_ship_num>=_visible_num){
				alert('so tau tan cong ve tinh khong duoc nhieu hon tong so tau');
		}
		
		let _loading_icon=this._game._graphics.createLoadingIcon(1);
		this._game._root_div.appendChild(_loading_icon);
			
			let _unit_counter=0;
			let _level=1;
		    //try{
			
			//}catch(e){alert(e.stack);}
			let _init_enemies=()=>{
				if(_loading_icon!=null){
					_loading_icon.remove();
					_loading_icon=null;
				}
				_init_fc_1();
				_init_fc_2();
			
			let _all_enemy_units=this._game._unitMG.get_all_other_team_unit(this._game._playerID);
				
					for(let i=0;i<_all_enemy_units.length;i++){
						const _t_unit=_all_enemy_units[i];
						if(_t_unit.Dead||_t_unit._is_cruise_missile)continue;
						//_t_unit.show_2D_position_on_screen();//<=================
						
						const _t_pos=this._game._init_player_pos.clone();
						_t_pos.x+=(Math.random() * 450) + 150;
						_t_pos.y+=(Math.random() * 450) + 150;
						_t_pos.z+=(Math.random() * 450) + 150;
						
						_t_unit._model.position.copy(_t_pos);
						
						const _earth_pos=this._game._solar_system._earth.get_world_position();
						const _distance=_earth_pos.distanceTo(_t_unit._target_object.Position);
						const _new_pos=this._game._utils.findPointOnLine(_earth_pos,_t_unit._target_object.Position, _distance+30);
						
						if(i<_attack_satellite_ship_num){
							_t_unit._target_object=this._game._solar_system.get_random_satellite();
							_t_unit.start_attack_satellite_behavior_1();
						}				
						else{
							_t_unit.start_hunting_behavior_1();
						}
							
						
					}
			}		
			this._game._unitMG.add_computer_enemy_units(_visible_num,this._missionLevel,_init_enemies);
			//_init_enemies();
			
			let _finish_fc=()=>{
				_loading_icon=this._game._graphics.createLoadingIcon(1);
			    this._game._root_div.appendChild(_loading_icon);
				_unit_counter+=_visible_num;
				if(_unit_counter<_total_num){
					
					this._game._unitMG.add_computer_enemy_units(_visible_num,this._missionLevel,_init_enemies);
					this._game._unitMG._all_enemy_combat_unit_dead=_finish_fc;
					
					_init_enemies();
					
					return;
				}
				else{
					this._game._unitMG._all_enemy_combat_unit_dead=function(){};
					
					this._mission_complete_fc();
					this._mission_complete_fc=function(){};
					//this._game._me._lock_speed_up_skill=false;
					return;
				}
			}
			this._game._unitMG._all_enemy_combat_unit_dead=_finish_fc;
			this._game._solar_system._after_all_earth_satellites_destroyed=()=>{
				//this._game.createMessageBox("Mission failed!","All earth's satellites have been destroyed.");
				//this._game._StopRender();
			};
	}
	
	init_mission_3(){
		
		this._time_container=document.createElement("div");
		this._time_container.style.position="absolute";
		this._time_container.style.width="50px";
		this._time_container.style.left="47%";
		this._time_container.style.bottom="80%";
		this._time_container.style.textAlign="center";
		this._time_container.style.color="white";
		this._time_container.style.zIndex="999999";
		this._time_container.style.fontSize="30px";
		
		document.body.appendChild(this._time_container);
		let remainingTime = 120;//second
		
		let _countdown_fc=()=>{
			const minutes = Math.floor(remainingTime / 60);
			const seconds = remainingTime % 60;
			
			this._time_container.textContent =`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
			if (remainingTime <= 0) {
				this._game.remove_function_from_list_1(_countdown_fc);
				this._time_container.remove();
				this.finish_mission_3();
			} else {
				remainingTime--;
			}
		};
		this._game.add_to_function_list_1(_countdown_fc);
		
		if(this._game._library['tie-fighter'])//da load roi
			this._CreateEnemyShips();
		else
			this.mission_3_load_child_ship_model();
		
	}
	mission_3_load_child_ship_model(_fc){
		let loader = new GLTFLoader();
		loader.setPath('./resources/models/tie-fighter-gltf/');
		loader.load('scene.gltf', (obj) => {
		// This is bad, but I only want the mesh and I know this only has 1.
		// This is what you get when you don't have an art pipeline and don't feel like making one.
			obj.scene.traverse((c) => {
				if (c.isMesh) {
				const model = obj.scene.children[0];
				model.scale.setScalar(0.15);
				model.rotateX(Math.PI);

				const mat = new THREE.MeshStandardMaterial({
					map: new THREE.TextureLoader().load(
						'./resources/models/tie-fighter-gltf/textures/hullblue_baseColor.png'),
					normalMap: new THREE.TextureLoader().load(
						'./resources/models/tie-fighter-gltf/textures/hullblue_normal.png'),
				});

				model.material = mat;

				this._game._library['tie-fighter'] = model;
				}

				if (this._game._library['tie-fighter']) {
					//this._CreateEnemyShips();
					//try{
					//_fc();
						//this._CreateEnemyShips();
						this.mission_3_load_mother_ship_model();
					//}catch(e){alert(e.toString());}
				}
				});
		});
	}
	mission_3_load_mother_ship_model(_fc){
		let loader = new GLTFLoader();
      loader.setPath('./resources/models/star-destroyer/');//<=tau me
      loader.load('scene.gltf', (gltf) => {
        const model = gltf.scene.children[0];
        model.scale.setScalar(20.0);
        model.rotateZ(Math.PI / 2.0);
		this._mother_ship_model=model;
		this._CreateEnemyShips();
	  });
	}
	
	get_mission_3_result_rate(){
		return (this._mission3_counter/_NUM_BOIDS);
	}
	finish_mission_3(){
		this.clear_enemy_ships();
		
		//this._enemy_ships=new Array();
		//alert("KILL:"+this._mission3_counter);
		this._mission_complete_fc();
	}
	
	_CreateEnemyShips(){
	
	this._mission3_counter=0;
		
    const positions = [
      new THREE.Vector3(8000, 5000, 0),
      new THREE.Vector3(-7000, 50, -100),
    ];
    const colours = [
      new THREE.Color("yellow"),
      new THREE.Color(0.5, 0.5, 4.0),
    ];
	
	this._game._me._model.position.set(8000, 5000, -1200);
	this._game._me._model.lookAt(new THREE.Vector3(8000, 5000, -5000));

    //for (let j = 0; j < 1; j++) {
      const p = positions[0];


        this.cruiser = this._mother_ship_model;
        this.cruiser.position.set(p.x, p.y, p.z);
        this.cruiser.castShadow = true;
        this.cruiser.receiveShadow = true;
        this.cruiser.updateWorldMatrix();
        this._game._graphics.Scene.add(this.cruiser);
      //});

      for (let i = 0; i < _NUM_BOIDS; i++) {
        let params = {
          mesh: this._game._library['tie-fighter'].clone(),//<=tau con
          speedMin: 1.0,
          speedMax: 1.0,
          speed: _BOID_SPEED,
          maxSteeringForce: _BOID_FORCE_MAX,
          acceleration: _BOID_ACCELERATION,
          seekGoal: p,
          colour: colours[0],
        };
    
        const e = new agent.Agent(this._game, params);
		e._after_dead_fc=()=>{
			this._mission3_counter++;
		};
        this._game._entities['_boid_' + this._game.GetUniqueID()] = e;
		
		this._unit_list.push(e);
      }
      
    //}
  
	}
	
	//---------------------
	
}

//Cho diem A va B, tinh toa do cac diem nam tren duong thang AB sao cho khoang cach
//giua 2 diem lien tiep nhau la khong doi
function findPointsOnLine(A, B, numPoints) {
  const points = [];
  
  // Tính vector chỉ phương của đường thẳng AB
  const directionVector = {
    x: B.x - A.x,
    y: B.y - A.y,
    z: B.z - A.z,
  };
  
  // Tính khoảng cách giữa hai điểm A và B
  const distance = Math.sqrt(
    Math.pow(directionVector.x, 2) +
    Math.pow(directionVector.y, 2) +
    Math.pow(directionVector.z, 2)
  );
  
  // Tính khoảng cách cố định giữa các điểm
  const stepSize = distance / (numPoints - 1);
  
  // Tạo các điểm nằm trên đường thẳng AB
  for (let i = 0; i < numPoints; i++) {
    const t = i / (numPoints - 1);
	/*
    const point = {
      x: A.x + t * directionVector.x,
      y: A.y + t * directionVector.y,
      z: A.z + t * directionVector.z,
    };
	*/
	const x=A.x + t * directionVector.x;
	const y=A.y + t * directionVector.y;
	const z=A.z + t * directionVector.z;
    points.push(new THREE.Vector3(x,y,z));
  }
  
  return points;
}

export{MissionMG}