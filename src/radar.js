import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';


let _vector1,_vector2,_top,_left,_player_pos,_direct;
let _target_pos,_dot,_distanceX,_distanceZ,_distance,_new_pos;
let _radar_container=document.getElementById("radar-container");
let currentRotationValue = 0; // Biến để theo dõi góc xoay hiện tại

let _old_angle=null,_new_angle=null;
let _rotate_direct=1;
let _rotation,_rotationX,_rotationY,_rotationZ;
//let _current_angle=0;
let _customAxis=null;
//let _point_O=null,_point_X=null,_point_Z=null;

class Radar{
	constructor(params){
		this._params=params;
		this._radar_frame=document.getElementById("radar-frame");
		this._target_list=new Array();
		this.radius=1400;
		this._center_point=47;//(%) khi top=left=this._center_point thi target o trung tam radar
		
		_vector1=new THREE.Vector3();
		_vector2=new THREE.Vector3();
		
	}
	
	addTarget(_unit){
		var _dot=document.createElement("div");
		_dot.classList.add("radar-target");
	
		this._radar_frame.appendChild(_dot);
		
		this._target_list.push({target:_unit,dot:_dot});
	}
	
	Update(){
		
	}
	
	Update2(){
		
		if(!this._params.game._entities["player"])return;
		
		_player_pos=this._params.game._entities["player"].get_world_position();
		_direct=this._params.game._entities["player"].get_world_direction();
		
		let _ahead_pos=findPointB(_player_pos.x,_player_pos.y,_player_pos.z,
			_direct.x, _direct.y, _direct.z, 20);//lấy 1 điểm nằm phía trước mặt của player _model
		
		
		_rotation=this._params.game._entities["player"]._model.rotation;
		_rotationX=_rotation.x;
		_rotationY=_rotation.y;
		_rotationZ=_rotation.z;
		
		//Kiểm tra xem điểm phía trước mặt nằm ở góc phần tư nào của mặt phẳng xoz
		//để tính chính xác góc quay của player, do rotation.y chỉ có giá trị trong khoảng -PI/2 đến PI2
		
		if((_ahead_pos.x>=_player_pos.x&&_ahead_pos.z<_player_pos.z)||
		   (_ahead_pos.x<=_player_pos.x&&_ahead_pos.z<_player_pos.z)){
			_rotationY=Math.PI-_rotationY;
		}
		if(_rotationX>Math.PI/2||_rotationX<-Math.PI/2){
			//_rotationY=Math.PI/2+_rotationY;
		}
		
		this.set_radar_rotation(_rotationY);
		//document.getElementById("time").innerHTML=(THREE.Math.radToDeg(_rotationX));
		
		let i;
		for(i=this._target_list.length-1;i>=0;i--){
			
			if(this._target_list[i].target._is_combat_unit===true&&
				this._target_list[i].target.Dead){
				this._target_list[i].dot.remove();
				this._target_list.splice(i,1);
				continue;
			}
			
			_target_pos=this._target_list[i].target.get_world_position();
			_dot=this._target_list[i].dot;
			
			
			_distanceX=_target_pos.x-_player_pos.x;
			_distanceZ=_target_pos.z-_player_pos.z;
			_top=(_distanceX/this.radius)*100+this._center_point;
			_left=(_distanceZ/this.radius)*100+this._center_point;
			
			_dot.style.top=parseInt(_left)+"%";
			_dot.style.left=parseInt(_top)+"%";
			
		}
		
	}
	//_radar_container
	rotate_radar_1(theta) {
		// Chuyển đổi sang độ
		const degree = (theta * 180) / Math.PI;
		currentRotationValue += degree; // Thêm 45 độ vào góc xoay hiện tại

		_radar_container.style.transform = `rotate(${currentRotationValue}deg)`;
	}
	rotate_radar_2(degree) {
		// Chuyển đổi sang độ
		//const degree = (theta * 180) / Math.PI;
		currentRotationValue += degree; // Thêm 45 độ vào góc xoay hiện tại

		_radar_container.style.transform = `rotate(${currentRotationValue}deg)`;
	}
	set_radar_rotation(theta){
		// Chuyển đổi sang độ
		const degree = (theta * 180) / Math.PI;
		currentRotationValue = degree; // Thêm 45 độ vào góc xoay hiện tại

		_radar_container.style.transform = `rotate(${currentRotationValue}deg)`;
	}
}

function calculateAngleBetweenPoints(x1, z1, x2, z2, x3, z3) {
  // Tính vectơ từ P1 đến P2
  const aX = x2 - x1;
  const aZ = z2 - z1;

  // Tính vectơ từ P1 đến P3
  const bX = x3 - x1;
  const bZ = z3 - z1;

  // Tính độ dài của vectơ a và b
  const lengthA = Math.sqrt(aX * aX + aZ * aZ);
  const lengthB = Math.sqrt(bX * bX + bZ * bZ);

  // Tính góc giữa hai vectơ
  const dotProduct = aX * bX + aZ * bZ;
  const cosTheta = dotProduct / (lengthA * lengthB);
  const theta = Math.acos(cosTheta);

  return theta;
}


//Cho diem A(x1,y1,z1) và Vector chi huong cua A la D(x2,y2,z2)
	//Tim diem B nam cach A 1 khoang theo huong D
	function findPointB(x1, y1, z1, x2, y2, z2, distance) {
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

export {Radar};