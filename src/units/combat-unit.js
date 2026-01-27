import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';

import {Unit} from './unit.js';
import {blaster} from './blaster.js';
import {controls} from '../controls.js';
import {thruster} from './thruster.js';

class CombatUnit extends Unit{//các phương tiện chiến đấu
	constructor(params){
		
		super(params);
		//alert(params.id);
		this._is_combat_unit=true;
		this._fireCooldown = 0.0;
		this._velocity = new THREE.Vector3(0, 0, 0);
		this._direction = new THREE.Vector3(0, 0, -1);
		//this._health = 1000.0;
		this._offsets =[];
		this._offsetIndex = 0;
		
		this._blaster_radius=params.blaster_radius;
		if(typeof this._blaster_radius==='undefined'){
			this._blaster_radius=2.0;
		}
		this._damage=params.damage;
		if(typeof this._damage==='undefined'){
			this._damage=50;
		}
		this.disable_auto_check_target=false;
		
		this._accuracy=params.accuracy;//độ chính xác của súng/vũ khí, tính theo phần trăm
		if(typeof this._accuracy==='undefined'){
			this._accuracy=80/100;
		}
		
		this._thruster_list=new Array();
	}
	
	init_blaster_and_direction(){
		
			let _blParentEntity=this;
			if(this._params.parent_entity)
				_blParentEntity=this._params.parent_entity;
			
			let _damage=this._damage;
			if(this._is_space_ship){
				_damage=this.get_space_ship_damage();
				//console.log("FOUND");
			}
			
			let _blSystem=this._params.game._entities['_combatUnitBlasterSystem'+this._params.id] = new blaster.BlasterSystem(//LASER GUN
			{
				game: this._params.game,
				camera:this._params.game._graphics.Camera,
				texture: "./resources/blaster.jpg",
				visibility: this._params.game._visibilityGrid,
				radius:this._blaster_radius,
				damage:_damage,
				parent_entity:_blParentEntity
			});
			this._params.blasterSystem=_blSystem;
		
			this._params.game._entities['combat-unit-controls'+this._params.id] = new controls.EnemyShipControls({
			target: this._params.game._entities['combat-unit-'+this._params.id],
			camera: this._params.camera	,
			scene: this._params.game._graphics.Scene,
			domElement: this._params.game._graphics._threejs.domElement,
			gui: this._params.game._gui,
			guiParams: this._params.game._guiParams,
			game:this._params.game,
			visibility: this._params.game._visibilityGrid
          });
		  
		  //Bat buoc phai lam the nay de kich hoat dieu chinh vi tri camera va huong' cua cannon
		  //Do chua biet lam sao tinh' toan'
		  //Neu bo? doan code nay thi vi tri cua cannon ko biet nam o dau
		  this._game._entities['combat-unit-controls'+this._params.id]._move.forward = true;
		  //this._entities['_controls2']._move.forward = false;
		  
		  this._controller=this._game._entities['combat-unit-controls'+this._params.id];
		  
		  
		   this._game.add_to_function_list_2(()=>{
			   this._controller._lock=true;
			   //this._model.lookAt(this.get_ahead_point(50));
			   //this._model.quaternion.copy(_rotation);
		  },1);
		  
	}
	
	//----Mot so thruster template, co the overwrite neu muon kieu khac
	init_thruster_1(){//2 tia nam ngang
		const _id1='_unit_'+this._my_unique_id+'_thruster1';
		const _id2='_unit_'+this._my_unique_id+'_thruster2';
		
		this._game._entities[_id1] = new thruster.Thruster(//LIGHT OF ENGINE
        {
            game: this._game,
			target:this,
			//camera:this._game._graphics.Camera,
            texture: "./resources/blaster.jpg",
            visibility: this._game._visibilityGrid,
			start_pos:new THREE.Vector3(0.4,1.2,2.2),
			end_pos:new THREE.Vector3(-0.4,1.2,2.2)
        });
		this._game._entities[_id2] = new thruster.Thruster(//LIGHT OF ENGINE
        {
            game: this._game,
			target:this,
			//camera:this._game._graphics.Camera,
            texture: "./resources/blaster.jpg",
            visibility: this._game._visibilityGrid,
			start_pos:new THREE.Vector3(0.4,-1,2.2),
			end_pos:new THREE.Vector3(-0.4,-1,2.2)
        });
		this._game._entities[_id1]._particleSystem.rotation.x=Math.PI/2;
		this._game._entities[_id1]._particleSystem.position.y+=3.4;
		this._game._entities[_id1]._particleSystem.position.z+=1;
		this._game._entities[_id2]._particleSystem.rotation.x=Math.PI/2;
		this._game._entities[_id2]._particleSystem.position.y+=3.4;
		this._game._entities[_id2]._particleSystem.position.z+=1;
		
		this._thruster_list.push(this._game._entities[_id1]);
		this._thruster_list.push(this._game._entities[_id2]);
	}
	
	init_thruster_2(){//1 tia nam nang va 1 tia nam doc
		const _id1='_unit_'+this._my_unique_id+'_thruster1';
		const _id2='_unit_'+this._my_unique_id+'_thruster2';
		this._game._entities[_id1] = new thruster.Thruster(//LIGHT OF ENGINE
        {
            game: this._game,
			target:this,
			//camera:this._game._graphics.Camera,
            texture: "./resources/blaster.jpg",
            visibility: this._game._visibilityGrid,
			start_pos:new THREE.Vector3(0.4,1.2,2.2),
			end_pos:new THREE.Vector3(-0.4,1.2,2.2)
        });
		this._game._entities[_id2] = new thruster.Thruster(//LIGHT OF ENGINE
        {
            game: this._game,
			target:this,
			//camera:this._game._graphics.Camera,
            texture: "./resources/blaster.jpg",
            visibility: this._game._visibilityGrid,
			start_pos:new THREE.Vector3(0.1,-1,2.2),
			end_pos:new THREE.Vector3(-0.1,-1,2.2)
        });
		
		this._game._entities[_id1]._particleSystem.rotation.x=Math.PI/2;
		this._game._entities[_id1]._particleSystem.position.y+=3.4;
		this._game._entities[_id1]._particleSystem.position.z+=1;
		
		this._game._entities[_id2]._particleSystem.rotation.x=Math.PI/2;
		this._game._entities[_id2]._particleSystem.rotation.y=Math.PI/2;
		this._game._entities[_id2]._particleSystem.position.y+=1;
		//this._game._entities[_id2]._particleSystem.position.x-=4.5;
		this._game._entities[_id1]._particleSystem.position.z+=1.5;
		this._game._entities[_id2]._particleSystem.position.x-=2.4;
		
		this._thruster_list.push(this._game._entities[_id1]);
		this._thruster_list.push(this._game._entities[_id2]);
	}
	
	turn_on_thruster(){
		
		for(let i=0;i<this._thruster_list.length;i++){
			const _p=this._thruster_list[i].CreateParticle();
			this.active_thruster(_p);
		}
		
	}
	active_thruster(p){
		p.Start = this._engine_offsets[0].clone();//vi tri nong sung'
		p.Start.applyQuaternion(this._model.quaternion);
		p.Start.add(this.Position);
		p.End = p.Start.clone();
		p.Velocity = this.Direction.clone().multiplyScalar(50.0);//hướng di chuyển
		p.Length = 0.6;
		p.Colours = [
			this._params.laser_color.clone(), new THREE.Color(0.0, 0.0, 0.0)];//màu của laser
		p.Life = 2.0;//second
		p.TotalLife = 2.0;
		p.Width = 1.5;
	}
	
	turn_off_thruster(){
		const _id1='_unit_'+this._my_unique_id+'_thruster1';
		const _id2='_unit_'+this._my_unique_id+'_thruster2';
		this._params.game._entities[_id1].Destroy();
		this._params.game._entities[_id2].Destroy();
	}
	
	get Enemy() {
		return false;
	}

	get Velocity() {
		return this._velocity;
	}

	get Direction() {
		return this._direction;
	}
	
	Update_0(timeInSeconds){//overwrite
	
		this._visibilityIndex = this._game._visibilityGrid.UpdateItem(
        this._model.uuid, this, this._visibilityIndex);
		this._fireCooldown -= timeInSeconds;
		this._burstCooldown = Math.max(this._burstCooldown, 0.0);
		this._direction.copy(this._velocity);
		this._direction.normalize();
		this._direction.applyQuaternion(this._model.quaternion);
	
		if(!this.disable_auto_check_target)
			this.CheckTarget(timeInSeconds);
		
	}
	
	Fire() {
		if (this._fireCooldown > 0.0) {
		return;
		}
		if(this._params.blaster_sound_id){
			this._params.game._sound.play(this._params.blaster_sound_id,0.5);
		}
		else{
			//this._params.game._sound.play("blaster2",0.5);
			this._params.game._sound.playSound("blaster2",this);
		}
		//this._params.game._sound.play('blaster');
		//this._params.game._sound.play('blaster');
	
		this._fireCooldown = this._params.shoot_delay;//thời gian delay giữa 2 lần bắn

		const p = this._params.blasterSystem.CreateParticle();//bắt đầu quá trình tạo một particle (hạt) mới.
		p.Start = this._offsets[this._offsetIndex].clone();//vi tri nong sung'
		p.Start.applyQuaternion(this._model.quaternion);
		p.Start.add(this.get_world_position());
		p.End = p.Start.clone();
		p.Velocity = this.Direction.clone().multiplyScalar(500.0);//hướng di chuyển
		p.Length = 50.0;//Shouldn't be too long, it will affect performance
		p.Colours = [
			this._params.laser_color.clone(), new THREE.Color(0.0, 0.0, 0.0)];//màu của laser
		p.Life = 2.0;//second
		p.TotalLife = 2.0;
		p.Width = 0.25;
	
		// thay đổi giá trị của _offsetIndex để chuẩn bị cho lần bắn tiếp theo. 
		//_offsetIndex=0->3: id cua 4 cannon
		this._offsetIndex = (this._offsetIndex + 1) % this._offsets.length;
		
		//if(this!=this._game._me)p.Colours = [
			//new THREE.Color(42, 214, 18), new THREE.Color(42, 214, 18)];
	}
}
export{CombatUnit};