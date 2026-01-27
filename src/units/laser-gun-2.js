import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';

import {LandUnit} from './land-unit.js';
//import {SpaceShip} from './space-ship.js';
import {Utils} from './utils.js';
/*
	Thực tế ko liên quan tới LandUnit nên phần tính toán các thông số dựa trên level sẽ tạm thực hiện tại unitMG.js
*/
class LaserGun2 extends LandUnit{
	constructor(params){//try{
		params.laser_color=new THREE.Color(22, 243, 4);
		params.shoot_delay=0.5;//thời gian delay giữa 2 lần bắn
		params.accuracy=99/100;
		super(params);
		
		const x = 0.1;
		const y = 0.02;
		const z = 0.1;
		this._offsets = [//vị trí của nòng súng
			new THREE.Vector3(-x, y, -z),
			new THREE.Vector3(x, y, -z)
		];
		this._focus_target=null;
		this._utils=new Utils();
		
		//this.change_direction_mode();//khi add vào Player._model thì direction bị ảnh hưởng
	//}catch(e){alert(e.toString());}
	}
	Fire() {//overwrite
		if (this._fireCooldown > 0.0) {
		return;
		}
	
		this._params.game._sound.play('blaster');
		//this._params.game._sound.play('blaster');
	
		this._fireCooldown = this._params.shoot_delay;//thời gian delay giữa 2 lần bắn

		const p = this._params.blasterSystem.CreateParticle();//bắt đầu quá trình tạo một particle (hạt) mới.
		p.Start = this._offsets[this._offsetIndex].clone();//vi tri nong sung'
		p.Start.applyQuaternion(this._model.quaternion);
		p.Start.add(this.get_world_position());
		p.End = p.Start.clone();
		p.Velocity = this.get_world_direction().clone().multiplyScalar(500.0);//hướng di chuyển
		p.Length = 50.0;//Shouldn't be too long, it will affect performance
		p.Colours = [
			this._params.laser_color.clone(), new THREE.Color(0.0, 0.0, 0.0)];//màu của laser
		p.Life = 2.0;//second
		p.TotalLife = 2.0;
		p.Width = 0.25;
	
		// thay đổi giá trị của _offsetIndex để chuẩn bị cho lần bắn tiếp theo. 
		//_offsetIndex=0->3: id cua 4 cannon
		this._offsetIndex = (this._offsetIndex + 1) % this._offsets.length;
	}
	TakeDamage(){//overwrite
	
	};
	CheckTarget(){
		
		if(this._params.game._unitMG._combat_unit_list.length===0){
			
			return;
		}
		if(!this._object3D){
			this._object3D=new THREE.Object3D();
			
			//const geometry = new THREE.SphereGeometry( 0.5, 32, 16 ); 
			//const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
			//this._object3D = new THREE.Mesh( geometry, material ); 
			
			this._model.parent.add(this._object3D);
			this._object3D.position.set(0,5,-5);
		}
		//const _point=new THREE.Vector3(0,0,0);
		const _axis=new THREE.Vector3(0,1,0);
		this._utils.rotateAboutPoint(this._object3D, this._model.position,
									_axis, 0.1, false);
		const _world_pos=new THREE.Vector3();
		this._object3D.getWorldPosition(_world_pos);
		this._model.lookAt(_world_pos);
		
		let _found=false;
		for(var i=0;i<this._params.game._unitMG._combat_unit_list.length;i++){
				let _next_target=this._params.game._unitMG._combat_unit_list[i];
				if(!_next_target.Dead){
					const _distance=_next_target.get_world_position().distanceTo(this._params.game._me.get_world_position());
					if(_distance<100){
						
						_found=true;
						break;
					}
					
				}
			}
		
		
		if(_found){
			
			this.Fire();
		}
		
	}
	/*
	Update_0(timeInSeconds){//overwrite
	
		this._visibilityIndex = this._game._visibilityGrid.UpdateItem(
        this._model.uuid, this, this._visibilityIndex);
		this._fireCooldown -= timeInSeconds;
		this._burstCooldown = Math.max(this._burstCooldown, 0.0);
		//this._direction.copy(this._velocity);
		//this._direction.normalize();
		//this._direction.applyQuaternion(this._model.quaternion);
		
		this._model.rotation.y+=0.01;
	
		if(!this.disable_auto_check_target)
			this.CheckTarget(timeInSeconds);
		
	}
	*/
}

export{LaserGun2};