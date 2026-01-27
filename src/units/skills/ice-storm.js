import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {Sparks1} from './spark-1.js';

class IceStorm{
	constructor(params){
		this._game=params.game;
		this._parent_object=params.parent_object;
		
		this._sparks = new Sparks1({
				 game:this._game,
				parent:this._parent_object,
				camera: this._game._graphics.Camera,
				position:new THREE.Vector3(0,0,0),
				particle_id:'particle12',
				color1:'turquoise',
				color2:'turquoise',
				particle_size:0.7,
			});
			
			
		
	}
	
	set_alpha(_alpha){
		this._sparks.set_alpha(_alpha);
	}
	
	clear(){
		//this._game.remove_function_from_update_list(this._update_sparks);
		//this._parent_object.remove(this._sparks._points);
		this._sparks._Clear();
	}
	
}

export {IceStorm}

