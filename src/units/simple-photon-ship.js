import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {SpaceShip} from './space-ship.js';
const _radius=800;
class SimplePhotonShip extends SpaceShip {
	
	constructor(params){
		params.laser_color=new THREE.Color(247, 10, 2);
		params.shoot_delay=0.5;//thời gian delay giữa 2 lần bắn
		
		params.health=params.game._parameters._standard_hp/2;
		params.damage=params.game._parameters._standard_hp/5000000;
		//params.attack_radius=_radius;
		params.blaster_radius=6;
		
		super(params);
		
		this._bound_radius=10;
		this._firing=false;
		this.add_to_after_dead_function_list(()=>{
			this._game._graphics.remove_laser(this._laserObject3D);
		});
		this._counter1=0;
		this._lock_2=false;
		
		this._fire_duration=this._game._utils.get_random_in_range(3,4);//thoi gian chieu' photon
		this._fire_delay=this._game._utils.get_random_in_range(9,15);//thoi gian delay giua 2 lan chieu' photon
		
		this._rand_second=this._fire_duration;
		
		this._photon_ray_color="white";
		this._photon_ray_radius=0.15;
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
	
	ConnectShip(_ship,_range,_range_minY,_range_maxY,_range_minZ,_range_maxZ){//ket noi voi 1 laser ship khac de tao thanh tia laser quet qua enemy
		if(_ship.Dead||_ship._is_connecting)
			return false;
		
		const _item=this._game._graphics.create_laser("white");
			if(typeof _item==='undefined'||_item===null){
			return false;
		}
		
		let _dead_fc1=()=>{
			_ship._is_connecting=false;
			this._is_connecting=false;
		};
		this.add_to_after_dead_function_list(_dead_fc1);
		_ship.add_to_after_dead_function_list(_dead_fc1);
		
		_ship._is_connecting=true;
		this._is_connecting=true;
		
		this._laserObject3D=_item[1];
		this._laser2=_item[2];
		this._game._graphics.show_laser(this._laserObject3D);
	
		this._laserObject3D.scale.z=this.Position.distanceTo(_ship.Position);
		this._laserObject3D.scale.x=1.0;
		this._laserObject3D.scale.y=1.0;
		this._laserObject3D.position.copy(this.Position);
		this._laserObject3D.lookAt(_ship.Position);
		
		let _dead_fc2=()=>{
			this.hide_laser();
		};
		this.add_to_after_dead_function_list(_dead_fc2);
		_ship.add_to_after_dead_function_list(_dead_fc2);
		
		let _update_laser_fc=(t)=>{
			
			if(this.Dead||_ship.Dead)return;
			
			this._model.lookAt(_ship.Position);
			_ship._model.lookAt(this.Position);
			
			this._laserObject3D.position.copy(this.Position);
			this._laserObject3D.lookAt(_ship.Position);
			this._laserObject3D.scale.z=this.Position.distanceTo(_ship.Position);
			
			if(!this._target_object||this._target_object===null||this._target_object.Dead)return;
			const _pos=this._target_object.Position;
			
			if(_pos.distanceTo(this.Position)+_pos.distanceTo(_ship.Position)<this.Position.distanceTo(_ship.Position)+10)
				this._target_object.TakeDamage(t*3);
			
		};
		this._game.add_to_update_function_list(_update_laser_fc);
	}
	
	Fire(){//overwrite
		if(this._firing)return;
		this._firing=true;
	}
	CheckTarget(timeInSeconds){
		if(this._is_connecting)return;
		
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
				
				this.hide_laser();
			}
			return;
		}
		if(this.Position.distanceTo(this._target_object.Position)>_radius){
		
			this._firing=false;
			//this._target_object=null;
			
			this.hide_laser();
			return;
		}
		this._model.lookAt(this._target_object.Position);
		
		if(!this._last_time){
			this._last_time=0;
			//this._rand_second=this._game._utils.get_random_in_range(1,4);
		}
		if(!this._lock_2){
			this.Fire();
			this.show_laser();
		}
		else{
			this._firing=false;
			this.hide_laser();
		}
			
		
		if(!this._laserObject3D)return;
		const _distance=this._laserObject3D.position.distanceTo(this._target_object.Position);
		this._laserObject3D.scale.z=_distance+30;
		this._laserObject3D.scale.x=this._photon_ray_radius;
		this._laserObject3D.scale.y=this._photon_ray_radius;
		this._laserObject3D.position.copy(this.Position);
		this._laserObject3D.lookAt(this._target_object.Position);
		this._laser2.change_color(this._photon_ray_color);
		
		this._last_time+=timeInSeconds;
		if(this._last_time>=1){//1 giay 1 lan
			this._last_time=0;
			this._target_object.TakeDamage(this._game._parameters._standard_hp/300);
			//this._game._noticeBoard.add_message("Counter="+this._counter1);
			this._counter1++;
			let _delay;
			if(this._lock_2)
				_delay=this._fire_delay;
			else
				_delay=this._rand_second;
			if(this._counter1>=_delay){
				this._counter1=0;
				this._lock_2=!this._lock_2;
			}
		}
	}
	CheckTarget2(timeInSeconds){
		
		if(!this._target_object||this._target_object===null||this._target_object.Dead){
			this._firing=false;
			
			if(this._laser2!=null){
				
				this.hide_laser();
			}
			return;
		}
		if(this.Position.distanceTo(this._target_object.Position)>_radius){
			this._firing=false;
			this.hide_laser();
			return;
		}
		this._model.lookAt(this._target_object.Position);
		if(!this._last_time){
			this._last_time=0;
			this._rand_second=this._game._utils.get_random_in_range(1,4);
		}
		if(!this._lock_2){
			this.Fire();
			this.show_laser();
		}
		else{
			this._firing=false;
			this.hide_laser();
		}
			
		
		if(!this._laserObject3D)return;
		const _distance=this._laserObject3D.position.distanceTo(this._target_object.Position);
		this._laserObject3D.scale.z=_distance+30;
		this._laserObject3D.scale.x=0.15;
		this._laserObject3D.scale.y=0.15;
		this._laserObject3D.position.copy(this.Position);
		this._laserObject3D.lookAt(this._target_object.Position);
		
		this._last_time+=timeInSeconds;
		if(this._last_time>=1){//1 giay 1 lan
			this._last_time=0;
			this._target_object.TakeDamage(this._damage);
			//this._game._noticeBoard.add_message("Counter="+this._counter1);
			this._counter1++;
			let _delay;
			if(this._lock_2)
				_delay=5+this._rand_second;
			else
				_delay=2+this._rand_second;
			if(this._counter1>=_delay){
				this._counter1=0;
				this._lock_2=!this._lock_2;
			}
		}
	}
}

export {SimplePhotonShip}