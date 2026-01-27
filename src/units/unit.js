import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {  CSS2DObject } from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/renderers/CSS2DRenderer.js';

import {Utils} from './utils.js';

import {Explosion1} from '../effects/explosion/explosion-1.js';

class Unit {
  constructor(params) {
    this._model = params.model;
    this._params = params;
    this._game = params.game;
	
	this._is_enemy=null;//true or false
	this._player_id=null;
	if(params.player_id)this._player_id=params.player_id;
	
	this._my_unique_id=this._game.GetUniqueID();
	
	if(this._params.health){
		this._health=this._params.health;
	}
	else{
		this._health=100;
	}
	
	if(this._params.exp_reward){
		this._exp_reward=this._params.exp_reward;//exp player nhan duoc sau khi tieu diet unit nay
	}
	else{
		//this._exp_reward=this._game._parameters._standard_exp_2;
		this._exp_reward=0;//rocket....
	}
	
	if(this._params.money_reward){
		this._money_reward=this._params.money_reward;//$ player nhan duoc sau khi tieu diet unit nay
	}
	else{
		this._money_reward=0;//rocket....
	}
	
	this._max_health=this._health;
	
	this._target_object=params.target_object;
	
    this._visibilityIndex = this._game._visibilityGrid.UpdateItem(
        this._model.uuid, this);
		
	this._function_list_1=new Array();//them vao ham update
	this._function_list_2=new Array();//after dead
	this._function_list_3=new Array();//before dead
	this._utils=new Utils();
	
	this._bellow_point=new THREE.Object3D();//diem phia duoi dung de xac dinh phuong huong
	this._model.add(this._bellow_point);
	this._bellow_point.position.y-=15;//ko nen su dung nhieu, vi chi ap dung khi khong thay doi phuong huong cua model sau khi init
	
	this._above_point=new THREE.Object3D();
	this._model.add(this._above_point);
	this._above_point.position.y+=15;
	
	this._left_point=new THREE.Object3D();
	this._model.add(this._left_point);
	this._left_point.position.x-=15;
	
	this._right_point=new THREE.Object3D();
	this._model.add(this._right_point);
	this._right_point.position.x+=15;
	
	this._left_point2=new THREE.Object3D();
	this._model.add(this._left_point2);
	this._left_point2.position.x-=7;
	this._right_point2=new THREE.Object3D();
	this._model.add(this._right_point2);
	this._right_point2.position.x+=7;
	
	this._left_point3=new THREE.Object3D();
	this._model.add(this._left_point3);
	this._left_point3.position.x-=3;
	this._right_point3=new THREE.Object3D();
	this._model.add(this._right_point3);
	this._right_point3.position.x+=3;
	
	this._front_point=new THREE.Object3D();
	this._model.add(this._front_point);
	this._front_point.position.z-=15;
	
	this._origin_position=this.Position;//vi tri ban dau
	
	this._lock_explosion_1=false;
	
	this._lock_take_damage=false;
	
	this._take_damage_fc=()=>{};
	this._take_damage_callback_list=new Array();
		
	this._group_id=null;
	
	Unit.AfterAppearing(this);
	
	this.enable_average_speed_measurement();
  }
  add_take_damage_callback=(_fc)=>{
	this._take_damage_callback_list.push(_fc);
  };
  set_group_id(_id){
	  this._group_id=_id;
  }
  get_group_id(){
	  return this._group_id;
  }
  set_money_reward(_money){
	  this._money_reward=_money;
  }
  get_money_reward(){
	  return this._money_reward;
  }
  
  average_speed_available(){
	  if(!this._average_speed)
		  return false;
	  
	  return true;
  }
  
  enable_average_speed_measurement(){//turn on chuc nang do van toc (quang duong di duoc trong 1s)
	  //add_to_update_function_list
	  if(!this._last_pos){
		  this._last_pos=this.Position.clone();
		  this._average_speed=0;
	  }
	  else{
		  return;
	  }
	  let _measure_fc=()=>{
		  const _current_pos=this.Position;
		  this._average_speed=_current_pos.distanceTo(this._last_pos);
		  //console.log(this._average_speed);
		  this._last_pos.copy(_current_pos);
		  this._game.add_to_timer(()=>{
			  _measure_fc();
		  },1);
	  };
	  _measure_fc();
  }
  get_average_speed(){
	  if(!this._average_speed)return 0;
	  return this._average_speed;
  }
  
  get_exp_reward(){
	  return this._exp_reward;
  }
  is_injured(){//đang bị thương?
	  if(this._health<this._max_health)
		  return true;
	  return false;
  }
  add_hp(_hp){
	  if(this._health+_hp>this._max_health)
		  this._health=this._max_health;
	  else
		  this._health+=_hp;
  }
  set_init_hp(_hp){
	  this._health=_hp;
	  this._max_health=_hp;
  }
  
  look_at(_pos){
	  this._model.lookAt(this._utils.calculateSymmetricPoint(this.Position,_pos));
  }
  add_to_scene(){
	  this._game._graphics.Scene.add(this._model);
  }
  scale_model(_scale){
	  this._model.scale.multiplyScalar(_scale);
  }
  jumpTo(_pos){
	  this._model.position.copy(_pos);
  }
  getFrontPos(_length){
	  return this.get_back_point(_length);
  }
  getBackPos(_length){
	  return this.get_ahead_point(_length);
  }
  getLeftpos(_length){
	  return this._game._utils.findPointOnLine(this.Position,this.get_left_point(),_length);
  }
  getLeftPos(_length){
	  return this._game._utils.findPointOnLine(this.Position,this.get_left_point(),_length);
  }
  getRightPos(_length){
	  return this._game._utils.findPointOnLine(this.Position,this.get_right_point(),_length);
  }
  getAbovePos(_length){
	  return this._game._utils.findPointOnLine(this.Position,this.get_above_point(),_length);
  }
  getBellowPos(_length){
	  return this._game._utils.findPointOnLine(this.Position,this.get_bellow_point(),_length);
  }
  
  getFrontLeftPos(_length1,_length2){
	  const P1=this.Position;
	  const P2=this.getFrontPos(_length1);
	  const P3=this.getLeftPos(_length2);
	  
	  return this._game._utils.findPointP4(P1,P2,P3);
  }
  getFrontRightPos(_length1,_length2){
	  const P1=this.Position;
	  const P2=this.getFrontPos(_length1);
	  const P3=this.getRightPos(_length2);
	  
	  return this._game._utils.findPointP4(P1,P2,P3);
  }
  getFrontAbovePos(_length1,_length2){
	  const P1=this.Position;
	  const P2=this.getFrontPos(_length1);
	  const P3=this.getAbovePos(_length2);
	  
	  return this._game._utils.findPointP4(P1,P2,P3);
  }
  getFrontBellowPos(_length1,_length2){
	  const P1=this.Position;
	  const P2=this.getFrontPos(_length1);
	  const P3=this.getBellowPos(_length2);
	  
	  return this._game._utils.findPointP4(P1,P2,P3);
  }
  
  getBackLeftPos(_length1,_length2){
	   const P1=this.Position;
	   const P2=this.getBackPos(_length1);
	   const P3=this.getLeftPos(_length2);
	  
	  return this._game._utils.findPointP4(P1,P2,P3);
  }  
  getBackRightPos(_length1,_length2){
	   const P1=this.Position;
	   const P2=this.getBackPos(_length1);
	   const P3=this.getRightPos(_length2);
	  
	  return this._game._utils.findPointP4(P1,P2,P3);
  }  
  getBackAbovePos(_length1,_length2){
	  const P1=this.Position;
	  const P2=this.getBackPos(_length1);
	  const P3=this.getAbovePos(_length2);
	  
	  return this._game._utils.findPointP4(P1,P2,P3);
  }
  getBackBellowPos(_length1,_length2){
	  const P1=this.Position;
	  const P2=this.getBackPos(_length1);
	  const P3=this.getBellowPos(_length2);
	  
	  return this._game._utils.findPointP4(P1,P2,P3);
  }
  
  rotateX(_angle){//chua test
	  this._model.rotation.x+=_angle;
  }
  rotateY(_angle){
	  this._model.rotation.y+=_angle;
  }
  rotateZ(_angle){
	  this._model.rotation.z+=_angle;
  }
  
  turnLeft(_angle,_speed,_finish_fc){//_speed càng nhỏ thì quay càng nhanh (speed tham khảo: 9000)
	  let _degree_counter=0;
	  let _length2=10;
	  let _fc=(t)=>{
		  const _length1=_speed*t;
		  const P1=this.getFrontPos(_length1);
	      const P2=this.getFrontLeftPos(_length1,_length2);;
	      const P3=this.Position;
		  this.look_at(P2);
	  
	      const _degree=this._game._utils.calculateAngle(P3,P1,P2);
		  _degree_counter+=parseFloat(_degree);
		  if(_degree_counter>=_angle){
			  if(_fc!=null)this._game.remove_function_from_update_list(_fc);
			  _fc=null;
			  _finish_fc();
		  }
	  };
	  this.add_to_after_dead_function_list(()=>{
		  if(_fc!=null)this._game.remove_function_from_update_list(_fc);
			  _fc=null;
	  });
	  
	  this._game.add_to_update_function_list(_fc);
  }
  turnRight(_angle,_speed,_finish_fc){//_speed càng nhỏ thì quay càng nhanh (speed tham khảo: 9000)
	  if(this._turning_right)return;
	  this._turning_right=true;
	  
	  let _degree_counter=0;
	  let _length2=10;
	  let _fc=(t)=>{
		  const _length1=_speed*t;
		  const P1=this.getFrontPos(_length1);
	      const P2=this.getFrontRightPos(_length1,_length2);;
	      const P3=this.Position;
		  this.look_at(P2);
	  
	      const _degree=this._game._utils.calculateAngle(P3,P1,P2);
		  _degree_counter+=parseFloat(_degree);
		  if(_degree_counter>=_angle){
			  if(_fc!=null)this._game.remove_function_from_update_list(_fc);
			  _fc=null;
			  this._turning_right=false;
			  _finish_fc();
		  }
	  };
	  this.add_to_after_dead_function_list(()=>{
		  if(_fc!=null)this._game.remove_function_from_update_list(_fc);
			  _fc=null;
	  });
	  
	  this._game.add_to_update_function_list(_fc);
  }
  turnUp(_angle,_speed,_finish_fc){
	  let _degree_counter=0;
	  let _length2=10;
	  let _fc=(t)=>{
		  const _length1=_speed*t;
		  const P1=this.getFrontPos(_length1);
	      const P2=this.getFrontAbovePos(_length1,_length2);;
	      const P3=this.Position;
		  this.look_at(P2);
	  
	      const _degree=this._game._utils.calculateAngle(P3,P1,P2);
		  _degree_counter+=parseFloat(_degree);
		  if(_degree_counter>=_angle){
			  if(_fc!=null)this._game.remove_function_from_update_list(_fc);
			  _fc=null;
			  _finish_fc();
		  }
	  };
	  this.add_to_after_dead_function_list(()=>{
		  if(_fc!=null)this._game.remove_function_from_update_list(_fc);
			  _fc=null;
	  });
	  
	  this._game.add_to_update_function_list(_fc);
  }
  turnDown(_angle,_speed,_finish_fc){
	  let _degree_counter=0;
	  let _length2=10;
	  let _fc=(t)=>{
		  const _length1=_speed*t;
		  const P1=this.getFrontPos(_length1);
	      const P2=this.getFrontBellowPos(_length1,_length2);;
	      const P3=this.Position;
		  this.look_at(P2);
	  
	      const _degree=this._game._utils.calculateAngle(P3,P1,P2);
		  _degree_counter+=parseFloat(_degree);
		  if(_degree_counter>=_angle){
			  if(_fc!=null)this._game.remove_function_from_update_list(_fc);
			  _fc=null;
			  _finish_fc();
		  }
	  };
	  this.add_to_after_dead_function_list(()=>{
		  if(_fc!=null)this._game.remove_function_from_update_list(_fc);
			  _fc=null;
	  });
	  
	  this._game.add_to_update_function_list(_fc);
  }
  
  get_left_point(){
	  const _rs=new THREE.Vector3();
	  this._left_point.getWorldPosition(_rs);
	  return _rs;
  }
  get_right_point(){
	  const _rs=new THREE.Vector3();
	  this._right_point.getWorldPosition(_rs);
	  return _rs;
  }
  get_left_point2(){
	  const _rs=new THREE.Vector3();
	  this._left_point2.getWorldPosition(_rs);
	  return _rs;
  }
  get_right_point2(){
	  const _rs=new THREE.Vector3();
	  this._right_point2.getWorldPosition(_rs);
	  return _rs;
  }
  get_left_point3(){
	  const _rs=new THREE.Vector3();
	  this._left_point3.getWorldPosition(_rs);
	  return _rs;
  }
  get_right_point3(){
	  const _rs=new THREE.Vector3();
	  this._right_point3.getWorldPosition(_rs);
	  return _rs;
  }
  get_bellow_point(){
	  const _rs=new THREE.Vector3();
	  this._bellow_point.getWorldPosition(_rs);
	  return _rs;
  }
  get_above_point(){
	  const _rs=new THREE.Vector3();
	  this._above_point.getWorldPosition(_rs);
	  return _rs;
  }
  
  static _lock_be_damage=false;//su dung trong che do multi-player(unit se ko mat' HP khi bi enemy tan' cong)
  
	  add_to_update_function_list(_fc){
		  this._function_list_1.push(_fc);
	  }
	  remove_from_update_function_list(_fc){
		for(let i=this._function_list_1.length-1;i>=0;i--){
			if(this._function_list_1[i]===_fc){
				this._function_list_1.splice(i,1);
				
			}
		}
	  }
	  clear_update_function_list(){
		  this._function_list_1=new Array();
	  }
	  
	  
	  add_to_after_dead_function_list(_fc){
		  this._function_list_2.push(_fc);
	  }
	  remove_from_after_dead_function_list(_fc){
		for(let i=this._function_list_2.length-1;i>=0;i--){
			if(this._function_list_2[i]===_fc){
				this._function_list_2.splice(i,1);
				
			}
		}
	  }
	  clear_after_dead_function_list(){
		  this._function_list_2=new Array();
	  }

	add_to_before_dead_function_list(_fc){
		this._function_list_3.push(_fc);
	}
	remove_from_before_dead_function_list(_fc){
	  for(let i=this._function_list_3.length-1;i>=0;i--){
		  if(this._function_list_3[i]===_fc){
			  this._function_list_3.splice(i,1);
			  
		  }
	  }
	}
	clear_before_dead_function_list(){
		this._function_list_3=new Array();
	}
	  
	  
	turn_backward(){//quay dau ve phia sau
		this._model.lookAt(this.get_back_point(100));
	}
	 
	  set_target_object(target){
		  this._target_object=target;
	  }
  
  get_world_position(){
	  const _rs=new THREE.Vector3();
	  this._model.getWorldPosition(_rs);
	  return _rs;
  }
  get_world_direction(){
	  const _rs=new THREE.Vector3();
	  this._model.getWorldDirection(_rs);
	  return _rs;
  }
  get_world_opposite_direction(){//lay' huong' nguoc lai
	  const _world_dir=this.get_world_direction();
	  return _world_dir.negate();
  }
  
  show_2D_position_on_screen(){
	  this._2D_screen_icon_1=document.createElement("img");
	  this._2D_screen_icon_1.style.position="absolute";
	  this._2D_screen_icon_1.style.width="70px";
	  this._2D_screen_icon_1.style.height="35px";
	  
	  this._2D_screen_icon_1.style.visibility="hidden";
	  
	  this._2D_screen_icon_1.src="./resources/icons/arrow-1.png";
	  
	  document.body.appendChild(this._2D_screen_icon_1);
	  
	  let vector = new THREE.Vector3();
	  let x,y;
	  let screen_w=window.innerWidth,
		  screen_h=window.innerHeight;
	  
	  this._2D_screen_fc_1=()=>{
		vector.setFromMatrixPosition(this._model.matrixWorld);
		vector.project(this._game._graphics.Camera);
		 x = (vector.x + 1) / 2 * window.innerWidth;
		 y = (-vector.y + 1) / 2 * window.innerHeight;
		 
		 if(vector.z<0)//nam phia sau camera
		 {
			 this._2D_screen_icon_1.style.visibility="hidden";
			 return;
		 }
		 
		 if(this.Position.distanceTo(this._game._graphics.Camera)>2000)
			 return;
			 //vector.x>1=>nam ben phai Camera
			 //vector.x<-1=>nam ben trai camera
		 
		 if(x<0){
			 this._2D_screen_icon_1.style.left="10px";
			 this._2D_screen_icon_1.style.top=y+"px";
			 this._2D_screen_icon_1.style.transform = 'rotate(180deg)';
			 this._2D_screen_icon_1.style.visibility="visible";
			 return;
		 }
		 if(x>screen_w){
			 this._2D_screen_icon_1.style.left=(screen_w-100)+"px";
			 this._2D_screen_icon_1.style.top=y+"px";
			 this._2D_screen_icon_1.style.transform = 'rotate(0deg)';
			 this._2D_screen_icon_1.style.visibility="visible";
			 return;
		 }
		 this._2D_screen_icon_1.style.left="-100px";
		 this._2D_screen_icon_1.style.top="-100px";
		 this._2D_screen_icon_1.style.visibility="hidden";
	  };
	  this._game.add_to_update_function_list(this._2D_screen_fc_1);
	  this.add_to_after_dead_function_list(()=>{
		  this.remove_2D_position_on_screen();
	  });
	  this.add_to_after_dead_function_list(()=>{
		  this.remove_2D_position_on_screen();
	  });
  }
  remove_2D_position_on_screen(){
	  if(this._2D_screen_icon_1===null)return;
	  this._game.remove_function_from_update_list(this._2D_screen_fc_1);
	  this._2D_screen_icon_1.remove();
	  this._2D_screen_icon_1=null;
  }
	
  create_label_1(_html){
	let div = document.createElement( 'div' );
	div.innerHTML=_html;
	div.style.fontSize="20px";
	div.style.color="red";
	this.label1 = new CSS2DObject( div );
	this._game._graphics.Scene.add(this.label1);
	let _fc=()=>{
		if(this.label1!=null){
			this.label1.position.copy(this.Position);
		}
	};
	this._game.add_to_update_function_list(_fc);
	this.add_to_after_dead_function_list(()=>{
		this._game._graphics.Scene.remove(this.label1);
		this.label1.remove();
		this.label1=null;
		div.remove();
		div=null;
		this._game.remove_function_from_update_list(_fc);
	});
  }
 
  get Model(){
	  return this._model;
  }
  
  get Position() {
    return this._model.position;
  }

  get Radius() {
    return 1.0;
  }

  get Health() {
    return this._health;
  }

  get Dead() {
    return (this._health <= 0.0);
  }
  
  static AfterAppearing(_unit){//(sau khi sinh ra), goi tu ben ngoai
	  
  }  
  static AfterDead(_unit){//goi tu ben ngoai
	  
  }
  static AfterTakeDamage(_unit){
	  
  }
  static Take_Damage_Callback(_unit1,_unit2,_dmg){
	 
  }
  SelfDestroy(){//xoa bo, trong truong hop VD nhu khi player click di den starsystem khac
	 this.CheckTarget=()=>{};
	 this._be_killed=false;//su dung de phan biet truong hop bi tieu diet hay tu huy?
	
	 if(this._function_list_2!=null)
	  for(let i=0;i<this._function_list_2.length;i++){
			this._function_list_2[i]();
		}
		this._function_list_2=null;
	  this._health=0;
	  this._game._RemoveEntity_ByValue(this);
	  delete this;
	  
  }
  EquipArmour(_id,_level){
	  if(!this._armours){
		  this._armours=new Array();
	  }
	  this._armours.push({
		  id:_id,
		  level:_level
	  });
  }
  GetArmourLevel(_id){
	  if(!this._armours){
		  this._armours=new Array();
	  }
	  for(let i=0;i<this._armours.length;i++){
		  let _infor=this._armours[i];
		  if(_infor.id===_id)
			  return _infor.level;
	  }  
	  return null;
  }
  Take_Damage(_unit,_class_name,_parent_class_name,_dmg){//_type:laser,rocket,skill...  class_name:blaster_system,Missile1.....
	  let dmg=_dmg;
	  //console.log("name="+_class_name);
	  //console.log("parent-name="+_parent_class_name);
	  //console.log("Dmg1="+dmg);
	  if(_class_name==="blaster"){
		  let _blasterArmourID=1;
		  let _level=this.GetArmourLevel(_blasterArmourID);
		  if(_level!=null){
			  //console.log("Found Armour");
			  let _armourPower=this._game._parameters.getArmourPower(_blasterArmourID,_level);
			  //dmg=dmg-parseInt(_armourPower*dmg);
			  dmg=dmg-parseInt(_armourPower*dmg);
		  }
	  }
	  if(_class_name==="Photon"){//alert(777);
		  let _blasterArmourID=2;
		  let _level=this.GetArmourLevel(_blasterArmourID);
		  if(_level!=null){
			  //console.log("dam1="+dmg);
			  //console.log("level="+_level);
			  let _armourPower=this._game._parameters.getArmourPower(_blasterArmourID,_level);
			  //console.log("power="+_armourPower);
			  dmg=dmg-parseInt(_armourPower*dmg);
			  //console.log("dam2="+dmg);
		  }
	  }
	  if(_parent_class_name==="Rocket"){
		  let _blasterArmourID=3;
		  let _level=this.GetArmourLevel(_blasterArmourID);
		  if(_level!=null){
			  //console.log("Found Anti Rocket Armour");
			  let _armourPower=this._game._parameters.getArmourPower(_blasterArmourID,_level);
			  //dmg=dmg-parseInt(_armourPower*dmg);
			  dmg=dmg-parseInt(_armourPower*dmg);
		  }
	  }
	  
	  if(this._group_id!=null){//phai set group_id cho cac unit can thiet
		  if(_class_name==="main-skill"){
			 
				let _enemy_group_id=_unit.get_group_id();
				//console.log("GroupID="+this._group_id);
				//console.log("PlayerGroupID="+_enemy_group_id);
				//console.log(this._game._unitMG._Inhibit(_enemy_group_id,this._group_id));
				if(_enemy_group_id!=null){
					let _blasterArmourID=this._game._parameters.getArmourIDThatDefend(_enemy_group_id);//lay' id cua armour defend dc skill cua enemy
					let _level=this.GetArmourLevel(_blasterArmourID);
					if(_level!=null){//co' armour nay`
						//console.log("Found Anti Main-Skill Armour");
						let _armourPower=this._game._parameters.getArmourPower(_blasterArmourID,_level);
						dmg=dmg-parseInt(_armourPower*dmg);
					}
				}
				
		  }
	  }
	  
	  //console.log("Dmg2="+dmg);
	  //console.log("hp1="+this._health);
	  if(dmg<0)dmg=0;
	  this.TakeDamage(dmg);
	  //console.log("hp2="+this._health);
	  Unit.Take_Damage_Callback(this,_unit,dmg);
  }
 
  
  TakeDamage(dmg) {
	if(this._lock_take_damage)return false;  
	  
	if(this.Dead) return false;
	
	if(!this._params.is_me){
	
	}
	
	this._take_damage_fc();
	for(let i=0;i<this._take_damage_callback_list.length;i++){
		this._take_damage_callback_list[i]();
	}
	
		if(this._health-dmg>=0){
			this._health -= dmg;
		}		
		else 
			this._health=0;
	
	Unit.AfterTakeDamage(this);
	
    if (this._health <= 0.0) {
		
			if(!Unit._lock_be_damage){
				for(let i=0;i<this._function_list_3.length;i++){
					this._function_list_3[i]();
				}
				this.BeDestroy();
			}
				
		
    }    
	
	return true;
  }
  
  BeDestroy(){//bi tieu diet
	if(this._destroyed)return;
	  //this._params.game._entities['_explosionSystem'].Splode(this.Position);
	  let _explode=new Explode({position:this.Position,game:this._game});
	  
	 this.CheckTarget=()=>{};
	this._be_killed=true;
	  
	  if(this._function_list_2!=null)
		for(let i=0;i<this._function_list_2.length;i++){
			this._function_list_2[i]();
		}
		this._function_list_2=null;
		this._game._RemoveEntity_ByValue(this);
		
		Unit.AfterDead(this);
		
		this._destroyed=true;
  }
 
  Update(timeInSeconds) {
    if (this.Dead) {
      return;
    }

    for(let i=0;i<this._function_list_1.length;i++)
				this._function_list_1[i](timeInSeconds);
	
	this.Update_0(timeInSeconds);
	
	this.Update_1();
	this.Update_2();
	this.Update_3();
  }
  
  Update_0(timeInSeconds){};
  
  Update_1(){};
  Update_2(){};
  Update_3(){};
  
  CheckTarget(timeInSeconds){
	  
  }
 
  get_back_point(_length){//lay toa do diem phia sau
	  const _pos=this.get_world_position();
	  const _dir=this.get_world_direction();
	  const _dir2=new THREE.Vector3(-_dir.x,-_dir.y,-_dir.z);//vector có hướng ngược lại
	  const _target=this._utils.findPointB(_pos.x,_pos.y,_pos.z,
											_dir2.x,_dir2.y,_dir2.z,
											_length);
	  return _target;
  }
  get_ahead_point(_length){//lấy tọa độ điểm phía trước mặt
	  const _pos=this.get_world_position();
	  const _dir=this.get_world_direction();
	  const _target=this._utils.findPointB(_pos.x,_pos.y,_pos.z,
											_dir.x,_dir.y,_dir.z,
											_length);
	  return _target;
  }
  
  move_in_range(position,speed,object,range){//di chuyen theo huong toi 1 vi tri nhung ko dc di qua xa object
	  this._model.lookAt(position);
	  
	  if(this._move_fc)this._game.remove_function_from_update_list(this._move_fc);
	  
	  this._move_fc=(timeInSeconds)=>{
		  this._utils.translateObject(this._model,position,timeInSeconds*speed);
		  const _distance1=this.Position.distanceTo(position);
		  if(_distance1<5){
			  this._game.remove_function_from_update_list(this._move_fc);
			  return;
		  }
		  const _distance2=this.Position.distanceTo(object.Position);
		  if(_distance2>range){
			  this._game.remove_function_from_update_list(this._move_fc);
			  return;
		  }
	  };
	  this._game.add_to_update_function_list(this._move_fc);
  }
  
 
  //goi lien tuc tu update function cua 1 class nao do
  move_and_approach_object(object,distance1,speed1,timeInSeconds,fc){//di chuyen tiep can va duy tri khoang cach voi 1 doi tuong
	  const _obj_pos=object.Position;
	  //const _pos=this._utils.calculateSymmetricPoint(this.Position,object.Position);
	  //this._model.lookAt(_pos);
	  this._model.lookAt(this._utils.calculateSymmetricPoint(this.Position,object.Position));
	  
	  if(this._move_fc)this._game.remove_function_from_update_list(this._move_fc);
	  
	  const distance2=this.Position.distanceTo(_obj_pos);
	  if(distance2>distance1){
		let speed2=speed1;
		if(distance2-distance1<speed1){
			speed2=distance2-distance1;
		}
		this._utils.translateObject(this._model,_obj_pos,timeInSeconds*speed2);
		if(distance2<=2){//ket thuc
			fc();
		}
	  }
	  return distance2;
  }
  
  //Ap dung khi di chuyen tren be mat khoi cau
  //khi con cach diem muc tieu 1 khoang=space thi unit se dung lai
  //neu muon unit di chuyen toi chinh xac vi tri muc tieu thi cho space=0
  move_and_approach_object_2(object,center_pos, radius, point2,space,fc1){//di chuyen tiep can va duy tri khoang cach voi 1 doi tuong
	  if(this._move_fc)this._game.remove_function_from_update_list(this._move_fc);
	  
	  let point1=this.Position;
	  
	  const numberOfSegments = 100;
		const points = [];
		for (let i = 0; i <= numberOfSegments; i++) {
			const alpha = i / numberOfSegments;
			const point = new THREE.Vector3().lerpVectors(point1, point2, alpha);
			
			const tpoint=this._utils.findPointOnLine(center_pos, point, radius);
			points.push(tpoint);
		}
		// Tạo geometry và material cho đoạn thẳng
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

      // Tạo đoạn thẳng từ geometry và material
      const line = new THREE.Line(geometry, material);
	  if(this.current_route)this._game._graphics.Scene.remove(this.current_route);
	  this.current_route=line;
	  
	  this._game._graphics.Scene.add(line);	
	
	  let _counter=0;
	  let _speed=60;
	  let _fc2=()=>{
		if(this.Position.distanceTo(point2)<=space)return;
		if(_counter<points.length)
			this.move_to_position(points[_counter],_speed,_fc2);
		_counter+=2;
	  };
	  this.move_to_position(points[_counter],_speed,_fc2);
  }
  
  
  //khi con cach diem muc tieu 1 khoang=space thi unit se dung lai
  //neu muon unit di chuyen toi chinh xac vi tri muc tieu thi cho space=0
  move_along_route_on_sphere_surface(center_pos, radius, point1, point2,space,_speed){//di chuyen theo 1 tuyen duong xac dinh bang 1 mang chua' cac point
	  if(this._move_fc)this._game.remove_function_from_update_list(this._move_fc);
	  //this._model.lookAt(center_pos);return;
	  
	  //this.balance_on_sphere(center_pos,radius);
	  
	  const _distance=point1.distanceTo(point2);
	  let numberOfSegments=100;
	  if(_distance<radius/4)numberOfSegments=50;
	  if(_distance<radius/5)numberOfSegments=40;
	  if(_distance<radius/7)numberOfSegments=25;
	  if(_distance<radius/10)numberOfSegments=5;
	  
		const points = [];
		for (let i = 0; i <= numberOfSegments; i++) {
			const alpha = i / numberOfSegments;
			const point = new THREE.Vector3().lerpVectors(point1, point2, alpha);
			
			const tpoint=this._utils.findPointOnLine(center_pos, point, radius);
			points.push(tpoint);
		}
		// Tạo geometry và material cho đoạn thẳng
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

      // Tạo đoạn thẳng từ geometry và material
      const line = new THREE.Line(geometry, material);
	  if(this.current_route)this._game._graphics.Scene.remove(this.current_route);
	  this.current_route=line;
	  
	  this._game._graphics.Scene.add(line);	
	
	  let _counter=0;
	  //let _speed=120;
	  let _fc=()=>{
		if(this.Position.distanceTo(point2)<=space)return;
		if(_counter<points.length)
			this.move_to_position(points[_counter],_speed,_fc);
		_counter+=2;
	  };
	  this.move_to_position(points[_counter],_speed,_fc);
  }
  move_to_position(position,speed,fc){//di chuyen toi 1 vi tri
	  
	  this._model.lookAt(position);
	  
	  if(this._move_fc)this._game.remove_function_from_update_list(this._move_fc);
	  let _finish=false;
	  this._move_fc=(timeInSeconds)=>{
		  this._utils.translateObject(this._model,position,timeInSeconds*speed);
		  const _distance=this.Position.distanceTo(position);
		  if(!this._last_distance)this._last_distance=_distance;
		  else{
			  if(_distance<this._last_distance)//da vuot qua
				  _finish=true;
		  }
		  if(_distance<3){
			  _finish=true;
		  }
		  if(_finish){
			  this._game.remove_function_from_update_list(this._move_fc);
			  fc();
		  }
			
	  };
	  this._game.add_to_update_function_list(this._move_fc);
  }
  move_to(position,speed){//di chuyen toi 1 vi tri
	  
	  this._model.lookAt(this._utils.calculateSymmetricPoint(this.Position,position));
	  
	  if(this._move_fc)this._game.remove_function_from_update_list(this._move_fc);
	  
	  this._move_fc=(timeInSeconds)=>{
		  this._utils.translateObject(this._model,position,timeInSeconds*speed);
		  const _distance=this.Position.distanceTo(position);
		  if(_distance<5)
			this._game.remove_function_from_update_list(this._move_fc);
	  };
	  this._game.add_to_update_function_list(this._move_fc);
  }
  move_forward(_length){//tien len phia truoc
	  //const _pos=this.get_world_position();
	  //const _target=this.get_ahead_point(_length*10000);
	  //this._model.lookAt(_target);
	  this._model.position.copy(this._utils.translatePoint(this.Position,this.get_ahead_point(_length*10000),-_length));	
	  //console.log(_target.x+" and "+_target.y+" and "+_target.z);
	  //console.log(_pos.x+" and "+_pos.y+" and "+_pos.z);
  }
  move_backward(_length){
	  const _pos=this.get_world_position();
	  const _target=this.get_back_point(_length*10000);
	  //this._model.lookAt(_target);
	  this._model.position.copy(this._utils.translatePoint(_pos,_target,-_length));	
	  //console.log(_target.x+" and "+_target.y+" and "+_target.z);
	  //console.log(_pos.x+" and "+_pos.y+" and "+_pos.z);
  }
  rotate_about_point(point, axis, theta){
		//pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

		//if(pointIsWorld){
			//this._model.parent.localToWorld(this._model.position); // compensate for world coordinate
		//}

		this._model.position.sub(point); // remove the offset
		this._model.position.applyAxisAngle(axis, theta); // rotate the POSITION
		this._model.position.add(point); // re-add the offset

		//if(pointIsWorld){
			//this._model.parent.worldToLocal(this._model.position); // undo world coordinates compensation
		//}
	}
	
	add_laser_gun_1(_pos,_level){
		let _lasergun=this._game._unitMG.create_lasergun_1(this.get_world_position(),_level);
		//this._game._graphics.Scene.add(this._lasergun._model);
		this._model.add(_lasergun._model);
		_lasergun._model.position.copy(_pos);
	}
	/*
	remove_laser_gun_1(){
		if(this._lasergun)
			this._game._RemoveEntity_ByValue(this._lasergun);
	}
	*/
	add_laser_gun_2(_pos,_level){
		let _lasergun=this._game._unitMG.create_lasergun_2(this.get_world_position(),_level);
		//this._game._graphics.Scene.add(this._lasergun._model);
		this._model.add(_lasergun._model);
		_lasergun._model.position.copy(_pos);
	}
	/*
	remove_laser_gun_2(){
		if(this._lasergun)
			this._game._RemoveEntity_ByValue(this._lasergun);
	}
	*/
	add_laser_gun_3(_pos,_level){
		let _lasergun=this._game._unitMG.create_lasergun_3(this.get_world_position(),_level);
		//this._game._graphics.Scene.add(this._lasergun._model);
		this._model.add(_lasergun._model);
		_lasergun._model.position.copy(_pos);
	}
	add_plasma_gun_1(_pos,_level){
		let _plasmagun=this._game._unitMG.create_plasmagun_1(this.get_world_position(),_level);
		//this._game._graphics.Scene.add(this._plasmagun._model);
		this._model.add(_plasmagun._model);
		_plasmagun._model.position.copy(_pos);
	}
	add_plasma_gun_2(_pos,_level){
		let _plasmagun=this._game._unitMG.create_plasmagun_2(this.get_world_position(),_level);
		//this._game._graphics.Scene.add(this._plasmagun._model);
		this._model.add(_plasmagun._model);
		_plasmagun._model.position.copy(_pos);
	}
	/*
	remove_plasma_gun(){
		if(this._plasmagun)
			this._game._RemoveEntity_ByValue(this._plasmagun);
	}
	*/
	
	add_rocket_gun_1(_pos,_level){
		let _plasmagun=this._game._unitMG.create_rocket_gun_1(this.get_world_position(),_level);
		//this._game._graphics.Scene.add(this._plasmagun._model);
		this._model.add(_plasmagun._model);
		_plasmagun._model.position.copy(_pos);
	}
	add_rocket_gun_2(_pos,_level){
		let _plasmagun=this._game._unitMG.create_rocket_gun_2(this.get_world_position(),_level);
		//this._game._graphics.Scene.add(this._plasmagun._model);
		this._model.add(_plasmagun._model);
		_plasmagun._model.position.copy(_pos);
	}
	
	add_freeze_gun(_pos,_level){
		let _freezegun=this._game._unitMG.create_freezegun_1(this.get_world_position(),_level);
		this._game._graphics.Scene.add(_freezegun._model);
		_freezegun._model.position.copy(_pos);
	}
	/*
	remove_freeze_gun(){
		if(this._freezegun)
			this._game._RemoveEntity_ByValue(this._freezegun);
	}
	*/
	
}

export{Unit};


class Explode{
	constructor(params){
		
		this.Position=params.position;
		this._game=params.game;
		
		this.tha = 0;
		this.R = 15;
		this._update_fc=(timeInSeconds)=>{
			this.update(timeInSeconds);
		 };
		this._game.add_to_update_function_list(this._update_fc);
		
		this.create_thruster(new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0));
		
		this._game.add_to_timer(()=>{
			this.SelfDestroy();
		},2);
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
				
				//emitter.removeParticle(particle);//sẽ gây lỗi, nhưng nhờ có lỗi mới destroy được,(chưa rõ nguyên nhân vì sao khi destroy mà system vẫn ko bị remove khỏi scene
				
			});
			emitter.removeAllParticles();
		});
		this.emitter1.destroy();
		this.proton.removeEmitter(this.emitter1);
		this.proton.destroy();
		
	}	
	createSprite() {
        var map = new THREE.TextureLoader().load("./resources/particle/noname-42.png");
		//var map = new THREE.CanvasTexture(this._game._image_preloader.getImage('particle14'));
        var material = new THREE.SpriteMaterial({
            map: map,
            //color: 0xff0000,
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
		
        emitter.rate = new Proton.Rate(new Proton.Span(3, 9), new Proton.Span(.001, .002));
       
        emitter.addInitialize(new Proton.Life(0.3));
        emitter.addInitialize(new Proton.Body(this.createSprite()));
        //emitter.addInitialize(new Proton.Position(new Proton.SphereZone(1)));
        emitter.addBehaviour(new Proton.Scale(new Proton.Span(2, 3.5), 0.3));
		//emitter.addBehaviour(new Proton.RandomDrift(35, 35, 35));
		emitter.addBehaviour(new Proton.Color('#f2f51f', ['#000000', '#000000'], Infinity, Proton.easeOutSine));
		//emitter.addBehaviour(new Proton.Rotate(Proton.ROTATION_DIR_RANDOM, new Proton.Span(0, 360), true)); 
		//emitter.addBehaviour(new Proton.Rotate(new Proton.Span(0, 360), new Proton.Span(90, 180), 'add'));
		/*
	    emitter.rate = new Proton.Rate(new Proton.Span(10, 15), new Proton.Span(.05, .1));
        emitter.addInitialize(new Proton.Body(this.createSprite()));
        emitter.addInitialize(new Proton.Mass(1));
        //emitter.addInitialize(new Proton.Life(1, 3));
        emitter.addInitialize(new Proton.Position(new Proton.SphereZone(20)));
        emitter.addInitialize(new Proton.V(new Proton.Span(500, 800), new Proton.Vector3D(0, 1, 0), 30));
        emitter.addBehaviour(new Proton.RandomDrift(10, 10, 10, .05));
        //emitter.addBehaviour(new Proton.Alpha(1, 0.1));
        emitter.addBehaviour(new Proton.Scale(new Proton.Span(2, 3.5), 0));
        emitter.addBehaviour(new Proton.G(6));
        //emitter.addBehaviour(new Proton.Color('#FF0026', ['#ffff00', '#ffff11'], Infinity, Proton.easeOutSine));
		*/	
	   
        emitter.p.x = x;
        emitter.p.y = y;
		emitter.p.z = z;
        
		const emit_time=0.1;
		const emitter_life=0.6;
		emitter.emit(emit_time,emitter_life);
		

        return emitter;
    }
	
	SelfDestroy(){
		this.destroy_thruster();
		this._game.remove_function_from_update_list(this._update_fc);
		
	}
	
}