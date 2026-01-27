import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {SpaceShip} from './space-ship.js';
import {MotherShip} from './mother-ship.js';

const _radius=220;
const _max_distance=600;//khoang cach toi da tu great-mother-ship toi mother-ship
class GreatMotherShip extends SpaceShip{
	constructor(params){
		params.health=3000;
		params.damage=0;
		super(params);	
		
		this._max_distance=_max_distance;
		this._last_pos=this.get_world_position();
		//this._mother_ship_num=4;
		this._mother_ships=new Array();
		//this.init_mother_ships();
		
		this._is_great_mother_ship=true;
		
		this._game.add_to_update_function_list((timeInSeconds)=>{
			this._update(timeInSeconds);
		});
		
		this._lock=false;
	}
	
	init_mother_ships(_unit_id_list,_child_ship_stores){
		this._last_pos=this.get_world_position();
		const _center_pos=this.get_world_position();
		
		for(let i=0;i<_unit_id_list.length;i++){
			const _tpos=new THREE.Vector3(_center_pos.x+_radius,_center_pos.y,_center_pos.z);
			let _theta=(Math.PI*2)/_unit_id_list.length;
				_theta*=i;
			
			const _mother_ship_id=_unit_id_list[i];
			const _type_id=this._game._parameters.get_mother_ship_type_id_by_ship_id(_mother_ship_id);
			const _create_fc=this._game._warehouse2.get_create_mother_ship_fc(_type_id);
			const _mother_ship=_create_fc(_tpos);
			//const _mother_ship=this._game._unitMG.create_mother_heating_ship_1(_tpos);
			//_mother_ship._show_laser_connect_great_mother_ship=false;
			_mother_ship._player_id=this._player_id;
			if(this._game._playerID===this._player_id){
				_mother_ship.set_mother_ship_id(parseInt(_mother_ship_id));
				_mother_ship.load_child_ship_store();
				
				//_mother_ship._ship_package.set_ship_level(99);
				//_mother_ship.apply_space_ship_level_package();
				//_mother_ship.change_child_ships_level(99);
			}
			else{
				if(this._game._game_mode===this._game._parameters._game_mode_PvC){
					let _unit_level=this._game._level_infor.get_current_unit_level();
					const _child_types=this._game._level_infor.get_current_child_types();
					const _child_type=_child_types[i];
					const _child_nums=this._game._level_infor.get_current_child_nums();
					const _child_num=_child_nums[i];
					
					_mother_ship._ship_package.set_ship_level(_unit_level);
					_mother_ship.apply_space_ship_level_package();
					_mother_ship.create_enemy_child_ship_store_1(_child_type,_child_num);
					_mother_ship.change_child_ships_level(_unit_level);
				}
				else{
					_mother_ship.set_mother_ship_id(parseInt(_mother_ship_id));
					if(_child_ship_stores){
						_mother_ship.set_child_ship_store(_child_ship_stores[i]);
					}
				}
			}
			_mother_ship.init_legion_ships();
			this._game._graphics.Scene.add(_mother_ship._model);
			this._utils.rotateAboutPoint(_mother_ship._model, _center_pos,this._utils.axisY,_theta,true);
			
			this._mother_ships.push(_mother_ship);
			_mother_ship._greate_mother_ship=this;
		}
	}
	
	_update(timeInSeconds){
		if(this._lock)return;
		//this._model.position.x+=this._direct;
		const _current_pos=this.get_world_position();
		const _dx=_current_pos.x-this._last_pos.x;
		const _dy=_current_pos.y-this._last_pos.y;
		const _dz=_current_pos.z-this._last_pos.z;
		this._last_pos.copy(_current_pos);
		
		const _length=this._mother_ships.length;
		let _distance,_laser_color;
		//const _min_distance=150;
		for(let i=0;i<_length;i++){
			const _ship=this._mother_ships[i];
			//_ship._update(timeInSeconds);
			_distance=_current_pos.distanceTo(_ship.Position);
			if(_distance>=_max_distance){
				/*
				_ship._model.position.x+=_dx;
				_ship._model.position.y+=_dy;
				_ship._model.position.z+=_dz;
				*/
				_laser_color="red";
			}
			else{
				if(_distance>(_max_distance*3)/4){
					_laser_color="yellow";
				}
				else{
					_laser_color="green";
				}
			} 
			
			_ship._change_laser_color(_laser_color);
			//this._utils.rotateAboutPoint(_ship._model,this.Position,this._utils.axisY,timeInSeconds*0.1,true);
			
		}
		
		if(this._enable_update_1)this._update_1(timeInSeconds);
	}
	
	_update_1(timeInSeconds){
		if(!this._update_1_center_point)return;
		
		this._utils.rotateAboutPoint(this._model,this._update_1_center_point,this._utils.axisY,timeInSeconds*0.1,true);
	}
	
	CheckTarget(timeInSeconds){
		
	}
}
export {GreatMotherShip}