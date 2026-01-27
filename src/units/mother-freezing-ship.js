import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {MotherShip} from './mother-ship.js';
//import {FlashEffect1} from './flash-effect-1.js';
const _radius=420;
class MotherFreezingShip extends MotherShip{
	constructor(params){
		params.health=4000;
		params.damage=60;
		params.attack_radius=_radius;
		super(params);
		//this._radius=_radius;
		this._firing=false;
		
		this.add_to_after_dead_function_list(()=>{
			this._game._graphics.remove_laser(this._laserObject3D);
		});
	}
	
	hide_laser_2(){
		this._game._graphics.hide_laser(this._laserObject3D);
	}
	show_laser_2(){
		
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
	
	Fire(){//overwrite
		if(this._firing)return;
		this._firing=true;
		
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
			
			if(this._laser2!=null){
				
				this.hide_laser_2();
			}
			return;
		}
		if(this.Position.distanceTo(this._target_object.Position)>_radius){
			//this.move_to_approach_object(this._target_object,_radius-5,60,timeInSeconds);
			this.approach_target(timeInSeconds);
			this._firing=false;
			//this._target_object=null;
			
			this.hide_laser_2();
			return;
		}
		const _pos=this._utils.calculateSymmetricPoint(this.Position,this._target_object.Position);
		this._model.lookAt(_pos);
		this.Fire();
		this.show_laser_2();
		
		const _distance=this._laserObject3D.position.distanceTo(this._target_object.Position);
		this._laserObject3D.scale.z=_distance;
		this._laserObject3D.position.copy(this.Position);
		this._laserObject3D.lookAt(this._target_object.Position);
		this._target_object.TakeDamage(timeInSeconds*this._params.damage);
		
	}
	
}
export {MotherFreezingShip}
