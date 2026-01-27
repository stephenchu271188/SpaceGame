import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {SpaceShip} from './space-ship.js';
const _radius=800;
let _ship_id=0;
class SimplePhotonShip4 extends SpaceShip {
	
	constructor(params){
		params.laser_color=new THREE.Color(247, 10, 2);
		params.shoot_delay=0.5;//thời gian delay giữa 2 lần bắn
		
		params.health=params.game._parameters._standard_hp/2;
		params.damage=params.game._parameters._standard_hp/80;
		//params.attack_radius=_radius;
		params.blaster_radius=6;
		
		super(params);
		
		this._bound_radius=0.5;
		this._firing=false;
		this.add_to_after_dead_function_list(()=>{
			this._game._graphics.remove_laser(this._laserObject3D);
		});
		this._counter1=0;
		this._lock_2=false;
		
		this._laser_counter=0;
		
		_ship_id++;
		this._t_ship_id=_ship_id;
		
		this._laser_range=20;//pham vi anh huong cua laser
		this._laser_speed=200;
	}
	
	hide_laser(){
		this._game._graphics.hide_laser(this._laserObject3D);
	}
	show_laser(){
		
		if(!this._laserObject3D){
			const _item=this._game._graphics.create_laser("white");
		
			if(typeof _item==='undefined'||_item===null){
				this._firing=false;
				return;
			}
		
			this._laserObject3D=_item[1];
			this._laser2=_item[2];
		}	
		
		this._game._graphics.show_laser(this._laserObject3D);
		//this._change_laser_color("blue");
	}
	launch_photon(_shipclass,_level,_color){//nhieu tia sang photon huong ve phia truoc
		//if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			//_shipclass._game._client.add_action("additional_generate_multi_photon_1");
		//}
		//try{
		const _burst_num=3;
		const _num_in_burst=2;
		const _photon_num=_burst_num*_num_in_burst+4;
		
		if(typeof this._applying_generate_multi_photon_1==='undefined'){
			this._applying_generate_multi_photon_1=false;
			this._add_skill_multi_photon_1_elements=new Array();
			for(let i=0;i<_photon_num;i++){
				const _element=_shipclass._game._graphics.create_laser("white");
				if(typeof _element==='undefined'||_element===null){
					return;
				}
				this._add_skill_multi_photon_1_elements.push(_element);
			}
			
			this.add_to_after_dead_function_list(()=>{
				for(let i=0;i<this._add_skill_multi_photon_1_elements.length;i++){
					const _element=this._add_skill_multi_photon_1_elements[i];
				    let _laserObject=_element[1];
					let _laserRay=_element[2];
					this._game._graphics.remove_laser(_laserObject);
					_laserRay.change_color(_laserObject._origin_color);
				}
			});
		}
		
		if(this._applying_generate_multi_photon_1===true)
			return;
		this._applying_generate_multi_photon_1=true;
		
		let _duration=4;
		let _speed=100;
		//let _damage=800;
		    //_damage+=(Math.ceil(_level/10))*10;
			//console.log("Damage="+_damage);
		let _size;
		if(_shipclass===_shipclass._game._me)
			_size=0.05;//nhin tu vi tri cua player se lon' hon
		else
			_size=0.15;
		let _ray_length=20;
		let _counter=0;
		
		//let _far_pos=_shipclass.getFrontPos(5000);
		let _pos_id=0;
		
		let _create_laser=()=>{
			
			this._laser_counter++;
			let _laser_id=this._laser_counter;
			
			let _pos1;
			_pos_id++;
			if(_pos_id>_num_in_burst)_pos_id=1;
			if(_pos_id===1)_pos1=_shipclass.getFrontLeftPos(5,3);
			if(_pos_id===2)_pos1=_shipclass.getFrontRightPos(5,3);
			//if(_pos_id===2)_pos1=_shipclass.getFrontPos(5);
			//if(_pos_id===3)_pos1=_shipclass.getFrontRightPos(5,3);
		
			let _pos2=_shipclass.getFrontPos(5000);
		
			const _element=this._add_skill_multi_photon_1_elements[_counter];
			_counter++;
			if(typeof _element==='undefined'||_element===null)return;
			
			let _laserObject=_element[1];
			let _laserRay=_element[2];
			
			_laserObject._unit=_shipclass;
			
			_shipclass._game._graphics.show_laser(_laserObject);
			_laserObject.scale.x=_size;
			_laserObject.scale.y=_size;
			_laserObject.scale.z=_ray_length;
			_laserObject.position.copy(_pos1);
			_laserObject.lookAt(_pos2);
			_laserRay.change_color(_color[_pos_id-1]);
			let _lock_auto_aim=false;
			let _aim_pos=null;
			let _update=(t)=>{
				
				if(_shipclass._target_object&&!_shipclass._target_object.Dead){
					const _pos_1=_shipclass._target_object.Position;
					const _pos_2=_laserObject.position;
					const _tdistance=_pos_1.distanceTo(_pos_2);
					
					if(_tdistance<50){
						_lock_auto_aim=true;//khi lai gan se ko aim vao target nua
					}
					
					if(!_lock_auto_aim){
						_laserObject.lookAt(_pos_1);
						_shipclass._game._utils.translateObject(_laserObject,_pos_1,t*_speed);
					}
					else{
						if(_aim_pos===null)
							_aim_pos=this._game._utils.findPointOnLine(_pos_2,_pos_1,2000);
						
						_laserObject.lookAt(_aim_pos);
						_shipclass._game._utils.translateObject(_laserObject,_aim_pos,t*_speed);
					}
				}
				else{
					_shipclass._game._utils.translateObject(_laserObject,_pos2,t*_speed);
				}	
				
				const _laserStartPos=_laserObject.position;
				//const _targets=this._game._unitMG.get_enemy_combat_unit_in_range_3(_shipclass,_laserStartPos,_ray_length);
				const _targets=[[this._game._me,100]];
				if(_targets.length>0){//alert("Count="+_targets.length);
				for(let i=0;i<_targets.length;i++){
					const _target=_targets[i][0];
					if(typeof _target._hited_by_simple_photon_ship_4==='undefined'){
						_target._hited_by_simple_photon_ship_4=new Array();
					}
					else{
						let _found=false;
						for(let j=0;j<_target._hited_by_simple_photon_ship_4.length;j++){
							if(_target._hited_by_simple_photon_ship_4[j].ship_id===this._t_ship_id&&
							_target._hited_by_simple_photon_ship_4[j].laser_id===_laser_id){
								//alert("FOUND");
								_found=true;
								break;
							}
								
						}
						if(_found)continue;
					}
					const _pos=_target.Position;
					const _laserEndPos=_shipclass._game._utils.findPointOnLine(_laserStartPos,_pos2,_ray_length);//diem cuoi cua laser
					const _d1=_pos.distanceTo(_laserStartPos);
					const _d2=_pos.distanceTo(_laserEndPos);
					if(_d1+_d2<_ray_length+this._laser_range){
						//_target.Take_Damage(_shipclass,_shipclass.constructor.name,null,t*_damage);
						_target.Take_Damage(_shipclass,_shipclass.constructor.name,null,this._damage);
						_target._hited_by_simple_photon_ship_4.push({ship_id:this._t_ship_id,laser_id:_laser_id});
					}
				}};
			};
			
			_shipclass._game.add_to_update_function_list(_update);
			
			_shipclass._game.add_to_timer(()=>{
				_shipclass._game.remove_function_from_update_list(_update);
				_shipclass._game._graphics.hide_laser(_laserObject);
				_laserRay.change_color(_laserObject._origin_color);
			},_duration);
			
		};
		let _burst=()=>{
			if(_shipclass.Dead)return;
			_create_laser();
			_create_laser();
			_create_laser();
			
			this._game._sound.playSound('burst-laser-1',_shipclass);
		};
		
		let _delay=1;
		_burst();
		_shipclass._game.add_to_timer(()=>{_burst();},_delay);
		_shipclass._game.add_to_timer(()=>{_burst();},_delay*2);
		_shipclass._game.add_to_timer(()=>{
			this._applying_generate_multi_photon_1=false;
		},4);
		
		//}catch(e){alert(e.stack);}
	}
	Fire(){//overwrite
		//if(!this._target_object||this._target_object===null||this._target_object.Dead)
			//return;
		
		//if(this._firing)return;
		//this._firing=true;
		
		const _level=this._ship_package.get_ship_level();
		if(!this._photon_color)this._photon_color=["white","white"];
		this.launch_photon(this,_level,this._photon_color);
		
		//this._game.add_to_timer(()=>{
			//this._firing=false;
		//},4);
	}
	/*
	CheckTarget(timeInSeconds){
		
		if(!this._target_object||this._target_object===null||this._target_object.Dead){
			this._firing=false;
			
			let _target,_distance;
			
			for(let i=0;i<this._game._unitMG._full_unit.length;i++){
				_target=this._game._unitMG._full_unit[i];
				if(_target.Dead)continue;
				if(_target._player_id===this._player_id)continue;
				_distance=_target.Position.distanceTo(this.Position);
				if(_distance<=_radius){
					this._target_object=_target;
					break;
				}
			}
			
			return;
		}
		
		//this._model.lookAt(this._target_object.Position);
		
	}
	*/
}

export {SimplePhotonShip4}