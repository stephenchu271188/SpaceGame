import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/loaders/GLTFLoader.js';

import {UnitMG} from './unit-mg.js';

import {GreatMotherShip} from './units/great-mother-ship.js';
import {MotherShip} from './units/mother-ship.js';
import {MotherRocketShip} from './units/mother-rocket-ship.js';
import {MotherFlashShip} from './units/mother-flash-ship.js';
import {MotherFreezingShip} from './units/mother-freezing-ship.js';
import {MotherHeatingShip} from './units/mother-heating-ship.js';

import {LaserShip1} from './units/laser-ship-1.js';
import {FlashShip1} from './units/flash-ship-1.js';
import {RocketShip1} from './units/rocket-ship-1.js';
//import {RocketShip1Missile1} from './units/rocket-ship-1-missile-1.js';
import {Missile1} from './units/missile-1.js';

let _current_target=null;
let _unitMG_legionGame;

class UnitMGLegionGame extends UnitMG{
	
	constructor(params){
		super(params);
		_unitMG_legionGame=this;
		this._mother_ships=new Array();
		this._great_mother_ships=new Array();
		//_game=this._game;
		//this.init_status_container();
		
		this._lock_update_status=true;
		this._game.add_to_function_list_3(()=>{
			if(this._lock_update_status)return;
			this.update_status();
		});
		
	}
	
	init_url_list(){//overwrite
		this._url_list=[
		
					   //["lasergun-1","./resources/models/Weapon/infinite_armament_blaster/scene.gltf"],
					   //["plasmagun-1","./resources/models/Weapon/plasma_rifle/scene.gltf"],
					   
					   //["cannon1","./resources/models/Cannon/cannon1/scene.gltf"],
					   //["cannon2","./resources/models/Cannon/cannon2/scene.gltf"],
					   
					   ["spaceship-1","./resources/models/SpaceShip/x-wing/scene.gltf"],
					   //["spaceship-2","./resources/models/SpaceShip/spaceship-2/scene.gltf"],//CARTOON
					   ["spaceship-3","./resources/models/SpaceShip/spaceship-3/scene.gltf"],//OK
					   ["spaceship-4","./resources/models/SpaceShip/spaceship-4/scene.gltf"],//GOOD
					   ["spaceship-5","./resources/models/SpaceShip/spaceship-5/scene.gltf"],//GOOD FOR ENEMY
					   ["spaceship-6","./resources/models/SpaceShip/spaceship-6/scene.gltf"],//OK FOR ENEMY
					   ["spaceship-7","./resources/models/SpaceShip/spaceship-7/scene.gltf"],//CARTOON
					   //["spaceship-8","./resources/models/SpaceShip/spaceship-8/scene.gltf"],//GOOD FOR ENEMY
					   ["spaceship-9","./resources/models/SpaceShip/spaceship-9/scene.gltf"],//GOOD
					   ["spaceship-10","./resources/models/SpaceShip/spaceship-10/scene.gltf"],//GOOD
					   ["spaceship-11","./resources/models/SpaceShip/red_ranger_x_wing/scene.gltf"],
					   ["spaceship-12","./resources/models/SpaceShip/small_space_ship-low_poly/scene.gltf"],
					   ["spaceship-13","./resources/models/SpaceShip/low_poly_spaceship/scene.gltf"],
					   ["spaceship-14","./resources/models/SpaceShip/low_poly_spaceship-2/scene.gltf"],
					   ["spaceship-15","./resources/models/SpaceShip/low_poly_spaceship-3/scene.gltf"],
					   //["spaceship-16","./resources/models/SpaceShip/low_poly_spaceship_110/scene.gltf"],
					   //["spaceship-17","./resources/models/SpaceShip/low_poly_spaceship_210/scene.gltf"],
					   //["spaceship-18","./resources/models/SpaceShip/low_poly_spaceship_410/scene.gltf"],
					   //["spaceship-19","./resources/models/SpaceShip/abandon-spaceship/scene.gltf"],
					   //["spaceship-20","./resources/models/SpaceShip/stylised_spaceship/scene.gltf"],
					   //["spaceship-21","./resources/models/SpaceShip/organic_alien_spaceship/scene.gltf"],
					   //["spaceship-22","./resources/models/SpaceShip/guardians_of_the_galaxy_milano_mandela_spaceship/scene.gltf"],
					   //["spaceship-23","./resources/models/SpaceShip/guardians_of_the_galaxy_starblaster_spaceship/scene.gltf"],
					   //["spaceship-24","./resources/models/SpaceShip/guardians_of_the_galaxy_warbird_spaceship/scene.gltf"],
					   //["spaceship-25","./resources/models/SpaceShip/spaceship_version_0/scene.gltf"],
					   //["spaceship-26","./resources/models/SpaceShip/safine/scene.gltf"],
					   //["spaceship-27","./resources/models/SpaceShip/nave_espacial-spaceship_lowpoly/scene.gltf"],
					   //["spaceship-28","./resources/models/SpaceShip/kezrek_g1_spaceship/scene.gltf"],
					   //["spaceship-29","./resources/models/SpaceShip/zume-3_uss_galileo/scene.gltf"],
					   //["spaceship-30","./resources/models/SpaceShip/spaceship-lowpoly/scene.gltf"],
					   //["spaceship-31","./resources/models/SpaceShip/spaceship_model/scene.gltf"],
					   //["spaceship-32","./resources/models/SpaceShip/weekly_challenge_25_spaceship/scene.gltf"],
					   //["spaceship-33","./resources/models/SpaceShip/spaceship_medium_fighter/scene.gltf"],
					   //["spaceship-34","./resources/models/SpaceShip/spaceship_08/scene.gltf"],
					   //["spaceship-35","./resources/models/SpaceShip/spaceship-09/scene.gltf"],
					   //["spaceship-36","./resources/models/SpaceShip/spaceship-05/scene.gltf"],
					   //["spaceship-37","./resources/models/SpaceShip/spaceship-07/scene.gltf"],
					   //["spaceship-38","./resources/models/SpaceShip/custom_3d_spaceship/scene.gltf"],
					   ["spaceship-39","./resources/models/SpaceShip/sci-fi_luminaris_spaceship/scene.gltf"],
					   //["spaceship-40","./resources/models/SpaceShip/star_wars_spaceship/scene.gltf"],
					   ["spaceship-41","./resources/models/SpaceShip/exon_90/scene.gltf"],
					   //["spaceship-42","./resources/models/SpaceShip/spaceship_333/scene.gltf"],
					   //["spaceship-43","./resources/models/SpaceShip/spaceship_evil_gravity/scene.gltf"],
					   //["spaceship-44","./resources/models/SpaceShip/spaceship_tank/scene.gltf"],
					   //["spaceship-45","./resources/models/SpaceShip/darth_vaders_tie-fighter/scene.gltf"],
					   
					   ["missile-1","./resources/models/missile/aim-9_missile/scene.gltf"],
					   ["missile-2","./resources/models/missile/missile_model_murder_drones/scene.gltf"],
					  ];
					  
					  
	}
	
	get_great_mother_ship(player_id){
		for(let i=0;i<this._great_mother_ships.length;i++){
			const _unit=this._great_mother_ships[i];
			if(_unit._player_id===player_id)
				return _unit;
		}
		return null;
	}
	
	create_great_mother_ship(position){
		let gltf=this._data_list["spaceship-39"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(3);
		let _UnitClass=GreatMotherShip;
		const _unit=this.create_uncombat_unit(_UnitClass,model,position,false);
		this._great_mother_ships.push(_unit);
		_unit.add_to_after_dead_function_list(()=>{
			//alert("Player:"+_unit._player_id+" has losed");
			_unit.lock=true;
		});
		return _unit;
	}
	create_mother_ship(_player_id,_type,_position){
	  let _mother_ship;
	  if(_type===1){
			_mother_ship=_unitMG_legionGame.create_mother_heating_ship_1(_position);
			//_mother_ship._show_laser_connect_great_mother_ship=false;
			_mother_ship._player_id=_player_id;
			_mother_ship.init_legion_ships();
			_unitMG_legionGame._game._graphics.Scene.add(_mother_ship._model);
			
	  }
	  
	  
	  return _mother_ship;
    }
	create_mother_flash_ship_1(position){
		let gltf=_unitMG_legionGame._data_list["spaceship-9"];
		const model = gltf.scene.children[0];
		model.rotation.z=Math.PI/2;
		model.scale.setScalar(10);
		let _UnitClass=MotherFlashShip;
		const _unit=_unitMG_legionGame.create_combat_unit(_UnitClass,model,position,false);
		_unitMG_legionGame._mother_ships.push(_unit);
		return _unit;
	}
	create_mother_rocket_ship_1(position){
		let gltf=_unitMG_legionGame._data_list["spaceship-10"];
		const model = gltf.scene.children[0];
		model.rotation.z=-Math.PI/2;
		model.scale.setScalar(10);
		let _UnitClass=MotherRocketShip;
		const _unit=_unitMG_legionGame.create_combat_unit(_UnitClass,model,position,false);
		_unitMG_legionGame._mother_ships.push(_unit);
		return _unit;
	}
	create_mother_heating_ship_1(position){
		let gltf=_unitMG_legionGame._data_list["spaceship-3"];
		const model = gltf.scene.children[0];
		model.rotation.y=Math.PI;
		model.rotation.z=-Math.PI/2;
		model.scale.setScalar(8);
		let _UnitClass=MotherHeatingShip;
		const _unit=_unitMG_legionGame.create_combat_unit(_UnitClass,model,position,false);
		_unitMG_legionGame._mother_ships.push(_unit);
		return _unit;
	}
	create_mother_freezing_ship_1(position){
		let gltf=_unitMG_legionGame._data_list["spaceship-4"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.4);
		model.rotation.y=Math.PI;
		//model.rotation.z=Math.PI/2;
		model.rotation.x=Math.PI/2;
		let _UnitClass=MotherFreezingShip;
		const _unit=_unitMG_legionGame.create_combat_unit(_UnitClass,model,position,false);
		_unitMG_legionGame._mother_ships.push(_unit);
		return _unit;
	}
	/*
	create_mother_ship(position){
		let gltf=this._data_list["spaceship-41"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.05);
		let _UnitClass=MotherShip;
		const _unit=this.create_uncombat_unit(_UnitClass,model,position,false);
		//this._game._graphics.Scene.add(_unit._model);
		return _unit;
	}
	*/
	create_laser_ship_1(position){
		let gltf=_unitMG_legionGame._data_list["spaceship-11"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(2);
		model.rotation.y=Math.PI;
		model.rotation.z=Math.PI;
		let _UnitClass=LaserShip1;
		let _unit= _unitMG_legionGame.create_combat_unit(_UnitClass,model,position,true);
		
		return _unit;
	}
	create_flash_ship_1(position){
		let gltf=_unitMG_legionGame._data_list["spaceship-12"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(400);
		model.rotation.z=Math.PI/2;
		let _UnitClass=FlashShip1;
		let _unit= _unitMG_legionGame.create_combat_unit(_UnitClass,model,position,true);
		
		return _unit;
	}
	create_rocket_ship_1(position){
		let gltf=_unitMG_legionGame._data_list["spaceship-10"];
		const model = gltf.scene.children[0];
		model.rotation.z=-Math.PI/2;
		model.scale.setScalar(6);
		let _UnitClass=RocketShip1;
		let _unit= _unitMG_legionGame.create_combat_unit(_UnitClass,model,position,true);
		
		return _unit;
	}
	create_missile_1(position){//overwrite
		let gltf=this._data_list["missile-1"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(7);
		model.rotation.z=Math.PI;
		let _UnitClass=Missile1;
		let _unit= this.create_uncombat_unit(_UnitClass,model,position,false);
		_unit.CheckTarget=_unit.CheckTarget_V2;
		_unit._radius_effect1=100;//khoảng cách mà khi tên lửa ở gần mục tiêu sẽ phát nổ
		_unit._radius_effect2=100;//bán kính tầm ảnh hưởng của vụ nổ
		//_unit._origin_position=this.get_world_position();//vị trí ban đầu
		_unit._max_distance=600;//quãng đường xa nhất tên lửa có thể bay đi
		_unit._missile_speed=190;
		_unit._damage=500;
		
		return _unit;
	}
	
	init_status_container(){
		this._status_container_1=document.getElementById("status-container-1");
				this._status_container_2=document.getElementById("status-container-2");
				
				this._status_container_1.innerHTML="";
			this._status_container_2.innerHTML="";
			
				this._bar_list=new Array();
			
			
			for(let i=0;i<this._mother_ships.length;i++){
				let _ship=this._mother_ships[i];
				//if(_ship._player_id===this._game._playerID)continue;
				const _maxHP=_ship._max_health;
				const _HP=parseInt(_ship._health);
				
				let _html='<xgui-bar id="unit-dam-'+i+'" max-value="'+_maxHP+'" name="'+(i+1)+'" origin="left" value="'+_HP+'" thresholds=0:255,0,0|10:255,165,0|20:var(--hud-color)></xgui-bar>';
				let barElement = document.createElement('div');
				barElement.innerHTML = _html;
				barElement.style.cursor="pointer";
				
				this._bar_list.push(barElement);
				
				barElement.addEventListener('click', () => {
					
					if(_ship._player_id===this._game._playerID){
						this._game._selected_unit=_ship;
					}
					
					if(_ship===_current_target){
						this._game.exit_camera_from_target_orbit(_current_target);
						_current_target=null;
						return;
					}
					for(let j=0;j<this._bar_list.length;j++){
						this._bar_list[j].style.border="";
					}
					barElement.style.border="solid yellow 1px";
					_current_target=_ship;
					this._game.let_camera_follow_target(_ship);
				});

				if (_ship._player_id === this._game._playerID)
					this._status_container_1.appendChild(barElement);
				else
					this._status_container_2.appendChild(barElement);
				
				//this._status_container_1.innerHTML+="<br/>";
			}
	}
    update_status(){
			if(!this._status_inited){	
				if(this._full_unit.length>0){
					this._status_inited=true;
					this.init_status_container();
				}
			
				return;
			}
			for(let i=0;i<this._mother_ships.length;i++){
				let _ship=this._mother_ships[i];
				//if(_ship._player_id===this._game._playerID)continue;
				const _maxHP=_ship._max_health;
				const _HP=parseInt(_ship._health);
				
				const _xgui=document.getElementById("unit-dam-"+i);
				_xgui.setAttribute("max-value", String(_maxHP));
				_xgui.setAttribute("value", String(_HP));
			}
			
			return;
			const _great_mother_ship_1=this.get_great_mother_ship(this._game._playerID);
			const _great_mother_ship_2=this.get_great_mother_ship(this._game._opponentID);
			const _maxHP1=_great_mother_ship_1._max_health;
			const _HP1=parseInt(_great_mother_ship_1._health);
			const _maxHP2=_great_mother_ship_2._max_health;
			const _HP2=parseInt(_great_mother_ship_2._health);
			let _html1='<xgui-bar id="unit-dam" max-value="'+_maxHP1+'" name="Mother" origin="left" value="'+_HP1+'" thresholds=0:255,0,0|10:255,165,0|20:var(--hud-color)></xgui-bar>';
			let _html2='<xgui-bar id="unit-dam" max-value="'+_maxHP2+'" name="Mother" origin="left" value="'+_HP2+'" thresholds=0:255,0,0|10:255,165,0|20:var(--hud-color)></xgui-bar>';
			//this._status_container_1.innerHTML+=_html1;
			//this._status_container_2.innerHTML+=_html2;
			
		
	}
	
	
}
export {UnitMGLegionGame}
