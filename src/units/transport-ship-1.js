import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {SpaceShip} from './space-ship.js';
//import {blaster} from './blaster.js';

class TransportShip1 extends SpaceShip {
	
	constructor(params){
		params.laser_color=new THREE.Color(80, 254, 45);
		params.shoot_delay=0.2;//thời gian delay giữa 2 lần bắn
		params.health=500;
		params.blaster_radius=5.0;
		params.damage=10;
		super(params);
		
		const x = 2.75;
		const y = -3;
		const z = 2.0;
		this._offsets = [//vị trí của 4 nòng súng
			new THREE.Vector3(-x, y, -z),
			new THREE.Vector3(x, y, -z),
		];
		
		//this._visibilityIndex = this._game._visibilityGrid.UpdateItem(
          //this._mesh.uuid, this, this._visibilityIndex);
	}
	
	CheckTarget(){
	}
	
}

export{TransportShip1};