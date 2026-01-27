import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {SpaceShip} from './space-ship.js';
import {thruster} from './thruster.js';


class Rocket extends SpaceShip {
	constructor(params){
		
		super(params);
		
		this._is_rocket=true;
		if(typeof Rocket._list==='undefined'){
			Rocket._list=new Array();
		}
		//Rocket.distance_multiplier=1;
		Rocket.add_to_rocket_list(this);
	}
}
/*
Rocket.set_distance_multiplier=(x)=>{
	Rocket.distance_multiplier=x;
};
Rocket.get_distance_multiplier=()=>{
	return Rocket.distance_multiplier;
};
*/
Rocket.add_to_rocket_list=(_rocket)=>{
	
	Rocket._list.push(_rocket);
	for(let i=Rocket._list.length-1;i>=0;i--){
		if(typeof Rocket._list[i]==='undefined'||Rocket._list[i]===null||Rocket._list[i].Dead){
			Rocket._list.splice(i,1);
		}
	}
};
Rocket.get_rocket_list=()=>{
	return Rocket._list;
}

export{Rocket}