import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
//import {ColladaLoader} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/loaders/ColladaLoader.js';
//import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/loaders/GLTFLoader.js';
import {GUI} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/libs/dat.gui.module.js';
//import {BufferGeometryUtils} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/utils/BufferGeometryUtils.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/controls/OrbitControls.js';


//import {agent} from './agent.js';
//import {controls} from './controls.js';
import {game} from './game.js';
import {math} from './math.js';
//import {terrain} from './terrain.js';
import {visibility} from './visibility.js';


import {blaster} from './units/blaster.js';
//import {PlayerEntity} from './player-entity.js';
//import {EnemyEntity} from './enemy-entity.js';
import {Radar} from './radar.js';
import {thruster} from './thruster.js';
//import {HumanEntity} from './human.js';

import {Galaxy} from './core/galaxy.js';
import {Universe} from './core/universe.js';
import {SphericalObject} from './core/spherical-object.js';

import {Unit} from './units/unit.js';
import {inventory} from './inventory.js';

import {ExplodeParticles} from './explode-particles.js';
import {UnitMGLegionGame} from './unit-mg-legion-game.js';

import {LegionGame1} from './legion-game-1.js';
import {LegionGame2} from './legion-game-2.js';

import {UnitBar} from './legion-game/unit-bar.js';

import {LegionGameLevelMG} from './legion-game-level-mg.js';

import {LegionGameMissionScoreData} from './legion-game-mission-score-data.js';

//import {LaserShip1} from './units/laser-ship-1.js';

//import {Room} from './game-3/room.js';
//import {Player} from './player.js';

//import {ShowRoom} from './show-room.js';

let _APP = null;

let _universe=null;
let _coordinates=document.getElementById("coordinates");
let _px,_py,_pz;
//let _my_status_list=new Array();//gui trang thai cua minh len server de server gui cho enemy player

class ProceduralTerrain_Demo extends game.Game {
  constructor() {
	  let _fc=()=>{
		this.init_objects();
		this.create_menu_btton();
	  }
		super({game_id:4,load_unit_model_complete:_fc});
		this._pos_list_1=new Array();
		this._pos_list_2=new Array();
		this._start_position_effect_list=new Array();
		//this._warehouse2.load_data();
		this._lock_mouse=true;
		
		const imageUrls = [
			['explosion-1','./resources/gif/explosion/7.gif'],
			['particle1','./resources/particle/noname-3.png'],
			['particle2','./resources/particle/noname-7.png'],
			['particle3','./resources/particle/noname-12.png'],
			['particle4','./resources/particle/noname-1.png'],
			['particle5','./resources/particle/noname-5.png'],
		//['particle6','./resources/particle/noname-9.png']
		];
		this._image_preloader.preloadImages(imageUrls,()=>{
		
		});
		
		const _g_mode=localStorage.getItem("LegionGame-Mode").trim();
		if(_g_mode==="SinglePlayer")
			this._game_mode=this._parameters._game_mode_PvC;
		if(_g_mode==="MultiPlayer")
			this._game_mode=this._parameters._game_mode_PvP;
		
		if(this._game_mode===this._parameters._game_mode_PvC){
			const _level_id=localStorage.getItem("LegionGame_PvsC_Level");
			//alert(_level_id);
			this._level_infor=new LegionGameLevelMG({game:this});
			this._level_infor.generate_level_infor_list(this._parameters._legion_game_max_level);
			this._level_infor.set_level_id(_level_id);
			
		}
		
		this._score_data=new LegionGameMissionScoreData({id:parseInt(localStorage.getItem("LegionGameID"))});
		this._score_data.load_data();
		//this._score_data.finish_level(1,3);
		//console.log("HighestID="+this._score_data.get_highest_finished_level_id());
		
		this._dead_list=new Array();
		Unit.AfterDead=(_unit)=>{
			this._dead_list.push([_unit,_unit.constructor.name,_unit._player_id]);
			
			this.check_end_game();
		};
		//console.log("ClassName=>>"+LaserShip1.name);
	}
	
	check_end_game(){
		const _enemy_remain=this._unitMG.get_all_other_team_unit(this._playerID).length;
			const _my_remain=this._unitMG.get_all_unit(this._playerID).length;
			if(_enemy_remain===0){
				this.end_game(true);
			}
			if(_my_remain===0){
				this.end_game(false);
			}
	}
	
	end_game(_win){//overwrite o cac trang game
		this._StopRender();
	}
	
	start_game(){
		let _start_btn=document.getElementById("start-btn");
		_start_btn.remove();
		//this._unit_bar_1.clear();
		this._lock_mouse=false;
		
		for(let i=0;i<this._start_position_effect_list.length;i++){
			try{
				this._start_position_effect_list[i].destroy_system();
			}catch(e){}
		}
		
		this._unitMG._lock_update_status=false;
	}
	
	create_opponent_units(){//console.log("Length="+this._pos_list_2.length);
	
		let _unit2;
		if(this._game_mode===this._parameters._game_mode_PvC){
			const type_list=this._level_infor.get_current_unit_types();
			const mother_ship_id_list=this._parameters.convert_types_list_to_ship_id_list(type_list);
			const _child_types=this._level_infor.get_current_child_types();
			const _child_nums=this._level_infor.get_current_child_nums();
			//alert(mother_ship_id_list);
			//alert(this._unit_id_list);
			for(let i=0;i<this._pos_list_2.length&&i<type_list.length;i++){
				const _pos=this._pos_list_2[i];
				const _player_id=2;//<==========================
				const _mother_ship=this._warehouse2.get_create_mother_ship_fc(0)(_pos);
				_mother_ship.create_enemy_child_ship_store_1(_child_types[i],_child_nums[i]);
				this._graphics.Scene.add(_mother_ship._model);
				_mother_ship.init_legion_ships();
				
				let _unit_level=this._level_infor.get_current_unit_level();
					const _child_types2=this._level_infor.get_current_child_types();
					const _child_type=_child_types2[i];
					const _child_nums2=this._level_infor.get_current_child_nums();
					const _child_num=_child_nums2[i];
					
					_mother_ship._ship_package.set_ship_level(_unit_level);
					_mother_ship.apply_space_ship_level_package();
					_mother_ship.create_enemy_child_ship_store_1(_child_type,_child_num);
					_mother_ship.change_child_ships_level(_unit_level);
			}
			
			//_unit2=this.create_unit_group_1(this._enemy_player_id,_tpos2,this._pos_list_2);
			//_unit2.init_mother_ships(mother_ship_id_list);
		}
		if(this._game_mode===this._parameters._game_mode_PvP){
			//_unit2=this.create_unit_group_1(this._enemy_player_id,_tpos2,this._pos_list_2);
		}
	
		return;
		for(let i=0;i<this._pos_list_2.length;i++){
			const _pos=this._pos_list_2[i];
			const _player_id=2;//<==========================
			//const _mother_ship=this._unitMG.create_mother_ship(_player_id,1,_pos);
			const _mother_ship=this._warehouse2.get_create_mother_ship_fc(0)(_pos);
			_mother_ship._player_id=_player_id;
			_mother_ship.create_enemy_child_ship_store_1(0,1400);
			this._graphics.Scene.add(_mother_ship._model);
			_mother_ship.init_legion_ships();
			//const _child_package=new ChildShipStore({game:this._game,package_name:"EnemyMotherShip-ID-"+i});
		}
	}
	
  
	Update_1(timeInSeconds){//overwrite
		
	}
	_OneSecondPass(){//overwrite
		
		super._OneSecondPass();
	}	
	
  _OnInitialize() {
	
	this._my_player_id=1;//<==FOR TESTING
	this._enemy_player_id=2;
	this._selected_unit=null;
	
	this._unitMG=new UnitMGLegionGame({game:this,camera:this._graphics.Camera});
	this._config={
		magnification_factor:350000//hệ số phóng đại dữ liệu khoảng cách trong data load lên
	};
	
    this._userCamera = new THREE.Object3D();
    this._userCamera.position.set(4100, 0, 0);
	
    //this._graphics.Camera.position.set(9500,0,-500);
    //this._graphics.Camera.quaternion.set(-0.032, 0.885, 0.062, 0.46);
	this._graphics.Scene.background = new THREE.Color( 0x000000 );
	//this._graphics.Renderer.setClearColorHex( 0x000000, 1 );
	if(this._graphics.center_div)this._graphics.center_div.remove();
	
	this._graphics.init_lasers();
	
    this._score = 0;
	
	this._sound.load_sounds();
	this._clock = new THREE.Clock();
	
    // This is 2D but eh, whatever.
    this._visibilityGrid = new visibility.VisibilityGrid(
      [new THREE.Vector3(-40000, 0, -40000), new THREE.Vector3(40000, 0, 40000)],
      [100, 100]);
	  
	  this._entities['_explosionSystem'] = new ExplodeParticles(this);
	
    this._library = {};
	this._graphics._AddAmbientLight();
	
	
	
	//this._LoadBackground();
	this._root_div=document.getElementById("root-container");
	this._mouse_div=document.getElementById("mouse-handle-div");
	this.enable_window_resize_event_listener();
  }
  
  init_objects(){
	  _universe=new Universe({scene:this._graphics.Scene,camera:this._graphics.Camera,game:this});
	_universe._auto_create_star_systems=false;
	_universe.create_galaxy_with_url(-1,'./legion-game-data-demo.json',()=>{
		const storedJsonString = localStorage.getItem('LegionGameID');
		const _legionGameID=JSON.parse(storedJsonString);
		
		if(_legionGameID===null||parseInt(_legionGameID)===1){
			const storedJsonString2 = localStorage.getItem('LegionGameUnitIDList');
			let _unit_id_list = JSON.parse(storedJsonString2);
			//alert(_unit_id_list);
			this._legion_game=new LegionGame1({game:this,game_mode:this._game_mode,universe:_universe,unit_id_list:_unit_id_list,level_infor:this._level_infor});
		}
		else{
			this._legion_game=new LegionGame2({game:this,game_mode:this._game_mode,universe:_universe,level_infor:this._level_infor});
			this.create_unit_bar();
		}
			
		
		this._legion_game.init_game();
		//this.create_opponent_units();
		//this.create_unit_bar();
	});
	
	this.add_to_update_function_list((timeInSeconds)=>{
		_universe.update(timeInSeconds);
	});
  }
  
  create_unit_bar(){
	  this._unit_bar_1=new UnitBar({game:this,container:document.getElementById("root-container")});
	  //this._unit_bar_2=new UnitBar({game:this,container:document.getElementById("root-container")});
	  this._unit_bar_1.init(0,5);
	
  }
  
  _LoadBackground() {
    this._graphics.Scene.background = new THREE.Color(0xFFFFFF);
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
	
		'./resources/background/px.png',
        './resources/background/nx.png',
        './resources/background/py.png',
        './resources/background/ny.png',
        './resources/background/pz.png',
        './resources/background/nz.png'
	
	
    ]);
    this._graphics._scene.background = texture;
  }
  
  _InitEventListener(){
	 
  }
  _CheckDistanceToPlanets(){//Kiem tra xem co tien toi qua gan planet/moonn/star/base nao ko
	 
  }

  _OnStep(timeInSeconds) {
  }
  
  let_camera_follow_target(target_obj){//overwrite o legion-game-1 and 2
	  //if(this._orbit_controls){
		  //this._orbit_controls.enabled = false;
	  //}
	  this._camera_fc_1=(timeInSeconds)=>{
		  if(target_obj.Dead||target_obj===null){
			  this.exit_camera_from_target_orbit(target_obj);
			  return;
		  }
		  const _target_pos=target_obj.Position;
		  this._graphics.Camera.position.set(_target_pos.x,_target_pos.y+400,_target_pos.z);
		  this._graphics.Camera.lookAt(_target_pos);
	  };
	  this.add_to_update_function_list(this._camera_fc_1);
  }
  exit_camera_from_target_orbit(target_obj){
	  this.remove_function_from_update_list(this._camera_fc_1);
  }
  
}

function _Main() {
	
  _APP = new ProceduralTerrain_Demo();
	document.addEventListener('contextmenu', function(event) {
	event.preventDefault(); // Ngăn chặn hiển thị menu chuột phải mặc định của trình duyệt
	
	});
	
	setTimeout(()=>{
		let _start_btn=document.getElementById("start-btn");
		_start_btn.addEventListener("click",()=>{
			_APP.start_game();
		});
	},2000);
}

_Main();
