import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {SpaceShip} from './space-ship.js';
const _radius=800;
class SimpleLaserShip extends SpaceShip {
	
	constructor(params){
		params.laser_color=new THREE.Color(247, 10, 2);
		params.shoot_delay=2;//thời gian delay giữa 2 lần bắn
		params.health=params.game._parameters._standard_hp;
		params.damage=params.game._parameters._standard_hp/50;
		/*
		params.health=30;
		params.damage=10;
		params._blaster_radius=10;
		*/
		
		super(params);
		
		this._bound_radius=6;//cang` lon' cang` de bi ban' trung'
		
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
		 
		  //this._behavior_id=-1;
		  //this.perform_next_behavior();
	}
	
	TakeDamage(dmg){
		this._game._sound.play('impact-bullet-metal-2');
		super.TakeDamage(dmg);
	}
	BeDestroy(){
		this._game._sound.play('explosion1');
		super.BeDestroy();
	}
}

export {SimpleLaserShip}