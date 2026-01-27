import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {Galaxy} from './galaxy.js';


var _last_pos=new THREE.Vector3();
var _galaxy=null;
var _view_range=60000;

class Universe{
    constructor(params){
        this._params=params;
		this._id=this._params.id;
		this._auto_create_star_systems=true;
    }
	
	create_galaxy(_id){
		_galaxy=new Galaxy({id:_id,universe_id:this._id,position:new THREE.Vector3(9000,0,-5000),game:this._params.game});
		_galaxy.load_data('./data-demo.json',function(){
			_galaxy.create_neighboring_star_systems(new THREE.Vector3(0,0,0),500);
		});
	}
	create_galaxy_with_url(_id,_url,_fc){//url la vi tri file json; _id tuy thich(vd:-1) mien ko xung dot du lieu
		_galaxy=new Galaxy({id:_id,universe_id:this._id,position:new THREE.Vector3(9000,0,-5000),game:this._params.game});
		_galaxy.load_data(_url,function(){
			_galaxy.create_neighboring_star_systems(new THREE.Vector3(0,0,0),500);
			_fc();
		});
	};
	get_current_galaxy(){
		return _galaxy;
	}
	
	update(timeInSeconds){
		if(this._auto_create_star_systems)
		if(this._params.camera.position.distanceTo(_last_pos)>4000){
            //console.log("postion="+this._graphics.Camera.position.x+" and "+this._graphics.Camera.position.y+" and" +this._graphics.Camera.position.z);
            _galaxy.clear_out_range_star_systems(this._params.camera.position,_view_range);
            _galaxy.create_neighboring_star_systems(this._params.camera.position,_view_range);
            
            _last_pos.copy(this._params.camera.position);
         
        }
		
		_galaxy.update(timeInSeconds);
	}
}

export{Universe};