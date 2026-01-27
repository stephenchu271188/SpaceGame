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

import {GameMap} from './game-map.js';


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
let _coordinates=document.getElementById("coordinates");
let _px,_py,_pz;
//let _my_status_list=new Array();//gui trang thai cua minh len server de server gui cho enemy player
let _enemy_status_list_1=new Array();//cua player enemy

let _item_name="assult-mode-level";
let _game_level;

class ProceduralTerrain_Demo extends SpaceShipGame {
  constructor() {
    super({game_id:1,
	load_unit_model_complete:()=>{
		this.enable_items=false;
		
		this.create_menu_btton();
		this._graphics.init_lasers();
		this._unitMG.create_player_entity();	
		//this.add_radar();
		this.rocket_multiplier=5;
		this.enable_mouse_controlled_mode_2();
		this._game_map=new GameMap({game:this});
		this._game_map.load_data(1,()=>{
		this._map_pos=new THREE.Vector3(999999,0,0);//9999
		this._game_map.init(this._map_pos);
		let _marking_mode=false;//co phai che' do editing(position list) hay ko
		
		this._player_ship_track=new Array();//lưu vết đường di chuyển
		let _max_pos=50;
		let _tracking_fc=()=>{
			this._player_ship_track.push(this._me.Position.clone());
			if(this._player_ship_track.length>_max_pos)
				this._player_ship_track.shift();//xoa phan tu dau tien trong mang
			//console.log("Num="+this._player_ship_track.length);
			this.add_to_timer(()=>{
				_tracking_fc();
			},2);//2 giay 1 lan
		};
		_tracking_fc();
		
		setTimeout(()=>{
			this._gear_box.hide_panel();
			//this._me._max_health*=100;
			//this._me._health=this._me._max_health;//alert(this._me._health);
			this._me._model.position.copy(this._game_map._player_init_pos);
			this._me._model.position.y+=2000;
			//this._entities['player']._params.arrow.visible=false;
			//this._me._model.remove(this._me._params.arrow);
			this.add_to_function_list_4(()=>{
				this._game_map.check_collision();
				const _distance=this._me.Position.distanceTo(this._map_pos);
				if(_distance>=this._bound_radius){//Ra ben ngoai vong tron
					this._StopGame(false);
				}
			});
			
			const _renderer_div=document.getElementById("CSS2DRenderer")
		    const _labelRenderer=this._graphics.enable_CSS2D_Renderer(_renderer_div);
		    this._mark_counter=0;
		    this._marking_pos_list=new Array();
			
			if(_marking_mode){
				this._entities['_controls2']._marking_mode=true;
			}
			else{
				this.init_mission();
			}
			/*
			this.enable_mouse_controlled_mode(()=>{
				this._mouse_speed=0.2;
				//this.init_game_mission();
			});
			*/
		},1);
		});
		
		/*
		this._me.TakeDamage=(x)=>{};//so hp cua player duoc cap nhat tu may' cua enemy gui len server
		
		try{
			this._room=new Room({game:this});
			let _init_data="ship_id:"+this._unitMG._player_ship_id;
			this._room.init_multi_player_mode(_init_data);
		}catch(e){
				alert(e.stack);
		}
		*/
		//this._me._inventory.load_data();		
		//this._unitMG.add_random_enemy_combat_unit(1);
	}});
	
	//this._behaviors=new Array();
	
	//_last_pos.position.copy(this._graphics.Camera.position);
	
  }
  
  _StopGame(_win){
	  super._StopGame();
	  //this.createMessageBox("Game Over","you have been destroyed",()=>{});
	  this._navigator_bar_1.clear();
	  this._navigator_bar_2.clear();
	  this._me.remove_skill_panel();
	  
	  setTimeout(()=>{
		  try{
			document.body.style.cursor="pointer";
		  if(_win){
			  let _bonus=this._parameters._assault_mode_bonus_min;
			      _bonus*=(1+((_game_level-1)*this._parameters._assault_mode_bonus_rate));
				  _bonus=parseInt(_bonus);
			  this.add_to_cash_list(_bonus);
			  this.update_player_data();
			  this.update_data_in_database(_item_name,_game_level);
			  this.createMessageBox("Mission Success","You won "+_bonus,()=>{
				  this.show_game_menu_1();
			  });	
		  }
		  else{
			  this.update_player_data();
			  this.createMessageBox("Mission Failed","",()=>{
				  this.show_game_menu_1();
			  });	
		  }
		  }catch(e){alert(e.stack);}
	  },4000);
	  
	  
  }
  
  /*
	Kiem tra xem bound bang cach set player-ship position len tren cao roi nhin xuong
  */
  create_map_bound(){
	  this._bound_radius=this._game_map._bound_radius;
	  const geometry = new THREE.SphereGeometry( this._bound_radius, 32, 32 ); 
	  const material = new THREE.MeshBasicMaterial( { color: 0xffff00,side:THREE.DoubleSide,transparent:true,opacity:0.4} ); 
      const sphere = new THREE.Mesh( geometry, material ); 
	  this._graphics.Scene.add( sphere );
	  sphere.position.copy(this._map_pos);
	  
	  //this._me._model.position.copy(this._map_pos);
	  //this._me._model.position.y+=70000;
	  
	  return;
	  
	  
	  let _coordinates=this._game_map.get_min_max_coordinates();
	  
	  let _min_x_pos=_coordinates.min_x_point.clone();_min_x_pos.add(this._map_pos);
	      //_min_x_pos.x+=999999;
	  let _max_x_pos=_coordinates.max_x_point.clone();_max_x_pos.add(this._map_pos);
	      //_max_x_pos.x+=999999;
	  let _min_y_pos=_coordinates.min_y_point.clone();_min_y_pos.add(this._map_pos);
	      //_min_y_pos.x+=999999;
	  let _max_y_pos=_coordinates.max_y_point.clone();_max_y_pos.add(this._map_pos);
	      //_max_y_pos.x+=999999;
      let _min_z_pos=_coordinates.min_z_point.clone();_min_z_pos.add(this._map_pos);
	      //_min_z_pos.x+=999999;
	  let _max_z_pos=_coordinates.max_z_point.clone();_max_z_pos.add(this._map_pos);
	      //_max_z_pos.x+=999999;
	  //this._me._model.position.copy(_min_x_pos);
	  
	  let _minX=_min_x_pos.x;
	  let _maxX=_max_x_pos.x;
	  let _minY=_min_y_pos.y;
	  let _maxY=_max_y_pos.y;
	  let _minZ=_min_z_pos.z;
	  let _maxZ=_max_z_pos.z;
	
	  const width = _maxX - _minX;
      const height = _maxY - _minY;
      const depth = _maxZ - _minZ;
      const boxGeometry = new THREE.BoxGeometry(width, height, depth);
      const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: false,side:THREE.DoubleSide,
		transparent:true,opacity:0.3});
	  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
	  boxMesh.position.set((_minX + _maxX) / 2, (_minY + _maxY) / 2, (_minZ + _maxZ) / 2);
	  this._graphics.Scene.add(boxMesh);
	  //alert("FINISH");
  }
  init_mission(){
	  //let _item_name="assult-mode-level";
	  _game_level=this.get_data_in_database(_item_name);
	  if(_game_level===null)_game_level=1;
	  else _game_level=parseInt(_game_level)+1;
	  //alert("Game Level="+_game_level);
	
	  this._navigator_bar_1.hide();
	  this._navigator_bar_2._main_container.style.top="150px";
	  
	  this.create_map_bound();
	 
       let _distance_text_container=document.createElement("div");
	       _distance_text_container.style.position="absolute";
		   _distance_text_container.style.top="200px";
		   _distance_text_container.style.left="100px";
		   _distance_text_container.style.width="250px";
		   _distance_text_container.style.height="50px";
		   _distance_text_container.style.color="yellow";
		   _distance_text_container.style.fontSize="30px";
		   
		   this._root_div.appendChild(_distance_text_container);
		   //alert(_game_level);
		   //_game_level=200;
		   let _unit_num=1+(Math.floor(_game_level/10));
		   let _max_unit_num=3;
		   if(_unit_num>_max_unit_num)_unit_num=_max_unit_num;
		   //alert("UnitNum="+_unit_num);
		   let _speed=50;
		   let _units=new Array();
		   for(let i=0;i<_unit_num;i++){
			   let _pos_list=new Array();
			   const _path=this._game_map.get_enemy_ship_path(i);
			   for(let j=0;j<_path.length;j++){
					const _element1=_path[j];
					const _pos1=new THREE.Vector3(_element1.x,_element1.y,_element1.z);
					_pos_list.push(_pos1);
					let _element2;
					if(j===_path.length-1)
						_element2=_path[0];
					else
						_element2=_path[j+1];
					const _pos2=new THREE.Vector3(_element2.x,_element2.y,_element2.z);
				}
			   
			   let _enemy_ship=this._unitMG.createSimpleRocketShip(_pos_list[0]);
			       _enemy_ship._target_object=this._me;
				   _enemy_ship._lock_fire=false;
				   //_enemy_ship._rocket_speed=50;
				   //_enemy_ship._model.scale.multiplyScalar(1.2);
				   _enemy_ship._bound_radius*=20.1;
				   _enemy_ship.scale_model(2);
				   _enemy_ship.add_to_scene();
				   //_enemy_ship.create_label_1("enemy");
				   
				   //try{
				   //this._entities['_radar'].addTarget(_enemy_ship);
				   //}catch(e){alert(e.stack);}
				   this.create_enemy_gaurd_ship(_enemy_ship);
				   _enemy_ship.add_to_after_dead_function_list(()=>{
					   //_enemy_ship.change_label_1("Dead!");
					   let _all_dead=true;
					   for(let k=0;k<_units.length;k++){
						   if(_units[k].Dead){
							   //alert("Dead");
							   //_units.splice(k,1);
						   }
						   else{
							   _all_dead=false;
							   break;
						   }
					   }
					   if(_all_dead){
						  this._StopGame(true);
					   }
				   });
				   _units.push(_enemy_ship);
				   
			   let _pos_id_1=this._utils.get_random_in_range(0,_pos_list.length-2);
			   let _pos_id_2=_pos_id_1+1;
				   _enemy_ship.CheckTarget=(t)=>{
						const _e_pos=_enemy_ship.Position;
						const _p_pos=this._me.Position;
						const _target_pos=_pos_list[_pos_id_2];
						const _distance1=_e_pos.distanceTo(_target_pos);
						if(_distance1<20){
							_pos_id_1++;
							if(_pos_id_1===_pos_list.length-1){
								_pos_id_2=0;
							}
							else if(_pos_id_1===_pos_list.length){
								_pos_id_1=0;
								_pos_id_2=1;
							}
							else{
								_pos_id_2=_pos_id_1+1;
								return;
							}
						}
						_enemy_ship.look_at(_target_pos);
						_enemy_ship.move_forward(t*_speed);
				
						
			};
		   }
		 
		for(let i=0;i<_units.length;i++){
			let _div=document.createElement("div");
				_div.classList.add("slider");
			let _id='range-'+i;
				_div.innerHTML=`
					<div id="output-`+i+`" class="output"></div>
					<input class="rangeslider"  type="range" min="0" max="100" value="0" step="10" id="`+_id+`">
				`;
				
				_distance_text_container.appendChild(_div);
		}
		
		let _max_slider_km=10000;
		this.add_to_function_list_3(()=>{
			const _p_pos=this._me.Position;
			for(let i=0;i<_units.length;i++){
				const _unit=_units[i];
				if(_unit.Dead){
					document.getElementById("range-"+i).disabled =true;
					document.getElementById("output-"+i).innerHTML="<b style='color:red'>Dead</b>";
					continue;
				}
				const _e_pos=_unit.Position;
				const _distance=parseInt(_e_pos.distanceTo(_p_pos));
				let _value=parseInt((_distance/_max_slider_km)*100);
				if(_value>100)_value=100;
				document.getElementById("range-"+i).value=_value;
				document.getElementById("output-"+i).innerHTML=_distance+"km";
			}
		});
		
		
		this.create_enemy_attack_ship();
  }
  
  create_enemy_attack_ship(){
	 
	  let _virtual_ship=this._unitMG.createSimpleMissileShip(this._me.Position);
			_virtual_ship._model.visible=false;//alert(this._playerID);
			_virtual_ship._player_id=this._playerID;
			_virtual_ship.TakeDamage=()=>{};
			_virtual_ship.CheckTarget=(t)=>{
				_virtual_ship.jumpTo(this._me.Position);
				//_virtual_ship._model.rotation.x+=t*0.05;
				_virtual_ship._model.rotation.y+=t*0.05;
				//_virtual_ship._model.rotation.z+=t*0.001;
			}
	  
	  this._me._focus_target=null;
	  this._enemy_attack_ships=new Array();//cac loai enemy-ship tan' cong player-ship
	  this._me.CheckTarget=(t)=>{// arrow only point-at attack-ships
		  if(!this._me._focus_target||this._me._focus_target===null||this._me._focus_target.Dead){
			  let _min_distance=Infinity;
			  let _new_target=null;
			  if(this._enemy_attack_ships.length!=0)
			  for(let j=0;j<this._enemy_attack_ships.length;j++){
				  const _t_target=this._enemy_attack_ships[j];
				  if(_t_target===null||_t_target.Dead)
					 continue;
							
				  if(_t_target.Position.distanceTo(this._me.Position)<_min_distance){
					 _min_distance=_t_target.Position.distanceTo(this._me.Position);
					 _new_target=_t_target;
				  }
			  }
			  //if(_new_target!=null)
			  this._me._focus_target=_new_target;
		  }
		  
		  if(!this._me._focus_target||this._me._focus_target===null||this._me._focus_target.Dead)
			  this._entities['player']._params.arrow.visible=false;
		  else{
			   this._entities['player']._params.arrow.visible=true;
			   //const _tpos=new THREE.Vector3();
			   //this._focus_target._model.getWorldPosition(_tpos);
		       this._entities['player']._params.arrow.lookAt(this._me._focus_target.Position);
		  }
			 
	  };
	  //this._params.arrow.visible=false;
	    let _min_enemy_attack_ships=4;
		let _max_enemy_attack_ships=10;
		let _enemy_attack_ship_num=_min_enemy_attack_ships+(Math.floor(_game_level/7));
			//alert("attack num="+_enemy_attack_ship_num);
		let _enemy_init_pos=this._map_pos.clone();//vi tri attack-enemy-ship xuat hien
			_enemy_init_pos.y+=2000;
		let _first_create=true;
		let _check_enemy_ships_fc=()=>{
			for(let i=this._enemy_attack_ships.length-1;i>=0;i--){
				if(this._enemy_attack_ships[i].Dead){
					this._enemy_attack_ships.splice(i,1);
				}
			}
			const _add_num=_enemy_attack_ship_num-this._enemy_attack_ships.length;
			if(!_first_create)if(_add_num>0)_add_num=1;//chi them 1 ship 1 lan
			_first_create=true;
			
			
			for(let i=0;i<_add_num;i++){
				let _e_id=i;
				let _raycaster = new THREE.Raycaster();
				_raycaster.far=100;
				let _t_pos=_enemy_init_pos.clone();
					_t_pos.x+=this._utils.get_random_in_range(-500,500);
					_t_pos.z+=this._utils.get_random_in_range(-500,500);
				let _enemy_ship=this._unitMG.createSimpleMissileShip(_t_pos);
			        _enemy_ship._target_object=this._me;
				    _enemy_ship._lock_fire=false;
				    _enemy_ship._rocket_speed=550;
				    _enemy_ship._bound_radius*=20.1;
				    _enemy_ship.scale_model(1);
					//_enemy_ship.create_label_1("attacker");
				    _enemy_ship.add_to_scene();
					_enemy_ship._array_id=_e_id;
					this._enemy_attack_ships.push(_enemy_ship);
					
				let _fc1_counter=0;
				let _fc_1_speed=100;
				let _fc1=(t)=>{
					_player_pos=this._me.Position;
						if(!_enemy_ship._fc1_target_pos||_enemy_ship._fc1_target_pos===null){
							_enemy_ship._fc1_pos_id=this._utils.get_random_in_range(1,4);
							_enemy_ship._fc1_distance=this._utils.get_random_in_range(600,1400);
							
							if(_enemy_ship._fc1_pos_id===1)
								_enemy_ship._fc1_target_pos=this._me.getFrontPos(_enemy_ship._fc1_distance);
							if(_enemy_ship._fc1_pos_id===2)
								_enemy_ship._fc1_target_pos=this._me.getBackPos(_enemy_ship._fc1_distance);
							if(_enemy_ship._fc1_pos_id===3)
								_enemy_ship._fc1_target_pos=this._me.getLeftpos(_enemy_ship._fc1_distance);
							if(_enemy_ship._fc1_pos_id===4)
								_enemy_ship._fc1_target_pos=this._me.getRightPos(_enemy_ship._fc1_distance);
						}
						_fc1_counter++;
						
						_enemy_ship.look_at(_enemy_ship._fc1_target_pos);
						const _t_distance=_enemy_ship.Position.distanceTo(_enemy_ship._fc1_target_pos);
						if(_t_distance>t*_fc_1_speed)
							_enemy_ship.move_forward(t*_fc_1_speed);
						else{
							_enemy_ship.move_forward(_t_distance);
							if(_fc1_counter<=2){
								_enemy_ship._fc1_target_pos=null;//tiep tuc tim vi tri target_pos khac
								return;
							}
							else{
								_enemy_ship._fc1_target_pos=null;
								_fc1_counter=0;
								_enemy_ship.CheckTarget=_fc2;
							}
						}
							
				};
				
					_enemy_ship._lock_fc2=false;
					_enemy_ship._target_position2=null;
				let _fc2=(t)=>{//tien lai gan target roi ban'
						if(_enemy_ship._lock_fc2)return;
						_player_pos=this._me.Position;
						if(!_enemy_ship._pos_id_2||_enemy_ship._pos_id_2===null){
							_enemy_ship._pos_id_2=this._utils.get_random_in_range(1,4);
							_enemy_ship._distance_2=this._utils.get_random_in_range(250,350);
							
						}
						
						//if(_enemy_ship._target_position2===null){
						if(_enemy_ship._pos_id_2===1)
								_enemy_ship._target_position2=_virtual_ship.getFrontPos(_enemy_ship._distance_2);
						if(_enemy_ship._pos_id_2===2)
								_enemy_ship._target_position2=_virtual_ship.getBackPos(_enemy_ship._distance_2);
						if(_enemy_ship._pos_id_2===3)
								_enemy_ship._target_position2=_virtual_ship.getLeftpos(_enemy_ship._distance_2);
						if(_enemy_ship._pos_id_2===4)
								_enemy_ship._target_position2=_virtual_ship.getRightPos(_enemy_ship._distance_2);
						//}
						//if(_enemy_ship._target_position2===null)alert("FUCK");
						_distance1=_enemy_ship.Position.distanceTo(_enemy_ship._target_position2);
						_distance2=_enemy_ship.Position.distanceTo(_player_pos);
						if(!_enemy_ship._lock_fire&&_distance2<=550){
							_enemy_ship.look_at(_player_pos);
							_enemy_ship.Fire();
							_enemy_ship._pos_id_2=null;
							//_enemy_ship._lock_fc2=true;
							_enemy_ship._lock_fc2=false;
							_enemy_ship._target_position2=null;
							_enemy_ship.next_behavior();
							return;
						}
						
						if(_distance1>1200)
							_hunting_speed=350;
						else if(_distance1>700)
								_hunting_speed=240;
						else if(_distance1>500)
								_hunting_speed=200;
						else if(_distance1>300)
								_hunting_speed=180;
						else
								_hunting_speed=100;
						
						_enemy_ship.look_at(_enemy_ship._target_position2);
						if(_distance1>t*_hunting_speed)
							_enemy_ship.move_forward(t*_hunting_speed);
						else
							_enemy_ship.move_forward(_distance1);
				
				};
				
				let _distance1,_distance2,_player_pos,_hunting_speed;
				let _fc3=(t)=>{//bám theo track của player-ship
						_player_pos=this._me.Position;
						if(!_enemy_ship._target_position1){
							_enemy_ship._target_position1=this._utils.get_random_elements_from_array(this._player_ship_track,1)[0];
						}
						_distance1=_enemy_ship.Position.distanceTo(_enemy_ship._target_position1);
						_distance2=_enemy_ship.Position.distanceTo(_player_pos);
						if(_distance2<=300){
							_enemy_ship.look_at(_player_pos);
							_enemy_ship.Fire();
							return;
						}
						if(_distance1<10){
							_enemy_ship._target_position1=this._player_ship_track[this._player_ship_track.length-2];
							return;
						}
						if(_distance1>700)
								_hunting_speed=550;
						else if(_distance1>500)
								_hunting_speed=500;
						else if(_distance1>300)
								_hunting_speed=450;
						else
								_hunting_speed=400;
							
						_enemy_ship.look_at(_enemy_ship._target_position1);
						if(_distance1>t*_hunting_speed)
							_enemy_ship.move_forward(t*_hunting_speed);
						else{
							_enemy_ship.move_forward(_distance1);
							
						}
						if(_distance1<5){
							_enemy_ship.next_behavior();
							return;
						}	
						
					};
					
				let _fc4=(t)=>{
					_enemy_ship.move_forward(t*60);
					if(typeof _enemy_ship._turning==='undefined')_enemy_ship._turning=false;
					if(_enemy_ship._turning===true)return;
					_enemy_ship._turning=true;
					let _after_turn=()=>{
							const _pos1=_enemy_ship.Position;
							const _pos2=_enemy_ship.getFrontPos(100);
							const _direction=new THREE.Vector3();
							_direction.subVectors( _pos2, _pos1 ).normalize();
							_raycaster.set(_pos1,_direction);
							const _intersections = _raycaster.intersectObjects([this._game_map._root],true);
							let _fc4_distance=Infinity;
							let intersect_point=null;
							if(_intersections.length > 0){
								intersect_point=_intersections[0].point;	
								_fc4_distance=intersect_point.distanceTo(_pos1);
							}
						_enemy_ship.CheckTarget=(t2)=>{		
						    const _e_pos4=_enemy_ship.Position;
						    if(_e_pos4.y>this._map_pos.y+3600||_e_pos4.y<this._map_pos.y+600){
								_enemy_ship.CheckTarget=_fc4;//reset
								_enemy_ship._turning=false;
								return;
							}
							if(_fc4_distance<100){
								_enemy_ship.CheckTarget=_fc4;//reset
								_enemy_ship._turning=false;
								return;
							}
							//_enemy_ship.move_forward(t2*60);
							
							if(typeof _enemy_ship.check_collision==='undefined')
								_enemy_ship.check_collision=false;
							let _can_move_forward=false;
							if(!_enemy_ship.check_collision){
								_enemy_ship.check_collision=true;
								const _t_rs=this.get_intersect_point(_enemy_ship,_enemy_ship.getFrontPos(10));
								let _t_distance1=Infinity;
								if(_t_rs!=null)_t_distance1=_t_rs.distance;
								if(_t_distance1>100)_can_move_forward=true;
								this.add_to_timer(()=>{
									_enemy_ship.check_collision=false;
								},2);
							}
							
							if(_can_move_forward)
								_enemy_ship.move_forward(t2*60);
							else
								_enemy_ship.CheckTarget=_fc4;
							
						}	
						
						this.add_to_timer(()=>{
							_enemy_ship._turning=false;
							_enemy_ship.next_behavior();
							return;
						},30);
					};
					
					if(this.can_turn(_enemy_ship,_enemy_ship.getFrontLeftPos(50,50))){
						if(this.can_turn(_enemy_ship,_enemy_ship.getFrontLeftPos(5,50))){
							_enemy_ship.turnLeft(Math.PI/3,2000,_after_turn);
							return;
						}
					}
					if(this.can_turn(_enemy_ship,_enemy_ship.getFrontRightPos(50,50))){
						if(this.can_turn(_enemy_ship,_enemy_ship.getFrontRightPos(5,50))){
							_enemy_ship.turnRight(Math.PI/3,2000,_after_turn);
							return;
						}
					}
					if(this.can_turn(_enemy_ship,_enemy_ship.getFrontAbovePos(50,50))){
						if(this.can_turn(_enemy_ship,_enemy_ship.getFrontAbovePos(5,50))){
							_enemy_ship.turnUp(Math.PI/3,2000,_after_turn);
							return;
						}	
					}
				};
				
				let _fc5=(t)=>{
					
					_enemy_ship.move_forward(t*60);
					if(typeof _enemy_ship._turning==='undefined')_enemy_ship._turning=false;
					if(_enemy_ship._turning===true)return;
					_enemy_ship._turning=true;
					let _after_turn=()=>{
							const _pos1=_enemy_ship.Position;
							const _pos2=_enemy_ship.getFrontPos(100);
							const _direction=new THREE.Vector3();
							_direction.subVectors( _pos2, _pos1 ).normalize();
							_raycaster.set(_pos1,_direction);
							const _intersections = _raycaster.intersectObjects([this._game_map._root],true);
							let _fc4_distance=Infinity;
							let intersect_point=null;
							if(_intersections.length > 0){
								intersect_point=_intersections[0].point;	
								_fc4_distance=intersect_point.distanceTo(_pos1);
							}
						_enemy_ship.CheckTarget=(t2)=>{	
							const _e_pos4=_enemy_ship.Position;
						    if(_e_pos4.y>this._map_pos.y+2600||_e_pos4.y<this._map_pos.y+400){
								_enemy_ship.CheckTarget=_fc4;//reset
								_enemy_ship._turning=false;
								return;
							}
							if(_fc4_distance<100){
								_enemy_ship.CheckTarget=_fc4;//reset
								_enemy_ship._turning=false;
								return;
							}
							_enemy_ship.move_forward(t2*60);
						}	
						
						this.add_to_timer(()=>{
							_enemy_ship._turning=false;
							_enemy_ship.next_behavior();
							return;
						},4);
					};
					
					if(this.can_turn(_enemy_ship,_enemy_ship.getFrontLeftPos(50,50))){
						_enemy_ship.turnLeft(Math.PI/2,2000,_after_turn);
						//if(_e_id===0)console.log("Left");
						return;
					}
					if(this.can_turn(_enemy_ship,_enemy_ship.getFrontRightPos(50,50))){
						_enemy_ship.turnRight(Math.PI/2,2000,_after_turn);
						//if(_e_id===0)console.log("Right");
						return;
					}
					if(this.can_turn(_enemy_ship,_enemy_ship.getFrontAbovePos(50,50))){
						_enemy_ship.turnUp(Math.PI/2,2000,_after_turn);
						//if(_e_id===0)console.log("Up");
						return;
					}
				};
				
			   _enemy_ship._behaviors=[_fc2,_fc4];
			   _enemy_ship._behavior_id=0;
			   _enemy_ship.next_behavior=()=>{
				   _enemy_ship.CheckTarget=_enemy_ship._behaviors[_enemy_ship._behavior_id];
				   _enemy_ship._behavior_id++;
				   if(_enemy_ship._behavior_id>_enemy_ship._behaviors.length-1){
					   _enemy_ship._behavior_id=0;
				   }
			   };
				
				 _enemy_ship.next_behavior();
				
					//this._noticeBoard.add_message("EnemyShip is comming");
			}
			
			this.add_to_timer(()=>{
				_check_enemy_ships_fc();
			},5*60);
		}
		this.add_to_timer(()=>{
				_check_enemy_ships_fc();
			},10);
			//alert("HELLO");
  }
  can_turn(_enemy_ship,_pos){
	  const _min_length=100;
	  let _rs=this.get_intersect_point(_enemy_ship,_pos);
	  if(_rs!=null){
		if(_rs.distance<_min_length){
			return false;
		}
		else{
			return true;
		}
	  }
	  return true;
  }
  get_intersect_point(_enemy_ship,_pos){
	  let _rs=null;
	  let _e_ship_pos=_enemy_ship.Position;
	  let _raycaster2=new THREE.Raycaster();
	  _raycaster2.far=100;
	  //const _front_left=_enemy_ship.getFrontLeftPos(50,50);
	  let _direction2=new THREE.Vector3();
	  _direction2.subVectors( _pos, _e_ship_pos ).normalize();
	  _raycaster2.set(_e_ship_pos,_direction2);
	  let _intersections = _raycaster2.intersectObjects([this._game_map._root],true);
	  let _intersect_point2=null;
	  if(_intersections.length > 0){
		_intersect_point2=_intersections[0].point;	
		let _distance=_e_ship_pos.distanceTo(_intersect_point2);
        _rs={point:_intersect_point2,distance:_distance};		
	  }
	  
	  return _rs;
  }
 
  create_enemy_gaurd_ship(_enemy_main_ship){//cac ship bao ve xung quanh
	  
	let _space=100;
	
	const create_missile_ship=(_id)=>{
		let _new_ship=this._unitMG.createSimpleMissileShip(_enemy_main_ship.Position);
			_new_ship._target_object=this._me;
			_new_ship._lock_fire=false;
			_new_ship._rocket_speed=50;
			_new_ship._model.scale.multiplyScalar(1.2);
			_new_ship._bound_radius*=20.1;
			_new_ship.scale_model(2);
			_new_ship.add_to_scene();
			_new_ship.CheckTarget=(t)=>{
				if(!_enemy_main_ship.Dead){
					_new_ship.jumpTo(this._get_pos_fc(_id,_enemy_main_ship));
				}
				if(_new_ship.Position.distanceTo(this._me.Position)<350){
					_new_ship.look_at(this._me.Position);
					_new_ship.Fire();
				}
			};
	};
	const create_rocket_ship=(_id)=>{
		let _new_ship=this._unitMG.createSimpleRocketShip(_enemy_main_ship.Position);
			_new_ship._target_object=this._me;
			_new_ship._lock_fire=false;
			_new_ship._rocket_speed=250;
			_new_ship._model.scale.multiplyScalar(1.2);
			_new_ship._bound_radius*=20.1;
			_new_ship.scale_model(2);
			_new_ship.add_to_scene();
			_new_ship.CheckTarget=(t)=>{
				if(!_enemy_main_ship.Dead){
					_new_ship.jumpTo(this._get_pos_fc(_id,_enemy_main_ship));
				}
				if(_new_ship.Position.distanceTo(this._me.Position)<350){
					_new_ship.look_at(this._me.Position);
					_new_ship.Fire();
				}
			};
	};
	const create_ambulance_ship=(_id)=>{
		let _new_ship=this._unitMG.createSimpleAmbulanceShip(_enemy_main_ship.Position);
			_new_ship._bound_radius*=20.1;
			_new_ship.scale_model(2.5);
			_new_ship.add_to_update_function_list(()=>{
				if(!_enemy_main_ship.Dead){
					_new_ship.jumpTo(this._get_pos_fc(_id,_enemy_main_ship));
				}
			});
	};
	const create_photon_ship=(_id)=>{
		let _new_ship=this._unitMG.createSimplePhotonShip(_enemy_main_ship.Position);
			_new_ship._target_object=this._me;
			_new_ship._lock_fire=false;
			_new_ship.scale_model(0.3);
			_new_ship.add_to_scene();
			_new_ship.CheckTarget=(t)=>{
				if(!_enemy_main_ship.Dead){
					_new_ship.jumpTo(this._get_pos_fc(_id,_enemy_main_ship));
				}
				_new_ship.CheckTarget2(t);
			};
	};
	
	const createRocketDefenseShip=(_id)=>{
		let _new_ship=this._unitMG.createSimpleRocketDefenseShip(_enemy_main_ship.Position);
			//_new_ship._target_object=this._me;
			_new_ship._lock_fire=false;
			//_new_ship._rocket_speed=250;
			_new_ship._model.scale.multiplyScalar(1.2);
			_new_ship._bound_radius*=20.1;
			_new_ship.scale_model(2);
			_new_ship.add_to_scene();
		let _update_fc=()=>{
				if(!_enemy_main_ship.Dead){
					_new_ship.jumpTo(this._get_pos_fc(_id,_enemy_main_ship));
				}
			};
		this.add_to_update_function_list(_update_fc);
		    _new_ship.add_to_after_dead_function_list(()=>{
				this.remove_function_from_update_list(_update_fc);
			});
			
	};
	
	
	
	const _create_ship_fc=[
		{create_fc:create_rocket_ship},
		{create_fc:create_missile_ship},
		{create_fc:createRocketDefenseShip},
		{create_fc:create_ambulance_ship},
		{create_fc:create_photon_ship}
	];
	
	let _increase_1=4;//so luong ship thi tang them 1 type
	
	let _get_create_ship_fc=(_id)=>{
		let _fc_id=Math.floor(_id/_increase_1);
		if(_fc_id>=_create_ship_fc.length)
			_fc_id=_fc_id%_create_ship_fc.length;
			//console.log("FID:"+_fc_id);
		return _create_ship_fc[_fc_id].create_fc;
		
	};
	//let _game_level=100;
	let _min_gaurd_ship_num=4;
	let _max_gaurd_ship_num=20;
	let _ship_num=_min_gaurd_ship_num+(Math.floor(_game_level/2));
	if(_ship_num>_max_gaurd_ship_num)_ship_num=_max_gaurd_ship_num;
	//alert("ShipNum="+_ship_num);
	for(let i=0;i<_ship_num;i++){
		let _id=i;
		_get_create_ship_fc(_id)(_id);
	}
	
  }
  
  _get_pos_fc(_id,_e_ship){
		//try{
		
		let _max=6;
		
		let _pos_id=Math.floor(_id%_max);
		if(_pos_id>=_max)_pos_id=_pos_id%_max;
		
		let _space=30*(Math.floor(_id/_max));
		let _length=100+_space;
		let _pos;
		//console.log("FIDddd:"+_e_ship._pos_counter);
		//alert(_e_ship._pos_counter);
		if(_pos_id===0)_pos= _e_ship.getFrontPos(_length);
		if(_pos_id===1)_pos= _e_ship.getBackPos(_length);
		if(_pos_id===2)_pos= _e_ship.getLeftpos(_length);
		if(_pos_id===3)_pos= _e_ship.getRightPos(_length);
		if(_pos_id===4)_pos= _e_ship.getAbovePos(_length);
		if(_pos_id===5)_pos= _e_ship.getBellowPos(_length);
		
		return _pos;
		//}catch(e){alert(e.stack);}
	};
  
  /*
	Đánh dấu các vị trí để tạo đường đi cho enemy-ship
	Bấm phím O để gọi hàm _marking: đánh dấu và lưu lại vị trí hiện tại của camera
	Bấm phím P để gọi hàm _print_marking_pos_list: bật cửa sổ mới và in ra danh sách các position
	Path(đường đi) của enemy-ship là một vòng khép kín, đi tới position cuối cùng trong list sẽ
	đi về position đầu tiên
  */
  _marking(){
	  try{
	  
	  this._mark_counter++;
	  
	  const _pos=this._me.Position.clone();
	  this._marking_pos_list.push(_pos);
	  
	  this._mark_pos(_pos,this._mark_counter);
	  
	  
	  }catch(e){alert(e.stack);}
  }
  
  _mark_pos(_pos,_text){
	  const geometry = new THREE.SphereGeometry( 40, 16, 16 ); 
	  const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
      const sphere = new THREE.Mesh( geometry, material ); 
	  this._graphics.Scene.add( sphere );
	  sphere.position.copy(_pos);
	  
	  let div = document.createElement( 'div' );
	  div.innerHTML="<h1>Pos-"+_text+"</h1>";
	  div.style.fontSize="14px";
	  div.style.color="orange";
	  const _label = new CSS2DObject( div );
	  this._graphics.Scene.add(_label);
	  
	  _label.position.copy(_pos);
  }
  
  _print_marking_pos_list(){
	  let _result="[";
	  for(let i=0;i<this._marking_pos_list.length;i++){
		  const _pos=this._marking_pos_list[i];
		  const _px=parseInt(_pos.x);
		  const _py=parseInt(_pos.y);
		  const _pz=parseInt(_pos.z);
		  
		  _result+="{x:"+_px+",y:"+_py+",z:"+_pz+"}";
		  if(i<this._marking_pos_list.length-1){
			  _result+=",";
			  //_result+="</br>";
		  }
			  
	  }
	  _result+="]";
	  var newWindow = window.open("", "newTab", "width=400,height=400");
	  newWindow.document.write(_result);
  }
  
	Update_1(timeInSeconds){//overwrite
		//_universe.update(timeInSeconds);
		//this._unitMG.Update();
		
		//const _my_position=this._me._model.position;
		//_my_status_list.push(_my_position.x+"_and_"+_my_position.y+"_and_"+_my_position.z);
		
		//if(this._client)this._client.update_status();
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
		
		if(this._entities['_controls2'].engine_active===true){
			//this._entities['player'].takefuel(0.0002);
		}
		
		_px=parseInt(this._graphics.Camera.position.x);
		_py=parseInt(this._graphics.Camera.position.y);
		_pz=parseInt(this._graphics.Camera.position.z);
		_coordinates.innerHTML='<span>X: </span>'+_px+', &nbsp;&nbsp;&nbsp; <span>Y: </span>'+_py+', &nbsp;&nbsp;&nbsp; <span>Z: </span>'+_pz+'';
		
		//this._room.get_me().update_client_time();
		
		//for(let i=0;i<_status_list.length;i++){
		//}
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
			this._graphics.Scene.add(group);
			
			this._human_shape=group;
			this._human_gltf=gltf;
			
		});
		*/
	
	this._InitEventListener();
    this._LoadBackground();//universe background
	
	_universe=new Universe({scene:this._graphics.Scene,camera:this._graphics.Camera,game:this});
	_universe.create_galaxy(1);
	
	
	
	Unit.AfterDead=()=>{
		this._unitMG.update_enemy_combat_unit_list();
		this._sound.play('explosion1');
	};
	
  }
  /*
  _ChangeMode(_ship_id,_ship_package){
	delete this._entities['_controls1'];
	 delete this._entities['_controls2'];
	 
	 this._human_shape.visible=false;
	 this._ship_shape.visible=false;
	 
	  if(typeof this._human_entity =='undefined'){
		  this._human_entity=new HumanEntity(
			{model: this._human_shape, camera: this._graphics.Camera, game: this,
			is_me:true,gltf_data:this._human_gltf});
	  }
	  if(typeof this._ship_entity =='undefined'){
		  let _playerClass=this._unitMG.get_player_ship_class(this._unitMG._player_ship_id);
		
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
	  
  }
  */
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


