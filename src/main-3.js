import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import { CSS2DRenderer, CSS2DObject } from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/renderers/CSS2DRenderer.js';

//import {ColladaLoader} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/loaders/ColladaLoader.js';
//import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/loaders/GLTFLoader.js';
import {GUI} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/libs/dat.gui.module.js';
//import {BufferGeometryUtils} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/utils/BufferGeometryUtils.js';

import {agent} from './agent.js';
import {controls} from './controls.js';
//import {game} from './game.js';
import {SpaceShipGame} from './space-ship-game.js';
import {math} from './math.js';
import {terrain} from './terrain.js';
import {visibility} from './visibility.js';

import {PlayerShip1} from './player-ship-1.js';
import {PlayerShip2} from './player-ship-2.js';
import {blaster} from './units/blaster.js';
import {PlayerEntity} from './player-entity.js';
//import {EnemyEntity} from './enemy-entity.js';
import {Radar} from './radar.js';
import {thruster} from './thruster.js';
import {HumanEntity} from './human.js';

import {Galaxy} from './core/galaxy.js';
import {Universe} from './core/universe.js';
import {SphericalObject} from './core/spherical-object.js';

import {Unit} from './units/unit.js';
import {inventory} from './inventory.js';

import {ExplodeParticles} from './explode-particles.js';

import {Room} from './MultiPlayerCore/room.js';
//import {Player} from './player.js';

import {Planet} from './core/planet.js';

import {NavigatorBar3} from './navigator-bar-3.js';
import {ShipPackage} from './ship-package.js';

import {ScoreRankMG} from './score-rank-mg.js';

import {ComputerPlayerMG} from './computer-player-mg.js';

import {CongratulationScreen} from './congratulation-screen.js';
import {CombatModeRewardMG} from './combat-mode-reward.js';

let _APP = null;

const _NUM_BOIDS = 100;
const _BOID_SPEED = 100;
const _BOID_ACCELERATION = _BOID_SPEED / 2.5;
const _BOID_FORCE_MAX = _BOID_ACCELERATION / 20.0;
const _BOID_FORCE_ORIGIN = 50;
const _BOID_FORCE_ALIGNMENT = 10;
const _BOID_FORCE_SEPARATION = 20;
const _BOID_FORCE_COLLISION = 50;
const _BOID_FORCE_COHESION = 5;
const _BOID_FORCE_WANDER = 3;




let _universe=null;
//let _coordinates=document.getElementById("coordinates");
let _px,_py,_pz;
//let _my_status_list=new Array();//gui trang thai cua minh len server de server gui cho enemy player
let _enemy_status_list_1=new Array();//cua player enemy

//let _2D_mode=true;
let _health_rate=10;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

let _common_y_pos=6000;

//let _mapCenterX=1000;
//let _mapCenterZ=1000;
let _mapRadius=500;
let _centerPosition=new THREE.Vector3(100000,_common_y_pos,100000);

let _player_positions=[
	new THREE.Vector3(_centerPosition.x,_common_y_pos,_centerPosition.z+100),
	new THREE.Vector3(_centerPosition.x,_common_y_pos,_centerPosition.z+200),
	new THREE.Vector3(_centerPosition.x,_common_y_pos,_centerPosition.z+300),
	
	new THREE.Vector3(_centerPosition.x+100,_common_y_pos,_centerPosition.z+100),
	new THREE.Vector3(_centerPosition.x+100,_common_y_pos,_centerPosition.z+200),
	new THREE.Vector3(_centerPosition.x+100,_common_y_pos,_centerPosition.z+300),
];

let _standard_health;
let _computer_health;

const _rocketDelay=3;
const _secondSkillDelay=5;
const _mainSkilDelay=7;

let _computer_enemy_ship_id;

const _score_data_name="combat-mode-score-data";
/*
	HIEN CHUA SU DUNG RANNK-SCORE-MG NHUNG SAU NAY KHA NANG SE PHAI SU DUNG
*/

class ProceduralTerrain_Demo extends SpaceShipGame {
  constructor() {
	  
	  if(_saved_username===null){
		  alert("Plz Login!!!");
		  return false;
	  }
	  
    super({game_id:1,
	load_unit_model_complete:()=>{
		this._score_data=this.get_data_in_database(_score_data_name);
		this._combat_reward=new CombatModeRewardMG({game:this});
		if(this._score_data===null){
			this._score_data={
				win:0,
				loose:0,
				recently:null,//thong tin gan day da thang hay thua nhung ai, (hien chua su dung)
			};
			this.update_data_in_database(_score_data_name,this._score_data);
		}
		
		
		 let _prepare_fc=()=>{
			 
		//this._root_div=document.getElementById("target");
		this._graphics.init_lasers();
		this.create_menu_btton();
		this._unitMG.create_player_entity();
		this._gear_box.switch_gear_by_title("P");
		this._gear_box.hide_panel();
		this._me.hide_hp_bar();
		this._me.hide_mana_bar();
		//this._me._skill_panel.style.visibility="hidden";
		this._navigator_bar_1.hide();
		this._navigator_bar_2.hide();
		this._me.remove_skill_panel();
		//this._me._rocket_package.change_visibility();
		/*
		this.add_to_timer(()=>{
			this._gear_box.switch_gear_by_title("P");
			this._gear_box.switch_gear_by_title("G");
			this._gear_box.switch_gear_by_title(1);
			this._gear_box.switch_gear_by_title(2);
			this._gear_box._lock=true;
		    this._gear_box.hide_panel();
		},2);
		*/
		this._players=new Array();
		this.add_radar();
		
		this._score_rank=new ScoreRankMG({game:this});
		this._computer_player_mg=new ComputerPlayerMG({game:this});
		
		try{
			this.create_score_panel(()=>{
				this._room=new Room({game:this});
				let _init_data2="ship_id:"+this._unitMG._player_ship_id;//player
				let _ship_id=parseInt(localStorage.getItem('player-ship-id'));
				let _ship_package=new ShipPackage({game:this});
				const _rs=_ship_package.load_data(_ship_id);
				const _armour_id=_ship_package.get_using_armour_id();
				if(_armour_id!=null){
					const _armour_level=_ship_package.get_armour_level(_armour_id);
					_init_data2+="!armour:"+_armour_id+":"+_armour_level;
				}
				this._room.init_multi_player_mode(_init_data2);
			},"New Match");
			
		}catch(e){
				alert(e.stack);
		}
	
	
		 };
		 
		let _loader;//Co The Dang Load Player-Ship-Model them 1 lan nua(can phai loai tru)
		let _model_counter=0;
		for(let i=0;i<this._unitMG._player_ship_infors.length;i++){
			const _infor=this._unitMG._player_ship_infors[i];
			const _model_id=_infor.model_id;
			const _model_path=this._unitMG.get_model_file_path(_model_id);
			_loader= new GLTFLoader();
			_loader.load(_model_path,( gltf )=> {
				this._unitMG._data_list[_model_id]=gltf;
				_model_counter++;
				if(_model_counter===this._unitMG._player_ship_infors.length){//load complete
					
					_prepare_fc();
				}
			});
		}
		 
	}});
	
	
  }
  
  create_score_panel(_fc,_btn_text){
	  this.remove_score_panel();
	  this._graphics.create_divider(this._root_div,"rgba(0, 0, 0, 0.4)");
	  this._panel=document.createElement("div");
	  /*
	    this._panel.style.cssText=`
			background: #4b6cb7; 
			background: -webkit-linear-gradient(to right, #4b6cb7, #182848); 
			background: linear-gradient(to right, #4b6cb7, #182848);
		`;
		*/
		this._panel.style.position="absolute";
		this._panel.style.width="700px";
		this._panel.style.height="520px";
		this._panel.style.left="26%";
		this._panel.style.top="15%";
		this._panel.style.border="2px solid transparent";
		this._panel.style.boxShadow="0 0 10px 5px #33BBFF";
		this._panel.style.backgroundColor="rgba(0, 0, 0, 0.5)";
		this._panel.style.zIndex="99999999999999999";
		
		const _title=document.createElement("div");
			  _title.style.textAlign="center";
			  _title.style.color="white";
			  _title.style.position="absolute";
			  _title.style.top="0px";
			  _title.style.left="0px";
			  _title.style.width="100%";
			  _title.style.height="50px";
			  _title.style.background="rgba(39, 149, 245,0.4)";
			  //_title.style.fontSize="24px";
			  //_title.style.border="1px gray solid";
			  _title.style.display="flex";
			  _title.style.justifyContent="center";
			  _title.style.alignItems="center";
			  //_title.innerHTML="<h3>Armours</h3>";
			  _title.innerHTML=`
					<h1  style="
									background: linear-gradient(to bottom, red,white, yellow);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
									font-size: 34px;
									font-weight: bold;
									font-family: 'Orbitron', sans-serif;
				"'>
			  SCORE</h1>`;
		this._panel.appendChild(_title);
		  
		const _close_btn=document.createElement("button");
		_close_btn.classList.add('custom-new-btn','new-btn-2');
		_close_btn.style.position="absolute";
		_close_btn.style.width="25px";
		_close_btn.style.height="25px";
		_close_btn.style.top="0%";
		_close_btn.style.right="0%";
		//_close_btn.style.backgroundColor="turquoise";
		_close_btn.innerHTML="X";
		_close_btn.classList.add('close-icon');
		
		//this._panel.appendChild(_close_btn);
		_close_btn.addEventListener("click",()=>{
			 this.remove_score_panel();
			 _fc();
		});
		
		
		this._root_div.appendChild(this._panel);
		
		let _wins=this._score_data.win;
		let _loose=this._score_data.loose;
		let _recentlys=this._score_data.recently;
		
		let _content=document.createElement("div");
			_content.style.marginTop="290px";
			_content.style.marginLeft="230px";
		let _win=document.createElement("div");
			_win.innerHTML=`
				<div style="display: flex;margin-left:70px;">
					<h2 style="background: linear-gradient(to bottom, yellow,white, yellow);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent">WIN:</h2>
					<h2 style="color:white">`+_wins+`</h2>
				</div>
			`;
		let _lose=document.createElement("div");
			_lose.innerHTML=`
				<div style="display: flex;margin-left:70px;">
					<h2 style="background: linear-gradient(to bottom, red,white, red);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent">DEFEATED:</h2>
					<h2 style="color:white">`+_loose+`</h2>
				</div>
			`;
		
		let _recently=document.createElement("div");
		if(_recentlys!=null){
			
		}
		
		const _btn=document.createElement("button");
		_btn.classList.add('custom-new-btn','new-btn-2');
		//_btn.style.position="absolute";
		_btn.style.width="125px";
		_btn.style.height="55px";
		//_btn.style.top="0%";
		_btn.style.left="60px";
		_btn.style.visibility="hidden";
		_btn.innerHTML=_btn_text;
		_btn.classList.add('close-icon');
		
		_btn.addEventListener("click",()=>{
			 this.remove_score_panel();
			 _fc();
		});
		
		let _reward_infor_panel=this.create_next_reward_infor_panel();
		//alert(_reward_infor_panel.innerHTML);
		
		this.add_to_timer(()=>{
			let _reward_frame=this.create_reward_progress_bar(()=>{
					_btn.style.visibility="visible";
					let _percent=this.get_reward_progress_percent();
					if(_percent===100){
						/*
							Cu moi lan mo? panel len la se check reward bat ke la 
							truoc khi vao tran dau hay sau tran dau
						*/
						this._combat_reward.check_reward();//chi check reward sau khi da hien thi vi sau khi check du lieu se thay doi
						let _screen=new CongratulationScreen({game:this});
						_screen.create_iframe();
						this._root_div.appendChild(_screen.Frame);
						_reward_infor_panel.innerHTML=`
							<h3 style="background: linear-gradient(to bottom, yellow,white, yellow);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent">
								You have received your reward, \n check your inventory!
							</h3>
						`;
						//setTimeout(()=>{
							//this.createMessageBox("Reward","You have received your reward, check your inventory!");
						//},7000);
					}
					
			});
			_reward_frame.style.top="0px";
			_reward_frame.style.left="200px";
			
			this._panel.appendChild(_reward_frame);
			
		},2);
		
		let _br=document.createElement("br");
		
		_content.appendChild(_win);
		_content.appendChild(_br);
		_content.appendChild(_lose);
		_content.appendChild(_br);
		_content.appendChild(_recently);
		_content.appendChild(_br);
		_content.appendChild(_btn);
		this._panel.appendChild(_reward_infor_panel);
		this._panel.appendChild(_content);
		
  }
  create_next_reward_infor_panel(){
	  let _reward_infor=this._combat_reward.get_reward_infor();
	  let _container=document.createElement("div");
		 _container.style.position="absolute";
		 _container.style.top="80px";
		 _container.style.left="450px";
		 _container.style.width="220px";
		 _container.style.height="200px";
		 //_container.style.background="rgba(0, 0, 0,0.5)";
	   
       let _next_level="Next level: "+_reward_infor.next_level;	
	   let _cash="Cash: "+_reward_infor.cash+"$";
	   let _turn="Lucky wheel turns: "+_reward_infor.turn;
	   
	   let _style1=`background: linear-gradient(to bottom, white,white, green);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent`;
	   
	   _container.innerHTML=`<div>`+
			`<h3 style="`+_style1+`">`+_next_level+`</h3>\n`+
			`<h3 style="`+_style1+`">`+_cash+`</h3>\n`+
			`<h3 style="`+_style1+`">`+_turn+`</h3>`+
			`</div>`;
	  
	  return _container;
  }
  get_reward_progress_percent(){
	  let _reward_infor=this._combat_reward.get_reward_infor();
	  let _next_level=_reward_infor.next_level;	 
	  let _win_num_require=_reward_infor.win_num_require;
	  let _current_win_num=_reward_infor.current_win_num;
	  
	  let _percent=(_current_win_num/_win_num_require);
	      _percent=Math.floor(_percent*100);
	  if(_percent>100)_percent=100;
      return _percent;
  };
  create_reward_progress_bar(_fc){
	 
		let _iframe=document.createElement("iframe");
		_iframe.scrolling="no";
		   _iframe.style.zIndex="999999999999999";	
		 _iframe.style.position="absolute";
		 _iframe.style.width="300px";
		 _iframe.style.height="300px";
		 _iframe.style.border="none";
		 _iframe.style.overflow="hidden";
		 //_iframe.style.visibility="hidden";
		 _iframe.src="./frame/circular-progress-bar.html";
		 
		 let _percent=this.get_reward_progress_percent();
		 
		_iframe.addEventListener('load', ()=> {
			_iframe._loaded=true;
			this.add_to_timer(()=>{
				_iframe.contentWindow.animate('#00ff99','#0066ff',_percent,
					"Reward",()=>{
						_fc();
					});
			},1);
			
		});
		
		return _iframe;
		//_container.appendChild(_iframe);
		//this._root_div.appendChild(_container);
		//this.add_to_timer(()=>{
			//_container.remove();
		//},15);
  }
  remove_score_panel(){
	  if(this._panel&&this._panel!=null){
			this._panel.remove();
			this._panel=null;
			this._graphics.remove_divider();//<================
		}
  }
  
  
  
	Update_1(timeInSeconds){//overwrite
		
		this._unitMG.Update();
		
		if(this._client)this._client.update_status();
		this._missionMG.Update(timeInSeconds);
		
	}
	_OneSecondPass(){//overwrite
		//document.getElementById("time").innerHTML = this.currentSecond;
		super._OneSecondPass();
		if(!this._me)return;
		this._CheckDistanceToPlanets();
		
		if(this._unitMG.no_unit_alive()){
			this._entities['player']._params.arrow.visible=false;
		}
		
		this._room.get_me().update_client_time();
		
	}
	
	
  _OnInitialize() {

	this._config={
		magnification_factor:450000//hệ số phóng đại dữ liệu khoảng cách trong data load lên
	};
	
	//this._lock_controls=false;
	
    this._CreateGUI();
	
		
	
    this._userCamera = new THREE.Object3D();
    this._userCamera.position.set(4100, 0, 0);

    this._graphics.Camera.position.set(9500,0,-500);
    this._graphics.Camera.quaternion.set(-0.032, 0.885, 0.062, 0.46);
	//this._graphics.create_demo_planets();
	this._graphics._CreateLights();

    this._score = 0;
	
	this._sound.load_sounds();
	this._clock = new THREE.Clock();
	
    // This is 2D but eh, whatever.
    this._visibilityGrid = new visibility.VisibilityGrid(
      [new THREE.Vector3(-40000, 0, -40000), new THREE.Vector3(40000, 0, 40000)],
      [100, 100]);
	
    this._entities['_explosionSystem'] = new ExplodeParticles(this);
   
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
	
	this._InitEventListener();
    this._LoadBackground();//universe background
	
	Unit.AfterDead=(_unit)=>{
		this._keep_auto_attack=false;
		this._keep_enemy_auto_attack=false;
		this._keep_scene_rolling=false;
		this._keep_ships_rolling=false;
		
		this._unitMG.update_enemy_combat_unit_list();
		let _html='';
		if(_unit._is_enemy===true){
			this._score_rank.win_battle(this._me._player_id);
			this._score_data.win=parseInt(this._score_data.win)+1;
			this._combat_reward.win_a_match();
			/*
			let _reward_rs=this._combat_reward.check_reward();
			if(_reward_rs===null){
				alert("NO REWARD");
			}
			else{
				alert("REWARDED cash="+_reward_rs.cash+" wheel="+_reward_rs.wheel_turn);
			}
			*/
			_html=`
						You Won!
					`;
			this.createMessageBox("Mission Completed",_html,()=>{
						this.create_score_panel(()=>{
							this.show_game_menu_1();
						},"Confirm");
			});
			
		}
		else{
			if(_unit===this._me){
				this._score_rank.lose_battle(this._me._player_id);
				this._score_data.loose=parseInt(this._score_data.loose)+1;
				_html=`
						You Died!
					`;
			    this.createMessageBox("Game Over",_html,()=>{
						this.create_score_panel(()=>{
							this.show_game_menu_1();
						},"Confirm");
				});
			}
		}
		this.update_data_in_database(_score_data_name,this._score_data);
		//alert(this._score_rank.get_win_num(this._me._player_id));
		//alert(this._score_rank.get_lose_num(this._me._player_id));
	};
	
	Unit.Take_Damage_Callback=(_unit1,_unit2,_damage)=>{
		if(_unit2)
		if(_unit2===_unit2._game._me){
			//this._noticeBoard.add_message("Damage:"+_damage);
			this._client.cause_damage(_unit1._multi_player_game_id,_damage);
		}
		
	};
	
	/*
	const _renderer_div=document.getElementById("CSS2DRenderer")
	const _labelRenderer=this._graphics.enable_CSS2D_Renderer(_renderer_div);
	this._unitMG.after_create_enemy_combat_unit_fc_2=(_unit)=>{
					var div = document.createElement( 'div' );
					div.innerHTML="Enemy";
					div.style.fontSize="20px";
					div.style.color="red";
					var label = new CSS2DObject( div );
					label.name='lable';
					_unit._model.add(label);
					label.position.set(0,5,0);
	};
	*/
	
	this.add_to_timer(()=>{
		//this._navigator_bar_1.hide();
		//this._navigator_bar_2.hide();
	},1);
	
	
  }
  
  create_add_skill_panel(){
	  this._navigator_bar_3=new NavigatorBar3({game:this});
	    
		let _add_skills=this._me._ship_package.get_ship_additional_skills();
		
		for(let i=0;i<_add_skills.length;i++){
			const _item=_add_skills[i];
			const _id=_item.id;
			const _level=_item.level;//alert(_id+"="+_level);
			
			if(this._me._ship_package.using_additional_skill(_id))
				this._navigator_bar_3.set_fix_skill(_id);
		}
		
		this._navigator_bar_3.init();
		this._navigator_bar_3.unlock_mouse_event();
  }
  //4!ship_id:3%5!ship_id:2
  init_player_ship_position(_str){//alert(_str);
	  const _list=_str.split("-");
	  for(let i=0;i<_list.length;i++){
		  const _element=_list[i].split(":");
		  const _pid=parseInt(_element[0]);
		  const _ship=this.get_player_ship(_pid);
		  const _pos=_player_positions[i];
			    _ship._model.position.copy(_pos);
				_ship._multi_player_game_id=_pid;
				
				//_ship.set_group_id(1);
				//_ship.EquipArmour(3,10);//<==
		  //alert("Found-"+i);
	  }
  }
 
  
  init_3D_mode(){
	  _standard_health=50000;
	  _computer_health=_standard_health;
	  
	  //document.getElementById("hpBarWrapper").style.visibility="hidden";
	  document.getElementById("mana-bar").style.visibility="hidden";
	  document.getElementById("radar-container").style.visibility="hidden";
	  
	  //this._root_div.style.visibility="hidden";

	  this._LoadBackground();
	  this.rocket_multiplier=2;//do scale cua enemy qua' lon' nen ban' ko trung'
	  //this._gear_box.switch_gear_by_title("P");
	  
	  //this._me.remove_skill_panel();
	  //this._me._rocket_package.change_visibility();
	  this._entities['_controls2']._speedX=0.0;
	  this._entities['_controls2']._speedY=0.0;
	  
	  this.create_add_skill_panel();
	  
	  
	  //this._entities['_controls2']._camera_altitude=210;
	  //this._entities['_controls2'].UpdateCamera=this._entities['_controls2'].UpdateCamera_3;
	
	  let _enemy_1=this._players[0];
	      _enemy_1._model.scale.multiplyScalar(3.5);
		  this._me._model.scale.multiplyScalar(0.9);
	
	  try{
		//this.enable_auto_attack_3d_mode();
		  let _enemy_auto_attack=null;
		  
	  let init_pos_1=new THREE.Vector3(1000,6000,1000);//vi tri cua chu phong
	  let init_pos_2=new THREE.Vector3(1000,6000,1250);//vi tri doi thu
	  
	  if(this._room.get_me().is_key()){
		this._me._model.position.copy(init_pos_1);
	    _enemy_1._model.position.copy(init_pos_2);
		
		//this._me.look_at(init_pos_2);
		//_enemy_1.look_at(init_pos_1);
	  }
	  else{
		this._me._model.position.copy(init_pos_2);
	    _enemy_1._model.position.copy(init_pos_1);
		//this._me.look_at(init_pos_1);
		//_enemy_1.look_at(init_pos_2);
	  }
	  
	  _enemy_1.look_at(this._me.Position);
	  this._me.look_at(_enemy_1.Position);
	  
	  let _player_pos=this._me.Position;
	  let _center_pos=this._utils.findMidpoint(init_pos_1,init_pos_2);
	  
	  if(this._player_vs_computer_mode===true){
		  //_enemy_1._is_enemy=true;
		  //_computer_enemy_ship_id=this._utils.get_random_in_range(1,5);
		  let _enemy_ship_main_skill_fc;
		  let _enemy_ship_passive_skill_fc;
	  
		if(_computer_enemy_ship_id===1)_enemy_ship_main_skill_fc=_enemy_1.apply_flash_skill;
		if(_computer_enemy_ship_id===2)_enemy_ship_main_skill_fc=_enemy_1.apply_continuous_rocket_skill;
		if(_computer_enemy_ship_id===3)_enemy_ship_main_skill_fc=_enemy_1.apply_light_ball_skill;
		if(_computer_enemy_ship_id===4)_enemy_ship_main_skill_fc=_enemy_1.apply_fire_breathing_skill;
		if(_computer_enemy_ship_id===5)_enemy_ship_main_skill_fc=_enemy_1.apply_rain_of_bullets_skill;
		//alert(_computer_enemy_ship_id);
		//_enemy_ship_passive_skill_fc=_enemy_1.apply_passive_skill_multi_rocket_1;
		let _enemy_1_level=this._me._ship_package.get_ship_level();
		let _second_skill_num=4;
		let _full_second_skill_id=new Array();
		for(let i=0;i<this._parameters.spaceship_additional_skills.length;i++){
			let _skill_infor=this._parameters.spaceship_additional_skills[i];
			if(_skill_infor.ship_level<=_enemy_1_level&&
				this._parameters.is_additional_skill_use_for_computer_in_combat_mode(_skill_infor.id)===true)
				_full_second_skill_id.push(_skill_infor.id);
		}
		if(_second_skill_num>_full_second_skill_id.length)
			_second_skill_num=_full_second_skill_id.length;
		let _second_skill_id=this._utils.get_random_elements_from_array(_full_second_skill_id,_second_skill_num);
		//alert(_second_skill_id);
		  let _perform_main_skill_1=()=>{
			  if(!this._keep_enemy_auto_attack)return;
			  if(_enemy_1.Dead)return;
			  _enemy_1.look_at(this._me.Position);
			  _enemy_ship_main_skill_fc(_enemy_1,_enemy_1_level);
			  this.add_to_timer(()=>{
				_perform_main_skill_1();
			  },_mainSkilDelay);
		  };
		  let _perform_second_skill=(_id)=>{
			  if(!this._keep_enemy_auto_attack)return;
			  if(_enemy_1.Dead)return;
			  _enemy_1.look_at(this._me.Position);
			  //_enemy_1.apply_additional_skill_generate_multi_photon_1(_enemy_1,_enemy_1_level);
			  try{
			  let _rand_num=this._utils.get_random_in_range(0,_second_skill_id.length-1);//alert(_rand_id);
			  let _rand_id=_second_skill_id[_rand_num];
			  let _perform_fc=this._parameters.get_additional_skill_create_fc(_rand_id);
			  _perform_fc(_enemy_1,_enemy_1_level);
			  }catch(e){
				  alert(e.stack);
				  }
			  this.add_to_timer(()=>{
				_perform_second_skill();
			  },_secondSkillDelay);
		  };
		  
		  let _computer_full_ship_rocket_id=[1,3,4,6,7,8];
		  let _computer_ship_rocket_id=this._utils.get_random_elements_from_array(_computer_full_ship_rocket_id,3);
		  let _computer_rocket_counter=0;
		  let _launch_rocket=(_id)=>{
			  if(!this._keep_enemy_auto_attack)return;
			  if(_enemy_1.Dead)return;
			  _enemy_1.look_at(this._me.Position);
			  //let _t_rocket_id=this._utils.get_random_in_range(1,4);
			  
			  _enemy_1._rocket_package.launch_rocket(_computer_ship_rocket_id[_computer_rocket_counter]);
			  _computer_rocket_counter++;
			  if(_computer_rocket_counter>_computer_ship_rocket_id.length-1)
				  _computer_rocket_counter=0;
			  
			  this.add_to_timer(()=>{
				_launch_rocket();
			  },_rocketDelay);
		  };
		  
		  this._keep_enemy_auto_attack=true;
		  
		  _enemy_auto_attack=()=>{
			  /*
				lan luot thoi gian de thuc hien cac skill+rocket cua 2 ship la:
				2  4  6
				va
				3  5  7
				de ko trung` nhau ma van can bang
			*/
			
			
			this.add_to_timer(()=>{
				_launch_rocket();
			},2);
			this.add_to_timer(()=>{
				_perform_main_skill_1();
			},4);
			this.add_to_timer(()=>{
				_perform_second_skill();
			},6);
		  };
		  
		  _enemy_auto_attack();
	  }
	  this.add_to_timer(()=>{
		  //this._gear_box.switch_gear_by_title("P");
		  //this._gear_box._lock=true;
		  this.enable_auto_attack_3d_mode();
	  },2);
	  this.add_to_timer(()=>{
		  //this.enable_auto_attack_3d_mode();
		  //if(_enemy_auto_attack!=null)_enemy_auto_attack();
		  
		  if(this._players.length===1){//1 vs 1
		    this._hp_bars=new HpBars({game:this});
			
				this._hp_bars.init(_saved_username,this._computer_player_name_1);
				this._me.add_take_damage_callback(()=>{//Trong P VS P mode khi take-damage ko goi den function nay
					this._hp_bars.changePlayerHP(1,this._me._health,this._me._max_health);
				});;
				let _enemy_ship=this._players[0];
				_enemy_ship.add_take_damage_callback(()=>{
					this._hp_bars.changePlayerHP(2,_enemy_ship._health,_enemy_ship._max_health);
				});
		    
		  }
	  },5);
	  
	  
	  let _roll_left=81;
	  let _rool_right=69;
	  //let _left=true;
	  let _ship_roll_counter=0;
	  this._keep_ships_rolling=true;
	  let _start_roll=()=>{
		  //const randomBoolean = Math.random() < 0.5;//true or false
		  if(!this._keep_ships_rolling)return;
		  _ship_roll_counter++;
		  if(_ship_roll_counter<=1)this.auto_key_down(_rool_right);
		  else this.auto_key_down(_roll_left);
		  if(_ship_roll_counter>=2)_ship_roll_counter=0;
		  //_left=!_left;
		  
		  this.add_to_timer(()=>{
					_stop_roll();
					_enemy_1.look_at(this._me.Position);
					this._me.look_at(_enemy_1.Position);
			  },1);
	  };
	  let _stop_roll=()=>{
		  this.auto_key_up(_roll_left);
		  this.auto_key_up(_rool_right);
		  this.add_to_timer(()=>{_start_roll();},6);
	  };
	  this.add_to_timer(()=>{_start_roll();},5);//<==========
	  
	  let _scene_group=new THREE.Group();
	      _scene_group.position.copy(_center_pos);
	  this._graphics.Scene.add(_scene_group);
	  
	  let _rotate_left=true;
	  let _rotate_up=true;
	  this._keep_scene_rolling=true;
	  this.add_to_update_function_list((t)=>{
		  //_scene_group.rotation.x+=t*0.05;
		  if(!this._keep_scene_rolling)return;
		  if(_rotate_left){
			  _scene_group.rotation.y+=t*0.1;
			  if(_scene_group.rotation.y>Math.PI/4){
				  _rotate_left=false;
			  }
		  }
		  else{
			  _scene_group.rotation.y-=t*0.1;
			  if(_scene_group.rotation.y<-Math.PI/4){
				  _rotate_left=true;
			  }
		  }
		  
		  if(_rotate_up){
			  _scene_group.rotation.x+=t*0.1;
			  if(_scene_group.rotation.x>Math.PI/4){
				  _rotate_up=false;
			  }
		  }
		  else{
			  _scene_group.rotation.x-=t*0.1;
			  if(_scene_group.rotation.x<-Math.PI/4){
				  _rotate_up=true;
			  }
		  }
		  
		  
		  if(this._me.Dead||_enemy_1.Dead)
			  return;
		 
		  let _delta=t*10;//di chuyen de cac particles-explosion ko hien thi qua nhieu tren camera lam giam performance
		  this._me._model.position.z+=_delta;
		  _enemy_1._model.position.z+=_delta;
		  _scene_group.position.z+=_delta;
	  });
	  
	  let _planet1=new Planet({scene: this._graphics.Scene,radius:200,
					position:new THREE.Vector3(0,0,1000),
					altitude_atmosphere:20,
					//texture_url:"./texture/planet/RockWorldsPack/1.png",
					texture_url:"./texture/planet/HabitableWorldsPack/17.png",
					color_atmosphere:new THREE.Color("lightblue"),game:this});
		_planet1.create({});
		_scene_group.add(_planet1.get_root());
		
		
	  let _planet2=new Planet({scene: this._graphics.Scene,radius:170,
					position:new THREE.Vector3(0,400,-1000),
					altitude_atmosphere:20,
					texture_url:"./texture/planet/RockWorldsPack/6.png",
					color_atmosphere:new THREE.Color("lightblue"),game:this});
		_planet2.create({});
		_scene_group.add(_planet2.get_root());
		
		let _planet3=new Planet({scene: this._graphics.Scene,radius:230,
					position:new THREE.Vector3(1000,-250,0),
					altitude_atmosphere:20,
					texture_url:"./texture/planet/RockWorldsPack/3.png",
					color_atmosphere:new THREE.Color("lightblue"),game:this});
		_planet3.create({});
		_scene_group.add(_planet3.get_root());
		
		
	  let _planet4=new Planet({scene: this._graphics.Scene,radius:500,
					position:new THREE.Vector3(-1000,-450,0),
					altitude_atmosphere:20,
					texture_url:"./texture/planet/RockWorldsPack/4.png",
					color_atmosphere:new THREE.Color("lightblue"),game:this});
		_planet4.create({});
		_scene_group.add(_planet4.get_root());
	  
	  }catch(e){alert(e.stack);}
  }
  
  
  init_2D_mode(){
	  _standard_health=450000;
	  _computer_health=parseInt(_standard_health/15);
	  
	  let _model_scl=2;
	  this._me._model.scale.multiplyScalar(_model_scl);
	  for(let i=0;i<this._players.length;i++){
		  this._players[i]._model.scale.multiplyScalar(_model_scl);
	  }
	  
	  this._entities['_controls2']._speedX=0.5;
	this._entities['_controls2']._speedY=0.5;
	  
		this._navigator_bar_2._lock_reset_rotation=true;
		this._navigator_bar_2._lock_turn_back_skill=true;
		this._entities['player']._lock_speed_up_skill=true;
		this._gear_box.hide_panel();
		this._navigator_bar_1.lock_mouse_event();
		this._navigator_bar_2.lock_mouse_event();
		//this._graphics.init_lasers();
		this._entities["_controls2"]._lock_enter_key=true;
			this._gear_box.switch_gear_by_title("P");
			//this._gear_box.switch_gear_by_title("G");
			//this._gear_box.switch_gear_by_title(1);
			//this._gear_box.switch_gear_by_title(2);
		
		//this._entities['_controls2']._camera_altitude=210;
		//this._entities['_controls2'].UpdateCamera=this._entities['_controls2'].UpdateCamera_2;
		this._entities['_controls2']._lock_update_camera=true;
		this._entities['_controls2']._lock_move_updown=true;
		this._entities['_controls2']._lock_roll=true;
	
		this.rocket_multiplier=2;
		this._parameters._standard_rocket_speed=25;
		
		//const _renderer_div=document.getElementById("CSS2DRenderer")
		//const _labelRenderer=this._graphics.enable_CSS2D_Renderer(_renderer_div);
		
		this.init_plane_and_mouse_event();
		this.add_to_timer(()=>{
			this.enable_auto_attack();
		},5);
		
		
		
  }
  
  init_plane_and_mouse_event(){
	  const geometry = new THREE.PlaneGeometry( 99999999, 999999999 );
	  //const geometry = new THREE.BoxGeometry( 99, 99, 99 ); 
	  
	  let material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide,
		transparent:true,opacity:0.01} );
	  let plane = new THREE.Mesh( geometry, material );
	  this._graphics.Scene.add( plane );
	  plane.position.copy(this._me.Position);
	  //plane.position.y+=3;
	  plane.rotation.x=Math.PI/2;
	  plane._is_main_plane=true;
	  let _y_length=this._me.Position.y-plane.position.y;
	  //plane.lookAt(this._graphics.Camera.position);
	  
	  /*
	  let geometry2 = new THREE.PlaneGeometry( 3500, 3500 );
	  var textureLoader = new THREE.TextureLoader();
        var texture = textureLoader.load('./resources/textures/16.jpeg'); 
	  let material2 = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide,
		map:texture} );
	  let _ground=new THREE.Mesh( geometry2, material2 );
	  this._graphics.Scene.add( _ground );
	  _ground.rotation.x=Math.PI/2;
	  */
	  this.add_to_timer(()=>{
		  plane.position.copy(this._me.Position);
		  //plane.position.y+=2;
		  
		  //_ground.position.copy(this._me.Position);
		  //_ground.position.y-=5;
	  },5);
	  
	  //this._mouse_div=document.getElementById("mouse-handle-div");
	  this._mouse_div=document.createElement("div");
	  //this._mouse_div.cssText=`position:absolute;width:100%;height:100%`;
	  this._mouse_div.style.position="absolute";
	  this._mouse_div.style.width="100%";
	  this._mouse_div.style.height="100%";
	  this._root_div.appendChild(this._mouse_div);
	  
	  this.enable_window_resize_event_listener();
	  document.body.addEventListener("contextmenu",(event)=>{//prevent browser's popup menu on right click
				event.preventDefault();
			});
			
	  let _mark_point=null;
	  let _update_player_ship=(t)=>{
		  if(!this._me._target_ship||this._me._target_ship===null||this._me._target_ship.Dead
			  ||this._me.Position.distanceTo(this._me._target_ship.Position)>300){
				  this._me._target_ship=null;
				let _targets=this._unitMG.get_enemy_combat_unit_in_range(this._me.Position,300);
				if(_targets.length>0)this._me._target_ship=_targets[0][0];
			  }
		  if(this._gear_box._last_gear==='P'){
			  if(_mark_point!=null){
				  this._graphics.Scene.remove(_mark_point);
				  _mark_point=null;
			  }
			  if(this._me._target_ship&&this._me._target_ship!=null&&!this._me._target_ship.Dead
			    &&this._gear_box.is_parking()){
				  const _time=Math.floor(this._second_counter)-this._gear_box.get_last_parking_time();
				  //console.log("Time="+_time);
				  if(_time>2){
					  //const _t_look_pos=this._me._target_ship.Position;
					   // _t_look_pos.y=this._me.Position.y;
					 // this._me.look_at(_t_look_pos);
				  }
				  
			  }
		  }
	  };
	  this.add_to_update_function_list(_update_player_ship);
	  let _update_player_pos=(t)=>{};
	  //this.add_to_update_function_list(_update_player_pos);
	  
	  
	  let mobile_device=this.System.isMobileDevice();
	 
	  let _mouse_down_handle=(event)=>{
		 
		event.preventDefault();
			const _width=window.innerWidth;
			const _height=window.innerHeight;
			
			if(mobile_device){
				const touch = event.touches[0];
				mouse.x = touch.clientX;
				mouse.y = touch.clientY;
			}
			else{
				mouse.x = (event.clientX / _width) * 2 - 1;
				mouse.y = -(event.clientY / _height) * 2 + 1;
			}
			
			raycaster.setFromCamera(mouse, this._graphics.Camera);
			raycaster.far = 10000;
			let intersects = raycaster.intersectObjects(this._graphics.Scene.children);
			let _object=null;
			let selectedPoint,_look_point;
			if (intersects.length > 0) {
				_object=intersects[0].object;
				selectedPoint = intersects[0].point;
				_look_point=selectedPoint.clone();
				_look_point.y=this._me.Position.y;
				
				let _t_point1=this._utils.findPointOnLine(this._me.Position,_look_point,this._me.Position.distanceTo(_look_point));
				_look_point.copy(_t_point1);//do sai số do khoảng cách giữa plane và me.position.y
				
				this._me.look_at(_look_point);
				
				//const geometry = new THREE.SphereGeometry( 0.5, 16, 16 ); 
				//const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
				//_mark_point = new THREE.Mesh( geometry, material ); 
				//this._graphics.Scene.add( _mark_point );
				//_mark_point.position.copy(_look_point);
			}
		if (event.button === 0){//left click
			if(mobile_device){
				this.remove_function_from_update_list(_update_player_pos);
				this._gear_box.switch_gear_by_title("P");
			}
			//this._me._moving=false;
		}
		else{//right click
			if(_object!=null){
				if(_object._is_main_plane===true){
					
					this._gear_box.switch_gear_by_title("P");
					this._gear_box.switch_gear_by_title("G");
					this._gear_box.switch_gear_by_title(1);
					//this.add_location_pointer(selectedPoint);
					//this._me._moving=true;
					_update_player_pos=(t)=>{
						if(this._me.Position.distanceTo(_look_point)<=4){
							this._gear_box.switch_gear_by_title("P");
							//_update_player_pos=()=>{};
							this.remove_function_from_update_list(_update_player_pos);
							//alert(111);
							this.add_to_timer(()=>{
								if(this._me._target_ship&&this._me._target_ship!=null&&!this._me._target_ship.Dead
								&&this._gear_box.is_parking()){
									const _t_look_pos=this._me._target_ship.Position;
									_t_look_pos.y=this._me.Position.y;
									this._me.look_at(_t_look_pos);
								}
							},2);
						}
					};
					this.add_to_update_function_list(_update_player_pos);
				}
			}
		}
      
	  };
	  
	  this._mouse_div.addEventListener('mousedown', (event)=> {_mouse_down_handle(event);});
	  this._mouse_div.addEventListener("touchstart",(event)=> {_mouse_down_handle(event);});
	  
  }
  enable_auto_attack_3d_mode(){
		this._keep_auto_attack=true;
	  
			let _auto_launch_rocket=()=>{
				if(!this._keep_auto_attack)return;
				if(this._me.Dead)return;
				let _rocket_id=this._me._rocket_package._rockets_infor[this._me._rocket_package._current_rocket_id-1].id;
				this._me._rocket_package.launch_rocket(_rocket_id);
				this.add_to_timer(()=>{_auto_launch_rocket();},_rocketDelay);
			};
			let _auto_perform_skill=()=>{
				if(!this._keep_auto_attack)return;
				if(this._me.Dead)return;
				this._me.perform_skill();
				this.add_to_timer(()=>{_auto_perform_skill();},_mainSkilDelay);
			};
			let _auto_perform_additional_skill=()=>{
				if(!this._keep_auto_attack)return;
				if(this._me.Dead)return;
				this._me.perform_additional_skill();
				this.add_to_timer(()=>{_auto_perform_additional_skill();},_secondSkillDelay);
			};
			
			this.add_to_timer(()=>{_auto_launch_rocket();},1);
			this.add_to_timer(()=>{_auto_perform_skill();},3);
			this.add_to_timer(()=>{_auto_perform_additional_skill();},5);
  }
  enable_auto_attack(){
	  return;
	  let _auto_launch_rocket=()=>{
				if(!this._me._target_ship||this._me._target_ship===null||this._me._target_ship.Dead){
					this.add_to_timer(()=>{_auto_launch_rocket();},2);
				}
				else{
					//if(this._me._rocket_package.can_launch_rocket()){
						let _rocket_id=this._me._rocket_package._rockets_infor[this._me._rocket_package._current_rocket_id-1].id;
						this._me._rocket_package.launch_rocket(_rocket_id);
					//}
					    this.add_to_timer(()=>{_auto_perform_skill();},3);
						this.add_to_timer(()=>{_auto_perform_additional_skill();},6);
						
						this.add_to_timer(()=>{_auto_launch_rocket();},7);
				}
				
			};
			let _auto_perform_skill=()=>{
				//if(!this._me._target_ship||this._me._target_ship===null||this._me._target_ship.Dead)return;
				this._me.perform_skill();
				//this.add_to_timer(()=>{_auto_perform_skill();},5);
			};
			let _auto_perform_additional_skill=()=>{
				//if(!this._me._target_ship||this._me._target_ship===null||this._me._target_ship.Dead)return;
				this._me.perform_additional_skill();
				//this.add_to_timer(()=>{_auto_perform_additional_skill();},6);
			};
			
			this.add_to_timer(()=>{_auto_launch_rocket();},5);
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
			  if(_distance<=_radius+4000){
				  try{
				  //_object.function_1(1,new THREE.Vector3(0,0,0));
					//this._baseMG.create_base_for_planet(_object);
					//this._baseMG.check_if_all_base_in_planet_defeated(_object);
				  }catch(e){alert(e.toString());}
			  }
			  if(_distance<=_radius+10){
				 
				  this._me.TakeDamage(1000);
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

    guiDiv.appendChild(scoreDiv);
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
	
        './resources/space-posx.jpg',
        './resources/space-negx.jpg',
        './resources/space-posy.jpg',
        './resources/space-negy.jpg',
        './resources/space-posz.jpg',
        './resources/space-negz.jpg',
	/*
		'https://closure.vps.wbsprt.com/files/earth/space/px.png',
    'https://closure.vps.wbsprt.com/files/earth/space/nx.png',
    'https://closure.vps.wbsprt.com/files/earth/space/py.png',
    'https://closure.vps.wbsprt.com/files/earth/space/ny.png',
    'https://closure.vps.wbsprt.com/files/earth/space/pz.png',
    'https://closure.vps.wbsprt.com/files/earth/space/nz.png',
	*/
    ]);
    this._graphics._scene.background = texture;
  }
	
  _OnStep(timeInSeconds) {
  }
  
  get_player_ship(_player_id){
	  if(_player_id===this._room.get_me().get_player_id())
		  return this._me;
	  for(let i=0;i<this._players.length;i++){
		  const _ship=this._players[i];
		  if(_ship._player_id===_player_id)
			  return _ship;
	  }
	  
	  return null;
  }
  disable_all_ship_take_damage(){
	  for(let i=0;i<this._players.length;i++){
		  const _ship=this._players[i];
		  _ship.TakeDamage=(x)=>{};//chi su dung function Take_Damage
	  }
	  this._me.TakeDamage=(x)=>{};//so hp cua player duoc cap nhat tu may' cua enemy gui len server
  }
  set_all_ship_health(_health){
	  for(let i=0;i<this._players.length;i++){
		  const _ship=this._players[i];
		  _ship._health=_health;
		  _ship._max_health=_health;
	  }
  }
  add_player_ship(_player_id,_ship_id,_team_id,_armour_id,_armour_level){
	  let _ship=this._unitMG.create_new_player_ship(_ship_id,new THREE.Vector3(0,0,0));
	  _ship._player_id=_player_id;
	  _ship._team_id=_team_id;
	  _ship._is_enemy=true;
	  _ship._rocket_package._rockets_infor=this._unitMG.get_all_rockets_infor();
	  _ship.set_init_hp(_standard_health);
	  //_ship.TakeDamage=(x)=>{};//chi su dung function Take_Damage
	  //alert(_ship._rocket_package._unit._player_id);
	  this._players.push(_ship);
	  const _p_ship_group_id=this._unitMG.get_player_ship_group_id(_ship_id);
	  _ship.set_group_id(_p_ship_group_id);
	  //_ship.EquipArmour(3,10);//<-phai equip thi moi co hieu ung' gia?m sat thuong
	  //this._entities['_radar'].addTarget(_ship);
	  if(_armour_id!=null&&_armour_level!=null){
		  _ship.EquipArmour(_armour_id,_armour_level);//alert("Good Armour");
	  }
  }
  
  start_multi_player_game(_init_data,_players_order){//Player VS Player
	  this._player_vs_computer_mode=false;
  
	  //this._me.TakeDamage=(x)=>{};//so hp cua player duoc cap nhat tu may' cua enemy gui len server
	  this.init_multi_player_game(_init_data,_players_order);
	  this.disable_all_ship_take_damage();
	  //let _my_health=parseInt(this._me._health)*_health_rate;
	  this._me.set_init_hp(_standard_health);
	 
	 
  }
  start_simulation_multi_player_game(){//Player VS Computer
	  this._player_vs_computer_mode=true;
	  
	  let _my_id=1;
	  this._room.get_me().set_player_id(_my_id);
	  this._room.get_me().is_key=()=>{return true;};
	  this._me._team_id=1;
	  
	  let _enemy_id=9999;//<=phai xem xet
	  //let _enemy_ship_id=2;
	  let _enemy_ship_id=this._utils.get_random_in_range(1,5);
	  _computer_enemy_ship_id=_enemy_ship_id;
	  
	  let _players_order=_my_id+":0-"+_enemy_id+":1";
	  let _init_data=[_my_id+"!ship_id:"+this._me._ship_id,_enemy_id+"!ship_id:"+_enemy_ship_id];
	  this._room.set_init_data("mode:3D;");
	  
	  this.init_multi_player_game(_init_data,_players_order);
	  
	  this.set_all_ship_health(_computer_health);
	  this._me.set_init_hp(_standard_health);
	  
	  let _enemy_ship=this.get_player_ship(_enemy_id);
	  _enemy_ship._target_ship=this._me;
	  _enemy_ship._target_object=this._me;
	  //return;
	  //try{
		  /*
			Hien tai thi trang bi cua computer se copy giong' het cua Player
			Vi neu khong thi phai xem loai phan` preload-model
		  */
	  let _item_id1=this._me._ship_package.get_current_auxiliary_id(1);//left wing
	  let _item_id2=this._me._ship_package.get_current_auxiliary_id(2);//right wing
	  
	  //const _auxiliary_infor=this._parameters._auxiliary_infors;
	  if(_item_id1!=null){
		  const _au_infor=this._parameters.get_auxiliary_infor(_item_id1);
		  const _au_id=_au_infor.id;
		  const _au_name=_au_infor.name;
		  const _new_obj={id:_au_id,name:_au_name,level:1,use:true};
		  _enemy_ship._ship_package.add_auxiliary_object(1,_new_obj);
		  _enemy_ship._ship_package.use_auxiliary(1,_au_id);
	  }
	  if(_item_id2!=null){
		  const _au_infor=this._parameters.get_auxiliary_infor(_item_id2);
		  const _au_id=_au_infor.id;
		  const _au_name=_au_infor.name;
		  const _new_obj={id:_au_id,name:_au_name,level:1,use:true};
		  _enemy_ship._ship_package.add_auxiliary_object(2,_new_obj);
		  _enemy_ship._ship_package.use_auxiliary(2,_au_id);
	  }
	  
	  _enemy_ship.equip_items();
	  
	  //}catch(e){alert(e.stack);}
	  //_computer_enemy_ship_id=_enemy_ship_id;
	  return;//-------------------
	  
	  let _enemy_ship_main_skill_fc;
	  let _enemy_ship_passive_skill_fc;
	  
	  //apply_rain_of_bullets_skill
	  //apply_passive_skill_circling_rocket
	  //_enemy_ship_main_skill_fc=_enemy_ship.apply_continuous_rocket_skill;
	  if(_enemy_ship_id===1)_enemy_ship_main_skill_fc=_enemy_ship.apply_flash_skill;
	  if(_enemy_ship_id===2)_enemy_ship_main_skill_fc=_enemy_ship.apply_continuous_rocket_skill;
	  if(_enemy_ship_id===3)_enemy_ship_main_skill_fc=_enemy_ship.apply_light_ball_skill;
	  if(_enemy_ship_id===4)_enemy_ship_main_skill_fc=_enemy_ship.apply_fire_breathing_skill;
	  if(_enemy_ship_id===5)_enemy_ship_main_skill_fc=_enemy_ship.apply_rain_of_bullets_skill;
	  //alert(_enemy_ship_id);
	  _enemy_ship_passive_skill_fc=_enemy_ship.apply_passive_skill_multi_rocket_1;
	  
	  
	  
	  _enemy_ship.start_run_away=true;
	  let _phase=1;
	  
	  let _run_away=(t)=>{
		  let _rand=this._utils.get_random_in_range(1,3);
		  if(_enemy_ship.start_run_away===true){
			  _enemy_ship.start_run_away=false;
			  let _target_pos;
			  let _length=this._utils.get_random_in_range(70,100);
			  if(_rand===1)_target_pos=_enemy_ship.getBackPos(_length);
			  if(_rand===2)_target_pos=_enemy_ship.getLeftPos(_length);
			  if(_rand===3)_target_pos=_enemy_ship.getRightPos(_length);
			  
			  _enemy_ship.look_at(_target_pos);
			  _enemy_ship._target_pos=_target_pos;
		  }
		  const _speed=15;
		  const _distance=_enemy_ship.Position.distanceTo(_enemy_ship._target_pos);
		  if(_distance>t*_speed){
			  _enemy_ship.move_forward(t*_speed);
		  }
		  else{
			  _enemy_ship.move_forward(_distance);
			  _enemy_ship.start_run_away=true;
			  _phase=2;//console.log("Phase2");
			  return;
		  }
	  };
	  
	  _enemy_ship.lock_rocket=false;
	  let _rocket_delay=6;
	  _enemy_ship.lock_main_skill=false;
	  let _main_skill_delay=8;
	  _enemy_ship.lock_passive_skill=false;
	  let _passive_skill_delay=10;
	  
	  let _attack=()=>{
		  if(!_enemy_ship._target_ship||_enemy_ship._target_ship===null||_enemy_ship._target_ship.Dead){
					//this.add_to_timer(()=>{_auto_launch_rocket();},2);
					return;
				}
			_enemy_ship.Fire();
		 
			if(!_enemy_ship.lock_rocket){
				let _rocket_id=this._utils.get_random_in_range(1,4);
				_enemy_ship._rocket_package.launch_rocket(_rocket_id);
				_enemy_ship.lock_rocket=true;
				this.add_to_timer(()=>{
					_enemy_ship.lock_rocket=false;
				},_rocket_delay);
			}
			if(!_enemy_ship.lock_main_skill){
				_enemy_ship.lock_main_skill=true;
				_enemy_ship_main_skill_fc(_enemy_ship,1);
				this.add_to_timer(()=>{
					_enemy_ship.lock_main_skill=false;
				},_main_skill_delay);
			}
			if(!_enemy_ship.lock_passive_skill){
				//console.log("Passive Skill!!!!!!!!!!");
				_enemy_ship.lock_passive_skill=true;
				//try{
				_enemy_ship_passive_skill_fc(_enemy_ship,1);
				//}catch(e){alert(e.stack);}
				//alert(_passive_skill_delay);
				this.add_to_timer(()=>{
					_enemy_ship.lock_passive_skill=false;
				},_passive_skill_delay);
			}
			
				
				
	  };
	  
	  let _approach_and_attack=(t)=>{
		  _enemy_ship.look_at(this._me.Position);
		  const _speed=15;
		  const _distance=_enemy_ship.Position.distanceTo(this._me.Position);
		  if(_distance>100){
			  _enemy_ship.move_forward(t*_speed);
		  }
		  else{
			  _attack();
		  }
	  };
	  
	  
	  this.add_to_update_function_list((t)=>{
		  if(_enemy_ship.Dead)return;
		  
		  //_approach_and_attack(t);
		  /*
		  if(_phase===1){
			  _run_away(t);
			  return;
		  }
		  if(_phase===2){
			  _approach_and_attack(t);
			  return;
		  }
		  */
	  });
	  
  }
  
  let_camera_follow_player_ship(){
	  this._graphics.Camera.position.copy(this._me.getBackAbovePos(170,170));
	  let _update_camera=(t)=>{
		  //try{
		  const position = new THREE.Vector3();
		  position.copy(this._me.getBackAbovePos(60,40));
	      const cam_pos=this._graphics.Camera.position;
	     
		  const _speed=40;
		  const _distance=position.distanceTo(cam_pos);
		  if(_distance>0){
			  const _length=t*_speed;
			  let _next_pos;
			  if(_distance>_length)
				_next_pos=this._utils.translatePoint(cam_pos,position,_length);
			  else
				_next_pos=this._utils.translatePoint(cam_pos,position,_distance);
			  //console.log(_next_pos.x+" and "+_next_pos.z);
			  this._graphics.Camera.position.copy(_next_pos);
		  }
		  
	      this._graphics.Camera.lookAt(this._me.Position);
		  //}catch(e){alert(e.stack);}
	  };
	  
	  this.add_to_update_function_list(_update_camera);
  }
  
  init_multi_player_game(_init_data,_players_order){
	  let _panel_w=500;
	  let _panel_h=500;
	  let _vs_img=this._image_preloader.getImage('vs-icon');
	  let _user_img=this._image_preloader.getImage('user');
	  let _container = document.createElement( 'div' );
	  let _rand_player_name=this._computer_player_mg.get_random_player_name();
	  this._computer_player_name_1=_rand_player_name;
	  _container.innerHTML = `
			<img src='${_vs_img.src}' style='position:absolute;top:0px;left:0px;width:450px;height:450px'/>
			
			<img src='${_user_img.src}' style='position:absolute;top:270px;left:40px;width:60px;height:60px'/>
			<b style='position:absolute;top:340px;left:0px;font-family: "Orbitron", sans-serif;'>`+_saved_username+`</b>
			
			<img src='${_user_img.src}' style='position:absolute;top:270px;left:370px;width:60px;height:60px'/>
			<b style='position:absolute;top:340px;left:320px;font-family: "Orbitron", sans-serif;'>`+this._computer_player_name_1+`</b>
	  `;
	  
	  
	  _container.style.fontSize="20px";
	  _container.style.color="white";
	  _container.style.textShadow="2px 2px black";
	  _container.style.position="absolute";
	  _container.style.width="500px";
	  _container.style.height="500px";
	  _container.style.top="-10px";
	  _container.style.left="540px";
	  
	  let _enemy_ship_id=null;
	  let _enemy_id=null;
	  for(let i=0;i<_init_data.length;i++){
		const _element=_init_data[i].split("!");
		const _p_id=parseInt(_element[0]);
		const _p_ship_id=parseInt(_element[1].split(":")[1]);
		let _armour_id=null;
		let _armour_level=null;
		if(_element[2]){
			const _armour_infor=_element[2].split(":");
			_armour_id=parseInt(_armour_infor[1]);
			_armour_level=parseInt(_armour_infor[2]);
		}
		
		//this.add_player_ship(_p_id,_p_ship_id,null);		
		if(_p_id!=this._room.get_me().get_player_id()){
			//alert("PlayerID:"+_p_id);
			//alert("SHIPID:"+_p_ship_id);
			this.add_player_ship(_p_id,_p_ship_id,null,_armour_id,_armour_level);
		}
	}
	   this._client=this._room.get_me();
	this._client.set_entity(this._me);
	try{
	
	// alert(this._room.get_init_data());
	let _room_data=this._room.get_init_data().split(";");
	let _mode=_room_data[0].split(":")[1];
	if(_mode.trim()==='2D')
		this._2D_mode=true;
	else
		this._2D_mode=false;
	
	if(this._2D_mode===true){
		this.init_2D_mode();
		this.init_player_ship_position(_players_order);
		this.add_to_update_function_list((t)=>{//dam bao rang player-ship ko di chuyen len xuong'
			const _look_pos=this._me.getFrontPos(100);
			_look_pos.y=_common_y_pos;
			this._me.look_at(_look_pos);
		});
	}	
	else{
		this.init_player_ship_position(_players_order);
		this.init_3D_mode();
		
	}
	
	if(this._2D_mode===true){
		this.let_camera_follow_player_ship();
		
		this.create_map_bound();
		
	}
		
	
	  }catch(e){alert(e.stack);}
	  this._root_div.appendChild(_container);
	  this.add_to_timer(()=>{
		  _container.remove();
		 
	  },5);
	  
	  //alert(_players_order);//5:0-6:1-7:2
	  //alert(_init_data);//2!ship_id:3,3!ship_id:4
	  //_init_data2+="!armour:"+_armour_id+":"+_armour_level;
	  
	  
  }
  
  
   create_map_bound(){
	  const geometry = new THREE.RingGeometry( _mapRadius, _mapRadius+2, 32 ); 
	  const material = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide,transparent:true,opacity:0.4} );
	  //const material=this._graphics.createGradientMaterial_1("white","yellow");
	  const mesh = new THREE.Mesh( geometry, material ); 
      mesh.rotation.x=Math.PI/2;
	   this._graphics.Scene.add(mesh);
	   //mesh.position.set(_mapCenterX,_common_y_pos,_mapCenterZ);
	   mesh.position.copy(_centerPosition);
	   
	   this._every_second_passes_fcs.push(()=>{
		   const _distance=this._me.Position.distanceTo(_centerPosition);
		   if(_distance>_mapRadius){
			   this._me.SelfDestroy();
			   
		   }
	   });
	   
	   //try{
	this._map_data=new MapMG({game:this});
	this._map_data._load_complete_fc=()=>{
		//try{
			/*
		let gltf1=this._map_data._data_list["model-1"];
		const model1 = gltf1.scene.children[0];
			  model1.scale.setScalar(100);
			  //model.rotation.z=Math.PI;
		this._graphics.Scene.add(model1);
		model1.position.copy(_centerPosition);
		model1.position.y-=400;
		model1.position.x-=400;
		*/
		
		let gltf2=this._map_data._data_list["model-2"];
		const model2 = gltf2.scene.children[0];
			  model2.scale.setScalar(0.3);
			  //model.rotation.z=Math.PI;
		this._graphics.Scene.add(model2);
		model2.position.copy(_centerPosition);
		model2.position.y-=200;
		model2.position.x+=1000;
		
		
		let gltf3=this._map_data._data_list["model-3"];//hanh tinh mau xanh
		const model3 = gltf3.scene.children[0];
			  model3.scale.setScalar(3);
			  //model.rotation.z=Math.PI;
		this._graphics.Scene.add(model3);
		model3.position.copy(_centerPosition);
		model3.position.x+=200;
		model3.position.y-=800;
		model3.position.z+=3000;
		
		
		let gltf4=this._map_data._data_list["model-4"];
		const model4 = gltf4.scene.children[0];
			  model4.scale.setScalar(13);
			  //model.rotation.z=Math.PI;
		this._graphics.Scene.add(model4);
		model4.position.copy(_centerPosition);
		model4.position.y-=200;
		model4.position.z-=4000;
		
		/*
		let gltf5=this._map_data._data_list["model-5"];//
		const model5 = gltf5.scene.children[0];
			  model5.scale.setScalar(200);
			  //model.rotation.z=Math.PI;
		this._graphics.Scene.add(model5);
		model5.position.copy(_centerPosition);
		model5.position.y-=200;
		model5.position.z-=2000;
		*/
		
		let gltf6=this._map_data._data_list["model-6"];//ring planet
		const model6 = gltf6.scene.children[0];
			  model6.scale.setScalar(100);
			  //model.rotation.z=Math.PI;
		this._graphics.Scene.add(model6);
		model6.position.copy(_centerPosition);
		model6.position.y-=1200;
		model6.position.x-=2000;
		
		/*
		let gltf7=this._map_data._data_list["model-7"];//moon with ring
		const model7 = gltf7.scene.children[0];
			  model7.scale.setScalar(0.5);
			  //model.rotation.z=Math.PI;
		this._graphics.Scene.add(model7);
		model7.position.copy(_centerPosition);
		model7.position.y-=200;
		//model7.position.z+=2000;
		*/
		
		let gltf_nebula=this._map_data._data_list["skydome"];
		const nebula = gltf_nebula.scene.children[0];
			  nebula.scale.setScalar(3000);
			  //model.rotation.z=Math.PI;
		this._graphics.Scene.add(nebula);
		nebula.position.copy(_centerPosition);
		//nebula.position.y-=1200;
		
		//}catch(e){alert(e.stack);}
	};
	this._map_data.load_data();
	//}catch(e){alert(e.stack);}

   }
  
  
}

class MapMG{
	constructor(params){
		this._params=params;
		this._game=params.game;
		this._data_list={};
		
		this._load_complete_fc=()=>{};
	}
	
	load_data(){
		
		let _url_list=[
					   
					   //["model-1","./resources/models/Planets/dathomir/scene.gltf"],
					   ["model-2","./resources/models/Planets/gardanah_fictional/scene.gltf"],
					    ["model-3","./resources/models/Planets/imaginary_planet_1/scene.gltf"],
						["model-4","./resources/models/Planets/paradise_planet/scene.gltf"],
						//["model-5","./resources/models/Planets/planet/scene.gltf"],
						["model-6","./resources/models/Planets/ringed_gas_giant_planet/scene.gltf"],
						//["model-7","./resources/models/Planets/rocket_orbiting_moon/scene.gltf"],
					  
					  
					    ["skydome","./resources/models/Planets/starry_galaxy_sky_hdri_background_photosphere/scene.gltf"],
					];
					
			let _counter=0;
	
		let _loader;
		for(let i=0;i<_url_list.length;i++){
			let _id=_url_list[i][0];
			let _url=_url_list[i][1];
			_loader= new GLTFLoader();
			_loader.load(_url,( gltf )=> {
				this._data_list[_id]=gltf;
				_counter++;
				if(_counter===_url_list.length){//load complete
					
						this._load_complete_fc();
				}
			});
		}
		
	}
}


//--------------------------------------------------

class HpBars{
	constructor(params){
		this._params=params;
		this._game=params.game;
	}
	
	init(_name1,_name2){
		let _css=`
		.health_container {
  --health-flip: var(--true);
  
  --player-1: "`+_name1+`";
  --player-2: "`+_name2+`";
  /* If EQCSS is removed or Javascript is disabled, you can play with these */
  --player-1-health: 100%;
  --player-2-health: 100%;
}
.health_meter {
  /* 
    Health damage color stops
    * perfect ←– • –→ KO
  */
  --health-bg:
      #0c0, #00c, #0cc, #cc0, #c00, #000;
  --health-bg-accent:
      #0c0, #00c, #cc0, #c00, #000;
  /* Other meters */
  --meter-bg:
      #0036;
  --damage-bg:
      #600;
  /* Timing */
  --health-duration: .25s;
  --damage-duration: .5s;
  --damage-delay: .5s;
}
		
		.hud {
  box-sizing: border-box;
  
  padding: 16px;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 100%;
  max-width: 960px;
  overflow: hidden;
}

/* This was a last minute addition designed to help with flipping health meters horizontally */
.health_container {
  display: inline-block;
  width: 40%;
}
.health_container#player-1 {
  --true: scaleX(-1);
  transform: var(--health-flip, scaleX(1)) skew(10deg);
  float: left;
}
.health_container#player-2 {
  --true: scaleX(1);
  float: right;
  transform: var(--health-flip, scaleX(-1)) skew(10deg);
}
/* Player names */
.health_container:after {
  --true: scaleX(-1);
  background: linear-gradient(to right, #0006, transparent);
  color: white;
  content: var(--player-1);
  display: block;
  font-size: 80%;
  margin: -4px;
  margin-top: 6px;
  padding: 4px 8px;
  text-align: left;
  transform: var(--health-flip, scaleX(1));
}
.health_container#player-2:after {
  --true: scaleX(1);
  background: linear-gradient(to left, #0006, transparent);
  content: var(--player-2);
  transform: var(--health-flip, scaleX(-1));
  text-align: right;
}
.health_container#player-1 { --health: var(--player-1-health); }
.health_container#player-2 { --health: var(--player-2-health); }

/* This contains the health and damage bars. Also contains the translucent background color of the container. */
.health_meter {
  background: var(--meter-bg, #3009);
  box-shadow: 0 0 0 1px #0009;
  width: 100%;
  height: 16px;
  position: relative;
}
/* General styling for background and foreground of the health bars */
.health_meter:before, .health_meter:after {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  content: "";
}
/* Border around the bars */
.health_meter:before {
  z-index: -1;
  margin: -4px;
  
  background: linear-gradient(to bottom, #fff 0%, #999 50%, #666 50%, #999);
  border: 1px solid #222;
  box-shadow: inset 0 0 1px #fff;
  clip-path: polygon(0% 0%, 0% 100%, 4px 100%, 4px 4px, calc(100% - 4px) 4px, calc(100% - 4px) calc(100% - 4px), 4px calc(100% - 4px), 4px 100%, 100% 100%, 100% 0%);
}
/* This provides lines and overlaid gradients over the bars */
.health_meter:after {
  background:
    repeating-conic-gradient(from -35deg, transparent 0% 7.5%, #fff3 10% 10%, transparent 12.5% 57.5%, #fff3 60% 60%, transparent 62.5% 100%),
    linear-gradient(to bottom, #fff9, transparent, #fff3);
  background-position: 50% 0, top left;
  background-size:
    10%,
    contain;
}
/* This provides general styling for both the actual health bar as well as the damage bar */
.health_damage, .health {
  box-shadow: inset -1px 0 0 #fff3, 1px 0 0 #0009;
  width: var(--health, 100%);
  height: 100%;
  position: relative;
  transition: all var(--health-duration, .2s);
}
/* The "health" bar */
.health {
  background-image: linear-gradient(to left, var(--health-bg, #099, #090, #990, #900));
  background-size: 1000% 100%;
  background-position: var(--health) 100%;
  background-repeat: repeat-x;
}
.health:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  background-image: linear-gradient(to left, var(--health-bg-accent, var(--health-bg, #099, #090, #990, #900)));
  mask-image: linear-gradient(to left, transparent, #000);
}
/* The "health damage" bar  */
.health_damage {
  background: var(--damage-bg, #900);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition-delay: var(--damage-delay, 1s);
  transition-duration: var(--damage-duration, var(--health-duration));
}

/* Health Range Input */
@element .health_container {
  :self#player-1 {
    --player-1-health: calc((100 / eval("$it.querySelector('.health_value').max")) * eval("$it.querySelector('.health_value').value") * 1%);
  }
  :self#player-2 {
    --player-2-health: calc((100 / eval("$it.querySelector('.health_value').max")) * eval("$it.querySelector('.health_value').value") * 1%);
  }
}
.health_value {
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  padding: 0;
  opacity: 0;
  z-index: 1;
  transition: all .25s;
}
.health_meter:hover .health_value,
.health_meter .health_value:focus {
  opacity: 0;
}
		`;
		
		let _hud=document.createElement("div");
		    _hud.class="hud";
			_hud.innerHTML=`
				<div class="health_container" id="player-1">
    <div class="health_meter">
      <div class="health_damage"></div>
      <div class="health"></div>
      <input class="health_value" type="range" min="0" max="1000" value="1000" step="1" title=""/>
    </div>
  </div>
  <div class="health_container" id="player-2">
    <div class="health_meter">
      <div class="health_damage"></div>
      <div class="health"></div>
      <input class="health_value" type="range" min="0" max="1000" value="1000" step="1"/>
    </div>
  </div>
			`;
		const style = document.createElement("style");
		style.innerHTML =_css;
		document.head.appendChild(style);
		
		_hud.style.position="absolute";
		_hud.style.top="50px";
		_hud.style.width="70%";
		_hud.style.left="15%";
		this._game._root_div.appendChild(_hud);
		
		//this.setPlayerHP(1,70);
		//this.setPlayerHP(2,25);
		
	}
	
	setPlayerHP(id,_percent) {
		if(id===1){
			const player1 = document.getElementById("player-1");
			player1.style.setProperty("--player-1-health", _percent+"%");
		}
		if(id===2){
			const player2 = document.getElementById("player-2");
			player2.style.setProperty("--player-2-health", _percent+"%");
		}
		
	}
	
	changePlayerHP(id,_current_hp,_max_hp){
		//alert(id+" and "+_current_hp+" and "+_max_hp);
		let _percent=Math.floor((_current_hp/_max_hp)*100);
		this.setPlayerHP(id,_percent);
	}
}


//-----------------------------------------------------

function _Main() {
	
  _APP = new ProceduralTerrain_Demo();
  
}

_Main();


