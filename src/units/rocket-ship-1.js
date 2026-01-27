import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {SpaceShip} from './space-ship.js';

import {FlashEffect1} from './flash-effect-1.js';

class RocketShip1 extends SpaceShip {
	
	constructor(params){
		params.laser_color=new THREE.Color(247, 10, 2);
		params.shoot_delay=0.5;//thời gian delay giữa 2 lần bắn
		
		//params.health=1000;
		//params.damage=10;
		
		params.health=100;
		params.damage=50;
		//params.blaster_radius=6;
		
		
		super(params);
		this._recovery_time=10;//thời gian hồi phục
		this._lock_fire=true;
		//setTimeout(()=>{
			//this._lock_fire=false;
		//},8000);
		
	}
	Fire(){//overwrite
		if(this._lock_fire)return;
		this._lock_fire=true;
		
		this._game.add_to_function_list_2(()=>{
			this._lock_fire=false;
		},this._recovery_time);
		
		let _pos1=this.get_ahead_point(15);
		let _pos2=this.get_ahead_point(150);
		let _rocket;
		_rocket=this._game._unitMG.create_missile_1(_pos1);
		this._game._graphics.Scene.add(_rocket._model);
		_rocket._model.lookAt(_pos2);
		this._game._sound.play('missile-launch');
	}
	CheckTarget(timeInSeconds){
		
	}
	
}

export{RocketShip1};