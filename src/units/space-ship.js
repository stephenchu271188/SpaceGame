import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';

//import {Unit} from './unit.js';
//import {Rocket} from './rocket.js';
import {Rocket1} from './rocket-1.js';
import {Rocket2} from './rocket-2.js';
import {Rocket3} from './rocket-3.js';
import {Rocket4} from './rocket-4.js';
import {Spacecraft} from './spacecraft.js';
import {ShipPackage} from '../ship-package.js';
import {RocketPackage} from '../rocket-package.js';
import {ParticleSystem} from '../particle-system.js';

import {LightBall} from './skills/light-ball.js';
import {IceStorm} from './skills/ice-storm.js';
//import {FireBreathing} from './skills/fire-breathing.js';

import {Sparks1} from './skills/spark-1.js';
import {Sparks2} from './skills/spark-2.js';

let _laser_id_1=0;

class SpaceShip extends Spacecraft {
	constructor(params){
		super(params);
		
		this._is_space_ship=true;
		this._model._is_space_ship=true;
		
		if(typeof params.ship_package==='undefined'||params.ship_package===null){
			
			this._ship_package=new ShipPackage({game:this._game});
		}
		else{
			this._ship_package=params.ship_package;
		}
		
		if(typeof params.level_rate==='undefined'||params.level_rate===null){//he so nhan
			
			this._level_rate=1;//rat quan trong, moi spaceship co leve_rate cang lon thi cang manh
		}
		else{
			this._level_rate=params.level_rate;
		}
		
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
		
		this._applied_skill_num=0;//dem' so' lan da su dung skill
		
		this._rocket_package=new RocketPackage({game:this._game,unit:this});
		
		//this._rocket_skill_infors=[{
			//{id:1,name:"additional-rocket-1",fc:()=>{this.apply_additional_skill_simple_rocket(this,2);}}
		//}];
		
		
		//*Chu y: can than xem xet co clone hoan toan hay chua
		this._new_params=Object.assign({},params);//clone de su dung tinh toan cac thong so sau khi ap dung level
		this.apply_space_ship_level_package();
	}
	
	init_simple_rocket_package(){//su dung cho che do multi-player, cho enemy-ship, ko ro vi sao rocket_package=undefined
		this._rocket_package=new RocketPackage({game:this._game,unit:this});
	}
	
	get_applied_skill_num(){
		return this._applied_skill_num;
	}
	reset_applied_skill_num(){
		this._applied_skill_num=0;
	}
	
	//*Su dung cho cach truy cap cu, cach truy cap moi la su dung cac function ben duoi
	//Vi du nhu get_space_ship_level
	apply_space_ship_level_package(){//tang them cac chi so dua theo level
		const params=this._params;
		const _ship_level=this._ship_package.get_ship_level();
		//console.log("ShipLevel="+_ship_level);
		
		params.shoot_delay=this.get_space_ship_fire_rate();
	
		this._max_health=this.get_space_ship_hp_by_level(_ship_level);
		//console.log("HP====="+this._max_health);
		this._health=this._max_health;
		this._params.health=this._max_health;
		
		params.damage=this.get_space_ship_damage_by_level(_ship_level);
		this._damage=params.damage;
		//alert(this._damage);
		//console.log("HP====="+this._health);
	}
	get_space_ship_level(){
		return this._ship_package.get_ship_level();
	}
	get_space_ship_hp(){//hp o level hien tai
		return this.get_space_ship_hp_by_level(this._ship_package.get_ship_level());
	}
	get_space_ship_max_level_hp(){//max hp khi o level cao  nhat
		return this.get_space_ship_hp_by_level(this._ship_package._max_ship_level);
	}
	get_space_ship_hp_by_level(_ship_level){
		const params=this._new_params;
		const _rs=params.health+params.health*this._level_rate*_ship_level/100;
		return _rs;
	}
	get_space_ship_damage(){//damage o level hien tai
		const _ship_level=this.get_space_ship_level();
		return this.get_space_ship_damage_by_level(_ship_level);
	}
	get_space_ship_max_level_damage(){//max damage khi o level cao nhat
		return this.get_space_ship_damage_by_level(this._ship_package._max_ship_level);
	}
	get_space_ship_damage_by_level(_ship_level){
		const params=this._new_params;
		const _rs=params.damage+params.damage*this._level_rate*_ship_level/100;
		return _rs;
	}
	get_space_ship_max_speed(){
		if(this._new_params.speed_list)
			return this._new_params.speed_list[this._new_params.speed_list.length-1];
		return 0;
	}
	get_space_ship_fire_rate(){//lay toc do ban o level hien tai
		const _ship_level=this.get_space_ship_level();
		return this.get_space_ship_fire_rate_by_level(_ship_level);
	}
	get_space_ship_fire_rate_by_level(_ship_level){
		const params=this._new_params;
		const _min_fire_rate=0.01;
		
		let _rs=params.shoot_delay-params.shoot_delay*this._level_rate*_ship_level/80;
		//console.log("Default="+params.shoot_delay);
		//console.log("Value="+params.shoot_delay*this._level_rate*_ship_level/10);
		//console.log("Result="+_rs);
		if(_rs<_min_fire_rate)_rs=_min_fire_rate;
		return _rs;
	}
	get_space_ship_max_fire_rate(){//toc do ban' lau nhat(delay lon' nhat)
		return this.get_space_ship_fire_rate_by_level(1);
	}
	get_space_ship_min_fire_rate(){//toc do ban nhanh nhat(delay cham nhat)
		return this.get_space_ship_fire_rate_by_level(this._ship_package._max_ship_level);
	}
	
	equip_items(){
		//try{
		let _item_id1=this._ship_package.get_current_auxiliary_id(1);
		if(_item_id1!=null){
			let _item_name1=this._ship_package.get_current_auxiliary_name(1);
			let _item_level1=this._ship_package.get_auxiliary_object_level(1,_item_id1);
			let _create_fc1=this._game._parameters.get_auxiliary_create_fc(_item_id1);
			_create_fc1(this,new THREE.Vector3(-7,5,-10),_item_level1);//z la chieu ngang
		}
		
		let _item_id2=this._ship_package.get_current_auxiliary_id(2);
		if(_item_id2!=null){
			let _item_name2=this._ship_package.get_current_auxiliary_name(2);
			let _item_level2=this._ship_package.get_auxiliary_object_level(2,_item_id2);
			let _create_fc2=this._game._parameters.get_auxiliary_create_fc(_item_id2);
			_create_fc2(this,new THREE.Vector3(7,5,-10),_item_level2);
		}
		//}catch(e){alert(e.stack);}
	}
	
	apply_passive_skill_multi_rocket_1(_shipclass,_level){//bắn về phía trước
		//alert("hello1");
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("passive_multi_rocket_1");
		}
		//_shipclass._game._entities['_controls2'].UpdateCamera=_shipclass._game._entities['_controls2'].UpdateCamera_2;
		//_shipclass._game._entities['_controls2']._camera_altitude=50;
		let _pos_list=[
			_shipclass.getBackPos(100),
			
			_shipclass.getBackRightPos(50,50),
			_shipclass.getBackLeftPos(50,50),
			
			//_shipclass.getBackAbovePos(50,50),
			//_shipclass.getBackBellowPos(50,50)
		];
		
		_shipclass.apply_passive_skill_multi_rocket(_shipclass,_level,_pos_list);
		/*
		const _start_pos=_shipclass.Position;
		for(let i=0;i<_pos_list.length;i++){
			let gltf=_shipclass._game._unitMG._data_list["missile-1"];
			const model = gltf.scene.children[0];
			model.scale.setScalar(3.5);
			model.rotation.z=Math.PI;
			let _rocket=_shipclass._game._unitMG.create_uncombat_unit(Rocket2,model,_start_pos,false);
			_rocket._unit=_shipclass;
			_rocket._player_id=_shipclass._player_id;
			let _plus_damage=_rocket._damage*(this._game._parameters.spaceship_passive_skills_level_rate*_level);
			_rocket._damage+=_plus_damage;
			//this._game._noticeBoard.add_message("PassiveDamage1:"+_rocket._damage);
			_rocket.launch('particle35',14);
			this._game._graphics.Scene.add(_rocket._model);
			_rocket._model.lookAt(_pos_list[i]);
			
		}
		_shipclass._game._sound.play('rocket-7');
		*/
	}
	
	apply_passive_skill_multi_rocket(_shipclass,_level,_pos_list){
		//if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			//_shipclass._game._client.add_action("passive_multi_rocket_3");
		//}
		const _start_pos=_shipclass.Position;
		for(let i=0;i<_pos_list.length;i++){
			let gltf=_shipclass._game._unitMG._data_list["missile-1"];
			const model = gltf.scene.children[0];
			model.scale.setScalar(3.5);
			model.rotation.z=Math.PI;
			let _rocket=_shipclass._game._unitMG.create_uncombat_unit(Rocket2,model,_start_pos,false);
			_rocket._unit=_shipclass;
			_rocket._player_id=_shipclass._player_id;
			_rocket.launch('particle35',8);
			let _plus_damage=_rocket._damage*(_shipclass._game._parameters.spaceship_passive_skills_level_rate*_level);
			_rocket._damage+=_plus_damage;
			//this._game._noticeBoard.add_message("PassiveDamage2:"+_rocket._damage);
			_shipclass._game._graphics.Scene.add(_rocket._model);
			_rocket._model.lookAt(_pos_list[i]);
		}
		_shipclass._game._sound.playSound('rocket-7',_shipclass);
	}
	apply_passive_skill_multi_rocket_6(_shipclass,_level){//ban' len phia tren
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("passive_multi_rocket_6");
		}
		//_shipclass._game._entities['_controls2'].UpdateCamera=_shipclass._game._entities['_controls2'].UpdateCamera_2;
		//_shipclass._game._entities['_controls2']._camera_altitude=50;
		let _pos_list=[
			_shipclass.getBellowPos(100),
			
			_shipclass.getFrontBellowPos(50,500),
			_shipclass.getBackBellowPos(50,500),
			
			//_shipclass.getFrontAbovePos(50,50),
			//_shipclass.getFrontBellowPos(50,50)
		];
		
		_shipclass.apply_passive_skill_multi_rocket(_shipclass,_level,_pos_list);
	}
	apply_passive_skill_multi_rocket_5(_shipclass,_level){//ban' xuong phia duoi
	    if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("passive_multi_rocket_5");
		}
		//_shipclass._game._entities['_controls2'].UpdateCamera=_shipclass._game._entities['_controls2'].UpdateCamera_2;
		//_shipclass._game._entities['_controls2']._camera_altitude=50;
		let _pos_list=[
			_shipclass.getAbovePos(100),
			
			_shipclass.getFrontAbovePos(50,500),
			_shipclass.getBackAbovePos(50,500),
			
			//_shipclass.getFrontAbovePos(50,50),
			//_shipclass.getFrontBellowPos(50,50)
		];
		
		_shipclass.apply_passive_skill_multi_rocket(_shipclass,_level,_pos_list);
	}
	
	apply_passive_skill_multi_rocket_4(_shipclass,_level){//bắn về ben trai'
	    if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("passive_multi_rocket_4");
		}
	    //_shipclass._game._entities['_controls2'].UpdateCamera=_shipclass._game._entities['_controls2'].UpdateCamera_2;
		let _pos_list=[
			_shipclass.getRightPos(100),
			
			_shipclass.getFrontRightPos(50,50),
			_shipclass.getBackRightPos(50,50),
			
			//_shipclass.getFrontAbovePos(50,50),
			//_shipclass.getFrontBellowPos(50,50)
		];
		
		_shipclass.apply_passive_skill_multi_rocket(_shipclass,_level,_pos_list);
	}
	apply_passive_skill_multi_rocket_3(_shipclass,_level){//bắn về ben phai?
	    if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("passive_multi_rocket_3");
		}
	    //_shipclass._game._entities['_controls2'].UpdateCamera=_shipclass._game._entities['_controls2'].UpdateCamera_2;
		let _pos_list=[
			_shipclass.getLeftPos(100),
			
			_shipclass.getFrontLeftPos(50,50),
			_shipclass.getBackLeftPos(50,50),
			
			//_shipclass.getFrontAbovePos(50,50),
			//_shipclass.getFrontBellowPos(50,50)
		];
		
		_shipclass.apply_passive_skill_multi_rocket(_shipclass,_level,_pos_list);
	}
	
	apply_passive_skill_multi_rocket_2(_shipclass,_level){//bắn về phía sau
	    if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("passive_multi_rocket_2");
		}
		//_shipclass._game._entities['_controls2'].UpdateCamera=_shipclass._game._entities['_controls2'].UpdateCamera_2;
		//_shipclass._game._entities['_controls2']._camera_altitude=50;
		let _pos_list=[
			_shipclass.getFrontPos(100),
			
			_shipclass.getFrontRightPos(50,50),
			_shipclass.getFrontLeftPos(50,50),
			
			_shipclass.getFrontAbovePos(50,50),
			_shipclass.getFrontBellowPos(50,50)
		];
		_shipclass.apply_passive_skill_multi_rocket(_shipclass,_level,_pos_list);
		/*
		const _start_pos=_shipclass.Position;
		for(let i=0;i<_pos_list.length;i++){
			let gltf=_shipclass._game._unitMG._data_list["missile-1"];
			const model = gltf.scene.children[0];
			model.scale.setScalar(3.5);
			model.rotation.z=Math.PI;
			let _rocket=_shipclass._game._unitMG.create_uncombat_unit(Rocket2,model,_start_pos,false);
			_rocket._unit=_shipclass;
			_rocket._player_id=_shipclass._player_id;
			_rocket.launch('particle35',14);
			let _plus_damage=_rocket._damage*(this._game._parameters.spaceship_passive_skills_level_rate*_level);
			_rocket._damage+=_plus_damage;
			//this._game._noticeBoard.add_message("PassiveDamage2:"+_rocket._damage);
			this._game._graphics.Scene.add(_rocket._model);
			_rocket._model.lookAt(_pos_list[i]);
		}
		_shipclass._game._sound.play('rocket-7');
		*/
	}
	
	apply_passive_skill_circling_rocket(_shipclass,_level){
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("passive_circling_rocket");
		}
		let _pos1=_shipclass.get_ahead_point(15);
		let _pos2=_shipclass.get_ahead_point(150);
		
		let gltf=_shipclass._game._unitMG._data_list["missile-1"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(3.5);
		model.rotation.z=Math.PI;
		let _rocket=_shipclass._game._unitMG.create_uncombat_unit(CirclingRocket,model,_pos1,false);
		_rocket._unit=_shipclass;
		_rocket._player_id=_shipclass._player_id;
		let _plus_damage=_rocket._damage*(_shipclass._game._parameters.spaceship_passive_skills_level_rate*_level);
			_rocket._damage+=_plus_damage;
			//this._game._noticeBoard.add_message("PassiveDamage3:"+_rocket._damage);
		_shipclass._game._graphics.Scene.add(_rocket._model);
		_rocket._model.lookAt(_pos2);
		_shipclass._game._sound.playSound('rocket-3',_shipclass);
	}
	
	apply_passive_skill_self_healing_1(_shipclass,_level){
		try{
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("passive_self_healing_1");
		}
		let _plus_hp=_shipclass._game._parameters._standard_hp*10;
			_plus_hp+=(_level-1)*(_shipclass._game._parameters._standard_hp/30);
			_plus_hp=parseInt(_plus_hp);
		
		let _current_hp=_shipclass._health;
		let _max_hp=_shipclass._max_health;
		if(_current_hp+_plus_hp>_max_hp)
			_shipclass._health=_max_hp;
		else
			_shipclass._health=_current_hp+_plus_hp;
		
		if(_shipclass._hpBar)_shipclass._hpBar.add(Math.ceil((_plus_hp/_max_hp)*100));
		
		let _object=new THREE.Object3D();
		_shipclass._model.add(_object);
		_object.position.set(0,3,0);
		_shipclass._simple_shield = new GlowingEffect({
			game:_shipclass._game,
			parent:_object,
			camera: _shipclass._game._graphics.Camera,
			position:new THREE.Vector3(0,0,0),
			particle_id:'particle2'
		});
			
		let _update_shield=(timeElapsedS)=>{
			
			_shipclass._simple_shield.Step(timeElapsedS);
		};
		_shipclass._game.add_to_update_function_list(_update_shield);
		_shipclass.add_to_after_dead_function_list(()=>{
			_shipclass._game.remove_function_from_update_list(_update_shield);
		});
		_shipclass._game.add_to_timer(()=>{
			_shipclass._game.remove_function_from_update_list(_update_shield);
			_shipclass._model.remove(_object);
		},4);
		/*
		let _effect2=new HeartEffect({game:_shipclass._game,unit:_shipclass});
			_shipclass._game.add_to_timer(()=>{
				_effect2.destroy_effect();
			},3);
			*/
		//_shipclass._game._noticeBoard.show();
		//_shipclass._game._noticeBoard.add_message("HP-Plus:"+_plus_hp);
		//_shipclass._game._noticeBoard.add_message("HP-After:"+_shipclass._health);
		
		}catch(e){alert(e.stack);}
	}
	
	apply_additional_skill_strengthen_default_weapon_1(_shipclass,_level){//tang suc manh laser gun mac dinh
		//try{
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("additional_strengthen_default_weapon_1");
		}
		
		let _damage=_shipclass._params.blasterSystem._damage;
		let _delay=_shipclass._params.shoot_delay;
		let _width_rate=_shipclass._params.blasterSystem._width_rate;
		let _color=_shipclass._params.laser_color.clone();
		
		_shipclass._params.blasterSystem._width_rate=_width_rate*3;
		_shipclass._params.shoot_delay=0.025;
		_shipclass._params.blasterSystem._damage=_damage*5;
		//_shipclass._params.laser_color=new THREE.Color(0xf1fb1d);
		
		let _min_duration=4;
		let _duration=_min_duration;
		_duration+=(_level-1)*0.5;
		_duration=Math.ceil(_duration);
		_shipclass._game.add_to_timer(()=>{
			_shipclass._params.blasterSystem._width_rate=_width_rate;
			_shipclass._params.shoot_delay=_delay;
			_shipclass._params.blasterSystem._damage=_damage;
			_shipclass._params.laser_color=_color;
		},_duration);
		
		//}catch(e){alert(e.stack);}
	}
	
	apply_additional_skill_spinning_4(_shipclass,_level){//1 fire unit+ 1 freeze unit quay tron xung quanh ship
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("additional_spinning_4");
		}
		
		let _position=_shipclass.Position;
		if(typeof this._spinning_4_pos_list==='undefined'){//init params
			this._applying_add_skill_spinning_4=false;
			//_shipclass._game._entities['_controls2'].UpdateCamera=_shipclass._game._entities['_controls2'].UpdateCamera_2;
			const _radius=30;
			const _point_num=4;
			
			const _center=new THREE.Vector3(0,0,0);
			const _p1=_center.clone();_p1.x+=_radius;
			const _p2=_center.clone();_p2.z-=_radius;//bắt buộc phải sử dụng tọa độ x ở p1 và z ở p2 thì mới ra kết quả chính xác
		    
			this._spinning_4_obj_list=new Array();
			this._spinning_4_pos_list=_shipclass._game._utils.createPointsOnCircle(_center,_p1,_p2,_point_num);
			
			for(let i=0;i<this._spinning_4_pos_list.length;i++){
				const _obj=new THREE.Object3D();
					  _shipclass._model.add(_obj);
					  _obj.position.copy(this._spinning_4_pos_list[i]);
					  
					  this._spinning_4_obj_list.push(_obj);
			}
			
			let _cen_pos=new THREE.Vector3(0,0,0);
			let _axis=_shipclass._game._utils.axisY;
			this._add_skill_spinning_4_update_fc=(t)=>{
				_shipclass._game._utils.rotateAboutPoint(this._spinning_4_obj_list[0],_cen_pos,_axis,t*1.1,false);
				_shipclass._game._utils.rotateAboutPoint(this._spinning_4_obj_list[2],_cen_pos,_axis,t*1.1,false);
			};
			_shipclass._game.add_to_update_function_list(this._add_skill_spinning_4_update_fc);
		}
		
		if(this._applying_add_skill_spinning_4===true)
			return;
		this._applying_add_skill_spinning_4=true;
		
		let gltf=_shipclass._game._unitMG._data_list["missile-1"];
			const model1 = gltf.scene.children[0];
			model1.scale.setScalar(2.5);
			model1.rotation.z=Math.PI;
			model1.visible=false;
			const model2=model1.clone();
			
			const _start_pos1=new THREE.Vector3();
			this._spinning_4_obj_list[0].getWorldPosition(_start_pos1);
			let _rocket1=_shipclass._game._unitMG.create_uncombat_unit(Rocket2,model1,_start_pos1,false);
			_rocket1._unit=_shipclass;
			_rocket1._player_id=_shipclass._player_id;
			_rocket1.emit_time=5.0;
			_rocket1.emitter_life=1.0;
			_rocket1.launch('particle7',8);
			_shipclass._game._graphics.Scene.add(_rocket1._model);
			
			const _start_pos2=new THREE.Vector3();
			this._spinning_4_obj_list[2].getWorldPosition(_start_pos2);
			let _rocket2=_shipclass._game._unitMG.create_uncombat_unit(Rocket2,model2,_start_pos2,false);
			_rocket2._unit=_shipclass;
			_rocket2._player_id=_shipclass._player_id;
			_rocket2.emit_time=5.0;
			_rocket2.emitter_life=1.0;
			_rocket2.launch('particle18',8);
			_shipclass._game._graphics.Scene.add(_rocket2._model);
			
			_shipclass._game._sound.playSound('rocket-7',_shipclass);
			let _damage=80;
		    _damage+=_level*10;
			
			let _current_pos1=new THREE.Vector3();
			_rocket1.CheckTarget=(t)=>{
				this._spinning_4_obj_list[0].getWorldPosition(_current_pos1);
				_rocket1._model.position.copy(_current_pos1);
				const _targets=_shipclass._game._unitMG.get_enemy_combat_unit_in_range_3(_shipclass,_current_pos1,30);
				for(let i=0;i<_targets.length;i++){
					_targets[i][0].Take_Damage(_shipclass,_shipclass.constructor.name,null,t*_damage);
				}
			};
			
			let _current_pos2=new THREE.Vector3();
			_rocket2.CheckTarget=(t)=>{
				this._spinning_4_obj_list[2].getWorldPosition(_current_pos2);
				_rocket2._model.position.copy(_current_pos2);
				const _targets=_shipclass._game._unitMG.get_enemy_combat_unit_in_range_3(_shipclass,_current_pos2,30);
				for(let i=0;i<_targets.length;i++){
					_targets[i][0].Take_Damage(_shipclass,_shipclass.constructor.name,null,t*_damage);
				}
			};
		
		const _duration=12;
		_shipclass._game.add_to_timer(()=>{
			_rocket1.SelfDestroy();
			_rocket2.SelfDestroy();
			this._applying_add_skill_spinning_4=false;
		},_duration);
		
	}
	
	apply_additional_skill_spinning_3(_shipclass,_level){//2 fire unit quay tron xung quanh ship
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("additional_spinning_3");
		}
		
		let _position=_shipclass.Position;
		if(typeof this._spinning_3_pos_list==='undefined'){//init params
			this._applying_add_skill_spinning_3=false;
			//_shipclass._game._entities['_controls2'].UpdateCamera=_shipclass._game._entities['_controls2'].UpdateCamera_2;
			const _radius=30;
			const _point_num=4;
			
			const _center=new THREE.Vector3(0,0,0);
			const _p1=_center.clone();_p1.x+=_radius;
			const _p2=_center.clone();_p2.z-=_radius;//bắt buộc phải sử dụng tọa độ x ở p1 và z ở p2 thì mới ra kết quả chính xác
		    
			this._spinning_3_obj_list=new Array();
			this._spinning_3_pos_list=_shipclass._game._utils.createPointsOnCircle(_center,_p1,_p2,_point_num);
			
			for(let i=0;i<this._spinning_3_pos_list.length;i++){
				const _obj=new THREE.Object3D();
					  _shipclass._model.add(_obj);
					  _obj.position.copy(this._spinning_3_pos_list[i]);
					  
					  this._spinning_3_obj_list.push(_obj);
			}
			
			let _cen_pos=new THREE.Vector3(0,0,0);
			let _axis=_shipclass._game._utils.axisY;
			this._add_skill_spinning_3_update_fc=(t)=>{
				_shipclass._game._utils.rotateAboutPoint(this._spinning_3_obj_list[0],_cen_pos,_axis,t*1.1,false);
				_shipclass._game._utils.rotateAboutPoint(this._spinning_3_obj_list[2],_cen_pos,_axis,t*1.1,false);
			};
			_shipclass._game.add_to_update_function_list(this._add_skill_spinning_3_update_fc);
		}
		
		if(this._applying_add_skill_spinning_3===true)
			return;
		this._applying_add_skill_spinning_3=true;
		
		let gltf=_shipclass._game._unitMG._data_list["missile-1"];
			const model1 = gltf.scene.children[0];
			model1.scale.setScalar(2.5);
			model1.rotation.z=Math.PI;
			model1.visible=false;
			const model2=model1.clone();
			
			const _start_pos1=new THREE.Vector3();
			this._spinning_3_obj_list[0].getWorldPosition(_start_pos1);
			let _rocket1=_shipclass._game._unitMG.create_uncombat_unit(Rocket2,model1,_start_pos1,false);
			_rocket1._unit=_shipclass;
			_rocket1._player_id=_shipclass._player_id;
			_rocket1.emit_time=5.0;
			_rocket1.emitter_life=1.0;
			_rocket1.launch('particle7',8);
			_shipclass._game._graphics.Scene.add(_rocket1._model);
			
			const _start_pos2=new THREE.Vector3();
			this._spinning_3_obj_list[2].getWorldPosition(_start_pos2);
			let _rocket2=_shipclass._game._unitMG.create_uncombat_unit(Rocket2,model2,_start_pos2,false);
			_rocket2._unit=_shipclass;
			_rocket2._player_id=_shipclass._player_id;
			_rocket2.emit_time=5.0;
			_rocket2.emitter_life=1.0;
			_rocket2.launch('particle7',8);
			_shipclass._game._graphics.Scene.add(_rocket2._model);
			
			_shipclass._game._sound.playSound('rocket-7',_shipclass);
			let _damage=80;
		    _damage+=_level*10;
			
			let _current_pos1=new THREE.Vector3();
			_rocket1.CheckTarget=(t)=>{
				this._spinning_3_obj_list[0].getWorldPosition(_current_pos1);
				_rocket1._model.position.copy(_current_pos1);
				const _targets=_shipclass._game._unitMG.get_enemy_combat_unit_in_range_3(_shipclass,_current_pos1,30);
				for(let i=0;i<_targets.length;i++){
					_targets[i][0].Take_Damage(_shipclass,_shipclass.constructor.name,null,t*_damage);
				}
			};
			
			let _current_pos2=new THREE.Vector3();
			_rocket2.CheckTarget=(t)=>{
				this._spinning_3_obj_list[2].getWorldPosition(_current_pos2);
				_rocket2._model.position.copy(_current_pos2);
				const _targets=_shipclass._game._unitMG.get_enemy_combat_unit_in_range_3(_shipclass,_current_pos2,30);
				for(let i=0;i<_targets.length;i++){
					_targets[i][0].Take_Damage(_shipclass,_shipclass.constructor.name,null,t*_damage);
				}
			};
		
		const _duration=12;
		_shipclass._game.add_to_timer(()=>{
			_rocket1.SelfDestroy();
			_rocket2.SelfDestroy();
			this._applying_add_skill_spinning_3=false;
		},_duration);
		
	}
	
	apply_additional_skill_spinning_2(_shipclass,_level){//2 freezing unit quay tron xung quanh ship
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("additional_spinning_2");
		}
		//try{
		let _position=_shipclass.Position;
		if(typeof this._spinning_2_pos_list==='undefined'){//init params
			this._applying_add_skill_spinning_2=false;
			//_shipclass._game._entities['_controls2'].UpdateCamera=_shipclass._game._entities['_controls2'].UpdateCamera_2;
			const _radius=30;
			const _point_num=4;
			
			const _center=new THREE.Vector3(0,0,0);
			const _p1=_center.clone();_p1.x+=_radius;
			const _p2=_center.clone();_p2.z-=_radius;//bắt buộc phải sử dụng tọa độ x ở p1 và z ở p2 thì mới ra kết quả chính xác
		    
			this._spinning_2_obj_list=new Array();
			this._spinning_2_pos_list=_shipclass._game._utils.createPointsOnCircle(_center,_p1,_p2,_point_num);
			
			for(let i=0;i<this._spinning_2_pos_list.length;i++){
				const _obj=new THREE.Object3D();
					  _shipclass._model.add(_obj);
					  _obj.position.copy(this._spinning_2_pos_list[i]);
					  
					  this._spinning_2_obj_list.push(_obj);
			}
			
			let _cen_pos=new THREE.Vector3(0,0,0);
			let _axis=_shipclass._game._utils.axisY;
			this._add_skill_spinning_2_update_fc=(t)=>{
				_shipclass._game._utils.rotateAboutPoint(this._spinning_2_obj_list[0],_cen_pos,_axis,t*1.1,false);
				_shipclass._game._utils.rotateAboutPoint(this._spinning_2_obj_list[2],_cen_pos,_axis,t*1.1,false);
			};
			_shipclass._game.add_to_update_function_list(this._add_skill_spinning_2_update_fc);
		}
		
		if(this._applying_add_skill_spinning_2===true)
			return;
		this._applying_add_skill_spinning_2=true;
		
		let gltf=_shipclass._game._unitMG._data_list["missile-1"];
			const model1 = gltf.scene.children[0];
			model1.scale.setScalar(2.5);
			model1.rotation.z=Math.PI;
			model1.visible=false;
			const model2=model1.clone();
			
			const _start_pos1=new THREE.Vector3();
			this._spinning_2_obj_list[0].getWorldPosition(_start_pos1);
			let _rocket1=_shipclass._game._unitMG.create_uncombat_unit(Rocket2,model1,_start_pos1,false);
			_rocket1._unit=_shipclass;
			_rocket1._player_id=_shipclass._player_id;
			_rocket1.emit_time=5.0;
			_rocket1.emitter_life=1.0;
			_rocket1.launch('particle18',8);
			_shipclass._game._graphics.Scene.add(_rocket1._model);
			
			const _start_pos2=new THREE.Vector3();
			this._spinning_2_obj_list[2].getWorldPosition(_start_pos2);
			let _rocket2=_shipclass._game._unitMG.create_uncombat_unit(Rocket2,model2,_start_pos2,false);
			_rocket2._unit=_shipclass;
			_rocket2._player_id=_shipclass._player_id;
			_rocket2.emit_time=5.0;
			_rocket2.emitter_life=1.0;
			_rocket2.launch('particle18',8);
			_shipclass._game._graphics.Scene.add(_rocket2._model);
			
			_shipclass._game._sound.playSound('rocket-7',_shipclass);
			let _damage=80;
		    _damage+=_level*10;
			
			let _current_pos1=new THREE.Vector3();
			_rocket1.CheckTarget=(t)=>{
				this._spinning_2_obj_list[0].getWorldPosition(_current_pos1);
				_rocket1._model.position.copy(_current_pos1);
				const _targets=_shipclass._game._unitMG.get_enemy_combat_unit_in_range_3(_shipclass,_current_pos1,30);
				for(let i=0;i<_targets.length;i++){
					_targets[i][0].Take_Damage(_shipclass,_shipclass.constructor.name,null,t*_damage);
				}
			};
			
			let _current_pos2=new THREE.Vector3();
			_rocket2.CheckTarget=(t)=>{
				this._spinning_2_obj_list[2].getWorldPosition(_current_pos2);
				_rocket2._model.position.copy(_current_pos2);
				const _targets=_shipclass._game._unitMG.get_enemy_combat_unit_in_range_3(_shipclass,_current_pos2,30);
				for(let i=0;i<_targets.length;i++){
					_targets[i][0].Take_Damage(_shipclass,_shipclass.constructor.name,null,t*_damage);
				}
			};
		
		const _duration=12;
		_shipclass._game.add_to_timer(()=>{
			_rocket1.SelfDestroy();
			_rocket2.SelfDestroy();
			this._applying_add_skill_spinning_2=false;
		},_duration);
		
		//}catch(e){alert(e.stack);}
	}
	apply_additional_skill_energy_storm_1(_shipclass,_level){
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("additional_energy_storm_1");
		}
		if(typeof _shipclass._performing_energy_storm_1==='undefined')
			_shipclass._performing_energy_storm_1=false;
		if(_shipclass._performing_energy_storm_1===true)
			return;
		_shipclass._performing_energy_storm_1=true;
		
		let _damage=200;
		    _damage+=_level*_shipclass._game._parameters._standard_hp/30;
			
		let _shoot=()=>{
			let _sparks = new Sparks1({
				 game:_shipclass._game,
				parent:_shipclass._game._graphics.Scene,
				camera: _shipclass._game._graphics.Camera,
				position:new THREE.Vector3(0,0,0),
				particle_id:'particle17',
				color1:'turquoise',
				color2:'turquoise',
				particle_size:0.6,
				velocity:{x:0,y:0,z:0},
				drift_range:{x:0.1,y:0.1,z:0.1}
			});
			_sparks._points.position.copy(_shipclass.Position);
			_sparks.set_alpha(1);
			
		_shipclass._game._sound.playSound("teleport",_shipclass);
		
		let _update1=(t)=>{
			_sparks._points.position.copy(_shipclass.getFrontAbovePos(8,2));
		};
		
		let _target_pos=null;
		let _update2=(t)=>{
			//try{
			if(_target_pos===null)
				_target_pos=_shipclass.getFrontPos(3000);
			
			const _next_pos=_shipclass._game._utils.translatePoint(_sparks._points.position.clone(), 
																_target_pos, t*200);
			_sparks._points.position.copy(_next_pos);
			const _targets=_shipclass._game._unitMG.get_enemy_combat_unit_in_range_3(_shipclass,_sparks._points.position,60);
			for(let i=0;i<_targets.length;i++){
				_targets[i][0].Take_Damage(_shipclass,_shipclass.constructor.name,null,t*_damage);
			}
			//}catch(e){alert(e.stack);}
		};
			
			_shipclass._game.add_to_update_function_list(_update1);
			_shipclass._game.add_to_timer(()=>{
				_shipclass._game.remove_function_from_update_list(_update1);
				_shipclass._game.add_to_update_function_list(_update2);
				_shipclass._game._sound.playSound("rocket-5",_shipclass);
			},2);
			
			_shipclass._game.add_to_timer(()=>{
				_shipclass._game.remove_function_from_update_list(_update2);
				_sparks._Clear();
				_shipclass._performing_energy_storm_1=false;
			},5);
		};
		
		_shoot();
		_shipclass._game.add_to_timer(()=>{
			_shoot();
		},1);
		_shipclass._game.add_to_timer(()=>{
			_shoot();
		},2);
		
	}
	apply_additional_skill_ice_storm_1(_shipclass,_level){
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("additional_ice_storm_1");
		}
		if(typeof _shipclass._performing_ice_storm_1==='undefined')
			_shipclass._performing_ice_storm_1=false;
		if(_shipclass._performing_ice_storm_1===true)
			return;
		_shipclass._performing_ice_storm_1=true;
		
		let _damage=300;
		    _damage+=_level*_shipclass._game._parameters._standard_hp/30;
			
		let _shoot=()=>{
			let _storm=new IceStorm({game:_shipclass._game,parent_object:_shipclass._game._graphics.Scene});
			//_storm._sparks._points.position.set(0,3,0);
			_storm._sparks._points.position.copy(_shipclass.Position);
			_storm.set_alpha(1);
		
		_shipclass._game._sound.playSound("teleport",_shipclass);
		
		let _update1=(t)=>{
			_storm._sparks._points.position.copy(_shipclass.getFrontAbovePos(14,2));
		};
		
		let _target_pos=null;
		let _update2=(t)=>{
			//try{
			if(_target_pos===null)
				_target_pos=_shipclass.getFrontPos(3000);
			
			const _next_pos=_shipclass._game._utils.translatePoint(_storm._sparks._points.position.clone(), 
																_target_pos, t*200);
			_storm._sparks._points.position.copy(_next_pos);
			const _targets=_shipclass._game._unitMG.get_enemy_combat_unit_in_range_3(_shipclass,_storm._sparks._points.position,60);
			for(let i=0;i<_targets.length;i++){
				_targets[i][0].Take_Damage(_shipclass,_shipclass.constructor.name,null,t*_damage);
			}
			//}catch(e){alert(e.stack);}
		};
			
			_shipclass._game.add_to_update_function_list(_update1);
			_shipclass._game.add_to_timer(()=>{
				_shipclass._game.remove_function_from_update_list(_update1);
				_shipclass._game.add_to_update_function_list(_update2);
				_shipclass._game._sound.playSound("rocket-5",_shipclass);
			},2);
			
			_shipclass._game.add_to_timer(()=>{
				_shipclass._game.remove_function_from_update_list(_update2);
				_storm.clear();
				_shipclass._performing_ice_storm_1=false;
			},5);
		};
		
		_shoot();
		_shipclass._game.add_to_timer(()=>{
			_shoot();
		},1);
		//_shipclass._game.add_to_timer(()=>{
			//_shoot();
		//},2);
		
	}
	apply_additional_skill_cyclone_1(_shipclass,_level){//huong ve phia truoc
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("additional_cyclone_1");
		}
		let _position1=_shipclass.Position;
		let _position2=_shipclass.getFrontPos(160);
		
		let gltf=_shipclass._game._unitMG._data_list["missile-1"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(2.5);
		model.rotation.z=Math.PI;
		model.visible=false;
		
		let _rocket=_shipclass._game._unitMG.create_uncombat_unit(Rocket2,model,_position2,false);
			_rocket._unit=_shipclass;
			_rocket._player_id=_shipclass._player_id;
			_rocket.emit_time=5.0;
			_rocket.emitter_life=1.0;
			_rocket.launch('particle24',12,0.5,3);//particle24 hoac particle25
			_shipclass._game._graphics.Scene.add(_rocket._model);
			
			_shipclass._game._sound.playSound("beam-1",_shipclass);
			let _damage=60;
		    _damage+=_level*_shipclass._game._parameters._standard_hp/33;
			
			_rocket.CheckTarget=(t)=>{
				const _above=4;
				const _positions=[
					//_shipclass.getFrontPos(50),
					_shipclass.getFrontPos(90),
					_shipclass.getFrontPos(160),
					//_shipclass.getFrontPos(200),
					//_shipclass.getFrontPos(240),
					_shipclass.getFrontPos(300),
					//_shipclass.getFrontAbovePos(50,_above),
					//_shipclass.getFrontAbovePos(90,_above),
					//_shipclass.getFrontAbovePos(160,_above),
					//_shipclass.getFrontAbovePos(200,_above),
					//_shipclass.getFrontAbovePos(240,_above),
				];
				_rocket._model.position.copy(_shipclass.getFrontAbovePos(60,_above));
				for(let i=0;i<_positions.length;i++){
					const _position=_positions[i];
					const _targets=_shipclass._game._unitMG.get_enemy_combat_unit_in_range_3(_shipclass,_position,30);
					for(let i=0;i<_targets.length;i++){
						_targets[i][0].Take_Damage(_shipclass,_shipclass.constructor.name,null,t*_damage);
						//_targets[i][0].Take_Damage(_shipclass,_shipclass.constructor.name,null,t*_damage);
						//console.log("FOUND");
					}
				}
				
				
			};
			
		const _duration=4;
		_shipclass._game.add_to_timer(()=>{
			_rocket.SelfDestroy();
			//this._applying_add_skill_cyclone_1=false;
		},_duration);
	}
	
	apply_additional_skill_spinning_1(_shipclass,_level){//quay tron xung quanh ship
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("additional_spinning_1");
		}
		//try{
		let _position=_shipclass.Position;
		if(typeof this._spinning_1_pos_list==='undefined'){//init params
			this._applying_add_skill_spinning_1=false;
			//_shipclass._game._entities['_controls2'].UpdateCamera=_shipclass._game._entities['_controls2'].UpdateCamera_2;
			const _radius=30;
			const _point_num=3;
			
			const _center=new THREE.Vector3(0,0,0);
			const _p1=_center.clone();_p1.x+=_radius;
			const _p2=_center.clone();_p2.z-=_radius;//bắt buộc phải sử dụng tọa độ x ở p1 và z ở p2 thì mới ra kết quả chính xác
		    
			this._spinning_1_obj_list=new Array();
			this._spinning_1_pos_list=_shipclass._game._utils.createPointsOnCircle(_center,_p1,_p2,_point_num);
			
			for(let i=0;i<this._spinning_1_pos_list.length;i++){
				const _obj=new THREE.Object3D();
					  _shipclass._model.add(_obj);
					  _obj.position.copy(this._spinning_1_pos_list[i]);
					  
					  this._spinning_1_obj_list.push(_obj);
			}
			
			let _cen_pos=new THREE.Vector3(0,0,0);
			let _axis=_shipclass._game._utils.axisY;
			this._add_skill_spinning_1_update_fc=(t)=>{
				_shipclass._game._utils.rotateAboutPoint(this._spinning_1_obj_list[0],_cen_pos,_axis,t*1.1,false);
			};
			_shipclass._game.add_to_update_function_list(this._add_skill_spinning_1_update_fc);
		}
		
		if(this._applying_add_skill_spinning_1===true)
			return;
		this._applying_add_skill_spinning_1=true;
		
		let gltf=_shipclass._game._unitMG._data_list["missile-1"];
			const model = gltf.scene.children[0];
			model.scale.setScalar(2.5);
			model.rotation.z=Math.PI;
			model.visible=false;
			
			const _start_pos=new THREE.Vector3();
			this._spinning_1_obj_list[0].getWorldPosition(_start_pos);
			let _rocket=_shipclass._game._unitMG.create_uncombat_unit(Rocket2,model,_start_pos,false);
			_rocket._unit=_shipclass;
			_rocket._player_id=_shipclass._player_id;
			_rocket.emit_time=5.0;
			_rocket.emitter_life=1.0;
			//let _plus_damage=_rocket._damage*(this._game._parameters.spaceship_passive_skills_level_rate*_level);
			//_rocket._damage+=_plus_damage;
			//this._game._noticeBoard.add_message("PassiveDamage1:"+_rocket._damage);
			_rocket.launch('particle34',8);
			_shipclass._game._graphics.Scene.add(_rocket._model);
			
			_shipclass._game._sound.playSound('rocket-7',_shipclass);
			let _damage=80;
		    _damage+=_level*10;
			let _current_pos=new THREE.Vector3();
			_rocket.CheckTarget=(t)=>{
				this._spinning_1_obj_list[0].getWorldPosition(_current_pos);
				_rocket._model.position.copy(_current_pos);
				
				const _targets=_shipclass._game._unitMG.get_enemy_combat_unit_in_range_3(_shipclass,_current_pos,30);
				for(let i=0;i<_targets.length;i++){
					_targets[i][0].Take_Damage(_shipclass,_shipclass.constructor.name,null,t*_damage);
					//console.log("FOUND");
				}
			};
		
		
		const _duration=12;
		_shipclass._game.add_to_timer(()=>{
			_rocket.SelfDestroy();
			this._applying_add_skill_spinning_1=false;
		},_duration);
		
		//}catch(e){alert(e.stack);}
	}
	
	apply_additional_skill_multi_rocket_3(_shipclass,_level){//rain of rockets
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("additional_multi_rocket_3");
			
		}
		
		let _launch_rocket=(_start_pos)=>{
			let gltf1=_shipclass._game._unitMG._data_list["missile-1"];
			const model1 = gltf1.scene.children[0];
			model1.scale.setScalar(2.5);
			model1.rotation.z=Math.PI;
			let _rocket1=_shipclass._game._unitMG.create_uncombat_unit(Rocket3,model1,_start_pos,false,
			{engine_velocity:1.5,spark_size:0.15,particle_id:'particle10',rocket_speed:1.0,rocket_range:400,unit:_shipclass});
			_rocket1._player_id=_shipclass._player_id;
			_rocket1._damage=_shipclass._game._parameters._standard_hp/10;
		    _rocket1._damage+=_level*_shipclass._game._parameters._standard_hp/20;
			
				_rocket1.look_at(_shipclass.getFrontPos(5000));
			
				_shipclass._game._graphics.Scene.add(_rocket1._model);
				_rocket1.launch();
			
		};
		
		let _length1=5;
		let _pos_list=[
			_shipclass.getFrontPos(_length1),
			_shipclass.getFrontLeftPos(_length1,_length1),
			_shipclass.getFrontRightPos(_length1,_length1),
			
		];
		
		for(let i=0;i<_pos_list.length;i++){
			if(i<_pos_list.length/2)
				_launch_rocket(_pos_list[i],true);
			else
				_launch_rocket(_pos_list[i],false);
		}
		
	}
	
	apply_additional_skill_multi_rocket_2(_shipclass,_level){//ban' 1 luc nhieu rocket ve tat ca cac huong tao thanh hinh tron
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("additional_multi_rocket_2");
		}
		//_shipclass._game._entities['_controls2'].UpdateCamera=_shipclass._game._entities['_controls2'].UpdateCamera_2;
		let _rocket_num=15;
		let _start_pos=_shipclass.getBellowPos(3);
		const _center=_start_pos.clone();
		const _radius=5000;
		const _p1=_shipclass.getFrontPos(_radius);
		const _p2=_shipclass.getRightPos(_radius);
			
		let _pos_list=_shipclass._game._utils.createPointsOnCircle(_center,_p1,_p2,_rocket_num);
		//let _counter=0;
		let _launch_rocket=(_id)=>{
			const _pos=_pos_list[_id];
			//_counter++;
			
			let gltf=_shipclass._game._unitMG._data_list["missile-1"];
			const model = gltf.scene.children[0];
			model.scale.setScalar(2.5);
			model.rotation.z=Math.PI;
			
			let _rocket=_shipclass._game._unitMG.create_uncombat_unit(Rocket2,model,_start_pos,false);
			_rocket._unit=_shipclass;
			_rocket._player_id=_shipclass._player_id;
			
			_rocket.launch('particle34',8);
			_shipclass._game._graphics.Scene.add(_rocket._model);
			_rocket._model.lookAt(_pos);
		};
		
		for(let i=0;i<_rocket_num;i++){
			_launch_rocket(i);
		}
		
		_shipclass._game._sound.playSound('rocket-7',_shipclass);
	}
	apply_additional_skill_multi_rocket_1(_shipclass,_level){//ban' 1 luc nhieu rocket ve phia truoc
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("additional_multi_rocket_1");
		}
		
		let _rocket_num=4;
		let _left_pos=_shipclass.getFrontLeftPos(5,5);
		let _right_pos=_shipclass.getFrontRightPos(5,5);
		let _front_pos=_shipclass.getBackPos(500);
		let _posList=_shipclass._game._utils.getEquidistantPoints(_left_pos,_right_pos,_rocket_num);
		
		
		for(let i=0;i<_rocket_num;i++){
			const _start_pos=_posList[i];
			let gltf=_shipclass._game._unitMG._data_list["missile-1"];
			const model = gltf.scene.children[0];
			model.scale.setScalar(2.5);
			model.rotation.z=Math.PI;
			//const _start_pos=_shipclass.getBackPos(5);;
			let _rocket=_shipclass._game._unitMG.create_uncombat_unit(Rocket2,model,_start_pos,false);
			_rocket._unit=_shipclass;
			_rocket._player_id=_shipclass._player_id;
			//let _plus_damage=_rocket._damage*(this._game._parameters.spaceship_passive_skills_level_rate*_level);
			//_rocket._damage+=_plus_damage;
			//this._game._noticeBoard.add_message("PassiveDamage1:"+_rocket._damage);
			
			let _damage=_shipclass._game._parameters._standard_hp/30;
		    _damage+=_level*(_shipclass._game._parameters._standard_hp/14);
			_rocket._damage=_damage;
			_rocket._max_distance=1000*this._game.rocket_multiplier;
			_rocket._radius_effect1=15*this._game.rocket_multiplier;
			_rocket._radius_effect2=100*this._game.rocket_multiplier;
			
			_rocket.launch('particle22',4);
			_shipclass._game._graphics.Scene.add(_rocket._model);
			_rocket._model.lookAt(_front_pos);
		}
		_shipclass._game._sound.playSound('rocket-7',_shipclass);
	}
	
	launch_freeze_rocket_1(_shipclass,_level,_init_pos){
		let gltf=_shipclass._game._unitMG._data_list["missile-1"];
			const model = gltf.scene.children[0];
			model.scale.setScalar(2.5);
			model.rotation.z=Math.PI;
			//const _start_pos=_shipclass.getBackPos(5);;
			let _rocket=_shipclass._game._unitMG.create_uncombat_unit(Rocket2,model,_init_pos,false);
			_rocket._unit=_shipclass;
			_rocket._player_id=_shipclass._player_id;
			
			let _damage=_shipclass._game._parameters._standard_hp*6/10;
		    _damage+=_level*(_shipclass._game._parameters._standard_hp/10);
			_rocket._damage=_damage;
			_rocket._max_distance=2000*this._game.rocket_multiplier;
			_rocket._radius_effect1=15*this._game.rocket_multiplier;
			_rocket._radius_effect2=100*this._game.rocket_multiplier;
			
			_rocket.launch('particle25',6,1,1);
			_shipclass._game._graphics.Scene.add(_rocket._model);
			_rocket._model.lookAt(_shipclass.getBackPos(100));
			_rocket.add_to_update_function_list(()=>{
				_rocket.look_at(_shipclass.getFrontPos(5000));
			});
		
		_shipclass._game._sound.playSound('rocket-7',_shipclass);
	}
	apply_additional_skill_freeze_rocket_1(_shipclass,_level){
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("additional_freeze_rocket_1");
		}
		/*ban' lien 2 qua nen can phai tinh toan damage cho chuan?*/
		_shipclass.launch_freeze_rocket_1(_shipclass,_level,_shipclass.getRightPos(5));
		_shipclass.launch_freeze_rocket_1(_shipclass,_level,_shipclass.getLeftPos(5));
	}
	
	launch_heat_rocket_1(_shipclass,_level,_init_pos){
		let gltf=_shipclass._game._unitMG._data_list["missile-1"];
			const model = gltf.scene.children[0];
			model.scale.setScalar(5);
			model.rotation.z=Math.PI;
			//const _start_pos=_shipclass.getBackPos(5);;
			let _rocket=_shipclass._game._unitMG.create_uncombat_unit(Rocket3,model,_init_pos,false,
			{engine_velocity:5,spark_size:3.0,particle_id:'particle32',rocket_speed:0.9,rocket_range:1400,unit:_shipclass});
			_rocket._unit=_shipclass;
			_rocket._player_id=_shipclass._player_id;
			_shipclass._game._graphics.Scene.add(_rocket._model);
			
			_rocket.look_at(_shipclass.getFrontPos(5000));
			_rocket._first_phase=false;
			_rocket._first_phase_speed=160;
			_rocket.launch();
			
			let _damage=_shipclass._game._parameters._standard_hp*1/15;
		    _damage+=_level*(_shipclass._game._parameters._standard_hp/20);
			_rocket._damage=_damage;
			_rocket._max_distance=1000*this._game.rocket_multiplier;
			_rocket._radius_effect1=18*this._game.rocket_multiplier;
			_rocket._radius_effect2=100*this._game.rocket_multiplier;
			
	}
	apply_additional_skill_heat_rocket_1(_shipclass,_level){
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("additional_heat_rocket_1");
		}
		/*ban' lien 2 qua nen can phai tinh toan damage cho chuan?*/
		let _launch_heat_rocket=()=>{
			_shipclass.launch_heat_rocket_1(_shipclass,_level,_shipclass.getRightPos(3));
			_shipclass.launch_heat_rocket_1(_shipclass,_level,_shipclass.getLeftPos(3));
		};
		
		_launch_heat_rocket();
	    _shipclass._game.add_to_timer(()=>{
			_launch_heat_rocket();
		},1);
		_shipclass._game.add_to_timer(()=>{
			_launch_heat_rocket();
		},2);
		_shipclass._game.add_to_timer(()=>{
			_launch_heat_rocket();
		},3);
	}
	
	
	launch_heat_rocket_2(_shipclass,_level,_init_pos){
		let gltf=_shipclass._game._unitMG._data_list["missile-1"];
			const model = gltf.scene.children[0];
			model.scale.setScalar(2.5);
			model.rotation.z=Math.PI;
			//const _start_pos=_shipclass.getBackPos(5);;
			let _rocket=_shipclass._game._unitMG.create_uncombat_unit(Rocket3,model,_init_pos,false,
			{engine_velocity:5,spark_size:0.7,particle_id:'particle21',rocket_speed:0.3,rocket_range:1400,unit:_shipclass});
			_rocket._unit=_shipclass;
			_rocket._player_id=_shipclass._player_id;
			_shipclass._game._graphics.Scene.add(_rocket._model);
			
			_rocket.look_at(_shipclass.getFrontPos(5000));
			_rocket._first_phase_speed=140;
			_rocket.launch();
			
			let _damage=_shipclass._game._parameters._standard_hp*6/10;
		    _damage+=_level*(_shipclass._game._parameters._standard_hp/10);
			_rocket._damage=_damage;
			_rocket._max_distance=2000*this._game.rocket_multiplier;
			_rocket._radius_effect1=20*this._game.rocket_multiplier;
			_rocket._radius_effect2=100*this._game.rocket_multiplier;
			
			_rocket._auto_aim=true;
			_rocket.add_to_update_function_list(()=>{
				if(_rocket._auto_aim)_rocket.look_at(_shipclass.getFrontPos(5000));
			});
			_shipclass._game.add_to_timer(()=>{
				_rocket._auto_aim=false;
			},4);
			
	}
	apply_additional_skill_heat_rocket_2(_shipclass,_level){
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("additional_heat_rocket_2");
		}
		
		let _launch_heat_rocket=()=>{
			_shipclass.launch_heat_rocket_2(_shipclass,_level,_shipclass.getRightPos(3));
			_shipclass.launch_heat_rocket_2(_shipclass,_level,_shipclass.getLeftPos(3));
		};
		
		_launch_heat_rocket();
	    _shipclass._game.add_to_timer(()=>{
			_launch_heat_rocket();
		},1);
		_shipclass._game.add_to_timer(()=>{
			//_launch_heat_rocket();
		},2);
		
	}
	/*
	apply_additional_skill_heat_rocket_1(_shipclass,_level){//rocket với dam thấp nhưng làm giảm dam của đối phương
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("additional_heat_rocket_1");
		}
		let gltf=_shipclass._game._unitMG._data_list["missile-1"];
			const model = gltf.scene.children[0];
			model.scale.setScalar(2.5);
			model.rotation.z=Math.PI;
			const _start_pos=_shipclass.getBackPos(5);
			let _rocket=_shipclass._game._unitMG.create_uncombat_unit(Rocket2,model,_start_pos,false);
			_rocket._unit=_shipclass;
			_rocket._player_id=_shipclass._player_id;
			//let _plus_damage=_rocket._damage*(this._game._parameters.spaceship_passive_skills_level_rate*_level);
			//_rocket._damage+=_plus_damage;
			//this._game._noticeBoard.add_message("PassiveDamage1:"+_rocket._damage);
			_rocket.launch('particle36',14);
			_shipclass._game._graphics.Scene.add(_rocket._model);
			_rocket._model.lookAt(_shipclass.getBackPos(100));
			
		
		_shipclass._game._sound.play('rocket-7');
	}
	*/
	/*
		Bam' Space x 2 lan 1 de launch Rocket
		Bam' Space x2 lan 2 de kich hoat no?
	*/
	apply_additional_skill_time_rocket_4(_shipclass,_level){//bam' nut moi phat no nhung damage yeu'
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("additional_time_rocket_4");
		}
		
		if(typeof this._applying_add_skill_time_rocket_4==='undefined')
			this._applying_add_skill_time_rocket_4=false;
		if(this._applying_add_skill_time_rocket_4){
			this._applying_add_skill_time_rocket_4=false;
			
			let _found=false;
			for(let i=0;i<this._time_rocket_4_list.length;i++){
				if(typeof this._time_rocket_4_list[i]==='undefined'||
				this._time_rocket_4_list[i]===null||this._time_rocket_4_list[i].Dead){
					continue;
				}
				this._time_rocket_4_list[i].CauseDamage();
				this._time_rocket_4_list[i].SelfDestroy();
				_found=true;
			}
			
			if(_found)return;
		}
		this._applying_add_skill_time_rocket_4=true;
		
		
		this._time_rocket_4_list=new Array();
		let _launch_fc=(_pos)=>{
			let gltf=_shipclass._game._unitMG._data_list["missile-1"];
			const model = gltf.scene.children[0];
			model.scale.setScalar(2.5);
			model.rotation.z=Math.PI;
			const _start_pos=_shipclass.getBackPos(5);
			let _rocket=_shipclass._game._unitMG.create_uncombat_unit(Rocket4,model,_start_pos,false);
			_rocket._unit=_shipclass;
			_rocket._player_id=_shipclass._player_id;
			//let _plus_damage=_rocket._damage*(this._game._parameters.spaceship_passive_skills_level_rate*_level);
			//_rocket._damage+=_plus_damage;
			//this._game._noticeBoard.add_message("PassiveDamage1:"+_rocket._damage);
			_rocket.emit_time=4.0;
			_rocket.launch('particle15',14,2,99999999);
			_shipclass._game._graphics.Scene.add(_rocket._model);
			_rocket.look_at(_pos);
			
			this._time_rocket_4_list.push(_rocket);
		};
		
		let _pos_list=[
			this.getFrontLeftPos(10,5),
			this.getFrontPos(10),
			this.getFrontRightPos(10,5),
		];
		for(let i=0;i<_pos_list.length;i++){
			_launch_fc(_pos_list[i]);
		}
		
		_shipclass._game._sound.playSound('rocket-7',_shipclass);
	}
	apply_additional_skill_time_rocket_3(_shipclass,_level){//ten lua no cham(tam` ban' rat' gan`), bam' nut' de kich hoat hoac 1 thoi gian se tu dong phat no
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("additional_time_rocket_3");
		}
		
		if(typeof this._applying_add_skill_time_rocket_3==='undefined')
			this._applying_add_skill_time_rocket_3=false;
		if(this._applying_add_skill_time_rocket_3){
			this._applying_add_skill_time_rocket_3=false;
			
			let _found=false;
			for(let i=0;i<this._time_rocket_3_list.length;i++){
				if(typeof this._time_rocket_3_list[i]==='undefined'||
				this._time_rocket_3_list[i]===null||this._time_rocket_3_list[i].Dead){
					continue;
				}
				this._time_rocket_3_list[i].CauseDamage();
				this._time_rocket_3_list[i].SelfDestroy();
				_found=true;
			}
			
			if(_found)return;
		}
		this._applying_add_skill_time_rocket_3=true;
		
		
		this._time_rocket_3_list=new Array();
		let _launch_fc=(_pos)=>{
			let gltf=_shipclass._game._unitMG._data_list["missile-1"];
			const model = gltf.scene.children[0];
			model.scale.setScalar(2.5);
			model.rotation.z=Math.PI;
			const _start_pos=_shipclass.getBackPos(5);
			let _rocket=_shipclass._game._unitMG.create_uncombat_unit(Rocket4,model,_start_pos,false);
			_rocket._unit=_shipclass;
			_rocket._player_id=_shipclass._player_id;
			//let _plus_damage=_rocket._damage*(this._game._parameters.spaceship_passive_skills_level_rate*_level);
			//_rocket._damage+=_plus_damage;
			//this._game._noticeBoard.add_message("PassiveDamage1:"+_rocket._damage);
			_rocket.emit_time=4.0;
			_rocket.launch('particle15',14,4,20);
			_shipclass._game._graphics.Scene.add(_rocket._model);
			_rocket.look_at(_pos);
			
			this._time_rocket_3_list.push(_rocket);
		};
		
		let _pos_list=[
			this.getFrontLeftPos(10,5),
			this.getFrontPos(10),
			this.getFrontRightPos(10,5),
		];
		for(let i=0;i<_pos_list.length;i++){
			_launch_fc(_pos_list[i]);
		}
		
		_shipclass._game._sound.playSound('rocket-7',_shipclass);
		
	}
	
	apply_additional_skill_time_rocket_2(_shipclass,_level){//ten lua no cham(tam` ban' rat' gan`)
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("additional_time_rocket_2");
		}
		
		let _launch_fc=(_pos)=>{
			let gltf=_shipclass._game._unitMG._data_list["missile-1"];
			const model = gltf.scene.children[0];
			model.scale.setScalar(2.5);
			model.rotation.z=Math.PI;
			const _start_pos=_shipclass.getBackPos(5);
			let _rocket=_shipclass._game._unitMG.create_uncombat_unit(Rocket4,model,_start_pos,false);
			_rocket._unit=_shipclass;
			_rocket._player_id=_shipclass._player_id;
			//let _plus_damage=_rocket._damage*(this._game._parameters.spaceship_passive_skills_level_rate*_level);
			//_rocket._damage+=_plus_damage;
			//this._game._noticeBoard.add_message("PassiveDamage1:"+_rocket._damage);
			_rocket.emit_time=4.0;
			_rocket.launch('particle15',14,4,7);
			_shipclass._game._graphics.Scene.add(_rocket._model);
			_rocket.look_at(_pos);
		};
		
		let _pos_list=[
			this.getFrontLeftPos(10,5),
			this.getFrontPos(10),
			this.getFrontRightPos(10,5),
		];
		for(let i=0;i<_pos_list.length;i++){
			_launch_fc(_pos_list[i]);
		}
		
		_shipclass._game._sound.playSound('rocket-7',_shipclass);
	}
	
	apply_additional_skill_time_rocket_1(_shipclass,_level){//ten lua no cham(tam` ban' rat' gan`)
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("additional_time_rocket_1");
		}
		let gltf=_shipclass._game._unitMG._data_list["missile-1"];
			const model = gltf.scene.children[0];
			model.scale.setScalar(2.5);
			model.rotation.z=Math.PI;
			const _start_pos=_shipclass.getBackPos(5);
			let _rocket=_shipclass._game._unitMG.create_uncombat_unit(Rocket4,model,_start_pos,false);
			_rocket._unit=_shipclass;
			_rocket._player_id=_shipclass._player_id;
			//let _plus_damage=_rocket._damage*(this._game._parameters.spaceship_passive_skills_level_rate*_level);
			//_rocket._damage+=_plus_damage;
			//this._game._noticeBoard.add_message("PassiveDamage1:"+_rocket._damage);
			_rocket.emit_time=4.0;
			_rocket.launch('particle15',14,4,7);
			_shipclass._game._graphics.Scene.add(_rocket._model);
			_rocket._model.lookAt(_shipclass.getBackPos(100));
			
		
		_shipclass._game._sound.playSound('rocket-7',_shipclass);
	}
	
	apply_additional_skill_generate_multi_photon_3(_shipclass,_level){//nhieu tia sang photon hinh chu X ban ve phia truoc 
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("additional_generate_multi_photon_3");
		}
		//try{
		
		const _photon_num=9;
		let _position=_shipclass.Position;
		
		
		if(typeof this._applying_generate_multi_photon_3==='undefined'){
			//_shipclass._game._entities['_controls2'].UpdateCamera=_shipclass._game._entities['_controls2'].UpdateCamera_2;
			this._applying_generate_multi_photon_3=false;
			this._add_skill_multi_photon_3_elements=new Array();
			for(let i=0;i<_photon_num;i++){
				const _element=_shipclass._game._graphics.create_laser("white");
				if(typeof _element==='undefined'||_element===null){
					return;
				}
				this._add_skill_multi_photon_3_elements.push(_element);
			}
			
		}
		
		if(this._applying_generate_multi_photon_3===true)
			return;
		this._applying_generate_multi_photon_3=true;
		
		let _duration=4;
		let _speed=150;
		let _damage=this._game._parameters._standard_hp/80;
		    _damage+=_level*10;
		let _size;
		if(_shipclass===_shipclass._game._me)
			_size=0.05;//nhin tu vi tri cua player se lon' hon
		else
			_size=0.05;
		let _ray_length=10;
		let _counter=0;
		
		let _far_pos=_shipclass.getFrontPos(10000);
		
		let _create_laser=(_pos1,_pos2)=>{
			//let _pos1=_position.clone();
			//let _pos2=this._add_multi_photon_3_pos_list[_counter];
		
			const _element=this._add_skill_multi_photon_3_elements[_counter];
			_counter++;
			
			let _laserObject=_element[1];
			let _laserRay=_element[2];
			_laserObject._unit=_shipclass;
			
			_shipclass._game._graphics.show_laser(_laserObject);
			_laserObject.scale.x=_size;
			_laserObject.scale.y=_size;
			_laserObject.scale.z=_ray_length;
			_laserObject.position.copy(_pos1);
			_laserObject.lookAt(_pos2);
			
			_laserRay.change_color("turquoise");
			let _lock_auto_aim=false;
			let _aim_pos=null;
				
				_laser_id_1++;
				let _t_laser_id=_laser_id_1;
			let _update=(t)=>{
				if(_shipclass._target_object&&!_shipclass._target_object.Dead){
					const _pos_1=_shipclass._target_object.Position;
					const _pos_2=_laserObject.position;
					const _tdistance=_pos_1.distanceTo(_pos_2);
					
					if(_tdistance<50){
						_lock_auto_aim=true;//khi lai gan se ko aim vao target nua
					}
					
					if(!_lock_auto_aim){
						//_laserObject.lookAt(_pos_1);
						_shipclass._game._utils.translateObject(_laserObject,_pos_1,t*_speed);
					}
					else{
						if(_aim_pos===null)
							_aim_pos=this._game._utils.findPointOnLine(_pos_2,_pos_1,2000);
						
						//_laserObject.lookAt(_aim_pos);
						_shipclass._game._utils.translateObject(_laserObject,_aim_pos,t*_speed/3);
					}
				}
				else{
					_shipclass._game._utils.translateObject(_laserObject,_far_pos,t*_speed);
				}	
				//_shipclass._game._utils.translateObject(_laserObject,_far_pos,t*_speed);
				_laserObject.rotation.y+=t*0.7;
				_laserObject.rotation.z+=t*0.5;
				const _laserStartPos=_laserObject.position;
				//const _targets=this._game._unitMG.get_enemy_combat_unit_in_range_3(_shipclass,_laserStartPos,_ray_length);
				const _targets=this._game._unitMG.get_units_in_range(_laserStartPos,_ray_length*3);
				
				if(_targets.length>0)
				for(let i=0;i<_targets.length;i++){
					const _target=_targets[i][0];
					if(typeof _target._hited_by_x_photon==='undefined'){
						_target._hited_by_x_photon=new Array();
					}
					else{
						let _found=false;
						for(let j=0;j<_target._hited_by_x_photon.length;j++){
							if(_target._hited_by_x_photon[j].ship_class===_shipclass&&
							_target._hited_by_x_photon[j].laser_id===_t_laser_id){
								//alert("FOUND");
								_found=true;
								break;
							}
								
						}
						if(_found)continue;
					}
					if(_target._player_id===_shipclass._player_id||
					(typeof _shipclass._team_id!='undefined'&&_target._team_id===_shipclass._team_id)
					||_target.Dead)
						continue;
					
					const _pos=_target.Position;
					const _laserEndPos=_shipclass._game._utils.findPointOnLine(_laserStartPos,_pos2,_ray_length);//diem cuoi cua laser
					const _d1=_pos.distanceTo(_laserStartPos);
					const _d2=_pos.distanceTo(_laserEndPos);
					if(_d1+_d2<_ray_length+20){
						//_target.Take_Damage(_shipclass,_shipclass.constructor.name,null,t*_damage);
						//_shipclass._game._noticeBoard.add_message("Hit!");
						_target.Take_Damage(_shipclass,_shipclass.constructor.name,null,_damage);
						_target._hited_by_x_photon.push({ship_class:_shipclass,laser_id:_t_laser_id});
					}
				}
			};
			
			_shipclass._game.add_to_update_function_list(_update);
			
			_shipclass._game.add_to_timer(()=>{
				_shipclass._game.remove_function_from_update_list(_update);
				_shipclass._game._graphics.hide_laser(_laserObject);
				_laserRay.change_color(_laserObject._origin_color);
			},_duration);
			
		};
		let _burst=()=>{
			//for(let i=0;i<_photon_num/2;i++)
			const _l1=_ray_length/2;
			const _frontLeft=_shipclass.getFrontLeftPos(_l1,_l1);
			const _frontRight=_shipclass.getFrontRightPos(_l1,_l1);
			const _frontUp=_shipclass.getFrontAbovePos(_l1,_l1);
			const _frontDown=_shipclass.getFrontBellowPos(_l1,_l1);
			
			const _start_1=_frontLeft;
			const _end_1=_frontRight;
			const _start_2=_frontUp;
			const _end_2=_frontDown;
				  
			_create_laser(_start_1,_end_1);
			_create_laser(_start_2,_end_2);
		};
		
		let _delay=1;
		_burst();
		_shipclass._game.add_to_timer(()=>{_burst();},_delay);
		_shipclass._game.add_to_timer(()=>{_burst();},_delay*2);
		_shipclass._game.add_to_timer(()=>{_burst();},_delay*3);
		_shipclass._game.add_to_timer(()=>{
			this._applying_generate_multi_photon_3=false;
		},6);
	}	
	
	apply_additional_skill_generate_multi_photon_2(_shipclass,_level){//nhieu tia sang photon ban ra nhieu huong' 
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("additional_generate_multi_photon_2");
		}
		//try{
		
		const _photon_num=15;
		let _position=_shipclass.Position;
		
		if(typeof this._applying_generate_multi_photon_2==='undefined'){
			//_shipclass._game._entities['_controls2'].UpdateCamera=_shipclass._game._entities['_controls2'].UpdateCamera_2;
			this._applying_generate_multi_photon_2=false;
			this._add_skill_multi_photon_2_elements=new Array();
			for(let i=0;i<_photon_num;i++){
				const _element=_shipclass._game._graphics.create_laser("player");
				if(typeof _element==='undefined'||_element===null){
					return;
				}
				this._add_skill_multi_photon_2_elements.push(_element);
			}
			
		}
		
		if(this._applying_generate_multi_photon_2===true)
			return;
		this._applying_generate_multi_photon_2=true;
		
			const _center=_position.clone();
			const _radius=5000;
			const _p1=_shipclass.getFrontPos(_radius);
			const _p2=_shipclass.getRightPos(_radius);
			
			this._add_multi_photon_2_pos_list=_shipclass._game._utils.createPointsOnCircle(_center,_p1,_p2,_photon_num);
		
		let _duration=4;
		let _speed=200;
		let _damage=800;
		    _damage+=_level*10;
		let _size;
		if(_shipclass===_shipclass._game._me)
			_size=0.1;//nhin tu vi tri cua player se lon' hon
		else
			_size=0.3;
		let _ray_length=20;
		let _counter=0;
		
		
		let _create_laser=()=>{
			let _pos1=_position.clone();
			let _pos2=this._add_multi_photon_2_pos_list[_counter];
		
			const _element=this._add_skill_multi_photon_2_elements[_counter];
			_counter++;
			
			let _laserObject=_element[1];
			let _laserRay=_element[2];
			
			_shipclass._game._graphics.show_laser(_laserObject);
			_laserObject.scale.x=_size;
			_laserObject.scale.y=_size;
			_laserObject.scale.z=_ray_length;
			_laserObject.position.copy(_pos1);
			_laserObject.lookAt(_pos2);
			
			let _update=(t)=>{
				_shipclass._game._utils.translateObject(_laserObject,_pos2,t*_speed);
				const _laserStartPos=_laserObject.position;
				const _targets=this._game._unitMG.get_enemy_combat_unit_in_range_3(_shipclass,_laserStartPos,_ray_length);
				if(_targets.length>0)
				for(let i=0;i<_targets.length;i++){
					const _target=_targets[i][0];
					const _pos=_target.Position;
					const _laserEndPos=_shipclass._game._utils.findPointOnLine(_laserStartPos,_pos2,_ray_length);//diem cuoi cua laser
					const _d1=_pos.distanceTo(_laserStartPos);
					const _d2=_pos.distanceTo(_laserEndPos);
					if(_d1+_d2<_ray_length+20){
						_target.Take_Damage(_shipclass,_shipclass.constructor.name,null,t*_damage);
						//_shipclass._game._noticeBoard.add_message("Hit!");
					}
				}
			};
			
			_shipclass._game.add_to_update_function_list(_update);
			
			_shipclass._game.add_to_timer(()=>{
				_shipclass._game.remove_function_from_update_list(_update);
				_shipclass._game._graphics.hide_laser(_laserObject);
			},_duration);
			
		};
		let _burst=()=>{
			for(let i=0;i<_photon_num;i++)
				_create_laser();
		};
		
		_burst();
		_shipclass._game.add_to_timer(()=>{
			this._applying_generate_multi_photon_2=false;
		},5);
		
		//}catch(e){alert(e.stack);}
	}
	
	apply_additional_skill_generate_multi_photon_4(_shipclass,_level){//nhieu tia photon huong ve phia target
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("additional_generate_multi_photon_4");
		}
		const _burst_num=3;
		const _num_in_burst=4;
		const _photon_num=_burst_num*_num_in_burst;
		
		if(typeof this._applying_generate_multi_photon_4==='undefined'){
			this._applying_generate_multi_photon_4=false;
			this._add_skill_multi_photon_4_elements=new Array();
			for(let i=0;i<_photon_num;i++){
				const _element=_shipclass._game._graphics.create_laser("player");
				if(typeof _element==='undefined'||_element===null){
					return;
				}
				this._add_skill_multi_photon_4_elements.push(_element);
			}
		}
		
		if(this._applying_generate_multi_photon_4===true)
			return;
		this._applying_generate_multi_photon_4=true;
		
		let _duration=4;
		let _speed=200;
		let _damage=_shipclass._game._parameters._standard_hp*1/25;
		    _damage+=_level*10;
		let _size;
		if(_shipclass===_shipclass._game._me)
			_size=0.1;//nhin tu vi tri cua player se lon' hon
		else
			_size=0.3;
		let _ray_length=30;
		let _counter=0;
		
		let _pos_id=0;
		
		let _create_laser=()=>{
			let _pos1;
			_pos_id++;
			if(_pos_id>_num_in_burst)_pos_id=1;
			//if(_pos_id===1)_pos1=_shipclass.getFrontLeftPos(5,3);
			//if(_pos_id===2)_pos1=_shipclass.getFrontPos(5);
			//if(_pos_id===3)_pos1=_shipclass.getFrontRightPos(5,3);
			_pos1=_shipclass.getFrontPos(2);
		
			
			const _element=this._add_skill_multi_photon_4_elements[_counter];
			_counter++;
			if(!_element)return;
			let _laserObject=_element[1];
			if(typeof _laserObject._finish_4==='undefined')
				_laserObject._finish_4=false;
			
			let _color="#DFFF00";
			
			let _laserRay=_element[2];
			    _laserRay.change_color(_color);
			let _target=null;
			let _t_target1=this._game._unitMG.get_enemy_combat_unit_in_range_3(_shipclass,_shipclass.getFrontPos(150),150);
			let _available=false;
			
			for(let i=0;i<_t_target1.length;i++){
				if(_shipclass._utils.isInFront90(_shipclass._model,_t_target1[i][0]._model)){
					_available=true;
					break;
				}
			}
			
			if(!_available||_t_target1.length===0){
				/*Ko co target nao thi ban' thang ve phia truoc*/
				this.apply_additional_skill_simple_multi_photon_1(_shipclass,_level,_color,2,3,0)
				return;
			}
			//if(_t_target1.length>0){
				let _t_target2=_shipclass._game._utils.shuffle_array(_t_target1);
				_target=_t_target2[0][0];
				_shipclass._game._sound.playSound("laserrocket-1",_shipclass);
			//}
			
			
			let _pos2=_target.Position;
			//let _pos2=this._game._utils.findPointOnLine(_pos1, _target.Position, 3000);
			
			_shipclass._game._graphics.show_laser(_laserObject);
			_laserObject.scale.x=_size;
			_laserObject.scale.y=_size;
			_laserObject.scale.z=_ray_length;
			_laserObject.position.copy(_pos1);
			_laserObject.lookAt(_pos2);
			
			let _update=(t)=>{
				if(_laserObject._finish_4)return;
				
				const _distance=_laserObject.position.distanceTo(_pos2);
				if(_distance<=2){
					_shipclass._game._graphics.hide_laser(_laserObject);
					_laserObject._finish_4=true;
					return;
				}
				
				const _t_distance=t*_speed;
				
				if(_t_distance<_distance)
					_shipclass._game._utils.translateObject(_laserObject,_pos2,_t_distance);
				else
					_shipclass._game._utils.translateObject(_laserObject,_pos2,_distance);
				
				const _laserStartPos=_laserObject.position;
				const _targets=this._game._unitMG.get_enemy_combat_unit_in_range_3(_shipclass,_laserStartPos,_ray_length);
				if(_targets.length>0){//alert("Count="+_targets.length);
				for(let i=0;i<_targets.length;i++){
					const _target=_targets[i][0];
					const _pos=_target.Position;
					const _laserEndPos=_shipclass._game._utils.findPointOnLine(_laserStartPos,_pos2,_ray_length);//diem cuoi cua laser
					const _d1=_pos.distanceTo(_laserStartPos);
					const _d2=_pos.distanceTo(_laserEndPos);
					if(_d1+_d2<_ray_length+0.1){
						_target.Take_Damage(_shipclass,_shipclass.constructor.name,null,_damage);
						_shipclass._game._graphics.hide_laser(_laserObject);
						_laserObject._finish_4=true;
						break;
					}
				}};
				
			};
			
			_shipclass._game.add_to_update_function_list(_update);
			
			_shipclass._game.add_to_timer(()=>{
				_shipclass._game.remove_function_from_update_list(_update);
				_shipclass._game._graphics.hide_laser(_laserObject);
				_laserObject._finish_4=false;
			},_duration);
			
		};
		let _burst=()=>{
			_create_laser();
			_create_laser();
			_create_laser();
			_create_laser();
			_create_laser();
			_create_laser();
		};
		
		let _delay=1;
		_burst();
		_shipclass._game.add_to_timer(()=>{_burst();},_delay);
		_shipclass._game.add_to_timer(()=>{_burst();},_delay*2);
		_shipclass._game.add_to_timer(()=>{
			this._applying_generate_multi_photon_4=false;
		},6);
	}
	
	/*function su dung chung*/
	apply_additional_skill_simple_multi_photon_1(_shipclass,_level,_color,_burst_num,_num_in_burst,_damage){//nhieu tia sang photon huong ve phia truoc
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			//_shipclass._game._client.add_action("additional_generate_multi_photon_1");
		}
		//try{
		//const _burst_num=3;
		//const _num_in_burst=3;
		const _photon_num=_burst_num*_num_in_burst;
		
		if(typeof this._applying_generate_multi_photon_1==='undefined'){
			this._applying_generate_multi_photon_1=false;
			this._add_skill_simple_multi_photon_elements=new Array();
			for(let i=0;i<_photon_num;i++){
				const _element=_shipclass._game._graphics.create_laser("player");
				if(typeof _element==='undefined'||_element===null){
					return;
				}
				let _laserRay=_element[2];
			    _laserRay.change_color(_color);
				this._add_skill_simple_multi_photon_elements.push(_element);
			}
		}
		
		if(this._applying_generate_multi_photon_1===true)
			return;
		this._applying_generate_multi_photon_1=true;
		
		let _duration=4;
		let _speed=200;
		//let _damage=800;
		    //_damage+=_level*10;
		let _size;
		if(_shipclass===_shipclass._game._me)
			_size=0.1;//nhin tu vi tri cua player se lon' hon
		else
			_size=0.3;
		let _ray_length=20;
		let _counter=0;
		
		//let _far_pos=_shipclass.getFrontPos(5000);
		let _pos_id=0;
		
		let _create_laser=()=>{
			
			
			//_shipclass._game._sound.play("laserrocket-1");
			
			let _pos1;
			_pos_id++;
			if(_pos_id>_num_in_burst)_pos_id=1;
			if(_pos_id===1)_pos1=_shipclass.getFrontLeftPos(5,3);
			if(_pos_id===2)_pos1=_shipclass.getFrontPos(5);
			if(_pos_id===3)_pos1=_shipclass.getFrontRightPos(5,3);
		
			let _pos2=_shipclass.getFrontPos(5000);
		
			const _element=this._add_skill_simple_multi_photon_elements[_counter];
			_counter++;
			if(!_element)return;
			let _laserObject=_element[1];
			let _laserRay=_element[2];
			
			_shipclass._game._graphics.show_laser(_laserObject);
			_laserObject.scale.x=_size;
			_laserObject.scale.y=_size;
			_laserObject.scale.z=_ray_length;
			_laserObject.position.copy(_pos1);
			_laserObject.lookAt(_pos2);
			
			_shipclass._game._sound.playSound("laserrocket-1",_shipclass);
			
			let _update=(t)=>{
				_shipclass._game._utils.translateObject(_laserObject,_pos2,t*_speed);
				const _laserStartPos=_laserObject.position;
				const _targets=this._game._unitMG.get_enemy_combat_unit_in_range_3(_shipclass,_laserStartPos,_ray_length);
				if(_targets.length>0){//alert("Count="+_targets.length);
				for(let i=0;i<_targets.length;i++){
					const _target=_targets[i][0];
					const _pos=_target.Position;
					const _laserEndPos=_shipclass._game._utils.findPointOnLine(_laserStartPos,_pos2,_ray_length);//diem cuoi cua laser
					const _d1=_pos.distanceTo(_laserStartPos);
					const _d2=_pos.distanceTo(_laserEndPos);
					if(_d1+_d2<_ray_length+20){
						_target.Take_Damage(_shipclass,_shipclass.constructor.name,null,t*_damage);
					}
				}};
			};
			
			_shipclass._game.add_to_update_function_list(_update);
			
			_shipclass._game.add_to_timer(()=>{
				_shipclass._game.remove_function_from_update_list(_update);
				_shipclass._game._graphics.hide_laser(_laserObject);
			},_duration);
			
		};
		let _burst=()=>{
			_create_laser();
			_create_laser();
			_create_laser();
		};
		
		let _delay=1;
		_burst();
		_shipclass._game.add_to_timer(()=>{_burst();},_delay);
		_shipclass._game.add_to_timer(()=>{_burst();},_delay*2);
		_shipclass._game.add_to_timer(()=>{
			this._applying_generate_multi_photon_1=false;
		},6);
		
		//}catch(e){alert(e.stack);}
	}
	
	apply_additional_skill_generate_multi_photon_1(_shipclass,_level){//nhieu tia sang photon huong ve phia truoc
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("additional_generate_multi_photon_1");
		}
		//try{
		const _burst_num=3;
		const _num_in_burst=3;
		const _photon_num=_burst_num*_num_in_burst;
		
		if(typeof this._applying_generate_multi_photon_1==='undefined'){
			this._applying_generate_multi_photon_1=false;
			this._add_skill_multi_photon_1_elements=new Array();
			for(let i=0;i<_photon_num;i++){
				const _element=_shipclass._game._graphics.create_laser("player");
				if(typeof _element==='undefined'||_element===null){
					return;
				}
				this._add_skill_multi_photon_1_elements.push(_element);
			}
		}
		
		if(this._applying_generate_multi_photon_1===true)
			return;
		this._applying_generate_multi_photon_1=true;
		
		let _duration=4;
		let _speed=200;
		//let _damage=800;
		let _damage=_shipclass._game._parameters._standard_hp/20;
		    _damage+=_level*10;
		let _size;
		if(_shipclass===_shipclass._game._me)
			_size=0.1;//nhin tu vi tri cua player se lon' hon
		else
			_size=0.3;
		let _ray_length=20;
		let _counter=0;
		
		//let _far_pos=_shipclass.getFrontPos(5000);
		let _pos_id=0;
		
		let _create_laser=()=>{
			
			_shipclass._game._sound.playSound("laserrocket-1",_shipclass);
			//_shipclass._game._sound.play("laserrocket-1");
			
			let _pos1;
			_pos_id++;
			if(_pos_id>_num_in_burst)_pos_id=1;
			if(_pos_id===1)_pos1=_shipclass.getFrontLeftPos(5,3);
			if(_pos_id===2)_pos1=_shipclass.getFrontPos(5);
			if(_pos_id===3)_pos1=_shipclass.getFrontRightPos(5,3);
		
			let _pos2=_shipclass.getFrontPos(5000);
		
			const _element=this._add_skill_multi_photon_1_elements[_counter];
			_counter++;
			
			let _laserObject=_element[1];
			let _laserRay=_element[2];
			
			_shipclass._game._graphics.show_laser(_laserObject);
			_laserObject.scale.x=_size;
			_laserObject.scale.y=_size;
			_laserObject.scale.z=_ray_length;
			_laserObject.position.copy(_pos1);
			_laserObject.lookAt(_pos2);
			
			let _update1=(t)=>{
				_shipclass._game._utils.translateObject(_laserObject,_pos2,t*_speed);
				
			};
			let _update2=()=>{
				const _laserStartPos=_laserObject.position;
				const _targets=this._game._unitMG.get_enemy_combat_unit_in_range_3(_shipclass,_laserStartPos,_ray_length);
				if(_targets.length>0){//alert("Count="+_targets.length);
				for(let i=0;i<_targets.length;i++){
					const _target=_targets[i][0];
					const _pos=_target.Position;
					const _laserEndPos=_shipclass._game._utils.findPointOnLine(_laserStartPos,_pos2,_ray_length);//diem cuoi cua laser
					const _d1=_pos.distanceTo(_laserStartPos);
					const _d2=_pos.distanceTo(_laserEndPos);
					if(_d1+_d2<_ray_length+20){
						_target.Take_Damage(_shipclass,_shipclass.constructor.name,null,_damage);
					}
				}};
			}
			
			_shipclass._game.add_to_update_function_list(_update1);
			_shipclass._game.add_to_function_list_4(_update2);
			
			_shipclass._game.add_to_timer(()=>{
				_shipclass._game.remove_function_from_update_list(_update1);
				_shipclass._game.remove_function_from_list_4(_update2);
				_shipclass._game._graphics.hide_laser(_laserObject);
			},_duration);
			
		};
		let _burst=()=>{
			_create_laser();
			_create_laser();
			_create_laser();
		};
		
		let _delay=1;
		_burst();
		_shipclass._game.add_to_timer(()=>{_burst();},_delay);
		_shipclass._game.add_to_timer(()=>{_burst();},_delay*2);
		_shipclass._game.add_to_timer(()=>{
			this._applying_generate_multi_photon_1=false;
		},6);
		
		//}catch(e){alert(e.stack);}
	}
	
	apply_additional_skill_generate_photon_2(_shipclass,_level){
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("additional_generate_photon_2");
		}
		const _laser_num=3;
		if(typeof this._applying_generate_photon_2==='undefined'){
			this._applying_generate_photon_2=false;
			this._add_skill_lasers_elements_2=new Array();
			for(let i=0;i<_laser_num;i++){
				const _element=_shipclass._game._graphics.create_laser("player");
				this._add_skill_lasers_elements_2.push(_element);
				
				const _laserObj=_element[1];
				_shipclass._game._graphics.Scene.remove(_laserObj);
				_shipclass._game._me._model.add(_laserObj);
			}
		}
		
		if(this._applying_generate_photon_2===true)
			return;
		this._applying_generate_photon_2=true;
		
		let _color="turquoise";
		let _duration=4;
		//let _damage=30;
		    //_damage+=_level*3;
		let _damage=_shipclass._game._parameters._standard_hp/25;
		    _damage+=(_level-1)*2;
		let _length=350;
		let _size;
		if(_shipclass===_shipclass._game._me)
			_size=0.04;//nhin tu vi tri cua player se lon' hon
		else
			_size=0.1;
		let _start_pos=_shipclass.Position;
		let _p_ship_id=parseInt(_shipclass._game._unitMG.get_player_ship_id(_shipclass));//alert(_p_ship_id);
		let _back,_down;//start-pos phai lui lai hoac tien len tuy vao player-ship model
		
		if(_p_ship_id===1)
		{
			_back=2;
			_down=2;
		}	
		else if(_p_ship_id===3)
		{
			_back=0;
			_down=2;
		}
		else if(_p_ship_id===4)
		{
			_back=2;
			_down=2;
		}
		else if(_p_ship_id===5)
		{
			_back=2;
			_down=2;
		}
		else
		{
			_back=0;
			_down=0;
		}	
		
		let _aim_pos=_shipclass.getFrontPos(3000);
		for(let i=0;i<this._add_skill_lasers_elements_2.length;i++){
				let _item=this._add_skill_lasers_elements_2[i];
				let _laserObject=_item[1];
					_laserObject.position.copy(_start_pos);
		}
		let _counter=0;//lam` giam damage
		let _update_fc=(t)=>{
			_counter++;
			if(_counter>100)_counter=0;
			const _pos1=_shipclass.Position;
			for(let i=0;i<this._add_skill_lasers_elements_2.length;i++){
				let _item=this._add_skill_lasers_elements_2[i];
				let _laserObject=_item[1];
				let _laserRay=_item[2];
					_laserRay.change_color(_color);
				
				let _target=null;
				
				if(typeof _laserObject._hitting_target!='undefined'&&
				_laserObject._hitting_target!=null){
					_target=_laserObject._hitting_target;
					if(_target.Dead){
						
					}
					else{
						const _pos2=_target.Position;
					      _laserObject.scale.z=_laserObject.position.distanceTo(_pos2);
						  _laserObject.scale.x=_size;
						  _laserObject.scale.y=_size;
						  _shipclass._game._utils.translateObject(_laserObject,_aim_pos,t*150);
						  
						  _laserObject.position.copy(new THREE.Vector3(0,2-_down,-2+_back));
						  _laserObject.lookAt(_pos2);
						  
						  //if(_counter%3===0)
							//_target.Take_Damage(_shipclass,_shipclass.constructor.name,"null",t*_damage);
						_target.Take_Damage(_shipclass,_shipclass.constructor.name,"null",_damage);
						  
					}
					
				}
				
			}
			
			const _targets=_shipclass._game._unitMG.get_enemy_combat_unit_in_range_3(_shipclass,_pos1,_length);
			for(let i=0;i<this._add_skill_lasers_elements_2.length;i++){
				let _item=this._add_skill_lasers_elements_2[i];
				let _laserObject=_item[1];
				if(typeof _laserObject._hitting_target==='undefined'||_laserObject._hitting_target===null){
					for(let j=0;j<_targets.length;j++){
						let _target=_targets[j][0];
						let _found=false;
						for(let k=0;k<this._add_skill_lasers_elements_2.length;k++){
							let _item2=this._add_skill_lasers_elements_2[k];
							let _laserObject2=_item2[1];
							if(_laserObject2._hitting_target===_target){
								_found=true;
								break;
							};
						}
						if(!_found){
							_laserObject._hitting_target=_target;
							_shipclass._game._graphics.show_laser(_laserObject);
						    _target.add_to_after_dead_function_list(()=>{
								_laserObject._hitting_target=null;
								_shipclass._game._graphics.hide_laser(_laserObject);
							});
						}
					}
				}
			}
				
		};
		_shipclass._game._sound.playSound("beam-1",_shipclass);
		_shipclass._game.add_to_function_list_4(_update_fc);
		
		_shipclass._game.add_to_timer(()=>{
			for(let i=0;i<this._add_skill_lasers_elements_2.length;i++){
				let _item=this._add_skill_lasers_elements_2[i];
				let _laserObject=_item[1];
				let _laserRay=_item[2];
				
				_laserObject._hitting_target=null;
				_shipclass._game._graphics.hide_laser(_laserObject);
				
				_shipclass._game.remove_function_from_list_4(_update_fc);
				this._applying_generate_photon_2=false;
				
			}
			
		},_duration);
		
	};
	
	apply_additional_skill_generate_photon_1(_shipclass,_level){//1 tia sang' photon huong' ve phia truoc
		//try{
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("additional_generate_photon_1");
		}
		
		if(typeof this._applying_generate_photon_1==='undefined'){
			this._applying_generate_photon_1=false;
			this._add_skill_laser_elements_1=_shipclass._game._graphics.create_laser("player");
		}
		
		if(typeof this._add_skill_laser_elements_1==='undefined'||this._add_skill_laser_elements_1===null){
			return;
		}
		
		if(this._applying_generate_photon_1===true)
			return;
		this._applying_generate_photon_1=true;
		
		let _laserObject=this._add_skill_laser_elements_1[1];
		let _laserRay=this._add_skill_laser_elements_1[2];
		    //_laserRay.change_color("turquoise");
		
		_shipclass._game._graphics.show_laser(_laserObject);
		
		let _duration=4;
		//let _damage=30;
		let _damage=_shipclass._game._parameters._standard_hp/130;
		    _damage+=(_level-1)*5;//<========
		let _length=350;
		let _size;
		if(_shipclass===_shipclass._game._me)
			_size=0.12;//nhin tu vi tri cua player se lon' hon
		else
			_size=0.3;
		
		let _update_fc=(t)=>{
			const _pos1=_shipclass.getFrontPos(5);
			const _pos2=_shipclass.getFrontPos(_length);
	
			_laserObject.scale.z=_pos1.distanceTo(_pos2);
			_laserObject.scale.x=_size;
			_laserObject.scale.y=_size;
			_laserObject.position.copy(_pos1);
			_laserObject.lookAt(_pos2);
			
			const _targets=_shipclass._game._unitMG.get_enemy_combat_unit_in_range_3(_shipclass,_pos1,_length);
			//_targets=this._game._unitMG.get_enemy_combat_unit_in_range(this._ahead_point,90);
			//_target.Take_Damage(this._unit,this.constructor.name,super.constructor.name,_damage);
			for(let i=0;i<_targets.length;i++){
				const _target=_targets[i][0];
				const _pos=_target.Position;
				const _d1=_pos.distanceTo(_pos1);
				const _d2=_pos.distanceTo(_pos2);
				if(_d1+_d2<_length+2){
					//_target.Take_Damage(_shipclass,_shipclass.constructor.name,"null",t*_damage);
					_target.Take_Damage(_shipclass,_shipclass.constructor.name,"null",_damage);
				}
			}
		};
		_shipclass._game.add_to_function_list_4(_update_fc);
		_shipclass._game.add_to_timer(()=>{
			_shipclass._game._graphics.hide_laser(_laserObject);
			_shipclass._game.remove_function_from_list_4(_update_fc);
			this._applying_generate_photon_1=false;
		},_duration);
		
		_shipclass._game._sound.playSound("beam-1",_shipclass);
		
		//}catch(e){alert(e.stack);}
	}
	
	/*
		Cường hóa dam của tất cả các loại rocket ở trong cửa hàng rocket(ko tính rocket trong các skill)
	*/
	apply_additional_skill_strengthen_rocket_damage_1(_shipclass,_level){//cường hóa dam của rocket
	
		if(typeof this._applying_strengthen_rocket_damage_1==='undefined'){
			this._applying_strengthen_rocket_damage_1=false;
			this._strengthen_rocket_damage_1_counter=0;
		}
			
		if(this._applying_strengthen_rocket_damage_1)return;
			this._applying_strengthen_rocket_damage_1=true;
		
		let _duration=100;
		let _rate=1;
			_rate+=(_level-1)*0.5;
			//_shipclass._game._noticeBoard.add_message("DamRate:"+_rate);
		let _max_rocket=10;//gioi han so luong rocket duoc ap dung skill
		
		let _fc=(_rockets)=>{
			
			if(this._strengthen_rocket_damage_1_counter>=_max_rocket)
				return;
			//console.log("hello");
			
			this._strengthen_rocket_damage_1_counter++;
			//_shipclass._game._noticeBoard.add_message("Counter:"+this._strengthen_rocket_damage_1_counter);
			for(let i=0;i<_rockets.length;i++){
				let _damage=_rockets[i]._params.damage;
				//_shipclass._game._noticeBoard.add_message("BeforeDam:"+_damage);
				_damage=parseInt(_damage*_rate);
				_rockets[i]._params.damage=_damage;
				_rockets[i]._damage=_damage;
				//_shipclass._game._noticeBoard.add_message("AfterDam:"+_damage);
			}
			
		};
		_shipclass._rocket_package.add_after_launch_function(_fc);
		_shipclass._game.add_to_timer(()=>{
			_shipclass._rocket_package.remove_after_launch_function(_fc);
			this._applying_strengthen_rocket_damage_1=false;
		},_duration);
		
	
	}
	apply_additional_skill_invisible(_shipclass,_level){//tang` hinh`
		
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("additional_invisible"+"="+_level);
		}
		
		let _min_duration=4;//(second) thoi gian tang hinh
		let _max_duration=8;
		let _duration=_min_duration;
		for(let i=1;i<=_level;i++){
			_duration+=0.3;
		}
		_duration=parseInt(_duration);
		if(_duration>_max_duration)_duration=_max_duration;
		
		let _min_opacity=0;
		let _max_opacity=0.4;
		let _opacity=_max_opacity;
		for(let i=1;i<=_level;i++){
			_opacity-=0.04;
		}
		if(_opacity<_min_opacity)_opacity=_min_opacity;
		
		let group=_shipclass._model;
		group.traverse((child) => {
			if (child.isMesh) {
				child.material.transparent=true;
				child.material.opacity=_opacity;
			}
		});
		
		_shipclass._game.add_to_timer(()=>{
			if(_shipclass.Dead)return;
			group.traverse((child) => {
				if (child.isMesh) {
					child.material.transparent=true;
					child.material.opacity=1;
				}
			});
		},_duration);
		
		
	}
	apply_additional_skill_simple_rocket(_shipclass,_num,_level){
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("additional_simple_rocket"+"="+_level);
		}
		
		//this._game._noticeBoard.add_message("Level:"+_level);
		for(let i=0;i<_num;i++){
			let _delay=i;
			this._game.add_to_timer(()=>{
				let _pos1=_shipclass.get_ahead_point(15);
				let _pos2=_shipclass.get_ahead_point(150);
				
				const model=new THREE.Object3D();
				let _rocket=_shipclass._game._unitMG.create_uncombat_unit(AdditionalSkill_Rocket,model,_pos1,false);
				let _plus_damage=_rocket._params.damage*(this._game._parameters.spaceship_additional_skills_level_rate*_level);
				_rocket._params.damage+=_plus_damage;
				//this._game._noticeBoard.add_message("Damage:"+_rocket._params.damage);
				_rocket._player_id=_shipclass._player_id;
				_rocket._unit=_shipclass;
				//this._game._graphics.Scene.add(_rocket._model);
				_rocket._model.lookAt(_pos2);
				_shipclass._game._sound.playSound('rocket-7',_shipclass);
			},_delay);
		}
		
	}
	
	apply_light_shield_skill(_shipclass,_level){
		_shipclass._applied_skill_num++;
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("lightShield");
		}
		
		const _shield=new LightShield({game:_shipclass._game,unit:_shipclass});
	}
	
	apply_flash_skill(_shipclass,_level){
		_shipclass._applied_skill_num++;
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("flash");
		}
		//_shipclass._game._sound.play('flash-skill');
		_shipclass._game._sound.playSound('flash-skill',_shipclass);
		const _radius=360;
		let _max_damage=_shipclass._game._parameters._standard_hp/3;
		let _plus_damage=_max_damage*(_shipclass._game._parameters.spaceship_main_skill_level_rate*_level);
				_max_damage+=_plus_damage;
				
		let _cause_damage;
		_cause_damage=(_m_damage)=>{
			let _units=_shipclass._game._unitMG.get_enemy_combat_unit_in_range_4(_shipclass,_shipclass.Position,_radius);
			for(let i=0;i<_units.length;i++){
				const _unit=_units[i][0];
				const _distance=_units[i][1];
				const _damage=_m_damage-((_distance/_radius)*_m_damage);//cang o gan cang mat nhieu HP
				if(_unit._is_enemy){
				_unit.Take_Damage(_shipclass,"main-skill",_shipclass.constructor.name,_damage);
				}
			}
		};
		//particle33,particle17,particle16,particle14
		//particle3
		//particle23,particle15
		let _sparks = new Sparks1({
				 game:_shipclass._game,
				parent:_shipclass._model,
				camera: _shipclass._game._graphics.Camera,
				position:new THREE.Vector3(0,0.5,-2),
				particle_id:'particle25',
				color1:'turquoise',
				color2:'turquoise',
				particle_size:0.6,
				velocity:{x:0,y:0,z:0},
				drift_range:{x:0.0,y:0.0,z:0.0}
			});
		_sparks.set_alpha(0.5);
		
		_shipclass._game.add_to_timer(()=>{
			_cause_damage(_max_damage*1/3);
			_sparks._Clear();
		},1);
		_sparks._after_clear=()=>{
			_cause_damage(_max_damage*2/3);
		};
		_shipclass._game.add_to_timer(()=>{
			
		},2);
		
		
	}
	apply_rain_of_bullets_skill(_shipclass,_level,_damage){
		_shipclass._applied_skill_num++;
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("fireRainBullet");
		}
		
		let _bullet_counter=0;
		let _shoot=()=>{
			let _gun_pos=[
				_shipclass.getLeftPos(5),
				_shipclass.getRightPos(5),
				//_shipclass.get_left_point(),
				//_shipclass.get_right_point(),
				//_shipclass.get_left_point2(),
				//_shipclass.get_right_point2(),
				//_shipclass.get_left_point3(),
				//_shipclass.get_right_point3(),
				//_shipclass.Position,
				//_shipclass.get_bellow_point(),
				//_shipclass.get_above_point()
			];
			
			let _pos_list=_shipclass._game._utils.get_random_elements_from_array(_gun_pos,2);
			for(let i=0;i<_pos_list.length;i++){
				_bullet_counter++;
				if(_bullet_counter%2===0)continue;//_unit1._model.visible=false;
				const model=new THREE.Object3D();
				let _UnitClass=Bullet;
				
				let _unit1=_shipclass._game._unitMG.create_uncombat_unit(_UnitClass,model,_pos_list[i],false);
				_shipclass._game._graphics.Scene.add(_unit1._model);
				
				if(_damage!=null)_unit1._params.damage=_damage;
				
				_unit1.look_at(_shipclass.getFrontPos(950));
				_unit1._player_id=_shipclass._player_id;
				_unit1._is_enemy=_shipclass._is_enemy;
				let _plus_damage=_unit1._params.damage*(_shipclass._game._parameters.spaceship_main_skill_level_rate*_level);
				_unit1._params.damage+=_plus_damage;//_unit1._params.damage=0.1;
				_unit1._unit=_shipclass;
				//_shipclass._game._noticeBoard.add_message("Level:"+_level);
				//_shipclass._game._noticeBoard.add_message("Damage:"+_unit1._params.damage);
			}
		
		};
		
		//_shipclass._game._sound.play('machine-gun-1');
		_shipclass._game._sound.playSound('machine-gun-1',_shipclass);
		
		_shipclass._game.add_to_function_list_3(_shoot);
		_shipclass._game.add_to_timer(()=>{
			_shipclass._game.remove_function_from_list_3(_shoot);
		},4);
	}
	apply_fire_breathing_skill(_shipclass,_level){
		_shipclass._applied_skill_num++;
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("fireBreathing");
		}
			
			let _count=5;
			for(let i=0;i<_count;i++){
			let gltf=_shipclass._game._unitMG._data_list["missile-1"];
			const model = gltf.scene.children[0];
			model.scale.setScalar(3.5);
			model.rotation.z=Math.PI;
			let _UnitClass=FireRocket;
			
			let _unit=_shipclass._game._unitMG.create_uncombat_unit(_UnitClass,model,_shipclass.get_ahead_point(2),false);
			_shipclass._game._graphics.Scene.add(_unit._model);
			_unit._model.lookAt(_shipclass.get_ahead_point(500));
			_unit._player_id=_shipclass._player_id;
			_unit._unit=_shipclass;
			
			let _plus_damage=_unit._params.damage*(_shipclass._game._parameters.spaceship_main_skill_level_rate*_level);
				_unit._params.damage+=_plus_damage;
				//_shipclass._game._noticeBoard.add_message("Level:"+_level);
				//_shipclass._game._noticeBoard.add_message("Damage:"+_unit._params.damage);
			//_unit._damage=this._damage;
			//console.log("FOUND");
		}
			
			//_shipclass._game._sound.play('rocket-7');
			_shipclass._game._sound.playSound('rocket-7',_shipclass);
	}
	apply_light_ball_skill(_shipclass,_level){
		_shipclass._applied_skill_num++;
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("launchLightBall");
		}
			const model=new THREE.Object3D();
			let _UnitClass=LightBall;
			
			const _pos1=_shipclass.get_ahead_point(2);
			let _rocket1= _shipclass._game._unitMG.create_uncombat_unit(_UnitClass,model,_pos1,false);
			_rocket1._unit=_shipclass;
			_rocket1._player_id=_shipclass._player_id;
			_shipclass._game._graphics.Scene.add(_rocket1._model);
			
			let _plus_damage=_rocket1._params.damage*(_shipclass._game._parameters.spaceship_main_skill_level_rate*_level);
				_rocket1._params.damage+=_plus_damage;
				//_shipclass._game._noticeBoard.add_message("Level:"+_level);
				//_shipclass._game._noticeBoard.add_message("Damage:"+_rocket1._params.damage);
			
			const _front_pos=_shipclass.get_ahead_point(1000);
			_rocket1._model.lookAt(_front_pos);
			//_shipclass._game._sound.play('rocket-2');
			_shipclass._game._sound.playSound('rocket-2',_shipclass);
		
	}
	apply_continuous_rocket_skill(_shipclass,_level){
		_shipclass._applied_skill_num++;
		if(_shipclass===_shipclass._game._me&&_shipclass._game._client){
			_shipclass._game._client.add_action("launchContinuousRocket");
		}
		let _num=8;
		let _counter=0;
		let _fc=()=>{//try{
			_counter++;if(_counter>_num)return;
			let _pos1=_shipclass.get_left_point3();
			let _pos2=_shipclass.get_right_point3();
			let _pos3=_shipclass.get_left_point2();
			let _pos4=_shipclass.get_right_point2();
			let _front_pos=_shipclass.get_ahead_point(500);
			
			let _leftPos=new THREE.Vector3();
			let _rightPos=new THREE.Vector3();
			_shipclass._left_point.getWorldPosition(_leftPos);
			_shipclass._right_point.getWorldPosition(_rightPos);
			/*
			let gltf=_shipclass._game._unitMG._data_list["missile-1"];
			const model = gltf.scene.children[0];
			model.scale.setScalar(2.0);
			model.rotation.z=Math.PI;
			*/
			const model=new THREE.Object3D();
			let _UnitClass=Rocket1;
			
			let _rocket1= _shipclass._game._unitMG.create_uncombat_unit(_UnitClass,model,_pos1,false);
			let _rocket2= _shipclass._game._unitMG.create_uncombat_unit(_UnitClass,model,_pos2,false);
			let _rocket3= _shipclass._game._unitMG.create_uncombat_unit(_UnitClass,model,_pos3,false);
			let _rocket4= _shipclass._game._unitMG.create_uncombat_unit(_UnitClass,model,_pos4,false);
			_rocket1._player_id=_shipclass._player_id;
			_rocket2._player_id=_shipclass._player_id;
			_rocket3._player_id=_shipclass._player_id;
			_rocket4._player_id=_shipclass._player_id;
			
			_rocket1._unit=_shipclass;
			_rocket2._unit=_shipclass;
			_rocket3._unit=_shipclass;
			_rocket4._unit=_shipclass;
			
			_shipclass._game._graphics.Scene.add(_rocket1._model);
			_shipclass._game._graphics.Scene.add(_rocket2._model);
			_shipclass._game._graphics.Scene.add(_rocket3._model);
			_shipclass._game._graphics.Scene.add(_rocket4._model);
			
			_rocket1._model.lookAt(_front_pos);
			_rocket2._model.lookAt(_front_pos);
			_rocket3._model.lookAt(_front_pos);
			_rocket4._model.lookAt(_front_pos);
			//_shipclass._game._sound.play('rocket-4');
			_shipclass._game._sound.playSound('rocket-4',_shipclass);
			
			let _plus_damage=_rocket1._params.damage*(_shipclass._game._parameters.spaceship_main_skill_level_rate*_level);
				_rocket1._params.damage+=_plus_damage;
				_rocket2._params.damage+=_plus_damage;
				_rocket3._params.damage+=_plus_damage;
				_rocket4._params.damage+=_plus_damage;
				//_shipclass._game._noticeBoard.add_message("Level:"+_level);
				//_shipclass._game._noticeBoard.add_message("Damage:"+_rocket1._params.damage);
			
		//}catch(e){alert(e.stack);}
		};
		
		_fc();
		_shipclass._game.add_to_timer(()=>{_fc();},1);
		_shipclass._game.add_to_timer(()=>{_fc();},2);
		/*
		this._game.add_to_function_list_4(_fc);
		this._game.add_to_timer(()=>{
			this._game.remove_function_from_list_4(_fc);
		},5);
		*/
	}
	
	apply_shield_skill(_delay1,_delay2){
		_shipclass.create_shield_1(_delay1);
		_shipclass._game.add_to_timer(()=>{
			if(_shipclass.Dead)return;
			_shipclass.apply_shield_skill(_delay1,_delay2);
		},_delay2);
	}
	
	create_shield_1(_time_delay){
		this._lock_take_damage=true;
		
		let _object=new THREE.Object3D();
		_object.visible=true;
		this._model.add(_object);
		_object.position.set(0,0,2);
		this._shield1 = new Shield1({
			game:this._game,
			parent:_object,
			camera: this._game._graphics.Camera,
			position:new THREE.Vector3(0,0,0),
		});
			
		let _update_shield=(timeElapsedS)=>{
			this._shield1.Step(timeElapsedS);
		};
		this._game.add_to_update_function_list(_update_shield);
		this.add_to_after_dead_function_list(()=>{
			this._game.remove_function_from_update_list(_update_shield);
		});
		
		this._game.add_to_timer(()=>{
			if(this.Dead)return;
			if(this._model)this._model.remove(_object);
			this._lock_take_damage=false;
		},_time_delay);
	}
	
	launch_sub_rocket(_num,_particle_id,_particle_color,_dam){
		let _launch_rocket=(_start_pos)=>{
			let gltf1=this._game._unitMG._data_list["missile-1"];
			const model1 = gltf1.scene.children[0];
			model1.scale.setScalar(1.3);
			model1.rotation.z=Math.PI;
			let _rocket1=this._game._unitMG.create_uncombat_unit(Rocket3,model1,_start_pos,false,
			{engine_velocity:1.5,spark_size:2.14,
			particle_id:_particle_id,
			particle_color:_particle_color,
			rocket_speed:1.0,rocket_range:400,unit:this});
			_rocket1._player_id=this._player_id;
			
			_rocket1._damage=_dam;
			
				_rocket1.look_at(this.getFrontPos(5000));
			
				this._game._graphics.Scene.add(_rocket1._model);
				_rocket1.launch();
			
		};
		
		_launch_rocket(this.Position);
		for(let i=1;i<_num;i++){
			this._game.set_timer(()=>{
				_launch_rocket(this.Position);
			},i*300);
		}
	}
}


const _VS = `
uniform float pointMultiplier;

attribute float size;
attribute float angle;
attribute vec4 colour;

varying vec4 vColour;
varying vec2 vAngle;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = size * pointMultiplier / gl_Position.w;

  vAngle = vec2(cos(angle), sin(angle));
  vColour = colour;
}`;

const _FS = `

uniform sampler2D diffuseTexture;

varying vec4 vColour;
varying vec2 vAngle;

void main() {
  vec2 coords = (gl_PointCoord - 0.5) * mat2(vAngle.x, vAngle.y, -vAngle.y, vAngle.x) + 0.5;
  gl_FragColor = texture2D(diffuseTexture, coords) * vColour;
}`;


class LinearSpline {
  constructor(lerp) {
    this._points = [];
    this._lerp = lerp;
  }

  AddPoint(t, d) {
    this._points.push([t, d]);
  }

  Get(t) {
    let p1 = 0;

    for (let i = 0; i < this._points.length; i++) {
      if (this._points[i][0] >= t) {
        break;
      }
      p1 = i;
    }

    const p2 = Math.min(this._points.length - 1, p1 + 1);

    if (p1 == p2) {
      return this._points[p1][1];
    }

    return this._lerp(
        (t - this._points[p1][0]) / (
            this._points[p2][0] - this._points[p1][0]),
        this._points[p1][1], this._points[p2][1]);
  }
}

class Shield1{
	constructor(params) {
	  this._game=params.game;
    const uniforms = {
        diffuseTexture: {
            value: new THREE.CanvasTexture(this._game._image_preloader.getImage('particle5'))
        },
        pointMultiplier: {
            value: window.innerHeight / (2.0 * Math.tan(0.5 * 60.0 * Math.PI / 180.0))
        }
    };

    this._material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: _VS,
        fragmentShader: _FS,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        transparent: true,
        vertexColors: true
    });

    this._camera = params.camera;
    this._particles = [];

    this._geometry = new THREE.BufferGeometry();
    this._geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
    this._geometry.setAttribute('size', new THREE.Float32BufferAttribute([], 1));
    this._geometry.setAttribute('colour', new THREE.Float32BufferAttribute([], 4));
    
    this._points = new THREE.Points(this._geometry, this._material);

    params.parent.add(this._points);
	this._points.position.copy(params.position);
    this._alphaSpline = new LinearSpline((t, a, b) => {
      return a + t * (b - a);
    });
    this._alphaSpline.AddPoint(0.0, 0.0);
    this._alphaSpline.AddPoint(0.1, 1.0);
    this._alphaSpline.AddPoint(0.6, 1.0);
    this._alphaSpline.AddPoint(1.0, 0.0);

    this._colourSpline = new LinearSpline((t, a, b) => {
      const c = a.clone();
      return c.lerp(b, t);
    });
    this._colourSpline.AddPoint(0.0, new THREE.Color(0x10E4DB));
    this._colourSpline.AddPoint(1.0, new THREE.Color(0x10E4DB));

    this._sizeSpline = new LinearSpline((t, a, b) => {
      return a + t * (b - a);
    });
    this._sizeSpline.AddPoint(0.5, 1.0);
    //document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
  
    this._UpdateGeometry();
  }

  _AddParticles(timeElapsed) {
    if (!this.gdfsghk) {
      this.gdfsghk = 0.0;
    }
   
    for (let i = 0; i < 1; i++) {
      const life = (Math.random() * 0.75 + 0.25) * 10.0;
      this._particles.push({
          position: new THREE.Vector3(
              0.0,
              0.0,
             0.0),
          size:  30,
          colour: new THREE.Color(),
          alpha: 0.1,
          life: life,
          maxLife: life,
          rotation: Math.PI,
          velocity: new THREE.Vector3(0, 0.0, 0),
      });
    }
  }

  _UpdateGeometry() {
	if(!this._first)this._first=true;
    const positions = [];
    const sizes = [];
    const colours = [];
    const angles = [];
    for (let p of this._particles) {
      positions.push(p.position.x, p.position.y, p.position.z);
      colours.push(p.colour.r, p.colour.g, p.colour.b, p.alpha);
      sizes.push(p.currentSize);
    }
	
    this._geometry.setAttribute(
        'position', new THREE.Float32BufferAttribute(positions, 3));
    
    this._geometry.attributes.position.needsUpdate = true;
	
	
	if(this._first){
		this._geometry.setAttribute(
			'size', new THREE.Float32BufferAttribute(sizes, 1));
		this._geometry.setAttribute(
			'colour', new THREE.Float32BufferAttribute(colours, 4));
		
		this._geometry.attributes.size.needsUpdate = false;
		this._geometry.attributes.colour.needsUpdate = false;
		
	}
	else{
		this._geometry.attributes.size.needsUpdate = false;
		this._geometry.attributes.colour.needsUpdate = false;
		this._geometry.attributes.angle.needsUpdate = false;
	}
	
	
	this._first=false;
  }

  _UpdateParticles(timeElapsed) {
    for (let p of this._particles) {
      p.life -= timeElapsed;
    }

    this._particles = this._particles.filter(p => {
      return p.life > 0.0;
    });
	
	let _counter=0;
    for (let p of this._particles) {
	  
      const t = 1.0 - p.life / p.maxLife;

      //p.rotation += timeElapsed * 0.5;
      p.alpha = 0.1;
	  //p.currentSize = p.size*this._sizeSpline.Get(t);
      p.currentSize = p.size+(_counter*0.03);
      p.colour.copy(this._colourSpline.Get(t));

      p.position.add(p.velocity.clone().multiplyScalar(timeElapsed));
	  
	  _counter++;
    }
	
  }

  Step(timeElapsed) {
    this._AddParticles(timeElapsed);
    this._UpdateParticles(timeElapsed);
    this._UpdateGeometry();
  }
}


class RocketAttackSkill extends SpaceShip{
	
}


class Bullet extends SpaceShip{
	constructor(params){
		params.health=99999999;
		params.damage=params.game._parameters._standard_hp/50;
		
		super(params);
		
		this._radius_effect1=20*this._game.rocket_multiplier;
		this._radius_effect2=10*this._game.rocket_multiplier;
		this._origin_position=this.get_world_position();//vị trí ban đầu
		this._max_distance=650*this._game.rocket_multiplier;//quãng đường xa nhất tên lửa có thể bay đi
		
		this._target_id=0;
		this._lock_missile=true;
		
		let _engine_object=new THREE.Object3D();
			_engine_object.visible=true;
			this._engine_object=_engine_object;
			this._model.add(_engine_object);
			_engine_object.position.set(0,0,2.2);
			this._sparks = new BulletSparks({
				 game:this._game,
				parent:_engine_object,
				camera: this._game._graphics.Camera,
				position:new THREE.Vector3(0,0,0),
			});
			
			let _update_sparks=(timeElapsedS)=>{
				this._sparks.Step(timeElapsedS);
			};
			this._game.add_to_update_function_list(_update_sparks);
			this.add_to_after_dead_function_list(()=>{
				this._game.remove_function_from_update_list(_update_sparks);
			});
	}
	SelfDestroy(){
		super.SelfDestroy();
		
	}
	
	CheckTarget(timeInSeconds){
			const _position=this.Position;
			const _t_distance=_position.distanceTo(this._origin_position);
			if(_t_distance>this._max_distance){
				this.SelfDestroy();
				return;
			}
			
			if(!this._ahead_point){
				this._ahead_point=this.get_back_point(250);
			}
			if(_t_distance<70)
			{
				this.move_forward(timeInSeconds*400);
			}	
			else{
				this.move_forward(timeInSeconds*300);
			}
			//console.log(this._player_id);
			//let _targets=this._game._unitMG.get_enemy_combat_unit_in_range(_position,this._radius_effect1);
			let _targets=this._game._unitMG.get_enemy_combat_unit_in_range_3(this,_position,this._radius_effect1);
			   //if(_targets.length>0)this._game._noticeBoard.add_message("FoundNum:"+_targets.length);
			   //if(_targets.length>0)console.log("FoundNum:"+_targets.length);
				for(let i=0;i<_targets.length;i++){
					const _target=_targets[i][0];
					if(_target.Dead)continue;
					if(typeof _target._shooted_by_ship_5==='undefined')
						_target._shooted_by_ship_5=null;
					if(_target._shooted_by_ship_5===this)continue;
					const _distance=_targets[i][1];
					let _damage=this._params.damage;
					if(_distance>this._radius_effect2*3/4)_damage=this._params.damage/3;
					if(_distance>this._radius_effect2*1/2)_damage=this._params.damage/2;
					
					//_target.TakeDamage(_damage);
					//_target.Take_Damage(this._unit,this.constructor.name,super.constructor.name,_damage);
					_target.Take_Damage(this._unit,"main-skill",super.constructor.name,_damage);
					//alert("FOUND");
					_target._shooted_by_ship_5=this;
				}
			
	}
}

class BulletSparks{
  constructor(params) {
	  this._game=params.game;
	  const _image = this._game._image_preloader.getImage('particle21');
	  const texture = new THREE.Texture(_image);
	  texture.needsUpdate = true;
    const uniforms = {
        diffuseTexture: {
            //value: new THREE.CanvasTexture(this._game._image_preloader.getImage('particle21'))
			//value: new THREE.TextureLoader().load("./resources/particle/noname-19.png")
			value: texture
        },
        pointMultiplier: {
            value: window.innerHeight / (2.0 * Math.tan(0.5 * 60.0 * Math.PI / 180.0))
        }
    };

    this._material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: _VS,
        fragmentShader: _FS,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        transparent: true,
        vertexColors: true
    });

    this._camera = params.camera;
    this._particles = [];

    this._geometry = new THREE.BufferGeometry();
    this._geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
    this._geometry.setAttribute('size', new THREE.Float32BufferAttribute([], 1));
    this._geometry.setAttribute('colour', new THREE.Float32BufferAttribute([], 4));
    //this._geometry.setAttribute('angle', new THREE.Float32BufferAttribute([], 1));

    this._points = new THREE.Points(this._geometry, this._material);

    params.parent.add(this._points);
	this._points.position.copy(params.position);
	
	//this._points.position.set(7500,100,-50);

    this._alphaSpline = new LinearSpline((t, a, b) => {
      return a + t * (b - a);
    });
    this._alphaSpline.AddPoint(0.0, 0.0);
    this._alphaSpline.AddPoint(0.1, 1.0);
    this._alphaSpline.AddPoint(0.6, 1.0);
    this._alphaSpline.AddPoint(1.0, 0.0);

    this._colourSpline = new LinearSpline((t, a, b) => {
      const c = a.clone();
      return c.lerp(b, t);
    });
    this._colourSpline.AddPoint(0.0, new THREE.Color(0xFFFF80));
    this._colourSpline.AddPoint(1.0, new THREE.Color(0xFF8080));

    this._sizeSpline = new LinearSpline((t, a, b) => {
      return a + t * (b - a);
    });
    this._sizeSpline.AddPoint(0.5, 1.0);
    //this._sizeSpline.AddPoint(0.5, 5.0);
    //this._sizeSpline.AddPoint(1.0, 1.0);
	
	//this._sizeSpline.AddPoint(1.0, 0.0);
	//this._sizeSpline.AddPoint(1.0, 0.0);
	//this._sizeSpline.AddPoint(1.0, 0.0);

    //document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
  
    this._UpdateGeometry();
  }
	
  _getMesh(){
	  return this._points;
  }

  _AddParticles(timeElapsed) {
    if (!this.gdfsghk) {
      this.gdfsghk = 0.0;
    }
   
    for (let i = 0; i < 1; i++) {
      const life = (Math.random() * 0.75 + 0.25) * 10.0;
      this._particles.push({
          position: new THREE.Vector3(
              0.0,
              0.0,
             0.0),
          size:  1,
          colour: new THREE.Color(),
          alpha: 1.0,
          life: life,
          maxLife: life,
          rotation: Math.random() * 2.0 * Math.PI,
          velocity: new THREE.Vector3(0, 0.0, 2),
      });
    }
  }

  _UpdateGeometry() {
	if(!this._first)this._first=true;
	
	  
    const positions = [];
    const sizes = [];
    const colours = [];
    const angles = [];

    for (let p of this._particles) {
      positions.push(p.position.x, p.position.y, p.position.z);
      colours.push(p.colour.r, p.colour.g, p.colour.b, p.alpha);
      sizes.push(p.currentSize);
      //angles.push(p.rotation);
    }
	
    this._geometry.setAttribute(
        'position', new THREE.Float32BufferAttribute(positions, 3));
    
    this._geometry.attributes.position.needsUpdate = true;
	
	
	if(this._first){
		this._geometry.setAttribute(
			'size', new THREE.Float32BufferAttribute(sizes, 1));
		this._geometry.setAttribute(
			'colour', new THREE.Float32BufferAttribute(colours, 4));
		//this._geometry.setAttribute(
			//'angle', new THREE.Float32BufferAttribute(angles, 1));
			
		this._geometry.attributes.size.needsUpdate = false;
		this._geometry.attributes.colour.needsUpdate = false;
		//this._geometry.attributes.angle.needsUpdate = false;
		
	}
	else{
		this._geometry.attributes.size.needsUpdate = false;
		this._geometry.attributes.colour.needsUpdate = false;
		this._geometry.attributes.angle.needsUpdate = false;
	}
	
	
	this._first=false;
  }

  _UpdateParticles(timeElapsed) {
    for (let p of this._particles) {
      p.life -= timeElapsed;
    }

    this._particles = this._particles.filter(p => {
      return p.life > 0.0;
    });
	
	let _counter=0;
    for (let p of this._particles) {
	  
      const t = 1.0 - p.life / p.maxLife;

      p.rotation += timeElapsed * 0.5;
      p.alpha = 1.0;
	  //p.currentSize = p.size*this._sizeSpline.Get(t);
      p.currentSize = p.size+(_counter*0.03);
      p.colour.copy(this._colourSpline.Get(t));

      p.position.add(p.velocity.clone().multiplyScalar(timeElapsed));
	  

      const drag = p.velocity.clone();
      drag.multiplyScalar(timeElapsed * 0.1);
      drag.x = Math.sign(p.velocity.x) * Math.min(Math.abs(drag.x), Math.abs(p.velocity.x));
      drag.y = Math.sign(p.velocity.y) * Math.min(Math.abs(drag.y), Math.abs(p.velocity.y));
      drag.z = Math.sign(p.velocity.z) * Math.min(Math.abs(drag.z), Math.abs(p.velocity.z));
      p.velocity.sub(drag);
	  
	  _counter++;
    }
	
  }

  Step(timeElapsed) {
    this._AddParticles(timeElapsed);
    this._UpdateParticles(timeElapsed);
    this._UpdateGeometry();
  }
}

class AdditionalSkill_Rocket extends RocketAttackSkill{
	constructor(params){
		
		params.health=99999999;
		params.damage=params.game._parameters._standard_hp/10;
		
		super(params);
		
		
		this._radius_effect1=30*this._game.rocket_multiplier;//khoảng cách mà khi tên lửa ở gần mục tiêu sẽ phát nổ
		this._radius_effect2=60*this._game.rocket_multiplier;//bán kính tầm ảnh hưởng của vụ nổ
		this._origin_position=this.get_world_position();//vị trí ban đầu
		this._max_distance=1000*this._game.rocket_multiplier;//quãng đường xa nhất tên lửa có thể bay đi
		this._speed1=this._game._parameters._standard_rocket_speed*1.7;
		this._speed2=this._game._parameters._standard_rocket_speed*2.7;
		
		this.tha = 0;
		this.R = 15;
		this._update_fc=(timeInSeconds)=>{
			this.update(timeInSeconds);
		 };
		this._game.add_to_update_function_list(this._update_fc);
		
		this.create_thruster(new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0));
		
		
	}
	
	update(){
		
		this.tha += .13;
		
		const _pos=this.Position;
		
		this.emitter1.p.x=_pos.x;
		this.emitter1.p.y=_pos.y;
		this.emitter1.p.z=_pos.z;
		
		this.proton.update();
		
	}
	addProton(position) {
        this.proton = getNewProton();

        this.emitter1 = this.createEmitter(position.x,position.y,position.z, '#4F1500', '#0029FF');
		
		this.emitter1.p.z = this._position.z + this.R * Math.cos(this.tha);
        this.emitter1.p.x = this._position.x +this.R * Math.sin(this.tha);
		this.emitter1.p.y = this._position.y;
       
        this.proton.addEmitter(this.emitter1);
        this.proton.addRender(new Proton.SpriteRender(this._game._graphics.Scene));
		
    }
	
	destroy_thruster() {
		this.proton.emitters.forEach(emitter => {
			emitter.stopEmit();
		});
		
		
		this.proton.emitters.forEach(emitter => {
			emitter.particles.forEach(particle => {
				
				emitter.removeParticle(particle);//sẽ gây lỗi, nhưng nhờ có lỗi mới destroy được,(chưa rõ nguyên nhân vì sao khi destroy mà system vẫn ko bị remove khỏi scene
				
			});
			emitter.removeAllParticles();
		});

		this.proton.removeEmitter(this.emitter1);
		this.proton.destroy();
		
	}	
	createSprite() {
        //var map = new THREE.TextureLoader().load("./resources/particle/noname-3.png");
		//var map = new THREE.CanvasTexture(this._game._image_preloader.getImage('particle26'));
		const _image = this._game._image_preloader.getImage('particle26');
	  const texture = new THREE.Texture(_image);
	  texture.needsUpdate = true;
        var material = new THREE.SpriteMaterial({
            map: texture,
            color: 0xff0000,
            blending: THREE.AdditiveBlending,
            fog: true
        });
        return new THREE.Sprite(material);
    }
	create_thruster(position,direction){
		this._position=position;
		this._direction=direction;
		
		this.addProton(position);
	}
	createEmitter(x, y, z, color1, color2) {
        var emitter = new Proton.Emitter();
        emitter.rate = new Proton.Rate(new Proton.Span(3, 9), new Proton.Span(.01, .02));
        //emitter.addInitialize(new Proton.Mass(1));
        emitter.addInitialize(new Proton.Life(0.5));
        emitter.addInitialize(new Proton.Body(this.createSprite()));
        emitter.addInitialize(new Proton.Radius(8));
        //emitter.addInitialize(new Proton.V(200, new Proton.Vector3D(0, 0, -1), 0));


        emitter.addBehaviour(new Proton.Alpha(1, 0));
        emitter.addBehaviour(new Proton.Color(color1, color2));
        emitter.addBehaviour(new Proton.Scale(1, 0));
        //emitter.addBehaviour(new Proton.CrossZone(new Proton.ScreenZone(camera, renderer), 'dead'));


        //emitter.addBehaviour(new Proton.Force(0, 0, -20));
       
        emitter.p.x = x;
        emitter.p.y = y;
		emitter.p.z = z;
        
		const emit_time=1.0;
		const emitter_life=1.0;
		emitter.emit(emit_time,emitter_life);
		

        return emitter;
    }
	
	SelfDestroy(){
		super.SelfDestroy();
		this._params.game._entities['_explosionSystem'].Splode(this.Position,"#EF2F0D","#EF2F0D",24,96);
		this._game.add_to_timer(()=>{
			this.destroy_thruster();
		},2);
		this._game.add_to_timer(()=>{//neu stop update qua' som' thi cac particle chua xoa' di het
			this._game.remove_function_from_update_list(this._update_fc);
		},13);
		
	}
	
	CheckTarget(timeInSeconds){
			const _position=this.Position;
			const _t_distance=_position.distanceTo(this._origin_position);
			const _speed1=this._speed1;
			const _speed2=this._speed2;
			
			if(_t_distance>this._max_distance){
				this.SelfDestroy();
				return;
			}
			if(_t_distance<70)
			{
				this.move_forward(timeInSeconds*_speed1);
			}	
			else{
				this.move_forward(timeInSeconds*_speed2);
				
			}
			let _targets=this._game._unitMG.get_enemy_combat_unit_in_range_3(this,_position,this._radius_effect1);
				for(let i=0;i<_targets.length;i++){
					const _target=_targets[i][0];
					if(_target.Dead)continue;
					
					if(typeof _target._additional_rockets_1==='undefined'){
						_target._additional_rockets_1=new Array();
					}
					for(let j=0;j<_target._additional_rockets_1.length;j++){
						if(_target._additional_rockets_1[j]===this)
							return;
					}
					
					const _distance=_targets[i][1];
					let _damage=this._params.damage;
					if(_distance>this._radius_effect2*3/4)_damage=this._params.damage/3;
					if(_distance>this._radius_effect2*1/2)_damage=this._params.damage/2;
					
					
					_target.Take_Damage(this._unit,this.constructor.name,super.constructor.name,_damage);
					_target._additional_rockets_1.push(this);
					//this._game._noticeBoard.add_message(""+_target.constructor.name);
				}
				//if(_targets!=null&&_targets.length>0)this.SelfDestroy();
	}
}

class LightShield{
	
	constructor(params){
		this._game=params.game;
		this._unit=params.unit;
		/*
		this.tha = 0;
		this.R = 15;
		this._update_fc=(timeInSeconds)=>{
			this.update(timeInSeconds);
		 };
		this._game.add_to_update_function_list(this._update_fc);
		
		this.create(new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0));
		*/
		
		this._shield_time=5;
		this._unit._lock_take_damage=true;
		this._game.add_to_timer(()=>{
			this._unit._lock_take_damage=false;
			this.destroy();
		},this._shield_time);
		
		let _object=new THREE.Object3D();
		this._unit._model.add(_object);
		_object.position.set(0,2,0);
		this._unit._simple_shield = new GlowingEffect({
			game:this._unit._game,
			parent:_object,
			camera: this._unit._game._graphics.Camera,
			position:new THREE.Vector3(0,0,0),
			particle_id:'particle2'
		});
			
		let _update_shield=(timeElapsedS)=>{
			
			this._unit._simple_shield.Step(timeElapsedS);
		};
		this._unit._game.add_to_update_function_list(_update_shield);
		this._unit.add_to_after_dead_function_list(()=>{
			this._unit._game.remove_function_from_update_list(_update_shield);
		});
		this._unit._game.add_to_timer(()=>{
			this._unit._game.remove_function_from_update_list(_update_shield);
			this._unit._model.remove(_object);
		},this._shield_time);
	}
	
	update(){
		
		this.tha += .13;
		
		const _pos=this._unit.get_back_point(10);
		
		this.emitter1.p.x=_pos.x;
		this.emitter1.p.y=_pos.y;
		this.emitter1.p.z=_pos.z;
		
		this.proton.update();
		
		
		
	}
	addProton(position) {
        this.proton = getNewProton();

        this.emitter1 = this.createEmitter(position.x,position.y,position.z, '#4F1500', '#0029FF');
		
		this.emitter1.p.z = this._position.z + this.R * Math.cos(this.tha);
        this.emitter1.p.x = this._position.x +this.R * Math.sin(this.tha);
		this.emitter1.p.y = this._position.y;
       
        this.proton.addEmitter(this.emitter1);
        this.proton.addRender(new Proton.SpriteRender(this._game._graphics.Scene));
		
		//this.rotate_system();
    }
	
	destroy() {
		return;
		this.proton.emitters.forEach(emitter => {
			emitter.stopEmit();
		});
		
		
		this.proton.emitters.forEach(emitter => {
			emitter.particles.forEach(particle => {
				
				emitter.removeParticle(particle);//sẽ gây lỗi, nhưng nhờ có lỗi mới destroy được,(chưa rõ nguyên nhân vì sao khi destroy mà system vẫn ko bị remove khỏi scene
				
			});
			emitter.removeAllParticles();
		});

		this.proton.removeEmitter(this.emitter1);
		//this.proton.removeEmitter(this.emitter2);
		this.proton.destroy();
		this._game.remove_function_from_update_list(this._update_fc);
		
	}	
	createSprite() {
        //var map = new THREE.TextureLoader().load("./resources/particle/noname-7.png");
		var map = new THREE.CanvasTexture(this._game._image_preloader.getImage('particle10'));
        var material = new THREE.SpriteMaterial({
            map: map,
            color: 0xff0000,
            blending: THREE.AdditiveBlending,
            fog: true
        });
        return new THREE.Sprite(material);
    }
	create(position,direction){
		this._position=position;
		this._direction=direction;
		
		this.addProton(position);
	}
	createEmitter(x, y, z, color1, color2) {
        var emitter = new Proton.Emitter();
        emitter.rate = new Proton.Rate(new Proton.Span(4, 14), new Proton.Span(.015, .035));
        //emitter.addInitialize(new Proton.Mass(1));
        emitter.addInitialize(new Proton.Life(0.5));
        emitter.addInitialize(new Proton.Body(this.createSprite()));
        emitter.addInitialize(new Proton.Radius(10));
        //emitter.addInitialize(new Proton.V(200, new Proton.Vector3D(0, 0, -1), 0));


        //emitter.addBehaviour(new Proton.Alpha(1, 0));
        emitter.addBehaviour(new Proton.Color(color1, color2));
        //emitter.addBehaviour(new Proton.Scale(1, 0));
		//emitter.addBehaviour(new Proton.RandomDrift(10, 10, 0.02));
        //emitter.addBehaviour(new Proton.CrossZone(new Proton.ScreenZone(camera, renderer), 'dead'));
		var rotation = new Proton.Rotate(50,50);
        emitter.addBehaviour(rotation);

        //emitter.addBehaviour(new Proton.Force(0, 0, -20));
       
        emitter.p.x = x;
        emitter.p.y = y;
		emitter.p.z = z;
        //emitter.emit();
		
		
		const emit_time=this._shield_time;
		const emitter_life=4.5;
		emitter.emit(emit_time,emitter_life);
		

        return emitter;
    }
	
}


class FireRocket extends SpaceShip {
	
	constructor(params){
		
		params.health=99999999;
		params.damage=params.game._parameters._standard_hp/3;
		
		super(params);
		
		this._radius_effect1=8*this._game.rocket_multiplier;//khoảng cách mà khi tên lửa ở gần mục tiêu sẽ phát nổ
		this._radius_effect2=25*this._game.rocket_multiplier;//bán kính tầm ảnh hưởng của vụ nổ
		this._radius_scan=90*this._game.rocket_multiplier;
		this._origin_position=this.get_world_position();//vị trí ban đầu
		
		this._max_distance=1000*this._game.rocket_multiplier;//quãng đường xa nhất tên lửa có thể bay đi
		this._life=3*this._game.rocket_multiplier;
		
		this._speed1=this._game._parameters._standard_rocket_speed*1.7;
		this._speed2=this._game._parameters._standard_rocket_speed*2.7;
		
		this._target_id=0;
		this._lock_missile=true;
		
		this.tha = 0;
		this.R = 15;
		this._update_fc=(timeInSeconds)=>{
			this.update(timeInSeconds);
		 };
		this._game.add_to_update_function_list(this._update_fc);
		
		this.create_thruster(new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0));
		
		this._game.add_to_timer(()=>{
			this.SelfDestroy();
		},this._life);
	}
	
	update(){
		
		this.tha += .13;
		
		const _pos=this.Position;
		
		this.emitter1.p.x=_pos.x;
		this.emitter1.p.y=_pos.y;
		this.emitter1.p.z=_pos.z;
		
        //this.emitter1.p.z = this._position.z + this.R * Math.cos(this.tha);
        //this.emitter1.p.x = this._position.x +this.R * Math.sin(this.tha);
		//this.emitter1.p.y = this._position.y;
		//this.emitter1.p.z+=10;
		
		this.proton.update();
		
	}
	addProton(position) {
        this.proton = getNewProton();

        this.emitter1 = this.createEmitter(position.x,position.y,position.z, '#4F1500', '#0029FF');
		
		this.emitter1.p.z = this._position.z + this.R * Math.cos(this.tha);
        this.emitter1.p.x = this._position.x +this.R * Math.sin(this.tha);
		this.emitter1.p.y = this._position.y;
       
        this.proton.addEmitter(this.emitter1);
        this.proton.addRender(new Proton.SpriteRender(this._game._graphics.Scene));
		
		//this.rotate_system();
    }
	
	destroy_thruster() {
		cleanupProton(this.proton);
		this.proton=null;
		/*
		this.proton.emitters.forEach(emitter => {
			emitter.stopEmit();
		});
		
		
		this.proton.emitters.forEach(emitter => {
			emitter.particles.forEach(particle => {
				
				//emitter.removeParticle(particle);//sẽ gây lỗi, nhưng nhờ có lỗi mới destroy được,(chưa rõ nguyên nhân vì sao khi destroy mà system vẫn ko bị remove khỏi scene
				
			});
			emitter.removeAllParticles();
		});
        this.emitter1.destroy();
		this.proton.removeEmitter(this.emitter1);
		//this.proton.removeEmitter(this.emitter2);
		this.proton.destroy();
		//this._game.remove_function_from_update_list(this._update_fc);
		*/
	}	
	createSprite() {
        //var map = new THREE.TextureLoader().load("./resources/particle/noname-7.png");
		//var map = new THREE.CanvasTexture(this._game._image_preloader.getImage('particle39'));
		const _image = this._game._image_preloader.getImage('particle39');
	  const texture = new THREE.Texture(_image);
	  texture.needsUpdate = true;
        var material = new THREE.SpriteMaterial({
            map: texture,
            color: 0xff0000,
            blending: THREE.AdditiveBlending,
            fog: true
        });
        return new THREE.Sprite(material);
    }
	create_thruster(position,direction){
		this._position=position;
		this._direction=direction;
		
		this.addProton(position);
	}
	createEmitter(x, y, z, color1, color2) {
        var emitter = new Proton.Emitter();
        emitter.rate = new Proton.Rate(new Proton.Span(3, 9), new Proton.Span(.001, .004));
        //emitter.addInitialize(new Proton.Mass(1));
        emitter.addInitialize(new Proton.Life(0.5));
        emitter.addInitialize(new Proton.Body(this.createSprite()));
        emitter.addInitialize(new Proton.Radius(6));
        //emitter.addInitialize(new Proton.V(200, new Proton.Vector3D(0, 0, -1), 0));


        //emitter.addBehaviour(new Proton.Alpha(1, 0));
        emitter.addBehaviour(new Proton.Color(color1, color2));
        emitter.addBehaviour(new Proton.Scale(1, 0));
		//emitter.addBehaviour(new Proton.RandomDrift(10, 10, 0.02));
        //emitter.addBehaviour(new Proton.CrossZone(new Proton.ScreenZone(camera, renderer), 'dead'));


        //emitter.addBehaviour(new Proton.Force(0, 0, -20));
       
        emitter.p.x = x;
        emitter.p.y = y;
		emitter.p.z = z;
        //emitter.emit();
		
		
		const emit_time=0.5;
		const emitter_life=0.3;
		emitter.emit(emit_time,emitter_life);
		

        return emitter;
    }
	
	
	SelfDestroy(){
		super.SelfDestroy();
		this._game._entities['_explosionSystem'].Splode(this.Position,"#E8EF0D","#E8EF0D",24,96);
		this._game.add_to_timer(()=>{
			this._game.remove_function_from_update_list(this._update_fc);
			this.destroy_thruster();
		},2);
		
		if(this._target_object&&this._target_object!=null){
			this._target_object._is_missile_3_target=false;
		}
	}
	
	CheckTarget(timeInSeconds){
		
			const _speed1=this._speed1;
			const _speed2=this._speed2;
			let _targets;
			
			const _position=this.Position;
			const _t_distance=_position.distanceTo(this._origin_position);
			if(_t_distance>this._max_distance){
				this.SelfDestroy();
				return;
			}
			
			if(!this._ahead_point){
				this._ahead_point=this.get_back_point(250);
			}
			if(_t_distance<70)
			{
				this.move_forward(timeInSeconds*_speed1);
				if(!this._target_object||this._target_object===null||this._target_object.Dead){
					this._target_object=null;
					//_targets=this._game._unitMG.get_enemy_combat_unit_in_range(this._ahead_point,90);
					_targets=this._game._unitMG.get_enemy_combat_unit_in_range_4(this,this._ahead_point,this._radius_scan);
					for(let i=0;i<_targets.length;i++){
						const _target=_targets[i][0];
						if(_target.Dead)continue;
						if(this._utils.calculateAngleDeg(_position,this.getFrontPos(5000),_target.Position)>20)
							continue;
					
						if(_target._is_fire_rocket_target)//ko de cho 2 ten lua ban' cung muc tieu
							continue;
						if(this._target_object===null){
							this._target_object=_target;
							this._target_object._is_fire_rocket_target=true;
							break;
						}
					
					}
				
				}
			}	
			else{
				const _length=timeInSeconds*_speed2;
				let _dis;
				if(this._target_object!=null&&!this._target_object.Dead)
					_dis=this.Position.distanceTo(this._target_object.Position);
				else
					_dis=_length;
				
				if(_length<_dis)
					this.move_forward(_length);
				else
					this.move_forward(_dis);
				
			    if(this._target_object!=null){
					
					this.look_at(this._target_object.Position);
				}
				this.New_Cause_Damage();
			}
			
	}
	
	New_Cause_Damage(){
		let _targets=this._game._unitMG.get_enemy_combat_unit_in_range_4(this,this.Position,this._radius_effect1);
				for(let i=0;i<_targets.length;i++){
					const _target=_targets[i][0];
					if(_target.Dead)continue;
					const _distance=_targets[i][1];
					let _damage=this._params.damage;
					if(_distance>this._radius_effect2*3/4)_damage=this._params.damage/3;
					if(_distance>this._radius_effect2*1/2)_damage=this._params.damage/2;
					
					_target.Take_Damage(this._unit,"main-skill",super.constructor.name,_damage);
				}
				if(_targets!=null&&_targets.length>0)this.SelfDestroy();
	}
}


class CirclingRocket extends SpaceShip{
	constructor(params){
		
		params.health=99999999;
		params.damage=params.game._parameters._standard_hp/2;
		
		super(params);
		
		this._radius_effect1=30*this._game.rocket_multiplier;//khoảng cách mà khi tên lửa ở gần mục tiêu sẽ phát nổ
		this._radius_effect2=30*this._game.rocket_multiplier;//bán kính tầm ảnh hưởng của vụ nổ
		this._origin_position=this.get_world_position();//vị trí ban đầu
		this._origin_above_position=this.getAbovePos(30);
		this._max_distance=800*this._game.rocket_multiplier;//quãng đường xa nhất tên lửa có thể bay đi
		this._missile_speed1=this._game._parameters._standard_rocket_speed*1.7;
		this._missile_speed2=this._game._parameters._standard_rocket_speed*2.7;
		this._damage=0.5;//công thức damage=timeInSeconds*this._damage, ước lượng bằng _damage*FPS: 0.5*40=20HP trong 1 giây
		
		this.tha = 0;
		this.R = 15;
		this._update_fc=(timeInSeconds)=>{
			this.update(timeInSeconds);
		 };
		this._game.add_to_update_function_list(this._update_fc);
		
		this.create_thruster(new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0));
		
		
	}
	
	update(){
		
		this.tha += .13;
		
		const _pos=this.Position;
		
		this.emitter1.p.x=_pos.x;
		this.emitter1.p.y=_pos.y;
		this.emitter1.p.z=_pos.z;
		
		this.proton.update();
		
	}
	addProton(position) {
        this.proton = getNewProton();

        this.emitter1 = this.createEmitter(position.x,position.y,position.z, '#4F1500', '#0029FF');
		
		this.emitter1.p.z = this._position.z + this.R * Math.cos(this.tha);
        this.emitter1.p.x = this._position.x +this.R * Math.sin(this.tha);
		this.emitter1.p.y = this._position.y;
       
        this.proton.addEmitter(this.emitter1);
        this.proton.addRender(new Proton.SpriteRender(this._game._graphics.Scene));
		
    }
	
	destroy_thruster() {
		this.proton.emitters.forEach(emitter => {
			emitter.stopEmit();
		});
		
		
		this.proton.emitters.forEach(emitter => {
			emitter.particles.forEach(particle => {
				
				emitter.removeParticle(particle);//sẽ gây lỗi, nhưng nhờ có lỗi mới destroy được,(chưa rõ nguyên nhân vì sao khi destroy mà system vẫn ko bị remove khỏi scene
				
			});
			emitter.removeAllParticles();
		});

		this.proton.removeEmitter(this.emitter1);
		this.proton.destroy();
		
	}	
	createSprite() {
        //var map = new THREE.TextureLoader().load("./resources/particle/noname-3.png");
		var map = new THREE.CanvasTexture(this._game._image_preloader.getImage('particle32'));
        var material = new THREE.SpriteMaterial({
            map: map,
            color: 0xff0000,
            blending: THREE.AdditiveBlending,
            fog: true
        });
        return new THREE.Sprite(material);
    }
	create_thruster(position,direction){
		this._position=position;
		this._direction=direction;
		
		this.addProton(position);
	}
	createEmitter(x, y, z, color1, color2) {
        var emitter = new Proton.Emitter();
        emitter.rate = new Proton.Rate(new Proton.Span(3, 9), new Proton.Span(.01, .02));
        //emitter.addInitialize(new Proton.Mass(1));
        emitter.addInitialize(new Proton.Life(0.5));
        emitter.addInitialize(new Proton.Body(this.createSprite()));
        emitter.addInitialize(new Proton.Radius(18));
        //emitter.addInitialize(new Proton.V(200, new Proton.Vector3D(0, 0, -1), 0));


        //emitter.addBehaviour(new Proton.Alpha(1, 0));
        emitter.addBehaviour(new Proton.Color(color1, color2));
        emitter.addBehaviour(new Proton.Scale(1, 0));
        //emitter.addBehaviour(new Proton.CrossZone(new Proton.ScreenZone(camera, renderer), 'dead'));


        //emitter.addBehaviour(new Proton.Force(0, 0, -20));
       
        emitter.p.x = x;
        emitter.p.y = y;
		emitter.p.z = z;
        
		const emit_time=1.6;
		const emitter_life=1.0;
		emitter.emit(emit_time,emitter_life);
		

        return emitter;
    }
	
	SelfDestroy(){
		super.SelfDestroy();
		this._params.game._entities['_explosionSystem'].Splode(this.Position,"#EF2F0D","#EF2F0D",24,96);
		this._game.add_to_timer(()=>{
			this.destroy_thruster();
		},2);
		this._game.add_to_timer(()=>{//neu stop update qua' som' thi cac particle chua xoa' di het
			this._game.remove_function_from_update_list(this._update_fc);
		},13);
		
	}
	
	CheckTarget(timeInSeconds){
		const _position=this.Position;
		if(!this._unit||this._unit===null||this._unit.Dead)
			return;
		
		//let _targets=this._game._unitMG.get_enemy_combat_unit_in_range(_position,this._radius_effect1);
		let _targets=this._game._unitMG.get_enemy_combat_unit_in_range_3(this,_position,this._radius_effect1);
		
		if(!this._phase)
			this._phase=1;
		
		if(this._phase===1){
			if(!this._performing_phase_1){
				this._performing_phase_1=true;
				
			}
			const _distance=_position.distanceTo(this._origin_position);
			if(_distance<60)
				this.move_forward(this._game._parameters._standard_rocket_speed*0.15);
			else{
				this._model.rotation.y+=Math.PI/2;
				this._phase=2;
			}
			return;
		}
		if(this._phase===2){
			if(!this._performing_phase_2){
				this._performing_phase_2=true;
				this._rotate_axis= new THREE.Vector3(this._origin_above_position.x - this._origin_position.x, 
				this._origin_above_position.y - this._origin_position.y, this._origin_above_position.z - this._origin_position.z);
				this._rotate_axis.normalize();
				this._game.add_to_timer(()=>{
					this._phase=3;
				},5);
			}
			
			this.rotate_about_point(this._unit.Position, this._rotate_axis,timeInSeconds*2.0);
			this._model.rotation.y+=timeInSeconds*2.0;
			
				for(let i=0;i<_targets.length;i++){
					const _target=_targets[i][0];
					const _distance=_targets[i][1];
					let _damage=timeInSeconds*this._damage;
					if(_distance>this._radius_effect1*3/4)_damage=this._damage/3;
					if(_distance>this._radius_effect1*1/2)_damage=this._damage/2;
					//alert(_damage);
					//_target.TakeDamage(_damage);
					_target.Take_Damage(this._unit,this.constructor.name,super.constructor.name,_damage);
				}
			
		}
		if(this._phase===3){
			this.SelfDestroy();
		}
	}
}
//HealingEffect
class GlowingEffect{
	constructor(params) {
	  this._game=params.game;
    const uniforms = {
        diffuseTexture: {
            value: new THREE.CanvasTexture(this._game._image_preloader.getImage(params.particle_id))
        },
        pointMultiplier: {
            value: window.innerHeight / (2.0 * Math.tan(0.5 * 60.0 * Math.PI / 180.0))
        }
    };
	if(params.size)
		this._size=params.size;
	else
		this._size=2;
    this._material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: _VS,
        fragmentShader: _FS,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        transparent: true,
        vertexColors: true
    });

    this._camera = params.camera;
    this._particles = [];

    this._geometry = new THREE.BufferGeometry();
    this._geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
    this._geometry.setAttribute('size', new THREE.Float32BufferAttribute([], 1));
    this._geometry.setAttribute('colour', new THREE.Float32BufferAttribute([], 4));
    
    this._points = new THREE.Points(this._geometry, this._material);

    params.parent.add(this._points);
	this._points.position.copy(params.position);
    this._alphaSpline = new LinearSpline((t, a, b) => {
      return a + t * (b - a);
    });
    this._alphaSpline.AddPoint(0.0, 0.0);
    this._alphaSpline.AddPoint(0.1, 1.0);
    this._alphaSpline.AddPoint(0.6, 1.0);
    this._alphaSpline.AddPoint(1.0, 0.0);

    this._colourSpline = new LinearSpline((t, a, b) => {
      const c = a.clone();
      return c.lerp(b, t);
    });
    this._colourSpline.AddPoint(0.0, new THREE.Color(0xF7EB32));
    this._colourSpline.AddPoint(1.0, new THREE.Color(0xF7EB32));

    this._sizeSpline = new LinearSpline((t, a, b) => {
      return a + t * (b - a);
    });
    this._sizeSpline.AddPoint(0.5, 1.0);
    //document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
  
    this._UpdateGeometry();
  }

  _AddParticles(timeElapsed) {
    if (!this.gdfsghk) {
      this.gdfsghk = 0.0;
    }
   
    for (let i = 0; i < 1; i++) {
      const life =  2.0;
      this._particles.push({
          position: new THREE.Vector3(
              0.0,
              0.0,
             0.0),
          size:  this._size,
          colour: new THREE.Color(),
          alpha: 0.1,
          life: life,
          maxLife: life,
          rotation: Math.PI,
          velocity: new THREE.Vector3(0, 0.0, 0),
      });
    }
  }

  _UpdateGeometry() {
	if(!this._first)this._first=true;
    const positions = [];
    const sizes = [];
    const colours = [];
    const angles = [];
    for (let p of this._particles) {
      positions.push(p.position.x, p.position.y, p.position.z);
      colours.push(p.colour.r, p.colour.g, p.colour.b, p.alpha);
      sizes.push(p.currentSize);
    }
	
    this._geometry.setAttribute(
        'position', new THREE.Float32BufferAttribute(positions, 3));
    
    this._geometry.attributes.position.needsUpdate = true;
	
	
	if(this._first){
		this._geometry.setAttribute(
			'size', new THREE.Float32BufferAttribute(sizes, 1));
		this._geometry.setAttribute(
			'colour', new THREE.Float32BufferAttribute(colours, 4));
		
		this._geometry.attributes.size.needsUpdate = false;
		this._geometry.attributes.colour.needsUpdate = false;
		
	}
	else{
		this._geometry.attributes.size.needsUpdate = false;
		this._geometry.attributes.colour.needsUpdate = false;
		this._geometry.attributes.angle.needsUpdate = false;
	}
	
	
	this._first=false;
  }

  _UpdateParticles(timeElapsed) {
    for (let p of this._particles) {
      p.life -= timeElapsed;
    }

    this._particles = this._particles.filter(p => {
      return p.life > 0.0;
    });
	
	let _counter=0;
    for (let p of this._particles) {
	  
      const t = 1.0 - p.life / p.maxLife;

      //p.rotation += timeElapsed * 0.5;
      p.alpha = 0.1;
	  //p.currentSize = p.size*this._sizeSpline.Get(t);
      p.currentSize = p.size+(_counter*0.03);
      p.colour.copy(this._colourSpline.Get(t));

      p.position.add(p.velocity.clone().multiplyScalar(timeElapsed));
	  
	  _counter++;
    }
	
  }

  Step(timeElapsed) {
    this._AddParticles(timeElapsed);
    this._UpdateParticles(timeElapsed);
    this._UpdateGeometry();
  }
}

export{SpaceShip};

function cleanupProton(proton) {
	if(proton===null)return;
		proton.emitters.forEach(emitter => {
			proton.removeEmitter(emitter);
			emitter.destroy();

			emitter.particles.forEach(particle => {
				if (particle.target && particle.target.parent) {
					particle.target.parent.remove(particle.target);

					if (particle.target.geometry) particle.target.geometry.dispose();
					if (particle.target.material) particle.target.material.dispose();
				}
			});
		});

		proton.destroy();

		// Nếu có renderer
		if (proton.renderer && typeof proton.renderer.destroy === 'function') {
			proton.renderer.destroy();
		}
	}