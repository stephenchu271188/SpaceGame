import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {PointerLockControls} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/controls/PointerLockControls.js';

import {controls} from './controls.js';
import {game} from './game.js';

import {NavigatorBar1} from './navigator-bar-1.js';
import {NavigatorBar2} from './navigator-bar-2.js';

import {EffectsTexture} from './effects-texture.js';

import {SimpleLaserShip} from './units/simple-laser-ship.js';
import {SimpleMissileShip} from './units/simple-missile-ship.js';

//import {HumanEntity} from './human.js';
import {EditModeCenter} from './edit-mode-center.js';
import {Rocket5} from './units/rocket-5.js';

//import {RewardsMG} from './rewards-mg.js';

const _standardW=1536;
const _standardH=743;
const _centerX=_standardW/2;
const _centerY=_standardH/2;
let _mode2_speedX=0.0;
let _mode2_speedY=0.0;
let _mode2_right=false,_mode2_left=false,_mode2_up=false,_mode2_down=false;

class SpaceShipGame extends game.Game{
	constructor(params){
		super(params);
		//this._rewardsMG=new RewardsMG({game:this});
		this.enable_items=true;
		this._before_init_player_ship_fc=()=>{};
	    this._after_init_player_ship_fc=()=>{};
		window.addEventListener('beforeunload',()=>{
			this._me._inventory.save_data();
			this._me._ship_package.save_data();
		});
		this._right_mouse_callback=new Array();
		this._editModeCenter=new EditModeCenter({game:this});
		if(this.System.isMobileDevice()){
			this._noticeBoard.hide();
		}
		
		const imageUrls = [
		    ['vs-icon','./resources/icons/vs-icon.png'],//<=chi su dung trong main-3.js
			['user','./resources/icons/user-2.png'],//<=chi su dung trong main-3.js
			
			['hit1','./resources/gif/hit-2.gif'],
			['hit2','./resources/gif/hit-1.gif'],
			//['explosion-2','./resources/gif/explosion/1.gif'],
			['explosion-1','./resources/gif/explosion/7.gif'],
			['particle1','./resources/particle/noname-3.png'],
			['particle2','./resources/particle/shield-4.png'],
			['particle3','./resources/particle/noname-12.png'],
			['particle4','./resources/particle/noname-1.png'],
			['particle5','./resources/particle/shield-1.png'],
			['particle6','./resources/particle/noname-9.png'],
			['particle7','./resources/particle/noname-4.png'],
			['particle8','./resources/particle/noname-7.png'],
			['particle9','./resources/particle/noname-45.png'],
			['particle10','./resources/particle/circle-3.png'],
			['particle11','./resources/particle/circle-5.png'],
			['particle12','./resources/particle/noname-17.png'],
			['particle13','./resources/particle/noname-15.png'],
			['particle14','./resources/particle/circle-1.png'],
			['particle15','./resources/particle/circle-4.png'],
			['particle16','./resources/particle/noname-37.png'],
			['particle17','./resources/particle/noname-36.png'],
			['particle18','./resources/particle/noname-18.png'],
			['particle19','./resources/particle/dot1.png'],
			['particle20','./resources/particle/noname-13.png'],
			['particle21','./resources/particle/noname-19.png'],
			['particle22','./resources/particle/noname-22.png'],
			['particle23','./resources/particle/noname-24.png'],
			['particle24','./resources/particle/noname-29.png'],
			['particle25','./resources/particle/noname-30.png'],
			['particle26','./resources/particle/noname-28.png'],
			['particle27','./resources/particle/noname-53.png'],
			['particle28','./resources/particle/noname-23.png'],
			['particle29','./resources/particle/noname-21.png'],
			['particle30','./resources/particle/red-cross-1.png'],
			['particle31','./resources/particle/heart-1.png'],
			['particle32','./resources/particle/noname-54.png'],
			['particle33','./resources/particle/noname-28.png'],
			['particle34','./resources/particle/noname-51.png'],
			['particle35','./resources/particle/noname-44.png'],
			['particle36','./resources/particle/lighting-1.png'],
			['particle37','./resources/particle/lighting-5.png'],
			['particle38','./resources/particle/noname-10.png'],
			['particle39','./resources/particle/noname-42.png'],
			['particle40','./resources/particle/bubble-1.png'],
			//['particle38','./resources/particle/eye-1.png'],
			//['particle38','./resources/particle/face-2.png'],
			//['particle38','./resources/particle/skull-2.png'],
		];
		this._image_preloader.preloadImages(imageUrls,()=>{
			//alert("Loaded");
		});
	}
	enable_weapons_ready_notice(){
		this._me._rocket_package.add_rocket_ready_callback(()=>{
				this._noticeBoard.add_message("<b style='color:red'>missile skill ready</b> - <b style='color:yellow'>right click</b>",4000,()=>{});
		});
		this._me.add_sub_skill_ready_calback(()=>{
			this._noticeBoard.add_message("<b style='color:green'>sub skill ready</b> - <b style='color:yellow'>double right click</b>",4000,()=>{});
		});
		this._me.add_main_skill_ready_callback(()=>{
			this._noticeBoard.add_message("<b style='color:turquoise'>main skill ready</b> - <b style='color:yellow'>double left click</b>",4000,()=>{});
		});
	}
	add_right_mouse_callback(_fc){
		this._right_mouse_callback.push(_fc);
	}
	lock_all_weapon_and_skill(){
			this._me.lock_all_main_skill();
			this._me.lock_all_sub_skill();
			this._me._rocket_package.lock_rocket();
			this._entities["_controls2"].lock_default_weapon();
	}
	unlock_all_weapon_and_skill(){
			this._me.unlock_all_main_skill();
			this._me.unlock_all_sub_skill();
			this._me._rocket_package.unlock_rocket();
			this._entities["_controls2"].unlock_default_weapon();
	}
	init_space_tunnel_game_test_mode(params){
		this._before_init_player_ship_fc=()=>{
			 this.update_data_in_database("space-tunnel-level",params.game_level-1);//space tunnel game level
		     this._unitMG._player_ship_id=params.player_ship_id;
		};
		this._after_init_player_ship_fc=()=>{
			for(let i=0;i<params.rockets.length;i++){//sau khi shoot rocket dau tien thi moi update dc
				let _rocket_id=params.rockets[i].rocket_id;
				let _rocket_num=params.rockets[i].rocket_num;
				this._me._ship_package.set_rocket_num(_rocket_id,_rocket_num);
				//this._me._ship_package.
			}
			this._me._ship_package.set_all_main_skill_level(params.main_skill_level);
			
			this._me._ship_package.add_ship_additional_skill(params.add_skill_id);
			this._me._ship_package.use_additional_skill(params.add_skill_id);
			this._me._ship_package.set_additional_skill_level(params.add_skill_id,params.add_skill_level);
			
			this._me._ship_package.add_ship_passive_skill(params.pass_skill_id);
			this._me._ship_package.use_passive_skill(params.pass_skill_id);
			this._me._ship_package.set_passive_skill_level(params.pass_skill_id,params.pass_skill_level);
			
			if(params.left_auxiliary){
				let _left={id:params.left_auxiliary.id,name:null,level:params.left_auxiliary.level,use:true};
				this._me._ship_package.add_auxiliary_object(1,_left);
			}
			if(params.right_auxiliary){
				let _right={id:params.right_auxiliary.id,name:null,level:params.right_auxiliary.level,use:true};
				this._me._ship_package.add_auxiliary_object(2,_right);
			}
			this._me.equip_items();
			//alert("SKILLID:"+params.add_skill_id);
			//alert(this._me._ship_package.has_additional_skill(params.add_skill_id));
			//alert("SkillLevel:"+this._me._ship_package.get_additional_skill_level(params.add_skill_id));
			//alert("PassSkillLevel:"+this._me._ship_package.get_passive_skill_level(params.pass_skill_id));
			
			this._me._ship_package.set_ship_level(params.player_ship_level);
		    this._me.apply_space_ship_level_package();
		};
	}
	show_mouse_controls_intro_panel(_fc){
		let _controls_intro='<div style="margin-left:150px;">';
					_controls_intro+='<h3><b class="text-class-3">+Left Click+Hold</b> => <b class="text-class-2">Fire</b></h3>';
					_controls_intro+='<h3><b class="text-class-3">+Double Left Click</b> => <b class="text-class-2">Perform Skill</b></h3>';
					_controls_intro+='<h3><b class="text-class-3">+Right Click</b> => <b class="text-class-2">Launch Rocket</b></h3>';
					_controls_intro+='<h3><b class="text-class-3">+Mouse Wheel</b> => <b class="text-class-2">Change Rocket</b></h3>';
					_controls_intro+='<h3><b class="text-class-3">+Double Right Click</b> => <b class="text-class-2">Perform Sub Skill</b></h3>';
					_controls_intro+='<button id="space-tunnel-game-btn" class="btn first" style="position:absolute;bottom:10px;left:320px;width:120px;">Got it</button>';
					_controls_intro+='</div>';
					
		showModal("750px","450px","Controls",_controls_intro,()=>{
						_fc();
					});
					document.getElementById("space-tunnel-game-btn").addEventListener("click",()=>{
						hideModal();
						_fc();
					});
	}
	remove_sub_skills_list(){
		if(this._additional_skills_panel&&this._additional_skills_panel!=null){
			this._additional_skills_panel.remove();
			this._additional_skills_panel=null;
		}
	}
    create_sub_skills_list(_fc){
		this.remove_sub_skills_list();
		this._additional_skills_panel=document.createElement("div");
		this._additional_skills_panel.style.position="absolute";
		this._additional_skills_panel.style.width="550px";
		this._additional_skills_panel.style.height="50%";
		this._additional_skills_panel.style.left="28%";
		this._additional_skills_panel.style.top="20%";
		this._additional_skills_panel.style.border="2px solid transparent";
		this._additional_skills_panel.style.boxShadow="0 0 10px 5px #33BBFF";
		this._additional_skills_panel.style.backgroundColor="rgba(20, 114, 234, 0.5)";
		this._additional_skills_panel.style.zIndex="99999999999999999";
		
		
		this._root_div.appendChild(this._additional_skills_panel);
		
		const _title=document.createElement("div");
			  _title.style.position="absolute";
			  //_title.style.marginTop="0px";
			  //_title.style.background="rgba(0,0,0,0.8)";
			  _title.style.textAlign="center";
			  _title.style.color="white";
			  //_title.innerHTML="<h3>Additional Skills</h3>";
			  _title.style.top="0px";
			  _title.style.left="0px";
			  _title.style.width="100%";
			  _title.style.height="50px";
			  _title.style.background="rgba(0,0,0,0.4)";
			  //_title.style.fontSize="24px";
			  //_title.style.border="1px gray solid";
			  _title.style.display="flex";
			  _title.style.justifyContent="center";
			  _title.style.alignItems="center";
			  _title.innerHTML=`
					<h1  style="
									background: linear-gradient(to bottom, red,white, yellow);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
									font-size: 24px;
									font-weight: bold;
									font-family: 'Orbitron', sans-serif;
				"'>
			  Choose second sub skills</h1>`;
		this._additional_skills_panel.appendChild(_title);
		  
		const _full_ids=this._parameters.get_additional_skills_ids();
		let _ids=new Array();
		for(let i=0;i<_full_ids.length;i++){
			if(this._me._ship_package.has_additional_skill(_full_ids[i])&&
			!this._me._ship_package.using_additional_skill(_full_ids[i]))
				_ids.push(_full_ids[i]);
		}
		//alert(_ids.length);
		
		if(_ids.length===0){
			this.remove_sub_skills_list();
			_fc();
			return false;
		}
		
		let _child_icon_list=new Array();
		const _width=60;
		const _height=_width;
		const _spX=_width+10;
		const _spY=_spX;
		const _fx=30;
		const _fy=75;
		let _px,_py;
		let _colID=0,_rowID=0;
		const _colNum=7;
		const _rowNum=3;
		const _num=_colNum*_rowNum;
		let _border_style_1="3px solid yellow";//premium
		let _border_style_2="3px solid white";//đã sở hữu
		let _border_style_3="3px solid orange";//đã sở hữu và đang sử dụng
			  
		for(let i=0;i<_num;i++){
			_px=_fx+(_colID*_spX);
			_py=_fy+(_rowID*_spY);//console.log(_px+" and "+_py);
			let _icon_container=document.createElement("div");
			_icon_container.style.position="absolute";
			_icon_container.style.width=_width+"px";
			_icon_container.style.height=_height+"px";
			_icon_container.style.left=_px+"px";
			_icon_container.style.top=_py+"px";
			//_icon_container.style.backgroundColor="rgba(0, 0, 0, 0.4)";
			_icon_container.style.backgroundImage="linear-gradient(-30deg, #000000 50%, #081a2b 50%)"
			
			if(i<_ids.length){
			
				const _id=_ids[i];
				const _name=this._parameters.get_additional_skill_name(_id);
				const _img_path=this._parameters.get_additional_skill_icon_path(_id);
				const _price=this._parameters.get_additional_skill_price(_id);
				const _ship_level=this._parameters.get_additional_skill_ship_level_require(_id);
				const _limit=this._parameters.get_additional_skill_limit(_id);
				const _groupID=this._parameters.get_additional_skill_group(_id);
				//const _icon_src=this._game._parameters.get_additional_skill_icon_path(_id);
			
				const _premium_group=this._unitMG.is_premium_additional_skill_group(this._me._ship_id,_groupID);
			
				_icon_container._additional_skill_id=_id;
				_icon_container._additional_skill_name=_name;
				_child_icon_list.push(_icon_container);
				
				let _img=document.createElement("img");
				_img.src=_img_path;
				_img.style.width="100%";
				_img.style.height="100%";
				_icon_container.appendChild(_img);
				if(_premium_group)
					_img.style.border=_border_style_2;
				else{
					if(this._me._ship_package.using_additional_skill(_id))
						_img.style.border=_border_style_3;
					else{
						_img.style.border=_border_style_2;
					}
				}
				
				if(_premium_group===true){
					let _label1=document.createElement("div");
						_label1.style.position="absolute";
						_label1.style.width="36%";
						_label1.style.height="36%";
						_label1.style.right="5px";
						_label1.style.top="5px";
						_label1.style.backgroundColor="rgba(132, 138, 137, 0.4)";
						_icon_container.appendChild(_label1);
					
					const _premium_icon=document.createElement("img");
						_label1.appendChild(_premium_icon);
						_premium_icon.src="./resources/icons/crown-3.png";
						_premium_icon.style.width="100%";
						_premium_icon.style.height="100%";
				}
				
				_icon_container.addEventListener("click",()=>{
					//this._second_sub_skill_id=_id;
					this.remove_sub_skills_list();
					this._me.enable_second_sub_skill(_id);
					_fc();
				});
			}
			
			this._additional_skills_panel.appendChild(_icon_container);
			_colID++;
			  if(_colID>=_colNum){
				_colID=0;
				_rowID++;
			  }
		}	  
	}
	init_planet_rocket_defend(){
		
		let _lock_planet_rocket_defend=false;
		let _ms_id=-1;
		let _mess;
		let _launch_planet_defend_rocket;
		let _create_launch_btn_fc;
		if(this.System.isMobileDevice()){
			_mess=`
			`;
			_create_launch_btn_fc=()=>{
				let _launch_btn=document.createElement("button");
				_launch_btn.innerHTML='launch';
				_launch_btn.classList.add("ring-button");
				_launch_btn.style.position="absolute";
				_launch_btn.style.left="10px";
				_launch_btn.style.top="250px";
				_launch_btn.style.fontSize="20px";
				_launch_btn.style.transform="scale(0.9)";
				_launch_btn.style.transformOrigin="center";
				this._root_div.appendChild(_launch_btn);
			
				_launch_btn.addEventListener("click",()=>{
					_launch_btn.remove();
					_launch_planet_defend_rocket();
				});
			};
			_create_launch_btn_fc();
		}
		else{
			_mess=`
				Defensive missiles is ready,
				<b style="color:yellow">click</b> 
				and <b style="color:yellow">hold</b> the 
				<b style="color:yellow">right mouse</b> button for 2 seconds
			`;
		}
		
		_ms_id=this._noticeBoard.add_message(_mess,150000,()=>{});
		_launch_planet_defend_rocket=()=>{
			if(_lock_planet_rocket_defend){
				this.show_message_box_2('alert','Can not target',
				"",3);
				return;
			}
				
			_lock_planet_rocket_defend=true;
			this.add_to_timer(()=>{
					_lock_planet_rocket_defend=false;
					if(this.System.isMobileDevice()){
						_create_launch_btn_fc();
					}
					else
						_ms_id=this._noticeBoard.add_message(_mess,150000,()=>{});
				},31);
			
			const _targets=this._unitMG.get_enemy_combat_unit_in_range_3(this._me,
															this._me.getFrontPos(10),
															1000);
			if(_targets.length>0){
				
				const _max_target=6;
				let _target_num=0;
				for(let i=0;i<_targets.length&&i<=_max_target;i++){
					_target_num++;
					const _target=_targets[i][0];
					let gltf=this._unitMG._data_list["missile-1"];
					const model = gltf.scene.children[0];
					model.scale.setScalar(2.5);
					model.rotation.z=Math.PI;
					const _start_pos=this._earth.get_world_position();
					let _rocket=this._unitMG.create_uncombat_unit(Rocket5,model,_start_pos,false);
					_rocket._unit=this._me;
					_rocket._player_id=this._me._player_id;
					_rocket.emit_time=24.0;
					_rocket.launch(_target,'particle6',14,8,99999);
					this._graphics.Scene.add(_rocket._model);
					this.show_message_box_2('notice','Targeting successful',
						_target_num+" targets identified. The missiles are coming.",4);
					}
				    this._noticeBoard.clear_message(_ms_id);
			}
			else{
				this._noticeBoard.clear_message(_ms_id);
				this.show_message_box_2('alert','Targeting failed',
				"None of the targets are close enough! Try again in a few seconds.",2);
			}
			
		}
		
		this.add_right_mouse_callback(_launch_planet_defend_rocket);
	}
	
	create_mobile_control_icon(){
	  
		this._navigator_bar_1=new NavigatorBar1({game:this});
		this._navigator_bar_1.init();
		this._navigator_bar_2=new NavigatorBar2({game:this});
		this._navigator_bar_2.init();
		
		this._effect_texture=new EffectsTexture({game:this});
		
		document.getElementById("hpBarWrapper").addEventListener("click",function(event){
			event.preventDefault();
		});
		document.getElementById("mana-bar").addEventListener("click",function(event){
			event.preventDefault();
		});
		
		
		//this.init_unit_creation_fcs();
		
	};
	
	
	enable_mouse_controlled_mode_3(_fc){
		let _lock_mouse=true;
		let _start_btn=document.createElement("button");
		_start_btn.classList.add("ring-button");
		_start_btn.innerHTML="START";
		_start_btn.style.position="absolute";
		_start_btn.style.top="69%";
		_start_btn.style.left="46.5%";
		this._root_div.appendChild(_start_btn);
		_start_btn.addEventListener("click",()=>{
			_start_btn.remove();
			
			this.init_full_screen_mode();
			//this._gear_box.switch_gear_by_title("P");
			//this._gear_box.switch_gear_by_title("G");
			//this._gear_box.switch_gear_by_title(1);
			this._navigator_bar_2.hide();
			
			const _width=700;
			const _top=(_standardH/2)-(_width/2);
			const _left=(_standardW/2)-(_width/2);
		
			this._center_circle_radius=_width/2;
		
			let _container=document.createElement("div");
			_container.style.position="absolute";
			_container.style.top=_top+"px";
			_container.style.left=_left+"px";
			_container.style.width=_width+"px";
			_container.style.height=_width+"px";
			this._root_div.appendChild(_container);
		
			let _circle=document.createElement("img");
			_circle.src="./resources/img/neon-circle-1.png";
			_circle.style.width="100%";
			_circle.style.height="100%";
			_container.appendChild(_circle);
			
			_container.style.visibility="hidden";
			
			document.body.style.cursor="none";
			let _pointerW=50;
			let _pointerH=73;
			let _pointer=document.createElement("img");
		    _pointer.src="./resources/cursor/5.png";
		    _pointer.style.position="absolute";
			_pointer.style.width=this._pointerW+"px";
			_pointer.style.height=this._pointerH+"px";
		    this._root_div.appendChild(_pointer);
			this._pointer=_pointer;
			this._pointerX=0;
			this._pointerY=0;
			this.add_to_update_function_list((t)=>{
				 _pointer.style.left=(this._pointerX-(_pointerW/2))+"px";
				 _pointer.style.top=(this._pointerY-(_pointerH/2))+"px";
			});
			
			_lock_mouse=false;
		});
		
		
		document.body.addEventListener("mousemove",(event)=> {
			if(_lock_mouse)return;
			this.update_mouse_mode_2(event);
		});
	}
	
	enable_mouse_controlled_mode_2(_fc){
		let _start_btn=document.createElement("button");
		_start_btn.classList.add("ring-button");
		_start_btn.innerHTML="START";
		_start_btn.style.position="absolute";
		_start_btn.style.top="69%";
		_start_btn.style.left="46.5%";
		this._root_div.appendChild(_start_btn);
		_start_btn.addEventListener("click",()=>{
			_start_btn.remove();
			
			this.init_full_screen_mode();
			this._gear_box.switch_gear_by_title("P");
			this._gear_box.switch_gear_by_title("G");
			this._gear_box.switch_gear_by_title(1);
			this._navigator_bar_2.hide();
			
			const _width=200;
			const _top=(_standardH/2)-(_width/2);
			const _left=(_standardW/2)-(_width/2);
		
			this._center_circle_radius=_width/2;
		
			let _container=document.createElement("div");
			_container.style.position="absolute";
			_container.style.top=_top+"px";
			_container.style.left=_left+"px";
			_container.style.width=_width+"px";
			_container.style.height=_width+"px";
			this._root_div.appendChild(_container);
		
			let _circle=document.createElement("img");
			_circle.src="./resources/img/neon-circle-1.png";
			_circle.style.width="100%";
			_circle.style.height="100%";
			_container.appendChild(_circle);
			
			document.body.style.cursor="none";
			let _pointerW=50;
			let _pointerH=73;
			let _pointer=document.createElement("img");
		    _pointer.src="./resources/cursor/5.png";
		    _pointer.style.position="absolute";
			_pointer.style.width=this._pointerW+"px";
			_pointer.style.height=this._pointerH+"px";
		    this._root_div.appendChild(_pointer);
			this._pointer=_pointer;
			this._pointerX=0;
			this._pointerY=0;
			this.add_to_update_function_list((t)=>{
				 _pointer.style.left=(this._pointerX-(_pointerW/2))+"px";
				 _pointer.style.top=(this._pointerY-(_pointerH/2))+"px";
			});
			document.body.addEventListener("mousemove",(event)=> {
				//try{
					this.update_mouse_mode_2(event);
					//}catch(e){alert(e.stack);}
			});
		
			if(_fc)_fc();
		});
	}
	
	update_mouse_mode_2(event){
		
	   const _px = event.clientX; 
	   const _py = event.clientY; 
	   this._pointerX=_px;
	   this._pointerY=_py;
	   
	  
	   
	   let _deltaX=_px-_centerX;if(_deltaX<0)_deltaX=-_deltaX;
	   let _deltaY=_py-_centerY;if(_deltaY<0)_deltaY=-_deltaY;
	   
	   const _max_vel=0.3;
	   const _min_vel=0.025;
	   const _lengthX=_deltaX-this._center_circle_radius;
	   const _lengthY=_deltaY-this._center_circle_radius;
	   const _maxX=_centerX-this._center_circle_radius;
	   const _maxY=_centerY-this._center_circle_radius;
	   let _velX=_max_vel*(_lengthX/_maxX);
	   let _velY=_max_vel*(_lengthY/_maxY);
	   if(_velX<_min_vel)_velX=_min_vel;
	   if(_velY<_min_vel)_velY=_min_vel;
	   
	   if(_px>_centerX+this._center_circle_radius){
		   _mode2_left=false;
		   _mode2_right=true;
	   }
	   if(_px<_centerX-this._center_circle_radius){
		   _mode2_right=false;
		   _mode2_left=true;
	   }
	   if(_px>_centerX-this._center_circle_radius&&_px<_centerX+this._center_circle_radius){
		   _mode2_left=false;
		   _mode2_right=false;
	   }
	   
	   if(_py>_centerY){
		   _mode2_down=false;
		   if(_deltaY>this._center_circle_radius){
			   _mode2_up=true;
		   }
		   else{
			   _mode2_up=false;
		   }
	   }
	   else{
		   _mode2_up=false;
		   if(_deltaY>this._center_circle_radius){
			   _mode2_down=true;
		   }
		   else{
			   _mode2_down=false;
		   }
	   }
	 
	   this._entities["_controls2"]._speedX=_velX;
	   this._entities["_controls2"]._speedY=_velY;
	   
	   if(_mode2_right)this.auto_key_down(68);else this.auto_key_up(68);
	   if(_mode2_left)this.auto_key_down(65);else this.auto_key_up(65);
	   if(_mode2_up)this.auto_key_down(87);else this.auto_key_up(87);
	   if(_mode2_down)this.auto_key_down(83);else this.auto_key_up(83);
	   
	   if((_mode2_right&&_mode2_up||_mode2_right&&_mode2_down)&&_deltaX>this._center_circle_radius*3.5&&_deltaY>this._center_circle_radius*2){
		   this.auto_key_down(69);
		   this._pointer.style.transform="rotate(135deg)";
	   }
	   else{
		   this.auto_key_up(69);
		   if(_mode2_right)
			   this._pointer.style.transform="rotate(90deg)";
		   else
			   if(!_mode2_left)this._pointer.style.transform="rotate(0deg)";
	   } 
		   
	   
	   if((_mode2_left&&_mode2_up||_mode2_left&&_mode2_down)&&_deltaX>this._center_circle_radius*3.5&&_deltaY>this._center_circle_radius*2){
		   this.auto_key_down(81);
		   this._pointer.style.transform="rotate(-135deg)";
	   }
	   else{
		   this.auto_key_up(81);
		   if(_mode2_left)
			   this._pointer.style.transform="rotate(-90deg)";
		   else
			   if(!_mode2_right)this._pointer.style.transform="rotate(0deg)";
	   } 
	
	   if(_mode2_up&&!_mode2_left&&!_mode2_right){
		   this._pointer.style.transform="rotate(180deg)";
	   }
	   
	}
	
	enable_mouse_controlled_mode(_fc){
		let _lock_mouse=true;
		this._mouse_speed=0.3;
		let _start_btn=document.createElement("button");
		_start_btn.classList.add("ring-button");
		_start_btn.innerHTML="START";
		_start_btn.style.position="absolute";
		_start_btn.style.top="69%";
		_start_btn.style.left="46.5%";
		this._root_div.appendChild(_start_btn);
		let elem = document.body;
		_start_btn.addEventListener("click",(evt)=>{
			_start_btn.remove();
			elem.requestPointerLock();
			//let _lock_mouse_timer=false;
			let mouseTimer=()=>{//Chuột đã dừng
					//if(_lock_mouse_timer)return;
					//this._entities["_controls2"]._speedX=0;
					//this._entities["_controls2"]._speedY=0;
					this.auto_key_up(65);
					this.auto_key_up(68);
					this.auto_key_up(87);
					this.auto_key_up(83);
					this.remove_function_from_list_4(mouseTimer);
					return;
			};
			document.addEventListener("mousemove", (event) => {
				this.remove_function_from_list_4(mouseTimer);
				if (document.pointerLockElement === elem) {
				//console.log("ΔX:", event.movementX, "ΔY:", event.movementY);
				if(_lock_mouse)return;
				this.check_mouse_move(event);
				this.add_to_function_list_4(mouseTimer);
			}
			});
			
			this.init_full_screen_mode();
			document.body.style.cursor = "none";
			
			this._gear_box.switch_gear_by_title("P");
			this._gear_box.switch_gear_by_title("G");
			this._gear_box.switch_gear_by_title(1);
			this._gear_box.switch_gear_by_title(2);
			//this._gear_box.switch_gear_by_title(3);
			
			
			
			if(this.System.isMobileDevice()){
				let _touchmove_fc=(event)=> {
					//this.update_mouse2(event);
					this.touchMoveHandle(event);
				};
				let _touchstart_fc=(event)=>{
					this.touchStartHandle(event);
				};
				document.body.addEventListener("touchstart",_touchstart_fc);
				document.body.addEventListener("touchmove",_touchmove_fc);
				document.body.addEventListener("touchend",()=>{
					this._entities["_controls2"]._speedX=0;
					this._entities["_controls2"]._speedY=0;
					[65,68,87,83].forEach(k => this.auto_key_up(k));
				});
				
			}
			
			else{
				
				_lock_mouse=false;
			
			}
			
			
			
			
			try{
			
				_fc();
			}catch(e){alert(e.stack);}
		});
		
		document.body.addEventListener("mousemove",(event)=> {
			if(_lock_mouse)return;
				this.update_mouse(event);
			});
		
	}
	
	init_full_screen_mode(){
		var element=document.body;
			var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
			if (requestMethod) { // Native full screen.
				requestMethod.call(element);
			} else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
			var wscript = new ActiveXObject("WScript.Shell");
			if (wscript !== null) {
				wscript.SendKeys("{F11}");
			}
			}
			if(!this.System.isMobileDevice())
			this._graphics.create_divider(this._root_div,"rgba(0, 0, 0, 0.0)");
			
			
			this._entities["_controls2"]._lock_enter_key=true;
			//this._entities["_controls2"]._move.fire=true;//auto shoot
			
			let clickCount = 0;
			let lastClickTime = 0;
			let lastClickTime2=0;
			//let lastClickTime3=0;
			
			let lock_sub_skill=false;
			//let rightClickTimer = null;
			//const RIGHT_CLICK_DELAY = 1000; // 1 giây
			let double_right_click=false;
			
			
			
			if(!this.System.isMobileDevice()){
			document.body.addEventListener("mouseup",(event)=> {
				if(event.button === 0){
					this._entities["_controls2"]._move.fire=false;
				}
				else if(event.button === 1){
					
				}
				else{
					const currentTime = new Date().getTime();
					const clickDelta = currentTime - lastClickTime2;
					if(clickDelta>800){
						for(let i=0;i<this._right_mouse_callback.length;i++){
							this._right_mouse_callback[i]();
						}
					}
					else{
						this.set_timer(()=>{
							if(!double_right_click)
								this._me._rocket_package.require_launch_current_rocket_id();
						},300);
					}
				}
			});
			document.body.addEventListener("mousedown",(event)=> {
				event.preventDefault();
				if (event.button === 0){//left click
					const currentTime = new Date().getTime();
					const clickDelta = currentTime - lastClickTime;
					const isDoubleClick = clickDelta < 250; // Adjust the threshold as needed
					lastClickTime = currentTime;
					
					this._entities["_controls2"]._move.fire=true;
					if(isDoubleClick){
						//this.auto_key_down(32);//space
						this._me.perform_skill();
					    lock_sub_skill=true;
						this.add_to_timer(()=>{lock_sub_skill=false;},1);
					}
					//else
						//this._entities["_controls2"]._move.fire=true;
						
				}
				else if(event.button === 1){//click chuot giua
					
				}
				else{//right click
					
					const currentTime = new Date().getTime();
					const clickDelta = currentTime - lastClickTime2;
					const isDoubleClick = clickDelta < 250; // Adjust the threshold as needed
					lastClickTime2 = currentTime;
					//lastClickTime3 = currentTime;
					if(isDoubleClick){
						if(lock_sub_skill)return;
						this._me.perform_additional_skill();
						double_right_click=true;
						this.set_timer(()=>{
							double_right_click=false;
						},1000);
					}
					else{
						
					}
					
				}
				
			});
			}
			else{
				this.init_auto_mode();
			}
			
			document.body.addEventListener("wheel", (event)=> {
				event.preventDefault();
				var delta = event.deltaY;
				if (delta < 0) {
					this._me._rocket_package.next_rocket();
				} 
				else if (delta > 0) {
					this._me._rocket_package.prev_rocket();
				}
			});
			
			document.body.addEventListener("contextmenu",(event)=>{//prevent browser's popup menu on right click
				event.preventDefault();
			});
	}
	
	touchStartHandle(event){
		const touch=event.changedTouches[0];
	   const px = touch.clientX; 
	   const py = touch.clientY; 
		 //if(!this._last_mouse_pos){
		  // this._last_mouse_pos={x:px,y:py};
	    // }
		 this._last_mouse_pos={x:px,y:py};
	}
	touchMoveHandle(event){
	  const touch=event.changedTouches[0];
	   const px = touch.clientX; 
	   const py = touch.clientY; 
	   
	  
	   const _min=5;
	   let _deltaX=px-this._last_mouse_pos.x;
	   let _deltaY=py-this._last_mouse_pos.y;
	   
	   const _max_speed=0.2;
	   let _speedX=_max_speed*(_deltaX/8);
	   let _speedY=_max_speed*(_deltaY/8);
	  
	   if(_speedX<0)_speedX=-_speedX;
	   if(_speedY<0)_speedY=-_speedY;
	   if(_speedX>_max_speed)_speedX=_max_speed;
	   if(_speedY>_max_speed)_speedY=_max_speed;
	   
	   
	   this._entities["_controls2"]._speedX=_speedX;
	   this._entities["_controls2"]._speedY=_speedY;
	  
	   if(px>window.innerWidth-10||_deltaX>_min){
		   this.auto_key_down(68);//right
	   }
	   else{
		   this.auto_key_up(68);
	   }
	   if(px<10||_deltaX<-_min){
		   this.auto_key_down(65);//left
	   }
	   else{
		   this.auto_key_up(65);
	   }
	   if(py>window.innerHeight-10||_deltaY>_min){
		   this.auto_key_down(87);//down
	   }
	   else{
		   this.auto_key_up(87);
	   }
	   if(py<10||_deltaY<-_min){
		   this.auto_key_down(83);//up
	   }
	   else{
		   this.auto_key_up(83);
	   }
	   
	   //this._last_mouse_pos={x:px,y:py};
  }
	check_mouse_move(event){
	   const px = event.clientX; 
	   const py = event.clientY; 
	   const _min=1;
	   let _deltaX=event.movementX;
	   let _deltaY=event.movementY;
	   
	   
	   const _max_speed=this._mouse_speed;
	   let _speedX=_max_speed*(_deltaX/30);
	   let _speedY=_max_speed*(_deltaY/30);
	   
	   if(_speedX<0)_speedX=-_speedX;
	   if(_speedY<0)_speedY=-_speedY;
	   if(_speedX>_max_speed)_speedX=_max_speed;
	   if(_speedY>_max_speed)_speedY=_max_speed;
	 
	   this._entities["_controls2"]._speedX=_speedX;
	   this._entities["_controls2"]._speedY=_speedY;
	   
	   if(_deltaX>_min){
		   this.auto_key_down(68);//right
	   }
	   else{
		   this.auto_key_up(68);
	   }
	   if(_deltaX<-_min){
		   this.auto_key_down(65);//left
	   }
	   else{
		   this.auto_key_up(65);
	   }
	   if(_deltaY>_min){
		   this.auto_key_down(87);//down
	   }
	   else{
		   this.auto_key_up(87);
	   }
	   if(_deltaY<-_min){
		   this.auto_key_down(83);//up
	   }
	   else{
		   this.auto_key_up(83);
	   }
	   
	   //this._last_mouse_pos={x:px,y:py};
  }
	update_mouse(event){
	   const px = event.clientX; 
	   const py = event.clientY; 
	   
	   if(!this._last_mouse_pos){
		   this._last_mouse_pos={x:px,y:py};
	   }
	   const _min=1;
	   let _deltaX=px-this._last_mouse_pos.x;
	   let _deltaY=py-this._last_mouse_pos.y;
	  
	   const _max_speed=this._mouse_speed;
	   let _speedX=_max_speed*(_deltaX/40);
	   let _speedY=_max_speed*(_deltaY/40);
	   
	   if(_speedX<0)_speedX=-_speedX;
	   if(_speedY<0)_speedY=-_speedY;
	   if(_speedX>_max_speed)_speedX=_max_speed;
	   if(_speedY>_max_speed)_speedY=_max_speed;
	  
	   this._entities["_controls2"]._speedX=_speedX;
	   this._entities["_controls2"]._speedY=_speedY;
	   
	   if(px>window.innerWidth-100||_deltaX>_min){
		   this.auto_key_down(68);//right
	   }
	   else{
		   this.auto_key_up(68);
	   }
	   if(px<100||_deltaX<-_min){
		   this.auto_key_down(65);//left
	   }
	   else{
		   this.auto_key_up(65);
	   }
	   if(py>window.innerHeight-100||_deltaY>_min){
		   this.auto_key_down(87);//down
	   }
	   else{
		   this.auto_key_up(87);
	   }
	   if(py<100||_deltaY<-_min){
		   this.auto_key_down(83);//up
	   }
	   else{
		   this.auto_key_up(83);
	   }
	   
	   this._last_mouse_pos={x:px,y:py};
  }
	
	create_icon(_width,_height,_top,_left,_src,_fc1,_fc2){
		let _icon=document.createElement("img");
		_icon.style.position="absolute";
		_icon.style.width=_width;
		_icon.style.height=_height;
		_icon.style.top=_top;
		_icon.style.left=_left;
		_icon.src=_src;
		_icon.style.zIndex="999999";
		_icon.addEventListener("touchstart",function(event){
			event.preventDefault();
			_fc1();
		});
		_icon.addEventListener("touchend",function(event){
			event.preventDefault();
			_fc2();
		});
		document.body.appendChild(_icon);
		
		return _icon;
	};
	
	
  _ChangeMode(_ship_id,_ship_package){
	  this._before_init_player_ship_fc();
	 delete this._entities['_controls1'];
	 delete this._entities['_controls2'];
	 
	 const group = new THREE.Group();this._human_shape=group;this._human_gltf=group;
	 this._human_shape.visible=false;
	 this._ship_shape.visible=false;
	 
	  if(typeof this._human_entity =='undefined'){
		  //this._human_entity=new HumanEntity(
			//{model: this._human_shape, camera: this._graphics.Camera, game: this,
			//is_me:true,gltf_data:this._human_gltf});
	  }
	  if(typeof this._ship_entity =='undefined'){
		  
		  let _playerClass=this._unitMG.get_player_ship_class(this._unitMG._player_ship_id);
		  //if(this._unitMG._player_ship_id===1)_playerClass=PlayerShip1;//_ship_package truyen vao trong unit-mg.js
		  //if(this._unitMG._player_ship_id===2)_playerClass=PlayerShip2;
		  //if(this._unitMG._player_ship_id===3)_playerClass=PlayerShip3;
		  
		  this._ship_entity =new _playerClass(
          {model: this._ship_shape, 
		  camera: this._graphics.Camera, game: this,arrow:this._arrow,
		  ship_id:_ship_id,
		  is_me:true});
		  if(_ship_package){
			  this._ship_entity._ship_package=_ship_package;
			  this._ship_entity.apply_space_ship_level_package();//doi voi player ship thi phai goi them 1 lan nua vi set _ship_package sau khi init
			  //this._ship_entity._ship_package.set_ship_skills(['lighting','speed-up']);
			  this._ship_entity.init_skills();
			  //this._ship_entity.enable_passive_skill();
		  }
		  this._ship_entity.use_blaster_and_direction_custom();
		  this._ship_entity.init_skill_panel();
		  //this.create_arrow();
	  }
	  this._fps_mode=false;
	  if(this._fps_mode){
		  this._entities['player'] = this._ship_entity;
		  this._entities['_controls1'] = new controls.FPSControls({
			target: this._entities['player'],
			camera: this._graphics.Camera,
			scene: this._graphics.Scene,
			domElement: this._graphics._threejs.domElement,
			gui: this._gui,
			guiParams: this._guiParams,
			game:this
			});
		  return;
	  }
	 
	  if(this._ship_mode){
		    this._human_shape.visible=true;
			this._entities['player'] = this._human_entity;
			//this._entities['player']._model=this._human_shape;
			//this._entities['player']._params.model=this._human_shape;
			
			//if(!this._entities['_controls1'])
			this._entities['_controls1'] = new controls.HumanControls({
			target: this._entities['player'],
			camera: this._graphics.Camera,
			scene: this._graphics.Scene,
			domElement: this._graphics._threejs.domElement,
			gui: this._gui,
			guiParams: this._guiParams,
			game:this
			});
			
	  }
	  else{
		this._ship_shape.visible=true;
      this._entities['player'] = this._ship_entity;
	  //this._entities['player']._model=this._ship_shape;
		
	  //if(!this._entities['_controls2'])
      this._entities['_controls2'] = new controls.ShipControls({
        target: this._entities['player'],
        camera: this._graphics.Camera,
        scene: this._graphics.Scene,
        domElement: this._graphics._threejs.domElement,
        gui: this._gui,
        guiParams: this._guiParams,
		game:this
		});
		
		
	  }
	  
	  this._ship_mode=!this._ship_mode;
	  
	  this._me=this._entities['player'];//'player' mac dinh la ME(toi),neu tao friend hay enemy player thi phai lay ten khac
	  if(this.enable_items)this._me.equip_items();
	  this._me.enable_passive_skill();
	  
	  this._after_init_player_ship_fc();
  }
	
	auto_key_press(_keycode){
		var event = new KeyboardEvent('keypress', {
		keyCode: _keycode,
		which: _keycode,
		altKey: false,
		ctrlKey: false,
		shiftKey: false,
		metaKey: false,
		bubbles: true
		});

		var targetElement = document.body;
		targetElement.dispatchEvent(event);
	};
	auto_key_down(_keycode){
		var event = new KeyboardEvent('keydown', {
		keyCode: _keycode,
		which: _keycode,
		altKey: false,
		ctrlKey: false,
		shiftKey: false,
		metaKey: false,
		bubbles: true
		});

		var targetElement = document.body;
		targetElement.dispatchEvent(event);
	};
	auto_key_up(_keycode){
		var event = new KeyboardEvent('keyup', {
		keyCode: _keycode,
		which: _keycode,
		altKey: false,
		ctrlKey: false,
		shiftKey: false,
		metaKey: false,
		bubbles: true
		});

		var targetElement = document.body;
		targetElement.dispatchEvent(event);
	};
	
	 _keyDownHandle(event){
	  if(this._lock_controls)return;
	  if(this._ship_mode)
		this._entities['_controls2']._onKeyDown(event);
	  else
		if(this._entities['_controls1'])this._entities['_controls1']._onKeyDown(event);
	
	  //if(!this._key_mode)this._key_mode=1;
	
	  this.check_key_mode(event);
  }
  
  _keyUpHandle(event){
	  if(this._lock_controls)return;
	  if(this._ship_mode)
		this._entities['_controls2']._onKeyUp(event);
	  else
		this._entities['_controls1']._onKeyUp(event);
  }
  _keyPressHandle(event){
	  if(this._lock_controls)return;
	  if(this._ship_mode)
		this._entities['_controls2']._onKeyPress(event);
	  else
		this._entities['_controls1']._onKeyPress(event);
  }
  
  check_key_mode(event){
		  
		  if (event.key >= '0' && event.key <= '9')
			this._me._rocket_package.require_launch_rocket(parseInt(event.key));
		
	  }
	
	remove_sub_rocket_panel(){
		if(this._sub_rocket_panel&&this._sub_rocket_panel!=null){
			this._sub_rocket_panel.remove();
			this._sub_rocket_panel=null;
		}
	}
	
	init_auto_mode(){//auto attack
		const _unit=this._me;
		//let _counter=0;
		this.add_to_every_second_passes_fcs(()=>{
			/*
			_counter++;
			if(_counter!=1){
				if(_counter===3)//3 giay 1 lan
					_counter=0;
				return;
			}
			*/
			const _p1=_unit.Position;
			const _p2=_unit.getFrontPos(1500);
			//const _targets=this._game._unitMG.get_enemy_combat_unit_in_range_3(_unit,_p1,400);
			const _targets=this._unitMG.get_enemy_combat_unit_in_range(_p1,550);
			let _found_target=false;
			if(_targets!=null&&_targets.length>0){
				for(let i=0;i<_targets.length;i++){
					const _target=_targets[i][0];
					const _e_pos=_target.Position;
					//const _dis=parseInt(this._utils.distanceToLine(_p1,_p2,_e_pos));//console.log("Dis="+_dis);
					const _angle=this._utils.calculateAngleDeg(_p1,_p2,_e_pos);
					if(_angle<6){
						_found_target=true;
						break;
					}
				}
			}
			
			if(_found_target){
				this._entities["_controls2"]._move.fire=true;
				const _rand=this._utils.get_random_in_range(1,3);
				if(_rand===1)
					_unit._rocket_package.require_launch_current_rocket_id();
				if(_rand===2)
					_unit.perform_skill();
				if(_rand===3)
					_unit.perform_additional_skill();
				/*
				const _launch_rocket=_unit._rocket_package.require_launch_current_rocket_id();
				if(!_launch_rocket){
					const _perform_skill=_unit.perform_skill();
					if(!_perform_skill){
						const _sub_skill=_unit.perform_additional_skill();
						if(!_sub_skill){
							
						}
					}
				}
				*/
			}
			else{
				this._entities["_controls2"]._move.fire=false;
			}
		});
	}
	
	create_sub_rocket_panel(_fc){
		//this.init_mini_rocket_skill();
		
		this.remove_sub_rocket_panel();
		this._sub_rocket_panel=document.createElement("div");
		this._sub_rocket_panel.style.position="absolute";
		this._sub_rocket_panel.style.width="550px";
		this._sub_rocket_panel.style.height="50%";
		this._sub_rocket_panel.style.left="28%";
		this._sub_rocket_panel.style.top="20%";
		this._sub_rocket_panel.style.border="2px solid transparent";
		this._sub_rocket_panel.style.boxShadow="0 0 10px 5px #33BBFF";
		this._sub_rocket_panel.style.backgroundColor="rgba(20, 114, 234, 0.5)";
		this._sub_rocket_panel.style.zIndex="99999999999999999";
		
		
		this._root_div.appendChild(this._sub_rocket_panel);
		
		const _title=document.createElement("div");
			  _title.style.position="absolute";
			  _title.style.textAlign="center";
			  _title.style.color="white";
			  _title.style.top="0px";
			  _title.style.left="0px";
			  _title.style.width="100%";
			  _title.style.height="50px";
			  _title.style.background="rgba(0,0,0,0.4)";
			  _title.style.display="flex";
			  _title.style.justifyContent="center";
			  _title.style.alignItems="center";
			  _title.innerHTML=`
					<h1  style="
									background: linear-gradient(to bottom, red,white, yellow);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
									font-size: 24px;
									font-weight: bold;
									font-family: 'Orbitron', sans-serif;
				"'>
			  Select mini-rocket</h1>`;
		this._sub_rocket_panel.appendChild(_title);
		
		let _child_icon_list=new Array();
		const _width=60;
		const _height=_width;
		const _spX=_width+10;
		const _spY=_spX;
		const _fx=30;
		const _fy=75;
		let _px,_py;
		let _colID=0,_rowID=0;
		const _colNum=7;
		const _rowNum=3;
		const _num=_colNum*_rowNum;
		let _border_style_1="3px solid yellow";//premium
		let _border_style_2="3px solid white";//đã sở hữu
		let _border_style_3="3px solid orange";//đã sở hữu và đang sử dụng
		
		for(let i=0;i<_num;i++){
			_px=_fx+(_colID*_spX);
			_py=_fy+(_rowID*_spY);
			let _icon_container=document.createElement("div");
			_icon_container.style.position="absolute";
			_icon_container.style.width=_width+"px";
			_icon_container.style.height=_height+"px";
			_icon_container.style.left=_px+"px";
			_icon_container.style.top=_py+"px";
			_icon_container.style.backgroundImage="linear-gradient(-30deg, #000000 50%, #081a2b 50%)"
			
			const _mini_rocket_id=i+1;
			const _mini_rocket_infor=this._unitMG.get_sub_rocket_infor(_mini_rocket_id);
			if(_mini_rocket_infor!=null){
				const _id=_mini_rocket_infor.id;
				const _name=_mini_rocket_infor.name;
				const _img_path=_mini_rocket_infor.image_file_path;
				const _price=_mini_rocket_infor.price;
				const _ship_level=_mini_rocket_infor.ship_level;
				
				let _img=document.createElement("img");
				_img.src=_img_path;
				_img.style.width="100%";
				_img.style.height="100%";
				//_img.style.transform="scale(1.452)";
				_img.style.filter="brightness( 220% ) ";
				_img.style.border="black 1px solid";
				_img.style.borderRadius="10px";
				_icon_container.appendChild(_img);
				
				_img.style.border=_border_style_2;
				
				_icon_container.addEventListener("click",()=>{
					this.remove_sub_rocket_panel();
					this._me._rocket_package.enable_launch_sub_rocket(_mini_rocket_id);
					_fc();
				});
			}
			
			this._sub_rocket_panel.appendChild(_icon_container);
			_colID++;
			  if(_colID>=_colNum){
				_colID=0;
				_rowID++;
			  }
		}
	}  
}
export {SpaceShipGame}