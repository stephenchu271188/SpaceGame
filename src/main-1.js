import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';

import {  CSS2DObject } from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/renderers/CSS2DRenderer.js';

//import {ColladaLoader} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/loaders/ColladaLoader.js';
//import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/loaders/GLTFLoader.js';
import {GUI} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/libs/dat.gui.module.js';
//import {BufferGeometryUtils} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/utils/BufferGeometryUtils.js';

import {controls} from './controls.js';
import {SpaceShipGame} from './space-ship-game.js';
import {terrain} from './terrain.js';
import {visibility} from './visibility.js';

import {PlayerShip1} from './player-ship-1.js';
import {PlayerShip2} from './player-ship-2.js';
import {PlayerShip3} from './player-ship-3.js';

import {HumanEntity} from './human.js';

import {Universe} from './core/universe.js';


import {Unit} from './units/unit.js';

import {ExplodeParticles} from './explode-particles.js';
//import {ExplodeParticles_1} from './explode-particles-1.js';
//import {ExplodeParticles_2} from './explode-particles-2.js';

import {MissionMG} from './mission-mg.js';
import {MissionMG2} from './missions/mission-mg-2.js';

import {Teleport1} from './effects/teleport-1.js';
//import {DemoEffect} from './effects/demo-effect.js';
//import {DemoEffect2} from './effects/demo-effect-2.js';

//import {Meteorite} from './core/meteorite.js';
//import {Meteorite2} from './core/meteorite2.js';

//import {LightingBall} from './units/skills/lighting-ball.js';
//import {NebulaCloud} from './core/nebula-cloud.js';

//import {Effect1} from './legion-game/effect-1.js';
//import Proton from 'three.proton.js';

import {BaseStarSystem} from './core/base-star-system.js';

let _APP = null;

let _universe=null;
let _coordinates=document.getElementById("coordinates");
let _px,_py,_pz;
let kill_num=0;
class ProceduralTerrain_Demo extends SpaceShipGame {
  constructor() {
	 
    super({game_id:1,
	load_unit_model_complete:()=>{
		
		this.create_menu_btton();
		this._graphics.init_lasers(20,10);
		this._unitMG.create_player_entity();	
		//this._graphics.addAxis();//<==============
		/*
		let _particles = new LightingBall({
        parent: this._graphics.Scene,
        camera: this._graphics.Camera,
		});
		this.add_to_update_function_list((timeElapsedS)=>{
			_particles.Step(timeElapsedS);
		});
		*/
		this.create_solar_system();
		this.move_to_earth();
		//this._editModeCenter.show_main_button();
		/*
			Trong những lần đầu tiên player vào chơi game thì sẽ tự động show mission 2 panel
			Dữ liệu này chỉ cần lưu trong local storage chứ ko lưu vào database
		*/
		let _t_data=localStorage.getItem('game-1-level-id');
		if(_t_data===null)_t_data=0;
		else _t_data=parseInt(_t_data);
		_t_data++;
		if(_t_data<3){
			this.add_to_timer(()=>{
				//this.show_mission_panel();
				localStorage.setItem('game-1-level-id',JSON.stringify(_t_data));
				//this.show_message_box_2('notice','Mission!',"Select mission level!",5);
			},4);
		}
		
		
		this.hide_nav_bar();
		const _model_ids=["cannon1","cannon2","spaceship-11","spaceship-4","spaceship-3","spaceship-5",
		"spaceship-6","spaceship-7"];
		let _loader;
		let _counter=0;
		for(let i=0;i<_model_ids.length;i++){
			//_model_id_list.push(this._unitMG.get_enemy_ship_model_id(_names[i]));
			const _model_id=_model_ids[i];
			const _model_path=this._unitMG.get_model_file_path(_model_id);
			_loader= new GLTFLoader();
			_loader.load(_model_path,( gltf )=> {
				this._unitMG._data_list[_model_id]=gltf;
				_counter++;
				if(_counter===_model_ids.length){//load complete
					this.show_nav_bar();
				}
			})
		};
		
		if(this.System.isMobileDevice()){
				//this.enable_mouse_controlled_mode();
				this.createMessageBox("Alert","This game mode is for PC only.",()=>{
					location.href="./home-page/index.html";
				});
		}
		
		let _p_pos=this._entities['player'].Position;
		
		/*
		let _average_speed_container=document.createElement("div");
	    _average_speed_container.style.position="absolute";
		_average_speed_container.style.top="100px";
		_average_speed_container.style.left="700px";
		_average_speed_container.style.color="white";
		this._root_div.appendChild(_average_speed_container);
		this._me.enable_average_speed_measurement();
		this.add_to_update_function_list((t)=>{
			_average_speed_container.innerHTML=this._me.get_average_speed()+" km/s";
			//console.log("speed:"+this._me._average_speed);
		});
		*/
		
	}});
	
	this.enable_window_resize_event_listener();
	
	_last_pos.position.copy(this._graphics.Camera.position);
	
	//this._player_mission_data=new MissionDataMG({game:this});
	
	
  }
  
  create_solar_system(){
	  try{
		this._entities['player']._model.position.set(9500,0,-999999);
		
		this._solar_system=new BaseStarSystem({game:this,position:new THREE.Vector3(9500,0,-990999)});
		this._solar_system.create_star_gate();
	  }catch(e){alert(e.stack);}
  }
  move_to_earth(){
		let _earth=this._solar_system.get_earth();
		let _earth_radius=_earth._params.radius;
		let _player_pos=_earth.get_world_position();
		_player_pos.x+=(_earth_radius*3);
		_player_pos.z-=(_earth_radius*2);
		_player_pos.y+=(_earth_radius/3);
		this._entities['player']._model.position.copy(_player_pos);
		let _earth_pos=_earth.get_world_position();
		let _look_pos=this._utils.calculateSymmetricPoint(_player_pos,_earth_pos);
		this._entities['player']._model.lookAt(_look_pos);
		
		this._init_player_pos=_player_pos;
		
		if(!this._service_base){
			this._baseMG._load_complete_fc=()=>{
				let _service_base_pos=this._utils.findMidpoint(this._graphics.Camera.position,_earth.get_world_position());
				//let _service_base_pos=new THREE.Vector3(this._graphics.Camera.position.x,
											//this._graphics.Camera.position.y-150,
											//this._graphics.Camera.position.z);
				//let _service_base_pos=_earth_pos.clone();
				//_service_base_pos.x+=(_earth_radius*3);
				//_service_base_pos.y+=(_earth_radius*1.5);
				//_service_base_pos.z+=(_earth_radius*3);
				//alert(_service_base_pos.x+" and "+_service_base_pos.y+" and "+_service_base_pos.z);
				this._service_base=this._baseMG.create_service_base_1(_service_base_pos);//su dung nhieu lan
				//this._game._entities['_radar'].addTarget(this._service_base);
				this._baseMG._service_base=this._service_base;
				this._service_base_pos=_service_base_pos;
			};
			this._baseMG.load_data();
		}
		else
			this._service_base.goto_position(this._service_base_pos);
  }
  
  get_universe(){
	  return _universe;
  }
	_OneSecondPass(){//overwrite
		
		super._OneSecondPass();
		if(!this._me)return;
		
		this._CheckDistanceToPlanets();
		
		if(this._unitMG.no_unit_alive()){
			this._entities['player']._params.arrow.visible=false;
		}
		
		if(this._entities['_controls2'].engine_active===true){
			this._entities['player'].takefuel(0.0001);
		}
		
		//document.getElementById("cashText").innerHTML=this._me._inventory._cash;
		document.getElementById("scoreText").innerHTML=kill_num;
		
		_px=parseInt(this._graphics.Camera.position.x);
		_py=parseInt(this._graphics.Camera.position.y);
		_pz=parseInt(this._graphics.Camera.position.z);
		_coordinates.innerHTML='<span>X: </span>'+_px+', &nbsp;&nbsp;&nbsp; <span>Y: </span>'+_py+', &nbsp;&nbsp;&nbsp; <span>Z: </span>'+_pz+'';
		
	}
	Update_1(timeInSeconds){//overwrite
		
		_universe.update(timeInSeconds);
		
		this._unitMG.Update();
		
		this._missionMG.Update(timeInSeconds);
		
	}
	
  _OnInitialize() {
	  
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
	//this._entities['_explosionSystem1'] = new ExplodeParticles_1(this);
	//this._entities['_explosionSystem2'] = new ExplodeParticles_2(this);
   
   this._CreateGUI();
	/*
    this._entities['_terrain'] = new terrain.TerrainChunkManager({
		//Create Texture For Planet
		//Bo doan nay di thi planet se ko co texture
      camera: this._graphics.Camera,
      scene: this._graphics.Scene,
      gui: this._gui,
      guiParams: this._guiParams,
      game: this
    });
	*/
	
    this._library = {};
	/*
	let loader = new GLTFLoader();
    
		loader.load( './resources/models/characters/astronaut.glb',  ( gltf )=> {
				
		let _obj = gltf.scene;
		_obj.traverse( function( node ) {
				if ( node instanceof THREE.Mesh ) { 
					node.castShadow = true; 
					node.material.side = THREE.DoubleSide;
				}
			});
	  
			_obj.position.set(0, 0, 0 );
			_obj.scale.set(0.8,0.8,0.8);
			_obj.rotation.y=Math.PI;
			
			const group = new THREE.Group();
			group.add(_obj);
			//this._graphics.Scene.add(group);
			
			this._human_shape=group;
			this._human_gltf=gltf;
			
		});
	*/
	this._InitEventListener();
    this._LoadBackground();//universe background
	
	this.create_message_icon();
	
	_universe=new Universe({scene:this._graphics.Scene,camera:this._graphics.Camera,game:this});
	_universe.create_galaxy(1);
	
	document.getElementById("root-inventory").addEventListener("click",()=>{
		this._root_inventory.init_root_store_panel();
	});
	document.getElementById("solar-system-earth").addEventListener("click",()=>{
		this.move_to_earth();
	});
	
	document.getElementById("starlist-img").addEventListener("click",()=>{
		let _iframe=this.show_iframe('./frame/starlist/index.html',function(){});
		_iframe.addEventListener('load', ()=> {
			let iframeContent = _iframe.contentWindow;
			let _tlist=_universe.get_current_galaxy().get_all_starsystem_with_id_name_and_position();
			
			iframeContent.set_ship_position(this._me.Position);
			iframeContent.set_system_list(_tlist);
			iframeContent.set_select_star_system_fc(()=>{
				this._unitMG.remove_all_enemy_combat_unit();
				this._unitMG.update_enemy_combat_unit_list();
				this._baseMG.remove_all_base();
				
				this.remove_iframe();
				
				this._sound.play('teleport');
				
				this._entities['_controls2'].turn_off_engine();
				this._entities['_controls2']._stop_auto_move_ahead=true;
				
				let _effect1=new Teleport1({game:this});
				_effect1.create_system_1(this._entities['player'].Position,new THREE.Vector3(0,1,0));
				
				//let _t_fc=()=>{};
				//this.add_to_update_function_list();
				
				this.add_to_timer(()=>{
				
					let _pos=iframeContent.get_select_system_position();
					
					this._entities['player']._model.position.set(_pos[0]+5,_pos[1]+10,_pos[2]);
					
					let _look_pos=this._utils.calculateSymmetricPoint(this._me.Position,_pos);
					this._entities['player']._model.lookAt(_look_pos);
					
					this._entities['_controls2']._stop_auto_move_ahead=false;
				},3);
			});
		});
	});
	/*
	document.getElementById("mission-img").addEventListener("click",()=>{
		this.show_mission_panel();
	});
	
	document.getElementById("home-img").addEventListener("click",()=>{
		this._StopRender();
		this._Clear();
		window.location.href = "index-2.html";
	});
	*/
	/*
	window.addEventListener('beforeunload',()=>{
		this._me._inventory.save_data();
		this._me._ship_package.save_data();
	});
	*/
	
	
	Unit.AfterAppearing=(_unit)=>{
		/*
		if(_unit===this._me)return;
		let div = document.createElement( 'div' );
	  div.innerHTML="<img src='./resources/gif/explosion/circle2.gif' style='width:200px;height:200px'/>";
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
	  },3);
	  */
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
	let _total_exp=0;
	Unit.AfterDead=(_unit)=>{
		this._unitMG.update_enemy_combat_unit_list();
		if(_unit._is_enemy===true){
		
			kill_num+=1;
			
			/*
				chi nhan duoc bonus khi hoan thanh mission chu ko tinh theo so luong unit tiet diet dc
			*/
			let _new_bonus=0;
			this.add_to_cash_list(_new_bonus);
			const _t_exp=this._parameters._standard_exp_2;
			//this._me._ship_package.plus_ship_exp(_t_exp);
			this.add_to_exp_list(_t_exp);
		}
		//----------------------
		
		
		const _rs=this._me._ship_package.upgrade_level();
		if(_rs===true){
			this._noticeBoard.add_message("Leveled up: "+this._me._ship_package.get_ship_level());
			//this._me._ship_package.save_data();
		}
		//this._me._ship_package.save_data();
		
		
		//-----------
		if(_unit===this._me){
			//alert("YOu are Dead!");
			this._StopGame();
			this.createMessageBox("Game Over","you have been destroyed",()=>{});
			//this._StopRender();
			return;
		}
		return;
		let _img=this._image_preloader.getImage('explosion-1');
		
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
	
	this.add_radar();
	
	const _renderer_div=document.getElementById("CSS2DRenderer")
	const _labelRenderer=this._graphics.enable_CSS2D_Renderer(_renderer_div);
	this._unitMG.after_create_enemy_combat_unit_fc_2=(_unit)=>{	
		//if(_unit._is_enemy)	
			//_unit.create_label_1("<img src='./resources/icons/location1.png' width='30' height='30' />");		
					
	};
	//_labelRenderer.domElement.style.zIndex="-1";
	
	
  }
  
  _StopGame(){
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
			//this._mission_icon.remove();
			this._missionMG.init_mission(1,_universe,()=>{
				this.add_to_cash_list(this._parameters._mission_1_bonus);
				_nav_bar.style.visibility="visible";
				this._unitMG.enable_auto_create_enemy();//Tiep tuc tao enemy ship khi tiep can hanh tinh bat ky
				this._me._inventory.add_cash(this._parameters._mission_1_bonus);
				this.createMessageBox("Mission Completed!","You have earned "+this._config.mission_1_bonus+"$");
				this.update_player_data();
				//this.update_cash();
				setTimeout(()=>{
					location.href="./home-page/index.html";
				},5000);
			},_stop_mission_fc);
		};
		let _mission_fc_2=()=>{
			_nav_bar.style.visibility="hidden";
			this._unitMG.disable_auto_create_enemy();
			//this._mission_icon.remove();
			//this._entities["_controls2"]._move.fire=true;
			this._missionMG.init_mission(2,_universe,()=>{
				this.add_to_cash_list(this._parameters._mission_2_bonus);
				this._unitMG.enable_auto_create_enemy();//Tiep tuc tao enemy ship khi tiep can hanh tinh bat ky
				_nav_bar.style.visibility="visible";
				let _new_bonus_2;
				if(this._missionMG._replay_mission_2_level)//choi lai
					_new_bonus_2=this._parameters._mission_2_sub_bonus;
				else
					_new_bonus_2=this._parameters._mission_2_bonus;
				this.createMessageBox("Mission Completed!","You have earned "+_new_bonus_2+"$"+
							"<br/> and "+this._missionMG._mission_2_reward_item_num+" "
							+this._missionMG._mission_2_reward_item_name
						);
				
				
				
				this.update_player_data();
				setTimeout(()=>{
					location.href="./home-page/index.html";
				},5000);
			},_stop_mission_fc);
		};
		let _mission_fc_3=()=>{
			_nav_bar.style.visibility="hidden";
			this._unitMG.disable_auto_create_enemy();//Ko tao enemy ship khi tiep can hanh tinh bat ky
			this._unitMG.remove_all_enemy_combat_unit();
			this._unitMG.update_enemy_combat_unit_list();
			this._baseMG.remove_all_base();
			//this._mission_icon.remove();
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
				this.update_player_data();
				setTimeout(()=>{
					location.href="./home-page/index.html";
				},5000);
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
  
 
  
  
  _CheckDistanceToPlanets(){//Kiem tra xem co tien toi qua gan planet/moonn/star/base nao ko
	  let _object;
	  
	  let _pos=this._me._model.position;
	  let _distance,_radius;
	  for(let i in this._entities){
		  _object=this._entities[i];
		  if(_object._is_spherical_entity){
			  _radius=_object.get_radius();
			  _distance=_pos.distanceTo(_object.get_world_position());
			  if(_distance<=_radius+3000){
				  //try{
				  //_object.function_1(1,new THREE.Vector3(0,0,0));
				  if(_object._is_planet&&_object._able_to_create_base===true){
					 _object._lock_planet_rotate=true;
					 //try{
						 //if(!this._fuck_var){this._fuck_var=true;
						 //this._unitMG.add_enemy_combat_unit_group(5,7,1);alert('good');
						 //}
					this._baseMG.create_base_for_planet(_object);
					// }catch(e){alert(e.stack);}
					this._baseMG.check_if_all_base_in_planet_defeated(_object);
					//this._unitMG.create_enemy_unit_of_planet_when_player_approach(_object);
				  }
				  //}catch(e){alert(e.toString());}
			  }
			  if(_distance<=_radius+10){
				 
				  this._me.TakeDamage(1000);
			  }
			  
			  if(typeof _object._speed_rate !='undefined'&&_object._speed_rate!=null){
				  
				  //CÀNG TIẾN LẠI GẦN NGÔI SAO CHỦ THÌ CHUYỂN ĐỘNG CỦA CÁC HÀNH TINH CÀNG CHẬM
				  if(_distance>15000){
					  _object._speed_rate=1;//100%
				  }
				  else{
					  if(_distance>13000){
						   _object._speed_rate=0.8;
					  }
					  else{
						  if(_distance>10000){
							  _object._speed_rate=0.7;
						  }
						  else{
							  if(_distance>8000){
								  _object._speed_rate=0.5;
							  }
							  else{
								if(_distance>6000){
									_object._speed_rate=0.3;
								}  
								else{
									if(_distance>5000)
										_object._speed_rate=0.15;
									else{
										if(_distance>3000)
											_object._speed_rate=0.04;
										else
											_object._speed_rate=0;
									}
								}
							  }
						  }
					  }
				  }
			  }
		  }
		  if(_object._is_base){
			  _distance=_pos.distanceTo(_object.get_world_position());
			  if(_distance<=150){
				  if(_object._type==="mineral")
					  this.create_inventory_icon_1(_object);
				  if(_object._type==="service")
					  this.create_inventory_icon_2(_object);
			  }
			  else{
				  if(_object===this._focusing_base&&this._entities['player']._connecting_base===null){
					 
					  this._focusing_base=null;
					  this.remove_inventory_icon();
					  
				  }
			  }
		  }
	  }
	  //alert(this._entities['_earth'].get_position().distanceTo(_pos));
	  //document.getElementById("time").innerHTML=this._entities['_earth'].get_world_position().distanceTo(_pos);
  }

  _CreateGUI() {
    this._CreateGameGUI();
    this._CreateControlGUI();
  }

  _CreateGameGUI() {
    const guiDiv = document.createElement('div');
    guiDiv.className = 'guiRoot guiBox';

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
    document.body.appendChild(guiDiv);
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


//-----------------------------------------------------

function _Main() {
	
  _APP = new ProceduralTerrain_Demo();
  
}

_Main();


