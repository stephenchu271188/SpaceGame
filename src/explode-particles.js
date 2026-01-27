import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {particles} from './particles.js';
import {math} from './math.js';

class ExplodeParticles {
  constructor(game) {
	  this._game=game;
    this._particleSystem = new particles.ParticleSystem(
        game, {texture: "./resources/explosion.png"});
    this._particles = [];
	this._lock=false;
  }

  Splode(origin,color1,color2,width,height,particles_num) {
	  if(this._lock)return;
	  if(origin.distanceTo(this._game._me.Position)<15)//hien thi o khoang cach gan lam game bi giat 
		  return;
	  //let _sprite=new ExplodeSprite({position:origin,game:this._game});
	  //return;
	  let _num;
	  if(particles_num!=null)
		  _num=particles_num;
	  else _num=12;
    for (let i = 0; i < _num; i++) {
      const p = this._particleSystem.CreateParticle();
      p.Position.copy(origin);
      p.Velocity = new THREE.Vector3(
          math.rand_range(-3, 3),
          math.rand_range(-3, 3),
          math.rand_range(-3, 3)
      );
      p.Velocity.normalize();
      p.Velocity.multiplyScalar(50);
      p.TotalLife = 2.0;
      p.Life = p.TotalLife;
	  if(color1!=null&&color2!=null)
		  p.Colours = [new THREE.Color(color1), new THREE.Color(color2)];
	  else
		p.Colours = [new THREE.Color(0xFF8010), new THREE.Color(0xFF8010)];
	  //p.Colours = [new THREE.Color("#109BE7"), new THREE.Color("#109BE7")];
	  if(width!=null&&height!=null)
		  p.Sizes = [width, height];
	  else
		  p.Sizes = [4, 16];
	  
      p.Size = p.Sizes[0];
      this._particles.push(p);
    }
 
  }

  Update(timeInSeconds) {
    const _V = new THREE.Vector3();

    this._particles = this._particles.filter(p => {
      return p.Alive;
    });
    for (const p of this._particles) {
      p.Life -= timeInSeconds;
      if (p.Life <= 0) {
        p.Alive = false;
      }
      p.Position.add(p.Velocity.clone().multiplyScalar(timeInSeconds));

      _V.copy(p.Velocity);
      _V.multiplyScalar(10.0 * timeInSeconds);
      const velocityLength = p.Velocity.length();

      if (_V.length() > velocityLength) {
        _V.normalize();
        _V.multiplyScalar(velocityLength)
      }

      p.Velocity.sub(_V);
      p.Size = math.lerp(p.Life / p.TotalLife, p.Sizes[0], p.Sizes[1]);
      p.Colour.copy(p.Colours[0]);
      p.Colour.lerp(p.Colours[1], 1.0 - p.Life / p.TotalLife);
      p.Opacity = math.smootherstep(p.Life / p.TotalLife, 0.0, 1.0);
    }
    this._particleSystem.Update();
  }
};

export {ExplodeParticles}

class ExplodeSprite{
	constructor(params){
		this._params=params;
		this._game=params.game;
		this._position=params.position;
		this.tha = 0;
		this.R = 15;
		
		this.create_thruster(this._position,new THREE.Vector3(0,0,0));
		this._game.add_to_timer(()=>{
			this.destroy_thruster();
		},1);
		
		this._update_fc=(timeInSeconds)=>{
			this.update(timeInSeconds);
		 };
		this._game.add_to_update_function_list(this._update_fc);
		
	}
	
	update(){
		
		this.tha += .13;
		
		this.emitter1.p.x=this._position.x;
		this.emitter1.p.y=this._position.y;
		this.emitter1.p.z=this._position.z;
		
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
		var map = new THREE.CanvasTexture(this._game._image_preloader.getImage('particle7'));
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
        emitter.addInitialize(new Proton.Life(0.2));
        emitter.addInitialize(new Proton.Body(this.createSprite()));
        emitter.addInitialize(new Proton.Radius(30));
        //emitter.addInitialize(new Proton.V(200, new Proton.Vector3D(0, 0, -1), 0));


        //emitter.addBehaviour(new Proton.Alpha(1, 0));
        emitter.addBehaviour(new Proton.Color(color1, color2));
        emitter.addBehaviour(new Proton.Scale(1, 0));
		emitter.addBehaviour(new Proton.RandomDrift(30, 30, 30));
        //emitter.addBehaviour(new Proton.CrossZone(new Proton.ScreenZone(camera, renderer), 'dead'));


        //emitter.addBehaviour(new Proton.Force(0, 0, -20));
       
        emitter.p.x = x;
        emitter.p.y = y;
		emitter.p.z = z;
        
		const emit_time=0.2;
		const emitter_life=0.2;
		emitter.emit(emit_time,emitter_life);
		

        return emitter;
    }
}