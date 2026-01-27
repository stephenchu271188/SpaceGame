//import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {MotherShip} from './mother-ship.js';

const _radius=520;
class MotherRocketShip extends MotherShip{
	constructor(params){
		params.health=10000;
		params.damage=20;
		super(params);
		this._recovery_time=5;//thời gian hồi phục
		this._lock_fire=false;
		
	}
	
	Fire(){
		if(this._lock_fire)return;
		this._lock_fire=true;
		
		this._game.add_to_function_list_2(()=>{
			this._lock_fire=false;
		},this._recovery_time);
		
		let _pos1=this.get_ahead_point(15);
		let _pos2=this.get_ahead_point(150);
		let _rocket;
		_rocket=this._game._unitMG.create_missile_1(_pos1);
		_rocket._player_id=this._player_id;
		
		/***************/
		//if(_rocket._player_id===1)_rocket._opponent_id=2;
		//else _rocket._opponent_id=1;
		/***************/
		
		this._game._graphics.Scene.add(_rocket._model);
		_rocket._model.lookAt(_pos2);
		this._game._sound.play('missile-launch');
	}
	approach_target(timeInSeconds){
		if(this._approach_target){
			this.move_and_approach_object(this._target_object,_radius-20,80,timeInSeconds,()=>{
				//this._approach_target=false;
			});
		}
	}
	CheckTarget(timeInSeconds){
		
		this.update_laser();
		let _distance;
		
		if(!this._target_object||this._target_object===null||this._target_object.Dead){
			let _target;
			const _max_distance=500;
			for(let i=0;i<this._game._unitMG._combat_unit_list.length;i++){
				_target=this._game._unitMG._combat_unit_list[i];
				if(_target._player_id===this._player_id)continue;
				_distance=_target.Position.distanceTo(_target.Position);
				if(_distance<=_max_distance){
					this._target_object=_target;
					break;
				}
			}
			return;
		}
		//const _pos=this._utils.calculateSymmetricPoint(this.Position,this._target_object.Position);
		//this._model.lookAt(_pos);
		_distance=this.Position.distanceTo(this._target_object.Position);
		if(_distance>_radius){
			this.approach_target(timeInSeconds);	
		}
		else
			this.Fire();
		
	}
}
export {MotherRocketShip}