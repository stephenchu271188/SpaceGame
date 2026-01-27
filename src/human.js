import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {SpaceShip} from './units/space-ship.js';
import {controls} from './controls.js';

class HumanEntity extends SpaceShip {
	constructor(params){
		super(params);
		
		this.mixers = [];
		this.animation_list=new Array();
		let _obj=params.gltf_data.scene;
		this.mixer = new THREE.AnimationMixer(_obj);
		var clip1 = this.mixer.clipAction(params.gltf_data.animations[0]);
		var clip2 = this.mixer.clipAction(params.gltf_data.animations[1]);
		this.animation_list.push(clip1,clip2);
		this.mixers.push(this.mixer);
		
	}
	
	Update_1(){
		var forward=0.5, turn=0.1;
			var maxSteerVal = 0.0;
			var maxForce = .15;
			var brakeForce = 10;

			var force = maxForce * forward;
			var steer = maxSteerVal * turn;
			

			if (this.human_move){
				//this._model.translateZ(force);
				if(this.animation_list[1]) this.animation_list[1].play();
				if(this.animation_list[0]) this.animation_list[0].stop();
			}
			else{
				if(this.animation_list[1]) this.animation_list[1].stop();
				if(this.animation_list[0]) this.animation_list[0].play();
			}
			
			let delta = this._params.game._clock.getDelta();
			this.mixers.map(x=>x.update(delta));
			
			//this._model.rotateY(steer);
	}
	
	PlayHumanAnimation(){
		this.human_move=true;
	}
	StopHumanAnimation(){
		this.human_move=false;
	}
}

export{HumanEntity};