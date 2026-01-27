import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/loaders/GLTFLoader.js';

import {SpaceShip} from './units/space-ship.js';
import {blaster} from './units/blaster.js';

import {inventory} from './inventory.js';

import {GearBox} from './gear-box.js';

import {ShipPackage} from './ship-package.js';

//import {RocketPackage} from './rocket-package.js';

import {ParticleSystem} from './particle-system.js';

let _has_additional_skill_1=null;
let _skill_id_1=null;

let _has_passive_skill_1=null;
let _passive_skill_id_1=null;

let _lock_all_main_skill=false;
let _lock_all_sub_skill=false;


class PlayerEntity extends SpaceShip {//co the la player(me), hoac friend player hoac enemy player
	constructor(params){
		
		super(params);
		
		this._player_id=this._game._playerID;
		
		this._ship_id=params.ship_id;
		this._speed_list=params.speed_list;
		if(typeof this._speed_list==='undefined'||this._speed_list===null){
			this._speed_list=[1000,1500];
		}
	
		this._connecting_base=null;//base duoc ket noi de trao doi items
		
		this._focus_target=null;
		this.first_init=true;
		let x = 0;
		let y = 0;
		let z = 0;
		this._engine_offsets = [//vị trí của engine
			new THREE.Vector3(x,y,z)
		];
		
		try{//khi trong che do shop se ko bao' loi
		
		this._hpBar = new HealthBar(
			document.querySelector('.barInner'), 100,
			document.querySelector('.value')
		);
		this.hide_hp_bar=()=>{
			document.getElementById("hpBarWrapper").style.visibility="hidden";
			
		};
		this.hide_mana_bar=()=>{
			document.getElementById("mana-bar").style.visibility="hidden";
		};
		
		this._sub_skill_ready_callbacks=new Array();
		this._main_skill_ready_callbacks=new Array();
		/*
		const bg = document.createElement("div");
bg.style.position = "absolute";
bg.style.top = "-15%";
bg.style.left = "-15%";
bg.style.width = "130%";
bg.style.height = "130%";
bg.style.background = `url("./resources/icons/rect-1.png") center/cover no-repeat`;
bg.style.zIndex = "-1";
document.getElementById("hpBarWrapper").appendChild(bg);
document.getElementById("hpBarWrapper").style.overflow="visible";
		*/
		}catch(e){}
		
		let _uniqueID=this._game.GetUniqueID();
		this._game._entities['player-inventory-'+_uniqueID]=new inventory.Inventory({game:this._game,target:this,
		ship_id:this._ship_id});
		this._inventory=this._game._entities['player-inventory-'+_uniqueID];
		
		this._game._gear_box=new GearBox({game:this._game,speed_list:this._speed_list});
		this._game._gear_box.init();
		
		//if(this._game.System.isMobileDevice()){
			if(this._game.create_mobile_control_icon){
				this._game.create_mobile_control_icon();
				this._game._navigator_bar_1.clear();
			}
				
		//}
		
		if(!this._game.System.isMobileDevice()){
			if(this._game.create_mobile_control_icon){
				this._game._navigator_bar_1.clear();
				this._game._navigator_bar_2.clear();
			}
		}
		
		this._main_skills=[
			{id:1,name:"lighting",upgradable:true,icon_fc:this.create_lighting_icon,perform_fc:this.apply_flash_skill,
			description:"Emits destructive energy that damages nearby enemies."},
			{id:2,name:"continuous rockets",upgradable:true,icon_fc:this.create_continuous_rocket_icon,perform_fc:this.apply_continuous_rocket_skill,
			description:"Launch ballistic missiles forward"},
			{id:3,name:"light ball",upgradable:true,icon_fc:this.create_light_ball_icon,perform_fc:this.apply_light_ball_skill,
			description:"Launch forward a high intensity destructive light ball"},
			{id:4,name:"fire breathing",upgradable:true,icon_fc:this.create_fire_breathing_icon,perform_fc:this.apply_fire_breathing_skill,
			description:"Launch of heat-seeking missiles"},
			{id:5,name:"rain of bullets",upgradable:true,icon_fc:this.create_rain_of_bullets_icon,perform_fc:this.apply_rain_of_bullets_skill,
			description:"Fires a rain of hundreds of armor-piercing bullets forward"},
			
			{id:1001,name:"light shield",upgradable:false,icon_fc:this.create_light_shield_icon,perform_fc:this.require_light_shield_skill,
			description:"Create a magnetic armor to protect the ship"},
			{id:1002,name:"speed up",upgradable:false,icon_fc:this.create_speed_up_icon,perform_fc:this.require_speedup_skill,
			description:"Accelerate the ship to near the speed of light"},
		];
		
		this._main_skill_ids=new Array();
		this._skill_list=new Array();
		this._current_skill_id=-1;
		
		//this._enable_passive_skill=true;
		this._skill_icon_width="50px";
	}
	add_sub_skill_ready_calback(_fc){
		this._sub_skill_ready_callbacks.push(_fc);
	}
	add_main_skill_ready_callback(_fc){
		this._main_skill_ready_callbacks.push(_fc);
	}
	lock_all_main_skill(){
		_lock_all_main_skill=true;
	}
	unlock_all_main_skill(){
		_lock_all_main_skill=false;
	}
	lock_all_sub_skill(){
		_lock_all_sub_skill=true;
	}
	unlock_all_sub_skill(){
		_lock_all_sub_skill=false;
	}
	
	get_main_skill_ids_and_names(){
		const _rs=new Array();
		for(let i=0;i<this._main_skill_ids.length;i++){
			const _id=this._main_skill_ids[i];
			const _name=this.get_main_skill_name(_id);
			_rs.push({id:_id,name:_name});
		}
		return _rs;
	}
	
	get_main_skill_infor(_id){
		for(let i=0;i<this._main_skills.length;i++){
			if(this._main_skills[i].id===_id)
				return this._main_skills[i];
		}
		return null;
	}
	get_main_skill_name(_id){
		const _infor=this.get_main_skill_infor(_id);
		return _infor.name;
	}
	get_main_skill_description(_id){
		const _infor=this.get_main_skill_infor(_id);
		return _infor.description;
	}
	get_main_skill_icon_fc(_id){
		const _infor=this.get_main_skill_infor(_id);
		return _infor.icon_fc;
	}
	get_main_skill_perform_fc(_id){
		const _infor=this.get_main_skill_infor(_id);
		return _infor.perform_fc;
	}
	get_main_skill_upgradable(_id){//co the nang cap' ko
		const _infor=this.get_main_skill_infor(_id);
		return _infor.upgradable;
	}
	enable_passive_skill(){
		this._game.add_to_update_function_list(()=>{
			this.perform_passive_skill();
		});
	}
	perform_passive_skill(){
		if(typeof this._ready_for_passive_skill==='undefined')
			this._ready_for_passive_skill=true;
		if(this._ready_for_passive_skill){
			//try{
			let _targets=this._game._unitMG.get_enemy_combat_unit_in_range(this.Position,350);
			if(_targets===null||_targets.length===0)return;
			
			this._ready_for_passive_skill=false;
			
			let _t_skills=this._ship_package.get_ship_passive_skills();
			if(_has_passive_skill_1===null){
				_passive_skill_id_1=_t_skills[0].id;
				if(_passive_skill_id_1){
					_has_passive_skill_1=true;
					if(!this._game._parameters.is_passive_skill_permanent_own(_t_skills[0].id))
						this._ship_package.remove_ship_passive_skill(_t_skills[0].id);//remove sau khi su dung
				}
				else
					_has_passive_skill_1=false;
			}
			if(_has_passive_skill_1){
				//this.perform_additional_skill(_passive_skill_id_1);
				const _skill_level=this._ship_package.get_passive_skill_level(_passive_skill_id_1);
				this._game._parameters.get_passive_skill_create_fc(_passive_skill_id_1)(this,_skill_level);
			}
			this._game.add_to_timer(()=>{
				this._ready_for_passive_skill=true;
			},12);
			//}catch(e){alert(e.stack);}
		}
	}
	
	init_skills(){
		//try{
		for(let i=0;i<this._main_skill_ids.length;i++){
			const _id=this._main_skill_ids[i];
			const _name=this.get_main_skill_name(_id);
			const _icon_fc=this.get_main_skill_icon_fc(_id);
			const _perform_fc=this.get_main_skill_perform_fc(_id);
			
			this._skill_list.push([_name,_icon_fc,_perform_fc,_id]);
			
			//this._ship_package.add_main_skill(_id);//lan dau su dung se add data vao ship-package, nhung lan sau se ko co tac dong gi
		}
		//}catch(e){alert(e.stack);}
		
	}
	
	next_skill(){
		this._current_skill_id++;
		if(this._current_skill_id>this._skill_list.length-1)
			this._current_skill_id=0;
		
		var _children = this._skill_panel.children;
		for(let i=0;i<_children.length;i++){
			const _child=_children[i];
			if(i===this._current_skill_id){
				_child.style.border="solid 0px yellow";
				//_child.style.transform="scale(1.1,1.1)";
			}
			else{
				_child.style.border="solid 0px white";
				//_child.style.transform="scale(1,1)";
			}
		}//alert(this._current_skill_id);
	}
	
	all_main_skill_ready(){
		if(typeof this._lock_main_skill_status==='undefined')
			return false;
		
		for(let i=0;i<this._lock_main_skill_status.length;i++){
			if(this._lock_main_skill_status[i].lock===true)
				return false;
		}
		
		return true;
	}
	
	perform_skill(){
		if(_lock_all_main_skill)
			return false;
		if(!this._current_skill_id)
			this._current_skill_id=0;
		
		if(typeof this._lock_main_skill_status==='undefined')
			this._lock_main_skill_status=new Array();
		
		let _found=false;
		for(let i=0;i<this._lock_main_skill_status.length;i++){
			if(this._lock_main_skill_status[i].skill_id===this._current_skill_id){
				_found=true;
				if(this._lock_main_skill_status[i].lock===true)
					return false;
			}
		}
		if(!_found)this._lock_main_skill_status.push({skill_id:this._current_skill_id,lock:false});
		let _t_id;
		for(let i=0;i<this._lock_main_skill_status.length;i++){
			if(this._lock_main_skill_status[i].skill_id===this._current_skill_id){
				this._lock_main_skill_status[i].lock=true;
				_t_id=i;
				break;
			}
		}
		this._game.add_to_timer(()=>{
			this._lock_main_skill_status[_t_id].lock=false;
			this._game._sound.play("main-skill-ready");
			for(let i=0;i<this._main_skill_ready_callbacks.length;i++){
				this._main_skill_ready_callbacks[i]();
			}
		},this._game._parameters.spaceship_main_skill_delay);
		
		
		if(this._skill_list[this._current_skill_id]){
			const _id=this._skill_list[this._current_skill_id][3];
			const _perform_fc=this._skill_list[this._current_skill_id][2];
			const _skill_level=this._ship_package.get_main_skill_level(_id,true);
			if(_perform_fc)_perform_fc(this,_skill_level);
		}
		
		let _icon=this._main_skill_icons[this._current_skill_id];
			_icon.classList.remove("neonShadow");
			_icon.style.borderRadius="50px";
			_icon.style.opacity=0.5;
		this._game.add_to_timer(()=>{
			_icon.classList.add("neonShadow");
			_icon.style.opacity=1;
		},this._game._parameters.spaceship_main_skill_delay);
		
		return true;
		/*
		for(let i=0;i<this._main_skill_icons.length;i++){
			let _icon=this._main_skill_icons[i];
			      _icon.classList.remove("neonShadow");
			this._game.add_to_timer(()=>{
				_icon.classList.add("neonShadow");
			},this._game._parameters.spaceship_main_skill_delay);
		}
		*/
	}
	all_sub_skill_ready(){
		if(typeof this._ready_for_additional_skill==='undefined')
			return false;
		return this._ready_for_additional_skill;
	}
	perform_additional_skill(){
		if(_lock_all_sub_skill)
			return false;
		
		if(typeof this._ready_for_additional_skill==='undefined')
			this._ready_for_additional_skill=true;
		if(this._ready_for_additional_skill){
			//try{
			this._ready_for_additional_skill=false;
			
			let _t_skills=this._ship_package.get_ship_additional_skills();//alert(_t_skills);
			//if(_has_additional_skill_1===null){
				_skill_id_1=false;
				if(_t_skills[0])_skill_id_1=_t_skills[0].id;
				if(_skill_id_1){
					_has_additional_skill_1=true;
					if(!this._game._parameters.is_additional_skill_permanent_own(_t_skills[0].id))
						this._ship_package.remove_ship_additional_skill(_t_skills[0].id);//remove sau khi su dung
				}
				else
					_has_additional_skill_1=false;
			//}
			
			if(_has_additional_skill_1){
				//this.perform_additional_skill(_skill_id_1);
				//this._game._noticeBoard.add_message("SkillLevel="+this._ship_package.get_additional_skill_level(_skill_id_1));
				const _skill_level=this._ship_package.get_additional_skill_level(_skill_id_1);
				this._game._parameters.get_additional_skill_create_fc(_skill_id_1)(this,_skill_level);
			}
			this._add_skill_btn.classList.remove("neonShadow");
			this._add_skill_btn.style.opacity=0.4;
			this._add_skill_btn.style.borderRadius="50px";
			this._game.add_to_timer(()=>{
				this._ready_for_additional_skill=true;
				this._add_skill_btn.classList.add("neonShadow");
				this._add_skill_btn.style.opacity=1;
				this._game._sound.play("sub-skill-ready");
				for(let i=0;i<this._sub_skill_ready_callbacks.length;i++){
					this._sub_skill_ready_callbacks[i]();
				}
			},6);
			//}catch(e){alert(e.stack);}
		}
		else{
			//try{
			if(typeof this._peform_sub_skill_fail_call_back!='undefined')
				this._peform_sub_skill_fail_call_back();
			//}catch(e){alert(e.stack);}
		}
		
		return true;
	}
	
	/*
		Trong 1 so game mode player duoc su dung 2 sub skill
	*/
	enable_second_sub_skill(_id){
		if(!this._ship_package.has_additional_skill(_id))
			return false;
		if(this._ship_package.using_additional_skill(_id))
			return false;
		
		let _lock_second_sub_skill=false;
		this._peform_sub_skill_fail_call_back=()=>{
			if(_lock_second_sub_skill)
				return;
			_lock_second_sub_skill=true;
			this._game.add_to_timer(()=>{
				_lock_second_sub_skill=false;
			},6);
			const _skill_level=this._ship_package.get_additional_skill_level(_id);
			this._game._parameters.get_additional_skill_create_fc(_id)(this,_skill_level);
		};
		
		return true;
	}
	
	require_light_shield_skill(_shipclass){
		if(typeof _shipclass._lock_shield_skill==='undefined')
			_shipclass._lock_shield_skill=false;
		if(_shipclass._lock_shield_skill)return;
			_shipclass._lock_shield_skill=true;
		
		let _delay=this._game._parameters._light_shield_delay;
		_shipclass._game.add_to_timer(()=>{
				_shipclass._lock_shield_skill=false;
		},_delay);
		
		_shipclass.apply_light_shield_skill(_shipclass);
	}
	
	require_speedup_skill(){
		if(typeof this._lock_speed_up_skill==='undefined')
			this._lock_speed_up_skill=false;
		
		if(this._lock_speed_up_skill)return;
				this._lock_speed_up_skill=true;
				this._params.game.add_to_timer(()=>{
					this._lock_speed_up_skill=false;
				},6);
				this._speedup_counter=0;
				if(this._ship_package.get_speed_up_num()<=0)return;
				this._params.game.add_to_timer(()=>{
					this.apply_speedup_skill();
				},3);
				
				this._ship_package.minus_speed_up_num();
				//this._speed_up_num_label.innerHTML=this._ship_package.get_speed_up_num();
				
				this._params.game._sound.play("speed-up");
				this._params.game._effect_screen.show_speed_up_effect_1(4);
	}
	
	apply_speedup_skill(){
		let _step=50,_num=50;
		if(!this._speedup_counter||this._speedup_counter===null){
			this._speedup_counter=0;
		}
		//this._game._entities['_controls2']._lock=true;
		let _player_pos=this.get_world_position();
		let _player_direct=this.get_world_direction();
		let _target_pos=this._utils.findPointB(_player_pos.x,_player_pos.y,_player_pos.z,
											-_player_direct.x,-_player_direct.y,-_player_direct.z,
											_step);
		let _cam_pos=new THREE.Vector3();
		this._model.position.copy(_target_pos);
		let _fc=(timeInSeconds)=>{
			
			this._speedup_counter++;
			if(this._speedup_counter<=_num){
				this.apply_speedup_skill();
				return;
			}
			
			this._game.remove_function_from_update_list(_fc);
			return;
		};
		this.add_to_update_function_list(_fc);
		
	}
	
	
	set_target(_target){
		this._focus_target=_target;
	}
	
	CheckTarget(){ //new function not overwrite, de 1s goi 1 lan cho nhe game
		if(this._params.game._unitMG._combat_unit_list.length===0){
			this._params.arrow.visible=false;
			return;
		}
		if(this._focus_target===null||this._focus_target.Dead){
			let _found=false;
			const _player_pos=this.get_world_position();
			let _distance_1=9999999;
			for(var i=0;i<this._params.game._unitMG._combat_unit_list.length;i++){
				let _next_target=this._params.game._unitMG._combat_unit_list[i];
				
				if(!_next_target.Dead){
					if(this._arrow_only_target_front_target===true){//space-tunnel-mode, only point at front
						const _front_pos=this.getFrontPos(10000);
						const _d1=this.Position.distanceTo(_front_pos);
						const _d2=_next_target.Position.distanceTo(_front_pos);
						if(_d2>_d1)continue;
					}
					const _distance_2=_next_target.get_world_position().distanceTo(_player_pos);
					if(_distance_2<_distance_1){
						_distance_1=_distance_2;
						this._focus_target=_next_target;
						_found=true;
					}
					
				}
			}
			
			return;
		}
	
		const _tpos=new THREE.Vector3();
		this._focus_target._model.getWorldPosition(_tpos);
		this._params.arrow.lookAt(_tpos);
		this._params.arrow.visible=true;
		
	}
	
	//SAU NAY PHAI TIM CACH DE CHI SU DUNG 1 THRUSTER THOI
	//Hien tai chua hieu vi sao neu chi dung 1 thruster khi cho SpaceShip chuc' dau` xuong 
	//thi tia laser ko nhin thay
	activeEngine(){
		const p1 = this._params.game._entities[this._thruster_id1].CreateParticle();//bắt đầu quá trình tạo một particle (hạt) mới.
		const p2 = this._params.game._entities[this._thruster_id2].CreateParticle();
		var _pos=this._params.game._entities[this._thruster_id2].GetPosition();
		if(this.first_init)
			this._params.game._entities[this._thruster_id2].SetPosition(new THREE.Vector3(_pos.x,_pos.y-0.1,_pos.z+2.5));
		this.first_init=false;
		this.activeThruster(p1);
		this.activeThruster(p2);
		
	}
	activeThruster(p){
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
	
	stopEngine(){
		this._params.game._entities[this._thruster_id1].Destroy();
		this._params.game._entities[this._thruster_id2].Destroy();
	}
	
	repair(){	
		this._health=this._params.max_health;
		this._hpBar.add(100);
		
	}
	refuel(){
		refillMana();
	}
	takefuel(_val){
		removeMana(_val);
	}
	getfuel(){
		return getMana();
	};
	TakeDamage(dmg) {//overwrite parent class
		//console.log("Damage="+dmg);
		if(!super.TakeDamage(dmg))return false;
		
		this._game._sound.play('impact-bullet-metal-1');
		
		if(!this._removed_hp){
			this._removed_hp=0;
		}
		
		let _removeHP=100*dmg/this._max_health;
		this._hpBar.remove(_removeHP);
		this._removed_hp+=_removeHP;
		
	}
	
	init_skill_panel(){
		
		this.create_skill_panel();
		this.create_exploration_ship_panel(3);
		
		this.init_rocket_panel();
		
		this.next_skill();
	}
	
	init_rocket_panel(){
		let _rockets_infor=new Array();
		let _full_infor=this._game._unitMG.get_all_rockets_infor();
		let _use_infor=this._ship_package.get_rocket_in_compartment_id();
		for(let i=0;i<3&&i<_use_infor.length;i++){
			const _id1=_use_infor[i];
			for(let j=0;j<_full_infor.length;j++){
				const _id2=_full_infor[j].id;
				if(_id2===_id1){
					_rockets_infor.push(_full_infor[j]);
					break;
				}
			}
		}
		_rockets_infor.reverse();
		this.create_missle_panel(_rockets_infor);
	}
	hide_skill_panel(){
		if(this._skill_panel){
			this._skill_panel.style.visibility="hidden";
		}
	}
	create_skill_panel(){
		this._main_skill_icons=new Array();
		add_css_1();
		
		this._skill_panel=document.createElement("div");
		this._skill_panel.style.position="absolute";
		this._skill_panel.style.bottom='340px';
		this._skill_panel.style.width="30%";
		this._skill_panel.style.height="1px";
		this._skill_panel.style.left="2%";
		this._skill_panel.style.textAlign="center";
		this._skill_panel.style.display="flex";
		
		if(this._game._root_div)
			this._game._root_div.appendChild(this._skill_panel);
		else
			document.body.appendChild(this._skill_panel);
		
		//this._add_skill_buttons=new Array();
		
		let _add_skill_btn_1=document.createElement("div");
		_add_skill_btn_1.classList.add("neonShadow");
		//_add_skill_btn_1.classList.add("glowing-btn");
		
		_add_skill_btn_1.style.width=this._skill_icon_width;
		_add_skill_btn_1.style.height=this._skill_icon_width;
		_add_skill_btn_1.style.position="absolute";
		
		this._skill_panel.appendChild(_add_skill_btn_1);
		_add_skill_btn_1.addEventListener("click",()=>{
			this.perform_additional_skill();
		});
		/*
		const _add_skill_icon=document.createElement("img");
		_add_skill_icon.style.width=this._skill_icon_width;
		_add_skill_icon.style.height=this._skill_icon_width;
		_add_skill_icon.style.borderRadius="50px";
		*/
		
		let _src;
		let _t_skills=this._ship_package.get_ship_additional_skills();//alert(_t_skills);
		let	_skill_id_1=false;
			if(_t_skills[0])_skill_id_1=_t_skills[0].id;
			if(_skill_id_1){
				_src=this._game._parameters.get_additional_skill_icon_path(_skill_id_1);
			}
			else{
				_src="./resources/icons/null-1.png";
			}
		const _add_skill_icon=this.get_skill_icon(_src);
		_add_skill_btn_1.appendChild(_add_skill_icon);
		this._add_skill_btn=_add_skill_btn_1;
		
		let _icon_space_x=60;
		let _icon_space_y=70;
		let _icon_counter=0;
		let _positions=[
			{x:3,y:80},
			{x:55,y:110},
			{x:100,y:150},
			{x:150,y:205},
		];
		for(let i=0;i<this._skill_list.length;i++){
			const _element=this._skill_list[i];
			const _name=_element[0];
			const _fc=_element[1];
			let _icon=_fc(this);
			//let _px=(i*_icon_space_x);
			//let _py=(i*_icon_space_y);
			let _px=_positions[_icon_counter].x;
			let _py=_positions[_icon_counter].y;
			this._main_skill_icons.push(_icon);
			_icon.style.position="absolute";
			_icon.style.left=_px+"px";
			_icon.style.top=_py+"px";
			_icon_counter++;
		}
		_add_skill_btn_1.style.top=(_positions[_icon_counter].y)+"px";
		_add_skill_btn_1.style.left=(_positions[_icon_counter].x)+"px";
		
	}
	remove_skill_panel(){
		this._skill_panel.remove();
	}
	
	
	
	create_speed_up_icon(_shipclass){
		/*
		const _speed_up_icon_container=document.createElement("div");
		_speed_up_icon_container.classList.add("neonShadow");
		_speed_up_icon_container.style.width=_shipclass._skill_icon_width;
		_speed_up_icon_container.style.height=_shipclass._skill_icon_width;
		_shipclass._skill_panel.appendChild(_speed_up_icon_container);
		//this._ship_package.set_speed_up_num(5);
		const _speed_up_num=_shipclass._ship_package.get_speed_up_num();
		let _speed_up_num_label=document.createElement("div");
		_shipclass._speed_up_num_label=_speed_up_num_label;
		const _speed_up_icon=document.createElement("img");
		_speed_up_icon.src="./resources/icons/speed-up-1.png";
		_speed_up_icon.style.width=_shipclass._skill_icon_width;
		_speed_up_icon.style.height=_shipclass._skill_icon_width;
		_speed_up_icon.style.border="white solid 1px";
		_speed_up_icon.style.borderRadius="50px";
		_speed_up_icon_container.appendChild(_speed_up_icon);
		*/
		const _speed_up_icon_container=_shipclass.create_skill_icon(_shipclass,"./resources/icons/speed-up-1.png");
		
		//_shipclass._lock_speed_up_skill=false;
		_shipclass.create_speed_up_icon._perform_fc=()=>{
			_shipclass.require_speedup_skill();
		};
		_speed_up_icon_container.addEventListener("click",_shipclass.create_speed_up_icon._perform_fc);
		//_speed_up_num_label.innerHTML=_speed_up_num;
		/*
		_speed_up_num_label.style.position="absolute";
		_speed_up_num_label.style.width="10px";
		_speed_up_num_label.style.height="10px";
		_speed_up_num_label.style.top="-5px";
		_speed_up_num_label.style.left="-5px";
		_speed_up_num_label.style.color="white";
		_speed_up_num_label.style.fontSize="20px";
		_speed_up_icon_container.appendChild(_speed_up_num_label);
		*/
		
		return _speed_up_icon_container;
	}
	create_light_shield_icon(_shipclass){
		/*
		const _lighting_icon_container=document.createElement("div");
		_lighting_icon_container.classList.add("neonShadow");
		_lighting_icon_container.style.width=_shipclass._skill_icon_width;
		_lighting_icon_container.style.height=_shipclass._skill_icon_width;
		_lighting_icon_container.style.marginLeft="15px";
		_shipclass._skill_panel.appendChild(_lighting_icon_container);
		const _lighting_num=_shipclass._ship_package.get_lighting_num();
		let _lighting_num_label=document.createElement("div");
		const _lighting_icon=document.createElement("img");
		_lighting_icon.src="./resources/icons/shield-1.png";
		_lighting_icon.style.width=_shipclass._skill_icon_width;
		_lighting_icon.style.height=_shipclass._skill_icon_width;
		_lighting_icon.style.border="white solid 1px";
		_lighting_icon.style.borderRadius="50px";
		_lighting_icon_container.appendChild(_lighting_icon);
		*/
		
		_shipclass.create_light_shield_icon._perform_fc=()=>{
				_shipclass.require_light_shield_skill(_shipclass);
				
		};
		const _lighting_icon_container=_shipclass.create_skill_icon(_shipclass,"./resources/icons/shield-1.png");
		_lighting_icon_container.addEventListener("click",_shipclass.create_light_shield_icon._perform_fc);
		
		return _lighting_icon_container;
	}
	get_skill_icon(_img_path){
		let _icon_container=document.createElement("div");
		_icon_container.style.position="absolute";
		_icon_container.style.left="-5px";
		_icon_container.style.top="-5px";
		_icon_container.style.width = "100%";
		_icon_container.style.height = "100%";
		//_icon_container.style.borderRadius = "50%";
		//_icon_container.style.overflow = "hidden";
		_icon_container.style.padding = "2px";
		/*
		_icon_container.style.backgroundImage = `
			url('./resources/icons/skill-bg.png')
		`;
		_icon_container.style.backgroundSize="120%";
		_icon_container.style.backgroundPosition="center";
		*/
		const bg = document.createElement("div");
bg.style.position = "absolute";
bg.style.top = "-15%";
bg.style.left = "-15%";
bg.style.width = "130%";
bg.style.height = "130%";
bg.style.background = `url("./resources/icons/ring-4.png") center/cover no-repeat`;
bg.style.zIndex = "-1";
_icon_container.appendChild(bg);
		
		let _icon = document.createElement("div");
		//_icon.style.position="absolute";
		//_icon.style.left="-5px";
		//_icon.style.top="-5px";
		_icon.style.width = "100%";
		_icon.style.height = "100%";
		_icon.style.borderRadius = "50%";
		_icon.style.overflow = "hidden";
		//_icon.style.padding = "2px";
		
		_icon_container.appendChild(_icon);
		
		_icon.style.backgroundImage = `
			url('`+_img_path+`'),
			linear-gradient(45deg, blue, turquoise, red)
		`;
		
		
		
		_icon.style.backgroundOrigin = "border-box, border-box";
		_icon.style.backgroundClip = "content-box, border-box"; 
		_icon.style.backgroundPosition = "center, center";
		_icon.style.backgroundRepeat = "no-repeat, no-repeat";
		_icon.style.backgroundSize = "cover, cover";
		_icon.style.border = "2px solid transparent";
		_icon.style.filter="brightness( 190% ) ";
		
		return _icon_container;
	}
	create_skill_icon(_shipclass,_img_path){
		let _container=document.createElement("div");
		_container.classList.add("neonShadow");
		_container.style.width=_shipclass._skill_icon_width;
		_container.style.height=_shipclass._skill_icon_width;
		_container.style.marginLeft="15px";
		_shipclass._skill_panel.appendChild(_container);
		
		let _icon=this.get_skill_icon(_img_path);
		
		_container.appendChild(_icon);
		
		return _container;
	}
	create_lighting_icon(_shipclass){
		const _lighting_icon_container=_shipclass.create_skill_icon(_shipclass,'./resources/icons/thunder.png');
		
		const _lighting_num=_shipclass._ship_package.get_lighting_num();
		let _lighting_num_label=document.createElement("div");
		
		let _delay=10;
		let _lock_flash_skill=false;
		_shipclass.create_lighting_icon._perform_fc=()=>{
				//if(_shipclass._ship_package.get_lighting_num()<=0)return;
				if(_lock_flash_skill)return;
				_lock_flash_skill=true;
				_shipclass._game.add_to_timer(()=>{
					_lock_flash_skill=false;
				},_delay);
				
				_shipclass._ship_package.minus_lighting_num();
				_lighting_num_label.innerHTML=_shipclass._ship_package.get_lighting_num();
			
				_shipclass.apply_flash_skill(_shipclass);
			
		};
		
		_lighting_icon_container.addEventListener("click",_shipclass.create_lighting_icon._perform_fc);
		
		_lighting_num_label.innerHTML=_lighting_num;
		//_lighting_num_label.style.position="absolute";
		_lighting_num_label.style.width="10px";
		_lighting_num_label.style.height="10px";
		_lighting_num_label.style.top="-5px";
		_lighting_num_label.style.left="-5px";
		_lighting_num_label.style.color="white";
		_lighting_num_label.style.fontSize="20px";
		//_lighting_icon_container.appendChild(_lighting_num_label);
		
		return _lighting_icon_container;
	}
	
	create_exploration_ship_panel(_num){
		
	}
	remove_exploration_ship_panel(){
		this._exploration_ship_panel.remove();
	}
	
	
	create_missle_panel(rocket_infor){
		//this._rocket_package=new RocketPackage({game:this._game,unit:this});
		const _exploration_num=this._ship_package.get_exploration_ship_num();
		this._rocket_package.init(this,_exploration_num,rocket_infor);
		
		return;
		
	}
	create_missile_icon(_id,_num){
		for(let i=0;i<_num;i++){
			let _missle_icon_container=document.createElement("div");
			_missle_icon_container.style.width="50px";
			_missle_icon_container.style.height="50px";
			this._missle_panel.appendChild(_missle_icon_container);
			let _missle=document.createElement("img");
			_missle.src="./resources/icons/missle-"+_id+".png";
			_missle.style.width="25px";
			_missle.style.height="25px";
			_missle.style.border="solid 2px black";
			_missle.style.borderRadius="10px";
			_missle_icon_container.appendChild(_missle);
			let _launched=false;
			_missle_icon_container.addEventListener("click",()=>{
				if(_launched)return;
				_launched=true;
				_missle_icon_container.style.opacity="0.3";
				let _pos1=this.get_ahead_point(15);
				let _pos2=this.get_ahead_point(150);
				let _ship;
				if(_id===1){
					_ship=this._game._unitMG.create_missile_1(_pos1);
					this._game._graphics.Scene.add(_ship._model);
					_ship._model.lookAt(_pos2);
				}
				if(_id===2){
					_ship=this._game._unitMG.create_missile_2(_pos1);
					this._game._graphics.Scene.add(_ship._model);
					_ship._model.lookAt(_pos2);
				}
				if(_id===3){
					let _rs=this._game._unitMG.create_missile_3(_pos1);
					//this._game._graphics.Scene.add(_ship._model);
					//_ship._model.lookAt(_pos2);
					for(let i=0;i<_rs.length;i++){
						_ship=_rs[i];
						this._game._graphics.Scene.add(_ship._model);
						_ship._model.lookAt(_pos2);
						_ship._target_id=i;//dung de cho 3 qua ten lua duoi theo 3 muc tieu khac nhau
						_ship._lock_missile=false;
					}
				}
				
				this._game._sound.play('missile-launch');
			});
		}
	}
	remove_missle_panel(){
		this._missle_panel.remove();
	}
	
	launch_exploration_ship(){
		
	}
}


//-----------MANA BAR----------------------
const manaBarText = document.getElementById("manaBarText");
const manaBarInner = document.getElementById("manaBarInner");
let manaBarState = {
  healthBarSectionGap: 2,
  maxHealth: 10,
  currentMana: 10
};
//healthBarState.currentHealth--;
function getMana(){
	return manaBarState.currentMana;
};
function removeMana(_val){
	manaBarState.currentMana-=_val;
	if(manaBarState.currentMana<0)manaBarState.currentMana=0;
	//alert(manaBarState.currentMana);
	renderManaBar();
};
function refillMana(){
	manaBarState.currentMana=10;
	renderManaBar();
};

renderManaBar();

// Functions
function renderManaBar() {
  renderHealthBarSections(100 / manaBarState.maxHealth);
  //renderManaBarText();
}

function renderHealthBarSections(percentage) {
	if(!manaBarInner)return;
  manaBarInner.innerHTML = "";
  
  const _manaBar=document.getElementById("mana-bar");
  const bg = document.createElement("div");
bg.style.position = "absolute";
bg.style.top = "-30%";
bg.style.left = "-30%";
bg.style.width = "160%";
bg.style.height = "160%";
bg.style.background = `url("./resources/icons/ring-1.png") center/cover no-repeat`;
bg.style.zIndex = "-1";
//_manaBar.style.position = "relative";
_manaBar.appendChild(bg);
  
  
  const sectionTemplate = `<path class="mana-bar__section" d="M0 0" fill="#fff" style="transform: rotate(10deg)" />`;
  const radius = 100;
  const angle = (percentage / 100) * 360 - manaBarState.healthBarSectionGap;
  const radians = (angle - 180) * (Math.PI / 180);
  const x = radius * Math.cos(radians);
  const y = radius * Math.sin(radians);
  const largeArc = percentage > 50 ? 1 : 0;
  /*
   This is the dynamic circle section part.
   The circle sections have a pie slice shape, partially hidden by a circle layered on top.
   To draw the slice, we go from the center of the healthbar to an outer point,
   draw an arc according to the max sections of the healthbar, then close the shape.
  */
  const d = `M0 0 -100 0 A${radius} ${radius} 0 ${largeArc} 1 ${x} ${y} Z`;

  for (let i = 0; i < parseInt(manaBarState.currentMana); i++) {
    const healthBarSection = createHealthBarSectionElement(i);
    healthBarSection.setAttribute("d", d);
    manaBarInner.appendChild(healthBarSection);
  }
}

function createHealthBarSectionElement(index) {
  // Tạo một phần tử path trong SVG namespace
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("class", "mana-bar__section");

  // Thiết lập màu fill cho phần của hình tròn
  let _color = "#3EFBBC";
  if (manaBarState.currentMana < 6)
    _color = "yellow";
  if (manaBarState.currentMana < 3)
    _color = "red";
  path.setAttribute("fill", _color);

  // Thiết lập transform để xoay các phần của hình tròn
  path.setAttribute("transform", `rotate(${getSectionRotation(index)}, 0, 0)`);

  // Thiết lập border cho phần của hình tròn
  //path.setAttribute("stroke", "white"); // Màu border
  //path.setAttribute("stroke-width", "2"); // Độ rộng border
  //path.classList.add("neonShadow");

  return path;
}

function getSectionRotation(index) {
  return (360 / manaBarState.maxHealth) * index;
}

function renderManaBarText() {
	if(!manaBarText)return;
  manaBarText.innerHTML = manaBarState.currentMana;
}

//------------------------HP BAR------------------------------------
var f = window.requestAnimationFrame ? window.requestAnimationFrame : function (x) {
	setTimeout(x, 20)
};


Math.easeOutExpo = function (t, b, c, d) { return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b; };

function HealthBar (element, initial, lblValue) {
	this.bar			= element;
	this.lblValue		= lblValue;
	this.state			= element.querySelector('.state');
	this.state.current	= initial;
	this.state.classList.add('state');
	this.bar.appendChild(this.state);
	
	this.setBar(this.state.current);
}

HealthBar.prototype = {
	state	: undefined,
	dead	: false,
	
	setBar	: function (percent) {
		if (percent) {
			this.lblValue.innerHTML = parseInt(percent) + '%';
			if (this.dead) {
				this.bar.classList.remove('dead');
				this.lblValue.classList.remove('dead');
			}
		} else {
			this.dead = true;
			this.bar.classList.add('dead');
			this.lblValue.classList.add('dead');
			//this.lblValue.innerHTML = 'Dead';
		}
		
		var r = percent-50; r = r > 0 ? 255 / 50 * (50-r) : 255;
		var g = percent < 50 ? 255 / 50 * percent : 255;
		this.state.style.backgroundColor = 'rgba('+parseInt(r)+','+parseInt(g)+',196,1)';//<-thay 196 bang gia tri bat ky de thay doi mau
		this.state.style.boxShadow = '0 0 8px 0 rgba('+parseInt(r)+','+parseInt(g)+',196,.8)';//gia tri ban dau la 0
		
		this.state.style.width = percent + '%';
	},
	
	add : function (amount) {
		if (this.state.current + amount > 100) 
			amount = 100 - this.state.current;
		var delta = document.createElement('div');
		delta.classList.add('additional');
		
		delta.style.width = '0px';
		delta.style.left = this.state.current+'%';


		var that = this;
		var infoText = document.createElement('span');
		infoText.className = 'infoText healTaken';
		infoText.innerHTML = parseInt(amount*10) + '%';
		this.bar.appendChild(infoText);
		setTimeout(function () { that.bar.removeChild(infoText); }, 1000);

		
		var sStart = this.state.current,
			start = Date.now(),
			duration = 500;
		(function refresh () {
			var t = Date.now() - start;
			var s = Math.easeOutExpo(t, 0, amount, duration);
			delta.style.width = s+'%';
			that.setBar(sStart+s);
			if (t <= duration) f(refresh);
			else {
				that.setBar(sStart + amount);
				delta.classList.add('fadeout');
			}
		})();
		
		this.bar.insertBefore(delta, this.state); 
		this.state.current += amount;
		
		var that = this;
		setTimeout(function () {
			that.setBar(that.state.current);
			that.bar.removeChild(delta, that.bar);
		}, 1000);
	},
	
	remove : function (amount) {
		if (this.state.current - amount < 0)
			amount = this.state.current;
		var delta = document.createElement('div');
		delta.classList.add('removal');
		
		delta.style.width = amount + 'px';
		delta.style.right = (100 - this.state.current)+'%';

		var that = this;
		var infoText = document.createElement('span');
		infoText.className = 'infoText dmgTaken';
		infoText.innerHTML = parseInt(amount*10) + '%';
		this.bar.appendChild(infoText);
		setTimeout(function () { that.bar.removeChild(infoText); }, 1000);

		
		var sStart = this.state.current,
			start = Date.now(),
			duration = 500;
		(function refresh () {
			var t = Date.now() - start;
			var s = Math.easeOutExpo(t, 0, amount, duration);
			delta.style.width = s+'%';
			that.setBar(sStart-s);
			if (t <= duration) f(refresh);
			else {
				that.setBar(sStart - amount);
				delta.classList.add('fadeout');
			}
		})();
		
		this.bar.insertBefore(delta, this.state); 
		this.state.current -= amount;
		
		var that = this;
		setTimeout(function () {
			that.setBar(that.state.current);
			that.bar.removeChild(delta, that.bar);
		}, 1000);
	}
}

//var hb = new HealthBar(
	//document.querySelector('.barInner'), 100,
	//document.querySelector('.value')
//);

//setTimeout(function(){hb.remove(20);},5000);
//setTimeout(function(){hb.add(40);},7000);
//------------------------END HP BAR-------------------------------------






//-----------------------------------------------------
export{PlayerEntity};

function add_css_1(){
	var styleTag = document.createElement("style");
		styleTag.textContent=`
		
.new-btn-container1 {
  position: relative;
  width: 160px;
  height: 50px;
  line-height: 48px;
  background: #000;
  text-transform: uppercase;
  font-size: 25px;
  text-align: center;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: 0.5s;

  -webkit-box-reflect: below 1px linear-gradient(transparent, #0004);
}

.new-btn-container1 span {
  position: absolute;
  display: block;
  top: 1px;
  left: 1px;
  right: 1px;
  bottom: 1px;
  text-align: center;
  background: #0c0c0c;
  color: rgba(255, 255, 255, 0.2);
  transition: 0.5s;
}

.new-btn-container1:hover span {
  color: rgba(255, 255, 255, 1);
}

.new-btn-container1 span::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: rgba(255, 255, 255, 0.1);
  z-index: 10;
}

.new-btn-container1::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    #c0392b,
    #f39c12,
    #f1c40f,
    #2ecc71,
    #3498db,
    #2980b9,
    #9b59b6,
    #8e44ad,
    #c0392b,
    #f39c12,
    #f1c40f,
    #2ecc71,
    #3498db,
    #2980b9,
    #9b59b6,
    #8e44ad
  );
  background-size: 400%;
  opacity: 0;
  transition: 2.5s;
  -webkit-animation: eff 20s linear infinite;
          animation: eff 20s linear infinite;
}

.new-btn-container1:hover::before,
.new-btn-container1:hover::after {
  opacity: 1;
}

.new-btn-container1::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    #c0392b,
    #f39c12,
    #f1c40f,
    #2ecc71,
    #3498db,
    #2980b9,
    #9b59b6,
    #8e44ad,
    #c0392b,
    #f39c12,
    #f1c40f,
    #2ecc71,
    #3498db,
    #2980b9,
    #9b59b6,
    #8e44ad
  );
  background-size: 400%;
  opacity: 0;
  filter: blur(20px);
  transition: 0.5s;
  -webkit-animation: eff 20s ease infinite;
          animation: eff 20s ease infinite;
}

@-webkit-keyframes eff {
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: 400% 0;
  }
  100% {
    background-position: 0 0;
  }
}

@keyframes eff {
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: 400% 0;
  }
  100% {
    background-position: 0 0;
  }
}
		`;
		
	document.head.appendChild(styleTag);
}