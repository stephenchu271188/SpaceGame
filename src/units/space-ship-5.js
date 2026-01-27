import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {SpaceShip} from './space-ship.js';
//import {blaster} from './blaster.js';
//import {Utils} from './utils.js';

class SpaceShip5 extends SpaceShip {
	
	constructor(params){
		params.laser_color=new THREE.Color(247, 10, 2);
		params.shoot_delay=0.14;//thời gian delay giữa 2 lần bắn
		params.health=params.game._parameters._standard_hp;
		params.damage=params.game._parameters._standard_hp/50;
		
		super(params);
		
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
		
		//this._visibilityIndex = this._game._visibilityGrid.UpdateItem(
          //this._mesh.uuid, this, this._visibilityIndex);
		  
		  //this._utils=new Utils();
		  this._stepX=0;
		  this._stepY=0;
		  this._stepZ=0;
		  this._stepNum=10;
		  //this._axis=new THREE.Vector3();
		  //this._axis.copy(this._utils.axisY);
		  this._random_angle=Math.random() * Math.PI/9;//tao goc' xoay ngau nhien
		  this._rotate_speed=0.1;//van toc quay
		  //this._counter=0;
		  //this._rotate_direct=1;//chieu quay
		  //this._rand_distance=null;
		  
		  
		  const randomValue = Math.random();// Tạo một số ngẫu nhiên từ 0 đến 1
		  this._direct = randomValue < 0.5 ? 1 : -1;// Quyết định giá trị là 1 hoặc -1
	}
	
	CheckTarget(timeInSeconds){
		if(typeof this._target_object==='undefined'||this._target_object===null)
			return;
		if(this._target_object.Dead)return;
		//try{
		//const _me=this._params.game._entities['player'];
		const _enemy_pos=this._params.model.position;
		const _distance=this._target_object._params.model.position.distanceTo(_enemy_pos);
		const _player_pos=this._target_object.get_world_position();
		const _player_direct=new THREE.Vector3();
		const _min_distance=150;
		const _max_distance=500;
		if(_distance<=_min_distance){
			this._lock_target=true;
		}
		if(this._lock_target===true){
			this.Fire();
			
			if(!this._virtual_object_1){
				this._virtual_object_1=new THREE.Group();//tạo 1 object ảo nằm bên trong player ship
				this._params.game._graphics.Scene.add(this._virtual_object_1);
				this._virtual_object_1.rotation.x=this._random_angle;
				this._virtual_object_2=new THREE.Object3D();//tạo 1 object ảo quay tròn xung quanh object ảo ở trên
				
				this._virtual_object_1.add(this._virtual_object_2);
				const _px=_enemy_pos.x-_player_pos.x;
				const _py=_enemy_pos.y-_player_pos.y;
				const _pz=_enemy_pos.z-_player_pos.z;
				this._virtual_object_2.position.set(_px,_py,_pz);
			}
			this._virtual_object_1.position.copy(_player_pos);
			const _center=new THREE.Vector3(0,0,0);
			this._utils.rotateAboutPoint(this._virtual_object_2,_center,
										 this._utils.axisY,timeInSeconds*this._rotate_speed*this._direct, false);
			const _obj_point=new THREE.Vector3();
			this._virtual_object_2.getWorldPosition(_obj_point);
			this._model.position.copy(_obj_point);
			
			const _target_pos_2=new THREE.Vector3(_player_pos.x-5,_player_pos.y+15,_player_pos.z);
			const _pos=this._utils.calculateSymmetricPoint(this._model.position,_target_pos_2);
			this._model.lookAt(_pos);
			this._params.camera.lookAt(_pos);
			
			return;
		}
		if(_distance>_min_distance&&_distance<_max_distance){
			this._target_object._model.getWorldDirection(_player_direct);
			this._target_pos=this._utils.findPointB(_player_pos.x,_player_pos.y,_player_pos.z,
											-_player_direct.x,-_player_direct.y,-_player_direct.z,
											300);
			const _step=1;
			this._model.position.copy(this._utils.translatePoint(this._model.position,
			this._target_pos,timeInSeconds*_step));	
											
			return;
		}
		
		//}catch(e){alert(e.toString());}
	}
	
}

export{SpaceShip5};