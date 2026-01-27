import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {SpaceShip} from './space-ship.js';
//import {SimpleLaserShip} from './simple-laser-ship.js';

class SimpleClusterBulletShip extends SpaceShip {
	
	constructor(params){
		params.laser_color=new THREE.Color(247, 10, 2);
		params.shoot_delay=2;//thời gian delay giữa 2 lần bắn
		params.health=params.game._parameters._standard_hp;
		params.damage=params.game._parameters._standard_hp/50;
		
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
		 
		 this._child_ship=this._game._unitMG.createSimpleLaserShip(new THREE.Vector3(0,10,0));
		 this._child_ship._model.scale.multiplyScalar(0.5);
		 this._game._graphics.Scene.add(this._child_ship._model);
		 //this._model.add(this._child_ship._model);
		 this._child_ship.CheckTarget=(timeInSeconds)=>{};
		 this._child_ship._params.laser_color=new THREE.Color(62, 251, 62);
		 //this._child_ship._params.blasterSystem._size=10;
		 //let _child_pos=new THREE.Vector3();
		 this.add_to_update_function_list(()=>{
			 this._child_ship._model.position.copy(this.get_back_point(5));
			 this._child_ship._model.position.y+=30;
			 this._target_object=this._game._me;
			 if(this._target_object&&this._target_object!=null&&!this._target_object.Dead){
				 const _pos=this._utils.calculateSymmetricPoint(this.Position,this._target_object.Position);
				 this._child_ship._model.lookAt(_pos);
				 this._child_ship._params.camera.lookAt(_pos);
				 this._child_ship.Fire();
			 }
		 });
		 //this.Fire=()=>{};
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

export{SimpleClusterBulletShip};