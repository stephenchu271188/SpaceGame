import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {SpaceShip} from './space-ship.js';
import {Sparks} from './skills/sparks.js';
import {FlashEffect1} from './flash-effect-1.js';

class SimpleThunderShip extends SpaceShip {//ban' ra qua cau set'
	
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
	
		//let gltf=this._game._unitMG._data_list["missile-1"];
		//const model = gltf.scene.children[0];
		//model.scale.setScalar(3.5);
		//model.rotation.z=Math.PI;
		const model=new THREE.Object3D();
		let _UnitClass=SimpleMissile;
		let _rocket= this._game._unitMG.create_combat_unit(_UnitClass,model,_pos1,true);
		_rocket._missile_speed=this._rocket_speed;
		_rocket._player_id=this._player_id;//alert(_rocket._player_id);
		_rocket._unit=this;
		this._game._graphics.Scene.add(_rocket._model);
		//_rocket._model.lookAt(_pos2);		
		const _lookPos=this._utils.calculateSymmetricPoint(_rocket._model.position,this._target_object.Position);
		_rocket._model.lookAt(_lookPos);
		
		
		this._game._sound.play('missile-launch');
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
		this._max_distance=900*this._game.rocket_multiplier;//quãng đường xa nhất tên lửa có thể bay đi
		this._missile_speed=0;
		this._damage=params.damage;
		
			 let _smoke=new Smoke({game:this._game,unit:this});
						_smoke._sparks._points.position.set(0,0,0);
						_smoke.set_alpha(1);
						//this._game.add_to_timer(()=>{
							//_smoke.clear();
						//},12);
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
		
	}	
	
	SelfDestroy(){
		super.SelfDestroy();
		//this._params.game._entities['_explosionSystem'].Splode(this.Position,"#109BE7","#109BE7",24,96,12);
		this._params.game._entities['_explosionSystem'].Splode(this.Position,"#FFFFFF","#FFFFFF",24,96);
		this._game.add_to_timer(()=>{
			this.destroy_thruster();
		},2);
		this._game.add_to_timer(()=>{//neu stop update qua' som' thi cac particle chua xoa' di het
			this._game.remove_function_from_update_list(this._update_fc);
		},13);
	}
	
	CheckTarget(timeInSeconds){
			const _position=this.get_world_position();
			if(_position.distanceTo(this._origin_position)>this._max_distance){
				this.SelfDestroy();
			}
			//this.look_at(this.getFrontPos(50));
			this.look_at(this._game._me.Position);
			this.move_forward(timeInSeconds*this._missile_speed);
			//this._model.position.y=this._unit.Position.y;
			//this._model.position.z=this._unit.Position.z+5;
			
			let _targets=this._game._unitMG.get_enemy_combat_unit_in_range_3(this,_position,this._radius_effect1);;
			
			for(let i=0;i<_targets.length;i++){
				const _target=_targets[i][0];
				
				const _distance=_targets[i][1];
				let _damage=this._damage;
				if(_distance>this._radius_effect2*3/4)_damage=this._damage/3;
				if(_distance>this._radius_effect2*1/2)_damage=this._damage/2;
				
				_target.TakeDamage(_damage);
			}
			if(_targets.length>0)this.SelfDestroy();
	}
}

export{SimpleThunderShip};


class Smoke{
	constructor(params){
		this._game=params.game;
		this._unit=params.unit;
		
		this._sparks = new EngineSparks({
				 game:this._game,
				parent:this._unit._model,
				camera: this._game._graphics.Camera,
				position:new THREE.Vector3(0,0,0),
			});
			
			this._update_sparks=(timeElapsedS)=>{
				this._sparks.Step(timeElapsedS);
			};
			
			this._game.add_to_update_function_list(this._update_sparks);
		
	}
	
	set_alpha(_alpha){
		this._sparks.set_alpha(_alpha);
	}
	
	clear(){
		this._game.remove_function_from_update_list(this._update_sparks);
		this._unit._model.remove(this._sparks._points);
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


class EngineSparks{//chùm tia lửa
  constructor(params) {
	  this._game=params.game;
	  const _image = this._game._image_preloader.getImage('particle37');
	  const texture = new THREE.Texture(_image);
	  texture.needsUpdate = true;
    const uniforms = {
        diffuseTexture: {
            //value: new THREE.CanvasTexture(this._game._image_preloader.getImage('particle37'))
			value:texture
        },
        pointMultiplier: {
            value: window.innerHeight / (1.0 * Math.tan(0.5 * 60.0 * Math.PI / 180.0))
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
    this._colourSpline.AddPoint(0.0, new THREE.Color(0x22f1c9));
    this._colourSpline.AddPoint(1.0, new THREE.Color(0x22f1c9));

    this._sizeSpline = new LinearSpline((t, a, b) => {
      return a + t * (b - a);
    });
    this._sizeSpline.AddPoint(0.0, 1.0);
    this._sizeSpline.AddPoint(0.5, 5.0);
    this._sizeSpline.AddPoint(1.0, 1.0);

    //document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
  
    this._UpdateGeometry();
	
	this._alpha=0.0;
  }
  
  set_alpha(_alpha){
	  this._alpha=_alpha;
  }
	
  _getMesh(){
	  return this._points;
  }


  _AddParticles(timeElapsed) {
    if (!this.gdfsghk) {
      this.gdfsghk = 0.0;
    }
    this.gdfsghk += timeElapsed;
    const n = Math.floor(this.gdfsghk * 3.0);
    this.gdfsghk -= n / 75.0;

    for (let i = 0; i < n; i++) {
      const life = (Math.random() * 0.75 + 0.25) * 1.0;
      this._particles.push({
          position: new THREE.Vector3(
              (Math.random() * 2 - 1) * 8.0,
              (Math.random() * 2 - 1) * 8.0,
              (Math.random() * 2 - 1) * 8.0),
          size: (Math.random() * 0.5 + 0.5) * 2.0,
          colour: new THREE.Color(),
          alpha: 0.5,
          life: life,
          maxLife: life,
          rotation: Math.random() * 2.0 * Math.PI,
          velocity: new THREE.Vector3(0, -3, 0),
      });
    }
  }

  _UpdateGeometry() {
    const positions = [];
    const sizes = [];
    const colours = [];
    const angles = [];
	//const alphas = [];

    for (let p of this._particles) {
      positions.push(p.position.x, p.position.y, p.position.z);
      colours.push(p.colour.r, p.colour.g, p.colour.b, p.alpha);
      sizes.push(p.currentSize);
      angles.push(p.rotation);
	  //alphas.push(p.alpha);
    }

    this._geometry.setAttribute(
        'position', new THREE.Float32BufferAttribute(positions, 3));
    this._geometry.setAttribute(
        'size', new THREE.Float32BufferAttribute(sizes, 1));
    this._geometry.setAttribute(
        'colour', new THREE.Float32BufferAttribute(colours, 4));
    this._geometry.setAttribute(
        'angle', new THREE.Float32BufferAttribute(angles, 1));
	//this._geometry.setAttribute(
        //'alpha', new THREE.Float32BufferAttribute(alphas, 1));
  
    this._geometry.attributes.position.needsUpdate = true;
    this._geometry.attributes.size.needsUpdate = true;
    this._geometry.attributes.colour.needsUpdate = true;
    this._geometry.attributes.angle.needsUpdate = true;
  }

  _UpdateParticles(timeElapsed) {
    for (let p of this._particles) {
      p.life -= timeElapsed;
    }

    this._particles = this._particles.filter(p => {
      return p.life > 0.0;
    });

    for (let p of this._particles) {
      const t = 1.0 - p.life / p.maxLife;

      p.rotation += timeElapsed * 0.5;
      //p.alpha = this._alphaSpline.Get(t);
	  p.alpha =this._alpha;
      p.currentSize = p.size * this._sizeSpline.Get(t);
      p.colour.copy(this._colourSpline.Get(t));

      p.position.add(p.velocity.clone().multiplyScalar(timeElapsed));

      const drag = p.velocity.clone();
      drag.multiplyScalar(timeElapsed * 0.1);
      drag.x = Math.sign(p.velocity.x) * Math.min(Math.abs(drag.x), Math.abs(p.velocity.x));
      drag.y = Math.sign(p.velocity.y) * Math.min(Math.abs(drag.y), Math.abs(p.velocity.y));
      drag.z = Math.sign(p.velocity.z) * Math.min(Math.abs(drag.z), Math.abs(p.velocity.z));
      p.velocity.sub(drag);
    }

    this._particles.sort((a, b) => {
      const d1 = this._camera.position.distanceTo(a.position);
      const d2 = this._camera.position.distanceTo(b.position);

      if (d1 > d2) {
        return -1;
      }

      if (d1 < d2) {
        return 1;
      }

      return 0;
    });
  }

  Step(timeElapsed) {
    this._AddParticles(timeElapsed);
    this._UpdateParticles(timeElapsed);
    this._UpdateGeometry();
  }
}
