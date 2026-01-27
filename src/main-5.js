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

//import {GameMap} from './game-map.js';
import {SpaceGameMap} from './space-game-map.js';


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


//_standard_size

let _universe=null;
let _lock_timer=true;
let _time_container=document.getElementById("time-container");
let _last_second=null;
let _second_counter=0;
let _minute_counter=0;
let _mission_time=4;//minute - thoi gian hoan thanh mission
let _remain_time=_mission_time*60;
let _px,_py,_pz;
//let _my_status_list=new Array();//gui trang thai cua minh len server de server gui cho enemy player
let _enemy_status_list_1=new Array();//cua player enemy

let _background_model_pos=new THREE.Vector3(99999,0,0);
let _player_init_pos=new THREE.Vector3(99999,1200,400);

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

let kill_num=0;

let _item_name="defense-mode-level";
let _game_level;
let _game_type=1;

const _exp_rate=0.3;//o che do nay exp nhan duoc se it hon

class ProceduralTerrain_Demo extends SpaceShipGame {
  constructor() {
    super({game_id:1,
	load_unit_model_complete:()=>{
		this.create_menu_btton();
		this._graphics.init_lasers();
		//this._graphics.center_div.remove();
		this._unitMG.create_player_entity();
		this._me._model.scale.multiplyScalar(0.7);
		//this._entities['player']._lock_speed_up_skill=true;
		
		this._me.hide_skill_panel();
		//this._me.hide_hp_bar();
		this._me.hide_mana_bar();
		
		this._navigator_bar_2._lock_reset_rotation=true;
		this._navigator_bar_2._lock_turn_back_skill=true;
		this._entities['player']._lock_speed_up_skill=true;
		this._gear_box.hide_panel();
		this._navigator_bar_1.lock_mouse_event();
		this._navigator_bar_2.lock_mouse_event();
		//this._graphics.init_lasers();
		//this._entities["_controls2"]._lock_enter_key=true;
			this._gear_box.switch_gear_by_title("P");
			this._gear_box.switch_gear_by_title("G");
			this._gear_box.switch_gear_by_title(1);
			//this._gear_box.switch_gear_by_title(2);
			
		//this._navigator_bar_1.hide();
		//this._navigator_bar_2.hide();
		//this._me.remove_skill_panel();
		
		//this._entities['_controls2'].UpdateCamera=this._entities['_controls2'].UpdateCamera_3;
		this._entities['_controls2']._lock_move_updown=true;
		this._entities['_controls2']._lock_roll=true;
		//this.add_radar();
		this.rocket_multiplier=5;
		//this._parameters._standard_rocket_speed=25;
		
		//const _renderer_div=document.getElementById("CSS2DRenderer")
		//const _labelRenderer=this._graphics.enable_CSS2D_Renderer(_renderer_div);
		
		this._data_list={};
		//this.load_model();
		
		//try{
		this.createOptionBox("Game Option","",[
			{text:"Classic",fc:()=>{
				_game_type=1;
				//this.create_rocket_panel(()=>{this.create_sub_rocket_panel(this.init_mission)});
				//this.init_mission();
				this.create_sub_skills_list(()=>{
					this.create_sub_rocket_panel(()=>{this.init_mission();});
				});
				this.enable_mouse_controlled_mode(()=>{
					this._gear_box.switch_gear_by_title("P");
					this._gear_box.switch_gear_by_title("G");
					this._gear_box.switch_gear_by_title(1);
				});
				this.add_to_timer(()=>{	
				let _map=new SpaceGameMap({game:this});
				_map._map_data.load_data();
				_map._map_data._load_complete_fc=()=>{
					//_map.init_group_5();
					//_map.init_stars();
				};
				this._spaceMap=_map;
				},2);
			}},
			{text:"Random",fc:()=>{
				_game_type=2;
				//this.init_mission();
				//this.create_rocket_panel(()=>{this.create_sub_rocket_panel(this.init_mission)});
				this.create_sub_skills_list(()=>{
					this.create_sub_rocket_panel(()=>{this.init_mission();});
				});
				this.enable_mouse_controlled_mode(()=>{
					this._gear_box.switch_gear_by_title("P");
					this._gear_box.switch_gear_by_title("G");
					this._gear_box.switch_gear_by_title(1);
					//this._gear_box.switch_gear_by_title(2);
				});
				this.add_to_timer(()=>{	
				let _map=new SpaceGameMap({game:this});
				_map._map_data.load_data();
				_map._map_data._load_complete_fc=()=>{
					//_map.init_group_5();
					//_map.init_stars();
				};
				this._spaceMap=_map;
				},2);
			}}
		]);
		//}catch(e){alert(e.stack);}
		
		
		
	}});
	
	document.getElementById("volume-ltr").addEventListener("change",()=>{
		const _value=parseInt(document.getElementById("volume-ltr").value);
		
		this._entities["_controls2"].changeCameraAltitude(_value*10);
		
	});
  }
  
  init_auto_mode(){
	  this._entities['_controls2']._move.fire=true;
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
			//this.add_to_timer(()=>{_auto_perform_skill();},6);
			//this.add_to_timer(()=>{_auto_perform_additional_skill();},7);
			
			//this._me.enable_passive_skill();
  }
  
  load_model(){
	  this._url_list=[
			//["terrain-1","./resources/models/City/sandbox_city_shanghai_lowpoly/scene.gltf"],//scale 5000
			//["terrain-1","./resources/models/City/cartoon_low_poly_city_mini_pack/scene.gltf"],//scale 100
			//["terrain-1","./resources/models/City/cyberpunk_city/scene.gltf"],//scale 500
			//["terrain-1","./resources/models/City/free_sci-fi_city/scene.gltf"],//scale 150, y-2500
			//["terrain-1","./resources/models/City/space_city/scene.gltf"],//scale 450,y+500
			//["terrain-1","./resources/models/City/future_city_1/scene.gltf"],//scl 100,y-1000,x-20000
			["terrain-1","./resources/models/City/san_francisco_city/scene.gltf"],
		];
		
		let _url_list=this._url_list;
		
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
					
					this.init_model();
					
				}
			});
		}
  }
  
  init_model(){
	    this._root=new THREE.Object3D();
		this._graphics.Scene.add(this._root);
		this._root.position.copy(_background_model_pos);
		let gltf=this._data_list["terrain-1"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(4);
		//model.rotation.y=Math.PI;
		//model.rotation.z=Math.PI;
		//model.position.x-=20000;
		model.position.y-=500;
		
		this._root.add(model);
		
		//return;
			const near = 3600;
			const far = 8500;
			const color = 'pink';
			this._graphics.Scene.background = new THREE.Color( color );
			this._graphics.Scene.fog = new THREE.Fog(color, near, far);
  }
  
  init_plane_and_mouse_event(){
	  const geometry = new THREE.PlaneGeometry( 90000, 90000 );
	  const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide,
		transparent:true,opacity:0.01} );
	  const plane = new THREE.Mesh( geometry, material );
	  this._graphics.Scene.add( plane );
	  plane.position.copy(_background_model_pos);
	  plane.position.y+=1000;
	  plane.rotation.x=Math.PI/2;
	  plane._is_main_plane=true;
	  let _y_length=this._me.Position.y-plane.position.y;
	  //plane.lookAt(this._graphics.Camera.position);
	  
	  this._mouse_div=document.getElementById("mouse-handle-div");
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
			  if(this._me._target_ship&&this._me._target_ship!=null&&!this._me._target_ship.Dead){
				  const _t_look_pos=this._me._target_ship.Position;
					    _t_look_pos.y=this._me.Position.y;
				  this._me.look_at(_t_look_pos);
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
				
				let _t_point1=this._utils.findPointOnLine(this._me.Position,_look_point,this._me.Position.distanceTo(_look_point)*2);
				_look_point.copy(_t_point1);//do sai số do khoảng cách giữa plane và me.position.y
				
				this._me.look_at(_look_point);
				
				//const geometry = new THREE.SphereGeometry( 0.5, 16, 16 ); 
				//const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
				//_mark_point = new THREE.Mesh( geometry, material ); 
				//this._graphics.Scene.add( _mark_point );
				//_mark_point.position.copy(_look_point);
			}
		if (event.button === 0){//left click
			this.remove_function_from_update_list(_update_player_pos);
			this._gear_box.switch_gear_by_title("P");
		}
		else{//right click
			if(_object!=null){
				if(_object._is_main_plane===true){
					
					this._gear_box.switch_gear_by_title("P");
					this._gear_box.switch_gear_by_title("G");
					this._gear_box.switch_gear_by_title(1);
					//this.add_location_pointer(selectedPoint);
					_update_player_pos=(t)=>{
						if(this._me.Position.distanceTo(_look_point)<=4){
							this._gear_box.switch_gear_by_title("P");
							//_update_player_pos=()=>{};
							this.remove_function_from_update_list(_update_player_pos);
							//alert(111);
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
  
  add_location_pointer(selectedPoint){
	  this._2D_screen_icon_1=document.createElement("img");
	  this._2D_screen_icon_1.style.position="absolute";
	  this._2D_screen_icon_1.style.width="35px";
	  this._2D_screen_icon_1.style.height="35px";
	  this._2D_screen_icon_1.style.transform="rotate(90deg)";
						
	  this._2D_screen_icon_1.src="./resources/gif/arrow-2.gif";
						
	  let vector = new THREE.Vector3();
	  let x,y;
	  let screen_w=window.innerWidth,
	  screen_h=window.innerHeight;
	  let _t_point=selectedPoint.clone();
						
	  _t_point.project(this._graphics.Camera);
	  vector.copy(_t_point);
	  x = (vector.x + 1) / 2 * window.innerWidth;
	  y = (1 - vector.y) / 2 * window.innerHeight;
	  //x-=100;
	  //y+=5;
	  this._2D_screen_icon_1.style.left=x+"px";
	  this._2D_screen_icon_1.style.top=y+"px";
	  document.body.appendChild(this._2D_screen_icon_1);
  }
  
  init_mission(){
	 
	 let _loading_icon=this._graphics.createLoadingIcon(1);
	 this._root_div.appendChild(_loading_icon);
	 
	  this._unitMG.after_create_enemy_combat_unit_fc_2=function(_eunit){//hinh nhu ko co' function nay se ko create enemy-ship dc		
	  }
	  this._me.jumpTo(_player_init_pos);
	  this.add_to_update_function_list((t)=>{
		  if(!this._me.Dead){
			  this._me._model.quaternion.x=0;//de cho player-ship ko bi lech
			  this._me._model.quaternion.z=0;
		  }
	  });
	  
	  //this.init_plane_and_mouse_event();<===========ko dc xoa
	  //this.init_auto_mode();<===========ko dc xoa
	 
	  _game_level=this.get_data_in_database(_item_name);
	  if(_game_level===null)_game_level=1;
	  else _game_level=parseInt(_game_level)+1;
	  
	  if(localStorage.getItem('demo-game-level')!=null&&localStorage.getItem('demo-game-level')!="null"){
			_game_level=parseInt(localStorage.getItem('demo-game-level'));
		}
	  
	  
	  
	  let _wave_counter=-1;
	  let _sub_wave_counter=-1;
	  //let _full_types=["rocket1","icy1","missile1","energy1","photon2","fire1","photon2","laser1",/*"suicide1",*/"photon1"];
	  let _full_types=["rocket1","icy1","missile1",/*"energy1",*/"photon2","fire1","photon2","laser1","suicide1"];
	  
	  let _change_num=Math.floor(_game_level/6);//sau khi vuot qua so' game level, unit dau tien xuat hien se next
	  let _first_id=_change_num%_full_types.length;//alert(_first_id);
	  let _new_types=new Array();
	  for(let i=_first_id;i<_full_types.length;i++)
		  _new_types.push(_full_types[i]);
	  for(let i=0;i<_first_id;i++)
		  _new_types.push(_full_types[i]);
	  _full_types=_new_types;
	  //alert(_full_types);
	  let _enemy_level_rate=3;//tang suc' manh cho enemy-ships
	  let _min_enemy_ship_type=1;//số lượng loại enemy-ship xuất hiện tại level 1
	  let _min_wave=9999;//so luong wave tai level 1
	  let _min_ship_num_in_wave=16;//so luong enemy-ship trong wave dau tien tai level 1
	  let _increase_ship_num_next_wave=1;//so luong enemy-ship tang len sau moi 1 wave
	  let _increase_ship_num_level_require=5;//so level vuot qua duoc se tang so luong ship sau moi wave(VD:wave 1 co 1 ship thi wave 2 co 1+n*1 ship)
	  let _increase_type_level_require=2;//so level sau khi vuot qua se tang so luong enemy-ship type len 1
	  let _increase_num_level_require=3;//so level sau khi vuot qua se tang so luong enemy-ship trong 1 wave(tang len 1)
	  let _increase_wave_num_level_require=15;//so level sau khi vuot qua se tang so luong wave len 1
			
		 
		  _increase_ship_num_level_require+=Math.floor(_game_level/10);//cu 10 level thi tang them 1
		  _increase_num_level_require+=Math.floor(_game_level/10);//cu 10 level thi tang them 1
		  _increase_wave_num_level_require+=Math.floor(_game_level/10);//cu 10 level thi tang them 1
		  _increase_type_level_require+=Math.floor(_game_level/10);//cu 10 level thi tang them 1
	  
	  let _waves=new Array();
	  
	  let _wave_num=_min_wave;
	  if(_game_level>_increase_wave_num_level_require)_wave_num+=_increase_wave_num_level_require;
	  
	  let _type_num=_min_enemy_ship_type+Math.floor(_game_level/_increase_type_level_require);
		  if(_type_num>_full_types.length)_type_num=_full_types.length;
		  let _types=new Array();
	      for(let i=0;i<_type_num&&i<_full_types.length;i++)_types.push(_full_types[i]);
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
			
		  }
		  let _t_num=Math.ceil(_t_ship_num/_t_types.length);//số lượng ship trong mỗi type, tính theo cách này có thể làm số ship cao hơn mặc định
		  let _t_wave=new Array();
		  for(let j=0;j<_t_types.length;j++){
			  let _t_type=_t_types[j];
			  _t_wave.push({name:_t_type,count:_t_num});
		  }
		  _waves.push(_t_wave);
		  _w_counter++;
	  }
	  
	  
	  /*
	  _waves=new Array();
	  for(let i=0;i<1;i++){
		  //_waves.push([{name:"ambulance1",count:1},{name:"icy1",count:3}]);
		  //_waves.push([{name:"suicide1",count:25}]);
		  _waves.push([{name:"icy1",count:9}]);
		  //_waves.push([{name:"rocket1",count:21},{name:"suicide1",count:25}]);
	  }
	  */
	  let _enemy_level=_game_level;
	  if(_game_type===2){
		  _enemy_level=this._me._ship_package.get_ship_level();
		  _waves=new Array();
		  const _type_num=4;
		  const _num_in_type=4;
		  for(let i=0;i<100;i++){
			const _types=this._utils.get_random_elements_from_array(_full_types,_type_num);
			const _t_wave=new Array();
			for(let j=0;j<_type_num;j++){
			  _t_wave.push({name:_types[j],count:_num_in_type});
			}
		    _waves.push(_t_wave);
		   }
	  }
	  
	  
	  
	  
	  let _counter1=1;
	  let _length1=1000;
	  let _get_pos_fc=()=>{
		  let _rs=null;
		  if(_counter1===1)_rs= this._me.getFrontPos(_length1);
		  if(_counter1===2)_rs= this._me.getBackPos(_length1);
		  if(_counter1===3)_rs= this._me.getLeftPos(_length1);
		  if(_counter1===4)_rs= this._me.getRightPos(_length1);
		  if(_counter1===5)_rs= this._me.getFrontLeftPos(_length1,_length1);
		  if(_counter1===6)_rs= this._me.getFrontRightPos(_length1,_length1);
		  
		  _counter1++;
		  if(_counter1>6){
			  _counter1=1;
			  _length1+=100;
		  }
		  return _rs;
	  };
	  let _counter2=1;
	  let _length2=600;
	  let _get_pos_fc2=()=>{
		  let _rs=this._me.Position.clone();
		  if(_counter2===1){
			  _rs.x+=_length2;
			  _rs.z+=10;
		  }
		  if(_counter2===2){
			  _rs.x-=_length2;
			  _rs.z-=10;
		  }
		  if(_counter2===3){
			  _rs.z+=_length2;
			  _rs.x+=10;
		  }
		  if(_counter2===4){
			  _rs.z-=_length2;
			  _rs.x-=10;
		  }
		  _counter2++;
		  if(_counter2>4){
			  _counter2=1;
			  _length2+=10;
		  }
		  return _rs;
	  }
	  
	  
	  let _points3=null;
	  let _counter3=0;
	  let _get_pos_fc3=(_point_num)=>{//tao thanh mot vong tron
		  const _player_pos=this._me.Position;
		  if(_points3===null){
			  const _axis=this._utils.axisY;
			  const _t_pos=_player_pos.clone();
			  const _radius=600;
			  _t_pos.z+=_radius;
			  //const _point_num=25;
			  const _angle=(Math.PI*2)/_point_num;
			  let _t_obj=new THREE.Object3D();
			  _t_obj.position.copy(_t_pos);
			  this._graphics.Scene.add(_t_obj);
			  _points3=new Array();
			  for(let i=0;i<_point_num;i++){
				  this._utils.rotateObjectAroundPoint(_t_obj, _player_pos, _axis, _angle);
				  const _new_pos=new THREE.Vector3();
				  _t_obj.getWorldPosition(_new_pos);
				  _points3.push(_new_pos);
			  }
			  
		  }
		  
		  let _rs=_points3[_counter3];
		  //console.log(_rs.x+","+_rs.y+","+_rs.z);
		  _counter3++;
		  if(_counter3>=_points3.length){
			  _counter3=0;
			  _points3=null;
		  }
		  return _rs;
	  };
	  
	  let _points4=null;
	  let _counter4=0;
	  let _get_pos_fc4=(_point_num,_direction)=>{//dàn hàng ngang
			const _player_pos=this._me.Position;
			if(_points4===null){
				const _tpos=_player_pos.clone();
				if(_direction===1){
					const _p1=this._me.getFrontLeftPos(780,780);
					const _p2=this._me.getFrontRightPos(780,780);
					_points4=this._utils.getEquidistantPoints(_p1,_p2,_point_num);
					//alert(_points4.length);
					for(let i=0;i<_points4.length;i++){
						const _tpoint=_points4[i];
						//alert("["+_tpoint.x+","+_tpoint.y+","+_tpoint.z+"]");
					}
				}
			}
			
		  let _rs=_points4[_counter4];
		  _counter4++;
		  if(_counter4>=_points4.length){
			  _counter4=0;
			  _points4=null;
		  }
		  return _rs;
	  };
	  
	  let _create_waves_fc=()=>{
		  let _all_enemy_ships=new Array();//luu toan bo enemyship ke ca unit da chet'
	  let _rand_enemy_ships=new Array();
	  let _create_wave=()=>{
		 
		  _wave_counter++;
		  let _element=_waves[_wave_counter];
		  for(let j=0;j<_element.length;j++){
				_sub_wave_counter++;
				let _item=_element[j];
				let _name=_item.name;
				let _ship_count_1=_item.count;
		  
				let _rand_pos=new Array();
				let _distance_to_player=200;
				//alert("Total:"+_ship_count_1);
				for(let i=0;i<_ship_count_1;i++){//cac ship xuat hien ngau nhien
					let _enemy_ship;//alert(i);
					
					let _new_pos=this._me.getFrontPos(i*150);
					
					if(_name==="laser1"){
						
						
						_enemy_ship=this._unitMG.createSimpleLaserShip(_get_pos_fc4(_ship_count_1,1));
						
						//_enemy_ship._health=10000;
						_enemy_ship.CheckTarget=(timeInSeconds)=>{
							this.update_enemy_ship_1(_enemy_ship,timeInSeconds);
							/*
							this.update_enemy_ship_2(_enemy_ship,this._me,8,150,()=>{
								_enemy_ship.look_at(this._me.Position);
								_enemy_ship.Fire();
							},timeInSeconds)
							*/
						};
						
						//_enemy_ship.start_hunting_behavior_1();
						
					}
					if(_name==='photon1'){
						_enemy_ship=this._unitMG.createSimplePhotonShip(_get_pos_fc());//function trong space-ship-game.js
						/*
						_enemy_ship._model.scale.multiplyScalar(0.08);
						_enemy_ship._bound_radius=3.2;
						_enemy_ship.CheckTarget=(timeInSeconds)=>{
							this.update_enemy_ship_1(_enemy_ship,timeInSeconds);
						};
						*/
					} 
					if(_name==="suicide1"){
					if(_sub_wave_counter%2===0)
						_enemy_ship=this._unitMG.createSimpleSuicideShip(_get_pos_fc2());
					else
						_enemy_ship=this._unitMG.createSimpleSuicideShip(_get_pos_fc3(_ship_count_1));
					_enemy_ship._model.scale.multiplyScalar(0.5);
					_enemy_ship._bound_radius*=100.1;
					//_enemy_ship._speed=1;
					_enemy_ship._health=this._parameters._standard_hp*0.25;
					//_enemy_ship._health=100;
					let _ship_speed;
					_enemy_ship.CheckTarget=(timeInSeconds)=>{
						const _distance=_enemy_ship.Position.distanceTo(this._me.Position);
						if(_ship_speed>500)_ship_speed=100;
						else if(_ship_speed>400)_ship_speed=70;
						else if(_ship_speed>300)_ship_speed=15;
						else if(_ship_speed>200)_ship_speed=10;
						else _ship_speed=9;
						this.update_enemy_ship_2(_enemy_ship,this._me,_ship_speed,3,()=>{
							this._me.TakeDamage(_enemy_ship._damage);
							_enemy_ship.Explode();
							_enemy_ship.SelfDestroy();
						},timeInSeconds);
					};
				
					};
					if(_name==="counter-attack1"){
						_enemy_ship=this._unitMG.createSimpleCounterAttackShip(_get_pos_fc());
						_enemy_ship._target_object=this._me;
						_enemy_ship._lock_fire=false;
						_enemy_ship._rocket_speed=50;
						/*
						_enemy_ship._bound_radius*=5.1;
						_distance_to_player=300;
						
						_enemy_ship.CheckTarget=(timeInSeconds)=>{
							this.update_enemy_ship_1(_enemy_ship,timeInSeconds);
						};
						*/
					}
					if(_name==="rocket1"){
						_enemy_ship=this._unitMG.createSimpleRocketShip(_get_pos_fc());
						_enemy_ship._target_object=this._me;
						_enemy_ship._lock_fire=false;
						//_enemy_ship._rocket_speed=50;
						
						//_enemy_ship._bound_radius*=5.1;
						
						_enemy_ship.CheckTarget=(timeInSeconds)=>{
							this.update_enemy_ship_1(_enemy_ship,timeInSeconds);
						};
					
					}
					if(_name==="icy1"){
						_enemy_ship=this._unitMG.createSimpleIcyShip(_get_pos_fc());
						_enemy_ship._target_object=this._me;
						_enemy_ship._lock_fire=false;
						//_enemy_ship._health*=5;
						//_enemy_ship.TakeDamage=()=>{};
						//_enemy_ship._rocket_speed=50;
						
						//_enemy_ship._bound_radius*=5.1;
						if(!this._string1)this._string1=new Array();
						this._string1.push(_enemy_ship);
						
						_enemy_ship.CheckTarget=(timeInSeconds)=>{
							this.update_enemy_ship_1(_enemy_ship,timeInSeconds);
							//this.update_enemy_ship_3(this._string1,_enemy_ship,timeInSeconds);
						};
						
					}
					if(_name==="energy1"){
						_enemy_ship=this._unitMG.createSimpleEnergyShip(_get_pos_fc());
						_enemy_ship._target_object=this._me;
						_enemy_ship._lock_fire=false;
						
						_enemy_ship.CheckTarget=(timeInSeconds)=>{
							this.update_enemy_ship_1(_enemy_ship,timeInSeconds);
						};
					}
					if(_name==="fire1"){
						_enemy_ship=this._unitMG.createSimpleFireShip(_get_pos_fc());
						_enemy_ship._target_object=this._me;
						_enemy_ship._lock_fire=false;
						//_enemy_ship._rocket_speed=50;
						
						//_enemy_ship._bound_radius*=5.1;
						
						_enemy_ship.CheckTarget=(timeInSeconds)=>{
							this.update_enemy_ship_1(_enemy_ship,timeInSeconds);
						};
						
					}
					if(_name==="photon2"){
						//_enemy_ship=this._unitMG.createSimpleFireShip(_get_pos_fc());
						_enemy_ship=this._unitMG.create_photon_ship_type_2("green",1,_get_pos_fc());
						_enemy_ship._target_object=this._me;
						_enemy_ship._lock_fire=false;
						//_enemy_ship._rocket_speed=50;
						
						//_enemy_ship._bound_radius*=5.1;
						//_enemy_ship.jumpTo(this._me.Position);
						//_enemy_ship._model.position.x+=this._utils.get_random_in_range(-100,100);
						//_enemy_ship._model.position.z+=this._utils.get_random_in_range(-100,100);
						
						_enemy_ship.CheckTarget=(timeInSeconds)=>{
							this.update_enemy_ship_1(_enemy_ship,timeInSeconds);
							//_enemy_ship.look_at(this._me.Position);
						};
						
					}
					if(_name==="missile1"){
						_enemy_ship=this._unitMG.createSimpleMissileShip(_get_pos_fc());
						_enemy_ship._target_object=this._me;
						_enemy_ship._lock_fire=false;
						//_enemy_ship._rocket_speed=50;
						
						//_enemy_ship._bound_radius*=5.1;
						
						_enemy_ship.CheckTarget=(timeInSeconds)=>{
							
							this.update_enemy_ship_1(_enemy_ship,timeInSeconds);
						};
						
					}
					
					_enemy_ship._model.scale.multiplyScalar(0.7);
					this._graphics.Scene.add(_enemy_ship._model);
			
					//_enemy_ship.start_move_to_front_of_target_behavior_1();
					_rand_enemy_ships.push(_enemy_ship);
					_all_enemy_ships.push(_enemy_ship);
					
					_enemy_ship.scale_model(2);
					_enemy_ship._level_rate=_enemy_level_rate;
					_enemy_ship._ship_package.set_ship_level(_enemy_level);
					_enemy_ship.apply_space_ship_level_package();
					_enemy_ship._ship_package._max_ship_level=_game_level+100;//để không giới hạn level
					
				}
				
				let _update_fc=(_delta)=>{
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
							_create_wave();
							return;
						}
						else{
							this._StopGame(true);
							
						}
					}
				};
				this.add_to_update_function_list(_update_fc);
		  }
	  }
	  //try{
	  _create_wave();
	 // }catch(e){alert(e.stack);}
	  _lock_timer=false;
	  document.getElementById("game-infor").innerHTML="Level "+_game_level;
	  };
	  
	  let _full_ship_model_ids=new Array();
	  for(let i=0;i<_waves.length;i++){
			const _wave=_waves[i];
			for(let j=0;j<_wave.length;j++){
				_full_ship_model_ids.push(_wave[j].name);
			}
	  }
	  //const array = [1, 2, 2, 3, 4, 4, 5];
	  const uniqueArray = [...new Set(_full_ship_model_ids)];//loai bo cac phan tu giong nhau
	  //alert(uniqueArray);
	  
	  let _loader;
		let _counter=0;
	  for(let i=0;i<uniqueArray.length;i++){
		  //const _model_id=uniqueArray[i];alert(_model_id);
		    const _model_id=this._unitMG.get_enemy_ship_model_id(uniqueArray[i]);//alert(_model_id);
			const _model_path=this._unitMG.get_model_file_path(_model_id);//alert(_model_path);
		  _loader= new GLTFLoader();
			_loader.load(_model_path,( gltf )=> {
				this._unitMG._data_list[_model_id]=gltf;
				_counter++;
				if(_counter===uniqueArray.length){//load complete
					_loading_icon.remove();
					_loading_icon=null;
					_create_waves_fc();
				}
			});
	  }
	  
  }
  
  
  update_enemy_ship_1(_ship,_delta){//bay lượn lờ và tấn công
	  if(typeof _ship._lock_1==='undefined')
		  _ship._lock_1=false;
	  if(_ship._lock_1)return;
	  
	  let _speed=50;
	  let _player_pos=this._me.Position;
	  if(typeof this._player_last_pos==='undefined')
		  this._player_last_pos=_player_pos.clone();
	  let _deltaX=_player_pos.x-this._player_last_pos.x;
	  let _deltaZ=_player_pos.z-this._player_last_pos.z;
	  this._player_last_pos=_player_pos.clone();
	  
	  let _enemy_pos=_ship.Position;
	  if(!_ship._target_pos_1||_ship._target_pos_1===null){
	
		let _center_pos=_player_pos.clone();
			_center_pos.x+=this._utils.get_random_in_range(1,300);
		    //_center_pos.y+=1;
			_center_pos.z+=this._utils.get_random_in_range(1,300);
		let _length=460;
		let _pos_list=[
						new THREE.Vector3(_center_pos.x,_center_pos.y,_center_pos.z),
						new THREE.Vector3(_center_pos.x,_center_pos.y,_center_pos.z+_length),
						new THREE.Vector3(_center_pos.x,_center_pos.y,_center_pos.z-_length),
						new THREE.Vector3(_center_pos.x+_length,_center_pos.y,_center_pos.z),
						new THREE.Vector3(_center_pos.x+_length,_center_pos.y,_center_pos.z+_length),
						new THREE.Vector3(_center_pos.x+_length,_center_pos.y,_center_pos.z-_length),
						new THREE.Vector3(_center_pos.x-_length,_center_pos.y,_center_pos.z+_length),
						new THREE.Vector3(_center_pos.x-_length,_center_pos.y,_center_pos.z-_length),
						new THREE.Vector3(_center_pos.x-_length,_center_pos.y,_center_pos.z)
			];
			let _rand_id=this._utils.get_random_in_range(0,_pos_list.length-1);
			//console.log("RandID="+_rand_id);
			_ship._target_pos_1=_pos_list[_rand_id];
		
	  }
	  
	  let _distance_2=_player_pos.distanceTo(_enemy_pos);
	  let _distance_3=_enemy_pos.distanceTo(_ship._target_pos_1);
	  let _distance_4=_player_pos.y-_ship._target_pos_1.y;
	  
	 
	  if(_distance_3>10){
		   _ship.look_at(_ship._target_pos_1);
		   _ship.move_forward(_speed*_delta);
	  }
	  else{
		 
		  _ship._lock_1=true;
		  _ship.look_at(_player_pos);
		  _ship.Fire();
		  let _move_1=()=>{
			 _ship.move_forward(_speed*_delta);
		  };
		  this.add_to_update_function_list(_move_1);
		  let _after_turn=()=>{
			  //_ship._model.position.y=this._me.getFrontBellowPos(10,0).y;
			  this.add_to_timer(()=>{
				  this.remove_function_from_update_list(_move_1);
				  _ship._target_pos_1=null;//reset
				  _ship._lock_1=false;
			  },5);
		  };
		  let _rand_num=this._utils.get_random_in_range(1,2);
		  if(_rand_num===1)_ship.turnLeft(Math.PI/2,3000,_after_turn);
		  if(_rand_num===2)_ship.turnRight(Math.PI/2,3000,_after_turn);
		
	  }
	  
  }
  
  update_enemy_ship_2(_e_ship,_target_ship,_speed,_min_distance,_fc,_delta){//tiến lại gần target
	  if(typeof _e_ship._lock_2==='undefined')
		  _e_ship._lock_2=false;
	  if(_e_ship._lock_2)return;
	  
	  const _pos1=_e_ship.Position;
	  const _pos2=_target_ship.Position;
	  const _distance=_pos1.distanceTo(_pos2);
	  if(_distance<=_min_distance){
		  _fc();
		  return;
	  }
	  _e_ship._model.position.y=_pos2.y;
	  _e_ship.look_at(_pos2);
      _e_ship.move_forward(_delta*_speed);
  }
  add_to_string(_string,_ship){
	  _string.push(_ship);
  }
  update_enemy_ship_3(_string,_ship,_delta){//bám đuôi nhau tạo thành 1 dây dài
	  let _frontier=null;//ship đi đầu
	  for(let i=0;i<_string.length;i++){
		  const _t_ship=_string[i];
		  if(_frontier===null&&!_t_ship.Dead){
			  _frontier=_t_ship;
		  }
	  }
	  if(_frontier===null)return;
	  
	  const _player_pos=this._me.Position;
	  const _fire_range=40;
	  if(_ship===_frontier){
		const _frontier_pos=_frontier.Position;
		const _distance1=_frontier_pos.distanceTo(_player_pos);
	  
		if(!_frontier._current_phase)
			_frontier._current_phase=1;
		if(_frontier._current_phase===1){
			if(_distance1>_fire_range){
				_frontier.look_at(_player_pos);
				_frontier.move_forward(_delta*16);
			}
			else{
				_frontier.Fire();
				_frontier._current_phase=2;
			}
		}
		if(_frontier._current_phase===2){
			_frontier.move_forward(_delta*16);
			if(_frontier._turning===true)return;
				_frontier._turning=true;
				_frontier.turnLeft(Math.PI/2,6000,()=>{
					_frontier._current_phase=3;
					_frontier._turning=false;
				});
		}
		if(_frontier._current_phase===3){//di ra xa
			if(_distance1<100){
				_frontier.move_forward(_delta*22);
			}
			else{
				_frontier._current_phase=4;
			}
		}
		if(_frontier._current_phase===4){
			_frontier.move_forward(_delta*16);
			if(_frontier._turning===true)return;
				_frontier._turning=true;
				_frontier.turnRight(Math.PI,6000,()=>{
					_frontier._current_phase=1;
					_frontier._turning=false;
				});
		}
		return;
	  }
	  
	  if(!_ship._front_ship||_ship._front_ship===null||_ship._front_ship.Dead){
		  for(let i=0;i<_string.length;i++){
			const _t_ship=_string[i];
			if(_t_ship!=_ship){
				_ship._front_ship=_t_ship;
			}
			else{
				break;
			}
		  }
		  return;
	  }
	  
		  _ship.look_at(_ship._front_ship.Position);
		  const _distance2=_ship.Position.distanceTo(_ship._front_ship.Position);
		  const _distance3=_ship.Position.distanceTo(_player_pos);
		  
		  if(_distance3<_fire_range){
			  if(_ship._lock_fire===false){
				  _ship.look_at(_player_pos);
				  _ship.Fire();
				  return;
			  }
		  }
		  
		  if(_distance2>50){
			  _ship.move_forward(_delta*40);
		  }
		  else if(_distance2>40){
			  _ship.move_forward(_delta*35);
		  }
		  else if(_distance2>30){
			  _ship.move_forward(_delta*29);
		  }
		  else if(_distance2>20){
			  _ship.move_forward(_delta*20);
		  }
		  else if(_distance2>10)
			  _ship.move_forward(_delta*13);
		  
		  
	 
  }
  _StopGame(_win){
	  super._StopGame();
	  //this.createMessageBox("Game Over","you have been destroyed",()=>{});
	  document.body.style.cursor = "pointer";
	  this._navigator_bar_1.clear();
	  this._navigator_bar_2.clear();
	  this._me.remove_skill_panel();
	  
	  setTimeout(()=>{
		  try{
					document.exitPointerLock();
					//document.body.style.cursor = "pointer";
					//document.body.exitFullscreen();
					document.body.style.cursor="default";
			  let _html=``;
			  let _title;
		  if(_win){
			  _title="VICTORY";
			  //const _bonus=parseInt(this._parameters._defense_mode_bonus_min+(_game_level*this._parameters._defense_mode_bonus_min/15));
			  this._item_package.add_item(1001,this._parameters._defense_game_dark_matter_bonus);
			  let _bonus=this._parameters._defense_mode_bonus_min;
			      _bonus*=(1+((_game_level-1)*this._parameters._defense_mode_bonus_rate));
				  _bonus=parseInt(_bonus);
			  this.add_to_cash_list(_bonus);
			  this.update_player_data();
			  this.update_data_in_database(_item_name,_game_level);
			  
			  _html=`
						<div style="padding-left: -20px;font-size:20px;">
							<div style="display: flex;padding-left: 50px;font-size:25px;">
								<img width=70 src='./resources/icons/destroyed.png'/>
								<b style="color:yellow;width:20px;"> </b>`+kill_num+`
							</div>
							</br>
							
							<div style="display: flex;padding-left: 50px;font-size:25px;">
								<img width=50 height=50 src='./resources/icons/exp-up.png'/>
								<b style="color:yellow">$</b>+`+_bonus+`
							</div>
							</br>
							
							<div style="display: flex;padding-left: 50px;font-size:25px;">
								<img width=50 height=50 src='./resources/icons/exp-up.png'/>
								<b style="color:yellow">Dark Matter</b>+`+this._parameters._defense_game_dark_matter_bonus+`</div>
							</br>
	
						</div>
					`;
			  
			  this.createMessageBox("Mission Success",_html,()=>{
				  //this.show_game_menu_1();
				  location.href="./homepage-discovery-mode.html";
			  });	
			  
		  }
		  else{
			  _title="Mission Failed";
			  let _bonus=kill_num*this._parameters._standard_price*3;
			  if(_bonus>this._parameters._defense_mode_bonus_min)
				  _bonus=this._parameters._defense_mode_bonus_min;
			  this.add_to_cash_list(_bonus);
			  this.update_player_data();
			  
			  this.createMessageBox("Mission Failed","",()=>{
				  
				  this.show_game_menu_1();
			  });	
		  }
		  /*
		  showModal("750px","400px",`<h1  style="
									background: linear-gradient(to bottom, red, orange, yellow);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
									font-size: 40px;
									font-weight: bold;
"						'>
							`+_title+`
						</h1>`,_html,()=>{});
						this.add_to_timer(()=>{
							hideModel();
							location.href="./homepage-discovery-mode.html";
						},5);
		  */
		  }catch(e){alert(e.stack);}
	  },4000);
	  
	  
  }
  
  
  
	Update_1(timeInSeconds){//overwrite
		if(!_lock_timer){
			if(_last_second===null)
				_last_second=this._second_counter;
			if(_last_second!=this._second_counter){
				_second_counter+=this._second_counter-_last_second;
				_last_second=this._second_counter;
			}
		
			_remain_time=(_mission_time*60)-_second_counter;
			if(_remain_time>=0){
				let _minute=Math.floor(_remain_time/60);
				let _second=_remain_time-(_minute*60);
				if(_second<10)_second="0"+_second;
					_time_container.innerHTML=_minute+":"+_second;
			}
			else{
				this.add_to_timer(()=>{
					this._StopGame(true);
				},4);
			}
		}
		
		this._missionMG.Update(timeInSeconds);
	}
	_OneSecondPass(){//overwrite
		super._OneSecondPass();
		if(!this._me)return;
		document.getElementById("scoreText").innerHTML=kill_num;
		
		if(this._unitMG.no_unit_alive()){
			this._entities['player']._params.arrow.visible=false;
		}
		
	}
	
	
  _OnInitialize() {
	  
	this._config={
		magnification_factor:450000//hệ số phóng đại dữ liệu khoảng cách trong data load lên
	};
	
	this._lock_controls=false;
	
    this._CreateGUI();
	
    this._userCamera = new THREE.Object3D();
    this._userCamera.position.set(4100, 0, 0);

    this._graphics.Camera.position.set(9500,0,-500);
    //this._graphics.Camera.quaternion.set(-0.032, 0.885, 0.062, 0.46);
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
	
	//_universe=new Universe({scene:this._graphics.Scene,camera:this._graphics.Camera,game:this});
	//_universe.create_galaxy(1);
	
	
	
	Unit.AfterDead=(_unit)=>{
		this._unitMG.update_enemy_combat_unit_list();
		this._sound.play('explosion1');
		if(_unit._is_enemy===true){
			let _bonus=this._parameters._defense_mode_kill_bonus;
			    _bonus*=(1+((_game_level-1)*this._parameters._defense_mode_kill_bonus_rate));
				_bonus=parseInt(_bonus);
			this.add_to_cash_list(_bonus);
			
			kill_num+=1;
			//const _t_exp=60;
			const _t_exp=_unit.get_exp_reward()*_exp_rate;
			//this._me._ship_package.plus_ship_exp(_t_exp);
			this.add_to_exp_list(_t_exp);
			
		}
		
		const _rs=this._me._ship_package.upgrade_level();
		if(_rs===true){
			this._noticeBoard.add_message("Leveled up: "+this._me._ship_package.get_ship_level());
			//this._me._ship_package.save_data();
		}
		this._me._ship_package.save_data();
		
		
		//-----------
		if(_unit===this._me){
			//alert("YOu are Dead!");
			this._StopGame(false);
			this.createMessageBox("Game Over","you have been destroyed",()=>{});
			//this._StopRender();
			return;
		}
	};
	
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
  
  start_multi_player_game(_init_data){
	  //alert(_init_data);
	  let _enemy_ship_id=null;
	  for(let i=0;i<_init_data.length;i++){
		const _element=_init_data[i].split("!");
		const _p_id=parseInt(_element[0]);
		const _p_ship_id=parseInt(_element[1].split(":")[1]);
					
		if(_p_id!=this._room.get_me().get_player_id()){
			_enemy_ship_id=_p_ship_id;
			break;
		}
	}
	  
	  try{
	let init_pos_1=new THREE.Vector3(1000,6000,1000);//vi tri cua chu phong
	let init_pos_2=new THREE.Vector3(1000,6000,1050);//vi tri doi thu
	
	if(this._room.get_me().is_key()){
		this._me._model.position.copy(init_pos_1);
		this._unitMG.create_player_enemy_entity(_enemy_ship_id,init_pos_2);
	}
	else{
		this._me._model.position.copy(init_pos_2);
		this._unitMG.create_player_enemy_entity(_enemy_ship_id,init_pos_1);
	}
	
	this._client=this._room.get_me();
	this._client.set_entity(this._me);
	this._enemy_1=this._room.get_enemy();
	this._enemy_1.set_entity(this._unitMG.get_player_enemey_entity());
	//this._enemy_1.get_entity()._is_enemy=true;
	
	this._me._model.lookAt(this._entities['enemy-player-1']._model.position);
	  }catch(e){alert(e.stack);}
  }
  
}


//--------------------------------------------------


//-----------------------------------------------------

function _Main() {
	
  _APP = new ProceduralTerrain_Demo();
  
}

_Main();


