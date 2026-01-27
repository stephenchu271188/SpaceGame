import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {SpaceShip} from './space-ship.js';
//import {blaster} from './blaster.js';
//import {Utils} from './utils.js';

class LaserShip1 extends SpaceShip {
	
	constructor(params){
		params.laser_color=new THREE.Color(247, 10, 2);
		params.shoot_delay=0.5;//thời gian delay giữa 2 lần bắn
		
		//params.health=1000;
		//params.damage=10;
		
		params.health=30;
		params.damage=10;
		params.blaster_radius=6;
		
		
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
		  this._counter=0;
		  this._stepX=0;
		  this._stepY=0;
		  this._stepZ=0;
		  this._stepNum=10;
		  //this._rand_distance=null;
	}
	
	CheckTarget(timeInSeconds){
		
		if(typeof this._target_object==='undefined'||this._target_object===null||this._target_object.Dead){
			this._model.lookAt(this._mother_ship.Position);
			return;
		}
			
		var _distance=this._target_object._params.model.position.distanceTo(this._params.model.position);
		if(_distance<300){
			
			//do model 3D có tư thế default bị ngược
			let _pos=this._utils.calculateSymmetricPoint(this._model.position,this._target_object._model.position);
			this._model.lookAt(_pos);
			this._params.camera.lookAt(_pos);
			
			if(_distance<200)
				this.Fire();
			
				let _randX=this._utils.getRandomNumberInRange(10,30);//khiến enemy ship di chuyển liên tục quanh tâm súng của player
				let _randY=this._utils.getRandomNumberInRange(10,30);
				let _randZ=this._utils.getRandomNumberInRange(10,30);
				//this._rand_distance=[_randX,_randY,_randZ];
				
				const _player_pos=this._target_object._model.position;
				const _player_direct=new THREE.Vector3();
				this._target_object._model.getWorldDirection(_player_direct);
			    this._target_pos=this._utils.findPointB(_player_pos.x,_player_pos.y,_player_pos.z,
											-_player_direct.x,-_player_direct.y,-_player_direct.z,
											200);
							
				this._target_pos.x+=_randX;
				this._target_pos.y+=_randY;
				this._target_pos.z+=_randZ;		

				const entityValues = Object.values(this._game._entities);
				const sphericalEntities = entityValues.filter(_object => _object._is_spherical_entity);
				for (const _object of sphericalEntities) {//để tránh trường hợp bay vào bên trong planet
					const _radius = _object.get_radius();
					const _distance = this._target_pos.distanceTo(_object.get_world_position());
					if (_distance < _radius + 10) {
						return;
					}
				}

			
				const _distance2=this._target_pos.distanceTo(this._model.position);
				const _step=_distance2/2;//càng tới gần thì càng chậm lại
				
				this._model.position.copy(this._utils.translatePoint(this._model.position,
				this._target_pos,timeInSeconds*_step));	
			
		}
	}
	
}

export{LaserShip1};