import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {Spacecraft} from './spacecraft.js';

let _velocity=0.4;//engine spark
let _size=0.1;
let _particleID='particle17';
//let _particleColor=null;

class Rocket3 extends Spacecraft {
	constructor(params){
		
		params.health=99999999;
		params.damage=params.game._parameters._standard_hp/2;
		
		super(params);
		
		if(typeof params.engine_velocity!='undefined')
			_velocity=params.engine_velocity;
		if(typeof params.spark_size!='undefined')
			_size=params.spark_size;
		if(typeof params.particle_id!='undefined')
			_particleID=params.particle_id;
		if(typeof params.particle_color!='undefined')
			this._particleColor=params.particle_color;
		else
			this._particleColor=null;
		
		this._unit=params.unit;
		
		this._radius_effect1=15*this._game.rocket_multiplier;//khoảng cách mà khi tên lửa ở gần mục tiêu sẽ phát nổ
		this._radius_effect2=25*this._game.rocket_multiplier;//bán kính tầm ảnh hưởng của vụ nổ
		this._origin_position=this.get_world_position();//vị trí ban đầu
		
		if(typeof params.rocket_range!='undefined')
			this._max_distance=params.rocket_range;
		else
			this._max_distance=800;//quãng đường xa nhất tên lửa có thể bay đi
		this._max_distance=this._max_distance*this._game.rocket_multiplier;
		
		if(typeof params.rocket_speed!='undefined')
			this._missile_speed=params.rocket_speed;
		else
			this._missile_speed=1.7;
		this._missile_speed=this._missile_speed*this._game._parameters._standard_rocket_speed;
		
		this._first_phase=true;
		this._first_phase_speed=this._missile_speed*2;
		
		
		let _engine_object=new THREE.Object3D();
			//_engine_object.visible=false;
			this._engine_object=_engine_object;
			this._model.add(_engine_object);
			_engine_object.position.set(0,0,3);
			this._sparks = new Sparks({
				 game:this._game,
				parent:_engine_object,
				camera: this._game._graphics.Camera,
				position:new THREE.Vector3(0,0,0),
				color:this._particleColor
			});
			
			
			let _update_sparks=(timeElapsedS)=>{
				this._sparks.Step(timeElapsedS);
			};
			this._game.add_to_update_function_list(_update_sparks);
			this.add_to_after_dead_function_list(()=>{
				this._game.remove_function_from_update_list(_update_sparks);
			});
		
		this._lock=true;
	}
	
	launch(){
		
		this._lock=false;
		this._alive=true;
		//this._first_phase=true;
		//this._first_phase_speed=this._missile_speed*2;
		this._game.add_to_timer(()=>{
			this._first_phase=false;
			this._game._sound.play('rocket-7');
		},1);
		this._game.add_to_timer(()=>{
			this._alive=false;
		},7);
	}
	
	SelfDestroy(){
		super.SelfDestroy();
		this._params.game._entities['_explosionSystem'].Splode(this.Position,"#EF2F0D","#EF2F0D",24,96);
		
	}
	
	CheckTarget(timeInSeconds){
		if(this._lock)return;
		const _position=this.Position;
		const _distance1=_position.distanceTo(this._origin_position);
			if(!this._alive){
				this.SelfDestroy();
			}
			
			let _ship_speed=this._unit.get_average_speed();
			
			if(this._first_phase){
				
				if(_position.distanceTo(this._unit.Position)>5)
					this._first_phase_speed-=timeInSeconds*400;
				else
					this._first_phase_speed-=timeInSeconds*100;
				
				if(this._first_phase_speed<30)this._first_phase_speed=30;
				this._first_phase_speed+=timeInSeconds*_ship_speed;
				this.move_forward(timeInSeconds*this._first_phase_speed);
				return;
			}
			
			this.move_forward(timeInSeconds*(this._missile_speed+_ship_speed));
			
			//const _targets=this._game._unitMG.get_enemy_combat_unit_in_range(_position,this._radius_effect1);
			const _targets=this._game._unitMG.get_enemy_combat_unit_in_range_3(this,_position,this._radius_effect1);
			for(let i=0;i<_targets.length;i++){
				const _target=_targets[i][0];
				const _distance=_targets[i][1];
				let _damage=this._damage;
				if(_distance>this._radius_effect2*3/4)_damage=this._damage/3;
				if(_distance>this._radius_effect2*1/2)_damage=this._damage/2;
				
				//_target.TakeDamage(_damage);
				_target.Take_Damage(this._unit,this.constructor.name,super.constructor.name,_damage);
			}
			if(_targets.length>0)this.SelfDestroy();
	}
}

export{Rocket3};



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
	  const _image = this._game._image_preloader.getImage(_particleID);
	  const texture = new THREE.Texture(_image);
	  texture.needsUpdate = true;
    const uniforms = {
        diffuseTexture: {
            //value: new THREE.CanvasTexture(this._game._image_preloader.getImage(_particleID))
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
	
	let _color;
	if(params.color!=null)
		_color=new THREE.Color(params.color);
	else
		_color=new THREE.Color(0xFFFF80);
	
    this._colourSpline.AddPoint(0.0, _color);
    this._colourSpline.AddPoint(1.0, _color);

    this._sizeSpline = new LinearSpline((t, a, b) => {
      return a + t * (b - a);
    });
    this._sizeSpline.AddPoint(0.5, 1.0);
    //this._sizeSpline.AddPoint(0.5, 5.0);
    //this._sizeSpline.AddPoint(1.0, 1.0);
	
	//this._sizeSpline.AddPoint(1.0, 0.0);
	//this._sizeSpline.AddPoint(1.0, 0.0);
	//this._sizeSpline.AddPoint(1.0, 0.0);

    //document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
  
    this._UpdateGeometry();
  }
	
  _getMesh(){
	  return this._points;
  }

/*  _onKeyUp(event) {
    switch(event.keyCode) {
      case 32: // SPACE
        this._AddParticles();
        break;
    }
  }
  */

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
