import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {SpaceShip} from './space-ship.js';


class Satellite1 extends SpaceShip {
	
	constructor(params){
		params.laser_color=new THREE.Color(247, 10, 2);
		params.shoot_delay=2;//thời gian delay giữa 2 lần bắn
		params.health=2000;
		params.damage=10;
		
		super(params);
		
		this._bound_radius=50;
		
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
		
		  this._counter=0;
		  this._stepX=0;
		  this._stepY=0;
		  this._stepZ=0;
		  this._stepNum=10;
		 
	}
	
	start_orbit(center_pos,axis,theta){//quay xung quanh vi tri 
		this._orbit_fc=(t)=>{
			this._game._utils.rotateAboutPoint(this._model,center_pos,axis,t*theta, true);
		};
		this._game.add_to_update_function_list(this._orbit_fc);
	}
	
	TakeDamage(dmg){
		//this._game._sound.play('impact-bullet-metal-2');
		//alert('Take Damage');
		super.TakeDamage(dmg);
	}
	BeDestroy(){
		this._game._sound.play('explosion1');
		this._game.remove_function_from_update_list(this._orbit_fc);
		super.BeDestroy();
	}
	CheckTarget(timeInSeconds){
		
	}
	
}

export{Satellite1};