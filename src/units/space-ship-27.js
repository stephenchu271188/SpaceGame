import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {SpaceShip} from './space-ship.js';
//import {blaster} from './blaster.js';

class SpaceShip27 extends SpaceShip {
	
	constructor(params){
		params.laser_color=new THREE.Color(80, 254, 45);
		params.shoot_delay=0.2;//thời gian delay giữa 2 lần bắn
		params.health=200;
		params.blaster_radius=5.0;
		params.damage=10;
		super(params);
		
		const x = 2.75;
		const y = -3;
		const z = 2.0;
		this._offsets = [//vị trí của 4 nòng súng
			new THREE.Vector3(-x, y, -z),
			new THREE.Vector3(x, y, -z),
		];
		
		//this._visibilityIndex = this._game._visibilityGrid.UpdateItem(
          //this._mesh.uuid, this, this._visibilityIndex);
	}
	
	CheckTarget(){
		
		var _me=this._params.game._entities['player'];
		var _distance=_me._params.model.position.distanceTo(this._params.model.position);
		if(_distance<200){
			//return;
			//do model 3D có tư thế default bị ngược
			let _pos=this.calculateSymmetricPoint(this._model.position,_me._model.position);
			this._model.lookAt(_pos);
			this._params.camera.lookAt(_pos);
			
			if(_distance<200)
				this.Fire();
			//try{
			if(_distance>20){
				const _direct=new THREE.Vector3();
				_me._model.getWorldDirection(_direct);
				const _tpos=this.findPointB(_me._model.position.x,_me._model.position.y,_me._model.position.z,
											_direct.x,_direct.y,_direct.z,10);
				//const _tpos=new THREE.Vector3(_me._model.position.x+20,_me._model.position.y+10,_me._model.position.z);							
				this._model.position.copy(this.translatePoint(this._model.position,
				_tpos,0.02));//duoi theo player
			}
			//}catch(e){alert(e.toString());}
		}
		else{//lien tuc ba'm theo player
			const _direct=new THREE.Vector3();
				_me._model.getWorldDirection(_direct);
				const _tpos=this.findPointB(_me._model.position.x,_me._model.position.y,_me._model.position.z,
											_direct.x,_direct.y,_direct.z,10);
				//const _tpos=new THREE.Vector3(_me._model.position.x+20,_me._model.position.y+10,_me._model.position.z);							
				this._model.position.copy(this.translatePoint(this._model.position,
				_tpos,0.2));//duoi theo player
		}
	}
	
	//Cho diem A(x1,y1,z1) và Vector chi huong cua A la D(x2,y2,z2)
	//Tim diem B nam cach A 1 khoang theo huong D
	findPointB(x1, y1, z1, x2, y2, z2, distance) {
		const lengthD = Math.sqrt(x2 * x2 + y2 * y2 + z2 * z2);
		// Chuẩn hóa vector D để có độ dài 1
		const normalizedD = {
			x: x2 / lengthD,
			y: y2 / lengthD,
			z: z2 / lengthD,
		};

		// Tính tọa độ của điểm B
		const xB = x1 + normalizedD.x * distance;
		const yB = y1 + normalizedD.y * distance;
		const zB = z1 + normalizedD.z * distance;

		//return { x: xB, y: yB, z: zB };
		const _B=new THREE.Vector3(xB,yB,zB);
		return _B;
	}
	
	translatePoint(p1, p2, distance) {//dịch chuyển điểm P1 tiến tới gần điểm P2 một khoảng quãng đường là d
		// Tính toán vector hướng từ P1 đến P2
		const directionVector = {
			x: p2.x - p1.x,
			y: p2.y - p1.y,
			z: p2.z - p1.z
		};
		
		// Tính độ dài của vector hướng
		const directionLength = Math.sqrt(directionVector.x ** 2 + directionVector.y ** 2 + directionVector.z ** 2);
    
		// Chuẩn hóa vector hướng để có hướng di chuyển
		const normalizedDirection = {
			x: directionVector.x / directionLength,
			y: directionVector.y / directionLength,
			z: directionVector.z / directionLength
		};
    
		// Tính toán vị trí mới của P1 sau khi di chuyển
		const newP1 = {
			x: p1.x + normalizedDirection.x * distance,
			y: p1.y + normalizedDirection.y * distance,
			z: p1.z + normalizedDirection.z * distance
		};
    
		return newP1;
	}
	
	calculateSymmetricPoint(pointA, pointB) {//tinh' toa do diem doi xung'
		const x1 = pointA.x;
		const y1 = pointA.y;
		const z1 = pointA.z;

		const x2 = pointB.x;
		const y2 = pointB.y;
		const z2 = pointB.z;

		const xC = 2 * x1 - x2;
		const yC = 2 * y1 - y2;
		const zC = 2 * z1 - z2;

		return new THREE.Vector3(xC,yC,zC);
	}

}

export{SpaceShip27};