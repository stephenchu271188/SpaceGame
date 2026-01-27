import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
//import {ColladaLoader} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/loaders/ColladaLoader.js';
//import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/loaders/GLTFLoader.js';
import {GUI} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/libs/dat.gui.module.js';
//import {BufferGeometryUtils} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/utils/BufferGeometryUtils.js';

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

//import {Room} from './game-3/room.js';
//import {Player} from './player.js';

import {TrainingMission} from './training-1-missions.js';
import {LegionGameMissionScoreData} from './legion-game-mission-score-data.js';

let _APP = null;

let _universe=null;
let _coordinates=document.getElementById("coordinates");
let _px,_py,_pz;
//let _my_status_list=new Array();//gui trang thai cua minh len server de server gui cho enemy player
let _enemy_status_list_1=new Array();//cua player enemy

class ProceduralTerrain_Demo extends game.Game {
  constructor() {
	  let _fc=()=>{
		  //try{
	  //this._show_room.init();}catch(e){alert(e.stack);}
	  };
    super({game_id:4,load_unit_model_complete:_fc});
		let _mission_data_id=localStorage.getItem('LegionGameID');
		//alert(_mission_data_id);
		this._score_data=new LegionGameMissionScoreData({id:_mission_data_id});
		this._score_data.load_data();
		//this._score_data.finish_level(0,1);
		//this._score_data.save_data();
	}
	Update_1(timeInSeconds){//overwrite
		
	}
	_OneSecondPass(){//overwrite
		
		super._OneSecondPass();
	}	
	
  _OnInitialize() {
	
	this._config={
		magnification_factor:350000//hệ số phóng đại dữ liệu khoảng cách trong data load lên
	};
	
	
	
	this._lock_controls=false;
	
    this._userCamera = new THREE.Object3D();
    this._userCamera.position.set(4100, 0, 0);

    this._graphics.Camera.position.set(9500,0,-500);
    this._graphics.Camera.quaternion.set(-0.032, 0.885, 0.062, 0.46);
	this._graphics.Scene.background = new THREE.Color( 0x000000 );
	this._graphics._CreateLights();
	//this._graphics.Renderer.setClearColorHex( 0x000000, 1 );
	if(this._graphics.center_div)this._graphics.center_div.remove();
	
    this._score = 0;
	
	this._sound.load_sounds();
	this._clock = new THREE.Clock();
	
    // This is 2D but eh, whatever.
    this._visibilityGrid = new visibility.VisibilityGrid(
      [new THREE.Vector3(-40000, 0, -40000), new THREE.Vector3(40000, 0, 40000)],
      [100, 100]);
	
    this._library = {};
	
	_universe=new Universe({scene:this._graphics.Scene,camera:this._graphics.Camera,game:this});
	_universe._auto_create_star_systems=false;
	
	let _json_file;
		const storedJsonString = localStorage.getItem('LegionGameID');
		let _legionGameID=JSON.parse(storedJsonString);
		
		if(_legionGameID===null||parseInt(_legionGameID)===1){
			_legionGameID=1;
			_json_file='./training-1-data-demo.json';
		}
		else{
			_legionGameID=2;
			_json_file='./training-1-data-demo.json';
		}
		
		this._legionGameID=_legionGameID;
	
	_universe.create_galaxy_with_url(-1,_json_file,()=>{
		setTimeout(()=>{
			this._show_room=new TrainingMission({game:this,universe:_universe});
			this._show_room.init();
			//this._show_room.goto_star(0,0);
		
			this.add_to_update_function_list((timeInSeconds)=>{
			_universe.update(timeInSeconds);
		},1000);
		
	});
		
	});
	
	
	
	this._LoadBackground();
	
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
		'./resources/background/px.png',
        './resources/background/nx.png',
        './resources/background/py.png',
        './resources/background/ny.png',
        './resources/background/pz.png',
        './resources/background/nz.png'
	*/
	
    ]);
    this._graphics._scene.background = texture;
  }
  
  _InitEventListener(){
	 
  }
  _CheckDistanceToPlanets(){//Kiem tra xem co tien toi qua gan planet/moonn/star/base nao ko
	 
  }

  _OnStep(timeInSeconds) {
  }
  
}


//--------------------------------------------------


//-----------------------------------------------------

function _Main() {
	
  _APP = new ProceduralTerrain_Demo();
  
}

_Main();
/*
document.getElementById("arrow1").addEventListener("click",()=>{
	_APP._show_room.next();
});
document.getElementById("arrow1").addEventListener("click",()=>{
	_APP._show_room.prev();
});
*/
document.addEventListener('keydown', (event)=> {
			 
			switch(event.key) {
				case 'ArrowUp':
					;
				break;
				case 'ArrowDown':
					;
				break;
				case 'ArrowLeft':
					_APP._show_room.next();
				break;
				case 'ArrowRight':
					_APP._show_room.prev();
				break;
			}
});

