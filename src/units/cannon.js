import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';

import {LandUnit} from './land-unit.js';

class Cannon extends LandUnit{
	constructor(params){//try{
		params.laser_color=new THREE.Color(9, 30, 245);
		params.shoot_delay=0.04;//thời gian delay giữa 2 lần bắn
		params.health=params.game._parameters._standard_hp;
		params.damage=params.game._parameters._standard_hp/5;
		params._blaster_radius=20;
		
		super(params);
		
		const x = 2.75;
		const y1 = 1.5;
		const y2 = 0.4;
		const z = 4.0;
		this._offsets = [//vị trí của nòng súng
			new THREE.Vector3(-x, y1, -z),
			new THREE.Vector3(x, y1, -z)
			
		];
		
		this._bound_radius=10;//cang` lon' cang` de bi ban' trung'
		
	}
	
	CheckTarget(){
		
		const _me=this._game._me;
		const _distance=_me.Position.distanceTo(this.Position);
		if(_distance<500){
			
			//do model 3D có tư thế default bị ngược
			let _pos=this.calculateSymmetricPoint(this.Position,_me.Position);
			this._model.lookAt(_pos);
			this._params.camera.lookAt(_pos);
			
			if(_distance<400)
				this.Fire();
			
		}
	
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

export{Cannon};