import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {SpaceShip} from './space-ship.js';

import {FlashEffect1} from './flash-effect-1.js';

class FlashShip1 extends SpaceShip {
	
	constructor(params){
		params.laser_color=new THREE.Color(247, 10, 2);
		params.shoot_delay=0.5;//thời gian delay giữa 2 lần bắn
		
		//params.health=1000;
		//params.damage=10;
		
		params.health=100;
		params.damage=50;
		//params.blaster_radius=6;
		
		
		super(params);
		/*
		const x = 2.75;
		const y1 = 1.5;
		const y2 = 0.4;
		const z = 4.0;
		this._offsets = [//vị trí của 4 nòng súng
			new THREE.Vector3(-x, y1, -z),
			new THREE.Vector3(x, y1, -z),
			new THREE.Vector3(-x, -y2, -z),
			new THREE.Vector3(x, -y2, -z),
		];
		*/
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
		
		const _min_distance=250;
		let _target,_distance;
		
		for(let j=0;j<this._game._unitMG._combat_unit_list.length;j++){
					_target=this._game._unitMG._combat_unit_list[j];
					_distance=this.Position.distanceTo(_target.Position);
					//console.log(this._player_id+" and "+_target._player_id);
					if(this._player_id!=_target._player_id&&_distance<=_min_distance){
						_target.TakeDamage(this._params.damage);
					}
		}
		
	}
	CheckTarget(timeInSeconds){
		
	}
	
}

export{FlashShip1};