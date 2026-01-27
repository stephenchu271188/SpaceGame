import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import { CSS2DRenderer, CSS2DObject } from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/renderers/CSS2DRenderer.js';

import {Utils} from './units/utils.js';
import {UnitLevelMG} from './units/unit-level-mg.js';
import {Menu} from './show-room-menu.js';
import {ChildrenShipPanel} from './show-room-children-ship-panel.js';
import {ShipPackage} from './ship-package.js';
import {ShowRoomRocketPanel} from './show-room-rocket-panel.js';
import {ShowRoomItemPanel} from './show-room-item-panel.js';
import {ShowRoomArmourPanel} from './show-room-armour-panel.js';

import {SoundManager} from './sound-manager.js';

import {Teleport1} from './effects/teleport-1.js';
import {Sparks1} from './units/skills/spark-1.js';

var _lock_all_buttons=false;

class ShowRoom{
	constructor(params){
		this._params=params;
		this._game=params.game;
		
		this._levelMG=new UnitLevelMG({game:this._game});
		
		this._focus_id=0;
		
		//this._unit_create_fc=new Array();
		this._unit_list=new Array();
		
		this.create_unit_infor_list();
		
		this._move_speed=15;
		this._error=3;//sai số
		
		this._show_room_sound=new SoundManager({game:this});
		this._show_room_sound.load_sounds(
			[
				{ id: 'drum1', url: './resources/audio/drum.mp3' },
				{ id: 'sucess1', url: './resources/audio/tada-military-2-183973.mp3' },
				{ id: 'sucess2', url: './resources/audio/success_bell-6776.mp3' },
				{ id: 'click1', url: './resources/audio/mixkit-classic-click-1117.wav' },
				{ id: 'click2', url: './resources/audio/mixkit-camera-shutter-click-1133.wav' },
				{ id: 'click3', url: './resources/audio/pen-click-99025.mp3' },
				{ id: 'click4', url: './resources/audio/zapsplat_vehicles_car_indicator_switch_click_110106.mp3' },
				{ id: 'fail1', url: './resources/audio/zapsplat_multimedia_alert_ui_marimba_warm_short_musical_tone_notify_prompt_reminder_114191.mp3' },
			]
		);
		
		//this._unit_create_fc.push(this._game._unitMG.create_enemy_combat_ship_level_1_style_1);
		//this._unit_create_fc.push(this._game._unitMG.create_enemy_combat_ship_level_1_style_2);
		//this._unit_create_fc.push(this._game._unitMG.create_enemy_combat_ship_level_2_style_1);
		
		this._prev_btn=document.getElementById("arrow1");
		this._next_btn=document.getElementById("arrow2");
		this._play_btn=document.getElementById("play-btn");
		this._play_btn.classList.add("neonGlowBtn");
		this._play_btn.style.bottom="130px";
		this._play_btn.style.right="360px";
		
		this._play_btn.style.transform="scale(0.8,0.8)";
		this._play_btn.style.fontFamily="'Orbitron', sans-serif";
		this._play_btn.style.color="white";
		
		/*
		let _ship_arrow=this.show_arrow(this._prev_btn,"-60px","0px");
								this._game.add_to_timer(()=>{
									_arrow.remove();
								},9);
		*/
		//this._rocket_btn=document.getElementById("rocket-package");
		this._root_container=document.getElementById("root-container");
		this._unclock_btn=document.getElementById("unlock-btn");
		this._unclock_btn.classList.add("neonGlowBtn");
		this._unclock_btn.style.color="white";
		this._unclock_btn.style.fontFamily="'Orbitron', sans-serif";
		this._unclock_btn.style.transform="scale(0.8,0.8)";
		//transform:  skewX(-20deg) scale(1.0);
		this._rocket_btn=document.createElement("button");
		this._rocket_btn.classList.add("btn","fifth2");
		this._rocket_btn.style.top="230px";
		this._rocket_btn.style.left="330px";
		this._rocket_btn.style.transform="skewX(-20deg) scale(1.0)";
		this._rocket_btn.style.fontFamily="'Orbitron', sans-serif";
		this._rocket_btn.style.color="red";
		//this._rocket_btn.style.visibility="hidden";
		this._rocket_btn.textAlign="center";
		this._rocket_btn.innerHTML="Rocket";
		document.getElementById("root-container").appendChild(this._rocket_btn);
		this.add_btn_icon(this._rocket_btn,"./resources/icons/missile-2.png");
		
		this._armour_btn=document.createElement("button");
		this._armour_btn.classList.add("btn","fifth2");
		this._armour_btn.style.top="260px";
		this._armour_btn.style.left="330px";
		//this._armour_btn.style.visibility="hidden";
		this._armour_btn.style.transform="skewX(-20deg) scale(1.0)";
		this._armour_btn.style.fontFamily="'Orbitron', sans-serif";
		this._armour_btn.style.color="yellow";
		this._armour_btn.textAlign="center";
		this._armour_btn.innerHTML="Armour";
		document.getElementById("root-container").appendChild(this._armour_btn);
		this.add_btn_icon(this._armour_btn,"./resources/icons/shield-2.png");
		
		this._item_btn=document.createElement("button");
		this._item_btn.classList.add("btn","fifth2");
		this._item_btn.style.top="290px";
		this._item_btn.style.left="330px";
		this._item_btn.style.transform="skewX(-20deg) scale(1.0)";
		this._item_btn.style.fontFamily="'Orbitron', sans-serif";
		//this._item_btn.style.visibility="hidden";
		this._item_btn.textAlign="center";
		this._item_btn.innerHTML="&nbsp;&nbsp;Items&nbsp;&nbsp;&nbsp;";
		document.getElementById("root-container").appendChild(this._item_btn);
		this.add_btn_icon(this._item_btn,"./resources/icons/exp1.png");
		
		this._add_skill_btn=document.createElement("button");
		this._add_skill_btn.classList.add("btn","fifth2");
		this._add_skill_btn.style.top="140px";
		this._add_skill_btn.style.right="-830px";
		this._add_skill_btn.style.transform="skewX(-20deg) scale(1.0)";
		this._add_skill_btn.style.fontFamily="'Orbitron', sans-serif";
		this._add_skill_btn.style.color="orange";
		//this._add_skill_btn.style.visibility="hidden";
		this._add_skill_btn.textAlign="center";
		this._add_skill_btn.innerHTML="S - Skill";
		document.getElementById("root-container").appendChild(this._add_skill_btn);
		this.add_btn_icon(this._add_skill_btn,"./resources/icons/laser-cannon.png");
		
		this._pass_skill_btn=document.createElement("button");
		this._pass_skill_btn.classList.add("btn","fifth2");
		this._pass_skill_btn.style.top="170px";
		this._pass_skill_btn.style.right="-830px";
		this._pass_skill_btn.style.transform="skewX(-20deg) scale(1.0)";
		this._pass_skill_btn.style.fontFamily="'Orbitron', sans-serif";
		//this._pass_skill_btn.style.visibility="hidden";
		this._pass_skill_btn.textAlign="center";
		this._pass_skill_btn.innerHTML="P - Skill";
		//document.getElementById("root-container").appendChild(this._pass_skill_btn);
		//this.add_btn_icon(this._pass_skill_btn,"./resources/icons/p-skill-1.png");
		
		
		this._left_item=document.createElement("button");
		this._left_item.classList.add("btn","fifth2");
		this._left_item.style.top="170px";
		this._left_item.style.right="-830px";
		this._left_item.style.transform="skewX(-20deg) scale(1.0)";
		this._left_item.style.fontFamily="'Orbitron', sans-serif";
		this._left_item.style.color="white";
		//this._left_item.style.visibility="hidden";
		this._left_item.textAlign="center";
		this._left_item.innerHTML="Left-Wing";
		document.getElementById("root-container").appendChild(this._left_item);
		this.add_btn_icon(this._left_item,"./resources/icons/wing-ship-3.png");
		
		
		this._right_item=document.createElement("button");
		this._right_item.classList.add("btn","fifth2");
		this._right_item.style.top="200px";
		this._right_item.style.right="-830px";
		//this._right_item.style.visibility="hidden";
		this._right_item.style.transform="skewX(-20deg) scale(1.0)";
		this._right_item.style.fontFamily="'Orbitron', sans-serif";
		this._right_item.style.color="white";
		this._right_item.textAlign="center";
		this._right_item.innerHTML="Right-Wing";
		document.getElementById("root-container").appendChild(this._right_item);
		this.add_btn_icon(this._right_item,"./resources/icons/wing-ship-4.png");
		
		//this._game._graphics.enable_CSS2D_Renderer(this._root_container);
		//const _labelRenderer=this._game._graphics.enable_CSS2D_Renderer(this._root_container);
		const _game_id=parseInt(localStorage.getItem('DiscoveryModeGameID'));
		
		if(_game_id===1)
			this._game_page="planet-defend.html";
		if(_game_id===2)
			this._game_page="index-3.html";
		if(_game_id===3)
			this._game_page="mouse-controlled-game.html";
		if(_game_id===4)
			this._game_page="index-4.html";
		if(_game_id===5)
			this._game_page="index-5.html";
		if(_game_id===6)
			this._game_page="index-1.html";
		
		this._lock=false;
		this._next_btn.addEventListener("click",()=>{
			this._show_room_sound.play('click4');
			if(_lock_all_buttons)return;
			this.next();
		});
		this._prev_btn.addEventListener("click",()=>{
			this._show_room_sound.play('click4');
			if(_lock_all_buttons)return;
			this.prev();
		});
		this._play_btn.addEventListener("click",()=>{
			this._show_room_sound.play('click1');
			if(_lock_all_buttons)return;
			localStorage.setItem('player-ship-id', this.get_focus_ship_id());
			if(this._ship_package.get_additional_skill_num()===0){
				this.change_effect(this._add_skill_btn,true);
				this._game.createMessageBox("Alert","The ship is not equipped with any sub skills!");
				return;
			}
			
			this._ship_package.save_data();
			//alert(this._get_player_ship_used_number(this.get_focus_ship_id()));
			this._record_one_more_use_ship_id(this.get_focus_ship_id());
			//alert(this._get_player_ship_used_number(this.get_focus_ship_id()));
			
			document.getElementById("root-container").style.visibility="hidden";
			document.getElementById("root-container").remove();
			setTimeout(()=>{
				window.location.href=this._game_page;
			},2000);
			
		});
		
		let _rocket_click_event=()=>{
			this._show_room_sound.play('click1');
			if(!this._game._warehouse.have_player_ship(this.get_focus_ship_id()))return;
			if(_lock_all_buttons)return;
			if(this._rocket_panel)this._rocket_panel.clear_panel();
			this._rocket_panel=new ShowRoomRocketPanel({game:this._game,ship_package:this._ship_package});
			this._rocket_panel.init();
		};
		this._rocket_btn.addEventListener("click",_rocket_click_event);
		this._rocket_btn.effect_div.addEventListener("click",_rocket_click_event);
		this._rocket_btn.effect_div_icon.addEventListener("click",_rocket_click_event);
		
		let _armour_click_event=()=>{
			this._show_room_sound.play('click1');
			if(!this._game._warehouse.have_player_ship(this.get_focus_ship_id()))return;
			if(_lock_all_buttons)return;
			if(this._armour_panel)this._armour_panel._remove();
			this._armour_panel=new ShowRoomArmourPanel({game:this._game,ship_package:this._ship_package});
			this._armour_panel.init();
		};
		this._armour_btn.addEventListener("click",_armour_click_event);
		this._armour_btn.effect_div.addEventListener("click",_armour_click_event);
		this._armour_btn.effect_div_icon.addEventListener("click",_armour_click_event);
		
		let _item_click_event=()=>{
			this._show_room_sound.play('click1');
			if(!this._game._warehouse.have_player_ship(this.get_focus_ship_id()))return;
			if(_lock_all_buttons)return;
			if(this._item_panel)this._item_panel._remove();
			this._item_panel=new ShowRoomItemPanel({game:this._game,ship_package:this._ship_package});
			this._item_panel.init();
		};
		this._item_btn.addEventListener("click",_item_click_event);
		this._item_btn.effect_div.addEventListener("click",_item_click_event);
		this._item_btn.effect_div_icon.addEventListener("click",_item_click_event);
		
		let _skill_click_event=()=>{
			this._show_room_sound.play('click1');
			if(this._game._warehouse.have_player_ship(this.get_focus_ship_id()))
				this.create_additional_skills_list();
		};
		this._add_skill_btn.addEventListener("click",_skill_click_event);
	    this._add_skill_btn.effect_div.addEventListener("click",_skill_click_event);
	    this._add_skill_btn.effect_div_icon.addEventListener("click",_skill_click_event);		
		
		
		this._pass_skill_btn.addEventListener("click",()=>{
			this._show_room_sound.play('click1');
			if(this._game._warehouse.have_player_ship(this.get_focus_ship_id()))
				this.create_passive_skills_list();
		});	
		
		let _left_item_click_event=()=>{
			this._show_room_sound.play('click1');
			if(this._game._warehouse.have_player_ship(this.get_focus_ship_id()))
				this._show_child_list(1);
		};
		this._left_item.addEventListener("click",_left_item_click_event);
		this._left_item.effect_div.addEventListener("click",_left_item_click_event);
		this._left_item.effect_div_icon.addEventListener("click",_left_item_click_event);
		
		let _right_item_click_event=()=>{
			this._show_room_sound.play('click1');
			if(this._game._warehouse.have_player_ship(this.get_focus_ship_id()))
				this._show_child_list(2);
		};
		this._right_item.addEventListener("click",_right_item_click_event);
		this._right_item.effect_div.addEventListener("click",_right_item_click_event);
		this._right_item.effect_div_icon.addEventListener("click",_right_item_click_event);
			
		this._unit_speed=document.getElementById("unit-speed");
		this._unit_hp=document.getElementById("unit-hp");
		this._unit_damage=document.getElementById("unit-dam");
		this._unit_fire_rate=document.getElementById("unit-fire-rate");
		
		//this._default_weapon_btn=document.getElementById("default-weapon");
		//this._default_weapon_btn.addEventListener("click",()=>{
			//this._enable_default_weapon=!this._enable_default_weapon;
		//});
		this._enable_default_weapon=false;
		
		this._menu=new Menu({game:this._game,container:this._root_container});
	
		this.reset_ship_package();
		
		this.check_status();
		
		this.on_window_resize();
		window.addEventListener("resize", this.on_window_resize);
		
		this._game.add_to_update_function_list(()=>{
			if((this._rocket_panel&&this._rocket_panel!=null&&this._rocket_panel instanceof Node&&this._root_container.contains(this._rocket_panel))||
			(this._child_list_container&&this._child_list_container!=null&&this._child_list_container instanceof Node&&this._root_container.contains(this._child_list_container))
			||(this._additional_skills_panel&&this._additional_skills_panel!=null&&this._additional_skills_panel instanceof Node&&this._root_container.contains(this._additional_skills_panel))
			||(this._armour_panel&&this._armour_panel!=null&&this._armour_panel instanceof Node&&this._root_container.contains(this._armour_panel))
			||(this._item_panel&&this._item_panel!=null&&this._item_panel instanceof Node&&this._root_container.contains(this._item_panel))){
				_lock_all_buttons=true;
			}
			else{
				_lock_all_buttons=false;
			}
		});
		
		//this.create_ship_name_list();
		
		/*
			Su dung de thong bao khi skill moi cua 1 ship nao do da duoc kich hoat
			Chi thong bao 1 lan ko thong bao lai
		*/
		let _notic_add_skill_data_name="showroom-add-skill-notic-data";
		let _notic_data=this._game.get_data_in_database(_notic_add_skill_data_name);
		let _reset_notic_data=()=>{
			_notic_data=new Array();
			this._game.update_data_in_database(_notic_add_skill_data_name,_notic_data);
		};
		if(_notic_data===null){
			_reset_notic_data();
		}
		this._add_noticed_skill_id=(_ship_id,_skill_id)=>{
			for(let i=0;i<_notic_data.length;i++){
				if(_notic_data[i].ship_id===_ship_id&&_notic_data[i].skill_id===_skill_id)
					return false;
			}
			_notic_data.push({ship_id:_ship_id,skill_id:_skill_id});
			this._game.update_data_in_database(_notic_add_skill_data_name,_notic_data);
			
			return true;
			
		};
		//-----------------------------
		/*THONG TIN SO' LAN SU DUNG CAC LOAI SHIP*/
		let _ship_usage_data_name="playership-usage-data";
		let _ship_usage_data=this._game.get_data_in_database(_ship_usage_data_name);
		let _reset_ship_usage_data=()=>{
			_ship_usage_data=new Array();
			this._game.update_data_in_database(_ship_usage_data_name,_ship_usage_data);
		};
		if(_ship_usage_data===null){
			_reset_ship_usage_data();
		}
		this._get_player_ship_used_number=(_ship_id)=>{
			for(let i=0;i<_ship_usage_data.length;i++){
				if(_ship_usage_data[i].ship_id===_ship_id)
				{
					return _ship_usage_data[i].uses_number;
					
				}
			}
			return 0;
		};
		this._record_one_more_use_ship_id=(_ship_id)=>{
			let _found=false;
			for(let i=0;i<_ship_usage_data.length;i++){
				if(_ship_usage_data[i].ship_id===_ship_id)
				{
					_ship_usage_data[i].uses_number++;
					_found=true;
					break;
				}
			}
			if(!_found)
				_ship_usage_data.push({ship_id:_ship_id,uses_number:1});
			this._game.update_data_in_database(_ship_usage_data_name,_ship_usage_data);
			
			return;
			
		};
		//-----------------------------
		/*
		let _notic_new_ship_data_name="showroom-new-ship-notic-data";
		let _notic_data_2=this._game.get_data_in_database(_notic_new_ship_data_name);
		let _reset_notic_data_2=()=>{
			_notic_data_2=new Array();
			this._game.update_data_in_database(_notic_new_ship_data_name,_notic_data_2);
		};
		if(_notic_data_2===null){
			_reset_notic_data_2();
		}
		this._add_noticed_new_ship=(_ship_id)=>{
			for(let i=0;i<_notic_data_2.length;i++){
				if(_notic_data_2[i].ship_id===_ship_id)
					return false;
			}
			_notic_data_2.push({ship_id:_ship_id});
			this._game.update_data_in_database(_notic_new_ship_data_name,_notic_data_2);
			
			return true;
			
		};
		*/
		//-----------------------------
		
		let _update_infor_counter=0;
		let _update_player_infor=()=>{
			_update_infor_counter++;
			if(_update_infor_counter===4){
				this.show_player_infor();
				_update_infor_counter=0;
			}
			this._game.add_to_timer(()=>{
				_update_player_infor();
			},1);
		};
		_update_player_infor();
	}
	
	create_ship_name_list(){
		if(this._ship_names_panel&&this._ship_names_panel!=null)
			this._ship_names_panel.remove();
		let _ship_id=this.get_focus_ship_id();
		//alert(_ship_id);
		let _container=document.createElement("div");
		_container.style.cssText=`
			position:absolute;
			bottom:10px;
			right:20px;
			width:200px;
			height:250px;
			overflow:visible;
			font-size:16px;
			color:white;
			display: flex;
			flex-direction: column;
			align-items: left; 
		`;
		//let _lock_mouse=false;
		for(let i=0;i<this._unit_list.length;i++){
			let _id=this._unit_list[i][0];
			let _name=this._game._unitMG.get_player_ship_name(_id);
			let _line=document.createElement("div");
				_line.style.display="flex";
				
				_line.addEventListener("click",()=>{
					if(this._lock)return;
					//if(_lock_mouse)return;
					//_lock_mouse=true;
					//this._game.add_to_timer(()=>{_lock_mouse=false;},3);
					
					this.move_to(_id-1);
					
					this._finish_move_fc=()=>{
						this.reset_ship_package();
						this.update_data();
						this.load_player_ship_model();
					};
				});
			
			let _icon=document.createElement("div");
				_icon.style.width="25px";
				_icon.style.height="25px";
				//_icon.style.overflow="visible";
			let _icon_img=document.createElement("img");
				_icon_img.style.width="100%";
				_icon_img.style.height="100%";
				
				_line.appendChild(_icon);
				_icon.appendChild(_icon_img);
			if(this._game._warehouse.have_player_ship(_id)){
				_icon_img.src="./resources/icons/lock-2.png";
				_line.style.color=`#CDCCFF`;
				_line.style.textShadow=`5px 5px 100px #4C4C99`;
			}
			else{
				_icon_img.src="./resources/icons/lock-3.png";
				_line.style.color=`gray`;
				let _current_rank=this._game.get_player_level();
				let _rank_require=this._game._unitMG.get_player_ship_level_require(_id);//alert(_current_rank+"--"+_rank_require);
				if(_current_rank>=_rank_require){
					//alert("FOUND");
					//let _not_noticed=null;
					//_not_noticed=this._add_noticed_new_ship(_id);alert(_not_noticed);
					//if(_not_noticed===true){
							let _zoom=false;
							let _zoom_fc=()=>{
								if(!_zoom){
									_line.style.transform="scale(1.2)";
								}
								else{
									_line.style.transform="scale(1.0)";
								}
								_zoom=!_zoom;
							};
						this._game.add_to_function_list_4(_zoom_fc);
						this._game.add_to_timer(()=>{
							this._game.remove_function_from_list_4(_zoom_fc);
							_line.style.transform="scale(1.0)";
						},9);
					//}
				}
				
			}
			    _line.innerHTML+=`<i>`+_name+`</i>`;
			_container.appendChild(_line);
			//alert("ShipID:"+_id);
			if(_ship_id===_id){//alert("FOUND");
				let _arrow=document.createElement("img");
					_arrow.style.position="absolute";
					//_arrow.style.top="0px";
					_arrow.style.left="-30px";
					_arrow.style.width="30px";
					_arrow.style.height="30px";
					_arrow.src="./resources/gif/arrow-2.gif";
					_line.appendChild(_arrow);
			}
		}
		
		this._root_container.appendChild(_container);
		
		this._ship_names_panel=_container;
	}
	
	show_player_infor(){
		if(this._infor_div&&this._infor_div!=null)
			this._infor_div.remove();
		let _infor_div=document.createElement("div");
		this._infor_div=_infor_div;
		
		_infor_div.style.cssText=`
			position:absolute;
			top:100px;
			right:90px;
			width:150px;
			height:100px;
			overflow:visible;
		`;
		let _text_css=`
			background: linear-gradient(to bottom, yellow,white, yellow);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			font-size: 20px;
			font-weight: bold;
			font-family: 'Orbitron', sans-serif;
		`;
		let _text_css_1=`
			background: linear-gradient(to bottom, turquoise,white, yellow);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			font-size: 20px;
			font-weight: bold;
			font-family: 'Orbitron', sans-serif;
		`;
		let _text_css_2=`
			background: linear-gradient(to bottom, red,white, yellow);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			font-size: 20px;
			font-weight: bold;
			font-family: 'Orbitron', sans-serif;
		`;
		this._root_container.appendChild(_infor_div);
		_infor_div.innerHTML=`
			<i style="`+_text_css_1+`">
				Cash:
			</i>
			<i style="`+_text_css+`">
				`+this._game._root_inventory.GetCash()+`$
			</i>
			<br/>
			<i style="`+_text_css_2+`">
				Rank:
			</i>
			<i style="`+_text_css+`">
				`+this._game.get_player_level()+`
			</i>
		`;
	}
	
	change_effect_2(_btn,_special){
		if(!_btn.effect_div){
			let _div=document.createElement("div");
			_div.style.position="absolute";
			_div.style.width="44px";
			_div.style.height="44px";
			//_div.style.top="50px";
			//_div.style.left="10px";
			const rect = _btn.getBoundingClientRect();//get absolute position
			//_div.style.left=parseInt(rect.left + window.scrollX)+"px";
			//_div.style.top=parseInt(rect.top + window.scrollY)+"px";
			/*
				Chua tim duoc cach lay vi tri chin'h xac nen su dung cach nay
			*/
			_div.style.top="510px";
			_div.style.left="450px";
			this._root_container.appendChild(_div);
			_btn.effect_div=_div;
		}
		this.change_effect(_btn,_special);
	}
	change_effect(_btn,_special){
		
		if(_special===true){
			if(_btn.effect_div.closest("pulsating-circle")) return;//da add class roi
			_btn.effect_div.classList.remove("box");
			_btn.effect_div.classList.add("pulsating-circle");
			let _fc=()=>{
				this.change_effect(_btn,false);
				_btn.removeEventListener("click",_fc);
				//_btn.effect_div.removeEventListener("click",_fc);
			};
			_btn.addEventListener("click",_fc);
			try{
			_btn.effect_div.addEventListener("click",_fc);
			_btn.effect_div_icon.addEventListener("click",_fc);
			}catch(e){}
			//_btn.effect_div.addEventListener("click",_fc);
		}
		else{
			_btn.effect_div.classList.add("box");
			_btn.effect_div.classList.remove("pulsating-circle");
		}
	}
	
	show_arrow(_element,_x,_y){
		let _div=document.createElement("div");
			_div.style.position="absolute";
			_div.style.top=_x;
			_div.style.left=_y;
			_div.innerHTML=`<img src="./resources/gif/arrow-2.gif" width=70 height=40 
							style="transform:rotate(90deg);"/>`;
			
		_element.appendChild(_div);
		
		return _div;
	}
	
	add_btn_icon(_btn,_img_src){
		const _w1=44;
		const _t1=-10;
		const _l1=-30;
		const _w2=_w1-4;
		const _t2=_t1+2;
		const _l2=_l1+2;
		
		const _btn_pos=this.getAbsolutePosition(_btn);
		
		let _container=document.createElement("div");
			_container.style.position="absolute";
			_container.style.width=_w1+"px";
			_container.style.height=_w1+"px";
			//_container.style.top=_t1+"px";
			//_container.style.left=_l1+"px";
			
			_container.style.top=(_btn_pos.y+_t1)+"px";
			_container.style.left=(_btn_pos.x+_l1)+"px";
			
			_container.classList.add("box");
			//_container.classList.add("pulsating-circle");
		
		let _icon=document.createElement("div");
			_icon.style.backgroundImage="url('"+_img_src+"')";
			_icon.style.filter="brightness( 200% ) ";
			
			_icon.style.backgroundSize="cover";
			_icon.style.backgroundPosition="center";
			_icon.style.backgroundRepeat="no-repeat";
			_icon.style.borderRadius="50px";
			
			_icon.style.position="absolute";
			_icon.style.width=_w2+"px";
			_icon.style.height=_w2+"px";
			
			
			
			//_icon.style.top=_t2+"px";
			//_icon.style.left=_l2+"px";
			_icon.style.top=(_btn_pos.y+_t2)+"px";
			_icon.style.left=(_btn_pos.x+_l2)+"px";
			
			_btn.style.overflow="visible";
			//_btn.appendChild(_container);
			//_btn.appendChild(_icon);
			document.getElementById("root-container").appendChild(_container);
			document.getElementById("root-container").appendChild(_icon);
			
			this.moveElementBelow(_btn,_container);
			this.moveElementBelow(_btn,_icon);
			
			_btn.effect_div=_container;
			_btn.effect_div_icon=_icon;
	}
	moveElementBelow(elA, elB) {//dat elA nam duoi' elB
  // Lấy computed z-index của elB
  const zIndexB = window.getComputedStyle(elB).zIndex;

  // Xử lý trường hợp z-index không hợp lệ (auto, none, etc.)
  const zB = isNaN(parseInt(zIndexB)) ? 0 : parseInt(zIndexB);

  // Đảm bảo cả hai đều có position (z-index không hoạt động nếu position là static)
  if (window.getComputedStyle(elA).position === "static") {
    elA.style.position = "relative";
  }

  // Đặt elA thấp hơn elB
  elA.style.zIndex = zB - 1;
}
	getAbsolutePosition(element) {//lay toa vi tuyet doi
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY
  };
}
	set_move_speed(x){
		this._move_speed=x;
	}
	set_error(x){
		this._error=x;
	}
	
	create_unit_infor_list(){
		this._unit_list.push([1,null,null]);//[id,unit,database id]
		this._unit_list.push([2,null,null]);
		this._unit_list.push([3,null,null]);
		this._unit_list.push([4,null,null]);
		this._unit_list.push([5,null,null]);
	}
	
	on_window_resize(){
		let _root=document.getElementById("root-container");
		let _windowW=window.innerWidth;
		let _windowH=window.innerHeight;
		
		const _standardW=1280;
		const _standardH=596;
		
		_root.style.width=_standardW+"px";
		_root.style.height=_standardH+"px";
		_root.style.transformOrigin = "top left";
		
		const _sclX=_windowW/_standardW;
		const _sclY=_windowH/_standardH;
		
		_root.style.transform = "scaleX("+_sclX+") scaleY("+_sclY+")";
	}
	get_focus_ship(){
		return this._unit_list[this._focus_id][1];
	}
	get_focus_ship_id(){
		return this._focus_id+1;
	}
	reset_ship_package(){
		//const _unit=this._unit_list[this._focus_id][1];
		this._ship_package=new ShipPackage({game:this._game});
		//_unit._ship_package=new ShipPackage();
		const _rs=this._ship_package.load_data(this.get_focus_ship_id());
		
		if(_rs===true){
			
		}
		else{
			//alert("Not Found");
		}
		if(this.get_focus_ship_id()===1&&this._game._warehouse.have_player_ship(this.get_focus_ship_id())){
			let _first_use=this._ship_package.get_data()["first-play"];
			if(typeof _first_use==='undefined'||_first_use===null){//Đăng nhập lần đầu
				this._ship_package.set_rocket_num(1,this._game._parameters._first_login_rocket1_num);
				this._ship_package.set_rocket_num(2,this._game._parameters._first_login_rocket2_num);
				this._ship_package.set_rocket_num(3,this._game._parameters._first_login_rocket3_num);
				
				this._ship_package.add_ship_additional_skill(1);
				this._ship_package.use_additional_skill(1);
				 
				this._ship_package.set_value("first-play",false);
				this._ship_package.save_data();
			}
		}
	}
	
	init(_fc){
		const _distance=20;
		this._distance=_distance;
		const _tpos=new THREE.Vector3();
		_tpos.copy(this._game._graphics.Camera.position);
		_tpos.x+=10;
		_tpos.y-=10;
		for(let i=0;i<this._unit_list.length;i++){
			const _id=this._unit_list[i][0];//type id
			const _ship_id=this._unit_list[i][2];//(database id) Neu ko co' thi gia tri se la undefined(show-room-1 ko su dung cai nay)
			const _next_pos=_tpos.clone();
			_next_pos.z+=(i*_distance);
			
			//let _eunit=this.create_unit_by_id(_id,_next_pos,_ship_id);
			let _eunit=this._game._unitMG.create_empty_player_ship(_id,_next_pos,null);
			
			_eunit.apply_space_ship_level_package();
			
			_eunit.TakeDamage=(dmg)=>{};//để ko bắn trúng và tiêu diệt nhau khi đang show
			_eunit._my_id=i;
			this._unit_list[i][1]=_eunit;
			
			_eunit.CheckTarget=()=>{};
			_eunit._params.shoot_delay=0.1;
			setTimeout(()=>{
				_eunit._controller._lock=true;//nếu ko lock thì ship sẽ tự động xoay
				_eunit._model.rotation.set(0,0,0);
				this.load_player_ship_model();
			},100);
			this._game._graphics.Scene.add(_eunit._model);
			this._game._graphics.Camera.lookAt(_tpos);
		
			this._game.add_to_update_function_list((timeInSeconds)=>{
				//try{
				//_eunit._model.rotation.x+=timeInSeconds*0.3;
				
				_eunit._model.rotation.y+=timeInSeconds*0.3;
				return;
				if(_eunit._my_id===this._focus_id)
					if(this._enable_default_weapon)
						_eunit.Fire();
				//}catch(e){alert(e.stack);}
			});
		}
		
		this.update_data();
		
		if(_fc&&_fc!=null)_fc();
	}
	
	create_unit_by_id(_id,_next_pos,_ship_id){
		let _eunit;
		
			if(_id===1)
				_eunit=this._game._unitMG.create_player_ship(1,_next_pos);
				//_eunit=this._game._unitMG.create_enemy_combat_ship_level_1_style_1(_next_pos,null);
			if(_id===2)
				_eunit=this._game._unitMG.create_player_ship(2,_next_pos);
				//_eunit=this._game._unitMG.create_enemy_combat_ship_level_1_style_2(_next_pos,null);
			if(_id===3)
				_eunit=this._game._unitMG.create_player_ship(3,_next_pos);
			if(_id===4)
				_eunit=this._game._unitMG.create_player_ship(4,_next_pos);
			if(_id===5)
				_eunit=this._game._unitMG.create_player_ship(5,_next_pos);
			
			_eunit.init_skills();
			//this.add_label(_eunit);
			//alert("Class:"+_eunit.constructor.name);
		
		return _eunit;
	}
	
	update_data(){
		this._ship_package.upgrade_level();
		this.show_infor();
		this.create_ship_name_list();
		
		this.change_effect(this._item_btn,false);
		this.change_effect(this._rocket_btn,false);
		this.change_effect(this._add_skill_btn,false);
		this.change_effect(this._armour_btn,false);
		this.change_effect(this._left_item,false);
		this.change_effect(this._right_item,false);
		
		//this.check_usage_notice();
		
		let _unit=this._unit_list[this._focus_id][1];
		_unit._ship_package=this._ship_package;
	   //alert(_unit.constructor.name);
		const _width="240px";
		const _height="60px";
		let _style="width:"+_width+";height:"+_height+";margin-left:1px;";
			_style+="border-radius: 0px;";
			_style+="transform:  skewX(-20deg) scale(0.75);"; /* Nghiêng nút để tạo cảm giác hình thoi */
			_style+="border:0px solid #0ff;;";
			//_style+="filter:brightness( 190% );";
			//_style+="border-image:linear-gradient(45deg, #e5330c, #3333ff) 1;";
		
		if(this._skills_container){
			this._skills_container.remove();
		}
		this._skills_container=document.createElement("div");
		this._skills_container.classList.add("demo-controls");
		this._skills_container.style.bottom="0px";
		this._skills_container.style.left="80px";
		//this._skills_container.style.transform="scale(0.7);";
		
		document.getElementById("root-container").appendChild(this._skills_container);
		const _skills_div=this._skills_container;
		//;border-left: 2px solid #0ff;
		let _neon_style_1=`
			
		`;
		let _neon_style_2=`
			
		`;
		
		_skills_div.innerHTML="";
		_skills_div.innerHTML+=`
			<div style="`+_neon_style_1+`">
			<xgui-button style="`+_style+`" id="default-weapon" display-name="Weapon" effect-self="laser gun"></xgui-button>
			</div>
		`;
		//<xgui-button style="`+_style+`" id="shoot-me" display-name="Engine" effect-self="rocket propulsion"></xgui-button>
		let _skills_infor=_unit.get_main_skill_ids_and_names();
		for(let i=0;i<_skills_infor.length;i++){
			let _skill_id=_skills_infor[i].id;
			let _skill=_skills_infor[i].name;
			let _div_style=``;
			if(i===_skills_infor.length-1)
				_div_style=_neon_style_2;
			_skills_div.innerHTML+=`
				<div style="`+_div_style+`">
				<xgui-button style="`+_style+`" id="main_skill-`+_skill_id+`" display-name="Skill `+(i+1)+`" effect-self="`+_skill+`"></xgui-button>
				</div>
			`;
		}
		
		this._skill_btns=new Array();
		
		if(this._game._warehouse.have_player_ship(this.get_focus_ship_id()))
		for(let i=0;i<_skills_infor.length;i++){
			let _skill_id="main_skill-"+_skills_infor[i].id;
			let _btn=document.getElementById(_skill_id);
			this._skill_btns.push(_btn);
			//_btn.skill_id=_skill_id;
			_btn.addEventListener("click",()=>{
				this._show_room_sound.play('click1');
				let _current_level=_unit._ship_package.get_main_skill_level(_skills_infor[i].id,true);
				let _next_level=_current_level+1;
				const _skill_name=_unit.get_main_skill_name(_skills_infor[i].id);
				const _upgradable=_unit.get_main_skill_upgradable(_skills_infor[i].id);
				let _main_skill_description=_unit.get_main_skill_description(_skills_infor[i].id);
				let _main_skill_name=_unit.get_main_skill_name(_skills_infor[i].id);
				let _ms_box=this._game.show_message_box_2('notice',_main_skill_name,_main_skill_description,4);
									_ms_box.style.top='-10px';
				if(!_upgradable){//Skill ko can upgrade
					this._game.createMessageBox(_skill_name,"Can not upgrade");
					return;
				}
				
				if(_next_level>this._game._parameters._unit_main_skill_max_level){
					this._game.createMessageBox("MAX","Level "+_current_level,()=>{});
					return;
				}
				
				this._game._graphics.create_divider(document.getElementById("root-container"),"rgba(0, 0, 0, 0.4)");
									//let _upgrade_cost=this._game._parameters.get_auxiliary_upgrade_cost(_id,_current_level);
									let _upgrade_cost=this._game._unitMG.get_player_ship_skill_upgrade_cost(this.get_focus_ship_id(),_current_level);
									let _item_id=this._game._unitMG.get_player_ship_skill_upgrade_item_require_id(this.get_focus_ship_id());
									let _item_num=this._game._item_package.get_item_num(_item_id);
									let _item_name=this._game._item_package.get_item_name(_item_id);
									let _item_img_path=this._game._item_package.get_item_img_path(_item_id);
									//alert(_main_skill_description);
									
									
									let _num_color='yellow';
								    if(_upgrade_cost>_item_num)_num_color='red';
									let _confirm_box1=this._game.createConfirmBox("Upgrade Level "+_current_level+"->"+_next_level,
									"<div style='display:flex; justify-content: center;font-family: Orbitron, sans-serif;'>"+
									"Quantity required:"+
									"<div style='width:64px;height:64px;margin-top:-16px;clip-path: polygon(25% 0%, 75% 0%,100% 50%, 75% 100%,25% 100%, 0% 50%);background: white;display:flex; justify-content: center;'>"+
									"<div style='width:60px;height:60px;margin-top:3px;clip-path: polygon(25% 0%, 75% 0%,100% 50%, 75% 100%,25% 100%, 0% 50%);background: black;'>"+
									"<img width=50 height=50 style='border:0px solid white;border-radius:50px;margin-top:5px;' src='"+_item_img_path+"'/></div></div>x"+_upgrade_cost+"</div>"+
									"<br/>Available:<b style='color:"+_num_color+"'>"+_item_num+"</b>",()=>{
											
											if(_upgrade_cost>_item_num){
												this._game.createMessageBox("Transaction Failed","Not enough "+_item_name+"s",()=>{});
												this._show_room_sound.play('fail1');
											}
											else{
												
												this._game._item_package.take_item(_item_id,_upgrade_cost);
												const _rs=this._ship_package.upgrade_main_skill_level(_skills_infor[i].id);
												this._ship_package.save_data();
												this._show_room_sound.play('sucess1');
												let _effect1=new Teleport1({game:this._game});
												_effect1.create_system_1(this.get_focus_ship()._model.position,new THREE.Vector3(0,1,0));
											}
									this._game._graphics.remove_divider();
									},()=>{
										
										this._game._graphics.remove_divider();
										
									});
			});
		}
		document.getElementById("default-weapon").addEventListener("click",()=>{
			this._enable_default_weapon=!this._enable_default_weapon;
			this._show_room_sound.play('click1');
				let _current_level=_unit._ship_package.get_ship_level();
				this._game.createMessageBox("Default Weapon","Level "+_current_level,()=>{});
		});
		
		if(this._focus_id===1)
			{
				//console.log("ATK="+_unit._params.damage);
				//console.log("HP="+_unit._params.max_health);
				//console.log("Current="+_unit.get_space_ship_fire_rate());
				//console.log("--------------------------------------------");
			}
			
		const _standard_value=200;//de lam cho cac progress-bar co chieu dai bang nhau
		
		if (this._unit_speed && this._unit_speed.hasAttribute("max-value")){
			
			let _max_value=10;
			let _value=parseInt(_unit.get_space_ship_max_speed());
			let _rate=_standard_value/_max_value;
			_max_value*=_rate;
			_value*=_rate;
			_max_value=parseInt(_max_value);
			_value=parseInt(_value);
			
			this._unit_speed.setAttribute("max-value", _max_value);
			this._unit_speed.setAttribute("value",_value);
		}
		if (this._unit_hp && this._unit_hp.hasAttribute("max-value")){
			
			let _max_value=parseInt(_unit.get_space_ship_max_level_hp());
			let _value=parseInt(_unit.get_space_ship_hp());
			let _rate=_standard_value/_max_value;
			_max_value*=_rate;
			_value*=_rate;
			_max_value=parseInt(_max_value);
			_value=parseInt(_value);
			
			this._unit_hp.setAttribute("max-value", _max_value);
			//alert(_unit.get_space_ship_level());
			this._unit_hp.setAttribute("value", _value);
		}
		if (this._unit_damage && this._unit_damage.hasAttribute("max-value")){
			
			let _max_value=_unit.get_space_ship_max_level_damage();
			let _value=parseInt(_unit.get_space_ship_damage());
			let _rate=_standard_value/_max_value;
			_max_value*=_rate;
			_value*=_rate;
			_max_value=parseInt(_max_value);
			_value=parseInt(_value);
			
			this._unit_damage.setAttribute("max-value",_max_value);//damage o level cao nhat
			
			this._unit_damage.setAttribute("value", _value);
		}
		if (this._unit_fire_rate && this._unit_fire_rate.hasAttribute("max-value")){
			const _tRate1=100;//lam cho thanh` so' nguyen de de~ nhin hon
			
			let _max_value=_unit.get_space_ship_max_fire_rate()*_tRate1;
			let _value=parseInt(_unit.get_space_ship_fire_rate()*_tRate1);
			let _rate=_standard_value/_max_value;
			_max_value*=_rate;
			_value*=_rate;
			_max_value=parseInt(_max_value);
			_value=parseInt(_value);
			
			//*Level cang cao, fire rate se cang nho
			this._unit_fire_rate.setAttribute("max-value",_max_value);
			if(this._focus_id===0)
			{
				//console.log("Max="+_unit.get_space_ship_max_fire_rate());
				//console.log("Min="+_unit.get_space_ship_min_fire_rate());
				//console.log("Current="+_unit.get_space_ship_fire_rate());
				//console.log("--------------------------------------------");
			}
			this._unit_fire_rate.setAttribute("value",_value);
		}
		//_unit_fire_rate
		
	}
	
	next(){
		if(this._lock)return;
		if(this._focus_id-1<0)return;
		
		this._lock=true;
		this._focus_id--;
		
		this.prepare_move(1);
	}
	prev(){
		if(this._lock)return;
		if(this._focus_id+1>=this._unit_list.length)return;
		
		this._lock=true;
		this._focus_id++;
		
		this.prepare_move(-1);
	}
	check_status(){
		if(this._game._warehouse.have_player_ship(this.get_focus_ship_id())){
			this._unclock_btn.style.visibility="hidden";
			this._play_btn.style.visibility="visible";
			//this._rocket_btn.style.visibility="visible";
			//this._armour_btn.style.visibility="visible";
			//this._item_btn.style.visibility="visible";
		}
		else{
			this._unclock_btn.style.visibility="visible";
			this._play_btn.style.visibility="hidden";
			//this._rocket_btn.style.visibility="hidden";
			//this._armour_btn.style.visibility="hidden";
			//this._item_btn.style.visibility="hidden";
			
			if(this._unlock_fc){
				this._unclock_btn.removeEventListener("click",this._unlock_fc);
			}
			
			this._unlock_fc=()=>{
				this.show_unlock_panel();
				
			};
			this._unclock_btn.addEventListener("click",this._unlock_fc);
			
			
		}
	}
	
	show_unlock_panel(){
		const _player_level=this._game.get_player_level();
		const _player_level_require=this._game._unitMG.get_player_ship_level_require(this.get_focus_ship_id());
		if(_player_level_require>_player_level){
			this._show_room_sound.play('fail1');
			this._game.createMessageBox("You are not level enough",
			"Level required:"+_player_level_require+"<br/>Your Level:"+_player_level,
			()=>{});
			return false;
		}
		
		this.close_unlock_panel();
		
		this._game._graphics.create_divider(document.getElementById("root-container"),"rgba(0, 0, 0, 0.1)");
	
		this._unlock_panel=document.createElement("div");
		this._unlock_panel.style.position="absolute";
		this._unlock_panel.style.width="300px";
		this._unlock_panel.style.height="200px";
		this._unlock_panel.style.left="500px";
		this._unlock_panel.style.top="25%";
		this._unlock_panel.style.border="2px solid transparent";
		this._unlock_panel.style.boxShadow="0 0 10px 5px #33BBFF";
		this._unlock_panel.style.backgroundColor="rgba(20, 114, 234, 0.4)";
		this._unlock_panel.style.zIndex="99999999999999999";
		document.getElementById("root-container").appendChild(this._unlock_panel);
		
		const _close_btn=document.createElement("button");
		_close_btn.style.position="absolute";
		_close_btn.style.width="25px";
		_close_btn.style.height="25px";
		_close_btn.style.top="0%";
		_close_btn.style.right="0%";
		_close_btn.innerHTML="X";
		this._unlock_panel.appendChild(_close_btn);
		_close_btn.addEventListener("click",()=>{
			this.close_unlock_panel();
			this._game._graphics.remove_divider();
		});
		
		const _ok_btn=document.createElement("button");
		_ok_btn.classList.add("ring-button");
		_ok_btn.style.position="absolute";
		//_ok_btn.style.width="130px";
		//_ok_btn.style.height="40px";
		_ok_btn.style.bottom="0%";
		_ok_btn.style.left="30%";
		_ok_btn.innerHTML="UNLOCK";
		this._unlock_panel.appendChild(_ok_btn);
		
		let _price=this._game._unitMG.get_player_ship_price(this.get_focus_ship_id());
		const _price_container=document.createElement("div");
		_price_container.style.color="white";
		_price_container.style.marginTop="40px";
		_price_container.style.marginLeft="110px";
		_price_container.innerHTML="<b><h3 style='color:yellow'>"+_price+"$</h3></b>";
		this._unlock_panel.appendChild(_price_container);
		
		_ok_btn.addEventListener("click",()=>{
			this.close_unlock_panel();
			const _cash=this._game._root_inventory.GetCash();
			this._game._graphics.remove_divider();
			if(_price>_cash){
				this._game.createMessageBox("Transaction Failed","Not enough money",()=>{});
				this._show_room_sound.play('fail1');
				return;
			}
			
			this._game._root_inventory.TakeCash(_price);
			this._game._warehouse.add_player_ship(this.get_focus_ship_id());
			this.check_status();
			this._show_room_sound.play('sucess1');
			this.check_usage_notice();
			let _t_unit1=this.get_focus_ship();
												let _sparks = new Sparks1({
													game:this._game,
													parent:this._game._graphics.Scene,
													camera: this._game._graphics.Camera,
													position:new THREE.Vector3(0,0,0),
													particle_id:'particle2',
													color1:'turquoise',
													color2:'white',
													particle_size:0.6,
													velocity:{x:0,y:0,z:0},
													drift_range:{x:0.1,y:0.1,z:0.1}
												});
												_sparks._points.position.copy(_t_unit1.Position);
												_sparks.set_alpha(1);
												this._game.add_to_timer(()=>{
													_sparks._Clear();
												},2);
			this._game.add_to_timer(()=>{
				this._game.createMessageBox("Notification",
						"You can upgrade the ship's level by purchasing EXP-boosting items.",
						()=>{
							let _arrow=this.show_arrow(this._game._show_room._item_btn,"-60px","0px");
								this._game.add_to_timer(()=>{
									_arrow.remove();
								},9);
						});
			},3);									
			
		});
		
	}
	
	close_unlock_panel(){
		if(this._unlock_panel&&this._unlock_panel!=null){
			this._unlock_panel.remove();
			this._unlock_panel=null;
		}
	}
	check_usage_notice(){//Khi moi' mua ship moi se nhac nho nguoi choi mua exp item
	
		let _uses_num=this._get_player_ship_used_number(this.get_focus_ship_id());
		let _unit=this._unit_list[this._focus_id][1];
		let _ship_level=_unit._ship_package.get_ship_level();
		//alert("Rank="+this._game.get_player_level());
		//alert("Ship ID="+this.get_focus_ship_id());
		//alert("Ship Level="+_ship_level);
		if(this._game._warehouse.have_player_ship(this.get_focus_ship_id()))
		if(this.get_focus_ship_id()!=1){//Ko tinh' player-ship dau tien
			//if(_ship_level<3){
				//this.change_effect(this._game._show_room._item_btn,true);
			//}
			const _ids=this._game._parameters.get_items_ids();
			for(let i=0;i<_ids.length;i++){
				const _id=_ids[i];
				const _player_level=this._game._parameters.get_item_player_level_require(_id);
				const _ship_level_max=this._game._parameters.get_item_ship_level_max(_id);
				if(_player_level<=this._game.get_player_level()){
					if(_ship_level_max>=_ship_level){
						this.change_effect(this._game._show_room._item_btn,true);
						return;
					}
				}
			}
		}
		
	}
	move_to_last_select_ship(){//dich chuyen toi ship da chon trong lan choi truoc
		try{
			this._game._rewardsMG.check_space_tunnel_level_reward(1);//kiem tra da pass level-1 chua
			
			
			let _rocket_num=this._unit_list[this._focus_id][1]._ship_package.get_rocket_in_compartment_count();
			let _slot_num=this._unit_list[this._focus_id][1]._ship_package.get_max_rocket_num();
			//alert(_rocket_num+":"+_slot_num);
			if(_rocket_num<_slot_num){/*Khi ten lua trong package ko full se thong bao cho player*/
				let _arrow=this.show_arrow(this._game._show_room._rocket_btn,"-60px","0px");
				this._game.add_to_timer(()=>{
					_arrow.remove();
				},5);
			}
		}catch(e){alert(e.stack);}
		
		let _t_id=localStorage.getItem('player-ship-id');
		if(_t_id===null){
			let _unit=this._unit_list[this._focus_id][1];
			this._game._rewardsMG.check_ship_level_reward(this.get_focus_ship_id(),_unit._ship_package.get_ship_level());
			return;
		}
		_t_id=parseInt(_t_id);
		
		this.move_to_2(_t_id-1);
		//this.get_focus_ship._ship_package.get_ship_level()
		this.reset_ship_package();
		this.update_data();
			let _unit=this._unit_list[this._focus_id][1];
			this._game._rewardsMG.check_ship_level_reward(this.get_focus_ship_id(),_unit._ship_package.get_ship_level());
		this.check_usage_notice();
	}
	
	move_to(_id){//dich chuyen khung hinh toi unit bat ky
		//console.log("Id=="+_id+"   FocusID=="+this._focus_id);
		if(_id<0||_id>=this._unit_list.length)
			return false;
		//this._focus_id=_id+1;
		if(this._focus_id!=_id){
			
			if(this._focus_id>_id){
				this._finish_move_fc=()=>{
					//const _t_id=_id-1;
					this.move_to(_id);
				};
				//this.prev();
				this.next();
			}
			else{
				this._finish_move_fc=()=>{
					//const _t_id=_id+1;
					this.move_to(_id);
				};
				//this.next();
				this.prev();
			}
		}
		else{
			//console.log("FOUND");
			this._finish_move_fc=null;
			return true;
		}
	}
	move_to_2(_id){//dich chuyen unit den truoc camera ngay lap tuc
		
		let _focus_unit=this._unit_list[this._focus_id][1];
		let _focus_pos=_focus_unit.Position;
		
		let _next_unit=this._unit_list[_id][1];
		let _next_pos=_next_unit.Position;
		
		const _length=_next_pos.z-_focus_pos.z;
		
		this.move(-_length);
		this._focus_id=_id;
		
	}
	get_main_panels(){
		return [
				this._rocket_panel,
				this._child_list_container,
				this._additional_skills_panel,
				this._armour_panel,
				this._item_panel,
				this._passive_skills_panel,
			];
	}
	prepare_move(_direct){
		//try{
			this._game.remove_confirm_boxes();//loai bo cac upgrade, trading panel ...
			let _main_panel=this.get_main_panels();
			
			for(let i=0;i<_main_panel.length;i++){
				let _main_btn=_main_panel[i];
				if(_main_btn&&_main_btn!=null)_main_btn.remove();
			}
			/*
		if(this._rocket_panel&&this._rocket_panel!=null)this._rocket_panel.clear_panel();
		if(this._child_list_container&&this._child_list_container!=null)this._child_list_container.remove();
		if(this._additional_skills_panel&&this._additional_skills_panel!=null)this._additional_skills_panel.remove();
		if(this._armour_panel&&this._armour_panel!=null)this._armour_panel.remove();
		if(this._item_panel&&this._item_panel!=null)this._item_panel.remove();
		*/
		//}catch(e){alert(e.stack);}
		this._rocket_panel=null;
		
		this.check_status();
		
		let _first_unit=this._unit_list[0][1];
		this._origin_pos=_first_unit.Position;
		this._target_pos=this._origin_pos.clone();
		this._target_pos.z+=this._distance*_direct;
		
		let _fc=(timeInSeconds)=>{
			const _tpos=_first_unit.Position;
			const _distance=_tpos.distanceTo(this._target_pos);
			if(_distance<=this._error){//FInish
				this._game.remove_function_from_update_list(_fc);
				for(let i=0;i<this._unit_list.length;i++){
					let _unit=this._unit_list[i][1];
					_unit._model.position.z+=_distance*_direct;
					this.reset_ship_package();
					this.update_data();
					
				}
				this._lock=false;
				if(typeof this._finish_move_fc!='undefined'&& this._finish_move_fc!=null){
					 this._finish_move_fc();
					  //this._finish_move_fc=null;
					  return;
				}
				//alert(this._game._game_id);
				this.load_player_ship_model();
				return;
			}
			else{
				this.move(timeInSeconds*this._move_speed*_direct);
			}
		}
		
		this._game.add_to_update_function_list(_fc);
	}
	load_player_ship_model(){
		let div = document.createElement( 'div' );
		div.innerHTML="<h3>loading...</h3>";
		div.style.fontSize="20px";
		div.style.color="red";
		div.style.position="absolute";
		div.style.top="300px";
		div.style.left="600px";
		//this.label1 = new CSS2DObject( div );
		//this._game._graphics.Scene.add(this.label1);
		//this.label1.position.copy(position);
		
		this._root_container.appendChild(div);
		
		this._game._unitMG.load_player_ship_model(this.get_focus_ship_id(),this.get_focus_ship()._model.position,(_already_loaded_model)=>{
						//_unit._model=this._game._unitMG.get_player_ship_model();
						if(_already_loaded_model){
							div.remove();
							return;
						}
						let _t_unit=this._game._unitMG.create_player_ship(this.get_focus_ship_id(),new THREE.Vector3(0,0,0));
						//_t_unit.init_skills();
						_t_unit._model.rotation.copy(this.get_focus_ship()._model.rotation);
						_t_unit.CheckTarget=()=>{};
						_t_unit.add_to_scene();
						this.get_focus_ship()._model.add(_t_unit._model.clone());
						//this.get_focus_ship()._params.blasterSystem=_t_unit._params.blasterSystem.clone();
						_t_unit.SelfDestroy();
						//this.get_focus_ship()._model=_t_unit._model.clone();
						//_t_unit._model.position.copy(this.get_focus_ship()._model.position);
						div.remove();
					});
	}
	move(_length){
		for(let i=0;i<this._unit_list.length;i++){
			const _unit=this._unit_list[i][1];
			_unit._model.position.z+=_length;
		}
	}
	
	show_child_ships_panel(_count){//danh sach cac tau con
		const _colNum=6;
		const _rowNum=6;
		const _totalNum=_colNum*_rowNum;
		
		if(this._child_ships_panel){
			this._child_ships_panel.remove();
		}
		
		this._child_ships_panel=document.createElement("div");
		this._child_ships_panel.style.position="absolute";
		this._child_ships_panel.style.width="500px";
		this._child_ships_panel.style.height="70%";
		this._child_ships_panel.style.left="25%";
		this._child_ships_panel.style.top="15%";
		this._child_ships_panel.style.backgroundColor="rgba(20, 114, 234, 0.4)";
		this._child_ships_panel.style.zIndex="99999999999999999";
		document.getElementById("root-container").appendChild(this._child_ships_panel);
		
		const _close_btn=document.createElement("button");
		_close_btn.style.position="absolute";
		_close_btn.style.width="25px";
		_close_btn.style.height="25px";
		_close_btn.style.top="0%";
		_close_btn.style.right="0%";
		_close_btn.innerHTML="X";
		this._child_ships_panel.appendChild(_close_btn);
		_close_btn.addEventListener("click",()=>{
			this._child_ships_panel.remove();
		});
		
		const _width=60;
		const _height=_width;
		const _spX=_width+10;
		const _spY=_spX;
		const _fx=50;
		const _fy=50;
		
		let _px,_py;
		let _colID=0,_rowID=0;
		for(let i=0;i<_totalNum;i++){
			_px=(_colID*_spX);
			_py=(_rowID*_spY);
				let _icon_container=document.createElement("div");
				_icon_container.style.position="absolute";
				_icon_container.style.width=_width+"px";
				_icon_container.style.height=_height+"px";
				_icon_container.style.left=_px+"px";
				_icon_container.style.top=_py+"px";
				_icon_container.style.backgroundColor="rgba(255, 0, 0, 0.4)";
				if(i<_count){
					_icon_container.style.border="solid white 1px";
				}
				if(i===_count){
					_icon_container.style.border="solid yellow 1px";
					let _add_btn=document.createElement("button");
					_add_btn.style.position="absolute";
					_add_btn.style.width=_width/3+"px";
					_add_btn.style.height=_height/3+"px";
					_add_btn.style.left=_width/3.5+"px";
					_add_btn.style.top=_height/3.5+"px";
					_add_btn.style.fontSize="10px";
					_add_btn.innerHTML="+";
					_icon_container.appendChild(_add_btn);
					_add_btn.addEventListener("click",()=>{
						this._child_ships_panel.remove();
						this._children_ship_panel=new ChildrenShipPanel({game:this._game,container:this._root_container});
						this._children_ship_panel.init();
					});
				}
				
				this._child_ships_panel.appendChild(_icon_container);
			_colID++;
			if(_colID>=_colNum){
				_colID=0;
				_rowID++;
			}
		}
	}
	
	show_infor(){
		if(this.infor_container)this.infor_container.remove();
		
		let _unit=this._unit_list[this._focus_id][1];
		
		const _level=this._ship_package.get_ship_level();
		if(_level<1){
			alert("Level Data Corrupted");
			return;
		}
		let _exp=this._ship_package.get_ship_exp();
		if(_exp<0){
			alert("EXP Data Corrupted");
			return;
		}
		
		let _exp1;
		if(_level===1)
			_exp1=0;
		else
			_exp1=this._ship_package.get_require_exp(_level);
			//_exp1=this._levelMG.get_exp_require_for_combat_unit_level(_level);
		//let _exp2=this._levelMG.get_exp_require_for_combat_unit_level(_level+1);
		let _exp2=this._ship_package.get_require_exp(_level+1);
		//console.log("Min="+_exp1);
		//console.log("Max="+_exp2);
		if(_exp1===null||_exp2===null){
			return;
		}
		
		//_exp=_exp-_exp1;
		//alert(_exp);
		
		
		this.infor_container=document.createElement("div");
		this.infor_container.style.position="absolute";
		this.infor_container.style.width="36%";
		this.infor_container.style.height="60%";
		this.infor_container.style.transform="scale(1.0, 0.7)";
		this.infor_container.style.left="34%";
		this.infor_container.style.top="55%";
		this.infor_container.style.zIndex="0";
		document.getElementById("root-container").appendChild(this.infor_container);
		//alert(_exp);alert(_exp1);alert(_exp2);
		init_processbar_1(this.infor_container,_level,
						  "","",
						  _exp1,_exp2,_exp);
		//document.getElementById("processbar-container").style.zIndex=(this._game._graphics.getMaxZIndex()-10)+"";
		//document.getElementById("unit-skills").style.zIndex=(this._game._graphics.getMaxZIndex()+1)+"";				  
						  
	return;
		
		
	}
	//----------PASSIVE SKILLS---------------------------
	create_passive_skills_icon(){
		let _icon_container=document.createElement("div");
		_icon_container.style.position="absolute";
		_icon_container.style.width="60px";
		_icon_container.style.height="60px";
		_icon_container.style.left="650px";
		_icon_container.style.top="100px";
		_icon_container.style.border="2px solid turquoise";
		_icon_container.style.boxShadow="0 0 10px 5px #33BBFF";
		_icon_container.style.backgroundColor="rgba(20, 114, 234, 0.5)";
		_icon_container.style.zIndex="99999999999999999";
		
		let _label=this.get_skills_icon_label(" P-Skills");
		_icon_container.appendChild(_label);
		
		
		let _img=document.createElement("img");
		_img.style.width="100%";
		_img.style.height="100%";
		_img.src="./resources/icons/skill-icon-1.png";
		_icon_container.appendChild(_img);
		_img.addEventListener("click",()=>{
			if(this._game._warehouse.have_player_ship(this.get_focus_ship_id()))
				this.create_passive_skills_list();
		});
		
		document.getElementById("root-container").appendChild(_icon_container);
	}
	
	remove_passive_skills_list(){
		if(this._passive_skills_panel&&this._passive_skills_panel!=null){
			this._passive_skills_panel.remove();
			this._passive_skills_panel=null;
		}
	}
	create_passive_skills_list(){
		this.remove_passive_skills_list();
		this._passive_skills_panel=document.createElement("div");
		this._passive_skills_panel.style.position="absolute";
		this._passive_skills_panel.style.width="550px";
		this._passive_skills_panel.style.height="50%";
		this._passive_skills_panel.style.left="28%";
		this._passive_skills_panel.style.top="20%";
		this._passive_skills_panel.style.border="2px solid transparent";
		this._passive_skills_panel.style.boxShadow="0 0 10px 5px #33BBFF";
		this._passive_skills_panel.style.backgroundColor="rgba(20, 114, 234, 0.5)";
		this._passive_skills_panel.style.zIndex="99999999999999999";
		//document.getElementById("root-container").appendChild(this._passive_skills_panel);
		
		const _title=document.createElement("div");
			  _title.style.textAlign="center";
			  _title.style.color="white";
			  _title.innerHTML="<h3>Passive Skills</h3>";
		this._passive_skills_panel.appendChild(_title);
		  
		const _close_btn=document.createElement("button");
		_close_btn.style.position="absolute";
		_close_btn.style.width="25px";
		_close_btn.style.height="25px";
		_close_btn.style.top="0%";
		_close_btn.style.right="0%";
		_close_btn.innerHTML="X";
		this._passive_skills_panel.appendChild(_close_btn);
		_close_btn.addEventListener("click",()=>{
			 this._passive_skills_panel.remove();
			 this._passive_skills_panel=null;
			 this._game._graphics.remove_divider();
		});
		
		const _ids=this._game._parameters.get_passive_skills_ids();
		let _child_icon_list=new Array();
		const _width=65;
		const _height=_width;
		const _spX=_width+10;
		const _spY=_spX;
		const _fx=15;
		const _fy=65;
		let _px,_py;
		let _colID=0,_rowID=0;
		const _colNum=7;
		const _rowNum=3;
		const _num=_colNum*_rowNum;
		let _border_style_1="3px solid red";//màu của border khi chưa sở hữu vật phẩm
		let _border_style_2="3px solid white";//đã sở hữu
		let _border_style_3="3px solid yellow";//đã sở hữu và đang sử dụng
			  
		for(let i=0;i<_num;i++){
			
			_px=_fx+(_colID*_spX);
			_py=_fy+(_rowID*_spY);
			let _icon_container=document.createElement("div");
			
			_icon_container.style.position="absolute";
			_icon_container.style.width=_width+"px";
			_icon_container.style.height=_height+"px";
			_icon_container.style.left=_px+"px";
			_icon_container.style.top=_py+"px";
			_icon_container.style.backgroundColor="rgba(0, 0, 0, 0.4)";
			
			if(i<_ids.length){
			
			const _id=_ids[i];
			const _name=this._game._parameters.get_passive_skill_name(_id);
			const _img_path=this._game._parameters.get_passive_skill_icon_path(_id);
			const _icon_label=this._game._parameters.get_passive_skill_icon_label(_id);
			const _price=this._game._parameters.get_passive_skill_price(_id);
			const _ship_level=this._game._parameters.get_passive_skill_ship_level_require(_id);
			const _limit=this._game._parameters.get_passive_skill_limit(_id);
			//const _icon_src=this._game._parameters.get_passive_skill_icon_path(_id);
			
			_icon_container._passive_skill_id=_id;
			_icon_container._passive_skill_name=_name;
			_child_icon_list.push(_icon_container);
			
			if(this._ship_package.has_passive_skill(_id)){
					const _max_level=10;
					let _skill_level=this._ship_package.get_passive_skill_level(_id);
					if(_skill_level<_max_level){
						let _upgrade=document.createElement("button");
							_upgrade.innerHTML="+";
							_upgrade.style.position="absolute";
							_upgrade.style.width="25px";
							_upgrade.style.height="25px";
							_upgrade.style.bottom="-15px";
							_upgrade.style.left="20px";
							_upgrade.style.fontSize="20px";
							_upgrade.addEventListener("click",()=>{
									this._passive_skills_panel.remove();
									this._game._graphics.create_divider(document.getElementById("root-container"),"rgba(0, 0, 0, 0.4)");
									//let _upgrade_cost=this._game._parameters.get_auxiliary_upgrade_cost(_id,_current_level);
									let _item_id=this._game._parameters.spaceship_passive_skills_upgrade_item_require_id;
									let _item_name=this._game._item_package.get_item_name(_item_id);
									let _item_img_path=this._game._item_package.get_item_img_path(_item_id);
									//let _upgrade_cost=100;
									let _upgrade_cost=this._game._parameters.get_passive_skill_upgrade_item_num_require(_id,_skill_level);
									//alert("Upgrade Cost="+_upgrade_cost);
									let _confirm_box1=this._game.createConfirmBox("Upgrade Level "+_skill_level+"->"+(_skill_level+1),
									"Required:<img src='"+_item_img_path+"' width=40 height=40/>x"+_upgrade_cost,()=>{
											//const _cash=this._game._root_inventory.GetCash();
											//const _cash=0;
											const _item_num=this._game._item_package.get_item_num(_item_id);
											if(_upgrade_cost>_item_num){
												this._game.createMessageBox("Transaction Failed","Not enough "+_item_name,()=>{});
								
											}
											else{
												this._game._item_package.take_item(_item_id,_upgrade_cost);
												this._ship_package.upgrade_passive_skill_level(_id);
												this._ship_package.save_data();
												this.create_passive_skills_list();
												//alert("NewLevel:"+this._ship_package.get_additional_skill_level(_id));
											}
									this._game._graphics.remove_divider();
									},()=>{
										//_confirm_box1.remove();
										this._game._graphics.remove_divider();
										this.create_passive_skills_list();
									});
							});
							_icon_container.appendChild(_upgrade);
					  
					}
			}
			
			let _i_label=this.get_skills_icon_label(_icon_label,"1px","white");
			_icon_container.appendChild(_i_label);
			
			let _img=document.createElement("img");
			_img.src=_img_path;
			_img.style.width="100%";
			_img.style.height="100%";
			_icon_container.appendChild(_img);
			if(this._ship_package.has_passive_skill(_id)){
				if(this._ship_package.using_passive_skill(_id))
					_img.style.border=_border_style_3;
				else
					_img.style.border=_border_style_2;
			}
			else{
				_img.style.border=_border_style_1;
			}
			//alert(this._ship_package.get_ship_level());
			if(this._ship_package.get_ship_level()>=_ship_level){
			_img.addEventListener("click",()=>{
				this.remove_passive_skills_list();
				let _description="<p style='color:white;'>"+this._game._parameters.get_passive_skill_description(_id)+"<p/>";
				//let _ship=this.get_focus_ship();
				if(this._ship_package.has_passive_skill(_id)){
					if(!this._ship_package.using_passive_skill(_id)){
						let _confirm_box=this._game.createConfirmBox("CONFIRM",_description+"<br/>"+"Use this skill?",()=>{
							this._ship_package.use_passive_skill(_id);
							this._ship_package.save_data();
							//this._game._graphics.remove_divider();
							//_reset_icons();
							this.create_passive_skills_list();
						},
						()=>{
							//this._game._graphics.remove_divider();
							this.create_passive_skills_list();
						});
					}
					else{
						let _confirm_box=this._game.createConfirmBox("CONFIRM",_description+"<br/>"+"Detach this skill?",()=>{
							this._ship_package.not_use_passive_skill(_id);
							this._ship_package.save_data();
							//this._game._graphics.remove_divider();
							//_reset_icons();
							this.create_passive_skills_list();
						},
						()=>{
							//this._game._graphics.remove_divider();
							this.create_passive_skills_list();
						});
					}
					return;
				}
				else{
					let _price=this._game._parameters.get_passive_skill_price(_id);
					let _confirm_box1=this._game.createConfirmBox(_description+"<br/>"+"Buy this skill?",_price+"$",()=>{
						
						const _cash=this._game._root_inventory.GetCash();
						//const _cash=0;
						if(_price>_cash){
							this._game.createMessageBox("Transaction Failed","Not enough money",()=>{});		
						}
						else{
							this._game._root_inventory.TakeCash(_price);
							this._ship_package.add_ship_passive_skill(_id);
							this._ship_package.save_data();	

							let _confirm_box2=this._game.createConfirmBox("Option","Use this skill?",()=>{
								this._ship_package.use_passive_skill(_id);
								this._ship_package.save_data();
								this.create_passive_skills_list();
							},
							()=>{
								this.create_passive_skills_list();
							});
						}
					},
					()=>{});
					
				}
				
			});
			}
			else{//khi player-ship chua du level de su dung skill
				let _label=document.createElement("div");
				  _label.style.position="absolute";
				  _label.style.top="-15px";
				  _label.style.left="-15px";
				  _label.style.width="40px";
				  _label.style.height="40px";
				  _label.style.backgroundColor="rgba(0, 0, 0, 0.7)";
				  _label.style.borderRadius="50px";
				  _label.style.color="red";
				  _label.style.justifyContent="center";
				  _label.style.display="flex";
				  _label.style.alignItems="center";
				  _label.style.fontSize="15px";
				  _label.style.fontFamily="'Courier New', Courier, monospace";
				  _label.style.fontWeight="600";
				  _label.innerHTML="Lv "+_ship_level;
				  
				  _icon_container.appendChild(_label);
			}
			}
			this._passive_skills_panel.appendChild(_icon_container);
			
			_colID++;
			  if(_colID>=_colNum){
				_colID=0;
				_rowID++;
			  }
		}
		
		document.getElementById("root-container").appendChild(this._passive_skills_panel);
	}
	
	
	//----------END PASSIVE SKILLS----------------------
	
	get_skills_icon_label(_text,_bottom,_color){
		let _label=document.createElement("div");
		_label.innerHTML=_text;//secondary skils
		_label.style.position="absolute";
		if(_bottom)
			_label.style.bottom=_bottom;
		else
			_label.style.bottom="-20px";
		_label.style.width="100px";
		
		if(_color)
			_label.style.color=_color;
		else
			_label.style.color="yellow";
		_label.style.fontSize="15px";
		
		return _label;
	}
	
	
	create_additional_skills_icon(){
		let _icon_container=document.createElement("div");
		_icon_container.style.position="absolute";
		_icon_container.style.width="60px";
		_icon_container.style.height="60px";
		_icon_container.style.left="500px";
		_icon_container.style.top="100px";
		_icon_container.style.border="2px solid turquoise";
		_icon_container.style.boxShadow="0 0 10px 5px #33BBFF";
		_icon_container.style.backgroundColor="rgba(20, 114, 234, 0.5)";
		_icon_container.style.zIndex="99999999999999999";
		
		let _label=this.get_skills_icon_label(" S-Skills");
		_icon_container.appendChild(_label);
		
		let _img=document.createElement("img");
		_img.style.width="100%";
		_img.style.height="100%";
		_img.src="./resources/icons/skill-icon-1.png";
		_icon_container.appendChild(_img);
		_img.addEventListener("click",()=>{
			if(this._game._warehouse.have_player_ship(this.get_focus_ship_id()))
				this.create_additional_skills_list();
		});
		
		document.getElementById("root-container").appendChild(_icon_container);
	}
	remove_additional_skills_list(){
		if(this._additional_skills_panel&&this._additional_skills_panel!=null){
			this._additional_skills_panel.remove();
			this._additional_skills_panel=null;
		}
	}
	create_additional_skills_list(){
		this.remove_additional_skills_list();
		
		this._additional_skills_panel=document.createElement("div");
		this._additional_skills_panel.style.position="absolute";
		this._additional_skills_panel.style.width="750px";
		this._additional_skills_panel.style.height="75%";
		this._additional_skills_panel.style.left="20%";
		this._additional_skills_panel.style.top="11%";
		this._additional_skills_panel.style.border="2px solid transparent";
		this._additional_skills_panel.style.boxShadow="0 0 10px 5px #33BBFF";
		this._additional_skills_panel.style.backgroundColor="rgba(0, 0, 0, 0.8)";
		this._additional_skills_panel.style.zIndex="99999999999999999";
		//document.getElementById("root-container").appendChild(this._additional_skills_panel);
		
		this._additional_skills_panel.style.transform="scale(1.23)";
		this._additional_skills_panel.style.transformOrigin="center";
		
		
		const _title=document.createElement("div");
			  _title.style.position="absolute";
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
			  //_title.innerHTML="<h3>Additional Skills</h3>";
			  _title.innerHTML=`
					<h1  style="
									background: linear-gradient(to bottom, red,white, yellow);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
									font-size: 30px;
									font-weight: bold;
									font-family: 'Orbitron', sans-serif;
				"'>
			  Sub Skills</h1>`;
		this._additional_skills_panel.appendChild(_title);
		  
		const _close_btn=document.createElement("button");
		_close_btn.classList.add('custom-new-btn','new-btn-2');
		_close_btn.style.position="absolute";
		_close_btn.style.width="35px";
		_close_btn.style.height="35px";
		_close_btn.style.top="0%";
		_close_btn.style.right="0%";
		//_close_btn.style.backgroundColor="turquoise";
		_close_btn.innerHTML="X";
		this._additional_skills_panel.appendChild(_close_btn);
		_close_btn.addEventListener("click",()=>{
			 this._game._show_room._show_room_sound.play('click3');
			 this._additional_skills_panel.remove();
			 this._additional_skills_panel=null;
			 this._game._graphics.remove_divider();
		});
		
		const _ids=this._game._parameters.get_additional_skills_ids();
		let _child_icon_list=new Array();
		const _width=70;
		const _height=_width;
		const _spX=_width+16;
		const _spY=_spX+7;
		const _fx=30;
		const _fy=65;
		let _px,_py;
		let _colID=0,_rowID=0;
		const _colNum=8;
		const _rowNum=4;
		const _num=_colNum*_rowNum;
		
		//let _border_style_1="linear-gradient(45deg, #e5330c, #3333ff) 1";//màu của border khi chưa sở hữu vật phẩm
		//let _border_style_2="linear-gradient(45deg, #f5f0ef, #3333ff) 3";//đã sở hữu
		//let _border_style_3="linear-gradient(45deg, #ebf348, #FFC300) 3";//đã sở hữu và đang sử dụng
		let _border_style_1="linear-gradient(45deg, #141313, #141313) 1";//màu của border khi chưa sở hữu vật phẩm
		let _border_style_2="linear-gradient(45deg, #e5330c, #3333ff) 3";//đã sở hữu
		let _border_style_3="linear-gradient(45deg, #ebf348, #FFC300) 3";//đã sở hữu và đang sử dụng	  
			  
		for(let i=0;i<_num;i++){
			_px=_fx+(_colID*_spX);
			_py=_fy+(_rowID*_spY);
			let _icon_container=document.createElement("div");
			_icon_container.style.position="absolute";
			_icon_container.style.width=_width+"px";
			_icon_container.style.height=_height+"px";
			_icon_container.style.left=_px+"px";
			_icon_container.style.top=_py+"px";
			_icon_container.style.backgroundColor="rgba(0, 0, 0, 0.4)";
			//_icon_container.style.borderRadius="50px";
			
			let _not_noticed=null;
			
			if(i<_ids.length){
			
			const _id=_ids[i];
			const _name=this._game._parameters.get_additional_skill_name(_id);
			const _img_path=this._game._parameters.get_additional_skill_icon_path(_id);
			const _icon_label=this._game._parameters.get_additional_skills_icon_label(_id);
			const _price=this._game._parameters.get_additional_skill_price(_id);
			const _ship_level=this._game._parameters.get_additional_skill_ship_level_require(_id);
			const _limit=this._game._parameters.get_additional_skill_limit(_id);
			const _groupID=this._game._parameters.get_additional_skill_group(_id);
			//const _icon_src=this._game._parameters.get_additional_skill_icon_path(_id);
			
			const _premium_group=this._game._unitMG.is_premium_additional_skill_group(this.get_focus_ship_id(),_groupID);
			
			_icon_container._additional_skill_id=_id;
			_icon_container._additional_skill_name=_name;
			_child_icon_list.push(_icon_container);
			
			let _i_label=this.get_skills_icon_label(_icon_label,"1px","white");
			_icon_container.appendChild(_i_label);
			
			let _upgrade_function=()=>{			
			};
			
			let _img=document.createElement("img");
			_img.src=_img_path;
			_img.style.width="100%";
			_img.style.height="100%";
			_img.style.border="4px solid";
			//_img.style.borderRadius="50px";
			_img.style.filter="brightness( 190% ) ";
			_icon_container.appendChild(_img);
			
			if(_premium_group===true){
				let _label1=document.createElement("div");
					_label1.style.position="absolute";
					_label1.style.width="36%";
					_label1.style.height="36%";
					_label1.style.right="5px";
					_label1.style.top="5px";
					//_label1.style.backgroundColor="rgba(132, 138, 137, 0.4)";
					_icon_container.appendChild(_label1);
					
				const _premium_icon=document.createElement("img");
					_label1.appendChild(_premium_icon);
					_premium_icon.src="./resources/icons/crown-3.png";
					_premium_icon.style.width="100%";
					_premium_icon.style.height="100%";
					//_premium_icon.style.filter="brightness( 190% ) ";
					_premium_icon.style.filter=`
						 drop-shadow(2px 0 0 white)
						 drop-shadow(-2px 0 0 white)
						 drop-shadow(0 2px 0 white)
                         drop-shadow(0 -2px 0 white)
					`;//tao vien` xung quanh image
					
			}
			
			let _max_level=1;
			if(this._ship_package.has_additional_skill(_id)){
					_max_level=4;
					if(_premium_group===true)_max_level=10;
					
					let _skill_level=this._ship_package.get_additional_skill_level(_id);
					if(_skill_level<_max_level){
						let _upgrade=document.createElement("button");
							//_upgrade.id="upgrade-add-skill-id-"+_id;
							_upgrade.innerHTML="+";
							_upgrade.style.position="absolute";
							_upgrade.classList.add('custom-new-btn','new-btn-2');//co 12 loai button
							//_upgrade.style.background="linear-gradient(45deg, #f9374f, #f9a737)";
							_upgrade.style.color="yellow";
							_upgrade.style.border="2px solid yellow";
							_upgrade.style.boxShadow="0 0 5px yellow,  0 0 5px yellow inset";
							_upgrade.style.width="25px";
							_upgrade.style.height="25px";
							_upgrade.style.bottom="-10px";
							_upgrade.style.left="22px";
							_upgrade.style.fontSize="25px";
							_upgrade.style.fontWeight="300";
							_upgrade.style.display="flex";
							_upgrade.style.alignItems="center";
							_upgrade.style.justifyContent="center";
							//_upgrade.style.backgroundColor="yellow";
							_upgrade.addEventListener("click",()=>{
								_upgrade_function();
							});
							//_icon_container.appendChild(_upgrade);//<==ko su dung nua
					  
					}
					else{
						let _label=this.get_add_skill_label(`Max`,'yellow');
						_icon_container.appendChild(_label);
					}
			}
			let _skill_level=this._ship_package.get_additional_skill_level(_id);
			if(this._ship_package.has_additional_skill(_id)){
				if(this._ship_package.using_additional_skill(_id))
					_img.style.borderImage=_border_style_3;
				else
					_img.style.borderImage=_border_style_2;
				let _dark_energy_id=2001;//trong item-package.js
				let _dark_energy_count=this._game._item_package.get_item_num(_dark_energy_id);
				let _dark_energy_upgrade_require=this._game._parameters.get_spaceship_additional_skill_upgrade_item_num_require(_id,this._ship_package.get_ship_level());
				
				//alert(_dark_energy_count+"-----"+_dark_energy_upgrade_require);
				//alert(_skill_level+"----"+_max_level);
				if(_skill_level<_max_level)
				if(_dark_energy_count>=_dark_energy_upgrade_require){
					   let _upgrade_container=document.createElement("div");
					   _upgrade_container.style.position="absolute";
					   _upgrade_container.style.width="40%";
					   _upgrade_container.style.height="40%";
					   _upgrade_container.style.left="0px";
					   _upgrade_container.style.top="0px";
					   _upgrade_container.style.filter="brightness( 190% ) ";
					   _upgrade_container.innerHTML=`
							<img src="./resources/icons/upgrade-3.png" style="width:100%;height:width:100%"/>
					   `;
					   _icon_container.appendChild(_upgrade_container);
					   let _zoom=false;
						let _zoom_fc=()=>{
							if(!_zoom){
								_upgrade_container.style.transform="scale(1.3)";
							}
							else{
								_upgrade_container.style.transform="scale(1.0)";
							}
							_zoom=!_zoom;
						};
						this._game.add_to_function_list_4(_zoom_fc);
						this._game.add_to_timer(()=>{
							this._game.remove_function_from_list_4(_zoom_fc);
							_upgrade_container.style.transform="scale(1.0)";
						},7);
					   
				}
			}
			else{
				_img.style.borderImage=_border_style_1;
				if(this._ship_package.get_ship_level()===_ship_level){
					_not_noticed=this._add_noticed_skill_id(this.get_focus_ship_id(),_id);
					if(_not_noticed===true){
						let _effect_container=document.createElement("div");
					   _effect_container.classList.add("ripple-loader");
					   _effect_container.innerHTML="<div></div><div></div>";
					   _effect_container.style.position="absolute";
					   _effect_container.style.width="140%";
					   _effect_container.style.height="140%";
					   _effect_container.style.left="0px";
					   _effect_container.style.top="0px";
					   _effect_container.style.filter="brightness( 190% ) ";
					   _effect_container.addEventListener("click",()=>{_img.click();});
					   _icon_container.appendChild(_effect_container);
					   _icon_container.style.transformOrigin="center";
					   this._game.add_to_timer(()=>{
							_effect_container.remove();
						},15);
						//add_to_function_list_2
						//remove_function_from_list_2
						let _zoom=false;
						let _zoom_fc=()=>{
							if(!_zoom){
								_icon_container.style.transform="scale(1.3)";
							}
							else{
								_icon_container.style.transform="scale(1.0)";
							}
							_zoom=!_zoom;
						};
						this._game.add_to_function_list_4(_zoom_fc);
						this._game.add_to_timer(()=>{
							this._game.remove_function_from_list_4(_zoom_fc);
							_icon_container.style.transform="scale(1.0)";
						},7);
					}
				}
			}
			//alert(this._ship_package.get_ship_level());
			if(this._ship_package.get_ship_level()>=_ship_level){
			_img.addEventListener("click",()=>{
				this._show_room_sound.play('click2');
				this.remove_additional_skills_list();
				let _description=this._game._parameters.get_additional_skill_description(_id);
				//let _skill_level=this._ship_package.get_additional_skill_level(_id);
				let _btn_html=`<button 
				class="custom-new-btn new-btn-2" 
				style="width:120px;height:45px;font-size:24px;"
				id="upgrade-add-skill-id-`+_id+`"
				>
				Upgrade</button>`; 
				 
				if(this._ship_package.has_additional_skill(_id)){
					_description+=("<br/>"+_btn_html+"<br/>");
					let _confirm_box;
					if(!this._ship_package.using_additional_skill(_id)){
						_confirm_box=this._game.createConfirmBox("Level "+_skill_level,_description
						+"<br/>"+"Use this skill?",()=>{
							this._ship_package.use_additional_skill(_id);
							this._ship_package.save_data();
							//this._game._graphics.remove_divider();
							//_reset_icons();
							this.create_additional_skills_list();
						},
						()=>{
							//this._game._graphics.remove_divider();
							this.create_additional_skills_list();
						});
					}
					else{
						_confirm_box=this._game.createConfirmBox("Level "+_skill_level,_description+"<br/>"+"Detach this skill?",()=>{
							this._ship_package.not_use_additional_skill(_id);
							this._ship_package.save_data();
							//this._game._graphics.remove_divider();
							//_reset_icons();
							this.create_additional_skills_list();
						},
						()=>{
							//this._game._graphics.remove_divider();
							this.create_additional_skills_list();
						});
					}
					let _upgrade_btn=document.getElementById("upgrade-add-skill-id-"+_id);
					_upgrade_function=()=>{
						if(_skill_level>=_max_level)return;
							this._show_room_sound.play('click2');
									//this._additional_skills_panel.remove();
									this.remove_additional_skills_list();
									_confirm_box.remove();
									this._game._graphics.create_divider(document.getElementById("root-container"),"rgba(0, 0, 0, 0.4)");
									//let _upgrade_cost=this._game._parameters.get_auxiliary_upgrade_cost(_id,_current_level);
									//let _upgrade_cost=100;
									let _item_id=this._game._parameters.spaceship_additional_skills_upgrade_item_require_id;
									let _item_name=this._game._item_package.get_item_name(_item_id);
									let _item_img_path=this._game._item_package.get_item_img_path(_item_id);//alert(_item_img_path);
									let _upgrade_cost=this._game._parameters.get_spaceship_additional_skill_upgrade_item_num_require(_id,_skill_level);
									//alert("Upgrade Cost="+_upgrade_cost);
									
									const _t_item_num=this._game._item_package.get_item_num(_item_id);
									let _num_color='yellow';
									if(_upgrade_cost>_t_item_num)_num_color='red';
									let _confirm_box1=this._game.createConfirmBox("Upgrade Level "+_skill_level+"->"+(_skill_level+1),
									"<div style='display:flex; justify-content: center;font-family: Orbitron, sans-serif;"
									+"'>requires:"+
									"<div style='width:64px;height:64px;margin-top:-16px;clip-path: polygon(25% 0%, 75% 0%,100% 50%, 75% 100%,25% 100%, 0% 50%);background: white;display:flex; justify-content: center;'>"+
									"<div style='width:60px;height:60px;margin-top:3px;clip-path: polygon(25% 0%, 75% 0%,100% 50%, 75% 100%,25% 100%, 0% 50%);background: black;'>"+
									"<img style='border:0px solid white;border-radius:50px;' src='"+_item_img_path+"' width=60 height=60/></div></div>x"+_upgrade_cost+
									"/<div style='color:"+_num_color+";font-family: Orbitron, sans-serif;'>"+_t_item_num+"</div>"+
									"</div>",
									()=>{
											//const _cash=this._game._root_inventory.GetCash();
											//const _cash=0;
											const _item_num=this._game._item_package.get_item_num(_item_id);
											if(_upgrade_cost>_item_num){
												this._game.createMessageBox("Transaction Failed","Not enough "+_item_name,()=>{});
								                this._show_room_sound.play('fail1');
											}
											else{
												//alert("OldLevel:"+this._ship_package.get_additional_skill_level(_id));
												//this._game._root_inventory.TakeCash(_upgrade_cost);
												this._game._item_package.take_item(_item_id,_upgrade_cost);
												this._ship_package.upgrade_additional_skill_level(_id);
												this._ship_package.save_data();
												this.create_additional_skills_list();
												//alert("NewLevel:"+this._ship_package.get_additional_skill_level(_id));
												this._show_room_sound.play('sucess2');
												let _t_unit1=this.get_focus_ship();
												let _sparks = new Sparks1({
													game:this._game,
													parent:this._game._graphics.Scene,
													camera: this._game._graphics.Camera,
													position:new THREE.Vector3(0,0,0),
													particle_id:'particle1',
													color1:'yellow',
													color2:'red',
													particle_size:0.6,
													velocity:{x:0,y:0,z:0},
													drift_range:{x:0.1,y:0.1,z:0.1}
												});
												_sparks._points.position.copy(_t_unit1.Position);
												_sparks.set_alpha(1);
												this._game.add_to_timer(()=>{
													_sparks._Clear();
												},2);
												
											}
									this._game._graphics.remove_divider();
									},()=>{
										//_confirm_box1.remove();
										this._game._graphics.remove_divider();
										this.create_additional_skills_list();
									});
						};
					if(_upgrade_btn){
						
						_upgrade_btn.addEventListener("click",()=>{
							_upgrade_function();
						});
					}
					return;
				}
				else{
					let _price=this._game._parameters.get_additional_skill_price(_id);
					let _confirm_box1=this._game.createConfirmBox2({
						title:_price+"$",
						content:_description,
						btn_text_1:"BUY",
						btn_text_2:"CANCEL",
						function1:()=>{
						this._game._show_room._show_room_sound.play('click2');
						const _cash=this._game._root_inventory.GetCash();
						//const _cash=0;
						if(_price>_cash){
							this._game.createMessageBox("Transaction Failed","Not enough money",()=>{});		
							this._show_room_sound.play('fail1');
						}
						else{
							this._show_room_sound.play('sucess2');
							this._game._root_inventory.TakeCash(_price);
							this._ship_package.add_ship_additional_skill(_id);
							this._ship_package.save_data();	

							let _confirm_box2=this._game.createConfirmBox("Option","Use this skill?",()=>{
								this._ship_package.use_additional_skill(_id);
								this._ship_package.save_data();
								this.create_additional_skills_list();
							},
							()=>{
								this.create_additional_skills_list();
							});
							
							let _add_skills=this._ship_package.get_ship_additional_skills();
							//alert("Length="+_add_skills.length);
						}
					},
					function2:()=>{
						this._game._show_room._show_room_sound.play('click3');
					},
					title_color_1:"red",
					title_color_2:"yellow",
					title_color_3:"turquoise",
					});
					
				}
				
			});
			}
			else{//khi player-ship chua du level de su dung skill
				let _label=this.get_add_skill_label(`Lv`+_ship_level,'red');
				  _icon_container.appendChild(_label);
				  _img.addEventListener("click",()=>{
					  this._show_room_sound.play('fail1');
					  this._game.createMessageBox("Message",`<b  style="
									background: linear-gradient(to bottom, red,white, blue);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
									font-size: 32px;
									font-weight: bold;
				"'>Ship Level `+_ship_level+`</b>`,()=>{
						  this._game._show_room._show_room_sound.play('click3');
					  });
				  });
			}
			}
			this._additional_skills_panel.appendChild(_icon_container);
			
			_colID++;
			  if(_colID>=_colNum){
				_colID=0;
				_rowID++;
			  }
		}
		
		document.getElementById("root-container").appendChild(this._additional_skills_panel);
	}
	
	get_add_skill_label(_text,_border_color){
		let _label=document.createElement("div");
				  _label.style.position="absolute";
				  _label.style.top="-5px";
				  _label.style.left="-5px";
				  _label.style.width="35px";
				  _label.style.height="35px";
				  _label.style.backgroundColor="rgba(0, 0, 0, 0.7)";
				  _label.style.borderRadius="50px";
				  _label.style.border="1px solid "+_border_color;
				  _label.style.color="white";
				  _label.style.justifyContent="center";
				  _label.style.display="flex";
				  _label.style.alignItems="center";
				  //_label.style.fontSize="12px";
				  _label.style.fontFamily="'Courier New', Courier, monospace";
				  _label.style.fontWeight="600";
				  _label.innerHTML=`<i  style="
									background: linear-gradient(to bottom, turquoise,white, yellow);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
									font-size: 12px;
									font-weight: bold;
				"'>`+_text+`</i>`;
				
		return _label;
	}
	
	 _show_child_list(_group_id){
		 let _child_ships_infor=this._game._parameters._auxiliary_infors;
		 
		  this._game._graphics.create_divider(document.getElementById("root-container"),"rgba(0, 0, 0, 0.1)");
		
		  let _ship_level=this._ship_package.get_ship_level();
		  let _player_level=this._game.get_player_level();
		  
		  let _auxiliary_objs=this._ship_package.get_auxiliary_objects();
	      //alert(_ship._ship_package.has_auxiliary_object(1,1));
		  
		  this._child_list_container=document.createElement("div");
		  this._child_list_container.style.position="absolute";
		  this._child_list_container.style.width="650px";
		  this._child_list_container.style.height="60%";
		  this._child_list_container.style.left="25%";
		  this._child_list_container.style.top="18%";
		  this._child_list_container.style.border="2px solid transparent";
		  this._child_list_container.style.boxShadow="0 0 10px 5px #33BBFF";
		  this._child_list_container.style.backgroundColor="rgba(20, 114, 234, 0.6)";
		  this._child_list_container.style.zIndex="99999999999999999";
		  document.getElementById("root-container").appendChild(this._child_list_container);
		  
		  let _text="";
		  if(_group_id===1)_text="Left Side Accessory";
		  if(_group_id===2)_text="Right Side Accessory";
		  const _title=document.createElement("div");
				//_title.style.textAlign="center";
				_title.style.color="white";
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
			  //_title.innerHTML="<h3>Items</h3>";
			  _title.innerHTML=`
					<h1  style="
									background: linear-gradient(to bottom, red,white, yellow);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
									font-size: 30px;
									font-weight: bold;
									font-family: 'Orbitron', sans-serif;
				"'>
			  `+_text+`</h1>`;
				//_title.innerHTML="<h3>"+_text+"</h3>";
		  this._child_list_container.appendChild(_title);
		  
		  const _close_btn=document.createElement("button");
		  _close_btn.classList.add('custom-new-btn','new-btn-2');
		  _close_btn.style.position="absolute";
		  _close_btn.style.width="25px";
		  _close_btn.style.height="25px";
		  _close_btn.style.top="0%";
		  _close_btn.style.right="0%";
		  //_close_btn.style.backgroundColor="turquoise";
		  _close_btn.innerHTML="X";
		  this._child_list_container.appendChild(_close_btn);
		  _close_btn.addEventListener("click",()=>{
			  this._game._show_room._show_room_sound.play('click3');
			 this._child_list_container.remove();
			 this._child_list_container=null;
			 this._game._graphics.remove_divider();
		  });
		  
		  let _child_icon_list=new Array();
		  const _width=70;
		  const _height=_width;
		  const _spX=_width+15;
		  const _spY=_spX+8;
		  const _fx=50;
		  const _fy=70;
		  //const _border_style_1="0 0 10px 5px";
		  //const _border_style_2="0 0 10px 5px #7DFF33"
		  let _px,_py;
		  let _colID=0,_rowID=0;
		  const _colNum=6;
		  const _rowNum=3;
		  const _num=_colNum*_rowNum;
		  //let _border_style_1="3px solid red";//màu của border khi chưa sở hữu vật phẩm
		  //let _border_style_2="3px solid white";//đã sở hữu
		  //let _border_style_3="3px solid yellow";//đã sở hữu và đang sử dụng
		  let _border_style_1="linear-gradient(45deg, #e5330c, #3333ff) 1";//màu của border khi chưa sở hữu vật phẩm
		  let _border_style_2="linear-gradient(45deg, #f5f0ef, #3333ff) 1";//đã sở hữu
		  let _border_style_3="linear-gradient(45deg, #ebf348, #FFC300) 1";//đã sở hữu và đang sử dụng
			
		  for(let i=0;i<_num;i++){
			  
			  _px=_fx+(_colID*_spX);
			  _py=_fy+(_rowID*_spY);
			  let _icon_container=document.createElement("div");
			  _icon_container.style.position="absolute";
			  _icon_container.style.width=_width+"px";
			  _icon_container.style.height=_height+"px";
			  _icon_container.style.left=_px+"px";
			  _icon_container.style.top=_py+"px";
			  _icon_container.style.backgroundColor="rgba(0, 0, 0, 0.4)";
			  _icon_container.style.border="3px solid";
			  
			  if(i<_child_ships_infor.length){
			  
			  const _ship_infor=_child_ships_infor[i];
			  let _id=_ship_infor.id;
			  let _name=_ship_infor.name;
			  let _ship_level_require=_ship_infor.ship_level;
			  if(_group_id===2)
				  _ship_level_require+=this._game._parameters.spaceship_auxiliary_right_wing_extra_level;
			  let _available=(_player_level>=_ship_level_require);
			  
			  const _create_fc=_ship_infor.create_fc;
			  const _img_src=_ship_infor.img;
			  const _rotate_icon=this._game._parameters.get_auxiliary_infor(_id).icon_rotate;
			  //alert(_rotate_icon);
			  _icon_container._auxiliary_id=_id;
			  _icon_container._auxiliary_name=_name;
			  _child_icon_list.push(_icon_container);
			  
			  let _img=document.createElement("img");
			      _img.src=_img_src;
				  _img.style.width="100%";
				  _img.style.height="100%";
				  //_img.style.border="solid 2px white";
				  _img.style.filter="brightness( 190% ) ";
				  _img.style.border="3px solid";
				  if(_rotate_icon===true){
					  _img.style.transform="rotate(45deg)";
				  }
				  _icon_container.appendChild(_img);
			  
			  if(this._ship_package.has_auxiliary_object(_group_id,_icon_container._auxiliary_id)){
				  if(this._ship_package.is_using_auxiliary(_group_id,_icon_container._auxiliary_id))
				  {
					  _icon_container.style.borderImage=_border_style_3;
				  }
				  else{
					  _icon_container.style.borderImage=_border_style_2;
				  }
						
				  
				  let _current_level=this._ship_package.get_auxiliary_object_level(_group_id,_id);
				  let _next_level=_current_level+1;
				  
				  //if(_next_level<=this._game._parameters.spaceship_auxiliary_max_level)
				  let _upgrade=document.createElement("button");
					  _upgrade.innerHTML="+";
					  _upgrade.classList.add('custom-new-btn','new-btn-2');//co 12 loai button
							_upgrade.style.background="linear-gradient(45deg, #f9374f, #f9a737)";
							_upgrade.style.color="yellow";
							_upgrade.style.border="2px solid yellow";
							_upgrade.style.boxShadow="0 0 5px yellow,  0 0 5px yellow inset";
					  _upgrade.style.position="absolute";
					  _upgrade.style.width="25px";
					  _upgrade.style.height="25px";
					  _upgrade.style.bottom="-15px";
					  _upgrade.style.left="22px";
					  _upgrade.style.fontSize="20px";
					  _upgrade.addEventListener("click",()=>{//alert("Level:"+_ship._ship_package.get_auxiliary_object_level(_group_id,_id));
						  this._show_room_sound.play('click2');
						  this._child_list_container.remove();
						  this._game._graphics.create_divider(document.getElementById("root-container"),"rgba(0, 0, 0, 0.4)");
						  
						  let _item_id=this._game._parameters.spaceship_auxiliary_upgrade_item_require_id;
						  let _item_name=this._game._item_package.get_item_name(_item_id);
						  let _item_img_path=this._game._item_package.get_item_img_path(_item_id);
						  let _upgrade_cost=this._game._parameters.get_auxiliary_upgrade_cost(_id,_current_level);
						  //alert("Upgrade Cost="+_upgrade_cost);
						  
						  const _t_item_num=this._game._item_package.get_item_num(_item_id);
						  let _num_color='yellow';
						  if(_upgrade_cost>_t_item_num)_num_color='red';
						  let _confirm_box1=this._game.createConfirmBox("Upgrade Level "+_current_level+"->"+_next_level,
						  "<div style='display:flex; justify-content: center;font-family: Orbitron, sans-serif;'>"+
						  "Required:"+
						  "<div style='width:64px;height:64px;margin-top:-16px;clip-path: polygon(25% 0%, 75% 0%,100% 50%, 75% 100%,25% 100%, 0% 50%);background: white;display:flex; justify-content: center;'>"+
						  "<div style='width:60px;height:60px;margin-top:3px;clip-path: polygon(25% 0%, 75% 0%,100% 50%, 75% 100%,25% 100%, 0% 50%);background: black;'>"+
						  "<img src='"+_item_img_path+"' width=50 height=50 style='border:0px solid white;border-radius:50px;margin-top:5px;'/></div></div>x"+_upgrade_cost+
						  "/<div style='color:"+_num_color+";font-family: Orbitron, sans-serif;'>"+_t_item_num+"</div></div>",()=>{
							  //const _cash=this._game._root_inventory.GetCash();
							  //const _cash=0;
							  const _item_num=this._game._item_package.get_item_num(_item_id);
							  if(_upgrade_cost>_item_num){
								this._game.createMessageBox("Transaction Failed","Not enough "+_item_name,()=>{});
								this._show_room_sound.play('fail1');
							  }
							  else{
								 //this._game._root_inventory.TakeCash(_upgrade_cost);
								 this._game._item_package.take_item(_item_id,_upgrade_cost);
								 this._ship_package.level_up_auxiliary_object(_group_id,_id);
								 this._ship_package.save_data();
								 this._show_child_list(_group_id);
								 this._show_room_sound.play('sucess1');
								 //alert("NewLevel:"+_ship._ship_package.get_auxiliary_object_level(_group_id,_id));
							  }
							  this._game._graphics.remove_divider();
						  },()=>{
							  //_confirm_box1.remove();
							  this._game._graphics.remove_divider();
							  this._show_child_list(_group_id);
						  });
					  });
				  
				  if(_next_level<=this._ship_package._max_auxiliary_level)
					_icon_container.appendChild(_upgrade);
				  else{
					  _upgrade.remove();
					  _upgrade=null;
					  let _max_txt=`
							<h4  style="
									color:white;
									text-shadow:
									0 0 7px #000000,
									0 0 10px #000000,
									0 0 21px #000000,
									0 0 42px #000000,
									0 0 82px #000000,
									0 0 92px #000000,
									0 0 102px #000000,
									0 0 151px #000000;
									font-size: 14px;
									font-weight: bold;
									font-family: 'Orbitron', sans-serif;
							"'>
							max</h4>
						`;
						let _max_label=document.createElement("div");
						_max_label.innerHTML=_max_txt;
						_icon_container.appendChild(_max_label);
						//_max_label.style.backgroundColor="rgba(0, 0, 0, 0.8)";
						_max_label.style.position="absolute";
						_max_label.style.width="40px";
						_max_label.style.height="40px";
						_max_label.style.top="20px";
						_max_label.style.left="22px";
						_max_label.style.borderRadius="50px";
						_max_label.style.zIndex="9999";
				  }
			  }
			  else{
				    _icon_container.style.borderImage=_border_style_1;
			  }
			  //_icon_container.style.backgroundColor="rgba(202, 213, 196, 0.4)";
			  //_icon_container._selected=false;
			  
			  
				  
			  let _reset_icons=()=>{
				  for(let j=0;j<_child_icon_list.length;j++){
					  if(this._ship_package.has_auxiliary_object(_group_id,_child_icon_list[j]._auxiliary_id)){
						  //alert(_ship._ship_package.is_using_auxiliary(_child_icon_list[j]._auxiliary_id));
						  if(this._ship_package.is_using_auxiliary(_group_id,_child_icon_list[j]._auxiliary_id)){
							  _child_icon_list[j].style.borderImage=_border_style_3;
						  }
						  else
							  _child_icon_list[j].style.borderImage=_border_style_2;
					  }
					  else
						    _child_icon_list[j].style.borderImage=_border_style_1;
				  }
			  };
			  
			  if(_available){
			  _img.addEventListener("click",()=>{//alert(_ship._ship_package.is_using_auxiliary(_group_id,_id));
				   this._show_room_sound.play('click2');
				   this._game._graphics.create_divider(document.getElementById("root-container"),"rgba(0, 0, 0, 0.1)");
					this._child_list_container.remove();
				  if(this._ship_package.has_auxiliary_object(_group_id,_id)){//da so huu vat pham
						if(!this._ship_package.is_using_auxiliary(_group_id,_id)){
							let _confirm_box=this._game.createConfirmBox("CONFIRM","Use this item?",()=>{
								this._ship_package.use_auxiliary(_group_id,_id);
								this._ship_package.save_data();
								this._game._graphics.remove_divider();
								_reset_icons();
								//alert(_ship._ship_package.get_current_auxiliary_id(_group_id));
								//alert(_ship._ship_package.get_current_auxiliary_name(_group_id));
							},
							()=>{
								this._game._graphics.remove_divider();
							});		
						}
						else{
							let _confirm_box=this._game.createConfirmBox("LEVEL "+this._ship_package.get_auxiliary_object_level(_group_id,_id),
							"Don't use this item?",()=>{
								this._ship_package.not_use_auxiliary(_group_id,_id);
								this._ship_package.save_data();
								
								this._game._graphics.remove_divider();
								_reset_icons();
							},
							()=>{
								this._game._graphics.remove_divider();
							});	
						}
						
				  }
				  else{//mua vat pham
						
						let _price=this._game._parameters.get_auxiliary_price(_id);
					    let _confirm_box=this._game.createConfirmBox("Price:"+_price,"Buy this item?",()=>{
								const _cash=this._game._root_inventory.GetCash();
								//const _cash=1;
								this._game._graphics.remove_divider();
								if(_price>_cash){
									this._game.createMessageBox("Transaction Failed","Not enough money",()=>{});
									this._show_room_sound.play('fail1');
									return;
								}
								this._game._root_inventory.TakeCash(_price);
								let _new_obj={id:_id,name:_name,level:1,use:false};
								this._ship_package.add_auxiliary_object(_group_id,_new_obj);
								this._ship_package.save_data();
								this._show_room_sound.play('sucess2');
								
											let _confirm_box=this._game.createConfirmBox("Successful transaction!","Use this item?",()=>{
												this._ship_package.use_auxiliary(_group_id,_id);
												this._ship_package.save_data();
												
												this._game._graphics.remove_divider();
												_reset_icons();
											},
											()=>{
												this._game._graphics.remove_divider();
											});	
							},
							()=>{
								this._game._show_room._show_room_sound.play('click3');
								this._game._graphics.remove_divider();
							});	
				  }
				  
			  });
			  }
			  else{
				  let _label=document.createElement("div");
				  _label.style.position="absolute";
				  _label.style.top="-15px";
				  _label.style.left="-15px";
				  _label.style.width="35px";
				  _label.style.height="35px";
				  _label.style.backgroundColor="rgba(0, 0, 0, 0.7)";
				  _label.style.borderRadius="50px";
				  _label.style.color="red";
				  _label.style.justifyContent="center";
				  _label.style.display="flex";
				  _label.style.alignItems="center";
				  _label.style.fontSize="12px";
				  _label.style.fontFamily="'Courier New', Courier, monospace";
				  _label.style.fontWeight="600";
				  _label.innerHTML=`<i  style="
									background: linear-gradient(to right, red,white, orange);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
							        "'>Rank`+_ship_level_require+`</i>`;
				  
				  _icon_container.appendChild(_label);
				  _img.addEventListener("click",()=>{
					  this._show_room_sound.play('fail1');
					  this._game.createMessageBox("Message","Rank "+_ship_level_require,()=>{
						  this._game._show_room._show_room_sound.play('click3');
					  });
				  });
			  }
			  }
			  this._child_list_container.appendChild(_icon_container);
			  
			  _colID++;
			  if(_colID>=_colNum){
				_colID=0;
				_rowID++;
			  }
		  }
	  };
	
	create_child_ship_icon(){
	  if(this._child_ship_icon_1&&this._child_ship_icon_1!=null)this._child_ship_icon_1.remove();
	  if(this._child_ship_icon_2&&this._child_ship_icon_2!=null)this._child_ship_icon_2.remove();
	  
	  
	  let _child_ships_infor=this._game._parameters._auxiliary_infors;
	  //let _child_list_container;
	  //this._child_list_container=_child_list_container;
	 
		
		const _child_ship_icon_width="60px";
		this._child_ship_icon_1=document.createElement("div");
		this._child_ship_icon_1.style.position="absolute";
		this._child_ship_icon_1.style.width=_child_ship_icon_width;
		this._child_ship_icon_1.style.height=_child_ship_icon_width;
		this._child_ship_icon_1.style.top="240px";
		this._child_ship_icon_1.style.left="370px";
		this._child_ship_icon_1.style.border="2px solid turquoise";
		this._child_ship_icon_1.style.boxShadow="0 0 10px 5px green";
			let _img1=document.createElement("img");
				_img1.style.width="100%";
				_img1.style.height="100%";
				_img1.src="./resources/icons/space-gun-1.png";
				this._child_ship_icon_1.appendChild(_img1);
		document.getElementById("root-container").appendChild(this._child_ship_icon_1);
		
		this._child_ship_icon_2=document.createElement("div");
		this._child_ship_icon_2.style.position="absolute";
		this._child_ship_icon_2.style.width=_child_ship_icon_width;
		this._child_ship_icon_2.style.height=_child_ship_icon_width;
		this._child_ship_icon_2.style.top="240px";
		this._child_ship_icon_2.style.left="770px";
		this._child_ship_icon_2.style.border="2px solid turquoise";
		this._child_ship_icon_2.style.boxShadow="0 0 10px 5px green";
		this._child_ship_icon_2.style.transform="scaleX(-1)";
			let _img2=document.createElement("img");
				_img2.style.width="100%";
				_img2.style.height="100%";
				_img2.src="./resources/icons/space-gun-1.png";
				this._child_ship_icon_2.appendChild(_img2);
		document.getElementById("root-container").appendChild(this._child_ship_icon_2);
		
		this._child_ship_icon_1.addEventListener("click",()=>{
			this._show_room_sound.play('click2');
			if(this._game._warehouse.have_player_ship(this.get_focus_ship_id()))
				this._show_child_list(1);
		});
		this._child_ship_icon_2.addEventListener("click",()=>{
			this._show_room_sound.play('click2');
			if(this._game._warehouse.have_player_ship(this.get_focus_ship_id()))
				this._show_child_list(2);
		});
  }
}
export{ShowRoom}





let _percent=45;
//let _container=document.getElementById("container");

function init_processbar_1(_tcontainer,_level,_tname1,_tname2,_tscore1,_tscore2,_tvalue)
{
    var _t_distance=_tscore2-_tscore1;
    var _t_percent=(_tvalue-_tscore1)/_t_distance;
    _t_percent=Math.floor(_t_percent*100);
   //alert("Percent:"+_t_percent);
   //gradient: linear-gradient(to right, turquoise,white, yellow);
   //_style+="transform:  skewX(-20deg) scale(0.75);";
    var styles =` 
:root {
    /* color */
    --color0: hsl(229, 57%, 11%);
    --color0Trans: hsl(229, 57%, 11%, 0.85);
    --color1: hsl(228, 56%, 26%);
    --color2: hsl(170, 92%, 50%);//text color
    --color3: hsl(229, 7%, 55%);
    --color4: hsl(230, 55%, 18%);//progress bar background color
    --color5: hsl(0, 0%, 100%);
    
    /* gradient - Progress Bar Color*/
    --gradient: linear-gradient(90deg, hsl(214, 92%, 50%) 0%, hsl(170, 92%, 50%) 100%);
    
    /* font size */
    --fontSize: 14px;
    
    /* font weight */
    --regularFont: 400;
    --boldFont: 700;
}

/* reset default settings */
* {
    box-sizing: border-box;
}


@-webkit-keyframes progressLineTransmission {
    from {
        width: 0%;
    }

    to {
        width:`+_t_percent+`%;
    }
}

@keyframes progressLineTransmission {
    from {
        width: 0%;
    }

    to {
        width: `+_t_percent+`%;
    }
}


/* section2 - start */
.section2 {
    
    min-width: 450px;
    height: 75%;
    padding: 30px;
    transform:  skewX(-20deg) scale(1.0);
    position: relative;
}

.section2__text {
    color: var(--color2);
}

.section2__text--bold {
    font-weight: var(--boldFont);
}

.section2__progressBarContainer {
    margin-top: 15px;
    position: relative;
}

.section2__progressBar {
    background-color: var(--color4);
    width: 100%;
    height: 18px;
    padding: 2px;
    
    /* flex */
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.section2__progressBarRect {
    background-image: var(--gradient);
    height: 100%;
    padding: 2px;
    border-radius: inherit;
    -webkit-animation: progressLineTransmission 2.5s 0.3s ease-in-out both;
            animation: progressLineTransmission 2.5s 0.3s ease-in-out both;


    /* flex */
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.section2__progressBarCircle {
    background-color: var(--color5);
    height: calc(14px - 4px);
    width: calc(14px - 4px);
    border-radius: 50%;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}

.section2__progressBarPoint {
    color: var(--color2);
    margin-top: 8px;
    font-size: 12px;
    font-weight: var(--boldFont);
    position: absolute;
}

.section2__progressBarPoint--start {
    left: 0;
}

.section2__progressBarPoint--end {
    right: 0;
}

.section2__storageLeft {
    background-color: var(--color5);
    width: -webkit-fit-content;
    width: -moz-fit-content;
    width: fit-content;
    padding: 20px;
    border-radius: 8px 8px 0px;
    
    /* flex */
    display: flex;
    justify-content: center;
    align-items: center;

    /* position */
    position: absolute;
    top: 0;
    right: 30px;
    transform: translateY(-70%);

}

.section2__storageLeft::before {
    content: '';
    width: 0;
    height: 0;
    border: solid 20px;
    border-color: transparent var(--color5) transparent transparent;

    /* position */
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translateY(50%);

}

.section2__storageLeftDigits {
    color: var(--color0);
    font-size: 32px;
    font-weight: var(--boldFont);
}

.section2__storageLeftText {
    color: var(--color3);
    margin-left: 7px;
    font-weight: var(--boldFont);
    letter-spacing: 1px;
}
/* section2 - end */
;
`
var styleSheet = document.createElement("style")
styleSheet.innerText = styles
document.head.appendChild(styleSheet);


    
    
var _html="";
	_html+="<div class='section2' id='processbar-container'>";
    _html+="<p class='section2__text'>Level "+_level+"</p>";
    _html+="<div class='section2__progressBarContainer'>";
      _html+="<div class='section2__progressBar'>";
        _html+="<div class='section2__progressBarRect'>";
          _html+="<span class='section2__progressBarCircle'></span>";
        _html+="</div>";
      _html+="</div>";
      _html+="<span class='section2__progressBarPoint section2__progressBarPoint--start'>"+_tname1+""+_tscore1+"</span>";
      _html+="<span class='section2__progressBarPoint section2__progressBarPoint--end'>"+_tname2+""+_tscore2+"</span>";
    _html+="</div>";
    //_html+="<div class='section2__storageLeft'>";
      //_html+="<span class='section2__storageLeftDigits'>185</span>";
      //_html+="<span class='section2__storageLeftText'>GB Left</span>";
    _html+="</div>";
  _html+="</div>";
 
  _tcontainer.innerHTML=_html;
  
  
};

