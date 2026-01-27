import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';


import {Planet} from './planet.js';
//import {Earth} from './earth.js';

import {Meteorite2} from './meteorite2.js';

import {StarGate} from './star-gate.js';

class BaseStarSystem{
	constructor(params){
		this._params=params;
		this._game=params.game;
		this._position=params.position;
		this._planets=new Array();
		
		this.init();
		
		let _update_fc=(timeInSeconds)=>{
			this.update(timeInSeconds);
		 };
		this._game.add_to_update_function_list(_update_fc);
		
		this._after_all_earth_satellites_destroyed=()=>{};//toan bo ve tinh cua trai dat bi tieu diet
	}
	
	update(t){
		return;//<=============
		
		for(let i=0;i<this._planets.length;i++){
			const _planet=this._planets[i];
			//if(_planet===this._earth)continue;
			this._game._utils.rotateAboutPoint(_planet.get_root(),this._position,this._game._utils.axisY,t*_planet._my_rotate_speed,true);
		}
	}
	
	init(){
		
		let _distance=15000;//khoang cach giua 2 hanh tinh
		
		this._mercury_pos=this._position.clone();
		this._mercury_pos.x+=9000;
		
		this._venus_pos=this._position.clone();
		this._venus_pos.x+=this._mercury_pos.x+_distance;
		
		this._earth_pos=this._position.clone();
		this._earth_pos.x=this._mercury_pos.x+(_distance*2);
		
		this._mars_pos=this._position.clone();
		this._mars_pos.x+=this._mercury_pos.x+(_distance*3)+3000;
		this._mars_pos.y+=13000;
		
		this._jupiter_pos=this._position.clone();
		this._jupiter_pos.x+=this._mercury_pos.x+(_distance*4);
		this._jupiter_pos.y+=13000;
		
		this._saturn_pos=this._position.clone();
		this._saturn_pos.x+=this._mercury_pos.x+(_distance*5);
		this._saturn_pos.y-=9000;
		
		this._uranus_pos=this._position.clone();
		this._uranus_pos.x+=this._mercury_pos.x+(_distance*6);
		
		this._neptune_pos=this._position.clone();
		this._neptune_pos.x+=this._mercury_pos.x+(_distance*7);
		
		this._pluto_pos=this._position.clone();
		this._pluto_pos.x+=this._mercury_pos.x+(_distance*8);
		
		//this.create_sun();
		
		let _earth=this.create_earth();
		this._earth=_earth;
		
		this._earth_radius=_earth._params.radius;//alert(this._earth_radius);
		
		let _mercury=this.create_mercury();
		let _venus=this.create_venus();
		
		let _mars=this.create_mars();
		let _jupiter=this.create_jupiter();
		let _saturn=this.create_saturn();
		let _uranus=this.create_uranus();
		let _neptune=this.create_neptune();
		let _pluto=this.create_pluto();
		
		_earth._able_to_create_base=false;
		
		_mercury._my_rotate_speed=0.005;//_my_rotate_speed chi su dung trong class nay, ko anh huong toi class khac
		_venus._my_rotate_speed=0.005;
		_earth._my_rotate_speed=0.0;
		_mars._my_rotate_speed=0.01;
		_jupiter._my_rotate_speed=0.007;
		_saturn._my_rotate_speed=0.0025;
		_uranus._my_rotate_speed=0.0015;
		_neptune._my_rotate_speed=0.017;
		_pluto._my_rotate_speed=0.015;
		this._planets.push(_mercury,_venus,_earth,_mars,_jupiter,_saturn,_uranus,_neptune,_pluto);//theo dung' thu' tu
		
		
		let _randAngle = Math.random() * (Math.PI * 2);
		this._game._utils.rotateAboutPoint(_mercury.get_root(), this._position, this._game._utils.axisY,Math.PI*1.6, true);
		_randAngle = Math.random() * (Math.PI * 2);
		this._game._utils.rotateAboutPoint(_venus.get_root(), this._position, this._game._utils.axisY, Math.PI*2.5, true);
		_randAngle = Math.random() * (Math.PI * 2);
		this._game._utils.rotateAboutPoint(_earth.get_root(), this._position, this._game._utils.axisY, Math.PI*1.1, true);
		_randAngle = Math.random() * (Math.PI * 2);
		this._game._utils.rotateAboutPoint(_mars.get_root(), this._position, this._game._utils.axisY, Math.PI*5.4, true);
		_randAngle = Math.random() * (Math.PI * 2);
		this._game._utils.rotateAboutPoint(_jupiter.get_root(), this._position, this._game._utils.axisY, Math.PI*7.1, true);
		_randAngle = Math.random() * (Math.PI * 2);
		this._game._utils.rotateAboutPoint(_saturn.get_root(), this._position, this._game._utils.axisY,Math.PI*3.3, true);
		_randAngle = Math.random() * (Math.PI * 2);
		this._game._utils.rotateAboutPoint(_uranus.get_root(), this._position, this._game._utils.axisY,Math.PI*1.7, true);
		_randAngle = Math.random() * (Math.PI * 2);
		this._game._utils.rotateAboutPoint(_neptune.get_root(), this._position, this._game._utils.axisY,Math.PI*2.1, true);
		_randAngle = Math.random() * (Math.PI * 2);
		this._game._utils.rotateAboutPoint(_pluto.get_root(), this._position, this._game._utils.axisY,Math.PI*4.9, true);
		
		
		let _meteorite1=new Meteorite2({game:this._game,color1:"#F7511C",color2:"#F7511C"});
		this._earth_pos=_earth.get_world_position();
		let _meteo_pos1=this._earth_pos.clone();
		_meteo_pos1.x+=this._earth_radius*4;
		_meteorite1.init(_meteo_pos1,new THREE.Vector3(1,0,0));
		_meteorite1.set_motion({
			name:'circle',
			point:this._earth_pos,
			axis:this._game._utils.axisY,
			theta:0.07
		});
		
		let _meteorite2=new Meteorite2({game:this._game,color1:"#F7511C",color2:"#F7511C"});
		let _meteo_pos2=this._earth_pos.clone();
		_meteo_pos2.x+=this._earth_radius*7.5;
		_meteorite2.init(_meteo_pos2,new THREE.Vector3(1,0,0));
		_randAngle = Math.random() * (Math.PI * 2);
		this._game._utils.rotateAboutPoint(_meteorite2._ball, this._position, this._game._utils.axisY,_randAngle, true);
		_meteorite2.set_motion({
			name:'circle',
			point:this._position,
			axis:this._game._utils.axisY,
			theta:-0.04
		});
		
		
		
		//this.create_satellites(5);
		
	}
	
	create_star_gate(){
		let _star_gate_pos=this._earth_pos.clone();
		_star_gate_pos.y+=this._earth_radius*1.5;
		this._star_gate=new StarGate({game:this._game});
		this._star_gate.init(_star_gate_pos);
	}
	
	get_earth(){
		return this._earth;
	}
	get_random_satellite(){
		let _rand_id=Math.floor(Math.random() * this._earth_sattlites.length);
		return this._earth_sattlites[_rand_id];
	}
	create_satellites(_num){//create satellites for earth
		this._earth_sattlites=new Array();
		this._destroyed_satellite_num=0;
		for(let i=0;i<_num;i++){
			let _satellite=this._game._unitMG.create_satellite_1(new THREE.Vector3(0,0,0));
			let _satellite_pos=this._earth.get_world_position();
			_satellite_pos.x+=(this._earth_radius+700);
			this._game._graphics.Scene.add(_satellite._model);
			
			_satellite._model.position.copy(_satellite_pos);
			this._game._utils.rotateAboutPoint(_satellite._model, 
							this._earth.get_world_position(), this._game._utils.axisY,i*Math.PI/5, true);
			
			//_satellite.start_orbit(this._earth.get_world_position(),this._game._utils.axisY,0.03);
			_satellite.create_label_1("<b style='color:yellow;'>Satellite</b>");
			
			this._earth_sattlites.push(_satellite);
			
			_satellite._player_id=this._game._playerID;
			_satellite.add_to_after_dead_function_list(()=>{
				this._destroyed_satellite_num++;
				if(this._destroyed_satellite_num>=this._earth_sattlites.length){
					//alert('Game Over');
					this._after_all_earth_satellites_destroyed();
				}
			});
			
			let _lock_waring=false;
			let _delay=7;
			_satellite._take_damage_fc=()=>{
				if(_lock_waring)return;
				_lock_waring=true;
				this._game.add_to_timer(()=>{
					_lock_waring=false;
				},_delay);
				
				this._game.show_message_box_2('alert','Warning!',"The satellites are under attack!",_delay);
				this._game._sound.play2('alarm2');
			};
			
		}
	}
	remove_satellites(){
		
	}
	
	create_sun(){
		//let _sun=new Sun({game:this._game});
		//_sun.create_system_1(this._position,new THREE.Vector3(0,1,0));
		let _sun=new Star({game:this._game,
							 particle_path:"./resources/particle-old-2/noname-39.png",//39,44
							 radius:5000});
			_sun.create_system_1(this._position);
		
		return _sun;
	}
	
	create_earth(){
		let _earth=new BasePlanet({scene: this._game._graphics.Scene,game:this._game});
		//let _earthPos=new THREE.Vector3(9500,0,-996999);
	    _earth.create(this._earth_pos);
		this._game._me._model.lookAt(this._earth_pos);
		
		return _earth;
	}
	create_mars(){
		let _mars=new Planet({scene: this.Scene,radius:this._earth_radius*3.3,
			position:this._mars_pos,
			altitude_atmosphere:100,
			texture_url:"./texture/Demo/2.png",
			color_atmosphere:new THREE.Color(0xF50909),game:this._game});
	   _mars.create({});
	   this._game._graphics.Scene.add(_mars.get_root());
	   return _mars;
	}
	create_neptune(){
		let _neptune=new Planet({scene: this.Scene,radius:this._earth_radius*2,position:this._neptune_pos,
					altitude_atmosphere:100,
					texture_url:"./texture/Demo/3.png",
					color_atmosphere:new THREE.Color(0x034d8e)});
	  _neptune.create();
	  this._game._graphics.Scene.add(_neptune.get_root());
	  
	  return _neptune;
	}
	
	create_jupiter(){
		let _jupiter=new Planet({scene: this.Scene,radius:this._earth_radius*1.5,position:this._jupiter_pos,
					altitude_atmosphere:100,
					texture_url:"./texture/Demo/4.png",
					color_atmosphere:new THREE.Color(0x034d8e)});
	  _jupiter.create();
	  this._game._graphics.Scene.add(_jupiter.get_root());
	  
	  return _jupiter;
	}
	
	create_mercury(){
		let _mercury=new Planet({scene: this.Scene,radius:this._earth_radius*0.5,position:this._mercury_pos,
					altitude_atmosphere:100,
					texture_url:"./texture/Demo/5.png",
					color_atmosphere:new THREE.Color(0x034d8e)});
	  _mercury.create();
	  this._game._graphics.Scene.add(_mercury.get_root());
	  
	  return _mercury;
	}
	
	create_venus(){
		let _venus=new Planet({scene: this.Scene,radius:this._earth_radius*0.6,position:this._venus_pos,
					altitude_atmosphere:100,
					texture_url:"./texture/Demo/6.png",
					color_atmosphere:new THREE.Color(0x034d8e)});
	  _venus.create();
	  this._game._graphics.Scene.add(_venus.get_root());
	  
	  return _venus;
	}
	
	create_saturn(){
		let _saturn=new Planet({scene: this.Scene,radius:this._earth_radius*1.1,position:this._saturn_pos,
					altitude_atmosphere:100,
					texture_url:"./texture/saturnmap.jpg",
					color_atmosphere:new THREE.Color(0x034d8e)});
	  _saturn.create();
	  this._game._graphics.Scene.add(_saturn.get_root());
	  
	  return _saturn;
	}
	
	create_uranus(){
		let _uranus=new Planet({scene: this.Scene,radius:this._earth_radius*1,position:this._uranus_pos,
					altitude_atmosphere:100,
					texture_url:"./texture/uranusmap.jpg",
					color_atmosphere:new THREE.Color(0x034d8e)});
	  _uranus.create();
	  this._game._graphics.Scene.add(_uranus.get_root());
	  
	  return _uranus;
	}
	//plutomap1k
	create_pluto(){
		let _pluto=new Planet({scene: this.Scene,radius:this._earth_radius*2.2,position:this._pluto_pos,
					altitude_atmosphere:100,
					texture_url:"./texture/plutomap1k.jpg",
					color_atmosphere:new THREE.Color(0x034d8e)});
	  _pluto.create();
	  this._game._graphics.Scene.add(_pluto.get_root());
	  
	  return _pluto;
	}
	
}


class Sun{
	constructor(params){
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
		
        //this.emitter1.p.z = this._position.z + this.R * Math.cos(this.tha);
        //this.emitter1.p.x = this._position.x +this.R * Math.sin(this.tha);
		//this.emitter1.p.y = this._position.y;
		//this.emitter1.p.z+=10;
		
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
		
		//this.rotate_system();
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
        var map = new THREE.TextureLoader().load("./src/legion-game/img/dot.png");
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
        emitter.addInitialize(new Proton.Radius(1120));

        emitter.addBehaviour(new Proton.Color("#F71C33", "#F71C33"));
        
        emitter.emit();
		
		

        return emitter;
    }
}

export{BaseStarSystem}

class BasePlanet extends Planet{
	
	create(_position){
		//this._params.texture_url="./texture/2k_earth_daymap.png";
		this._params.radius=2400;
		this._params.position=_position;
		this._params.altitude_atmosphere=250;
		this._params.color_atmosphere=new THREE.Color(0x034d8e);
		super.create();
		
		this._params.scene.add(this.get_root());
		
		let TEXTURE_PATH = './texture/Demo/';
		let geometry = new THREE.SphereGeometry( this._params.radius, 128, 128 );
		let loader = new THREE.TextureLoader();
		loader.setCrossOrigin( 'https://s.codepen.io' );
		let texture = loader.load( TEXTURE_PATH + '1.png' );

		let bump = null;
		bump = loader.load( TEXTURE_PATH + 'Bump.jpg' );
		let spec = null;
		spec = loader.load( TEXTURE_PATH + 'SpecMask.jpg' );
		
		
		//this.main_object.material.color="#ffffff";
		//this.main_object.material.shininess=5;
		this.main_object.material.map=texture;
		//this.main_object.material.specularMap=spec;
		//this.main_object.material.specular="#666666";
		this.main_object.material.bumpMap=bump;
		
		let geometryCloud = new THREE.SphereGeometry( this._params.radius + 35, 128, 128 );
		loader = new THREE.TextureLoader();
		loader.setCrossOrigin( 'https://s.codepen.io' );
		let alpha = loader.load( TEXTURE_PATH + "alphaMap.jpg" );
		let materialCloud = new THREE.MeshPhongMaterial({
			alphaMap: alpha,
		});
		materialCloud.transparent = true;
		let sphereCloud = new THREE.Mesh( geometryCloud, materialCloud );
		this.root.add( sphereCloud );
		
		this._params.game.add_to_update_function_list((timeElapsedS)=>{
			sphereCloud.rotation.y += timeElapsedS*0.01;
		});
	}
	
}