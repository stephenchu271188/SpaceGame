import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {SpaceShip} from './space-ship.js';
import {thruster} from './thruster.js';

//Tên lửa bay theo đường thẳng, khi gần mục tiêu thì phát nổ
class RocketShip1Missile1 extends SpaceShip {
	
	constructor(params){
		params.laser_color=new THREE.Color(247, 10, 2);
		params.light_color=new THREE.Color(247, 10, 2);//engine
		params.shoot_delay=0.5;//thời gian delay giữa 2 lần bắn
		params.health=99999999;
		params.damage=3500;
		
		super(params);
		
		let x = 0;
		let y = 0;
		let z = 0;
		this._engine_offsets = [//vị trí của engine
			new THREE.Vector3(x,y,z)
		];
		
		this._radius_effect1=15;//khoảng cách mà khi tên lửa ở gần mục tiêu sẽ phát nổ
		this._radius_effect2=25;//bán kính tầm ảnh hưởng của vụ nổ
		this._origin_position=this.get_world_position();//vị trí ban đầu
		this._max_distance=500;//quãng đường xa nhất tên lửa có thể bay đi
		
		//try{
			this.init_thruster_2();
			this.turn_on_thruster(); 
		//}catch(e){alert(e.stack);}
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
	}
	
	CheckTarget(timeInSeconds){
		//try{
			const _position=this.get_world_position();
			if(_position.distanceTo(this._origin_position)>this._max_distance){
				this.SelfDestroy();
			}
			this.move_forward(timeInSeconds*40);
			const _targets=this._game._unitMG.get_enemy_combat_unit_in_range(_position,this._radius_effect1);
			for(let i=0;i<_targets.length;i++){
				
				const _target=_targets[i][0];
				if(_target._player_id===this._player_id)continue;
				const _distance=_targets[i][1];
				//let _damage=(_distance/this._radius_effect)*this._params.damage;
				let _damage=this._params.damage;
				if(_distance>this._radius_effect2*3/4)_damage=this._params.damage/3;
				if(_distance>this._radius_effect2*1/2)_damage=this._params.damage/2;
				//else _damage=this._params.damage;
				
				_target.TakeDamage(_damage);
			}
			if(_targets.length>0)this.SelfDestroy();
		//}catch(e){alert(e.toString());}
	}
	
}

export{RocketShip1Missile1};