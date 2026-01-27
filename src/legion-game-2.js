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


let _enemy_status_list_1=new Array();//cua player enemy
let _altitude=30;//for camera
let _height=100;//chieu cao tu be mat hanh tinh toi phi thuyen
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let _main_radius=null;//khoang cach tu tam (center) hanh tinh toi phi thuyen
let _main_planet=null;
let _center_pos=null;
const _scl1=0.25;
const _scl2=9;
const _scl3=2;
let _game;
class LegionGame2{
	constructor(params){
		this._game=params.game;
		_game=this._game;
		this._universe=params.universe;
		
		this._game.let_camera_follow_target=(target_obj)=>{//overwrite
			this._game._camera_fc_1=(timeInSeconds)=>{
				const _target_pos=target_obj.Position;
				const _cam_pos=findPointOnLine(_center_pos, _target_pos, _main_radius+500);
				this._game._graphics.Camera.position.copy(_cam_pos);
				//this._game._graphics.Camera.position.set(_target_pos.x,_target_pos.y+600,_target_pos.z);
				this._game._graphics.Camera.lookAt(_target_pos);
				//get_back_point
				//get_ahead_point(length);
			};
			this._game.add_to_update_function_list(this._game._camera_fc_1);
		}
		this._game.exit_camera_from_target_orbit=(target_obj)=>{
			this._game.remove_function_from_update_list(this._game._camera_fc_1);
			const _target_pos=target_obj.Position;
			const _cam_pos=findPointOnLine(_center_pos, _target_pos, _main_radius+500);
			this._game._graphics.Camera.position.copy(_cam_pos);
			this._game._graphics.Camera.lookAt(_center_pos);
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
						
						const _u_id=this._game._warehouse2._child_ship_store.get_id_by_class_name(_class_name);
						if(_unit._mother_ship){
							//console.log("FOUND");
							_unit._mother_ship._child_ship_store.remove_unit_num_by_id(_u_id,
							this._game._parameters._standard_unit_num_in_group);
							_unit._mother_ship._child_ship_store.save_data();
						}
						
					}
				}
				//console.log("LaserShip Remain Num=>>>>"+this._game._warehouse2._child_ship_store.get_unit_num_by_id(0));
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
				//}catch(e){alert(e.toString());}
			},3000);
			
		}
	}
	init_game(){
	  this._universe.get_current_galaxy()._root.position.set(100000,100000,100000);
	  //alert(_universe.get_current_galaxy()._root.position.z);
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
			let _planet=this.goto_planet(0,0,0);
			_main_planet=_planet;
			
			
			_main_radius=_planet.get_radius()*_scl2+_height;
			_center_pos=_planet.get_world_position();
			
			const _tpos1=_planet.get_world_position();
			_tpos1.y+=_main_radius;
			const _tpos2=_planet.get_world_position();
			_tpos2.y-=_main_radius;
			
			
			this.create_formation_in_a_line_1(1,_tpos1,4,this._game._pos_list_1);
			this.create_formation_in_a_line_1(2,_tpos2,4,this._game._pos_list_2);
			
			this._game.create_opponent_units();
			
			this._orbit_controls = new OrbitControls( this._game._graphics.Camera, this._game._graphics.Renderer.domElement );
			this._orbit_controls.target.copy(_planet.get_world_position());
			this._orbit_controls.update();
			
		},1000);
		
		this.init_mouse_drag_event_listener();
		//this._game.create_unit_bar();
  }
  
  create_formation_in_a_line_1(_player_id,_position,_mother_ship_num,_list){//doi hinh hinh tron
	const _theta=Math.PI/15;
	
	for(let i=0;i<_mother_ship_num;i++){
		 //const _mother_ship=this.create_mother_ship(_player_id,1,_position);
		 //_mother_ship.rotate_about_point(_center_pos,new THREE.Vector3(1,0,0),i*_theta);
		 const _obj=new THREE.Object3D();
		 this._game._graphics.Scene.add(_obj);
		 _obj.position.copy(_position);
		 this._game._utils.rotateAboutPoint(_obj, _center_pos, new THREE.Vector3(1,0,0), i*_theta, true);
		 
			const _effect1=new Effect1({game:this._game});
			_effect1.create_system_1(_obj.position,new THREE.Vector3(0,1,0));
			_effect1._player_id=_player_id;
			
			this._game._start_position_effect_list.push(_effect1);
			
			_list.push(_obj.position.clone());
		
		 this._game._graphics.Scene.remove(_obj);
	 }
	 	
  }
  
  goto_planet(star_system_id,star_id,planet_id){
	  let _galaxy=this._universe.get_current_galaxy();
	  let _planet=_galaxy.get_planet_class(star_system_id,star_id,planet_id);
	 
	  this._game._graphics.Camera.position.copy(_planet.get_world_position());
	  this._game._graphics.Camera.position.y+=(_planet.get_radius()+4500);
	  
	  _galaxy._stop=true;
	  
	  this._lookPos=_planet.get_world_position();//alert(_star.get_world_position().x+" and "+_star.get_world_position().y+" and "+_star.get_world_position().z);
	  this._lookPos.z-=400;
	  //this._game._graphics.Camera.position.z+=600;
	  this._game._graphics.Camera.lookAt(this._lookPos);
	  
	  const _star=_galaxy.get_star_class(star_system_id,star_id);
	  const _planets=_star._planet_list;//alert(_planets.length);
	  const _theta=(Math.PI*2)/(_planets.length);
	  for(let i=0;i<_planets.length;i++){
		  const _planet=_planets[i];
		  _planet.remove_atmosphere();
		  _planet.root.scale.set(_scl2,_scl2,_scl2);
		  _planet.root.position.x=5500;
		  _planet.root.position.z=5500;
		  _planet.rotate_about_point(_planet.rotate_center_point,new THREE.Vector3(0,1,0),i*_theta, false);
		  const _ppos=_planet.get_world_position();
		  const _moons=_planet._moon_list;
		  for(let j=0;j<_moons.length;j++){
			  const _moon=_moons[j];
			  _moon.root.scale.set(_scl3,_scl3,_scl3);
			  const _mpos=_moon.get_world_position();
			  //const _d2=_ppos.distanceTo(_mpos);
			  _moon.root.position.x=250;
			  _moon.root.position.z=250;
		  }
	  }
	  
	  return _planet;
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
	 
     this._game._graphics.canvas.addEventListener('mousedown', (event)=> {
		this._mouse_down_fc(event);
     });

  }
  
  _mouse_down_fc(event){
		  if(this._game._lock_mouse){
			  return;
		  }
		  const _rate=0.9;
		  const _width=window.innerWidth;
		  const _height=window.innerHeight;
		  mouse.x = (event.clientX / _width) * 2 - 1;
		  mouse.y = -(event.clientY / _height) * 2 + 1;
		  
		  mouse.x-=mouse.x*0.2;//tọa độ chọn bị lệch chưa rõ nguyên nhân nên sử dụng tham số này
		  mouse.y-=mouse.y*0.2;
		  
		  raycaster.setFromCamera(mouse, this._game._graphics.Camera);
		  raycaster.far = 1000000;
		  var intersects = raycaster.intersectObjects(this._game._graphics.Scene.children,true);
		
		  if (intersects.length > 0) {
			
			const _inter_id=0;
			
			const _inter_pos=intersects[_inter_id].point;
			let _s_unit=null;
				for(let i=0;i<this._game._unitMG._full_unit.length;i++){
					const _unit=this._game._unitMG._full_unit[i];
					const _upos=_unit.Position;
					const _radius=50;
					if(_upos.x>_inter_pos.x-_radius&&_upos.x<_inter_pos.x+_radius&&
					  _upos.y>_inter_pos.y-_radius&&_upos.y<_inter_pos.y+_radius&&
					  _upos.z>_inter_pos.z-_radius&&_upos.z<_inter_pos.z+_radius){
						 _s_unit=_unit;
					  }
				}
				//console.log(intersects[_inter_id].object.parent._is_planet);
				if(intersects[_inter_id].object.parent._is_planet){
					//this._game._noticeBoard.add_message(this._game._selected_unit);
					
					if(this._game._selected_unit===null||this._game._selected_unit.Dead)return;
					if(this._game._selected_unit._is_mother_ship){
						
						this._game._selected_unit._target_object=null;
						this._game._selected_unit._approach_target=false;
						
						const _tpos=findPointOnLine(_center_pos, _inter_pos, _main_radius);
						this._game._selected_unit.move_along_route_on_sphere_surface(
						_center_pos, _main_radius, this._game._selected_unit.Position, _tpos,0,140)
						//this._game._selected_unit.rotate_around_point(_center_pos,_tpos,3);
						
						return;
					}
					if(this._game._selected_unit._is_great_mother_ship){
						this._game._selected_unit.move_to(_inter_pos,80);
						return;
					}
					return;
				}
				if(_s_unit!=null&&_s_unit._is_space_ship){
					//this._game._noticeBoard.add_message("FUCK");
					//let _s_unit=intersects[0];
				
					if(_s_unit._player_id===null)return;
					
					if(_s_unit._player_id===this._game._playerID){
						this._game._selected_unit=_s_unit;
					}
					else{//alert(_s_unit._player_id+" and "+_APP._playerID);
						if(this._game._selected_unit!=null&&!this._game._selected_unit.Dead){
							this._game._selected_unit._target_object=_s_unit;
							//this._game._selected_unit.move_and_approach_object=this._game._selected_unit.move_and_approach_object_2;
							//this._game._selected_unit._approach_target=true;
							this._game._selected_unit.move_and_approach_object_2(_s_unit,
							_center_pos, _main_radius, 
							_s_unit.Position,150,()=>{
								
							});
						}
					}
				}
			
		  }
	
	}
	
	moveObjectAlongCurveOnSphere(unit, position, radius, point1, point2) {    

	this.split_route_and_move(unit, position, radius, point1, point2);
	return;
	
	let centerX=position.x;
	let centerY=position.y;
	let centerZ=position.z;
           
	const midpoint=findMidpoint(point1, point2);
	
	let _extra=-10;
	
	const control_point=findPointOnLine(position,midpoint,_main_radius+_extra);
    const curve = new THREE.QuadraticBezierCurve3(
		point1,
		control_point, // Control point, adjust as needed
		point2
    );
	
	
			
    const tubeGeometry = new THREE.TubeGeometry(curve, 64, 2, 32, false);
    const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
    this._game._graphics.Scene.add(tubeMesh);	
	
	
	 // Estimate the length of the curve (tinh chieu dai su dung phuong phap tich phan)
    const numPoints = 20; //Chia thanh nhieu doan thang xap xi nhau- Increase for more accuracy
    let curveLength = 0;//De tinh chieu dai cua duong cong
    for (let i = 0; i < numPoints - 1; i++) {
        const t1 = i / numPoints;
        const t2 = (i + 1) / numPoints;
        const p1 = curve.getPoint(t1);
        const p2 = curve.getPoint(t2);
        curveLength += p1.distanceTo(p2);
		//console.log("Distance: "+p1.distanceTo(p2));
    }//console.log('Curve Length:', curveLength);
	
	let _points = [];//luu toa do cac point vao 1 mang
	for (let i = 0; i < numPoints; i++) {
		const t = i / (numPoints - 1);
		const point = curve.getPoint(t);
		_points.push(point);
	}
	
	let _counter=0;
	let _speed=60;
	let _fc=()=>{
		if(_counter<_points.length)
			unit.move_to_position(_points[_counter],_speed,_fc);
		_counter++;
	};
	//unit.move_to_position(_points[_counter],_speed,_fc);
}
}
export {LegionGame2}


//tham số nhập vào là điểm P1(x,y,z) và điểm P2(x,y,z) và Length là một số nguyên, 
//kết quả trả về là điểm P3 nằm trên đường thẳng đi qua P1 và P2 theo hướng từ P1 tới P2 
//và điểm P3 nằm cách điểm P1 một khoảng có chiều dài là Length
function findPointOnLine(p1, p2, length) {
    // Tính vector hướng từ P1 đến P2
    const directionVector = {
        x: p2.x - p1.x,
        y: p2.y - p1.y,
        z: p2.z - p1.z
    };

    // Tính chiều dài của vector hướng
    const directionLength = Math.sqrt(directionVector.x ** 2 + directionVector.y ** 2 + directionVector.z ** 2);

    // Chuẩn hóa vector hướng
    const normalizedDirection = {
        x: directionVector.x / directionLength,
        y: directionVector.y / directionLength,
        z: directionVector.z / directionLength
    };

    // Tính tọa độ của điểm P3
    const p3 = new THREE.Vector3(
        p1.x + normalizedDirection.x * length,
        p1.y + normalizedDirection.y * length,
        p1.z + normalizedDirection.z * length
    );

    return p3;
}

// Hàm tạo điểm P3 nằm giữa P1 và P2
function findMidpoint(p1, p2) {
    const midpoint = new THREE.Vector3();
    midpoint.x = (p1.x + p2.x) / 2;
    midpoint.y = (p1.y + p2.y) / 2;
    midpoint.z = (p1.z + p2.z) / 2;
    return midpoint;
}
