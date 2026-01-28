import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';

import {  CSS2DObject } from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/renderers/CSS2DRenderer.js';

import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/loaders/GLTFLoader.js';
import {GUI} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/libs/dat.gui.module.js';

import {controls} from './controls.js';
import {SpaceShipGame} from './space-ship-game.js';
import {terrain} from './terrain.js';
import {visibility} from './visibility.js';

import {PlayerShip1} from './player-ship-1.js';
import {PlayerShip2} from './player-ship-2.js';

import {HumanEntity} from './human.js';

import {Universe} from './core/universe.js';


import {Unit} from './units/unit.js';

import {ExplodeParticles} from './explode-particles.js';
import {ExplodeParticles_1} from './explode-particles-1.js';
import {ExplodeParticles_2} from './explode-particles-2.js';

import {MissionMG} from './mission-mg.js';
import {MissionMG2} from './missions/mission-mg-2.js';

import {Teleport1} from './effects/teleport-1.js';
import {DemoEffect} from './effects/demo-effect.js';
import {DemoEffect2} from './effects/demo-effect-2.js';

import {LightingBall} from './units/skills/lighting-ball.js';

import {SolarSystem} from './core/solar-system.js';

import {SpaceShip1} from './units/space-ship-1.js';
import {SimpleLaserShip} from './units/simple-laser-ship.js';

import {SpaceGameMap} from './space-game-map.js';
import {SoundManager} from './sound-manager.js';

import {ShowRoomRocketPanel} from './show-room-rocket-panel.js';
import {Rocket5} from './units/rocket-5.js';
let _APP = null;

let _universe=null;
//let _coordinates=document.getElementById("coordinates");
//_coordinates.remove();
let _px,_py,_pz;
let _posx=100000;
let _fy=100000;
let _posz=100000;
let _posy=_fy;
let _tunnel_length=3000;
let _tunnel_width,_tunnel_height;
//let _tunnel_width=300;
//let _tunnel_height=_tunnel_width;
let _tunnel_parts=new Array();
let _maxX=_posx+_tunnel_width/2;
let _minX=_posx-_tunnel_width/2;
let _maxZ=_posz+_tunnel_height/2;
let _minZ=_posz-_tunnel_height/2;
let kill_num=0;

let _col_pos_num=3;//de tinh' cac vi tri cho enemy-pos
let _row_pos_num=8;

const _KILL_one_enemy_score=29;//so diem tuong ung voi 1 enemy-ship bi tieu diet
const _HP_max_score=1250;//cang mat' nhieu HP thi diem? cang thap'
const _AM_max_score=1250;//cang` mat nhie giap' thi diem? cang thap'
const _ROCKET_max_score=1250;//cang` ban' nhieu rocket thi diem cang thap
const _SKILL_max_score=1250;//cang su dung nhieu skill thi diem cang thap
const _ROCKET_minus_score=20;//so diem bi tru` di voi 1 qua rocket duoc ban' ra
const _SKILL_minus_score=20;

let _item_name="space-tunnel-level";
let _game_level=null;

let _show_tunnel=false;

let _total_ship_num=0;
let _type_num=null;
let _min_enemy_ship_type=1;//số lượng loại enemy-ship xuất hiện tại level 1
let _min_wave=4;//so luong wave tai level 1
let _min_ship_num_in_wave=1;//so luong enemy-ship trong wave dau tien tai level 1
let _wave_num=_min_wave;

let _enemy_waves=null;

class ProceduralTerrain_Demo extends SpaceShipGame {
  constructor() {
	 
    super({game_id:1,
	load_unit_model_complete:()=>{
		if(this.System.isMobileDevice()){
			_tunnel_width=400;//tren mobile neu tunnel size nho? qua' se rat kho choi
		}
		else{
			_tunnel_width=300;//can dam bao du? nho? de player-ship ko the quay dau`
		}
		_tunnel_height=_tunnel_width;
		
		_game_level=this.get_data_in_database(_item_name);
				if(_game_level===null)_game_level=1;
				else _game_level=parseInt(_game_level)+1;
				if(localStorage.getItem('demo-game-level')!=null&&localStorage.getItem('demo-game-level')!="null"){
					_game_level=parseInt(localStorage.getItem('demo-game-level'));
				}
				
				const distance = 2000;
			    const direction = new THREE.Vector3(0, 0, -1);// Tạo một vector hướng về phía trước (trục Z âm trong không gian local của camera)
				direction.applyQuaternion(this._graphics.Camera.quaternion);// Biến đổi vector direction từ local space sang world space
				direction.multiplyScalar(distance);// Nhân hướng với khoảng cách
				const frontPosition = new THREE.Vector3().copy(this._graphics.Camera.position).add(direction);// Lấy vị trí hiện tại của camera và cộng với vector đã tính
				const _gltf=this._unitMG._data_list["missile-1"];
			    const _t_model = _gltf.scene.children[0].clone();//load truoc 1 lan, de game ko bi giat
				this._graphics.Scene.add(_t_model);
				_t_model.position.copy(frontPosition);
				this.add_to_timer(()=>{
					//this._graphics.Scene.remove(_t_model);
				},3);	

				
				
		const _waves_infor=this.init_waves();
		_enemy_waves=_waves_infor.waves;
		const _names=_waves_infor.names;
		//const _model_id_list=new Array();
		let _loader;
		let _counter=0;
		for(let i=0;i<_names.length;i++){
			//_model_id_list.push(this._unitMG.get_enemy_ship_model_id(_names[i]));
			const _model_id=this._unitMG.get_enemy_ship_model_id(_names[i]);
			const _model_path=this._unitMG.get_model_file_path(_model_id);
			_loader= new GLTFLoader();
			_loader.load(_model_path,( gltf )=> {
				this._unitMG._data_list[_model_id]=gltf;
				
				const model = gltf.scene.children[0].clone();
				this._graphics.Scene.add(model);//load truoc 1 lan, de game ko bi giat
				model.position.copy(frontPosition);
				this.add_to_timer(()=>{
					//this._graphics.Scene.remove(model);
				},3);
				
				_counter++;
				if(_counter===_names.length){//load complete
					
					this.load_game_sounds();
				}
			});
		}
		
	}});
	
	
	
	this._graphics.init_lasers();
	
	this.enable_window_resize_event_listener();
	
	_last_pos.position.copy(this._graphics.Camera.position);
	
  }
  
  load_game_sounds(){
		let _sounds=new SoundManager({game:this});
		let _audio=[
				{ id: 'startup', url: './resources/audio/ufo-fly-306429.mp3' },
				
			];
		_sounds.add_callback_function(()=>{
				this.create_menu_btton();
		
			    this._unitMG.create_player_entity();	
			    this._entities['player']._lock_speed_up_skill=true;
				
				//this.init_auto_mode();//auto attack
		
				this._navigator_bar_2._lock_reset_rotation=true;
				this._navigator_bar_2._lock_turn_back_skill=true;
				this._me._lock_speed_up_skill=true;
				this._me._arrow_only_target_front_target=true;
		
				this.create_space_tunnel();
				this._gear_box.hide_panel();
				let _p_pos=this._entities['player'].Position;
				this._navigator_bar_1.hide();
				this._navigator_bar_2.hide();
				this._navigator_bar_1.lock_mouse_event();
				this._navigator_bar_2.lock_mouse_event();
				//this._noticeBoard.hide();
				//this._graphics.create_center_div();
		
				//this._editModeCenter.show_main_button();
				
				//--------------------------------------
				let _data_name='space-tunnel-mode-play-data';//so lan choi game
				let _play_data=this.get_data_in_database(_data_name);
				let _reset_play_data=()=>{
					_play_data={play_num:0};
					this.update_data_in_database(_data_name,_play_data);
				};
				if(_play_data===null){
					_reset_play_data();
				}
				this._get_play_num=()=>{
					return _play_data.play_num;
				};
				this._increase_play_num=()=>{
					_play_data.play_num++;
					this.update_data_in_database(_data_name,_play_data);
			
					return true;
				};
				this._increase_play_num();
				
				let _play_num=this._get_play_num();
				//---------------------------------
				
				this.lock_all_weapon_and_skill();
				
				//---------------------------------
		
				this._graphics.removeLoadingScreen();
				_sounds.play('startup');
				this._entities["_controls2"]._lock_turn_backward=true;
				let _created=false;
				let _create_start_btn=()=>{
					if(_created)return;
					_created=true;
					
					//this.init_game_mission();
					//document.getElementById("root").style.visibility="hidden";
					
					
					this.enable_mouse_controlled_mode(()=>{
						if(_play_num<2){
							if(!this.System.isMobileDevice())
								this.create_guide_list(()=>{this.init_game_mission();});
							else
								this.init_game_mission();
						}
						else
						{
							this.init_game_mission();
							
							
						}
						
						let _notice_container=document.createElement("div");
								_notice_container.style.position="absolute";
								_notice_container.style.left="650px";
								_notice_container.style.bottom="20px";
								//_notice_container.style.color="white";
								//_notice_container.style.fontSize="20px";
								//_notice_container.style.fontFamily="'Orbitron', sans-serif";
							let _line=document.createElement("h3");
							    _line.style.cssText=`
									background: linear-gradient(to bottom, red,white, yellow);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
									font-size: 16px;
									font-weight: bold;
									font-family: 'Orbitron', sans-serif;
								`;
								_notice_container.appendChild(_line);
								
								this._root_div.appendChild(_notice_container);
								
							this.add_to_every_second_passes_fcs(()=>{
								let _text=``;
								const _main_skill_ready=this._me.all_main_skill_ready();
								const _sub_skill_ready=this._me.all_sub_skill_ready();
								const _rocket_ready=this._me._rocket_package.can_launch_rocket();
								if(_main_skill_ready){
									_text=`main skill ready - double left click`;
									
								}
								else{
									if(_sub_skill_ready)
										_text=`sub skill ready - double right click`;
									else{
										if(_rocket_ready)
											_text=`missile skill ready - right click`;
									}
								}
								_line.innerHTML=_text;
								//this._noticeBoard.add_message(_text,4000,()=>{});
							});
							
							//document.getElementById("root").style.visibility="hidden";
					});
					
				};
				this.enable_weapons_ready_notice();
				let _option_fc=()=>{
					this.create_sub_skills_list(()=>{
							this.create_rocket_panel(()=>{this.create_sub_rocket_panel(_create_start_btn)});
						});
				};
				this.add_to_timer(()=>{
					this.show_mouse_controls_intro_panel(()=>{
						_option_fc();
						_option_fc=()=>{};
					});
				},5);
				
				
		});
		_sounds.load_sounds(_audio);
	}
  
  create_rocket_panel(_fc){
	  let _rocket_panel=new ShowRoomRocketPanel({
				game:this,
				ship_package:this._me._ship_package,
				root_ui:this._root_div,
				close_panel_callback:()=>{
					_fc();
					try{
						this._me.init_rocket_panel();
						this._me._rocket_package.change_visibility();
					}
					catch(e){alert(e.stack);}
				},
			});
		_rocket_panel.init();
  }
  
  create_guide_list(){//huong dan cach choi
		if(this._guide_panel&&this._guide_panel!=null)
			this._guide_panel.remove();
		
		let _container=document.createElement("div");
		_container.style.cssText=`
			position:absolute;
			top:100px;
			left:40px;
			width:400px;
			height:250px;
			overflow:visible;
			font-size:18px;
			color:white;
			display: flex;
			flex-direction: column;
			align-items: left; 
		`;
		if(!this._current_guide_id)
			this._current_guide_id=0;
		
		let _passed_one_guide;
		
		let _show_result=()=>{
			let _intro_container=document.createElement("div");
			_intro_container.classList.add("sp-container");
			_intro_container.innerHTML=`
				<div class="sp-content">
				<h2 class="frame-1">GOOD!</h2>
				</div>
			`;
		    this._root_div.appendChild(_intro_container);
			this.add_to_timer(()=>{
				_intro_container.remove();
			},3);
		};
		
		
		let _lock_all=()=>{
			this.lock_all_weapon_and_skill();
		}
		let _unlock_all=()=>{
			this.unlock_all_weapon_and_skill();
		};
		_lock_all();
		
		let _color1='yellow';
		let _color2='red';
		let _color3='turquoise';
		if(!this._guide_list)
			this._guide_list=[
			{id:1,text:`<b style="color:`+_color3+`">Press</b> and <b style="color:`+_color3+`">hold</b> <b style="color:`+_color1+`">LEFT MOUSE</b> to <b style="color:`+_color2+`">Fire</b>`,
				  passed:false,img:`./resources/gif/mouse-click.gif`,
				  flip_img_vertical:false,
				  pass_function:()=>{
					  _lock_all();
					  let _lock=false;
					  let lastClickTime = null;
					  let _mouse_down=(event)=>{
						  event.preventDefault();
						  if(event.button === 0){
							  if(_lock)
								return;
							  //const currentTime = new Date().getTime();
							  lastClickTime=new Date().getTime();
							
							  _lock=true;
							  this._entities["_controls2"].unlock_default_weapon();
								//_passed_one_guide(this._current_guide_id);
						  }
					  };
					  document.body.addEventListener("mousedown",_mouse_down);
					  
					  let _mouse_up=(event)=>{
							event.preventDefault();
							if(!_lock)
								return;
							_lock=false;
							const currentTime = new Date().getTime();
							const delta = currentTime - lastClickTime;
							if(delta>=800){
								_lock=true;
								document.body.removeEventListener("mousedown",_mouse_down);
								document.body.removeEventListener("mouseup",_mouse_up);
								//this._entities["_controls2"].lock_default_weapon();
								//this._entities["_controls2"].unlock_default_weapon();
								_lock_all();
								_passed_one_guide(this._current_guide_id);
								return;
							}
					  }
					  document.body.addEventListener("mouseup",_mouse_up);
				  }},
			{id:2,text:`<b style="color:`+_color3+`">Double left click</b> to perform <b style="color:`+_color1+`">special skill</b>`,passed:false,img:`./resources/gif/mouse-click.gif`,
				  flip_img_vertical:false,
				  pass_function:()=>{
					  this._me.unlock_all_main_skill();
					  let _lock=false;
					  let clickCount = 0;
					  let lastClickTime = 0;
					  let lastClickTime2=0;
					  document.body.addEventListener("mousedown",(event)=>{
						  event.preventDefault();
						  if(event.button === 0){
							  const currentTime = new Date().getTime();
							  const clickDelta = currentTime - lastClickTime;
							  const isDoubleClick = clickDelta < 250; // Adjust the threshold as needed
							  lastClickTime = currentTime;
							  if(_lock)
								return;
							
							if(isDoubleClick){
								_lock=true;
								_lock_all();
								_passed_one_guide(this._current_guide_id);
							}

							
						  }
					  });
				  }},
			{id:3,text:`<b style="color:`+_color3+`">Right click</b> to launch <b style="color:`+_color1+`">rocket</b>`,passed:false,img:`./resources/gif/mouse-click.gif`,
				  flip_img_vertical:true,
				  pass_function:()=>{
					  this._me._rocket_package.unlock_rocket();
					  let _lock=false;
					  document.body.addEventListener("mousedown",(event)=>{
						  event.preventDefault();
						  if(event.button === 2){
							  if(_lock)
								return;
							_lock=true;
							/*chua ro vi sao ko tu dong launch rocket*/
							this._me._rocket_package.require_launch_current_rocket_id();
							_lock_all();
							_passed_one_guide(this._current_guide_id);
						  }
					  });
				  }},
			{id:4,text:`<b style="color:`+_color3+`">Double right click</b> to perform <b style="color:`+_color1+`">sub skill</b>`,passed:false,img:`./resources/gif/mouse-click.gif`,
				  flip_img_vertical:true,
				  pass_function:()=>{
					  this._me.unlock_all_sub_skill();
					  let _lock=false;
					  let clickCount = 0;
					  let lastClickTime = 0;
					  let lastClickTime2=0;
					  document.body.addEventListener("mousedown",(event)=>{
						  event.preventDefault();
						  if(event.button === 2){
							  const currentTime = new Date().getTime();
							  const clickDelta = currentTime - lastClickTime;
							  const isDoubleClick = clickDelta < 250; // Adjust the threshold as needed
							  lastClickTime = currentTime;
							  if(_lock)
								return;
							
							if(isDoubleClick){
								_lock=true;
								_unlock_all();
								_passed_one_guide(this._current_guide_id);
							}

							
						  }
					  });
				  }},
			
		];
		
		let _guide_list=this._guide_list;
		_passed_one_guide=(_guide_id)=>{//Khi pass 1 guide
			this.add_to_timer(()=>{
					//this._sound.speak("GOOD!");
					_show_result();
				},1);
			this._guide_list[_guide_id].passed=true;
			this._current_guide_id++;
			let _found=false;
			for(let i=0;i<_guide_list.length;i++){
				let _passed=_guide_list[i].passed;
				if(!_passed){
					_found=true;
					break;
				}
			}
			if(_found){//NEXT GUIDE
					//this._guide_panel.remove();
					this.add_to_timer(()=>{
						this.create_guide_list();
					},4);
					return;
			}
			else{//FINISH
					
					this.add_to_timer(()=>{
						this._guide_panel.remove();
						//this.init_game_mission();
						location.reload();//neu init mission luon thi se bi loi enemy-laser-ship ko ban ra tia laser
					},4);
					return;
			}
		};
		
		for(let i=0;i<_guide_list.length;i++){
			let _passed=_guide_list[i].passed;
			if(!_passed){
				this._current_guide_id=i;
				break;
			}
		}
		//alert(this._current_guide_id);
		for(let i=0;i<_guide_list.length;i++){
			let _id=_guide_list[i].id;
			let _text=_guide_list[i].text;
			let _passed=_guide_list[i].passed;
			let _descript_img_path=_guide_list[i].img;
			let _flip_img_vertical=_guide_list[i].flip_img_vertical;
			let _pass_fc=_guide_list[i].pass_function;
			
			let _line=document.createElement("div");
				_line.style.display="flex";
				
				_line.addEventListener("click",()=>{
					if(this._lock)return;
					
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
			let _icon_img=document.createElement("img");
				_icon_img.style.width="100%";
				_icon_img.style.height="100%";
				
				if(_passed)
					_icon_img.src=`./resources/icons/true-1.png`;
				else
					_icon_img.src=`./resources/icons/false-1.png`;
				
				_line.appendChild(_icon);
				_icon.appendChild(_icon_img);
			
			    _line.innerHTML+=`<i>`+_text+`</i>`;
			_container.appendChild(_line);
			
			if(i===this._current_guide_id){
				let _arrow=document.createElement("img");
					_arrow.style.position="absolute";
					_arrow.style.left="-30px";
					_arrow.style.width="30px";
					_arrow.style.height="30px";
					_arrow.src="./resources/gif/arrow-2.gif";
					_line.appendChild(_arrow);
					
				let _descript_img=document.createElement("img");
				    //_descript_img.src=_descript_img_path;
					if(_flip_img_vertical)
						_descript_img.style.transform="scaleX(-1)";
					_descript_img.style.width="100px";
					_descript_img.style.height="100px";
					_descript_img.style.position="absolute";
					_descript_img.style.bottom="0px";
					_descript_img.style.left="50px";
					
					_pass_fc();
				
				//const utterance = new SpeechSynthesisUtterance(_text);
				//this._sound.speak(_text);
				//_container.appendChild(_descript_img);
			}
			
		}
		
		this._root_div.appendChild(_container);
		
		this._guide_panel=_container;
	}
  
  get_tunnel_pos(){
	  return {x:_posx,y:_posy,z:_posz};//posy la pos ban dau
  }
  
  enable_test_mode(){
	  this.init_space_tunnel_game_test_mode({
				game_level:50,
				player_ship_id:3,
				player_ship_level:100,
				main_skill_level:10,
				rockets:[
					//{rocket_id:1,rocket_num:0},
					//{rocket_id:2,rocket_num:0},
					{rocket_id:3,rocket_num:49},
					//{rocket_id:4,rocket_num:0},
					//{rocket_id:5,rocket_num:0},
					//{rocket_id:6,rocket_num:48},
					//{rocket_id:7,rocket_num:49},
					//{rocket_id:8,rocket_num:49},
				],
				add_skill_id:2001,
				add_skill_level:10,
				pass_skill_id:8,
				pass_skill_level:10,
				left_auxiliary:{
					id:1,
					level:10
				},
				right_auxiliary:{
					id:6,
					level:10
				},
			});
  }
  
  create_tunnel_part(tunnel_width,tunnel_height,tunnel_length,tunnel_pos,texture){
	  this._part_counter++;
    const material = new THREE.MeshBasicMaterial( { map: texture } );
	//const material = new THREE.MeshBasicMaterial({wireframe:false});

	material.side=THREE.DoubleSide;
	material.transparent=true;
	material.opacity=0.1;
      
	  const geometry = new THREE.BoxGeometry( tunnel_width,tunnel_length,tunnel_height); 
	  //geometry.faces.splice(8, 2); // Loại bỏ mặt sau
	  geometry.faces.splice(6, 2); // Loại bỏ mặt thứ hai (mặt có z = -3/2)
      geometry.faces.splice(4, 2); // Loại bỏ mặt thứ ba (mặt có y = 1/2)
	  //const material = new THREE.MeshBasicMaterial( {color: 0x00ff00,side:THREE.DoubleSide} ); 
	  const cube = new THREE.Mesh( geometry, material ); 
	  this._graphics.Scene.add( cube );
	  cube.position.copy(tunnel_pos);
	  this._me._model.position.copy(cube.position);
	  const _look_pos=cube.position.clone();
	  _look_pos.y-=1000;
	  this._me._model.lookAt(_look_pos);
	  
	  cube.visible=_show_tunnel;
	  
	  return cube;
  }
  
  show_tunnel(){
	  if(_show_tunnel)return;
	  _show_tunnel=true;
	  for(let i=0;i<_tunnel_parts.length;i++)
		  _tunnel_parts[i].visible=true;
  }
  hide_tunnel(){
	  if(!_show_tunnel)return;
	  _show_tunnel=false;
	  for(let i=0;i<_tunnel_parts.length;i++)
		  _tunnel_parts[i].visible=false;
  }
  
  create_space_tunnel(){
	  const texture = new THREE.TextureLoader().load('./resources/textures/loop-13.jpg');
	  
	  this._part_counter=-1;
	  for(let i=0;i<25;i++){//tao tunnel bao gom nhieu hinh hop chu nhat noi tiep nhau
		//const _posy=_fy+(i*_tunnel_length);
		_posy+=_tunnel_length;
		const _tunnel_pos=new THREE.Vector3(_posx,_posy,_posz);
		const _part=this.create_tunnel_part(_tunnel_width,_tunnel_height,_tunnel_length,_tunnel_pos,texture);
		_tunnel_parts.push(_part);
		
	  }
		
		let _map=new SpaceGameMap({game:this});
			_map._preload(()=>{
				_map.init(_game_level);
			})
		this._spaceMap=_map;
		//let _hide_tunnel=false;
		/*
	  let _last_pos=this._me.Position;
	  this.add_to_every_second_passes_fcs(()=>{
		  const _my_pos=this._me.Position;
		  if(_my_pos.y<_last_pos.y){
			  //this._StopGame(false);
			  this._me.TakeDamage(this._me.Health*2);
			  return false;
		  }
		  _last_pos.copy(_my_pos);
	  });
	  */
	  this.add_to_update_function_list(()=>{
		  const _my_pos=this._me.Position;
		  
		  const _distance_alert=25;//khi den' cach tunnel 1 khoang thi canh bao'
		  if(_my_pos.x>_maxX-_distance_alert||_my_pos.x<_minX+_distance_alert||_my_pos.z>_maxZ-_distance_alert||_my_pos.z<_minZ+_distance_alert){
			  this.show_tunnel();
			  this._me.look_at(new THREE.Vector3(_posx,this._me.Position.y+1000,_posz));
			  //_hide_tunnel=true;
			  this.add_to_timer(()=>{
				 
				  this.hide_tunnel();
				  //_hide_tunnel=false;
			  },2);
		  }
		  else{
			  //this.hide_tunnel();
		  }
		  if(_my_pos.x>_maxX||_my_pos.x<_minX||_my_pos.z>_maxZ||_my_pos.z<_minZ){//va cham vao tunnel
			  //this._StopGame(false);	  
			  let _health=this._me._health;
			  this._me.TakeDamage(_health*2);
		  }
		  const _first_part=_tunnel_parts[0];//xoa bo part dau tien, tao them 1 part cuoi' cung
		  if(_my_pos.y<_first_part.position.y-(_tunnel_length/2)+(_tunnel_length/5)){
			  //this._StopGame(false);
			   let _health=this._me._health;
			  this._me.TakeDamage(_health*2);
		  }
		  
		  if(_my_pos.y>_first_part.position.y+_tunnel_length*2){
			  this._graphics.Scene.remove(_first_part);
			  _tunnel_parts.splice(0,1);
			  
			  _posy+=_tunnel_length;
			  const _part=_tunnel_parts[1].clone();
			  this._graphics.Scene.add(_part);
			  _part.position.set(_posx,_posy,_posz);
			 
		      _tunnel_parts.push(_part);
		
		  }	 
	  });
	
	 
  }
  
  create_connect_laser_ships_in_tunnel_part(part,style){
	let _pos1=part.position.clone();
		_pos1.x-=(_tunnel_width/2-50);
	let _pos2=_pos1.clone();
		_pos2.x+=(_tunnel_width-40);
	let _pos3=part.position.clone();
		_pos3.z-=(_tunnel_height/2-50);
	let _pos4=part.position.clone();
		_pos4.z+=(_tunnel_height/2-50);
	
	if(!this._connect_laser_ships_counter)this._connect_laser_ships_counter=0;
	
	if(style===1){
		this._connect_laser_ships_counter++;
		if(this._connect_laser_ships_counter%2===0)
			this.create_connect_laser_ships_1(_pos1,_pos2,"Z");
		else
			this.create_connect_laser_ships_1(_pos3,_pos4,"X");
		return;
	}
	if(style===2){
		this.create_connect_laser_ships_2(_pos1,_pos2,1);
		this.create_connect_laser_ships_2(_pos1,_pos2,-1);
		return;
	}
  }
  
  create_laser_ship(_pos){
	  let _ship=this._unitMG.createSimplePhotonShip(_pos);
	  _ship._target_object=this._me;
	  _ship._model.scale.multiplyScalar(0.6);
	  this._graphics.Scene.add(_ship._model);
	  return _ship;
  }
  create_connect_laser_ships(_pos1,_pos2){
	  let _ship1=this.create_laser_ship(_pos1);
	  let _ship2=this.create_laser_ship(_pos2);
		  _ship1.ConnectShip(_ship2);
	  //if(!this._counter2)this._counter2=0;
      let _update_fc=()=>{
		  if(this._me.Position.y>_ship1.Position.y+50){
			  this.remove_function_from_list_4(_update_fc);
			  _ship1.SelfDestroy();
			  _ship2.SelfDestroy();
			  //this._counter2++;
			  //this._noticeBoard.add_message("Clear!-"+this._counter2);
		  }	  
	  };	  
	  this.add_to_function_list_4(_update_fc);
		
	  return [_ship1,_ship2];
  }
  
  create_connect_laser_ships_1(_pos1,_pos2,_direct){//_direct==="Z" hoac "X" 
	let _ships=this.create_connect_laser_ships(_pos1,_pos2);
	let _ship1=_ships[0];
	let _ship2=_ships[1];
	
	let _speed=50;
	let _update_fc=(t)=>{
		if(_direct==="Z"){
			_ship1._model.position.z+=t*_speed;
			_ship2._model.position.z+=t*_speed;		  
			if(_speed>0&&_ship1._model.position.z>(_posz+_tunnel_height/2)-50)
				_speed=-_speed;
			if(_speed<0&&_ship1._model.position.z<(_posz-_tunnel_height/2)+50)
				_speed=-_speed;
			return;
		}
		if(_direct==="X"){
			_ship1._model.position.x+=t*_speed;
			_ship2._model.position.x+=t*_speed;		  
			if(_speed>0&&_ship1._model.position.x>(_posx+_tunnel_width/2)-50)
				_speed=-_speed;
			if(_speed<0&&_ship1._model.position.x<(_posx-_tunnel_width/2)+50)
				_speed=-_speed;
			return;
		}
	};
			  
	this.add_to_update_function_list(_update_fc);
	let _after_dead_fc=()=>{
		this.remove_function_from_update_list(_update_fc);
	};
	_ship1.add_to_after_dead_function_list(_after_dead_fc);
	_ship2.add_to_after_dead_function_list(_after_dead_fc);
  }
  
  create_connect_laser_ships_2(_pos1,_pos2,_direct){//_direct=1 hoac -1. De xac dinh chieu` chuyen dong
	let _ships=this.create_connect_laser_ships(_pos1,_pos2);
	let _ship1=_ships[0];
	let _ship2=_ships[1];
			  
	let _speed1=50*_direct;
	let _speed2=-50*_direct;
	let _update_fc=(t)=>{
		_ship1._model.position.z+=t*_speed1;
		_ship2._model.position.z+=t*_speed2;
				  
		if(_speed1>0&&_ship1._model.position.z>(_posz+_tunnel_height/2)-50)
			_speed1=-_speed1;
		if(_speed1<0&&_ship1._model.position.z<(_posz-_tunnel_height/2)+50)
			_speed1=-_speed1;
				  
		if(_speed2>0&&_ship2._model.position.z>(_posz+_tunnel_height/2)-50)
			_speed2=-_speed2;
		if(_speed2<0&&_ship2._model.position.z<(_posz-_tunnel_height/2)+50)
			_speed2=-_speed2;
		};
			  
	this.add_to_update_function_list(_update_fc);
	let _after_dead_fc=()=>{
		this.remove_function_from_update_list(_update_fc);
	};
	_ship1.add_to_after_dead_function_list(_after_dead_fc);
	_ship2.add_to_after_dead_function_list(_after_dead_fc);
  }
  
  
  update_enemy_ship_position(_t,_enemy_ship,_distance_to_player){
	  const _player_pos=this._me.Position;
	  const _dy=_enemy_ship.Position.y-_player_pos.y;
	  if(_dy<_distance_to_player){
		_enemy_ship.Position.y+=(_distance_to_player-_dy);
	  }
	  else if(_dy>_distance_to_player+100){
		  _enemy_ship.Position.y-=_t*200;
	  }
  }
  
  get_position_in_row_1(_front_pos,_spaceY,_pos_num,_id){//cac vi tri nam tren 1 duong thang
	  const _full_layers=this.generate_position_layers(_front_pos,_pos_num,_spaceY);
	  const _rs=new Array();
	  for(let i=0;i<_full_layers.length;i++){
		  _rs.push(_full_layers[i][_id]);
	  }
	  return _rs;
  }
  
  get_random_positions_1(_front_pos,_layers_num,_spaceY,_pos_num){
	  const _full_layers=this.generate_position_layers(_front_pos,_layers_num,_spaceY);//alert(_full_list);
	  const _pos_ids1=new Array();
	  const _num=_col_pos_num*_row_pos_num;
	  for(let i=0;i<_num;i++)_pos_ids1.push(i);
	  const _pos_ids2=shuffle_array(_pos_ids1);
	  
	  const _pos_list=new Array();
	  for(let i=0;i<_pos_num;i++){
		  const _rand_id=_pos_ids2[i];
		  const _rand_layer=this._utils.get_random_in_range(0,_layers_num-1);
		  _pos_list.push(_full_layers[_rand_layer][_rand_id]);
	  }
	  
	  return _pos_list;
  }
  generate_position_layers(_front_pos,_layers_num,_spaceY){//tra ve toa do tren nhieu mat phang(layers)
	  let _rs=new Array();
	  for(let i=0;i<_layers_num;i++){
		  const _f_pos=_front_pos.clone(); 
		  _f_pos.y+=(i*_spaceY);
		  const _t_list=this.generate_positions(_f_pos);
		  _rs.push(_t_list);
	  }
	  return _rs;
  }
  
  generate_positions(_front_pos){//nhap vao toa do phia truoc player-ship, tra ve 1 list position nam tren 1 mat phang
		  let _pos_list=new Array();
		  const _col_num=_col_pos_num;
		  const _row_num=_row_pos_num;
		  const _num=_col_num*_row_num;
		  const _fx=(_posx-_tunnel_width/2)+100;
		  const _fz=(_posz-_tunnel_height/2)+100;
		  const _px=25;
		  const _pz=25;
		  
		  let _col_id=0;
		  let _row_id=0;
		  
		  for(let i=0;i<_num;i++){
				
				const _new_pos=new THREE.Vector3();
				_new_pos.y=_front_pos.y;
				_new_pos.x=_fx+(_px*_col_id);
				_new_pos.z=_fz+(_pz*_row_id);
			
				_pos_list.push(_new_pos);
				//console.log(_new_pos.x+" and "+_new_pos.z);
				_col_id++;
				if(_col_id>=_col_num){
					_col_id=0;
					_row_id++;
				}
		}
		_pos_list.reverse();
		
		return _pos_list;
  }
  
  update_game_infor(_game_level,_wave,_wave_num,_total_ship_num){
	  if(!this._level_infor_div){
		  this._level_infor_div=document.createElement("div");
		  this._level_infor_div.style.position="absolute";
		  this._level_infor_div.style.bottom="20px";
		  this._level_infor_div.style.left="0px";
		  this._level_infor_div.style.width="100%";
		  this._level_infor_div.style.height="30px";
		  this._level_infor_div.style.textAlign="center";
		  this._level_infor_div.style.color="white";
		  //_level_infor.style.fontSize="30px";
		  this._root_div.appendChild(this._level_infor_div);
	  }
	  
	  let _level_infor_content=`<p style="
									background: linear-gradient(to bottom, turquoise,white, yellow);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
									font-size:20px;
									font-weight: bold;
				">`;	
				_level_infor_content+="Level: "+_game_level;
				_level_infor_content+=" | ";
				_level_infor_content+="Wave: "+_wave+"/"+_wave_num;
				_level_infor_content+=" | ";
				_level_infor_content+="Ships: "+_total_ship_num;
          _level_infor_content+="</p>";	 

		  this._level_infor_div.innerHTML=_level_infor_content;
	   
  }
  
  
  /*
	Do kho' cua game duoc tang len theo game-level chu khong phai tinh' theo level cua player
	game-level duoc +1 sau khi player complete mission
	level cua enemy-ship cung duoc tang len theo game-level chu ko phu thuoc vao player-level
	Game-level ko gioi' han. Cho nen enemy-ship-level cung ko gioi han: _enemy_ship._ship_package._max_ship_level=_game_level+100;
  */
  
  init_waves(){
	   /*xap xep theo thu tu tu de~ den' kho'*/
	  let _normal_ships=this._unitMG.get_full_enemy_normal_ship_name_1();
	  /*Thinh thoang xuat hien theo quy luat*/
	  let _special_ships=this._unitMG.get_full_enemy_special_ship_name_1();
	   let _turn_num_1=Math.floor(_game_level/8);//cu 8 round thi loai bo 1 e-unit
	  for(let i=0;i<_turn_num_1;i++){//loai bot' cac enemy ship yeu'
		  if(_normal_ships.length>7)_normal_ships.shift();
	  }
	  
	  
	  let _increase_ship_num_next_wave=1;//so luong enemy-ship tang len sau moi 1 wave
	  let _increase_ship_num_level_require=6;//so level vuot qua duoc se tang so luong ship sau moi wave(VD:wave 1 co 1 ship thi wave 2 co 1+n*1 ship)
	  let _increase_type_level_require=3;//so level sau khi vuot qua se tang so luong enemy-ship type len 1
	  let _increase_num_level_require=5;//so level sau khi vuot qua se tang so luong enemy-ship trong 1 wave(tang len 1)
	  let _increase_wave_num_level_require=4;//so level sau khi vuot qua se tang so luong wave len 1
			
		 
		  _increase_ship_num_level_require+=Math.floor(_game_level/10);//cu 10 level thi tang them 1
		  _increase_num_level_require+=Math.floor(_game_level/10);//cu 10 level thi tang them 1
		  _increase_wave_num_level_require+=Math.floor(_game_level/10);//cu 10 level thi tang them 1
		  _increase_type_level_require+=Math.floor(_game_level/10);//cu 10 level thi tang them 1
	  
	  let _waves=new Array();
	  
	  
	  if(_game_level>_increase_wave_num_level_require)_wave_num+=1;
	  
	  /*----------------*/
	  //Neu giu lai doan nay thi cac phep tinh wave-num phia tren coi nhu ko co'
		if(_game_level<5)
			_wave_num=4;
		else{
			if(_game_level<11)
				_wave_num=5;
			else{
				if(_game_level<31)
					_wave_num=6;
				else{
					if(_game_level<51)
						_wave_num=7;
					else
						_wave_num=8;
				}
			}
		}
	  /*----------------*/
	  
	  _type_num=_min_enemy_ship_type+Math.floor(_game_level/_increase_type_level_require);
		  if(_type_num>_normal_ships.length)_type_num=_normal_ships.length;
		  let _types=new Array();
	      for(let i=0;i<_type_num&&i<_normal_ships.length;i++)_types.push(_normal_ships[i]);
	  let _min_num_in_wave=_min_ship_num_in_wave+Math.floor(_game_level/_increase_num_level_require);//so luong ship tai level 1
	  let _add_num_next_wave=_increase_ship_num_next_wave+Math.floor(_game_level/_increase_ship_num_level_require);//số lượng ship tăng lên sau mỗi wave(cấp số cộng)
		  _add_num_next_wave=1;//can xem xet co nen đặt giá trị lớn hơn 1 ko
	  
	  
	  let _w_counter=0;
	  let _min_type_rate=2;//VD: có 4 ship thì số type = 4/2
	  for(let i=0;i<_wave_num;i++){
		  let _t_ship_num=_min_num_in_wave+(_w_counter*_add_num_next_wave);//so enemy-ship trong wave
		  let _t_type_rate=_min_type_rate+Math.floor(_w_counter/3);//để tính ra có những type nào
		  //let _t_type_num=Math.ceil(_t_ship_num/_t_type_rate);//số type trong wave
		  let _t_type_num=1+i;
			  if(_t_type_num>_types.length)_t_type_num=_types.length;
		  let _t_types=new Array();
		  for(let j=0;j<_t_type_num;j++){
			  if(j<_types.length)_t_types.push(_types[j]);
			  else{
				  _t_types.push(_types[_types.length-1]);//khiến cho type khó nhất trong wave xuất hiện nhiều hơn
			  } 
		  }
		  //alert("ShipNum="+_t_ship_num);
		  //alert(_t_types);
		  if(i===0){//for testing
			  //alert("ShipNum="+_t_ship_num);
			  //alert("TypeRate="+_t_type_rate);
			  //alert("TypeNum="+_t_type_num);
			  //alert(_t_types);
		  }
		  let _t_num=Math.ceil(_t_ship_num/_t_types.length);//số lượng ship trong mỗi type, tính theo cách này có thể làm số ship cao hơn mặc định
		  let _t_wave=new Array();
		  for(let j=0;j<_t_types.length;j++){
			  let _t_type=_t_types[j];
			  _t_wave.push({name:_t_type,count:_t_num});
		  }
		  
		  /*
		  if(i%2!=0){
			if(_game_level>10)
				_t_wave.push({name:"ambulance1",count:1});
			if(_game_level>15)
				_t_wave.push({name:"rocket-defense1",count:1});
			if(_game_level>20)
				_t_wave.push({name:"rocket-defense1",count:1});
			if(_game_level>25)
				_t_wave.push({name:"ambulance1",count:1});
		  }
		  else{
			  if(_game_level>15)
				_t_wave.push({name:"rocket-defense2",count:1});
		  }
		  */
		  _waves.push(_t_wave);
		  _w_counter++;
	  }
	  
	  let _names=new Array();
	  /*KHONG DUOC XOA-dung de test kiem tra cac wave(thay doi gia tri cua _game_level de test)*/
	  
	  let _t_rs="WavesNum="+_wave_num+" \n";
		  _t_rs+="TypeNum="+_type_num+" \n";
	  for(let i=0;i<_waves.length;i++){
		  let _t_wave=_waves[i];
		  let _data="Wave-"+(i+1)+"\n";
		  let _t_num=0;
		  for(let j=0;j<_t_wave.length;j++){
			  _data+=(_t_wave[j].name+"="+_t_wave[j].count);
			  _t_num+=_t_wave[j].count;
			  _names.push(_t_wave[j].name);
		  }
		  _t_rs+="ShipsNum:"+_t_num+"\n";
		  
		  _t_rs+=((i+1)+":"+_data);
		  _t_rs+="\n  \n \n";
		  
		  _total_ship_num+=_t_num;
	  }
	  _t_rs+="TotalShipsNum:"+_total_ship_num;
	  //console.log(_t_rs);
	  let _names_list = [...new Set(_names)];//loai bo cac phan tu giong nhau
	  
	  return {waves:_waves,names:_names_list};
  }
  
  init_game_mission(){
	  this.unlock_all_weapon_and_skill();
	  let _intro_container=document.createElement("div");
			_intro_container.classList.add("sp-container");
			//_intro_container.style.backgroundColor="rgba(0, 0, 0, 0.0)";
			_intro_container.innerHTML=`
				<div class="sp-content">
				
				<h2 class="frame-1">Level `+_game_level+`</h2>
				
				</div>
			`;
	  this._root_div.appendChild(_intro_container);
	  this.add_to_timer(()=>{
		  _intro_container.remove();
	  },5);
	 
	  this._me.reset_applied_skill_num();
	  this._me._rocket_package.reset_rocket_counter();
	  
	  this._hp_rate=2;//ko duoc xoa'(vi lien quan toi' phan tinh' toan' score), neu ko muon tang HP thi dat=1
	  this._me._max_health*=this._hp_rate;
	  this._me._health*=this._hp_rate;//tang them HP
	  
	  this._unitMG.after_create_enemy_combat_unit_fc_2=function(_eunit){//hinh nhu ko co' function nay se ko create enemy-ship dc
			
		}
		
		
		
		let _enemy_group_id=null;
		/*
			
	  if(_game_level>10&&_game_level<=20)_enemy_group_id=5;//tuong ung khi player mua dc ship 2
	  if(_game_level>20&&_game_level<=30)_enemy_group_id=2;//tuong ung khi player mua dc ship 3
	  if(_game_level>30&&_game_level<=40)_enemy_group_id=3;//tuong ung khi player mua dc ship 4
	  if(_game_level>40&&_game_level<=50)_enemy_group_id=1;//tuong ung khi player mua dc ship 5
		*/
		
		let _player_ship_id=this._unitMG.get_player_ship_id(this._me);
	 let _enemy_power_miltiplier=0;
	 let _multiplier_1=20;
	 let _enemy_extra_dam_multiplier=1;
	 if(_game_level>=41&&_game_level<=45){
		 _enemy_group_id=1;
		 //if(_player_ship_id!=2){
			 //_enemy_power_miltiplier=_multiplier_1;
			 //_enemy_extra_dam_multiplier=2;
		 //}
	 }
	 if(_game_level>=46&&_game_level<=50){
		 _enemy_group_id=2;
		 //if(_player_ship_id!=3){
			 //_enemy_power_miltiplier=_multiplier_1;
			 //_enemy_extra_dam_multiplier=2;
		 //}
	 }
	 if(_game_level>=51&&_game_level<=55){
		 _enemy_group_id=3;
		 //if(_player_ship_id!=4){
			 //_enemy_power_miltiplier=_multiplier_1;
			 //_enemy_extra_dam_multiplier=2;
		 //}
	 }
	 if(_game_level>=56&&_game_level<=60){
		 _enemy_group_id=4
		 //if(_player_ship_id!=5){
			 //_enemy_power_miltiplier=_multiplier_1;
			// _enemy_extra_dam_multiplier=2;
		 //}
	 }
	  if(_game_level>=56&&_game_level<=60){
		 _enemy_group_id=5
		
	 }
	
		
	
	  let _wave_counter=-1;
	  let _sub_wave_counter=-1;
	  
	  let _turn_mark=10;//sau khi vuot qua _turn_mark level thi change enemy-group-id vang tang rate
	  let _turn_num=Math.floor(_game_level/_turn_mark);//so luot da thay doi enemy-group-id va tang rate
	  let _full_player_ship_group_ids=this._unitMG.get_all_player_ship_group_ids();
	  let _full_inhibit_group_ids=new Array();
		  _full_inhibit_group_ids.push(2);//o cac game-level dau tien ko de enemy-ship inhibit player-ship 1
	  for(let i=0;i<_full_player_ship_group_ids.length;i++){
		  let _group_id=_full_player_ship_group_ids[i];
		  let _inhibit_id=this._unitMG.get_inhibited_type(_group_id);
		  _full_inhibit_group_ids.push(_inhibit_id);
		  //_full_inhibit_group_ids.push(_inhibit_id+" inhibit "+_group_id);
		  //_full_inhibit_group_ids.push(this._unitMG.get_inhibited_type(_full_player_ship_ids[i]));
	  }
	  
	  /*xap xep theo thu tu tu de~ den' kho'*/
	  //let _normal_ships=this._unitMG.get_full_enemy_normal_ship_name_1();
	  /*Thinh thoang xuat hien theo quy luat*/
	  //let _special_ships=this._unitMG.get_full_enemy_special_ship_name_1();
	  
	  
	  //let _enemy_group_id=_full_inhibit_group_ids[_turn_num%_full_inhibit_group_ids.length];
	  
	  //if(_game_level<_turn_num)
	  
	  //alert(_full_inhibit_group_ids);
	  this._noticeBoard.add_message("GameLevel="+_game_level);
	  //this._noticeBoard.add_message("EGroupID="+_enemy_group_id);
	  
	  
	  let _enemy_level_rate=1;//tang suc' manh cho enemy-ships
	      //_enemy_level_rate+=Math.floor(_game_level/_turn_mark)*2;
		  _enemy_level_rate+=_enemy_power_miltiplier;
	  
	  let _waves=_enemy_waves;
	  
	  //alert(_waves);
	  
	  
	  
	  
	  
	  //------------------------------------------
	  if(_total_ship_num>100){//khi có quá nhiều ship trong 1 wave thì chia các wave ra thành các wave nhỏ hơn
		  let _max_ship_in_wave=10;//số ship tối đa trong 1 sub wave
		  let _new_waves=new Array();
		  let _t_ship_counter=0;
		  for(let i=0;i<_waves.length;i++){
			  let _t_wave=_waves[i];
			  let _sub_wave_num=_t_wave.length;
			  let _new_wave=new Array();
			  for(let j=0;j<_sub_wave_num;j++){
				  let _sub_wave=_t_wave[j];
				  let _name=_sub_wave.name;
				  let _new_sub_wave=new Array();
				  if(_sub_wave.count>_max_ship_in_wave){//alert("FOUND");
					  let _new_sub_wave_num=Math.ceil(_sub_wave.count/_max_ship_in_wave);
					  let _t_counter=0;
					  for(let k=0;k<_new_sub_wave_num;k++){
						  let _t_num=_max_ship_in_wave;
						  if(_t_counter+_t_num>_sub_wave.count)
							  _t_num=_sub_wave.count-_t_counter;
						  let _t_units={name:_name,count:_t_num};
						  
						  _new_sub_wave.push(_t_units);
						  _t_ship_counter+=_t_units.count;
						  _t_counter+=_t_num;
					  }
					  
				  }
				  else{
					  _new_sub_wave=_sub_wave;
					  _t_ship_counter+=_sub_wave.count;
				  }
				  
				  _new_wave.push(_new_sub_wave);
			  }
			  _new_waves.push(_new_wave);
		  }
		  _waves=_new_waves;
		  //alert("TotalShipNum="+_t_ship_counter);
	  }
	  //-------------------------------------------
	  
	  /*
	  _total_ship_num=0;
	  _t_rs="WavesNum="+_wave_num+" \n";
		  _t_rs+="TypeNum="+_type_num+" \n";
	  for(let i=0;i<_waves.length;i++){
		  let _t_wave=_waves[i];
		  let _data="Wave-"+(i+1)+"\n";
		  let _t_num=0;
		  for(let j=0;j<_t_wave.length;j++){
			  _data+=(_t_wave[j].name+"="+_t_wave[j].count);
			  _t_num+=_t_wave[j].count;
		  }
		  _t_rs+="ShipsNum:"+_t_num+"\n";
		  
		  _t_rs+=((i+1)+":"+_data);
		  _t_rs+="\n  \n \n";
		  
		  _total_ship_num+=_t_num;
	  }
	  _t_rs+="TotalShipsNum:"+_total_ship_num;
	  */
	  //alert("TotalShipsNum:"+_total_ship_num);
	  //console.log(_t_rs);
	  //return;
	  //this.add_to_timer(()=>{
		  //this._me.apply_shield_skill(10,12);
	  //},5);
	  
	  
	  
	  /*
	  _waves=new Array();
	  for(let i=0;i<30;i++){
		  //_waves.push([{name:"ambulance1",count:1},{name:"icy1",count:3}]);
		  //_waves.push([{name:"rocket1",count:11},{name:"counter-attack1",count:2},
		  //{name:"ambulance1",count:1},{name:"rocket-defense2",count:1}]);
		  //_waves.push([{name:"counter-attack1",count:2}]);
		  //_waves.push([{name:"photon2",count:3,name:"photon3",count:3,name:"photon4",count:3}]);
		  _waves.push([{name:"photon3",count:9}]);
		  //_waves.push([{name:"thunder1",count:2}]);
		  //_waves.push([{name:"machine-gun-1",count:4}]);
		  
		  //_waves.push([{name:"rocket-defense1",count:1},{name:"rocket-defense2",count:1},
		  //{name:"ambulance1",count:1},{name:"photon4",count:1}]);
	  }
	 */
	 
	 
	 let _all_enemy_ships=new Array();//luu toan bo enemyship ke ca unit da chet'
	 let _rand_enemy_ships=new Array();
	  let _create_wave=()=>{
		  _wave_counter++;
		  
		  this.update_game_infor(_game_level,_wave_counter+1,_waves.length,_total_ship_num);
		  
		  //this.show_message_box_2('notice','Wave '+(_wave_counter+1)+"/"+_waves.length,"Enemies are coming",5);
		  let _element=_waves[_wave_counter];
		  for(let j=0;j<_element.length;j++){
		  _sub_wave_counter++;
		  let _item=_element[j];
		  let _name=_item.name;
		  let _ship_count_1=_item.count;
		  
		  let _rand_pos=new Array();
		  let _distance_to_player=200;
		  
		  const _front_pos=this._me.get_back_point(_distance_to_player*10+_sub_wave_counter*200);
		  let _pos_list;
		  if(_name==='suicide1'){
			  _ship_count_1*=4;
			  _pos_list=this.get_position_in_row_1(_front_pos,50,_ship_count_1,Math.floor(_ship_count_1/2));
		  }  
		  else
			  _pos_list=this.get_random_positions_1(_front_pos,3,50,_ship_count_1);
		_rand_enemy_ships=new Array();
		for(let i=0;i<_ship_count_1;i++){//cac ship xuat hien ngau nhien
			let _enemy_ship;
			
			if(_wave_counter%3===0){
				if(!_tunnel_parts[4].created_laser_ships){
					//this.create_connect_laser_ships_in_tunnel_part(_tunnel_parts[4],1);
					_tunnel_parts[4].created_laser_ships=true;
				}
				
			}
			
			//if(_wave_counter%2!=0){
				if(_name==="cluster-bullet-1"){
					
					_distance_to_player=200;
					_enemy_ship=this._unitMG.createSimpleClusterBulletShip(_pos_list[i]);
					//_enemy_ship._model.scale.multiplyScalar(2);
					//_enemy_ship._bound_radius*=2;
					_enemy_ship.CheckTarget=(timeInSeconds)=>{
						const _player_pos=this._me.Position;
						this.update_enemy_ship_position(timeInSeconds,_enemy_ship,_distance_to_player);
						const _lookPos=this._utils.calculateSymmetricPoint(_enemy_ship.Position,_player_pos);
						_enemy_ship._model.lookAt(_lookPos);
						_enemy_ship._params.camera.lookAt(_lookPos);
						_enemy_ship.Fire();
					};
				}
				if(_name==="suicide1"){
					_enemy_ship=this._unitMG.createSimpleSuicideShip(_pos_list[i]);
					_enemy_ship._model.scale.multiplyScalar(0.5);
					_enemy_ship._bound_radius*=3.1;
					_enemy_ship._target_object=this._me;
					_enemy_ship._speed=5;
					_enemy_ship.CheckTarget=(timeInSeconds)=>{
						const _player_pos=this._me.Position;
						_enemy_ship._model.position.x=_player_pos.x;
						_enemy_ship._model.position.z=_player_pos.z;
						this.update_enemy_ship_position(timeInSeconds,_enemy_ship,_distance_to_player);
						const _lookPos=this._utils.calculateSymmetricPoint(_enemy_ship.Position,_player_pos);
						_enemy_ship._model.lookAt(_lookPos);
						_enemy_ship._params.camera.lookAt(_lookPos);
						_enemy_ship.move_forward(timeInSeconds*_enemy_ship._speed);
						if(_enemy_ship.Position.distanceTo(_player_pos)<10){
							_enemy_ship.CheckTarget=()=>{};
							_enemy_ship._target_object.TakeDamage(_enemy_ship._damage);
							
							_enemy_ship.Explode();
							_enemy_ship.SelfDestroy();
							
						}
							
					};
					_distance_to_player=5;
					let _suicide_ship_update_fc=(t)=>{
						if(_enemy_ship.Position.y<this._me.Position.y-50)
							_enemy_ship.SelfDestroy();
					};
					this.add_to_update_function_list(_suicide_ship_update_fc);
					_enemy_ship.add_to_after_dead_function_list(()=>{
						this.remove_function_from_update_list(_suicide_ship_update_fc);
					});
					_enemy_ship.add_to_after_dead_function_list(()=>{
						return;
						let _img=this._image_preloader.getImage('explosion-1');
						let div = document.createElement( 'div' );
						div.innerHTML = `<img src='${_img.src}' style='width:650px;height:650px'/>`;
						//div.innerHTML="<img src='./resources/gif/explosion/7.gif' style='width:450px;height:450px'/>";
						div.style.fontSize="20px";
						div.style.color="red";
						let _2dObj = new CSS2DObject( div );
						this._graphics.Scene.add(_2dObj);
						if(_enemy_ship._be_killed)
							_2dObj.position.copy(this._me.get_back_point(5));
						else
							_2dObj.position.copy(_enemy_ship.Position);
							this.add_to_timer(()=>{
								this._graphics.Scene.remove(_2dObj);
								_2dObj.remove();
								_2dObj=null;
								div.remove();
								div=null;
						},2);
					});
				}
				if(_name==="missile1"){
					_enemy_ship=this.create_missile_ship_type_1(_pos_list[i]);
				}
				if(_name==="missile2"){
					_enemy_ship=this._unitMG.createSimpleMissileShip(_pos_list[i]);
					_enemy_ship._target_object=this._me;
					_enemy_ship._lock_fire=false;
					_enemy_ship._rocket_speed=50;
					_enemy_ship._model.scale.multiplyScalar(1.2);
					_enemy_ship._bound_radius*=40.1;
					_distance_to_player=400;
					
					_enemy_ship._rocket_package._rockets_infor=this._unitMG.get_all_rockets_infor();//
					//_enemy_ship._rocket_package._unit=_enemy_ship;
					_enemy_ship._lock_missile=false;
					
					//_enemy_ship._missile_3_particle="particle38";
					
					_enemy_ship.CheckTarget=(timeInSeconds)=>{
						const _player_pos=this._me.Position;
						this.update_enemy_ship_position(timeInSeconds,_enemy_ship,_distance_to_player);
						const _lookPos=this._utils.calculateSymmetricPoint(_enemy_ship.Position,_player_pos);
						_enemy_ship._model.lookAt(_lookPos);
						_enemy_ship._params.camera.lookAt(_lookPos);
						if(_enemy_ship.Position.distanceTo(_player_pos)<_distance_to_player+10){
							if(_enemy_ship._lock_missile)
								return;
							_enemy_ship._lock_missile=true;
							this.add_to_timer(()=>{
								_enemy_ship._lock_missile=false;
							},8);
							_enemy_ship._rocket_package.launch_rocket(3);
							this.add_to_timer(()=>{
								//_enemy_ship._rocket_package.launch_rocket(3);
							},2);
							this.add_to_timer(()=>{
								_enemy_ship._rocket_package.launch_rocket(3);
							},4);
							//_enemy_ship.apply_additional_skill_generate_multi_photon_3(_enemy_ship,1);
							//_enemy_ship.apply_continuous_rocket_skill(_enemy_ship,1);
							//_enemy_ship.apply_rain_of_bullets_skill(_enemy_ship,1);
							//_enemy_ship.Fire();
						}
							
					};
				}
				if(_name==="machine-gun-1"){//phai sua lai,su dung createSimpleMachineGunShip trong unitMG
					_enemy_ship=this._unitMG.createSimpleMissileShip(_pos_list[i]);
					_enemy_ship._target_object=this._me;
					_enemy_ship._lock_fire=false;
					_enemy_ship._rocket_speed=50;
					_enemy_ship._model.scale.multiplyScalar(1.2);
					_enemy_ship._bound_radius*=40.1;
					_distance_to_player=400;
					
					_enemy_ship._player_id=null;
					_enemy_ship._is_enemy=true;
					
					_enemy_ship._rocket_package._rockets_infor=this._unitMG.get_all_rockets_infor();//
					//_enemy_ship._rocket_package._unit=_enemy_ship;
					_enemy_ship._lock_missile=false;
					
					//_enemy_ship._missile_3_particle="particle38";
					
					_enemy_ship.CheckTarget=(timeInSeconds)=>{
						const _player_pos=this._me.Position;
						this.update_enemy_ship_position(timeInSeconds,_enemy_ship,_distance_to_player);
						const _lookPos=this._utils.calculateSymmetricPoint(_enemy_ship.Position,_player_pos);
						_enemy_ship._model.lookAt(_lookPos);
						_enemy_ship._params.camera.lookAt(_lookPos);
						if(_enemy_ship.Position.distanceTo(_player_pos)<_distance_to_player+10){
							if(_enemy_ship._lock_missile)
								return;
							_enemy_ship._lock_missile=true;
							this.add_to_timer(()=>{
								_enemy_ship._lock_missile=false;
							},12);
							
							//_enemy_ship.apply_additional_skill_generate_multi_photon_3(_enemy_ship,1);
							//_enemy_ship.apply_continuous_rocket_skill(_enemy_ship,1);
							_enemy_ship.apply_rain_of_bullets_skill(_enemy_ship,1);
							//_enemy_ship.Fire();
						}
							
					};
				}
				if(_name==="laser1"){
					if(!this._lasership_store){//do cac lasership duoc create tu wave thu 2 tro di bi loi~ lasergun
						this._lasership_store=new Array();//nen pre-create de ko bi loi lasergun
						const _t_pos=new THREE.Vector3(0,0,0);
						this._first_laser_ship=this._unitMG.createSimpleLaserShip(_t_pos);
						this._laser_ship_counter=0;
						const _ship_num=50;
						
						for(let _i=0;_i<_ship_num;_i++){
							const _new_ship=this._unitMG.createSimpleLaserShip(_t_pos);
							_new_ship._model.visible=false;
							_new_ship.CheckTarget=()=>{};
							this._lasership_store.push(_new_ship);
						}
					}
					
					if(this._laser_ship_counter>=this._lasership_store.length)
						continue;
					_enemy_ship=this._lasership_store[this._laser_ship_counter];
					_enemy_ship._model.position.copy(_pos_list[i]);
					_enemy_ship._model.visible=true;
					this._laser_ship_counter++;
					
					
					let _d_to_player=this._utils.get_random_in_range(200,300);
					
					_enemy_ship.CheckTarget=(timeInSeconds)=>{
						const _player_pos=this._me.Position;
						this.update_enemy_ship_position(timeInSeconds,_enemy_ship,_d_to_player);
						_enemy_ship.look_at(_player_pos);
						const _t_distance=_enemy_ship.Position.distanceTo(_player_pos);
						if(_t_distance<_d_to_player+60){
							_enemy_ship.Fire();
						}
					};
				}
				if(_name==='photon1'){
					if(i>=2)continue;
					const _mt=this._unitMG.get_gradient_material("gray","black");
					_enemy_ship=this._unitMG.createSimplePhotonShip(_pos_list[i],
								null);
					//_enemy_ship._model.scale.multiplyScalar(0.08);
					_enemy_ship._bound_radius=3.2;
					
					this._graphics.Scene.add(_enemy_ship._model);
					_enemy_ship._target_object=this._me;
					let _laser_ship_update_fc=(t)=>{
						this.update_enemy_ship_position(t,_enemy_ship,_distance_to_player);
					};
					this.add_to_update_function_list(_laser_ship_update_fc);
					_enemy_ship.add_to_after_dead_function_list(()=>{
						this.remove_function_from_update_list(_laser_ship_update_fc);
					});
				} 
				if(_name==='photon1.1'){
					if(i>=2)continue;
					_enemy_ship=this._unitMG.createSimplePhotonShip(_pos_list[i],
					this._unitMG.get_gradient_material("black","blue"));
					//_enemy_ship._model.scale.multiplyScalar(0.08);
					_enemy_ship._bound_radius=3.2;
					
					
					_enemy_ship._fire_duration=1;
					_enemy_ship._fire_delay=2;
					_enemy_ship._photon_ray_color="blue";
					//_enemy_ship._photon_ray_radius=0.04;
					
					
					this._graphics.Scene.add(_enemy_ship._model);
					_enemy_ship._target_object=this._me;
					let _laser_ship_update_fc=(t)=>{
						this.update_enemy_ship_position(t,_enemy_ship,_distance_to_player);
					};
					this.add_to_update_function_list(_laser_ship_update_fc);
					_enemy_ship.add_to_after_dead_function_list(()=>{
						this.remove_function_from_update_list(_laser_ship_update_fc);
					});
				}
				if(_name==='photon1.2'){
					if(i>=2)continue;
					_enemy_ship=this._unitMG.createSimplePhotonShip(_pos_list[i],
					this._unitMG.get_gradient_material("black","red"));
					//_enemy_ship._model.scale.multiplyScalar(0.08);
					_enemy_ship._bound_radius=3.2;
					
					
					_enemy_ship._fire_duration=1;
					_enemy_ship._fire_delay=1;
					//_enemy_ship._photon_ray_color="turquoise";
					_enemy_ship._photon_ray_radius=0.04;
					let _colors=["orange","green","purple","red","turquoise","yellow","pink"];
					let _counter=0;
					let _change_color_fc=(t)=>{
						let _color=_colors[_counter];
						_counter++;
						if(_counter>_colors.length-1)
							_counter=0;
						
						_enemy_ship._photon_ray_color=_color;
					};
					this.add_to_function_list_4(_change_color_fc);
					
					
					
					this._graphics.Scene.add(_enemy_ship._model);
					_enemy_ship._target_object=this._me;
					let _laser_ship_update_fc=(t)=>{
						this.update_enemy_ship_position(t,_enemy_ship,_distance_to_player);
					};
					this.add_to_update_function_list(_laser_ship_update_fc);
					_enemy_ship.add_to_after_dead_function_list(()=>{
						this.remove_function_from_update_list(_laser_ship_update_fc);
					});
				}
				if(_name==='photon2'){
					let _d_to_player=this._utils.get_random_in_range(200,300);
					_enemy_ship=this.create_photon_ship_type_2("green",2,_d_to_player,_pos_list[i]);
					_enemy_ship._laser_range=40;//tang range cho de ban' trung hon, vi player-ship di chuyen lien tuc
				} 
				if(_name==='photon2.2'){
					let _d_to_player=this._utils.get_random_in_range(200,300);
					_enemy_ship=this.create_photon_ship_type_2_2("orange",2,_d_to_player,_pos_list[i]);
					_enemy_ship._laser_range=40;//tang range cho de ban' trung hon, vi player-ship di chuyen lien tuc
				} 
				if(_name==='photon3'){
					_enemy_ship=this.create_photon_ship_type_3("yellow",2,800,_pos_list[i]);
					_enemy_ship._laser_range=40;//tang range cho de ban' trung hon, vi player-ship di chuyen lien tuc
					_enemy_ship._laser_speed=50;
				} 
				if(_name==='photon4'){
					
					_enemy_ship=this._unitMG.create_photon_ship_type_4(["green","orange"],1,_pos_list[i]);//function trong space-ship-game.js
					//_enemy_ship._laser_range=40;
					_enemy_ship._target_object=this._me;
					
					//_distance_to_player=200;
					let _d_to_player=this._utils.get_random_in_range(200,300);
				
					_enemy_ship.add_to_update_function_list((timeInSeconds)=>{
						const _player_pos=this._me.Position;
						this.update_enemy_ship_position(timeInSeconds,_enemy_ship,_d_to_player);
						
						_enemy_ship.look_at(_player_pos);
						
						const _t_distance=_enemy_ship.Position.distanceTo(_player_pos);
						if(_t_distance<_d_to_player+50)_enemy_ship.Fire();
					});
				} 
				if(_name==='photon5'){
					
					_enemy_ship=this.create_photon_ship_type_5("white",2,800,_pos_list[i]);
					
				} 
				if(_name==='photon5.2'){
					_enemy_ship=this.create_photon_ship_type_5("yellow",1,700,_pos_list[i]);
				} 
				if(_name==='photon6'){
					_enemy_ship=this.create_photon_ship_type_6("yellow",1,700,_pos_list[i]);
					_enemy_ship._target_object=this._me;					
				} 
				if(_name==='thunder1'){
					
					_enemy_ship=this._unitMG.createSimpleThunderShip(_pos_list[i]);//function trong space-ship-game.js
					//_enemy_ship._model.scale.multiplyScalar(0.08);
					_enemy_ship._bound_radius=3.2;
					//_enemy_ship._player_id=null;
					this._graphics.Scene.add(_enemy_ship._model);
					_enemy_ship._target_object=this._me;
					//_enemy_ship._photon_color="red";
					_enemy_ship._lock_fire=false;
					_enemy_ship._rocket_speed=this._parameters._standard_rocket_speed*0.1;
					_distance_to_player=500;
					//_enemy_ship=this._unitMG.createSimpleLaserShip(_pos_list[i]);
					//_enemy_ship._model.scale.multiplyScalar(2);
					//_enemy_ship._bound_radius*=2;
					_enemy_ship.add_to_update_function_list((timeInSeconds)=>{
						const _player_pos=this._me.Position;
						this.update_enemy_ship_position(timeInSeconds,_enemy_ship,_distance_to_player);
						//const _lookPos=this._utils.calculateSymmetricPoint(_enemy_ship.Position,_player_pos);
						_enemy_ship.look_at(_player_pos);
						//_enemy_ship._params.camera.lookAt(_lookPos);
						const _t_distance=_enemy_ship.Position.distanceTo(_player_pos);
						if(_t_distance<_distance_to_player+50)_enemy_ship.Fire();
					});
				} 
			//}
			if(_name==='virus1'){
				_enemy_ship=this._unitMG.createSimpleVirusShip(_pos_list[i]);
					_enemy_ship._target_object=this._me;
					_enemy_ship._lock_fire=false;
					_enemy_ship._rocket_speed=50;
					_enemy_ship._bound_radius*=6.1;
					_distance_to_player=300;
					
					_enemy_ship.CheckTarget=(timeInSeconds)=>{
						const _player_pos=this._me.Position;
						this.update_enemy_ship_position(timeInSeconds,_enemy_ship,_distance_to_player);
						const _lookPos=this._utils.calculateSymmetricPoint(_enemy_ship.Position,_player_pos);
						_enemy_ship._model.lookAt(_lookPos);
						_enemy_ship._params.camera.lookAt(_lookPos);
						if(_enemy_ship.Position.distanceTo(_player_pos)<_distance_to_player+50)
							_enemy_ship.Fire();
					};
			}
			if(_name==='icy1'){
				 _enemy_ship=this.create_icy_ship(_pos_list[i]);
				
			}
			if(_name==='ambulance1'){
				_enemy_ship=this._unitMG.createSimpleAmbulanceShip(_pos_list[i]);
					//_enemy_ship._target_object=this._me;
					//_enemy_ship._lock_fire=false;
					//_enemy_ship._rocket_speed=50;
					_enemy_ship._bound_radius*=5.1;
					_distance_to_player=300;
					
					let _update_fc=(t)=>{
						this.update_enemy_ship_position(t,_enemy_ship,_distance_to_player);
					};
					this.add_to_update_function_list(_update_fc);
					_enemy_ship.add_to_after_dead_function_list(()=>{
						this.remove_function_from_update_list(_update_fc);
					});
			}
			if(_name==='rocket-defense1'){
				_enemy_ship=this._unitMG.createSimpleRocketDefenseShip(_pos_list[i]);
					//_enemy_ship._target_object=this._me;
					_enemy_ship._lock_fire=false;
					_enemy_ship._rocket_speed=50;
					_enemy_ship._bound_radius*=5.1;
					_distance_to_player=400;
					
					let _update_fc=(t)=>{
						this.update_enemy_ship_position(t,_enemy_ship,_distance_to_player);
					};
					this.add_to_update_function_list(_update_fc);
					_enemy_ship.add_to_after_dead_function_list(()=>{
						this.remove_function_from_update_list(_update_fc);
					});
			}
			if(_name==='rocket-defense2'){
				_enemy_ship=this._unitMG.createSimpleDefenseShip(_pos_list[i]);
					//_enemy_ship._target_object=this._me;
					_enemy_ship._lock_fire=false;
					_enemy_ship._rocket_speed=50;
					_enemy_ship._bound_radius*=5.1;
					_distance_to_player=400;
					
					let _update_fc=(t)=>{
						this.update_enemy_ship_position(t,_enemy_ship,_distance_to_player);
						const _player_pos=this._me.Position;
						if(_enemy_ship.Position.distanceTo(_player_pos)<_distance_to_player+10)
							_enemy_ship.Fire();
					};
					this.add_to_update_function_list(_update_fc);
					_enemy_ship.add_to_after_dead_function_list(()=>{
						this.remove_function_from_update_list(_update_fc);
					});
			}
			if(_name==='fire1'){
				_enemy_ship=this.create_fire_ship(_pos_list[i]);
				
			}
			if(_name==="energy1"){
				_enemy_ship=this._unitMG.createSimpleEnergyShip(_pos_list[i]);
					_enemy_ship._target_object=this._me;
					_enemy_ship._lock_fire=false;
					_enemy_ship._rocket_speed=10;
					_enemy_ship._bound_radius*=14.1;
					_distance_to_player=600;
					
					_enemy_ship.CheckTarget=(timeInSeconds)=>{
						const _player_pos=this._me.Position;
						this.update_enemy_ship_position(timeInSeconds,_enemy_ship,_distance_to_player);
						const _lookPos=this._utils.calculateSymmetricPoint(_enemy_ship.Position,_player_pos);
						_enemy_ship._model.lookAt(_lookPos);
						_enemy_ship._params.camera.lookAt(_lookPos);
						if(_enemy_ship.Position.distanceTo(_player_pos)<_distance_to_player+50)
							_enemy_ship.Fire();
					};
			}
			if(_name==="rocket1"){
				_enemy_ship=this.create_rocket_ship_type_1(_pos_list[i]);
			}
			if(_name==="rocket2"){
				_enemy_ship=this._unitMG.create_rocket_ship_type_2(_pos_list[i]);
					_enemy_ship._target_object=this._me;
					_enemy_ship._lock_fire=false;
					//_enemy_ship._rocket_speed=50;
					_enemy_ship._bound_radius*=14.1;
					//_distance_to_player=300;
					let _d_to_player=this._utils.get_random_in_range(200,300);
					_enemy_ship.CheckTarget=(timeInSeconds)=>{
						const _player_pos=this._me.Position;
						this.update_enemy_ship_position(timeInSeconds,_enemy_ship,_distance_to_player);
						const _lookPos=this._utils.calculateSymmetricPoint(_enemy_ship.Position,_player_pos);
						_enemy_ship._model.lookAt(_lookPos);
						_enemy_ship._params.camera.lookAt(_lookPos);
						if(_enemy_ship.Position.distanceTo(_player_pos)<_distance_to_player+50)
							_enemy_ship.Fire();
					};
			}
			if(_name==="counter-attack1"){
				_enemy_ship=this._unitMG.createSimpleCounterAttackShip(_pos_list[i]);
					_enemy_ship._target_object=this._me;
					_enemy_ship._lock_fire=false;
					_enemy_ship._rocket_speed=50;
					_enemy_ship._bound_radius*=5.1;
					//_distance_to_player=300;
					let _d_to_player=this._utils.get_random_in_range(200,300);
					_enemy_ship.CheckTarget=(timeInSeconds)=>{
						const _player_pos=this._me.Position;
						this.update_enemy_ship_position(timeInSeconds,_enemy_ship,_d_to_player);
						const _lookPos=this._utils.calculateSymmetricPoint(_enemy_ship.Position,_player_pos);
						_enemy_ship._model.lookAt(_lookPos);
						_enemy_ship._params.camera.lookAt(_lookPos);
						//if(_enemy_ship.Position.distanceTo(_player_pos)<_d_to_player+10)
							//_enemy_ship.Fire();
					};
			}
			
			_enemy_ship._model.scale.multiplyScalar(2);
			this._graphics.Scene.add(_enemy_ship._model);
			
			_enemy_ship.start_move_to_front_of_target_behavior_1();
			_rand_enemy_ships.push(_enemy_ship);
			_all_enemy_ships.push(_enemy_ship);
			
			//let _level=this._me.get_space_ship_level();
			let _level=_game_level;
			_enemy_ship._level_rate=_enemy_level_rate;
			
			const _new_dam_2=_enemy_ship._damage*_enemy_extra_dam_multiplier;
				_enemy_ship._damage=_new_dam_2;
				_enemy_ship._params.damage=_enemy_ship._damage;
				_enemy_ship._params.blasterSystem._damage=_enemy_ship._damage;
			
			//let _player_ship_id=this._unitMG.get_player_ship_id(this._me);
			//let _group_id1=this._unitMG.get_enemy_ship_group_id_1(_name);
			let _group_id2=this._unitMG.get_player_ship_group_id(_player_ship_id);
			let _inhibit1=this._unitMG._Inhibit(_enemy_group_id,_group_id2);//enemy-ship co inhibit player-ship ko
			let _inhibit2=this._unitMG._Inhibit(_group_id2,_enemy_group_id);//player-ship co inhibit enemy-ship ko
			
			//this._noticeBoard.add_message("Name="+_name);
			//_enemy_ship.set_group_id(_group_id1);
			_enemy_ship.set_group_id(_enemy_group_id);
			//console.log("Rate="+_enemy_ship._level_rate);
			//console.log("HP-1="+_enemy_ship._health);
			_enemy_ship._ship_package.set_ship_level(_level);
			_enemy_ship.apply_space_ship_level_package();
			_enemy_ship._ship_package._max_ship_level=_game_level+100;//để không giới hạn level
			//console.log("HP-2="+_enemy_ship._health);
			//this._noticeBoard.add_message("inhibit="+_inhibit2);
			//this._noticeBoard.add_message("PlayerGroupID="+_group_id2+" EnemyGroupID="+_enemy_group_id);
			if(_inhibit2){
				//_enemy_ship._max_health=_enemy_ship._max_health/100;
				
				//_enemy_ship._max_health=_enemy_ship._max_health*3/4;
				//_enemy_ship._health=_enemy_ship._max_health;
				//_enemy_ship._params.health=_enemy_ship._health;
				
				//if(_name==='photon2')this._noticeBoard.add_message("OldDam="+_enemy_ship._damage);
				const _new_dam=_enemy_ship._damage/1;
				
				_enemy_ship._damage=_new_dam;
				_enemy_ship._params.damage=_enemy_ship._damage;
				_enemy_ship._params.blasterSystem._damage=_enemy_ship._damage;
				//this._noticeBoard.add_message("INHIBIT!!!!!!!!");
				//if(_name==='photon2')alert(_enemy_ship._damage);
				//if(_name==='photon2')this._noticeBoard.add_message("NewDam="+_enemy_ship._damage);
			}
			
			
			_enemy_ship._exp_reward=this._unitMG.get_enemy_ship_exp_reward_1(_name);
			_enemy_ship.set_money_reward(this._unitMG.get_enemy_ship_money_reward_1(_name));
			//this._noticeBoard.add_message("EXP="+_enemy_ship.get_exp_reward());
			//try{
			//_enemy_ship.apply_shield_skill(5,8);
			//}catch(e){alert(e.stack);}
		}
		
		//let _stop_update=false;
		let _update_fc=(_delta)=>{
			//if(_stop_update)return;
			let _all_dead=true;
			for(let i=_all_enemy_ships.length-1;i>=0;i--){
				const _ship=_all_enemy_ships[i];
				if(_ship.Dead||_ship===null){
					_all_enemy_ships.splice(i,1);
					continue;
				}
				_all_dead=false;
			}
			if(_all_dead){
				if(_wave_counter<_waves.length-1){
					this.remove_function_from_update_list(_update_fc);
					
					this._spaceMap.change_map_scene();
					_create_wave();
					
					
					return;
				}
				//if(kill_num===_total_ship_num)
				else{
					//this._StopGame(true);
					
					if(this._space_tunnel_mission_completed===true)
						return;//do ko ro ly do player duoc reward nhieu lan sau khi da finish mission
					this._space_tunnel_mission_completed=true;
					
					document.exitPointerLock();
					//document.body.style.cursor = "pointer";
					//document.body.exitFullscreen();
					document.body.style.cursor="default";
			
					
					let _bonus=this._parameters._space_tunnel_game_bonus;
						_bonus*=(1+((_game_level-1)*this._parameters._space_tunnel_game_bonus_rate));
						_bonus=parseInt(_bonus);
					this.add_to_cash_list(_bonus);
					
					const _rocket_num=this._me._rocket_package.get_rocket_counter();//so' rocket da duoc phong' ra
					const _skill_num=this._me.get_applied_skill_num();//so' lan su dung skill
					const _max_hp=this._me._max_health;
					const _lost_hp=(this._me._max_health*this._hp_rate)-(this._me._health);
					const _remain_hp=parseInt(_max_hp-_lost_hp);
					
					
					let _kill_score=kill_num*_KILL_one_enemy_score;
					let _hp_score=parseInt((_remain_hp/_max_hp)*_HP_max_score);
					let _am_score=_AM_max_score;//tam thoi chua co' Armor
					let _rocket_score=_ROCKET_max_score-(_rocket_num*_ROCKET_minus_score);
					let _skill_score=_SKILL_max_score-(_skill_num*_SKILL_minus_score);
					
					let _total_score=parseInt(_kill_score+_hp_score+_am_score+_rocket_score+_skill_score);
					this._item_package.add_item(2001,this._parameters._space_tunnel_game_dark_energy_bonus);
					
					
					/*
						doan HTML nay de tham khao ko xoa'
					*/
					let _html=`
						You have earned `+_bonus+`$
						</br>
						`+this._parameters._space_tunnel_game_dark_energy_bonus+` unit dark energy
						</br>
						Waves:`+_waves.length+`
						</br>
						Enemy ships destroyed: `+kill_num+`/`+_total_ship_num+`
						</br>
						Remaining HP: `+_remain_hp+`/`+_max_hp+`
						</br>
						Launched Rockets: `+_rocket_num+`
						</br>
						Applied Skills: `+_skill_num+`
						</br>
						Total Score: `+_total_score+`
						</br>
						KillScore: `+_kill_score+`
						</br>
						HPScore: `+_hp_score+`
						</br>
						AMScore: `+_am_score+`
						</br>
						RocketScore: `+_rocket_score+`
						</br>
						SkillScore: `+_skill_score+`
					`;
					
					_html=`
						<div style="padding-left: 150px;font-size:25px;">
							<div style="display: flex;padding-left: 50px;font-size:25px;">
								<img width=70 src='./resources/icons/destroyed.png'/>
								<b style="color:yellow;width:20px;"> </b>`+kill_num+`/`+_total_ship_num+`
							</div>
							</br>
							
							<div style="display: flex;padding-left: 50px;font-size:25px;">
								<img width=50 height=50 src='./resources/icons/exp-up.png'/>
								<b style="color:yellow">$</b>+`+_bonus+`
							</div>
							</br>
							
							<div style="display: flex;padding-left: 50px;font-size:25px;">
								<img width=50 height=50 src='./resources/icons/exp-up.png'/>
								<b style="color:yellow">Dark Energy</b>+`+this._parameters._space_tunnel_game_dark_energy_bonus+`</div>
							</br>
							
							<div style="display: flex;padding-left: 50px;font-size:25px;">
								<img width=50 height=50 src='./resources/icons/exp-up.png'/>
								<b style="color:yellow">Exp</b>+`+_total_score+`
							</div>
						</div>
					`;
					
					this.update_player_data();
					this.update_data_in_database(_item_name,_game_level);//luu lai level cao nhat da vuot qua
					
					
					this.add_to_timer(()=>{
						//this._root_div.remove();
						this._entities['_controls2']._lock=true;
					},4);
					
					this.add_to_timer(()=>{
						if(this._graphics.center_div)
							this._graphics.center_div.remove();
						//changeModalHeaderBackground("rgba(55, 170, 249,0.5)");
					    //changeModalContentBackground("rgba(114, 249, 55,0.5)");
						showModal("750px","400px",`<h1  style="
									background: linear-gradient(to bottom, red, orange, yellow);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
									font-size: 40px;
									font-weight: bold;
"						'>
							VICTORY
						</h1>`,_html,()=>{});
						this.add_to_timer(()=>{
							hideModal();
							this.show_game_menu_1();
						},5);
						/*
						this.createMessageBox(`
						<h1  style="
									background: linear-gradient(to bottom, red, orange, yellow);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
									font-size: 40px;
									font-weight: bold;
"						'>
							VICTORY
						</h1>`,
						_html,()=>{
							this.show_game_menu_1();
							setTimeout(()=>{
								//this._StopGame(true);
							},3000);
						});
						*/
					},5);
					
					
					return;
				}
			}
			
		};
		this.add_to_update_function_list(_update_fc);
		
	  }
	  };
	  
	  _create_wave();
	  
			
	  
  }
  create_fire_ship(_pos){
	 let  _enemy_ship=this._unitMG.createSimpleFireShip(_pos);
					_enemy_ship._target_object=this._me;
					_enemy_ship._lock_fire=false;
					_enemy_ship._rocket_speed=50;
					_enemy_ship._bound_radius*=5.1;
					//_distance_to_player=300;
					let _d_to_player=this._utils.get_random_in_range(200,300);
					_enemy_ship.CheckTarget=(timeInSeconds)=>{
						const _player_pos=this._me.Position;
						this.update_enemy_ship_position(timeInSeconds,_enemy_ship,_d_to_player);
						const _lookPos=this._utils.calculateSymmetricPoint(_enemy_ship.Position,_player_pos);
						_enemy_ship._model.lookAt(_player_pos);
						_enemy_ship._model.rotation.y=Math.PI;
						_enemy_ship._model.rotation.z=-this._me._model.rotation.z;
						_enemy_ship._params.camera.lookAt(_lookPos);
						if(_enemy_ship.Position.distanceTo(_player_pos)<_d_to_player+50)
							_enemy_ship.Fire();
					};
	 return _enemy_ship;
  }
  create_icy_ship(_pos){
	let  _enemy_ship=this._unitMG.createSimpleIcyShip(_pos);
					_enemy_ship._target_object=this._me;
					_enemy_ship._lock_fire=false;
					_enemy_ship._rocket_speed=50;
					_enemy_ship._bound_radius*=5.1;
					//_distance_to_player=300;
					let _d_to_player=this._utils.get_random_in_range(200,300);
					_enemy_ship.CheckTarget=(timeInSeconds)=>{
						const _player_pos=this._me.Position;
						this.update_enemy_ship_position(timeInSeconds,_enemy_ship,_d_to_player);
						const _lookPos=this._utils.calculateSymmetricPoint(_enemy_ship.Position,_player_pos);
						_enemy_ship._model.lookAt(_player_pos);
						_enemy_ship._model.rotation.y=Math.PI;
						_enemy_ship._model.rotation.z=-this._me._model.rotation.z;
						_enemy_ship._params.camera.lookAt(_lookPos);
						if(_enemy_ship.Position.distanceTo(_player_pos)<_d_to_player+50)
							_enemy_ship.Fire();
					};
					
	return _enemy_ship;
  }
  create_missile_ship_type_1(_pos){
	  let _enemy_ship=this._unitMG.createSimpleMissileShip(_pos);
					_enemy_ship._target_object=this._me;
					_enemy_ship._lock_fire=false;
					_enemy_ship._rocket_speed=50;
					_enemy_ship._model.scale.multiplyScalar(1.2);
					_enemy_ship._bound_radius*=40.1;
					let _distance_to_player=300;
					
					_enemy_ship.CheckTarget=(timeInSeconds)=>{
						const _player_pos=this._me.Position;
						const _lookPos=this._utils.calculateSymmetricPoint(_enemy_ship.Position,_player_pos);
						
						this.update_enemy_ship_position(timeInSeconds,_enemy_ship,_distance_to_player);
						_enemy_ship._model.lookAt(_player_pos);
						_enemy_ship._model.rotation.y=Math.PI;
						_enemy_ship._model.rotation.z=-this._me._model.rotation.z;
						_enemy_ship._params.camera.lookAt(_lookPos);
						if(_enemy_ship.Position.distanceTo(_player_pos)<_distance_to_player+10){
							//const _lookPos=this._utils.calculateSymmetricPoint(_enemy_ship.Position,_player_pos);
							//_enemy_ship._model.lookAt(_lookPos);
							//_enemy_ship._params.camera.lookAt(_lookPos);
							_enemy_ship.Fire();
						}
							
					};
	  return _enemy_ship;
  }
  
  create_rocket_ship_type_1(_pos){
	  let _enemy_ship=this._unitMG.createSimpleRocketShip(_pos);
					_enemy_ship._target_object=this._me;
					_enemy_ship._lock_fire=false;
					_enemy_ship._rocket_speed=50;
					_enemy_ship._bound_radius*=14.1;
					//_distance_to_player=300;
					let _d_to_player=this._utils.get_random_in_range(280,310);
					_enemy_ship.CheckTarget=(timeInSeconds)=>{
						const _player_pos=this._me.Position;
						this.update_enemy_ship_position(timeInSeconds,_enemy_ship,_d_to_player);
						const _lookPos=this._utils.calculateSymmetricPoint(_enemy_ship.Position,_player_pos);
						_enemy_ship._model.lookAt(_player_pos);
						_enemy_ship._model.rotation.y=Math.PI;
						_enemy_ship._model.rotation.z=-this._me._model.rotation.z;
						_enemy_ship._params.camera.lookAt(_lookPos);
						if(_enemy_ship.Position.distanceTo(_player_pos)<_d_to_player+50)
							_enemy_ship.Fire();
					};
					
	  return _enemy_ship;
  }
  
  create_photon_ship_type_2(_laser_color,_duration,_distance_to_player,_pos){
	 let _enemy_ship=this._unitMG.create_photon_ship_type_2(_laser_color,1,_pos);
		 _enemy_ship.look_at(this._me.Position);
		_enemy_ship._target_object=this._me;
		_enemy_ship.add_to_update_function_list((timeInSeconds)=>{
			const _player_pos=this._me.Position;
						
			//_enemy_ship._model.rotation.y=Math.PI;
			//_enemy_ship._model.rotation.y=this._me._model.rotation.y+Math.PI;
			//_enemy_ship._model.rotation.z=-this._me._model.rotation.z;
			this.update_enemy_ship_position(timeInSeconds,_enemy_ship,_distance_to_player);
			const _lookPos=this._utils.calculateSymmetricPoint(_enemy_ship.Position,_player_pos);
						_enemy_ship._model.lookAt(_player_pos);
						_enemy_ship._model.rotation.y=Math.PI;
						_enemy_ship._model.rotation.z=-this._me._model.rotation.z;
						_enemy_ship._params.camera.lookAt(_lookPos);
						
			const _t_distance=_enemy_ship.Position.distanceTo(_player_pos);
			if(_t_distance<_distance_to_player+40){
					//_enemy_ship.look_at(_player_pos);
					if(!_enemy_ship._firing)_enemy_ship.Fire();
			}
		});
					
	 return _enemy_ship;
  }
  create_photon_ship_type_2_2(_laser_color,_duration,_distance_to_player,_pos){
	 let _enemy_ship=this._unitMG.create_photon_ship_type_2_2(_laser_color,1,_pos);
		 _enemy_ship.look_at(this._me.Position);
		_enemy_ship._target_object=this._me;
		_enemy_ship.add_to_update_function_list((timeInSeconds)=>{
			const _player_pos=this._me.Position;
					
			this.update_enemy_ship_position(timeInSeconds,_enemy_ship,_distance_to_player);
			const _lookPos=this._utils.calculateSymmetricPoint(_enemy_ship.Position,_player_pos);
						_enemy_ship._model.lookAt(_player_pos);
						_enemy_ship._model.rotation.y=Math.PI;
						_enemy_ship._model.rotation.z=-this._me._model.rotation.z;
						_enemy_ship._params.camera.lookAt(_lookPos);
						
			const _t_distance=_enemy_ship.Position.distanceTo(_player_pos);
			if(_t_distance<_distance_to_player+40){
					//_enemy_ship.look_at(_player_pos);
					if(!_enemy_ship._firing)_enemy_ship.Fire();
			}
		});
					
	 return _enemy_ship;
  }
  create_photon_ship_type_3(_laser_color,_duration,_distance_to_player,_pos){
	let _enemy_ship=this._unitMG.create_photon_ship_type_3(_laser_color,_duration,_pos);//function trong space-ship-game.js
					_enemy_ship._target_object=this._me;
					_distance_to_player=200;
					
					_enemy_ship.add_to_update_function_list((timeInSeconds)=>{
						const _player_pos=this._me.Position;
						this.update_enemy_ship_position(timeInSeconds,_enemy_ship,_distance_to_player);
						_enemy_ship.look_at(_player_pos);
						const _t_distance=_enemy_ship.Position.distanceTo(_player_pos);
						if(_t_distance<_distance_to_player+10)_enemy_ship.Fire();
					});
	  return _enemy_ship;
  }
 
  create_photon_ship_type_5(_laser_color,_duration,_distance_to_player,_pos){
	  let _enemy_ship=this._unitMG.create_photon_ship_type_5(_laser_color,_duration,_pos);//function trong space-ship-game.js
	  _enemy_ship._target_object=this._me;
	  _enemy_ship.add_to_update_function_list((timeInSeconds)=>{
			const _player_pos=this._me.Position;
			this.update_enemy_ship_position(timeInSeconds,_enemy_ship,_distance_to_player);
			//const _lookPos=this._utils.calculateSymmetricPoint(_enemy_ship.Position,_player_pos);
			_enemy_ship.look_at(_player_pos);
			//_enemy_ship._params.camera.lookAt(_lookPos);
			const _t_distance=_enemy_ship.Position.distanceTo(_player_pos);
			if(_t_distance<_distance_to_player+10)_enemy_ship.Fire();
	  });
	  return _enemy_ship;
  }
  
  create_photon_ship_type_6(_laser_color,_duration,_distance_to_player,_pos){
	  let _enemy_ship=this._unitMG.create_photon_ship_type_6(_laser_color,_duration,_pos);//function trong space-ship-game.js
	 _enemy_ship._target_object=this._me;
	 let _first_player_pos=this._me.Position;			
					_enemy_ship.CheckTarget=(timeInSeconds)=>{
						const _player_pos=this._me.Position;
						//const _dx=_player_pos.x-_first_player_pos.x;
						//const _dz=_player_pos.z-_first_player_pos.z;
						//_enemy_ship._model.position.x=_pos.x+_dx;
						//_enemy_ship._model.position.z=_pos.z+_dz;
						
						this.update_enemy_ship_position(timeInSeconds,_enemy_ship,_distance_to_player);
						const _lookPos=this._utils.calculateSymmetricPoint(_enemy_ship.Position,_player_pos);
						_enemy_ship._model.lookAt(_lookPos);
						_enemy_ship._params.camera.lookAt(_lookPos);
						if(_enemy_ship.Position.distanceTo(_player_pos)<_distance_to_player+30){
							if(_enemy_ship._lock_laser)
								return;
							_enemy_ship._lock_laser=true;
							this.add_to_timer(()=>{
								_enemy_ship._lock_laser=false;
							},6);
							
							
							_enemy_ship.Fire();
						}
							
					};
	  return _enemy_ship;
  }
  
  
  get_universe(){
	  return _universe;
  }
	_OneSecondPass(){//overwrite
		
		super._OneSecondPass();
		if(!this._me)return;
		
	}
	Update_1(timeInSeconds){//overwrite
		
		this._missionMG.Update(timeInSeconds);
		
	}
	
  _OnInitialize() {
	  this._graphics.createLoadingScreen(2);
	  this._missionMG2=new MissionMG2({game:this});
	 
	//NOTICE:magnification_factor khi dat gia tri 550000 thi mission1 bi loi~ (chua ro nguyen nhan)
	this._config={
		magnification_factor:950000,//hệ số phóng đại dữ liệu khoảng cách trong data load lên
		//mission_1_bonus:200,//tien thuong khi hoan thanh nhiem vu
		//mission_2_bonus:200,
		//mission_3_bonus:600
	};
	
	this._lock_controls=false;
	
    
	
    this._graphics.Camera.position.set(9500,0,-500);

	this._graphics._CreateLights();

    this._score = 0;
	
	this._sound.load_sounds();
	this._clock = new THREE.Clock();
	
	//this._universe=_universe;
	this._missionMG=new MissionMG({game:this});
	
	
    // This is 2D but eh, whatever.
    this._visibilityGrid = new visibility.VisibilityGrid(
      [new THREE.Vector3(-40000, 0, -40000), new THREE.Vector3(40000, 0, 40000)],
      [100, 100]);
	
    this._entities['_explosionSystem'] = new ExplodeParticles(this);
	this._entities['_explosionSystem1'] = new ExplodeParticles_1(this);
	this._entities['_explosionSystem2'] = new ExplodeParticles_2(this);
   
   this._CreateGUI();
	
    this._library = {};
	
	this._InitEventListener();
    this._LoadBackground();//universe background
	
	//this.create_message_icon();
	
	_universe=new Universe({scene:this._graphics.Scene,camera:this._graphics.Camera,game:this});
	//_universe.create_galaxy(1);
	/*
	window.addEventListener('beforeunload',()=>{
		this._me._inventory.save_data();
		this._me._ship_package.save_data();
	});
	*/
	//this._me.add_to_after_dead_function_list
	Unit.AfterAppearing=(_unit)=>{
		
	};
	Unit.AfterTakeDamage=(_unit)=>{
		if(_unit===this._me)return;
		
		if(_unit._health<=0)return;
		
		return;
		
		let _img;
		if(_unit._is_enemy)
			_img=this._image_preloader.getImage('hit1');
		
		else
			_img=this._image_preloader.getImage('hit2');
		if(_img===null)return;
		
		if(typeof _unit.lock_hit_effect==='undefined')
			_unit.lock_hit_effect=false;
		
		if(_unit.lock_hit_effect)return;
		
		let div = document.createElement( 'div' );
	  div.innerHTML = `<img src='${_img.src}' style='width:150px;height:150px'/>`;
	  div.style.fontSize="20px";
	  div.style.color="red";
	  let _2dObj = new CSS2DObject( div );
	  this._graphics.Scene.add(_2dObj);
	  _2dObj.position.copy(_unit.Position);
	  this.add_to_timer(()=>{
		  
		  this._graphics.Scene.remove(_2dObj);
		  _2dObj.remove();
		  _2dObj=null;
		  div.remove();
		  div=null;
	  },2);
	  
	  _unit.lock_hit_effect=true;
		this.add_to_timer(()=>{
			_unit.lock_hit_effect=false;
		},1);
	};
	
	Unit.AfterDead=(_unit)=>{
		//this._noticeBoard.add_message("DEAD!!!!!!!!!!!");
		this._unitMG.update_enemy_combat_unit_list();
		if(_unit._is_enemy===true){
			
			//let _new_bonus=this._parameters._space_tunnel_game_kill_bonus;
			let _new_bonus=_unit.get_money_reward();
			    _new_bonus*=(1+((_game_level-1)*this._parameters._space_tunnel_game_kill_bonus_rate));
				_new_bonus=parseInt(_new_bonus);
			this.add_to_cash_list(_new_bonus);
			kill_num+=1;
			const _t_exp=_unit.get_exp_reward();
			//this._me._ship_package.plus_ship_exp(_t_exp);
			this.add_to_exp_list(_t_exp);
			//this._noticeBoard.add_message("+"+_t_exp+"EXP");
			//this._noticeBoard.add_message("+"+_new_bonus+" $");
			this._sound.play('explosion1');
			
		}
		//----------------------
		
		if(_unit===this._me){
			//alert("YOu are Dead!");
			//this._me._ship_package
			this._me._ship_package.save_data();
			this.update_player_data();
			this._StopGame();
			this.createMessageBox("Game Over","you have been destroyed",()=>{});
			setTimeout(()=>{
				this.show_game_menu_1();
			},4000);
			//this._StopRender();
			return;
		}
		
		const _rs=this._me._ship_package.upgrade_level();
		if(_rs===true){
			this._noticeBoard.add_message("Leveled up: "+this._me._ship_package.get_ship_level());
			//this._me._ship_package.save_data();
		}
		//this._me._ship_package.save_data();
		
		
		//-----------
		
		
		let _img=this._image_preloader.getImage('explosion-1');
		return;
		let div = document.createElement( 'div' );
		div.innerHTML = `<img src='${_img.src}' style='width:450px;height:450px'/>`;
	  //div.innerHTML="<img src='./resources/gif/explosion/7.gif' style='width:450px;height:450px'/>";
	  div.style.fontSize="20px";
	  div.style.color="red";
	  let _2dObj = new CSS2DObject( div );
	  this._graphics.Scene.add(_2dObj);
	  _2dObj.position.copy(_unit.Position);
	  this.add_to_timer(()=>{
		  
		  this._graphics.Scene.remove(_2dObj);
		  _2dObj.remove();
		  _2dObj=null;
		  div.remove();
		  div=null;
	  },2);
	};
	
	//this.add_radar();
	document.getElementById("radar-container").remove();
	
	//const _renderer_div=document.getElementById("CSS2DRenderer")
	//const _labelRenderer=this._graphics.enable_CSS2D_Renderer(_renderer_div);
	this._unitMG.after_create_enemy_combat_unit_fc_2=(_unit)=>{	
		//if(_unit._is_enemy)	
			//_unit.create_label_1("<img src='./resources/icons/location1.png' width='30' height='30' />");		
					
	};
	//_labelRenderer.domElement.style.zIndex="-1";
	
	
  }
  
  _StopGame(win){
	  super._StopGame();
	  this.hide_nav_bar();
	  this._navigator_bar_1.clear();
	  this._navigator_bar_2.clear();
	  this._me.remove_skill_panel();
  }
  
  show_nav_bar(){
	  let _nav_bar=document.getElementById("nav-bar");
	  _nav_bar.style.visibility="visible";
  }
  hide_nav_bar(){
	  let _nav_bar=document.getElementById("nav-bar");
	  _nav_bar.style.visibility="hidden";
  }
  
  show_mission_panel(){
	  let _mission_id=2;
		//alert(this._me._inventory._cash);
		try{
		let _nav_bar=document.getElementById("nav-bar");
		let _stop_mission_fc=()=>{
			_nav_bar.style.visibility="visible";
		};
		let _mission_fc_1=()=>{
			_nav_bar.style.visibility="hidden";
			this._unitMG.disable_auto_create_enemy();//Ko tao enemy ship khi tiep can hanh tinh bat ky
			this._unitMG.remove_all_enemy_combat_unit();
			this._unitMG.update_enemy_combat_unit_list();
			this._baseMG.remove_all_base();
			this._missionMG.init_mission(1,_universe,()=>{
				this.add_to_cash_list(this._parameters._mission_1_bonus);
				_nav_bar.style.visibility="visible";
				this._unitMG.enable_auto_create_enemy();//Tiep tuc tao enemy ship khi tiep can hanh tinh bat ky
				this._me._inventory.add_cash(this._parameters._mission_1_bonus);
				this.createMessageBox("Mission Completed!","You have earned "+this._config.mission_1_bonus+"$");
				//this.update_cash();
			},_stop_mission_fc);
		};
		let _mission_fc_2=()=>{
			_nav_bar.style.visibility="hidden";
			this._unitMG.disable_auto_create_enemy();
			this._missionMG.init_mission(2,_universe,()=>{
				this.add_to_cash_list(this._parameters._mission_2_bonus);
				this._unitMG.enable_auto_create_enemy();//Tiep tuc tao enemy ship khi tiep can hanh tinh bat ky
				_nav_bar.style.visibility="visible";
				this.createMessageBox("Mission Completed!","You have earned "+this._parameters._mission_2_bonus+"$");
				//this._me._inventory.add_cash(this._parameters._mission_2_bonus);
				//this.update_cash();
			},_stop_mission_fc);
		};
		let _mission_fc_3=()=>{
			_nav_bar.style.visibility="hidden";
			this._unitMG.disable_auto_create_enemy();//Ko tao enemy ship khi tiep can hanh tinh bat ky
			this._unitMG.remove_all_enemy_combat_unit();
			this._unitMG.update_enemy_combat_unit_list();
			this._baseMG.remove_all_base();
			this._missionMG.init_mission(3,_universe,()=>{
				let _bonus=this._parameters._mission_3_bonus;
				_bonus*=this._missionMG.get_mission_3_result_rate();
				_bonus=parseInt(_bonus);
				this.add_to_cash_list(_bonus);
				this._unitMG.enable_auto_create_enemy();//Tiep tuc tao enemy ship khi tiep can hanh tinh bat ky
				_nav_bar.style.visibility="visible";
				this.createMessageBox("Mission Completed!","You have earned "+_bonus+"$");
				//this._me._inventory.add_cash(_bonus);
				//this.update_cash();
			},_stop_mission_fc);
		};

		let _fc_list=[_mission_fc_1,_mission_fc_2,_mission_fc_3];
		
		this._missionMG.create_option(_universe,_fc_list);
		}catch(e){alert(e.toString());}
  }
  
  _InitEventListener(){
	  document.addEventListener('keydown', (e) => this._keyDownHandle(e));
      document.addEventListener('keyup', (e) => this._keyUpHandle(e));
	  document.addEventListener('keypress', (e) => this._keyPressHandle(e));
	 
  }
  lock_controls(){
	  this._entities['_controls2'].engine_active=false;
	  this._lock_controls=true;
	  this._entities['_controls2']._lock=true;
  }
  unlock_controls(){
	  this._lock_controls=false;
	  this._entities['_controls2']._lock=false;
  }
  
  _CreateGUI() {
    this._CreateGameGUI();
    this._CreateControlGUI();
  }

  _CreateGameGUI() {
	  
    const guiDiv = document.createElement('div');
    guiDiv.className = 'guiRoot guiBox';
	this._guiDiv=guiDiv;

    /*
    const scoreDiv = document.createElement('div');
    scoreDiv.className = 'vertical';
    const scoreTitle = document.createElement('div');
    scoreTitle.className = 'guiBigText';
    scoreTitle.innerText = 'KILLS';
    const scoreText = document.createElement('div');
    scoreText.className = 'guiSmallText';
    scoreText.innerText = '0';
    scoreText.id = 'scoreText';

    scoreDiv.appendChild(scoreTitle);
    scoreDiv.appendChild(scoreText);
	
	
	const cashDiv = document.createElement('div');
    cashDiv.className = 'vertical';
    const cashTitle = document.createElement('div');
    cashTitle.className = 'guiBigText';
    cashTitle.innerText = 'CASH';
    const cashText = document.createElement('div');
    cashText.className = 'guiSmallText';
    cashText.innerText = '0';
    cashText.id = 'cashText';
	
	cashDiv.appendChild(cashTitle);
    cashDiv.appendChild(cashText);

    guiDiv.appendChild(scoreDiv);
	//guiDiv.appendChild(cashDiv);
	*/
    //document.body.appendChild(guiDiv);
	
  }

  _CreateControlGUI() {
    this._guiParams = {
      general: {
      },
    };
    this._gui = new GUI();
    this._gui.hide();

    const generalRollup = this._gui.addFolder('General');
    this._gui.close();
  }
	
  _LoadBackground() {
    this._graphics.Scene.background = new THREE.Color(0xFFFFFF);
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
	/*KHONG DUOC XOA
        './resources/space-posx.jpg',
        './resources/space-negx.jpg',
        './resources/space-posy.jpg',
        './resources/space-negy.jpg',
        './resources/space-posz.jpg',
        './resources/space-negz.jpg',
	*/
	/*
		'https://closure.vps.wbsprt.com/files/earth/space/px.png',
    'https://closure.vps.wbsprt.com/files/earth/space/nx.png',
    'https://closure.vps.wbsprt.com/files/earth/space/py.png',
    'https://closure.vps.wbsprt.com/files/earth/space/ny.png',
    'https://closure.vps.wbsprt.com/files/earth/space/pz.png',
    'https://closure.vps.wbsprt.com/files/earth/space/nz.png',*/
		'./resources/background/px.png',
        './resources/background/nx.png',
        './resources/background/py.png',
        './resources/background/ny.png',
        './resources/background/pz.png',
        './resources/background/nz.png'
	
	
    ]);
    this._graphics._scene.background = texture;
  }
	
  //_OnStep(timeInSeconds) {
  //}
  
  
}


//--------------------------------------------------
function getRandomElements(array, n) {
  const tempArray = [];
  for (let i = 0; i < n; i++) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * array.length);
    } while (tempArray.includes(array[randomIndex]));
    tempArray.push(array[randomIndex]);
  }
  return tempArray;
}
function shuffle_array(array)
{
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

//-----------------------------------------------------

function _Main() {
	
  _APP = new ProceduralTerrain_Demo();
  
}

_Main();


