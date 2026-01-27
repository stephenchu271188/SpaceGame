import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {SpaceShip} from './space-ship.js';
import {Sparks} from './skills/sparks.js';
import {FlashEffect1} from './flash-effect-1.js';

class SimpleCounterAttackShip extends SpaceShip {
	
	constructor(params){
		params.laser_color=new THREE.Color(247, 10, 2);
		params.shoot_delay=0.5;//thời gian delay giữa 2 lần bắn
		
		params.health=params.game._parameters._standard_hp*1;
		params.damage=params.game._parameters._standard_hp/10;
		
		super(params);
		
		//this._damage=params.damage;
		
		
		this._recovery_time=7;//thời gian hồi phục
		this._lock_fire=true;
		
		this._rocket_speed=150;
		
		this._status_id=0;
		let _status_num=3;
		let _delay=5;
		let _change_status=()=>{
			if(this.Dead)return;
			if(this._status_id<_status_num){
				this._status_id++;
			}
			else{
				this._status_id=1;
			}
			this._game.add_to_timer(()=>{
				_change_status();
			},_delay);
			
			if(this._status_id===1)this.change_shield(new THREE.Color(0x5FF732),new THREE.Color(0x5FF732));//xanh
			if(this._status_id===2)this.change_shield(new THREE.Color(0xF4F732),new THREE.Color(0xF4F732));//vang
			if(this._status_id===3)this.change_shield(new THREE.Color(0xF73832),new THREE.Color(0xF73832));//do
		};
		_change_status();
		
	}
	
	change_shield(_color1,_color2){
		if(this._shield_object&&this._shield_object!=null)
			this._model.remove(this._shield_object);
		this._shield_object=new THREE.Object3D();
		this._model.add(this._shield_object);
		this._shield_object.position.set(0,-15,0);
		this._simple_shield = new SimpleShield({
			game:this._game,
			parent:this._shield_object,
			camera: this._game._graphics.Camera,
			position:new THREE.Vector3(0,0,0),
			color1:_color1,
			color2:_color2
		});
		this._game.remove_function_from_update_list(this._update_shield);
		this._update_shield=(timeElapsedS)=>{
			
			this._simple_shield.Step(timeElapsedS);
		};
		this._game.add_to_update_function_list(this._update_shield);
		this.add_to_after_dead_function_list(()=>{
			this._game.remove_function_from_update_list(this._update_shield);
		});
		//console.log("change!!!!!!!!!!");
	}
	
	Fire(){//overwrite
		
		if(typeof this._target_object==='undefined'||this._target_object===null||this._target_object.Dead)return;
		if(this._lock_fire)return;
		this._lock_fire=true;
		
		this._game.add_to_timer(()=>{
			this._lock_fire=false;
		},this._recovery_time);
		
		let _pos1=this.get_ahead_point(15);
		
		let gltf=this._game._unitMG._data_list["missile-1"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(3.5);
		model.rotation.z=Math.PI;
		let _UnitClass=SimpleMissile;
		let _rocket= this._game._unitMG.create_combat_unit(_UnitClass,model,_pos1,true);
		_rocket._damage=this._damage;
		_rocket._missile_speed=this._rocket_speed;
		
		const _lookPos=this._utils.calculateSymmetricPoint(_rocket._model.position,this._target_object.Position);
		_rocket._model.lookAt(_lookPos);
		
		
		this._game._sound.play('missile-launch');
	}
	
	Take_Damage(_unit,_class_name,_parent_class_name,dmg){
		super.Take_Damage(_unit,_class_name,_parent_class_name,dmg);
		
		if(this._status_id===1){
			if(_parent_class_name==="RocketAttackSkill"||_parent_class_name==="SpaceCraft"
				||_parent_class_name==="SpaceShip"||_parent_class_name==="Spacecraft"||
				_parent_class_name==="Spaceship"){//cac loai skill rocket
				//alert(_unit);
				if(!_unit||_unit===null||_unit.Dead)return;
				//this.apply_additional_skill_simple_rocket(this,2);
				const _rocket_infor=this._game._unitMG.get_rocket_infor_by_class_name("Missile2");
				if(!_rocket_infor||_rocket_infor===null){//VD missile8 ko ap dung duoc
					return;
				}
				let _pos1=this.Position;
				let _pos2=_unit.Position;
				const _rockets=_rocket_infor.create_fc(_pos1,true);
				for(let i=0;i<_rockets.length;i++){
					const _rocket=_rockets[i];
					_rocket.look_at(_pos2);
					_rocket._player_id=null;
					//_rocket._is_enemy=true;
					_rocket.add_to_scene();//alert(this._is_enemy);alert(_rocket._is_enemy);
				}
				return;
			}
		}	
		if(this._status_id===2){
			if(_parent_class_name==="Rocket"){
				if(!_unit||_unit===null||_unit.Dead)return;
				const _rocket_infor=this._game._unitMG.get_rocket_infor_by_class_name(_class_name);
				if(!_rocket_infor||_rocket_infor===null){//VD missile8 ko ap dung duoc
					return;
				}
				let _pos1=this.Position;
				let _pos2=_unit.Position;
				const _rockets=_rocket_infor.create_fc(_pos1,true);
				for(let i=0;i<_rockets.length;i++){
					const _rocket=_rockets[i];
					_rocket.look_at(_pos2);
					_rocket._player_id=null;
					//_rocket._is_enemy=true;
					_rocket.add_to_scene();//alert(this._is_enemy);alert(_rocket._is_enemy);
				}
				return;
			}
		}
		if(this._status_id===3){
			if(_class_name==="blaster"){
				if(!_unit)return;//truong hop laser-gun,plas-ma-gun
				this.look_at(_unit.Position);
				this.Fire2();
				_unit.TakeDamage(_unit._damage/2);
			}
		}
		
    }
	
	Fire2() {
		if (this._fireCooldown > 0.0) {
		return;
		}
		if(this._params.blaster_sound_id){
			this._params.game._sound.play(this._params.blaster_sound_id,0.5);
		}
		else{
			this._params.game._sound.play("blaster2",0.5);
		}
		//this._params.game._sound.play('blaster');
		//this._params.game._sound.play('blaster');
	
		this._fireCooldown = this._params.shoot_delay;//thời gian delay giữa 2 lần bắn

		const p = this._params.blasterSystem.CreateParticle();//bắt đầu quá trình tạo một particle (hạt) mới.
		p.Start = this._offsets[this._offsetIndex].clone();//vi tri nong sung'
		p.Start.applyQuaternion(this._model.quaternion);
		p.Start.add(this.get_world_position());
		p.End = p.Start.clone();
		p.Velocity = this.Direction.clone().multiplyScalar(500.0);//hướng di chuyển
		p.Length = 50.0;//Shouldn't be too long, it will affect performance
		p.Colours = [
			this._params.laser_color.clone(), new THREE.Color(0.0, 0.0, 0.0)];//màu của laser
		p.Life = 2.0;//second
		p.TotalLife = 2.0;
		p.Width = 0.25;
	
		// thay đổi giá trị của _offsetIndex để chuẩn bị cho lần bắn tiếp theo. 
		//_offsetIndex=0->3: id cua 4 cannon
		this._offsetIndex = (this._offsetIndex + 1) % this._offsets.length;
	}
	
	CheckTarget(timeInSeconds){
		
	}
}

class SimpleMissile extends SpaceShip {
	
	constructor(params){
	
		params.health=5;
		//params.damage=params.game._parameters._standard_hp/30;
		
		super(params);
	
		this._radius_effect1=15;//khoảng cách mà khi tên lửa ở gần mục tiêu sẽ phát nổ
		this._radius_effect2=20;//bán kính tầm ảnh hưởng của vụ nổ
		this._origin_position=this.get_world_position();//vị trí ban đầu
		this._max_distance=1000;//quãng đường xa nhất tên lửa có thể bay đi
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
		var map = new THREE.CanvasTexture(this._game._image_preloader.getImage('particle9'));
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
        emitter.rate = new Proton.Rate(new Proton.Span(3, 9), new Proton.Span(.01, .02));
        //emitter.addInitialize(new Proton.Mass(1));
        emitter.addInitialize(new Proton.Life(0.5));
        emitter.addInitialize(new Proton.Body(this.createSprite()));
        emitter.addInitialize(new Proton.Radius(18));
        //emitter.addInitialize(new Proton.V(200, new Proton.Vector3D(0, 0, -1), 0));


        //emitter.addBehaviour(new Proton.Alpha(1, 0));
        emitter.addBehaviour(new Proton.Color(color1, color2));
        emitter.addBehaviour(new Proton.Scale(1, 0));
        //emitter.addBehaviour(new Proton.CrossZone(new Proton.ScreenZone(camera, renderer), 'dead'));


        //emitter.addBehaviour(new Proton.Force(0, 0, -20));
       
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
		this._params.game._entities['_explosionSystem'].Splode(this.Position,"#EF2F0D","#EF2F0D",24,96);
		this._game.add_to_timer(()=>{
			this.destroy_thruster();
		},2);
		this._game.add_to_timer(()=>{//neu stop update qua' som' thi cac particle chua xoa' di het
			this._game.remove_function_from_update_list(this._update_fc);
		},13);
		
	}
	
	CheckTarget(timeInSeconds){
		//try{
			const _position=this.Position;
			const _t_distance=_position.distanceTo(this._origin_position);
			const _speed1=70;
			const _speed2=100;
			if(_t_distance>this._max_distance){
				this.SelfDestroy();
			}
			
			let _targets;
				
			this._target_object=this._game._me;
			
			if(_t_distance<70)
				this.move_forward(timeInSeconds*_speed1);
			else
				this.move_forward(timeInSeconds*_speed2);
			
			
			if(this._target_object!=null&&!this._target_object.Dead){
				this.look_at(this._target_object.Position);
				if(_position.distanceTo(this._target_object.Position)<=this._radius_effect1){
					
					//_targets=this._game._unitMG.get_enemy_combat_unit_in_range_2(-1,_position,this._radius_effect1);
					_targets=[[this._target_object,0]];
					for(let i=0;i<_targets.length;i++){
						const _target=_targets[i][0];
						const _distance=_targets[i][1];
						if(_target.Dead)continue;
						
						let _damage=this._damage;
						if(_distance>this._radius_effect2*3/4)_damage=this._damage/3;
						if(_distance>this._radius_effect2*1/2)_damage=this._damage/2;
						
						_target.TakeDamage(_damage);//alert(_damage);
					}
					this.SelfDestroy();
				}	
			}
		//}catch(e){alert(e.stack);}	
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

class SimpleShield{
	constructor(params) {
	  this._game=params.game;
	  this._params=params;
    const uniforms = {
        diffuseTexture: {
            value: new THREE.CanvasTexture(this._game._image_preloader.getImage('particle36'))
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
    
    this._points = new THREE.Points(this._geometry, this._material);

    params.parent.add(this._points);
	this._points.position.copy(params.position);
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
    this._colourSpline.AddPoint(0.0, this._params.color1);
    this._colourSpline.AddPoint(1.0, this._params.color2);

    this._sizeSpline = new LinearSpline((t, a, b) => {
      return a + t * (b - a);
    });
    this._sizeSpline.AddPoint(0.5, 1.0);
    //document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
  
    this._UpdateGeometry();
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
          size:  20,
          colour: new THREE.Color(),
          alpha: 0.1,
          life: life,
          maxLife: life,
          rotation: Math.PI,
          velocity: new THREE.Vector3(0, 0.0, 0),
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
    }
	
    this._geometry.setAttribute(
        'position', new THREE.Float32BufferAttribute(positions, 3));
    
    this._geometry.attributes.position.needsUpdate = true;
	
	
	if(this._first){
		this._geometry.setAttribute(
			'size', new THREE.Float32BufferAttribute(sizes, 1));
		this._geometry.setAttribute(
			'colour', new THREE.Float32BufferAttribute(colours, 4));
		
		this._geometry.attributes.size.needsUpdate = false;
		this._geometry.attributes.colour.needsUpdate = false;
		
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

      //p.rotation += timeElapsed * 0.5;
      p.alpha = 0.1;
	  //p.currentSize = p.size*this._sizeSpline.Get(t);
      p.currentSize = p.size+(_counter*0.03);
      p.colour.copy(this._colourSpline.Get(t));

      p.position.add(p.velocity.clone().multiplyScalar(timeElapsed));
	  
	  _counter++;
    }
	
  }

  Step(timeElapsed) {
    this._AddParticles(timeElapsed);
    this._UpdateParticles(timeElapsed);
    this._UpdateGeometry();
  }
}


export{SimpleCounterAttackShip};