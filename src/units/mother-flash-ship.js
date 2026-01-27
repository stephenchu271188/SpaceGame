//import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {MotherShip} from './mother-ship.js';
import {FlashEffect1} from './flash-effect-1.js';
const _radius=120;
class MotherFlashShip extends MotherShip{
	constructor(params){
		params.health=10000;
		params.damage=1;
		super(params);
		this._recovery_time=4;//thời gian hồi phục
		this._lock_fire=false;
		
	}
	
	Fire(){//overwrite
		
		if(this._lock_fire)return;
		this._lock_fire=true;
		
		const _flash=new FlashEffect1({game:this._game,unit:this});
		_flash.create_system_1(this.get_world_position(),this.get_world_opposite_direction());
		//_particleSystem.create_system_1(this.get_world_position(),this.get_world_direction());
		this._game.add_to_function_list_2(()=>{
			this._lock_fire=false;
		},this._recovery_time);
		
		const _max_distance=250;
		let _target,_distance;
		
		for(let j=0;j<this._game._unitMG._combat_unit_list.length;j++){
					_target=this._game._unitMG._combat_unit_list[j];
					_distance=this.Position.distanceTo(_target.Position);
					//console.log(this._player_id+" and "+_target._player_id);
					if(this._player_id!=_target._player_id&&_distance<=_max_distance){
						_target.TakeDamage(this._params.damage);
					}
		}
		
	}
	CheckTarget(timeInSeconds){
		this.update_laser();
		
		if(!this._target_object||this._target_object===null||this._target_object.Dead){
			let _target,_distance;
			const _max_distance=200;
			for(let i=0;i<this._game._unitMG._combat_unit_list.length;i++){
				_target=this._game._unitMG._combat_unit_list[i];
				if(_target._player_id===this._player_id)continue;
				_distance=_target.Position.distanceTo(this.Position);
				if(_distance<=_max_distance){
					this._target_object=_target;
					break;
				}
			}
			return;
		}
		const _pos=this._utils.calculateSymmetricPoint(this.Position,this._target_object.Position);
		this._model.lookAt(_pos);
		this.Fire();
	}
}
export {MotherFlashShip}