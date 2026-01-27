import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';

import {Star} from './star.js';

class StarSystem{
    
    constructor(params){
        this._params=params;
        this._star_list=new Array();
        this._root=null;
        this._position=this._params.data.position;
        let _starlist_data=this._params.data.starList;
        this._id=this._params.data.id;
        let _star_data;
        for(var j=0;j<_starlist_data.length;j++){
            _star_data=_starlist_data[j];
            let _star=new Star({parent_object:this._root,data:_star_data,game:this._params.game});    
            this._star_list.push(_star);
			//alert("Planet Num="+_star_data.planetList.length);
        }
    }
	
	update(timeInSeconds){
		for(var i=0;i<this._star_list.length;i++){
			this._star_list[i].update(timeInSeconds);
		}
	}
    
    get_position(){
        return this._root.position;
    }
	get_world_position(){
		let _rs=new THREE.Vector3();
		this._root.getWorldPosition(_rs);
		return _rs;
	}
    
    create(_just_show_label){
        let _scale=this._params.game._config.magnification_factor;
        this._root=new THREE.Group();
        //this._root.position.set(this._position[0]*_scale,this._position[1]*_scale,this._position[2]*_scale);
        this._root.position.set(this._position[0],this._position[1],this._position[2]);
        this._root.position.multiplyScalar(_scale);
      
        this._params.parent_object.add(this._root);
        for(var i=0;i<this._star_list.length;i++){
            let _star=this._star_list[i];    
            _star.create(_just_show_label);
            this._root.add(_star.get_root());
        }
    }
    clear(){
        for(let i=0;i<this._star_list.length;i++){
            let _star=this._star_list[i];
            _star.clear();
        }
        this._root.parent.remove(this._root);
        
    }
}

export{StarSystem};