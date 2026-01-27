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

//import {Galaxy} from './core/galaxy.js';
//import {Universe} from './core/universe.js';
//import {SphericalObject} from './core/spherical-object.js';

import {Unit} from './units/unit.js';
import {inventory} from './inventory.js';

import {ExplodeParticles} from './explode-particles.js';

import {Earth} from './core/earth.js';

import {SpaceShip} from './units/space-ship.js';
import {Sparks} from './units/skills/sparks.js';

import {RewardsMG} from './rewards-mg.js';
//import {Room} from './game-3/room.js';
//import {Player} from './player.js';

import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/controls/OrbitControls.js';

import {ShowRoom} from './show-room.js';

let _APP = null;

let _universe=null;
let _coordinates=document.getElementById("coordinates");
let _px,_py,_pz;
//let _my_status_list=new Array();//gui trang thai cua minh len server de server gui cho enemy player
let _enemy_status_list_1=new Array();//cua player enemy

let _menu_icon_width="50px";
let _menu_icon_bound_radius="50px";
let _menu_icon_bg_color="rgba(0, 0, 0, 0.5)";

class ProceduralTerrain_Demo extends game.Game {
  constructor() {
	
    super({game_id:4,load_unit_model_complete:()=>{
		this._parameters.init_test_mode_1();
		//alert(this.get_player_level());
		this._rewardsMG=new RewardsMG({game:this});
		this._show_room.init(()=>{
			this._rewardsMG.check_player_level_reward(this.get_player_level());
			this._show_room.move_to_last_select_ship();
			this.add_to_timer(()=>{
				this._graphics.remove_divider();
			},1);
			this._entities['_explosionSystem'] = new ExplodeParticles(this);
			let _earth=new Earth({scene: this._graphics.Scene,game:this});
				const positionInFront = this._graphics.getPositionInFrontOfCamera(5200);
				positionInFront.z+=1200;
				_earth.create(positionInFront);
				
			this.add_to_update_function_list((t)=>{
				_earth.rotateY(t*0.1);
			});
			
			/*
			let group = new SPE.Group( {
					texture: {
						value: THREE.ImageUtils.loadTexture( './resources/sprite-explosion2.png' ),
						frames: new THREE.Vector2( 5, 5 ),
						loop: 1
					},
					depthTest: true,
					depthWrite: false,
					blending: THREE.AdditiveBlending,
					scale: 6000
				} ),
				shockwaveGroup = new SPE.Group( {
					texture: {
						value: THREE.ImageUtils.loadTexture( './resources/smokeparticle.png' ),
					},
					depthTest: false,
					depthWrite: true,
					blending: THREE.NormalBlending,
				} ),
				shockwave = new SPE.Emitter( {
					particleCount: 200,
					type: SPE.distributions.DISC,
					position: {
						radius: 5,
						spread: new THREE.Vector3( 5 )
					},
					maxAge: {
						value: 2,
						spread: 0
					},
					// duration: 1,
					activeMultiplier: 2000,

					velocity: {
						value: new THREE.Vector3( 40 )
					},
					rotation: {
						axis: new THREE.Vector3( 1, 0, 0 ),
						angle: Math.PI * 0.5,
						static: true
					},
					size: { value: 2 },
					color: {
						value: [
							new THREE.Color( 0.4, 0.2, 0.1 ),
							new THREE.Color( 0.2, 0.2, 0.2 )
						]
					},
					opacity: { value: [0.5, 0.2, 0] }
				}),
				debris = new SPE.Emitter( {
					particleCount: 100,
					type: SPE.distributions.SPHERE,
					position: {
						radius: 0.1,
					},
					maxAge: {
						value: 2
					},
					// duration: 2,
					activeMultiplier: 40,

					velocity: {
						value: new THREE.Vector3( 100 )
					},
					acceleration: {
						value: new THREE.Vector3( 0, -20, 0 ),
						distribution: SPE.distributions.BOX
					},
					size: { value: 2 },
					drag: {
						value: 1
					},
					color: {
						value: [
							new THREE.Color( 1, 1, 1 ),
							new THREE.Color( 1, 1, 0 ),
							new THREE.Color( 1, 0, 0 ),
							new THREE.Color( 0.4, 0.2, 0.1 )
						]
					},
					opacity: { value: [0.4, 0] }
				}),
				fireball = new SPE.Emitter( {
					particleCount: 20,
					type: SPE.distributions.SPHERE,
					position: {
						radius: 1
					},
					maxAge: { value: 2 },
					// duration: 1,
					activeMultiplier: 20,
					velocity: {
						value: new THREE.Vector3( 10 )
					},
					size: { value: [20, 100] },
					color: {
						value: [
							new THREE.Color( 0.5, 0.1, 0.05 ),
							new THREE.Color( 0.2, 0.2, 0.2 )
						]
					},
					opacity: { value: [0.5, 0.35, 0.1, 0] }
				}),
				mist = new SPE.Emitter( {
					particleCount: 50,
					position: {
						spread: new THREE.Vector3( 10, 10, 10 ),
						distribution: SPE.distributions.SPHERE
					},
					maxAge: { value: 2 },
					// duration: 1,
					activeMultiplier: 2000,
					velocity: {
						value: new THREE.Vector3( 8, 3, 10 ),
						distribution: SPE.distributions.SPHERE
					},
					size: { value: 40 },
					color: {
						value: new THREE.Color( 0.2, 0.2, 0.2 )
					},
					opacity: { value: [0, 0, 0.2, 0] }
				}),
				flash = new SPE.Emitter( {
					particleCount: 50,
					position: { spread: new THREE.Vector3( 5, 5, 5 ) },
					velocity: {
						spread: new THREE.Vector3( 30 ),
						distribution: SPE.distributions.SPHERE
					},
					size: { value: [2, 20, 20, 20] },
					maxAge: { value: 2 },
					activeMultiplier: 2000,
					opacity: { value: [0.5, 0.25, 0, 0] }
				} );

			group.addEmitter( fireball ).addEmitter( flash );
			shockwaveGroup.addEmitter( debris ).addEmitter( mist );
			this._graphics.Scene.add( shockwaveGroup.mesh );
			this._graphics.Scene.add( group.mesh );
			
			const _ex_pos=this._graphics.getPositionInFrontOfCamera(520);
			//alert(_ex_pos.x,_ex_pos.y,_ex_pos.z);
			group.mesh.position.set(0,0,0);
			//this._graphics.Camera.position.set(500,0,0);
			//this._graphics.Camera.lookAt(group.mesh.position);
			//this._graphics.Camera.position.copy(group.mesh.position);
			
			this.add_to_update_function_list(()=>{
				group.tick(  );
			    shockwaveGroup.tick(  );
			});
			*/
			//alert("HELLO1111111");
			const imageUrls1 = [
							['particle1','./resources/particle/noname-6.png'],
							['particle2','./resources/particle/noname-41.png'],
						]		;
				this._image_preloader.preloadImages(imageUrls1,()=>{//ben duoi cung co' this._image_preloader
					
				});
			
			return;
				this._unitMG.createSimpleCombatShip=(position,_is_enemy)=>{
					let gltf=this._unitMG._data_list["spaceship-5"];
					let _new_material=this._unitMG.get_gradient_material("white","blue");
					gltf.scene.traverse((o) => {
						if (o.isMesh) o.material = _new_material;
					});
					const model = gltf.scene.children[0];
					model.scale.setScalar(0.001);
		
					const _eunit=this._unitMG.create_combat_unit(SimpleCombatShip,model,position,_is_enemy);	
						_eunit._player_id=null;
					return _eunit;
				}
			
				let _earth_ship_pos_1=this._graphics.getPositionInFrontOfCamera(1000);
				_earth_ship_pos_1.z-=450;
				let _earth_ship=this._unitMG.createSimpleCombatShip(_earth_ship_pos_1,false);
				
				_earth_ship._lock_fire=false;
				_earth_ship._rocket_speed=120;
				_earth_ship._model.scale.multiplyScalar(3.2);
					
				_earth_ship.CheckTarget=(timeInSeconds)=>{};
				_earth_ship.add_to_scene();
				
			
			   let _enemy_pos=this._graphics.getPositionInFrontOfCamera(1000);
			   let _enemy_ship=this._unitMG.createSimpleCombatShip(_enemy_pos,true);
			   
			   this._unitMG.get_enemy_combat_unit_in_range_3=this._unitMG.get_enemy_combat_unit_in_range_2;
			   /*
			   this._unitMG.get_enemy_combat_unit_in_range_3=(_unit,_position,_radius)=>{
					const _player_id=_unit._player_id;
					const _rs=this.get_enemy_combat_unit_in_range_2(_player_id,_position,_radius);
					if(_unit._is_enemy){
					const _distance=this._game._me.Position.distanceTo(_unit.Position);
					if(_distance<_radius)
						_rs.push([this._game._me,_distance]);
					}
					return _rs;
				}
				*/
				_enemy_ship._lock_fire=false;
				_enemy_ship._rocket_speed=120;
				_enemy_ship._model.scale.multiplyScalar(3.2);
					
				//_enemy_ship.CheckTarget=(timeInSeconds)=>{};
				_enemy_ship.add_to_scene();
				
				_earth_ship._player_id=100;
				_enemy_ship._player_id=200;
				
				_earth_ship._target_object=_enemy_ship;
				_enemy_ship._target_object=_earth_ship;
				
				_earth_ship.TakeDamage=()=>{};
				_enemy_ship.TakeDamage=()=>{};
				
				//_earth_ship.start_hunting_behavior_1();
				//_enemy_ship.start_hunting_behavior_1();
				
				const imageUrls = [
							['particle6','./resources/particle/noname-9.png'],
						]		;
				this._image_preloader.preloadImages(imageUrls,()=>{
					//_earth_ship.start_hunting_behavior_1();
					//_enemy_ship.start_hunting_behavior_1();
					_earth_ship.look_at(_enemy_ship.Position);
					_enemy_ship.look_at(_earth_ship.Position);
					
					let _attack_fc=()=>{
						_earth_ship.Fire();
						_enemy_ship.Fire();
						
						this.add_to_timer(()=>{
							_attack_fc();
						},5);
					};
					_attack_fc();
					
					
				});
			
		});
		/*
		let _rs="";
			  for(let i=2;i<100;i++){
				_rs+=this.get_exp_require(i);
				_rs+="-";
			  }
			  alert(_rs);
			  */
	}});
	let _player_level=this.get_player_level();
	let _player_exp=this.get_player_exp();
	this._graphics.create_divider(document.getElementById("root-container"),"rgba(0, 0, 0, 0.1)");
	let _level_container=document.createElement("div");
		_level_container.style.position="absolute";
		_level_container.style.top="10px";
		_level_container.style.right="80px";
		_level_container.style.color="white";
		_level_container.style.fontSize="20px";
		_level_container.style.width=_menu_icon_width;
		_level_container.style.height=_menu_icon_width;
		//_level_container.style.border="5px turquoise solid";
		//_level_container.style.borderRadius=_menu_icon_bound_radius;
		//_level_container.style.boxShadow="10px 10px 10px rgba(17, 223, 214, 0.3)";
		//_level_container.style.backgroundColor=_menu_icon_bg_color;
		_level_container.innerHTML=`<img src="./resources/icons/user-3.png" style="position:absolute;top:10%;left:10%;" width=80% height=80%/>`;
		_level_container.style.backgroundImage=`url("./resources/icons/ring-7.png")`;
		_level_container.style.backgroundSize=`109%`;
		_level_container.style.backgroundPosition=`center`;
		_level_container.style.backgroundRepeat=`no-repeat`;
		_level_container.style.zIndex="99999999999999999";
		_level_container.style.overflow='visible';
		
		
		//_level_container.innerHTML="Your Level:"+_player_level;
		document.getElementById("root-container").appendChild(_level_container);
		_level_container.addEventListener("click",()=>{
			let _game=this;
			let _iframe=this.show_iframe('./frame/player-infor.html',function(){
		
			});
			_iframe.addEventListener('load', ()=> {
				try{
				//_iframe.contentWindow.set_parent_page(window);
				const _text_1="Rank "+_player_level;
				const _text_2="Rank "+(_player_level+1);
				
				let _exp1=_player_exp;
				let _exp2=this.get_exp_require(_player_level);
				let _exp3=this.get_exp_require(_player_level+1);
				let _value=Math.floor((_exp1/_exp3)*100);
				//alert(_exp1);
				//alert(_exp2);
				//alert(_value);
				_iframe.contentWindow.set_value(_text_1,_text_2,_value,_exp1,_exp3);
				}catch(e){alert(e.stack);}
			});
		});
	
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
	
	this._show_room=new ShowRoom({game:this});
	
	//this._show_room.create_child_ship_icon();
	//this._show_room.create_additional_skills_icon();
	//this._show_room.create_passive_skills_icon();
	
	this.createLuckyWheelIcon();
	this.createItemPacketIcon();
	this.createHomeIcon();
	
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
	
    this._LoadBackground();
	
	
	this._root_div=document.getElementById("root-container");
    
  }
  createHomeIcon(){
	  let _icon_container=document.createElement("div");
		_icon_container.style.position="absolute";
		_icon_container.style.width=_menu_icon_width;
		_icon_container.style.height=_menu_icon_width;
		_icon_container.style.right="10px";
		_icon_container.style.top="10px";
		//_icon_container.style.border="5px solid turquoise";
		//_icon_container.style.borderRadius=_menu_icon_bound_radius;
		//_icon_container.style.boxShadow="0 0 10px 5px #33BBFF";
		//_icon_container.style.backgroundColor=_menu_icon_bg_color;
		_icon_container.style.backgroundImage=`url("./resources/icons/ring-5.png")`;
		_icon_container.style.backgroundSize=`103%`;
		_icon_container.style.backgroundPosition=`center`;
		_icon_container.style.backgroundRepeat=`no-repeat`;
		_icon_container.style.zIndex="99999999999999999";
		_icon_container.style.overflow='visible';
		
		let _img=document.createElement("img");
		_img.style.position="absolute";
		_img.style.width="80%";
		_img.style.height="80%";
		_img.style.top="10%";
		_img.style.left="10%";
		_img.src="./resources/icons/home2.png";
		_icon_container.appendChild(_img);
		_img.addEventListener("click",()=>{
			window.location.href="./home-page/index.html";
		});
		
		document.getElementById("root-container").appendChild(_icon_container);
  }
  createItemPacketIcon(){
	  let _icon_container=document.createElement("div");
		_icon_container.style.position="absolute";
		_icon_container.style.width=_menu_icon_width;
		_icon_container.style.height=_menu_icon_width;
		_icon_container.style.right="200px";
		_icon_container.style.top="10px";
		//_icon_container.style.border="5px solid turquoise";
		//_icon_container.style.borderRadius=_menu_icon_bound_radius;
		//_icon_container.style.boxShadow="0 0 10px 5px #33BBFF";
		//_icon_container.style.backgroundColor=_menu_icon_bg_color;
		_icon_container.style.backgroundImage=`url("./resources/icons/ring-7.png")`;
		_icon_container.style.backgroundSize=`109%`;
		_icon_container.style.backgroundPosition=`center`;
		_icon_container.style.backgroundRepeat=`no-repeat`;
		_icon_container.style.zIndex="99999999999999999";
		_icon_container.style.overflow='visible';
		
		let _img=document.createElement("img");
		_img.style.position="absolute";
		_img.style.width="80%";
		_img.style.height="80%";
		_img.style.top="10%";
		_img.style.left="10%";
		_img.src="./resources/icons/chest1.png";
		_icon_container.appendChild(_img);
		_img.addEventListener("click",()=>{
			let _iframe=this.show_iframe('./frame/item-package.html',function(){
		
			});
			_iframe.addEventListener('load', ()=> {
				const _cash=this._root_inventory.GetCash();
				_iframe.contentWindow.init_data(_cash,this._item_package);
				
			});
		
		});
		
		document.getElementById("root-container").appendChild(_icon_container);
  }
  
  createLuckyWheelIcon(){
	  let _icon_container=document.createElement("div");
		_icon_container.style.position="absolute";
		_icon_container.style.width=_menu_icon_width;
		_icon_container.style.height=_menu_icon_width;
		_icon_container.style.right="140px";
		_icon_container.style.top="10px";
		//_icon_container.style.border="5px solid turquoise";
		//_icon_container.style.borderRadius=_menu_icon_bound_radius;
		//_icon_container.style.boxShadow="0 0 10px 5px #33BBFF";
		_icon_container.style.backgroundImage=`url("./resources/icons/ring-7.png")`;
		_icon_container.style.backgroundSize=`109%`;
		_icon_container.style.backgroundPosition=`center`;
		_icon_container.style.backgroundRepeat=`no-repeat`;
		_icon_container.style.zIndex="99999999999999999";
		_icon_container.style.overflow='visible';
		
		let _img=document.createElement("img");
		_img.style.position="absolute";
		_img.style.width="80%";
		_img.style.height="80%";
		_img.style.top="10%";
		_img.style.left="10%";
		_img.src="./resources/icons/wheel1.png";
		_icon_container.appendChild(_img);
		_img.addEventListener("click",()=>{
			let _iframe=this.show_iframe('./frame/lucky-wheel/index.html',function(){
					
			});
			_iframe.addEventListener('load', ()=> {
				
				_iframe.contentWindow.set_game(this);
				let _t_data;
				let _win_fc=(prize_name)=>{
					for(let i=0;i<_t_data.length;i++){
						const _element=_t_data[i];
						if(_element.text.trim()===prize_name.trim()){
							if(_element.fc)_element.fc();
							else{
								alert("Get Prize Failed!");
							}
						}
					}
					//alert("Your Pize:"+prize_name);
				}
				
			_t_data=[//chi duoc 10 element, neu nhieu hon 10 thi phai sua ben trang trong iframe
              {
				id:1,
                text: "1000$",
                img: "../../resources/icons/money-1.png",
                number: 1, // 1%,
				fc:()=>{ this._root_inventory.AddCash(1000);},
                percentpage: 0.3, // 30%
              },
              {
				  id:2,
                text: "2000$",
                img: "../../resources/icons/money-1.png",
                number: 1,
				fc:()=>{ this._root_inventory.AddCash(2000);},
                percentpage: 0.09 // 9%
              },
              {
				  id:3,
                text: "5000$",
                img: "../../resources/icons/money-1.png",
                number : 1,
				fc:()=>{ this._root_inventory.AddCash(5000);},
                percentpage: 0.05 // 5%
              },
              {
				  id:4,
                text: "10000$",
                img: "../../resources/icons/money-1.png",
                number: 1,
				fc:()=>{ this._root_inventory.AddCash(10000);},
                percentpage: 0.05 // 5%
              },
			  {
				  id:5,
                text: "15000$",
                img: "../../resources/icons/money-1.png",
                number: 1,
				fc:()=>{ this._root_inventory.AddCash(15000);},
                percentpage: 0.05 // 5%
              },
			  {
				  id:6,
                text: "20000$",
                img: "../../resources/icons/money-1.png",
                number: 1,
				fc:()=>{ this._root_inventory.AddCash(20000);},
                percentpage: 0.05 // 5%
              },
			  {
				  id:7,
                text: "25000$",
                img: "../../resources/icons/money-1.png",
                number: 1,
				fc:()=>{ this._root_inventory.AddCash(25000);},
                percentpage: 0.05 // 5%
              },
			  {
				  id:8,
                text: "50000$",
                img: "../../resources/icons/money-1.png",
                number: 1,
				fc:()=>{ this._root_inventory.AddCash(50000);},
                percentpage: 0.05 // 5%
              },
			  {
				  id:9,
                text: "Items",
                img: "../../resources/icons/gemstone-1.png",
                number: 1,
				fc:()=>{
					const _rand_gem_id=this._item_package.get_random_id();
					this._item_package.add_item(_rand_gem_id,1);
					this._item_package.save_data();
				},
                percentpage: 0.1 // 10%
              },
              {
				  id:10,
                text: "0$",
                img: "../../resources/icons/x-1.png",
				fc:()=>{ },
                percentpage: 0.21 // 21%
              }
            ];
			
				let _t_data2=this._utils.shuffle_array(_t_data);
				_t_data=_t_data2;
				_iframe.contentWindow.setData(_t_data,_win_fc);
				
			});
		
		});
		
		document.getElementById("root-container").appendChild(_icon_container);
  }
  
  
  _InitEventListener(){
	 
  }
  _CheckDistanceToPlanets(){//Kiem tra xem co tien toi qua gan planet/moonn/star/base nao ko
	 
  }

  _OnStep(timeInSeconds) {
  }

  _LoadBackground() {
	   
	  //this._graphics.createGradientBackground();
	  //this._graphics.createTextureBackground("./resources/bg/bg3.jpg");
	  /*
    this._graphics.Scene.background = new THREE.Color(0xFFFFFF);
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
	
        './resources/space-posx.jpg',
        './resources/space-negx.jpg',
        './resources/space-posy.jpg',
        './resources/space-negy.jpg',
        './resources/space-posz.jpg',
        './resources/space-negz.jpg',
	
    ]);
    this._graphics._scene.background = texture;
	*/
  }
  
}


//--------------------------------------------------


//-----------------------------------------------------

function _Main() {
	
  _APP = new ProceduralTerrain_Demo();
  
}

_Main();


class SimpleCombatShip extends SpaceShip {
	
	constructor(params){
		params.laser_color=new THREE.Color(247, 10, 2);
		params.shoot_delay=0.5;//thời gian delay giữa 2 lần bắn
		
		params.health=params.game._parameters._standard_hp*1;
		params.damage=50;
		//params.blaster_radius=6;
		
		
		super(params);
		this._recovery_time=7;//thời gian hồi phục
		this._lock_fire=true;
		
		this._rocket_speed=this._game._parameters._standard_rocket_speed*1.5;
	}
	Fire(){//overwrite
		if(typeof this._target_object==='undefined'||this._target_object===null||this._target_object.Dead)return;
		if(this._lock_fire)return;
		this._lock_fire=true;
		
		this._game.add_to_timer(()=>{
			this._lock_fire=false;
		},this._recovery_time);
		
		let _pos1=this.get_ahead_point(15);
		//let _pos2=this.get_ahead_point(150);
	
		let gltf=this._game._unitMG._data_list["missile-1"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(3.5);
		model.rotation.z=Math.PI;
		let _UnitClass=SimpleMissile;
		let _rocket= this._game._unitMG.create_combat_unit(_UnitClass,model,_pos1,true);
		_rocket._missile_speed=this._rocket_speed;
		_rocket._player_id=this._player_id;//alert(_rocket._player_id);
		_rocket._target_object=this._target_object;
		_rocket._unit=this;
		this._game._graphics.Scene.add(_rocket._model);
		//_rocket._model.lookAt(_pos2);		
		const _lookPos=this._utils.calculateSymmetricPoint(_rocket._model.position,this._target_object.Position);
		_rocket._model.lookAt(_lookPos);
		
		
		this._game._sound.play('rocket-1');
	}
	CheckTarget(timeInSeconds){
		
	}
	
}

class SimpleMissile extends SpaceShip {
	
	constructor(params){
	
		params.health=200;
		params.damage=params.game._parameters._standard_hp/30;
		
		super(params);
	
		this._radius_effect1=5;//khoảng cách mà khi tên lửa ở gần mục tiêu sẽ phát nổ
		this._radius_effect2=35*this._game.rocket_multiplier;//bán kính tầm ảnh hưởng của vụ nổ
		this._origin_position=this.get_world_position();//vị trí ban đầu
		this._max_distance=2900*this._game.rocket_multiplier;//quãng đường xa nhất tên lửa có thể bay đi
		this._missile_speed=0;
		this._damage=params.damage;
		
			this.tha = 0;
		this.R = 15;
		this._update_fc=(timeInSeconds)=>{
			this.update(timeInSeconds);
		 };
		this._game.add_to_update_function_list(this._update_fc);
		
		this.create_thruster(new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0));
		
	}
	update(){
		
		this.tha += .13;
		
		const _pos=this.Position;
		
		this.emitter1.p.x=_pos.x;
		this.emitter1.p.y=_pos.y;
		this.emitter1.p.z=_pos.z;
		
		this.proton.update();
		
	}
	addProton(position) {
        this.proton = getNewProton();

        this.emitter1 = this.createEmitter(position.x,position.y,position.z, '#4F1500', '#0029FF');
		
		this.emitter1.p.z = this._position.z + this.R * Math.cos(this.tha);
        this.emitter1.p.x = this._position.x +this.R * Math.sin(this.tha);
		this.emitter1.p.y = this._position.y;
       
        this.proton.addEmitter(this.emitter1);
        this.proton.addRender(new Proton.SpriteRender(this._game._graphics.Scene));
		
    }
	
	destroy_thruster() {
		this.proton.emitters.forEach(emitter => {
			emitter.stopEmit();
		});
		
		
		this.proton.emitters.forEach(emitter => {
			emitter.particles.forEach(particle => {
				
				emitter.removeParticle(particle);//sẽ gây lỗi, nhưng nhờ có lỗi mới destroy được,(chưa rõ nguyên nhân vì sao khi destroy mà system vẫn ko bị remove khỏi scene
				
			});
			emitter.removeAllParticles();
		});

		this.proton.removeEmitter(this.emitter1);
		this.proton.destroy();
		
	}	
	createSprite() {
        //var map = new THREE.TextureLoader().load("./resources/particle/noname-3.png");
		var map = new THREE.CanvasTexture(this._game._image_preloader.getImage('particle6'));
        var material = new THREE.SpriteMaterial({
            map: map,
            color: 0xff0000,
            blending: THREE.AdditiveBlending,
            fog: true
        });
        return new THREE.Sprite(material);
    }
	create_thruster(position,direction){
		this._position=position;
		this._direction=direction;
		
		this.addProton(position);
	}
	createEmitter(x, y, z, color1, color2) {
        var emitter = new Proton.Emitter();
        emitter.rate = new Proton.Rate(new Proton.Span(3, 9), new Proton.Span(.005, .01));
        //emitter.addInitialize(new Proton.Mass(1));
        emitter.addInitialize(new Proton.Life(0.5));
        emitter.addInitialize(new Proton.Body(this.createSprite()));
        emitter.addInitialize(new Proton.Radius(30));
        //emitter.addInitialize(new Proton.V(200, new Proton.Vector3D(0, 0, -1), 0));


        //emitter.addBehaviour(new Proton.Alpha(1, 0));
        emitter.addBehaviour(new Proton.Color(color1, color2));
        emitter.addBehaviour(new Proton.Scale(1, 0));
        //emitter.addBehaviour(new Proton.CrossZone(new Proton.ScreenZone(camera, renderer), 'dead'));


        //emitter.addBehaviour(new Proton.Force(0, 0, -20));
       
        emitter.p.x = x;
        emitter.p.y = y;
		emitter.p.z = z;
        
		const emit_time=2.0;
		const emitter_life=1.0;
		emitter.emit(emit_time,emitter_life);
		

        return emitter;
    }
	
	SelfDestroy(){
		super.SelfDestroy();
		this._params.game._entities['_explosionSystem'].Splode(this.Position,"#109BE7","#109BE7",24,96,12);
		//this._params.game._entities['_explosionSystem'].Splode(this.Position,"#FFFFFF","#FFFFFF",24,96);
		this._game.add_to_timer(()=>{
			this.destroy_thruster();
		},2);
		this._game.add_to_timer(()=>{//neu stop update qua' som' thi cac particle chua xoa' di het
			this._game.remove_function_from_update_list(this._update_fc);
		},13);
	}
	
	CheckTarget(timeInSeconds){//console.log("Running");
			const _position=this.get_world_position();
			if(_position.distanceTo(this._origin_position)>this._max_distance){
				this.SelfDestroy();
			}
			if(_position.distanceTo(this._target_object.Position)<10){
				this.SelfDestroy();
			}
			//this.look_at(this.getFrontPos(50));
			this.look_at(this._target_object.Position);
			this.move_forward(timeInSeconds*this._missile_speed);
			return;
			
			
			let _targets=this._game._unitMG.get_enemy_combat_unit_in_range_3(this,_position,this._radius_effect1);;
			
			for(let i=0;i<_targets.length;i++){
				const _target=_targets[i][0];
				
				const _distance=_targets[i][1];
				let _damage=this._damage;
				if(_distance>this._radius_effect2*3/4)_damage=this._damage/3;
				if(_distance>this._radius_effect2*1/2)_damage=this._damage/2;
				
				//_target.TakeDamage(_damage);
			}
			if(_targets.length>0){
				//console.log("Hit!!!!!!!!");
				this.SelfDestroy();
			}
	}
}



