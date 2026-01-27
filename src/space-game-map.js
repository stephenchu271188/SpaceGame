import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/loaders/GLTFLoader.js';

import {Planet} from './core/planet.js';
import {Sparks1} from './units/skills/spark-1.js';
import {Sparks2} from './units/skills/spark-2.js';
import {Rocket2} from './units/rocket-2.js';

let _distances=null;
let _speedX=1.0,
    _speedY=1.0,
	_speedZ=1.0;

let _change_counter=0;
let _planet_textures;
let _texture_id=0;

class SpaceGameMap{
	constructor(params){
		this._game=params.game;
		
		this._root=new THREE.Group();
		this._root.position.set(0,0,0);
		//this._root.position.copy(this._game._me.Position);
		this._game._graphics.Scene.add(this._root);
		this._map_data=new ModelMG({game:this});
		
		this._current_group=null;
		
		//this._load_textures_callback=()=>{};
		
		const manager = new THREE.LoadingManager();
			  manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
					console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
			  };
			  manager.onLoad = function ( ) {
					console.log( 'Loading Textures complete!');
			  };
			  manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
				console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
			  };
			  manager.onError = function ( url ) {
				alert( 'There was an error loading ' + url );
			  };
		
		_planet_textures=[
		'./texture/Demo/1.png',
			'./texture/Demo/2.png',
			'./texture/Demo/3.png',
			'./texture/Demo/4.png',
			'./texture/Demo/5.png',
			'./texture/Demo/6.png',
			
		/*
			'./texture/planet/RockWorldsPack/1.png',
			'./texture/planet/RockWorldsPack/2.png',
			//'./texture/planet/RockWorldsPack/3.png',
			//'./texture/planet/RockWorldsPack/4.png',
			'./texture/planet/RockWorldsPack/5.png',
			'./texture/planet/RockWorldsPack/6.png',
			'./texture/planet/RockWorldsPack/7.jpg',
			'./texture/planet/RockWorldsPack/8.jpg',
			'./texture/planet/RockWorldsPack/9.jpg',
			'./texture/planet/RockWorldsPack/10.jpg',
			'./texture/planet/RockWorldsPack/11.png',
			'./texture/planet/RockWorldsPack/12.png',
			
			'./texture/planet/RockWorldsPack/5.jpg',
			'./texture/planet/RockWorldsPack/6.jpg',
			
			'./texture/planet/HabitableWorldsPack/1.png',
			'./texture/planet/HabitableWorldsPack/2.png',
			'./texture/planet/HabitableWorldsPack/3.png',
			'./texture/planet/HabitableWorldsPack/4.png',
			'./texture/planet/HabitableWorldsPack/5.png',
			'./texture/planet/HabitableWorldsPack/6.png',
			'./texture/planet/HabitableWorldsPack/7.png',
			'./texture/planet/HabitableWorldsPack/8.png',
			//'./texture/planet/HabitableWorldsPack/9.png',
			'./texture/planet/HabitableWorldsPack/10.png',
			'./texture/planet/HabitableWorldsPack/11.png',
			'./texture/planet/HabitableWorldsPack/12.png',
			'./texture/planet/HabitableWorldsPack/13.png',
			'./texture/planet/HabitableWorldsPack/14.png',
			'./texture/planet/HabitableWorldsPack/15.png',
			'./texture/planet/HabitableWorldsPack/16.png',
			'./texture/planet/HabitableWorldsPack/17.png',
			'./texture/planet/HabitableWorldsPack/18.png',
			'./texture/planet/HabitableWorldsPack/19.png'
			*/
		];
		this._textures=new Array();
		this._preload=(_callback)=>{
			let _counter=0;
			const textureLoader = new THREE.TextureLoader(manager);
			for(let i=0;i<_planet_textures.length;i++){
				let _texture=textureLoader.load(_planet_textures[i],()=>{
					//alert('load_complete');
					this._textures.push(_texture);
					_counter++;
					if(_counter===_planet_textures.length)
						_callback();
				});
			}
		};
		
	}
	
	get_next_texture(){
		let _texture=this._textures[_texture_id];
		_texture_id++;
		if(_texture_id>this._textures.length-1)
			_texture_id=0;
		
		return _texture;
	}
	
	update_map_scene(t){
		if(this._current_group===null)return;
		if(this.get_distances()<3200){
			if(_distances===null){
				_distances=this.get_distances();
			}
			/*
			const _new_distances=this.get_distances();
			const _dX=_new_distances.x-_distances.x;
			const _dY=_new_distances.y-_distances.y;
			const _dZ=_new_distances.z-_distances.z;
		
			this._current_group.position.x+=_dX;
			this._current_group.position.y+=_dY;
			this._current_group.position.z+=_dZ;
			*/
		}
		
	}
	get_distances(){//lay khoang cach giua map-root voi player ship
		const _player_pos=this._game._me.Position;
		const _root_pos=this._current_group.position;
		const _new_distances={
				x:_player_pos.x-_root_pos.x,
				y:_player_pos.y-_root_pos.y,
				z:_player_pos.z-_root_pos.z,
		};
		
		return _new_distances;
	}
	
	change_map_scene(){
		_change_counter++;
		_distances=null;
		
		const _player_pos=this._game._me.Position;
		/*
		if(_change_counter===1){
			this._current_group=this.init_group_1();
			this._current_group.visible=true;
			this._current_group.position.set(0,0,0);
			return;
		}
		*/
		let _stop_update=false;
		let _update_fc=(t)=>{
					
		};
			
			let _type;
			if(_change_counter===1)
				_type=1;
			else
				_type=this._game._utils.get_random_in_range(1,2);
			
			
			let _new_group;
			let _speed=2500;
			
			if(_type===1){
				this._game._entities['_controls2']._move.rollRight = true;
				_new_group=this.create_random_planet_group();
				_new_group.position.set(0,6000,-15000);
				
				_update_fc=(t)=>{
					if(_stop_update)
						return;
					
					if(_new_group.position.z>=0){
						_stop_update=true;
						this._root.remove(this._current_group);
						this._current_group=_new_group;
						this._game.add_to_timer(()=>{
							this._game._entities['_controls2']._move.rollRight = false;
						},1);
						
						return;
					}
					
					_new_group.position.z+=t*_speed;
					_new_group.position.y-=t*300;
					if(this._current_group!=null)this._current_group.position.x+=t*_speed*2;
				};
			}
			if(_type===2){
				//this._game._sound.play("speed-up");
				//this._game._effect_screen.show_speed_up_effect_1(4);
				
				let _position1=this._game._me.Position;
		let _position2=this._game._me.getFrontPos(160);
		/*
		let gltf=this._game._unitMG._data_list["missile-1"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(2.5);
		model.rotation.z=Math.PI;
		model.visible=false;
		
		let _rocket=this._game._unitMG.create_uncombat_unit(Rocket2,model,_position2,false);
			_rocket._unit=this._game._me;
			_rocket._player_id=this._game._me._player_id;
			_rocket.emit_time=5.0;
			_rocket.emitter_life=1.0;
			_rocket.CheckTarget=()=>{};
			_rocket._disable_explode_effect=true;
			_rocket.launch('particle10',12,0.5,3);//8,10,14,15
			this._game._me.look_at(new THREE.Vector3(this._game.get_tunnel_pos().x,
												   this._game._me.Position.y+1000,
												   this._game.get_tunnel_pos().z));
			//this._game._entities['_controls2']._lock=true;
			this._game._graphics.Scene.add(_rocket._model);
			*/
				this._game._sound.play("teleport");
				
				_new_group=this.create_random_planet_group();
				_new_group.position.set(0,92000,0);
				//_new_group.rotation.y=(Math.random() * 2 - 1) * Math.PI;
				_update_fc=(t)=>{
					if(_stop_update)
						return;
					
					//_rocket._model.position.copy(this._game._me.getFrontPos(160));
					this._game._me.look_at(new THREE.Vector3(this._game.get_tunnel_pos().x,
												   this._game._me.Position.y+1000,
												   this._game.get_tunnel_pos().z));
					//_rocket._model.position.copy(this._game._me.getFrontBellowPos(160,3));
					
					if(_new_group.position.y<=1500){
						_stop_update=true;
						this._root.remove(this._current_group);
						this._current_group=_new_group;
						//_rocket.SelfDestroy();
						this._game.add_to_timer(()=>{
							//this._game._entities['_controls2']._lock=false;
						},2);
						
						return;
					}
					_new_group.position.y-=t*13000;
					this._current_group.position.y-=t*_speed*2;
				};
			}
			
				_new_group.visible=true;
				
		this._game.add_to_update_function_list(_update_fc);
	}
	
	init(_game_level){
		if(_game_level<0){
			this._map_data.load_data();
			this._map_data._load_complete_fc=()=>{
				this.change_map_scene();
			};
		}
		else{
			this.change_map_scene();
		}
		
		this.create_lights();
		//this.init_stars();
	}
	
	init_stars(){
		const _pos1=this._game._me.getFrontRightPos(10000,5000);
			  _pos1.z-=30000;//dich xuong
			let _star1=new Star({game:this._game,
							 particle_path:"./resources/particle-old-2/noname-8.png",
							 radius:3000});
			_star1.create_system_1(_pos1);
	
			const _pos4=this._game._me.getFrontAbovePos(50000,12500);
			  _pos4.x+=30000;//dich sang phai
			let _star4=new Star({game:this._game,
						     particle_path:"./resources/particle-old-2/noname-38.png",
							 radius:10000});
			_star4.create_system_1(_pos4);
		
			let _star5=new Star({game:this._game,
						     particle_path:"./resources/particle-old-2/noname-37.png",
							 radius:2000});
			_star5.create_system_1(this._game._me.getFrontAbovePos(10000,-5000));
		
			let _star6=new Star({game:this._game,
						     particle_path:"./resources/particle-old-2/noname-36.png",
							 radius:2000});
			_star6.create_system_1(this._game._me.getFrontAbovePos(10000,9000));
	}
	
	init_group_1(){
		
		let _player_pos=this._game._me.Position;
		
		let _group=new THREE.Group();
			_group.visible=false;
		this._root.add(_group);
		
		/*nhin thay dau tien*/
		let _planet1=new Planet({scene: this._game._graphics.Scene,radius:2800,
					position:new THREE.Vector3(_player_pos.x-3000,_player_pos.y+6000,_player_pos.z+200),//x:trai' phai?,z: len xuong,y:tien' lui
					altitude_atmosphere:100,
					//texture_url:"./texture/planet/RockWorldsPack/7.jpg",
					//texture_url:"./texture/planet/RockWorldsPack/9.jpg",
					texture_url:"./texture/planet/RockWorldsPack/5.jpg",
					color_atmosphere:new THREE.Color("lightblue"),game:this._game});
		_planet1.create({});
		_group.add(_planet1.get_root());
	  
		let _planet2=new Planet({scene: this._game._graphics.Scene,radius:800,
					position:new THREE.Vector3(_player_pos.x+5000,_player_pos.y+16000,_player_pos.z+2000),
					altitude_atmosphere:20,
					texture_url:"./texture/planet/HabitableWorldsPack/8.png",
					color_atmosphere:new THREE.Color("lightblue"),game:this._game});
		_planet2.create({});
		_group.add(_planet2.get_root());
		
		/*phia sau*/
		let _planet3=new Planet({scene: this._game._graphics.Scene,radius:2800,
					position:new THREE.Vector3(_player_pos.x+1000,_player_pos.y-9000,_player_pos.z-1200),//x:trai' phai?,z: len xuong,y:tien' lui
					altitude_atmosphere:100,
					texture_url:"./texture/planet/RockWorldsPack/9.jpg",
					color_atmosphere:new THREE.Color("lightblue"),game:this._game});
		_planet3.create({});
		_group.add(_planet3.get_root());
		
		
		let _planet4=new Planet({scene: this._game._graphics.Scene,radius:700,
					position:new THREE.Vector3(_player_pos.x+1964,_player_pos.y+921,_player_pos.z-2071),//x:trai' phai?,z: len xuong,y:tien' lui
					altitude_atmosphere:20,
					texture_url:"./texture/planet/RockWorldsPack/1.jpg",
					color_atmosphere:new THREE.Color("lightblue"),game:this._game});
		_planet4.create({});
		_group.add(_planet4.get_root());
		
		return _group;
    }
	
	init_group_2(){
		//let _planet_num=2;
		//let _textures=this._game._utils.get_random_elements_from_array(_planet_textures,_planet_num);
		
		let _player_pos=this._game._me.Position;
		
		let _group=new THREE.Group();
			_group.visible=false;
		this._root.add(_group);
		
		 let gltf3=this._map_data._data_list["model-3"];//hanh tinh mau xanh la cay
			  const model3 = gltf3.scene.children[0];
			  model3.scale.setScalar(15);
			  //model.rotation.z=Math.PI;
			  _group.add(model3);
			  model3.position.set(_player_pos.x-3000,_player_pos.y+6000,_player_pos.z+200);
		
		let gltf6=this._map_data._data_list["model-6"];//ring planet
			  const model6 = gltf6.scene.children[0];
			  model6.scale.setScalar(350);
			  //model.rotation.z=Math.PI;
			  _group.add(model6);
		      model6.position.set(_player_pos.x+5000,_player_pos.y+16000,_player_pos.z+2000);
			
		return _group;
		
	}
	
	init_group_3(){
		
		let _player_pos=this._game._me.Position;
		
		let _group=new THREE.Group();
			_group.visible=false;
		this._root.add(_group);
		
		let gltf2=this._map_data._data_list["model-2"];//hanh tinh xanh duong
			const model2 = gltf2.scene.children[0];
			  model2.scale.setScalar(1.8);
			  model2.rotation.x=Math.PI/4;
			  _group.add(model2);
			  model2.position.set(_player_pos.x-3000,_player_pos.y+6000,_player_pos.z+200);
		
		let _planet3=new Planet({scene: this._game._graphics.Scene,radius:800,
					position:new THREE.Vector3(_player_pos.x+1000,_player_pos.y-9000,_player_pos.z-1200),//x:trai' phai?,z: len xuong,y:tien' lui
					altitude_atmosphere:100,
					texture_url:"./texture/planet/RockWorldsPack/9.jpg",
					color_atmosphere:new THREE.Color("lightblue"),game:this._game});
		_planet3.create({});
		_group.add(_planet3.get_root());
			
		return _group;
		
	}
	init_group_4(){
		
		let _player_pos=this._game._me.Position;
		
		let _group=new THREE.Group();
			_group.visible=false;
		this._root.add(_group);
		
		
		let _planet2=new Planet({scene: this._game._graphics.Scene,radius:2900,
					position:new THREE.Vector3(_player_pos.x-3000,_player_pos.y+6000,_player_pos.z+200),
					altitude_atmosphere:70,
					texture_url:"./texture/planet/HabitableWorldsPack/6.png",
					color_atmosphere:new THREE.Color("lightblue"),game:this._game});
		_planet2.create({});
		_group.add(_planet2.get_root());
		
		
		let _planet4=new Planet({scene: this._game._graphics.Scene,radius:700,
					position:new THREE.Vector3(_player_pos.x+1964,_player_pos.y+921,_player_pos.z-2071),//x:trai' phai?,z: len xuong,y:tien' lui
					altitude_atmosphere:20,
					texture_url:"./texture/planet/HabitableWorldsPack/8.png",
					color_atmosphere:new THREE.Color("lightblue"),game:this._game});
		_planet4.create({});
		_group.add(_planet4.get_root());
		
		return _group;
		
	}
	
	init_group_5(){//su dung trong defense mode
		
		let _player_pos=this._game._me.Position;
		
		let _group=new THREE.Group();
			_group.visible=true;
		this._root.add(_group);
		
		
		let gltf2=this._map_data._data_list["model-2"];//hanh tinh xanh duong
			const model2 = gltf2.scene.children[0];
			  model2.scale.setScalar(1.0);
			  model2.rotation.x=Math.PI/4;
			  _group.add(model2);
			  model2.position.set(_player_pos.x-6000,_player_pos.y-1460,_player_pos.z-6200);
		
		let _planet3=new Planet({scene: this._game._graphics.Scene,radius:1800,
					position:new THREE.Vector3(_player_pos.x+10000,_player_pos.y+5900,_player_pos.z-12000),//x:trai' phai?,z: len xuong,y:tien' lui
					altitude_atmosphere:100,
					texture_url:"./texture/planet/RockWorldsPack/9.jpg",
					color_atmosphere:new THREE.Color("lightblue"),game:this._game});
		_planet3.create({});
		_group.add(_planet3.get_root());
		
		 let gltf3=this._map_data._data_list["model-3"];//hanh tinh mau xanh la cay
			  const model3 = gltf3.scene.children[0];
			  model3.scale.setScalar(15);
			  //model.rotation.z=Math.PI;
			  _group.add(model3);
			  model3.position.set(_player_pos.x-9000,_player_pos.y-1200,_player_pos.z+2000);
		
		let gltf6=this._map_data._data_list["model-6"];//ring planet
			  const model6 = gltf6.scene.children[0];
			  model6.scale.setScalar(350);
			  //model.rotation.z=Math.PI;
			  _group.add(model6);
		      model6.position.set(_player_pos.x+5000,_player_pos.y-500,_player_pos.z+2000);
			  
			 /* 
			  const _pos1=this._game._me.getFrontRightPos(10000,4000);
			  _pos1.z-=30000;//dich xuong
			let _star1=new Star({game:this._game,
							 particle_path:"./resources/particle-old-2/noname-8.png",
							 radius:3000});
			_star1.create_system_1(_pos1);
	       */
		   /*
			const _pos4=this._game._me.getFrontAbovePos(50000,300);
			  _pos4.x+=30000;//dich sang phai
			  _pos4.y+=300;
			let _star4=new Star({game:this._game,
						     particle_path:"./resources/particle-old-2/noname-38.png",
							 radius:10000});
			_star4.create_system_1(_pos4);//mat troi mau cam
		
			let _star5=new Star({game:this._game,
						     particle_path:"./resources/particle-old-2/noname-37.png",
							 radius:2000});
			_star5.create_system_1(this._game._me.getBackBellowPos(10000,350));
		
			let _star6=new Star({game:this._game,
						     particle_path:"./resources/particle-old-2/noname-36.png",
							 radius:2000});
			const _pos6=this._game._me.getFrontRightPos(2300,6400);
			      _pos6.y+=600;
			_star6.create_system_1(_pos6);
			*/
		return _group;
		
	}
	
	create_random_planet_group(){
		let _player_pos=this._game._me.Position;
		//let _pos_list=new Array();
		let _planet_num=this._game._utils.get_random_in_range(2,3);
		
		let _group=new THREE.Group();
			_group.visible=false;
		this._root.add(_group);
			//return _group;
		const _min_distance_to_player=500;//khoang cach(tinh tu be mat) hanh tinh gan nhat' toi' player theo truc oy
		const _max_distance_to_player=_min_distance_to_player*4.5;
		const _min_planet_radius=800;
		const _max_planet_radius=3800;
		
		let _changeX=false;
		let _changeZ=true;
		for(let i=0;i<_planet_num;i++){
			let _position=_player_pos.clone();
			let _radius=this._game._utils.get_random_in_range(_min_planet_radius,_max_planet_radius);
				_radius-=(i*700);//cac planet phia' xa nho? hon se dep hon
			if(_radius<_min_planet_radius)
				_radius=_min_planet_radius;
			
				_position.y+=(_radius+this._game._utils.get_random_in_range(_min_distance_to_player,_max_distance_to_player));
				if(_changeX)
					_position.x+=(_radius+this._game._utils.get_random_in_range(_min_distance_to_player,_max_distance_to_player));
				else
					_position.x-=(_radius+this._game._utils.get_random_in_range(_min_distance_to_player,_max_distance_to_player));
				
				if(_changeX)
					_position.z+=(_radius+this._game._utils.get_random_in_range(_min_distance_to_player,_max_distance_to_player));
				else
					_position.z-=(_radius+this._game._utils.get_random_in_range(_min_distance_to_player,_max_distance_to_player));
				
				_changeX=!_changeX;
				_changeZ=!_changeZ;
			
			let _spaceY=i*(_max_distance_to_player+this._game._utils.get_random_in_range(3000,7000));
				_position.y+=_spaceY;
				
			let _planet=new Planet({scene: this._game._graphics.Scene,radius:_radius,
					position:_position,
					//altitude_atmosphere:70,
					texture_url:null,
					//color_atmosphere:new THREE.Color("lightblue"),
					game:this._game});
				_planet.create({});
				_planet.get_root().rotation.x=(Math.random() * 2 - 1) * Math.PI;
				_planet.get_root().rotation.y=(Math.random() * 2 - 1) * Math.PI;
				_planet.get_root().rotation.z=(Math.random() * 2 - 1) * Math.PI;
				_group.add(_planet.get_root());
				
				
				_planet.main_object.material.map=this.get_next_texture();
		}
		
		return _group;
	}
	
	create_lights(){
		let light = new THREE.DirectionalLight(0xFFFFFF, 1);
        light.position.set(500, 100, -100);
        light.target.position.set(0, 0, 0);
        light.castShadow = false;
        this._game._graphics.Scene.add(light);
		
		light = new THREE.DirectionalLight(0x404040, 1);
      light.position.set(500, 100, -100);
      light.target.position.set(0, 0, 0);
      light.castShadow = false;
      this._game._graphics.Scene.add(light);

      light = new THREE.DirectionalLight(0x404040, 1);
      light.position.set(500, 100, -100);
      light.target.position.set(0, 0, 0);
      light.castShadow = false;
      this._game._graphics.Scene.add(light);

      light = new THREE.DirectionalLight(0x202040, 1);
      light.position.set(500, -100, 100);
      light.target.position.set(0, 0, 0);
      light.castShadow = false;
      this._game._graphics.Scene.add(light);
	  
	}
}
export {SpaceGameMap}

class Star{
	constructor(params){
		this._params=params;
		this._game=params.game;
		this.tha = 0;
		//this.ctha = 0;
		this.R = 15;
		this._update_fc=(timeInSeconds)=>{
			this.update(timeInSeconds);
		 };
		this._game.add_to_update_function_list(this._update_fc);
		
	}
	update(){
		
		this.tha += .13;
		
		this.proton.update();
		
	}
	change_position(x,y,z){
		this.emitter1.p.x+=x;
		this.emitter1.p.y+=y;
		this.emitter1.p.z+=z;
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
	
	destroy_system() {
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
		//this.proton.removeEmitter(this.emitter2);
		this.proton.destroy();
		this._game.remove_function_from_update_list(this._update_fc);
		
	}	
	createSprite() {
        var map = new THREE.TextureLoader().load(this._params.particle_path);
		//var map = new THREE.CanvasTexture(this._game._image_preloader.getImage('particle5'));
        var material = new THREE.SpriteMaterial({
            map: map,
            color: 0xff0000,
            blending: THREE.AdditiveBlending,
            fog: true
        });
        return new THREE.Sprite(material);
    }
	create_system_1(position,direction){
		this._position=position;
		this._direction=direction;
		
		this.addProton(position);
	}
	createEmitter(x, y, z, color1, color2) {
        var emitter = new Proton.Emitter();
         emitter.rate = new Proton.Rate(
          new Proton.Span(1, 2),
          new Proton.Span(0.04, 0.08)
        );
        emitter.addInitialize(new Proton.Mass(1));
        emitter.addInitialize(new Proton.Life(1));
        emitter.addInitialize(new Proton.Body(this.createSprite()));
        emitter.addInitialize(new Proton.Radius(this._params.radius));

        emitter.addBehaviour(new Proton.Color("#F71C33", "#F71C33"));
        
        emitter.emit();
		
		

        return emitter;
    }
}

class ModelMG{
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