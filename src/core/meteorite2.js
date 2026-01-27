import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';

class Meteorite2{
	constructor(params){
		this._params=params;
		this._game=params.game;
		this._motion=null;
		this.tha = 0;
		//this.ctha = 0;
		this.R = 15;
		this._update_fc=(timeInSeconds)=>{
			this.update(timeInSeconds);
		 };
		this._game.add_to_update_function_list(this._update_fc);
	}
	
	set_motion(_motion){
		this._motion=_motion;
	}
	
	update(t){
		this._ball.rotation.x+=0.1;
		this._ball.rotation.y+=0.1;
		this._ball.rotation.z+=0.1;
		
		this.proton.update();
		
		if(this._motion===null)return;
		
		if(this._motion.name==='circle'){
			this._game._utils.rotateAboutPoint(this._ball,this._motion.point,this._motion.axis, 
											   t*this._motion.theta, true);
			const _ball_pos=this._ball.position;
			this.emitter1.p.x=_ball_pos.x;
			this.emitter1.p.y=_ball_pos.y;
			this.emitter1.p.z=_ball_pos.z;
			return;
		}
		
	}
	
	addProton(position) {
        this.proton = getNewProton();

        this.emitter1 = this.createEmitter(position.x,position.y,position.z,this._params.color1,this._params.color2);
		
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
	init(position,direction){
		
		let ball = new THREE.Mesh(
			new THREE.IcosahedronGeometry( 100 ),
			new THREE.MeshPhysicalMaterial({
					color: 'silver',
					roughness: 0,
					metalness: 0.6,
					flatShading: true,
			})
		);
		
		this._game._graphics.Scene.add( ball );
		ball.position.copy(position);
		
		this._ball=ball;
		this._position=position;
		this._direction=direction;
		
		this.addProton(position);
	}
	createEmitter(x, y, z, color1, color2) {
        var emitter = new Proton.Emitter();
         emitter.rate = new Proton.Rate(
          new Proton.Span(4, 10),
          new Proton.Span(0.02, 0.04)
        );
        emitter.addInitialize(new Proton.Mass(1));
        emitter.addInitialize(new Proton.Life(1));
        emitter.addInitialize(new Proton.Body(this.createSprite()));
        emitter.addInitialize(new Proton.Radius(360));

        emitter.addBehaviour(new Proton.Color(this._params.color1,this._params.color2));
        //emitter.addBehaviour(new Proton.Scale(5, 5));
		//emitter.addBehaviour(new Proton.Force(5, 10, 0));
		
        
		emitter.addBehaviour(new Proton.RandomDrift(160, 160, 0.01));
		//emitter.addBehaviour(new Proton.Rotate(0, Proton.getSpan(-8, 9), "add"));
		
		//emitter.addBehaviour(new Proton.Repulsion(new THREE.Vector3(10500,150,-500), 50, 50,100));
		
        emitter.emit();
		
        return emitter;
    }
}
export {Meteorite2}