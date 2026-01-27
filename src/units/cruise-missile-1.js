import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {SpaceShip} from './space-ship.js';
import {thruster} from './thruster.js';

//Tên lửa bay theo đường thẳng, khi gần mục tiêu thì phát nổ
class CruiseMissile1 extends SpaceShip {//tàu thám hiểm
	
	constructor(params){
		params.laser_color=new THREE.Color(247, 10, 2);
		params.light_color=new THREE.Color(247, 10, 2);//engine
		params.shoot_delay=0.5;//thời gian delay giữa 2 lần bắn
		params.health=200;
		params.damage=3500;
		
		super(params);
		this._speed=16;
		this._is_cruise_missile=true;
		
		let x = 0;
		let y = 0;
		let z = 0;
		this._engine_offsets = [//vị trí của engine
			new THREE.Vector3(x,y,z)
		];
		
		const light = new THREE.PointLight( 0xffffff, 1, 60 );
		light.position.set( 10, 10, 10 );
		this._model.add( light );
		
		this._game.add_to_function_list_3(()=>{
			this._model.lookAt(this._target_object.get_world_position());
			this.move_backward(this._speed);
		});
		
	}
	
	init_thruster_2(){//overwrite
		const _id1='_unit_'+this._my_unique_id+'_thruster1';
		const _id2='_unit_'+this._my_unique_id+'_thruster2';
		this._game._entities[_id1] = new thruster.Thruster(//LIGHT OF ENGINE
        {
            game: this._game,
			target:this,
			//camera:this._game._graphics.Camera,
            texture: "./resources/blaster.jpg",
            visibility: this._game._visibilityGrid,
			start_pos:new THREE.Vector3(0.2,1.2,2.2),
			end_pos:new THREE.Vector3(-0.2,1.2,2.2)
        });
		this._game._entities[_id2] = new thruster.Thruster(//LIGHT OF ENGINE
        {
            game: this._game,
			target:this,
			//camera:this._game._graphics.Camera,
            texture: "./resources/blaster.jpg",
            visibility: this._game._visibilityGrid,
			start_pos:new THREE.Vector3(0.2,-1,2.2),
			end_pos:new THREE.Vector3(-0.2,-1,2.2)
        });
		
		this._game._entities[_id1]._particleSystem.rotation.x=Math.PI/2;
		this._game._entities[_id1]._particleSystem.position.y+=2.4;
		this._game._entities[_id1]._particleSystem.position.z+=1.5;
		
		this._game._entities[_id2]._particleSystem.rotation.x=Math.PI/2;
		this._game._entities[_id2]._particleSystem.rotation.y=Math.PI/2;
		this._game._entities[_id2]._particleSystem.position.y-=0.5;
		this._game._entities[_id1]._particleSystem.position.z+=1.5;
		this._game._entities[_id2]._particleSystem.position.x-=2.4;
		
		this._thruster_list.push(this._game._entities[_id1]);
		this._thruster_list.push(this._game._entities[_id2]);
	}
	
	SelfDestroy(){
		super.SelfDestroy();
		this._params.game._entities['_explosionSystem'].Splode(this.Position);
		if(this._t_destroy_fc)this._t_destroy_fc();
	}
	
	CheckTarget(timeInSeconds){
		
			const _position1=this.get_world_position();
			const _position2=this._target_object.get_world_position();
			
			if(_position1.distanceTo(_position2)<=50){
				this.SelfDestroy();
			
			}
			
	}
	
}

export{CruiseMissile1};