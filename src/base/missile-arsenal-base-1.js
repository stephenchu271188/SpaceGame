import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';

import {MissileArsenalBase} from './missile-arsenal-base.js';

class MissileArsenalBase_1 extends MissileArsenalBase{
	constructor(params){
		
		params.unit_list=[["cannon-1",new THREE.Vector3(0,50,0)],
						 
						  ["cannon-2",new THREE.Vector3(150,50,150)],
						  ["cannon-1",new THREE.Vector3(150,50,-150)]];
		
		//params.unit_list=[["cannon-1",new THREE.Vector3(0,50,0)]];
		super(params);
	}
}
export{MissileArsenalBase_1};

