import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';

import {Rocket1} from './units/rocket-1.js';
import {PlayerEntity} from './player-entity.js';
import {ParticleSystem} from './particle-system.js';
//import {FireBall_1} from './units/skill-fire-ball-1.js';
import {thruster} from './thruster.js';
import {blaster} from './units/blaster.js';

//import {Thruster2} from './units/thruster2.js';
let _velocity=0.6;//engine spark
let _size=0.4;

class PlayerShip3 extends PlayerEntity{
	constructor(params){
		params.speed_list=[0.5,1,1.5,2.5,3,4];
		params.laser_color=new THREE.Color(9, 30, 245);
		params.shoot_delay=0.6;//thời gian delay giữa 2 lần bắn
		params.max_health=params.game._parameters._standard_hp*2;
		params.health=params.max_health;
		params.damage=params.game._parameters._standard_hp/10;
		params.level_rate=1.5;//he so nhan
		params.blaster_sound_id="blaster1";
		super(params);
		this._blaster_system_id='_player_blasterSystem'+this._my_unique_id;
		this._thruster_id1='_player_thruster1_'+this._my_unique_id;
		this._thruster_id2='_player_thruster2_'+this._my_unique_id;
		
		this._skills=['light-ball','light-shield','speed-up'];////speed-up phai de o cuoi cung
		
			try{
			let _engine_object=new THREE.Object3D();
			_engine_object.visible=false;
			this._engine_object=_engine_object;
			this._model.add(_engine_object);
			_engine_object.position.set(0,0.9,2);
			this._sparks = new Sparks({
				 game:this._game,
				parent:_engine_object,
				camera: this._game._graphics.Camera,
				position:new THREE.Vector3(0,0,0),
			});
			
			let _update_sparks=(timeElapsedS)=>{
				this._sparks.Step(timeElapsedS);
			};
			this._game.add_to_update_function_list(_update_sparks);
			this.add_to_after_dead_function_list(()=>{
				this._game.remove_function_from_update_list(_update_sparks);
			});
			
			
			this._game._gear_box.add_change_gear_function(()=>{
			let _gear=this._game._gear_box.get_current_gear();
			if(typeof _gear === 'number'){
				_gear=parseInt(_gear);
				if(_gear===1){
					_size=0.1;
					_velocity=0.2;
					return;
				}
				if(_gear===2){
					_size=0.15;
					_velocity=0.3;
					return;
				}
				if(_gear===3){
					_size=0.2;
					_velocity=0.4;
					return;
				}
				if(_gear===4){
					_size=0.25;
					_velocity=0.5;
					return;
				}
				if(_gear===5){
					_size=0.3;
					_velocity=0.6;
					return;
				}
				_size=0.4;
				_velocity=0.6;
					return;
			}
			
		});
		
			}catch(e){}
	}
	
	
	activeEngine(){//overwrite
		this._engine_object.visible=true;
	}
	stopEngine(){//overwrite
		this._engine_object.visible=false;
	}
	init_skills(){//overwrite
		this._main_skill_ids=[3,1001,1002];
		this._skills=new Array();
		for(let i=0;i<this._main_skill_ids.length;i++){
			const _id=this._main_skill_ids[i];
			const _name=this.get_main_skill_name(_id);
			this._skills.push(_name);
		}
		super.init_skills();
	}
	
	create_light_ball_icon(_shipclass){
		/*
		const _rocket_icon_container=document.createElement("div");
		_rocket_icon_container.classList.add("neonShadow");
		_rocket_icon_container.style.width=_shipclass._skill_icon_width;
		_rocket_icon_container.style.height=_shipclass._skill_icon_width;
		_shipclass._skill_panel.appendChild(_rocket_icon_container);
		let _rocket_num_label=document.createElement("div");
		const _rocket_icon=document.createElement("img");
		_rocket_icon.src="./resources/icons/skills/Untitled1.png";
		_rocket_icon.style.width=_shipclass._skill_icon_width;
		_rocket_icon.style.height=_shipclass._skill_icon_width;
		_rocket_icon.style.border="white solid 1px";
		_rocket_icon.style.borderRadius="50px";
		_rocket_icon_container.appendChild(_rocket_icon);
		*/
		const _rocket_icon_container=_shipclass.create_skill_icon(_shipclass,"./resources/icons/skills/Untitled1.png");
		_shipclass._lock_continuous_rocket_skill=false;
		let _rocket_num=100;
		let _perform_continuous_rockets_fc=()=>{
				if(_shipclass._lock_continuous_rocket_skill)return;
				_shipclass._lock_continuous_rocket_skill=true;
				_shipclass._params.game.add_to_timer(()=>{
					_shipclass._lock_continuous_rocket_skill=false;
				},10);
				
				if(_rocket_num<=0)return;
				_shipclass.apply_light_ball_skill(_shipclass);
				
				_rocket_num--;
				
		};
		_shipclass.create_light_ball_icon._perform_fc=_perform_continuous_rockets_fc;
		_rocket_icon_container.addEventListener("click",_perform_continuous_rockets_fc);
		/*
		_rocket_num_label.innerHTML=_rocket_num;
		_rocket_num_label.style.position="absolute";
		_rocket_num_label.style.width="10px";
		_rocket_num_label.style.height="10px";
		_rocket_num_label.style.top="-5px";
		_rocket_num_label.style.left="-5px";
		_rocket_num_label.style.color="white";
		_rocket_num_label.style.fontSize="20px";
		_rocket_icon_container.appendChild(_rocket_num_label);
		*/
		
		return _rocket_icon_container;
	}
	
	
	
	use_blaster_and_direction_custom(){
		
	   this._game._entities[this._blaster_system_id] = new blaster.BlasterSystem(//LASER GUN
        {
			parent_entity:this,
            game: this._game,
			camera:this._game._graphics.Camera,
            texture: "./resources/blaster.jpg",
            visibility: this._game._visibilityGrid,
			radius:7.0,
			damage:this.get_space_ship_damage(),
			size:4
        });
		this._params.blasterSystem=this._game._entities[this._blaster_system_id];
	
	}
	
	create_skill_panel(){
		super.create_skill_panel();
		//this.create_speed_up_icon();
		
	}
}

export{PlayerShip3}



const _VS = `
uniform float pointMultiplier;

attribute float size;
attribute float angle;
attribute vec4 colour;

varying vec4 vColour;
varying vec2 vAngle;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = size * pointMultiplier / gl_Position.w;

  vAngle = vec2(cos(angle), sin(angle));
  vColour = colour;
}`;

const _FS = `

uniform sampler2D diffuseTexture;

varying vec4 vColour;
varying vec2 vAngle;

void main() {
  vec2 coords = (gl_PointCoord - 0.5) * mat2(vAngle.x, vAngle.y, -vAngle.y, vAngle.x) + 0.5;
  gl_FragColor = texture2D(diffuseTexture, coords) * vColour;
}`;


class LinearSpline {
  constructor(lerp) {
    this._points = [];
    this._lerp = lerp;
  }

  AddPoint(t, d) {
    this._points.push([t, d]);
  }

  Get(t) {
    let p1 = 0;

    for (let i = 0; i < this._points.length; i++) {
      if (this._points[i][0] >= t) {
        break;
      }
      p1 = i;
    }

    const p2 = Math.min(this._points.length - 1, p1 + 1);

    if (p1 == p2) {
      return this._points[p1][1];
    }

    return this._lerp(
        (t - this._points[p1][0]) / (
            this._points[p2][0] - this._points[p1][0]),
        this._points[p1][1], this._points[p2][1]);
  }
}

class Sparks{
  constructor(params) {
	  this._game=params.game;
	   const _image = this._game._image_preloader.getImage('particle3');
	  const texture = new THREE.Texture(_image);
	  texture.needsUpdate = true;
    const uniforms = {
        diffuseTexture: {
            //value: new THREE.CanvasTexture(this._game._image_preloader.getImage('particle3'))
			value:texture
        },
        pointMultiplier: {
            value: window.innerHeight / (2.0 * Math.tan(0.5 * 60.0 * Math.PI / 180.0))
        }
    };

    this._material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: _VS,
        fragmentShader: _FS,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        transparent: true,
        vertexColors: true
    });

    this._camera = params.camera;
    this._particles = [];

    this._geometry = new THREE.BufferGeometry();
    this._geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
    this._geometry.setAttribute('size', new THREE.Float32BufferAttribute([], 1));
    this._geometry.setAttribute('colour', new THREE.Float32BufferAttribute([], 4));
    //this._geometry.setAttribute('angle', new THREE.Float32BufferAttribute([], 1));

    this._points = new THREE.Points(this._geometry, this._material);

    params.parent.add(this._points);
	this._points.position.copy(params.position);
	
	//this._points.position.set(7500,100,-50);

    this._alphaSpline = new LinearSpline((t, a, b) => {
      return a + t * (b - a);
    });
    this._alphaSpline.AddPoint(0.0, 0.0);
    this._alphaSpline.AddPoint(0.1, 1.0);
    this._alphaSpline.AddPoint(0.6, 1.0);
    this._alphaSpline.AddPoint(1.0, 0.0);

    this._colourSpline = new LinearSpline((t, a, b) => {
      const c = a.clone();
      return c.lerp(b, t);
    });
    this._colourSpline.AddPoint(0.0, new THREE.Color(0xFFFF80));
    this._colourSpline.AddPoint(1.0, new THREE.Color(0xFF8080));

    this._sizeSpline = new LinearSpline((t, a, b) => {
      return a + t * (b - a);
    });
    this._sizeSpline.AddPoint(0.5, 1.0);
    //this._sizeSpline.AddPoint(0.5, 5.0);
    //this._sizeSpline.AddPoint(1.0, 1.0);
	
	//this._sizeSpline.AddPoint(1.0, 0.0);
	//this._sizeSpline.AddPoint(1.0, 0.0);
	//this._sizeSpline.AddPoint(1.0, 0.0);

    document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
  
    this._UpdateGeometry();
  }
	
  _getMesh(){
	  return this._points;
  }

  _onKeyUp(event) {
    switch(event.keyCode) {
      case 32: // SPACE
        this._AddParticles();
        break;
    }
  }

  _AddParticles(timeElapsed) {
    if (!this.gdfsghk) {
      this.gdfsghk = 0.0;
    }
   
    for (let i = 0; i < 1; i++) {
      const life = (Math.random() * 0.75 + 0.25) * 10.0;
      this._particles.push({
          position: new THREE.Vector3(
              0.0,
              0.0,
             0.0),
          size:  _size,
          colour: new THREE.Color(),
          alpha: 1.0,
          life: life,
          maxLife: life,
          rotation: Math.random() * 2.0 * Math.PI,
          velocity: new THREE.Vector3(0, 0.0, _velocity),
      });
    }
  }

  _UpdateGeometry() {
	if(!this._first)this._first=true;
	
	  
    const positions = [];
    const sizes = [];
    const colours = [];
    const angles = [];

    for (let p of this._particles) {
      positions.push(p.position.x, p.position.y, p.position.z);
      colours.push(p.colour.r, p.colour.g, p.colour.b, p.alpha);
      sizes.push(p.currentSize);
      //angles.push(p.rotation);
    }
	
    this._geometry.setAttribute(
        'position', new THREE.Float32BufferAttribute(positions, 3));
    
    this._geometry.attributes.position.needsUpdate = true;
	
	
	if(this._first){
		this._geometry.setAttribute(
			'size', new THREE.Float32BufferAttribute(sizes, 1));
		this._geometry.setAttribute(
			'colour', new THREE.Float32BufferAttribute(colours, 4));
		//this._geometry.setAttribute(
			//'angle', new THREE.Float32BufferAttribute(angles, 1));
			
		this._geometry.attributes.size.needsUpdate = false;
		this._geometry.attributes.colour.needsUpdate = false;
		//this._geometry.attributes.angle.needsUpdate = false;
		
	}
	else{
		this._geometry.attributes.size.needsUpdate = false;
		this._geometry.attributes.colour.needsUpdate = false;
		this._geometry.attributes.angle.needsUpdate = false;
	}
	
	
	this._first=false;
  }

  _UpdateParticles(timeElapsed) {
    for (let p of this._particles) {
      p.life -= timeElapsed;
    }

    this._particles = this._particles.filter(p => {
      return p.life > 0.0;
    });
	
	let _counter=0;
    for (let p of this._particles) {
	  
      const t = 1.0 - p.life / p.maxLife;

      p.rotation += timeElapsed * 0.5;
      p.alpha = this._alphaSpline.Get(t);
	  //p.currentSize = p.size*this._sizeSpline.Get(t);
      p.currentSize = p.size+(_counter*0.03);
      p.colour.copy(this._colourSpline.Get(t));

      p.position.add(p.velocity.clone().multiplyScalar(timeElapsed));
	  

      const drag = p.velocity.clone();
      drag.multiplyScalar(timeElapsed * 0.1);
      drag.x = Math.sign(p.velocity.x) * Math.min(Math.abs(drag.x), Math.abs(p.velocity.x));
      drag.y = Math.sign(p.velocity.y) * Math.min(Math.abs(drag.y), Math.abs(p.velocity.y));
      drag.z = Math.sign(p.velocity.z) * Math.min(Math.abs(drag.z), Math.abs(p.velocity.z));
      p.velocity.sub(drag);
	  
	  _counter++;
    }
	
  }

  Step(timeElapsed) {
    this._AddParticles(timeElapsed);
    this._UpdateParticles(timeElapsed);
    this._UpdateGeometry();
  }
}


//--------------

