import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
//import {ColladaLoader} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/loaders/ColladaLoader.js';
//import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/loaders/GLTFLoader.js';
import {GUI} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/libs/dat.gui.module.js';
//import {BufferGeometryUtils} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/utils/BufferGeometryUtils.js';

import {agent} from './agent.js';
import {controls} from './controls.js';
import {game} from './game.js';
import {math} from './math.js';
import {terrain} from './terrain.js';
import {visibility} from './visibility.js';


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

import {MenuBar} from './game-2/menu-bar.js';
import {UnitFrame} from './game-2/unit-frame.js';


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

class ProceduralTerrain_Demo extends game.Game {
  constructor() {
    super({game_id:2,
	load_unit_model_complete:()=>{
		//this._fps_mode=true;
		this._unitMG.create_player_entity();			
		//this._unitMG.add_random_enemy_combat_unit(1);
		
		
		this._fps_mode=true;
		this._ChangeMode();
		
		document.getElementById("cash-container").innerHTML="Cash: "+this._me._inventory._cash;
		
		//this._ship_mode=false;
		//this._ChangeMode();
		
		//this.goto_planet(0,0,0);
		
		//this._orbit_control_mode=true;
		//this._ChangeMode();
		
		//this._motion_enable=true;
		//_universe.get_current_galaxy().create_neighboring_star_systems(this._graphics.Camera.position,30000);
		
	}});
	_last_pos.position.copy(this._graphics.Camera.position);
	
  }
	_OneSecondPass(){//overwrite
		super._OneSecondPass();
		
		_px=parseInt(this._graphics.Camera.position.x);
		_py=parseInt(this._graphics.Camera.position.y);
		_pz=parseInt(this._graphics.Camera.position.z);
		_coordinates.innerHTML='<span>X: </span>'+_px+', &nbsp;&nbsp;&nbsp; <span>Y: </span>'+_py+', &nbsp;&nbsp;&nbsp; <span>Z: </span>'+_pz+'';
		
	}
	Update_1(timeInSeconds){//overwrite
		
		if(this._lock_motion===true)return;
	
		_universe.update(timeInSeconds);
		if(this._target&&this._target!=null){
			this._target.rotateY(0.01);
		}
		//this._unitMG.Update();
		
		//if(this._motion_enable)
		if(this._follow_target===true)//camera bam' theo doi tuong (vd: planet/moon)
		if(this._target&&this._target!=null){
			const _pos1=this._target.get_world_position();
			this._graphics.Camera.position.set(_pos1.x-this._target.distanceX,_pos1.y+this._target.distanceY,_pos1.z-this._target.distanceZ);
			this._graphics.Camera.lookAt(_pos1);
		}
		
	}
	
	get_universe(){
		return _universe;
	}
	
  _OnInitialize() {
	  
	this._config={
		magnification_factor:350000//hệ số phóng đại dữ liệu khoảng cách trong data load lên
	};
	
	this._lock_controls=false;
	
    this._CreateGUI();
	
    this._userCamera = new THREE.Object3D();
    this._userCamera.position.set(4100, 0, 0);

    this._graphics.Camera.position.set(9500,0,-500);
    this._graphics.Camera.quaternion.set(-0.032, 0.885, 0.062, 0.46);
	this._graphics._CreateLights();

    this._score = 0;
	
	this._sound.load_sounds();
	this._clock = new THREE.Clock();
	
    // This is 2D but eh, whatever.
    this._visibilityGrid = new visibility.VisibilityGrid(
      [new THREE.Vector3(-40000, 0, -40000), new THREE.Vector3(40000, 0, 40000)],
      [100, 100]);
	
    this._entities['_explosionSystem'] = new ExplodeParticles(this);
   
    this._library = {};
	
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
		
	
	//this._InitEventListener();
    this._LoadBackground();//universe background
	
	_universe=new Universe({scene:this._graphics.Scene,camera:this._graphics.Camera,game:this});
	_universe.create_galaxy_with_url(-1,'./custom-galaxy.json',()=>{
		this._menuBar=new MenuBar({game:this,data:_universe.get_current_galaxy().get_data()});
		//this._menuBar.update_cash();
	});
	
	
	document.getElementById("home-img").addEventListener("click",()=>{
		//this._StopRender();
		//this._Clear();
		
	});
	/*
	document.getElementById("save-game-img").addEventListener("click",()=>{
		
	});
	*/
	//Unit.AfterDead=()=>{
		//this._unitMG.update_enemy_combat_unit_list();
	//};
	
	//this._click_fc=function(){};
	//document.addEventListener("click",this._click_fc);
	
	this.create_raycaster_1();
  }
  
  switch_to_orbit_control(){
	  //this.disable_follow_target();
	  this._orbit_control_mode=true;
	   this._fps_mode=false;
	  this._ChangeMode();
  }
  switch_to_fps_control(){
	  this._orbit_control_mode=false;
	  this._fps_mode=true;
	  this._ChangeMode();
  }
  switch_to_spaceship_control(){
	  this._orbit_control_mode=false;
	  this._fps_mode=false;
	  this._ChangeMode();
  }
  

  create_raycaster_1(){
	  if(this._fps_mode){
		 
		  this._entities['_controls3'].remove_click_event();
		 
	  }
	  
		
	//document.removeEventListener("click",this._click_fc);
	//this._lock_raycaster_1=false;
	this._ray_caster=new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
		this._ray_caster.far=999;
		let vector_2=new THREE.Vector2();
	this._click_fc=(event)=>{
		
		//if(this._lock_raycaster_1===true)return;
		//this._lock_raycaster_1=true;
		
		//if(typeof this._ray_caster!='undefined'&&this._ray_caster!=null)return;
		
		
		vector_2.set(
			(event.clientX / this._graphics.Renderer.domElement.clientWidth) * 2 - 1,
			-(event.clientY / this._graphics.Renderer.domElement.clientHeight) * 2 + 1
		);
		this._ray_caster.setFromCamera(vector_2, this._graphics.Camera);
		let intersects = this._ray_caster.intersectObjects(this._graphics.Scene.children, true); 
        if (intersects.length > 0)
		{
			var obj=intersects[0].object;
			if(obj.my_class===this._target){try{
				//document.removeEventListener("click",this._click_fc);
				
				if(typeof this._unitFrame!='undefined'&&this._unitFrame!=null)
					return;
				
				this._lock_motion=true;
				let intersect_point=intersects[0].point;
				
				let obj_world_pos = obj.my_class.get_world_position();
				let relativePosition = new THREE.Vector3();
				relativePosition.copy(intersect_point).sub(obj_world_pos);
				
				//this._ray_caster=null;
				
				this._unitFrame=new UnitFrame({game:this,target:this._target}).show_frame(obj.my_class,relativePosition,()=>{
					this._lock_motion=false;
					//this._lock_raycaster_1=false;
					//this.create_raycaster_1();
					this._unitFrame=null;
				});
			}catch(e){alert(e.toString());}
			}
		}
	};
	this._graphics._threejs.domElement.addEventListener("click",this._click_fc);
  }
 
  goto_star(star_system_id,star_id){
	 
	  let _galaxy=_universe.get_current_galaxy();
	  let _star=_galaxy.get_star_class(star_system_id,star_id);
	  
	  this._graphics.Camera.position.copy(_star.get_world_position());
	  this._graphics.Camera.position.x+=(_star.get_radius()+950);
	  this._graphics.Camera.position.y+=(_star.get_radius()+950);
	  
	  this._target=_star;
	  this._target.distanceX=3630;
	  this._target.distanceY=3330;
	  this._target.distanceZ=3630;
	 
	  this.enable_follow_target();
	  _galaxy._stop=false;
	  //this.create_raycaster_1();
  }
  goto_planet(star_system_id,star_id,planet_id){
	  let _galaxy=_universe.get_current_galaxy();
	  let _planet=_galaxy.get_planet_class(star_system_id,star_id,planet_id);
	 
	  this._graphics.Camera.position.copy(_planet.get_world_position());
	  this._graphics.Camera.position.y+=(_planet.get_radius()+50);
	  
	  this._target=_planet;
	  this._target.distanceX=630;
	  this._target.distanceY=330;
	  this._target.distanceZ=630;
	
	  this.enable_follow_target();
	  _galaxy._stop=false;
	  //this.create_raycaster_1();
	  
  }
  goto_moon(star_system_id,star_id,planet_id,moon_id){
	  let _galaxy=_universe.get_current_galaxy();
	  let _moon=_galaxy.get_moon_class(star_system_id,star_id,planet_id,moon_id);
	  
	  this._graphics.Camera.position.copy(_moon.get_world_position());
	  this._graphics.Camera.position.y+=(_moon.get_radius()+50);
	  
	  this._target=_moon;
	  this._target.distanceX=630;
	  this._target.distanceY=330;
	  this._target.distanceZ=630;
	  
	  this.enable_follow_target();
	  _galaxy._stop=false;
	  //this.create_raycaster_1();
  }
  enable_follow_target(){
	  this._follow_target=true;
  };
  disable_follow_target(){
	  this._follow_target=false;
  };
  
  create_mobile_control_icon(){
		/*
		document.getElementById("hpBarWrapper").addEventListener("click",function(event){
			event.preventDefault();
		});
		document.getElementById("mana-bar").addEventListener("click",function(event){
			event.preventDefault();
		});
	  
		let _width1="50px",_height1="50px";
		let _up=this.create_icon(_width1,_height1,"150px","100px","./resources/icons/up.png",
		()=>{this.auto_key_down(87);},()=>{this.auto_key_up(87);});
		let _down=this.create_icon(_width1,_height1,"250px","100px","./resources/icons/down.png",
		()=>{this.auto_key_down(83);},()=>{this.auto_key_up(83);});
		let _left=this.create_icon(_width1,_height1,"200px","50px","./resources/icons/left.png",
		()=>{this.auto_key_down(65);},()=>{this.auto_key_up(65);});
		let _right=this.create_icon(_width1,_height1,"200px","150px","./resources/icons/right.png",
		()=>{this.auto_key_down(68);},()=>{this.auto_key_up(68);});
		
		
		let _width2="60px",_height2="60px";
		let _engine=this.create_icon(_width2,_height2,"55%","75%","./resources/icons/engine.png",
		()=>{this.auto_key_press(32);},()=>{});
		let _fire=this.create_icon(_width2,_height2,"75%","80%","./resources/icons/engine.png",
		()=>{this.auto_key_down(13);},()=>{this.auto_key_up(13);});
		
		let _width3="70px",_height3="60px";
		let _roll_left=this.create_icon(_width3,_height3,"55%","65%","./resources/icons/roll-left.png",
		()=>{this.auto_key_down(75);},()=>{this.auto_key_up(75);});
		let _roll_right=this.create_icon(_width3,_height3,"75%","70%","./resources/icons/roll-right.png",
		()=>{this.auto_key_down(76);},()=>{this.auto_key_up(76);});
		*/
	};
	/*
	create_icon(_width,_height,_top,_left,_src,_fc1,_fc2){
		let _icon=document.createElement("img");
		_icon.style.position="absolute";
		_icon.style.width=_width;
		_icon.style.height=_height;
		_icon.style.top=_top;
		_icon.style.left=_left;
		_icon.src=_src;
		_icon.style.zIndex="999999";
		_icon.addEventListener("touchstart",function(event){
			event.preventDefault();
			_fc1();
		});
		_icon.addEventListener("touchend",function(event){
			event.preventDefault();
			_fc2();
		});
		document.body.appendChild(_icon);
		
		return _icon;
	};
	auto_key_press(_keycode){
		var event = new KeyboardEvent('keypress', {
		keyCode: _keycode,
		which: _keycode,
		altKey: false,
		ctrlKey: false,
		shiftKey: false,
		metaKey: false,
		bubbles: true
		});

		var targetElement = document.body;
		targetElement.dispatchEvent(event);
	};
	auto_key_down(_keycode){
		var event = new KeyboardEvent('keydown', {
		keyCode: _keycode,
		which: _keycode,
		altKey: false,
		ctrlKey: false,
		shiftKey: false,
		metaKey: false,
		bubbles: true
		});

		var targetElement = document.body;
		targetElement.dispatchEvent(event);
	};
	auto_key_up(_keycode){
		var event = new KeyboardEvent('keyup', {
		keyCode: _keycode,
		which: _keycode,
		altKey: false,
		ctrlKey: false,
		shiftKey: false,
		metaKey: false,
		bubbles: true
		});

		var targetElement = document.body;
		targetElement.dispatchEvent(event);
	};
  */
  _ChangeMode(){
	  
	 if(this._entities['_controls3'])
	 {
		 this._entities['_controls3'].remove_click_event();
	 }
	 delete this._entities['_controls1'];
	 delete this._entities['_controls2'];
	 delete this._entities['_controls3'];
	 
	 delete this._entities['_orbit_controls'];
	 
	 this._human_shape.visible=false;
	 this._ship_shape.visible=false;
	 
	  if(typeof this._human_entity =='undefined'){
		  this._human_entity=new HumanEntity(
			{model: this._human_shape, camera: this._graphics.Camera, game: this,
			is_me:true,gltf_data:this._human_gltf});
	  }
	  if(typeof this._ship_entity =='undefined'){
		  this._ship_entity =new PlayerEntity(
          {model: this._ship_shape, camera: this._graphics.Camera, game: this,arrow:this._arrow,
		  blasterSystem:this._entities['_blasterSystem1'],
		  thruster:this._entities['_thruster1'],
		  is_me:true});
	  }
	  
	  if(this._orbit_control_mode===true){
		  this._entities['player'] = this._ship_entity;
		  let _target_pos;
		  //if(this._target&&this._target!=null)
			  //_target_pos=this._target.get_world_position();
		  //else
			  //_target_pos=new THREE.Vector3(0,0,0);
		  //alert(_target_pos.x+" and "+_target_pos.y+" and "+_target_pos.z);
		  this._entities['_orbit_controls'] = new controls.OrbitControls({
			//target: this._entities['player'],
			camera: this._graphics.Camera,
			scene: this._graphics.Scene,
			domElement: this._graphics._threejs.domElement,
			gui: this._gui,
			guiParams: this._guiParams,
			//target:_target_pos,
			game:this
			});
		  return;
		 
	  }
	  
	  //this._fps_mode=true;
	  if(this._fps_mode){
		  this._entities['player'] = this._ship_entity;
		  this._entities['_controls3'] = new controls.FPSControls({
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
			//this._entities['player']._model=this._human_shape;
			//this._entities['player']._params.model=this._human_shape;
			
			//if(!this._entities['_controls1'])
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
	  //this._entities['player']._model=this._ship_shape;
		
	  //if(!this._entities['_controls2'])
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
  _keyDownHandle(event){
	  if(this._lock_controls)return;
	  if(this._ship_mode)
		this._entities['_controls2']._onKeyDown(event);
	  else
		this._entities['_controls1']._onKeyDown(event);
  }
  _keyUpHandle(event){
	  if(this._lock_controls)return;
	  if(this._ship_mode)
		this._entities['_controls2']._onKeyUp(event);
	  else
		this._entities['_controls1']._onKeyUp(event);
  }
  _keyPressHandle(event){
	  if(this._lock_controls)return;
	  if(this._ship_mode)
		this._entities['_controls2']._onKeyPress(event);
	  else
		this._entities['_controls1']._onKeyPress(event);
  }
  
  _CreateGUI() {
    //this._CreateGameGUI();
    this._CreateControlGUI();
  }
	/*
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
*/
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
		'https://closure.vps.wbsprt.com/files/earth/space/px.png',
    'https://closure.vps.wbsprt.com/files/earth/space/nx.png',
    'https://closure.vps.wbsprt.com/files/earth/space/py.png',
    'https://closure.vps.wbsprt.com/files/earth/space/ny.png',
    'https://closure.vps.wbsprt.com/files/earth/space/pz.png',
    'https://closure.vps.wbsprt.com/files/earth/space/nz.png',
    ]);
    this._graphics._scene.background = texture;
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



