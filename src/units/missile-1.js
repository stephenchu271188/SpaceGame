import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
//import {SpaceShip} from './space-ship.js';
import {Rocket} from './rocket.js';
import {thruster} from './thruster.js';
//import {Sparks} from './skills/sparks.js';

//let _velocity=0.6;//engine spark
//let _size=3;

//Tên lửa bay theo đường thẳng, khi gần mục tiêu thì phát nổ
class Missile1 extends Rocket {//tàu thám hiểm
	
	constructor(params){
	
		params.health=99999999;
		params.damage=params.game._parameters._standard_hp/2;
		
		super(params);
	
		this._radius_effect1=15;//khoảng cách mà khi tên lửa ở gần mục tiêu sẽ phát nổ
		this._radius_effect2=70;//bán kính tầm ảnh hưởng của vụ nổ
		this._origin_position=this.get_world_position();//vị trí ban đầu
		this._max_distance=1200*this._game.rocket_multiplier;//quãng đường xa nhất tên lửa có thể bay đi
		this._missile_speed=this._game._parameters._standard_rocket_speed*2.2;
		this._damage=params.damage;
		
		/*
		let _engine_object=new THREE.Object3D();
			//_engine_object.visible=false;
			this._engine_object=_engine_object;
			this._model.add(_engine_object);
			_engine_object.position.set(0,0.0,0);
			this._sparks = new Sparks({
				 game:this._game,
				parent:_engine_object,
				camera: this._game._graphics.Camera,
				position:new THREE.Vector3(0,0,2),
			});
		
			let _update_sparks=(timeElapsedS)=>{
				this._sparks.Step(timeElapsedS);
			};
			this._game.add_to_update_function_list(_update_sparks);
			this.add_to_after_dead_function_list(()=>{
				this._game.remove_function_from_update_list(_update_sparks);
			});
		*/
		this.tha = 0;
		this.R = 15;
		this._update_fc=(timeInSeconds)=>{
			this.update(timeInSeconds);
		 };
		this._game.add_to_update_function_list(this._update_fc);
		
		this.create_thruster(new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0));
		
			this._explodable=true;
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
	cleanupProton(proton) {
		proton.emitters.forEach(emitter => {
			proton.removeEmitter(emitter);
			emitter.destroy();

			emitter.particles.forEach(particle => {
				if (particle.target && particle.target.parent) {
					particle.target.parent.remove(particle.target);

					if (particle.target.geometry) particle.target.geometry.dispose();
					if (particle.target.material) particle.target.material.dispose();
				}
			});
		});

		proton.destroy();

		// Nếu có renderer
		if (proton.renderer && typeof proton.renderer.destroy === 'function') {
			proton.renderer.destroy();
		}
	}
	destroy_thruster() {
		this.cleanupProton(this.proton);
		this.proton=null;
		/*
		this.proton.emitters.forEach(emitter => {
			emitter.stopEmit();
		});
		
		
		this.proton.emitters.forEach(emitter => {
			emitter.particles.forEach(particle => {
				
				//emitter.removeParticle(particle);//sẽ gây lỗi, nhưng nhờ có lỗi mới destroy được,(chưa rõ nguyên nhân vì sao khi destroy mà system vẫn ko bị remove khỏi scene
				
			});
			emitter.removeAllParticles();
		});
		this.emitter1.destroy();
		this.proton.removeEmitter(this.emitter1);
		this.proton.destroy();
		*/
	}	
	createSprite() {
        //var map = new THREE.TextureLoader().load("./resources/particle/noname-3.png");
		//var map = new THREE.CanvasTexture(this._game._image_preloader.getImage('particle3'));
		const _image = this._game._image_preloader.getImage('particle3');
	  const texture = new THREE.Texture(_image);
	  texture.needsUpdate = true;
        var material = new THREE.SpriteMaterial({
            map: texture,
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
        emitter.rate = new Proton.Rate(new Proton.Span(3, 9), new Proton.Span(.01, .02));
        //emitter.addInitialize(new Proton.Mass(1));
        emitter.addInitialize(new Proton.Life(0.5));
        emitter.addInitialize(new Proton.Body(this.createSprite()));
        emitter.addInitialize(new Proton.Radius(8));
        //emitter.addInitialize(new Proton.V(200, new Proton.Vector3D(0, 0, -1), 0));


        emitter.addBehaviour(new Proton.Alpha(1, 0));
        emitter.addBehaviour(new Proton.Color(color1, color2));
        emitter.addBehaviour(new Proton.Scale(1, 0));
        //emitter.addBehaviour(new Proton.CrossZone(new Proton.ScreenZone(camera, renderer), 'dead'));


        //emitter.addBehaviour(new Proton.Force(0, 20,0));
       
        emitter.p.x = x;
        emitter.p.y = y;
		emitter.p.z = z;
        
		const emit_time=0.5;
		const emitter_life=1.0;
		emitter.emit(emit_time,emitter_life);
		

        return emitter;
    }
	
	SelfDestroy(){
		super.SelfDestroy();
		if(this._explodable)this._params.game._entities['_explosionSystem'].Splode(this.Position,"#109BE7","#109BE7",48,192,12);
		this._game.remove_function_from_update_list(this._update_fc);
		this.destroy_thruster();
		
	}
	
	CheckTarget(timeInSeconds){
		//try{
			const _position=this.Position;
			if(_position.distanceTo(this._origin_position)>this._max_distance){
				this.SelfDestroy();
			}
			this.move_forward(timeInSeconds*this._missile_speed);
			
			const _targets=this._game._unitMG.get_enemy_combat_unit_in_range_3(this,_position,this._radius_effect1);
			
			for(let i=0;i<_targets.length;i++){//alert(_targets.length);
				const _target=_targets[i][0];
				const _distance=_targets[i][1];
				//let _damage=(_distance/this._radius_effect)*this._params.damage;
				let _damage=this._damage;
				if(_distance>this._radius_effect2*3/4)_damage=this._damage/3;
				if(_distance>this._radius_effect2*1/2)_damage=this._damage/2;
				//else _damage=this._params.damage;
				_target.Take_Damage(this._unit,this.constructor.name,super.constructor.name,_damage);
				//alert(_target._player_id);
			}
			if(_targets.length>0){
				this.SelfDestroy();
				
			}
		//}catch(e){alert(e.toString());}
	}
	
	CheckTarget_V2(timeInSeconds){//legion-game
		//try{
			const _position=this.get_world_position();
			if(_position.distanceTo(this._origin_position)>this._max_distance){
				this.SelfDestroy();
			}
			this.move_forward(timeInSeconds*this._missile_speed);
			const _targets=this._game._unitMG.get_all_combat_unit_with_exception(this._player_id,_position,this._radius_effect1);
			for(let i=0;i<_targets.length;i++){
				const _target=_targets[i][0];
				if(_target._player_id===this._player_id)continue;
				
				const _distance=_targets[i][1];
				//let _damage=(_distance/this._radius_effect)*this._params.damage;
				let _damage=this._damage;
				if(_distance>this._radius_effect2*3/4)_damage=this._damage/3;
				if(_distance>this._radius_effect2*1/2)_damage=this._damage/2;
				//else _damage=this._params.damage;
				
				_target.TakeDamage(_damage);
			}
			if(_targets.length>0)this.SelfDestroy();
		//}catch(e){alert(e.toString());}
	}
}

export{Missile1};

/*
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
            value: new THREE.CanvasTexture(this._game._image_preloader.getImage('particle3'))
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

*/