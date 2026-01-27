import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {Spacecraft} from './spacecraft.js';

let _speed1;
let _speed2;
let _targets;
let _velocity=0.0;//engine spark
let _size=12;

class Rocket1 extends Spacecraft {
	
	constructor(params){
		
		params.health=99999999;
		params.damage=params.game._parameters._standard_hp/20;
		
		super(params);
		
		this._radius_effect1=25;//khoảng cách mà khi tên lửa ở gần mục tiêu sẽ phát nổ
		this._radius_effect2=45;//bán kính tầm ảnh hưởng của vụ nổ
		this._origin_position=this.get_world_position();//vị trí ban đầu
		this._max_distance=800*this._game.rocket_multiplier;//quãng đường xa nhất tên lửa có thể bay đi
		_speed1=this._game._parameters._standard_rocket_speed*2;
		_speed2=this._game._parameters._standard_rocket_speed*2.2;
		
		
		//try{
		let _engine_object=new THREE.Object3D();
			//_engine_object.visible=false;
			this._engine_object=_engine_object;
			this._model.add(_engine_object);
			_engine_object.position.set(0,0,0);
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
		//}catch(e){}	
		/*
		 this._sparks = new Sparks({
				 game:this._game,
				parent:this._model,
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
			
			*/
	}
	
	SelfDestroy(){
		super.SelfDestroy();
		//this._params.game._entities['_explosionSystem'].Splode(this.Position,"orange","orange",24,96);
		
	}
	
	CheckTarget(timeInSeconds){
			const _position=this.Position;
			const _t_distance=_position.distanceTo(this._origin_position);
			
			if(_t_distance>this._max_distance){
				this.SelfDestroy();
				return;
			}
			
			if(!this._ahead_point){
				this._ahead_point=this.get_back_point(250);
			}
			
			if(_t_distance<10){
				this.move_forward(timeInSeconds*_speed1);
				if(!this._target_object||this._target_object===null||this._target_object.Dead){
					this._target_object=null;
				
					_targets=this._game._unitMG.get_enemy_combat_unit_in_range_3(this,this._ahead_point,70);
					for(let i=0;i<_targets.length;i++){
						const _target=_targets[i][0];
						if(_target.Dead)continue;
						if(this._utils.calculateAngleDeg(_position,_target.Position,this.get_back_point(100))>60)
							continue;
				
						if(this._target_object===null){
							this._target_object=_target;
							break;
						}
					
					}
				
				}
			}
				
			else{
				this.move_forward(timeInSeconds*_speed2);
				_targets=this._game._unitMG.get_enemy_combat_unit_in_range_3(this,_position,this._radius_effect1);
			
				for(let i=0;i<_targets.length;i++){
					const _target=_targets[i][0];
					if(_target.Dead)continue;
					const _distance=_targets[i][1];
					
					let _damage=this._params.damage;
					if(_distance>this._radius_effect2*3/4)_damage=this._params.damage/3;
					if(_distance>this._radius_effect2*1/2)_damage=this._params.damage/2;
					
					//_target.TakeDamage(_damage);
					//_target.Take_Damage(this._unit,this.constructor.name,super.constructor.name,_damage);
					_target.Take_Damage(this._unit,"main-skill",super.constructor.name,_damage);
				}
				if(_targets!=null&&_targets.length>0){
					this.SelfDestroy();
					/*chi show explosion khi trung' muc tieu*/
					this._params.game._entities['_explosionSystem'].Splode(this.Position,"orange","orange",24,96);
					return;
				}
			}
			
	}
	
}


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
	  const _image = this._game._image_preloader.getImage('particle39');
	  const texture = new THREE.Texture(_image);
	  texture.needsUpdate = true;
    const uniforms = {
        diffuseTexture: {
            //value: new THREE.CanvasTexture(this._game._image_preloader.getImage('particle39'))//35,39
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
	
	this._particles_counter=0;
	
    this._camera = params.camera;
    this._particles = [];

    this._geometry = new THREE.BufferGeometry();
    this._geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
    this._geometry.setAttribute('size', new THREE.Float32BufferAttribute([], 1));
    this._geometry.setAttribute('colour', new THREE.Float32BufferAttribute([], 4));
    this._geometry.setAttribute('angle', new THREE.Float32BufferAttribute([], 1));

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
    this._colourSpline.AddPoint(0.0, new THREE.Color("yellow"));
    this._colourSpline.AddPoint(1.0, new THREE.Color("yellow"));

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
    
	if(this._particles_counter>12)return;
	this._particles_counter++;
	
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
      angles.push(p.rotation);
    }
	
    this._geometry.setAttribute(
        'position', new THREE.Float32BufferAttribute(positions, 3));
    
    this._geometry.attributes.position.needsUpdate = true;
	
	
	if(this._first){
		this._geometry.setAttribute(
			'size', new THREE.Float32BufferAttribute(sizes, 1));
		this._geometry.setAttribute(
			'colour', new THREE.Float32BufferAttribute(colours, 4));
		this._geometry.setAttribute(
			'angle', new THREE.Float32BufferAttribute(angles, 1));
			
		this._geometry.attributes.size.needsUpdate = false;
		this._geometry.attributes.colour.needsUpdate = false;
		this._geometry.attributes.angle.needsUpdate = false;
		
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


export{Rocket1};
