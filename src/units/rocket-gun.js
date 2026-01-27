import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';

import {LandUnit} from './land-unit.js';
import {Rocket1} from './rocket-1.js';
import {Rocket2} from './rocket-2.js';
import {Rocket3} from './rocket-3.js';
import {Rocket4} from './rocket-4.js';
//import {SpaceShip} from './space-ship.js';
/*
	Thực tế ko liên quan tới LandUnit nên phần tính toán các thông số dựa trên level sẽ tạm thực hiện tại unitMG.js
*/
let _velocity=0.4;//engine spark
let _size=0.06;
let _delay=4;
//let _lock=false;
class RocketGun1 extends LandUnit{
	constructor(params){//try{
		params.laser_color=new THREE.Color(210, 4, 243);
		params.shoot_delay=0.5;//thời gian delay giữa 2 lần bắn
		params.accuracy=99/100;
		super(params);
		
		this._level=params.level;
		
		const x = 0.1;
		const y = 0.02;
		const z = 0.1;
		this._offsets = [//vị trí của nòng súng
			new THREE.Vector3(-x, y, -z),
			new THREE.Vector3(x, y, -z)
		];
		this._focus_target=null;
		this._parent_unit=params.parent_unit;
		this._auto_aim=params.auto_aim;
		
		this._lock_rocket=false;
		
		let _engine_object=new THREE.Object3D();
			_engine_object.visible=false;
			this._engine_object=_engine_object;
			this._model.add(_engine_object);
			_engine_object.position.set(0,0,0);
			this._sparks = new Sparks({
				 game:this._game,
				parent:_engine_object,
				camera: this._game._graphics.Camera,
				position:new THREE.Vector3(0,1.35,-2.24),
			});
		
			let _update_sparks=(timeElapsedS)=>{
				this._sparks.Step(timeElapsedS);
			};
			this._game.add_to_update_function_list(_update_sparks);
			this.add_to_after_dead_function_list(()=>{
				this._game.remove_function_from_update_list(_update_sparks);
			});
		
		//this.change_direction_mode();//khi add vào Player._model thì direction bị ảnh hưởng
	//}catch(e){alert(e.toString());}
	}
	Fire() {//overwrite
		if(this._lock_rocket)return;
		this._lock_rocket=true;
		this._game.add_to_timer(()=>{
			this._lock_rocket=false;
		},_delay);
		
		//try{
			let gltf=this._game._unitMG._data_list["missile-1"];
			const model = gltf.scene.children[0];
			model.scale.setScalar(2.5);
			model.rotation.z=Math.PI;
		let _rocket=this._game._unitMG.create_uncombat_unit(Rocket2,model,this.get_world_position(),false);
			_rocket._unit=this._game._me;
			_rocket._player_id=this._parent_unit._player_id;
			let _plus_damage=_rocket._damage*(this._game._parameters.spaceship_passive_skills_level_rate*this._level);
			_rocket._damage+=_plus_damage;
			//this._game._noticeBoard.add_message("RocketDamage:"+_rocket._damage);
			//_rocket.emit_time=2.0;
			//_rocket._missile_speed=100*this._game._parameters._standard_rocket_speed;
			_rocket.launch('particle15',10);
			this._game._graphics.Scene.add(_rocket._model);
			_rocket.look_at(this._parent_unit.getFrontAbovePos(200,5));
			
			this._game._sound.play('rocket-7');
		//}catch(e){alert(e.stack);}
	}
	TakeDamage(){//overwrite
	
	};
	CheckTarget(){
		this._model.lookAt(this._parent_unit.getFrontPos(500));
		if(this._game._gear_box.is_running()){
			this._engine_object.visible=true;
		}
		else{
			this._engine_object.visible=false;
		}
		if(this._params.game._unitMG._combat_unit_list.length===0){
			
			return;
		}
		if(this._focus_target===null||this._focus_target.Dead){
			let _found=false;
			const _player_pos=this.get_world_position();
			let _distance_1=9999999;
			for(var i=0;i<this._params.game._unitMG._combat_unit_list.length;i++){
				let _next_target=this._params.game._unitMG._combat_unit_list[i];
				if(!_next_target.Dead){
					const _distance_2=_next_target.get_world_position().distanceTo(_player_pos);
					if(_distance_2<_distance_1){
						_distance_1=_distance_2;
						this._focus_target=_next_target;
						_found=true;
						
					}
					
					//break;
				}
			}
			//if(!_found)alert("Game Over");
			return;
		}
	//}catch(e){alert(e.toString());}
		const _tpos=new THREE.Vector3();
		this._focus_target._model.getWorldPosition(_tpos);
		
		const randomNumber1 = Math.floor(Math.random() * 4)/this._accuracy;
		_tpos.x+=randomNumber1;
		const randomNumber2 = Math.floor(Math.random() * 4)/this._accuracy;
		_tpos.y+=randomNumber2;
		const randomNumber3 = Math.floor(Math.random() * 4)/this._accuracy;
		_tpos.z+=randomNumber3;
		
		if(this._auto_aim)this._model.lookAt(_tpos);
		
		if(this.get_world_position().distanceTo(_tpos)<400){
			
			this.Fire();
		}
	}
	
}

export{RocketGun1};


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
    const uniforms = {
        diffuseTexture: {
            value: new THREE.CanvasTexture(this._game._image_preloader.getImage('particle21'))
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
