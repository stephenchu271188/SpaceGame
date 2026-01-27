import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/controls/OrbitControls.js';

import {math} from './math.js';
import {visibility} from './visibility.js';

import {Galaxy} from './core/galaxy.js';
import {Universe} from './core/universe.js';
import {SphericalObject} from './core/spherical-object.js';

import {Unit} from './units/unit.js';

import {UnitMGLegionGame} from './unit-mg-legion-game.js';

import {Effect1} from './legion-game/effect-1.js';
import {Effect2} from './legion-game/effect-2.js';

import {LaserShip1} from './units/laser-ship-1.js';
import {FlashShip1} from './units/flash-ship-1.js';
import {RocketShip1} from './units/rocket-ship-1.js';

import {ChildShipStore} from './child-ship-store.js';

import {Room} from './MultiPlayerCore/room.js';

//import {Meteorite} from './core/meteorite.js';

let _enemy_status_list_1=new Array();//cua player enemy
let _altitude=30;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
const _scl1=0.5;
const _scl2=5;
const _scl3=2;
let _main_star=null;
class LegionGame1{
	constructor(params){
		this._game=params.game;
		this._params=params;
		
		this._unit_id_list=params.unit_id_list;//my ships ids
		this._universe=params.universe;
		this._game.exit_camera_from_target_orbit=(target_obj)=>{
			this._game.remove_function_from_update_list(this._game._camera_fc_1);
			
			this.reset_camera(_main_star.get_world_position());
		}
		
		this._game.end_game=(_win)=>{//overwrite
			setTimeout(()=>{
				//try{
				this._game._StopRender();
				
				for(let i=0;i<this._game._dead_list.length;i++){
					const _item=this._game._dead_list[i];
					const _unit=_item[0];
					const _class_name=_item[1];
					const _player_id=_item[2];
					if(_player_id===this._game._playerID){
						if(_class_name===LaserShip1.name){
							
						}
						if(_class_name===FlashShip1.name){
							
						}
						if(_class_name===RocketShip1.name){
							
						}
						if(_unit._mother_ship){//_unit o day la child-unit
						const _u_id=this._game._warehouse2._child_ship_store.get_id_by_class_name(_class_name);
						_unit._mother_ship._child_ship_store.remove_unit_num_by_id(_u_id,
							this._game._parameters._standard_unit_num_in_group);
							_unit._mother_ship._child_ship_store.save_data();
						}
						//this._game._warehouse2._child_ship_store.remove_unit_num_by_id(_u_id,
							//this._game._parameters._standard_unit_num_in_group);
					}
				}
				//console.log("LaserShip Remain Num=>>>>"+this._game._warehouse2._child_ship_store.get_unit_num_by_id(0));
				if(this._game._game_mode===this._game._parameters._game_mode_PvC){
					if(_win){
						if(this._game._game_mode===this._game._parameters._game_mode_PvC){
							this._game._score_data.finish_current_level(2);
							this._game._score_data.save_data();
						}
						this._game.createMessageBox("You Win","Finish Level",()=>{
							location.href="./legion-game-option.html";
						});
					}
					else{
						this._game.show_notification("COMPUTER WIN");
					}
				}
				if(this._game._game_mode===this._game._parameters._game_mode_PvP){
					if(_win){
						this._game.createMessageBox("You Win","",()=>{
							location.href="./legion-game-option.html";
						});
					}
					else{
						this._game.createMessageBox("Enemy Win","",()=>{
							location.href="./legion-game-option.html";
						});
					}
				}
				//}catch(e){alert(e.toString());}
			},3000);
			
		}
	}
	init_game(){
	  this._universe.get_current_galaxy()._root.position.set(100000,100000,100000);
	  
	  
	  this._universe.get_current_galaxy()._root.visible=false;
	  
	  
	  
	  const min_planet_num=1;
		const _randomStarsystem=this._universe.get_current_galaxy().get_random_starsystem_data_with_condition_1(min_planet_num);
		if(_randomStarsystem===null){
			alert("Something went wrong. Can not find star system!");
			return false;//ko co ket qua
		}
	  const _data=_randomStarsystem[0];//alert(_data.position[0]);
		const _system_id=_data.id;
		const _system_array_id=_randomStarsystem[1];//id trong array
		const _star_id=_randomStarsystem[2];//id(trong array starList) cua star co chua so luong planet nhu yeu cau
		
		const _pos=_data.starList[0].position;
		const _starradius=_data.starList[0].radius*this._game._config.magnification_factor;
		//alert();
		const _px=_pos[0]*this._game._config.magnification_factor;
		const _py=_pos[1]*this._game._config.magnification_factor;
		const _pz=_pos[2]*this._game._config.magnification_factor;//alert(_px);alert(_py);alert(_pz);
		//this._game._entities['player']._model.position.set(_px,_py+_starradius+100,_pz);
		this._universe.get_current_galaxy().create_all_star_systems();
		
		const _result=this._universe.get_current_galaxy().get_random_starsystem_class_with_condition_1(min_planet_num);
		const _star_system=_result[0];
		const _star=_result[1];
		const _planet1=_star._planet_list[0];
		const _planetPos1=_planet1.get_world_position();
		
		this._game._great_mother_ship_list=new Array();
		setTimeout(()=>{
			const _star=this.goto_star(0,0);
			
			
			let _point=_star.get_world_position();
			_point.y+=(_star.get_radius()*_scl1+_altitude);
			let _p1=_point.clone();
			_p1.x+=100;
			let _p2=_point.clone();
			_p2.x-=100;
			let _p3=_point.clone();
			_p3.z+=100;
			this.create_plane(_p1,_p2,_p3);
			
			let _terrain_pos=new THREE.Vector3().copy(_point);
			_terrain_pos.y-=20;
			let _size=3000;
			let _segments=5;
			let _max_height=1;
			let _terrain1=new TerrainGenerator(this._game,_size,_segments,_max_height);
			_terrain1._mesh.position.copy(_terrain_pos);
			let _terrain2=new TerrainGenerator(this._game,_size,_segments,_max_height);
			_terrain2._mesh.position.copy(_terrain_pos);
			_terrain2._mesh.position.x-=_size;
			_terrain2._mesh.rotation.y=Math.PI;
			/*
			var geometry = new THREE.PlaneGeometry(4500, 4500);
			var textureLoader = new THREE.TextureLoader();
			var texture = textureLoader.load('./src/legion-game/img/bg1.jpg');
			var material = new THREE.MeshBasicMaterial({ map: texture });
			var plane = new THREE.Mesh(geometry, material);
			this._game._graphics.Scene.add(plane);
		    plane.position.copy(_point);
			plane.rotation.x=-Math.PI/2;
			plane.position.y-=10;
			*/
			
			//this.goto_planet(0,0,0);
			const _tpos1=_star.get_world_position();
			_tpos1.x-=500;
			_tpos1.y+=(_star.get_radius()*_scl1+_altitude);
			_tpos1.z+=300;
			const _tpos2=_star.get_world_position();
			_tpos2.x+=500;
			_tpos2.y+=(_star.get_radius()*_scl1+_altitude);
			_tpos2.z-=300;
			
			let _unit1,_unit2;
			//alert(this._unit_id_list);
			if(this._game._game_mode===this._game._parameters._game_mode_PvC){
				_unit1=this.create_unit_group_1(this._game._my_player_id,_tpos1,this._game._pos_list_1);
				_unit1.init_mother_ships(this._unit_id_list);
			
				const level_infor=this._params.level_infor;
				const type_list=level_infor.get_current_unit_types();
				const mother_ship_id_list=this._game._parameters.convert_types_list_to_ship_id_list(type_list);
				//alert(mother_ship_id_list);
				//alert(this._unit_id_list);
				  _unit2=this.create_unit_group_1(this._game._enemy_player_id,_tpos2,this._game._pos_list_2);
				  _unit2.init_mother_ships(mother_ship_id_list);
			}
			if(this._game._game_mode===this._game._parameters._game_mode_PvP){
					//Unit._lock_be_damage=true;//player-ships se ko bi mat' HP khi bi enemy-ship tan' cong
				  this._game._room=new Room({game:this._game});
				  let _init_data="";//thong tin ve type va so luong child-ship cua cac mother-ship de gui len server
				  for(let i=0;i<this._unit_id_list.length;i++){
					  const _t_uid=this._unit_id_list[i];
					  const _type_id=this._game._parameters.get_mother_ship_type_id_by_ship_id(_t_uid);
					  const _create_fc=this._game._warehouse2.get_create_mother_ship_fc(_type_id);
					  const _mother_ship=_create_fc(new THREE.Vector3(0,0,0));//create mother-ship o day chi de lay' thong tin ve child-ship, ko add vao scene
							_mother_ship.set_mother_ship_id(_t_uid);
							_mother_ship.load_child_ship_store();
							
					  const _most_type=_mother_ship._child_ship_store.get_the_most_numerous_type();
					  const _most_num=_mother_ship._child_ship_store.get_the_most_numerous_num();
					  
					  _init_data+=_t_uid+"and"+_most_type+"and"+_most_num;
					  if(i<this._unit_id_list.length)
						  _init_data+="add";
				  }
				  //alert(_init_data);
				  this._game._room.init_multi_player_mode(_init_data);
				  this._game.start_multi_player_game=(_enemy_init_data)=>{
					  let _p1,_p2,_gp1,_gp2;
					  let _is_key=this._game._room.get_me().is_key();
					  if(_is_key===true){
						_p1=this._game._pos_list_1;
						_p2=this._game._pos_list_2;
						_gp1=_tpos1;
						_gp2=_tpos2;
					  }
					  if(_is_key===false){
						_p1=this._game._pos_list_2;
						_p2=this._game._pos_list_1;
						_gp1=_tpos2;
						_gp2=_tpos1;
					  }
					  _unit1=this.create_unit_group_1(this._game._my_player_id,_gp1,_p1);
					  _unit1.init_mother_ships(this._unit_id_list);
					  
					  let _enemy_unit_id_list=new Array();
					  let _child_ship_stores=new Array();
					  //let _enemy_unit_child_type=new Array();
					  //let _enemy_unit_child_num=new Array();
					  for(let i=0;i<_enemy_init_data.length;i++){
						const _t_element=_enemy_init_data[i];
						if(!isNaN(_t_element["mother-ship-id"])){
							_enemy_unit_id_list.push(_t_element["mother-ship-id"]);
							//_enemy_unit_child_type.push(_t_element["child-type"]);
							//_enemy_unit_child_num.push(_t_element["child-num"]);
							let _t_child_ship_store=new ChildShipStore({game:this._game}); 
							_t_child_ship_store.set_unit_num_by_id(_t_element["child-type"],_t_element["child-num"]);
							console.log("ChildType:"+_t_element["child-type"]);
							console.log("ChildNum:"+_t_element["child-num"]);
							_child_ship_stores.push(_t_child_ship_store);
						}
							
					  }
					  //alert(_enemy_unit_id_list);
					  _unit2=this.create_unit_group_1(this._game._enemy_player_id,_gp2,_p2);
					  _unit2.init_mother_ships(_enemy_unit_id_list,_child_ship_stores);
					  
					  this._my_mother_ships=new Array();
					  this._enemy_mother_ships=new Array();
					  
					  let _my_units=this._game._unitMG.get_all_unit(this._game._my_player_id);
					  for(let i=0;i<_my_units.length;i++){
						  const _unit=_my_units[i];
						  if(_unit._is_mother_ship||_unit._is_great_mother_ship){
							  this._my_mother_ships.push(_unit);
						  }
					  }
					  
					  let _enemy_units=this._game._unitMG.get_all_unit(this._game._enemy_player_id);
					  for(let i=0;i<_enemy_units.length;i++){
						  const _unit=_enemy_units[i];
						  if(_unit._is_mother_ship||_unit._is_great_mother_ship){
							  this._enemy_mother_ships.push(_unit);
							  //_unit.BeforeDestroy=()=>{
								  
							  //};
						  }
					  }
				  };
				  
				  let _mother_ships_status;
				  this._game._room.get_me().update_status=()=>{//overwrite, update position+status cua cac playership len server
					  _mother_ships_status="";
					  if(!this._my_mother_ships)return;
					  for(let i=0;i<this._my_mother_ships.length;i++){
						  const _unit1=this._my_mother_ships[i];
						  const _pos=_unit1._model.position;
						  
						  const _unit2=this._enemy_mother_ships[i];
						  const _hp=_unit2._health;
							
							/*Cap Nhat Toa Do Cac Ships Cua Minh*/
						  _mother_ships_status+=(i+"and"+parseInt(_pos.x)+"with"+parseInt(_pos.y)+"with"+parseInt(_pos.z));
						   
						  _mother_ships_status+="plus";
						  
						  /*Cap Nhat HP Cua Enemy*/
						  _mother_ships_status+=(i+"and"+_hp);
						  
						  if(i<this._my_mother_ships.length-1)
							  _mother_ships_status+="add";
					  }
					  
					  this._game._room.get_me()._client.update_status(_mother_ships_status);
				  };
				  this._game.add_to_function_list_4(()=>{
					  this._game._room.get_me().update_status();//status của enemy gửi về từ server sẽ được phân tích trong game-client.js(đã phân theo từng game)
					  this._game._room.get_me().update_client_time();
				  });
				  this._game._update_other_player_status=(_status_data_str)=>{//goi tu game-client.js
						
					  const _items=_status_data_str.split("add");
					  for(let i=0;i<_items.length;i++){
						  const _elements=_items[i].split("plus");
						  
						  const _unit1=this._enemy_mother_ships[i];
						  const _unit2=this._my_mother_ships[i];
						  
						  if(!_unit1){
							  
						  }
						  else{//update vi tri cac ships cua doi' phuong
							  if(_unit1.Dead){
								
							  }
							  else{
								  const _sub_elements1=_elements[0].split("and");
								  const _u_id=parseInt(_sub_elements1[0]);
								  const _posArr=_sub_elements1[1].split("with");
								  _unit1._model.position.set(parseInt(_posArr[0]),parseInt(_posArr[1]),parseInt(_posArr[2]));
							  }
							  
						  }
						  
						  /*
							Phương pháp truyền thông tin HP của các unit giữa 2 player hiện tại:
								Ở mỗi player-computer vẫn để các unit attack và TakeDamage như bình thường
								Nhưng đồng thời gửi thông tin lẫn nhau giữa 2 player
								*Cụ thể: ở máy player1 thì gửi thông tin HP của các unit của player2 cho player 2 cập nhật
										 tương tự ở máy player2 thì gửi HP của player1 cho player1 update
								*Ví dụ: Ở máy player1 cho dù unit-1 của player1 đang có HP là 100
										Nhưng thông tin HP của unit-1 gửi từ máy player 2 là 50 thì 
										máy player1 cũng sẽ set HP của unit-1 là 50
								*Sau này cần sử lý tiếp ở Server: dựa vào thời gian update status của cả 2 player để quyết
								định xem HP của unit là bao nhiêu
						  */
						  if(!_unit2||_unit2.Dead){
							   
						  }
						  else{//update hp cua player-ships
							  const _sub_elements2=_elements[1].split("and");
							  const _u_id=parseInt(_sub_elements2[0]);
							  const _u_hp=parseInt(_sub_elements2[1]);
							  
							  _unit2._health=_u_hp;
							  if(_unit2.Dead){
								  //_unit2._model.visible=false;
								  _unit2.SelfDestroy();
							  }
						  }
						  
					  }
				  };
			}
			
			let _center_point=_star.get_world_position();
			_center_point.y+=(_star.get_radius()*_scl1+_altitude);
			_unit1._update_1_center_point=_center_point;
			_unit2._update_1_center_point=_center_point;
			try{
			for(let i=0;i<_unit1._mother_ships.length;i++){
				const _t_unit=_unit1._mother_ships[i];
				const _look_pos=this._game._utils.calculateSymmetricPoint(_t_unit.Position,_unit2.Position);
				_t_unit._model.lookAt(_look_pos);
			}
			for(let i=0;i<_unit2._mother_ships.length;i++){
				const _t_unit=_unit2._mother_ships[i];
				const _look_pos=this._game._utils.calculateSymmetricPoint(_t_unit.Position,_unit1.Position);
				_t_unit._model.lookAt(_look_pos);
			}
			}catch(e){alert(e.stack);}
			//const controls = new OrbitControls( this._graphics.Camera, this._graphics.Renderer.domElement );
			//controls.target.copy(_star.get_world_position());
			//controls.update();
		},1000);
		
		 document.addEventListener('keydown', (event)=> {
			 const _speed=8;
			switch(event.key) {
				case 'ArrowUp':
					this.move_view(0,0,_speed,0);
				break;
				case 'ArrowDown':
					this.move_view(0,0,0,_speed);
				break;
				case 'ArrowLeft':
					this.move_view(_speed,0,0,0);
				break;
				case 'ArrowRight':
					this.move_view(0,_speed,0,0);
				break;
			}
		});
		
		this.init_mouse_drag_event_listener();
		
		//let _meteorite=new Meteorite({game:this._game});
		//_meteorite.create(new THREE.Vector3(102250,100873,101450));
  }
  
  move_view(_left,_right,_up,_down){
	  this._lookPos.x+=_left;
	  this._game._graphics.Camera.position.x+=_left;
	  this._lookPos.x-=_right;
	  this._game._graphics.Camera.position.x-=_right;
	  
	  this._lookPos.z-=_up;
	  this._game._graphics.Camera.position.z-=_up;
	  this._lookPos.z+=_down;
	  this._game._graphics.Camera.position.z+=_down;
	  
	  this._game._graphics.Camera.lookAt(this._lookPos);
	 
  }
  
  create_plane(P1,P2,P3){//tao mat phang di qua 3 diem
	  var planeGeometry = new THREE.PlaneGeometry(20000, 20000); 
	  var planeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, 
	  side: THREE.DoubleSide, transparent: true, opacity: 0.01 });
      var plane = new THREE.Mesh(planeGeometry, planeMaterial);

	  var triangle = new THREE.Triangle(P1, P2, P3);
      var normalVector = triangle.normal();
      plane.lookAt(normalVector);
      plane.position.copy(triangle.midpoint());
	  this._game._graphics.Scene.add(plane);
	  
	  plane._is_main_plane=true;
	  
	  //document.addEventListener('click', _mouse_down_fc , false);
	  
  }
  
  create_unit_group_1(player_id,position,_list){//alert(position.x+" and "+position.y+" and "+position.z);
	  const _unit=this._game._unitMG.create_great_mother_ship(position);
	  //_unit._direct=_direct;
	  _unit._player_id=player_id;
	  //_unit.init_mother_ships(_unit_id_list);
	  this._game._graphics.Scene.add(_unit._model);
	  
	  this._game._great_mother_ship_list.push(_unit);
	  
	  _list.push(_unit.Position.clone());
	  
	  return _unit;
  }
  
  reset_camera(_lookPos){
	  /*
	  this._lookPos=_lookPos.clone();
	  this._lookPos.z-=400;
	  this._cameraZPos=102350;
	  this._game._graphics.Camera.position.z=this._cameraZPos;
	  this._game._graphics.Camera.lookAt(this._lookPos);
	  */
	  this._game._graphics.Camera.position.copy(_main_star.get_world_position());
	  //this._camY=
	  this._game._graphics.Camera.position.y+=(_main_star.get_radius()+_altitude+400);//102116
	  this._lookPos=_main_star.get_world_position();
	  this._lookPos.z-=200;
	  //this._game._graphics.Camera.position.copy();
	  this._game._graphics.Camera.position.z+=600;
	  this._game._graphics.Camera.lookAt(this._lookPos);
  }
  
  
  goto_star(star_system_id,star_id){
	 
	  let _galaxy=this._universe.get_current_galaxy();
	  let _star=_galaxy.get_star_class(star_system_id,star_id);
	  _main_star=_star;
	  
	  _galaxy._stop=false;
	  
	  
	  this.reset_camera(_main_star.get_world_position());
	  
	  _star.root.scale.set(_scl1,_scl1,_scl1);
	  const _planets=_star._planet_list;//alert(_planets.length);
	  const _theta=(Math.PI*2)/(_planets.length);
	  for(let i=0;i<_planets.length;i++){
		  const _planet=_planets[i];
		  _planet.root.scale.set(_scl2,_scl2,_scl2);
		  _planet.root.position.x=3500;
		  _planet.root.position.z=3500;
		  _planet.rotate_about_point(_planet.rotate_center_point,new THREE.Vector3(0,1,0),i*_theta, false);
		  const _ppos=_planet.get_world_position();
		  const _moons=_planet._moon_list;
		  for(let j=0;j<_moons.length;j++){
			  const _moon=_moons[j];
			  _moon.root.scale.set(_scl3,_scl3,_scl3);
			  const _mpos=_moon.get_world_position();
			  //const _d2=_ppos.distanceTo(_mpos);
			  _moon.root.position.x=150;
			  _moon.root.position.z=150;
		  }
	  }
	  
	  return _star;
		
  }
  goto_planet(star_system_id,star_id,planet_id){
	  let _galaxy=this._universe.get_current_galaxy();
	  let _planet=_galaxy.get_planet_class(star_system_id,star_id,planet_id);
	 
	  this._game._graphics.Camera.position.copy(_planet.get_world_position());
	  this._game._graphics.Camera.position.y+=(_planet.get_radius()+4500);
	  
	  _galaxy._stop=false;
	  
	  this._game._graphics.Camera.lookAt(_planet.get_world_position());
	  
  }
  goto_moon(star_system_id,star_id,planet_id,moon_id){
	  let _galaxy=this._universe.get_current_galaxy();
	  let _moon=_galaxy.get_moon_class(star_system_id,star_id,planet_id,moon_id);
	  
	  this._game._graphics.Camera.position.copy(_moon.get_world_position());
	  this._game._graphics.Camera.position.y+=(_moon.get_radius()+50);
	
	  _galaxy._stop=false;
	  this._game._graphics.Camera.lookAt(_moon.get_world_position());
  }
  
  init_mouse_drag_event_listener(){
	  let isDragging = false;
	  let initialX, initialY;
	  let offsetX = 0;
	  let offsetY = 0;
	  let firstX=null;
	  let firstY=null;
	  this.max_length=0;//su dung de kiem tra xem co mouse move de di chuyen view ko hay select unit

     // Bắt đầu kéo khi click chuột xuống
     this._game._mouse_div.addEventListener('mousedown', (event)=> {
		 //event.preventDefault();
		 this.max_length=0;
     isDragging = true;
     initialX = event.clientX;
     initialY = event.clientY;
	 firstX=event.clientX;
	 firstY=event.clientY;
     });

	// Theo dõi sự kiện kéo chuột
	this._game._mouse_div.addEventListener('mousemove', (event)=> {
		//event.preventDefault();
    if (isDragging) {
       this.deltaX = event.clientX - initialX;
      this.deltaY = event.clientY - initialY;

	  this.deltaX*=1.5;
	  this.deltaY*=1.5;

	  this.move_view(-this.deltaX,0,0,0);
	  this.move_view(0,0,this.deltaY,0);
	  
	  let _length=event.clientX-firstX;
	  if(event.clientY-firstY>_length)_length=event.clientY-firstY;
	  if(_length>this.max_length)this.max_length=_length;
	  
      // Lưu trữ tọa độ mới cho lần click tiếp theo
      initialX = event.clientX;
      initialY = event.clientY;

      //console.log('Vị trí hiện tại: X = ' + deltaX + ', Y = ' + deltaY);
    }
	});

	// Kết thúc kéo khi nhả chuột
	this._game._mouse_div.addEventListener('mouseup', (event)=> {
		//event.preventDefault();
		
		if(isDragging)
		if(this.max_length<1)//neu ko co dich chuyen chuot -> select unit/select position
			this._mouse_down_fc(event);
		//this.max_length=0;
		this.deltaX=0;
		this.deltaY=0;
		
		isDragging = false;
	});
  }
  
  _mouse_down_fc(event){
	  if(this._game._lock_mouse){
			  return;
		  }
	//try{
		  //event.preventDefault();
		
			//mouse = new THREE.Vector2();
		  const _rate=0.9;
		  const _width=window.innerWidth;
		  const _height=window.innerHeight;
		  mouse.x = (event.clientX / _width) * 2 - 1;
		  mouse.y = -(event.clientY / _height) * 2 + 1;
		  
		  mouse.x-=mouse.x*0.2;//tọa độ chọn bị lệch chưa rõ nguyên nhân nên sử dụng tham số này
		  mouse.y-=mouse.y*0.2;
		  
		  raycaster.setFromCamera(mouse, this._game._graphics.Camera);
		  raycaster.far = 10000;
		  var intersects = raycaster.intersectObjects(this._game._graphics.Scene.children);
			//if(intersects.length>1)alert("haha");
		  if (intersects.length > 0) {
			const _object=intersects[0].object;//alert(_object._is_main_plane);
			/*
			const geometry = new THREE.SphereGeometry( 50, 32, 16 ); 
			const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
			const sphere = new THREE.Mesh( geometry, material );
			this._game._graphics.Scene.add(sphere);
			sphere.position.copy(intersects[0].point);
			//_APP._graphics._outlinePass.selectedObjects = [sphere];
			*/
			if(this._2D_screen_icon_1||this._2D_screen_icon_1!=null){
							this._2D_screen_icon_1.remove();
						}
			if(_object._is_main_plane===true){
				var selectedPoint = intersects[0].point;
				
				let _s_unit=null;
				let _units=new Array();
				for(let i=0;i<this._game._unitMG._full_unit.length;i++){
					const _unit=this._game._unitMG._full_unit[i];
					const _upos=_unit.Position;
					const _radius=80;
					if(!_unit._is_mother_ship&&!_unit._is_great_mother_ship)continue;
					
					if(_upos.x>selectedPoint.x-_radius&&_upos.x<selectedPoint.x+_radius&&
					  _upos.y>selectedPoint.y-_radius&&_upos.y<selectedPoint.y+_radius&&
					  _upos.z>selectedPoint.z-_radius&&_upos.z<selectedPoint.z+_radius){
						 //_s_unit=_unit;
						 _units.push(_unit);
					  }
				}
				
				//let _ts_unit=null;
				for(let i=0;i<_units.length;i++){
					if(_s_unit===null){
						_s_unit=_units[0];
						continue;
					}
					let _t_unit=_units[i];
					if(_t_unit.Position.distanceTo(selectedPoint)<_s_unit.Position.distanceTo(selectedPoint))
						_s_unit=_t_unit;
				}
				
				if(_s_unit===null){//ko click vao unit nao
				
					if(this._game._selected_unit===null||this._game._selected_unit.Dead)return;
					if(this._game._selected_unit._is_mother_ship){
						
						this._game._selected_unit._target_object=null;
						this._game._selected_unit._approach_target=false;
						this._game._selected_unit.move_to(selectedPoint,60);
						//try{
						
						this._2D_screen_icon_1=document.createElement("img");
						this._2D_screen_icon_1.style.position="absolute";
						this._2D_screen_icon_1.style.width="35px";
						this._2D_screen_icon_1.style.height="35px";
						this._2D_screen_icon_1.style.transform="rotate(90deg)";
						//this._2D_screen_icon_1.style.visibility="hidden";
						this._2D_screen_icon_1.src="./resources/gif/arrow-2.gif";
						
						let vector = new THREE.Vector3();
						let x,y;
						let screen_w=window.innerWidth,
						screen_h=window.innerHeight;
						let _t_point=selectedPoint.clone();
						
						_t_point.project(this._game._graphics.Camera);
						vector.copy(_t_point);
						x = (vector.x + 1) / 2 * window.innerWidth;
						y = (1 - vector.y) / 2 * window.innerHeight;
						x-=100;
						y+=5;
						this._2D_screen_icon_1.style.left=x+"px";
						this._2D_screen_icon_1.style.top=y+"px";
						document.body.appendChild(this._2D_screen_icon_1);
						//}catch(e){alert(e.toString());}
						return;
					}
					if(this._game._selected_unit._is_great_mother_ship){
						this._game._selected_unit.move_to(selectedPoint,80);
						return;
					}
					return;
				}
				else{
					//if(_s_unit._player_id===null)return;
					
					if(_s_unit._player_id===this._game._playerID){
						this._game._selected_unit=_s_unit;
					}
					else{//alert(_s_unit._player_id+" and "+_APP._playerID);
						if(this._game._selected_unit!=null&&!this._game._selected_unit.Dead){
							this._game._selected_unit._target_object=_s_unit;
							this._game._selected_unit._approach_target=true;
						}
					}
				}
				
			}
			
		  }
		//}catch(e){alert(e.stack);}
}
}

class TerrainGenerator {
    constructor(game,size, segments, maxHeight) {
		this._game=game;
        this.size = size;
        this.segments = segments;
        this.maxHeight = maxHeight;

        this.generateTerrain();
    }

    generateTerrain() {
        var geometry = new THREE.PlaneGeometry(this.size, this.size, this.segments, this.segments);
        geometry.rotateX(-Math.PI / 2);

        // Sử dụng Perlin noise để tạo địa hình
        for (var i = 0; i < geometry.vertices.length; i++) {
            var vertex = geometry.vertices[i];
            vertex.y = this.maxHeight * Math.random(); 
        }
		
		var textureLoader = new THREE.TextureLoader();
        var texture = textureLoader.load('./resources/textures/8.jpg'); 

		
        // Tạo vật liệu và mesh
        var material = new THREE.MeshBasicMaterial({wireframe: false,map:texture }); 
        var terrain = new THREE.Mesh(geometry, material);
        this._mesh=terrain;
        // Thêm terrain vào scene
        this._game._graphics.Scene.add(terrain);
    }
}


export {LegionGame1}
