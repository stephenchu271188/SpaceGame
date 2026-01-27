import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';

import {MinaralBase} from './minaral-base.js';

class MinaralBase_1 extends MinaralBase{
	constructor(params){
		/*
		params.unit_list=[["cannon-1",new THREE.Vector3(0,50,0)],
						  ["cannon-2",new THREE.Vector3(150,50,0)],
						  ["cannon-1",new THREE.Vector3(-150,50,0)],
						  ["cannon-2",new THREE.Vector3(150,50,150)],
						  ["cannon-1",new THREE.Vector3(150,50,-150)]];
		*/
		params.unit_list=[["cannon-1",new THREE.Vector3(50,50,50)],
						 
						  ["cannon-1",new THREE.Vector3(-50,50,-50)]];
		super(params);
	}
}
export{MinaralBase_1};

