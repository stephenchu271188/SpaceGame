import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
/*
	DEMO:
		const _obj=new THREE.Object3D();
		this._game._graphics.Scene.add(_obj);
		_obj.position.copy(this._game._me.getFrontPos(10000));
		let _star1 = new Sparks2({
				 game:this._game,
				parent:_obj,
				camera: this._game._graphics.Camera,
				position:new THREE.Vector3(0,0,0),
				particle_id:'particle33',
				color1:'turquoise',
				color2:'turquoise',
				rate1:{x:3,y:9},
				rate2:{x:.01,y:.02},
				particle_radius:100,
				alpha:{x:1,y:1},
				emit_time:5.0,
				emit_life:5.0,
				
			});
*/

class Sparks2{
	constructor(params){
		this._params=params;
		this._game=params.game;
		this._parent=params.parent;
		
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
		
		const _pos=this._parent.position;
		
		this.emitter1.p.x=_pos.x;
		this.emitter1.p.y=_pos.y;
		this.emitter1.p.z=_pos.z;
		
		this.proton.update();
		
	}
	
	clear(){
		this.destroy_thruster();
		this._game.add_to_timer(()=>{//neu stop update qua' som' thi cac particle chua xoa' di het
			this._game.remove_function_from_update_list(this._update_fc);
		},1);
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
		//var map = new THREE.CanvasTexture(this._game._image_preloader.getImage(this._params.particle_id));
		const _image = this._game._image_preloader.getImage(this._params.particle_id);
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
        emitter.rate = new Proton.Rate(new Proton.Span(this._params.rate1.x,this._params.rate1.y), 
									   new Proton.Span(this._params.rate2.x,this._params.rate2.y));
        //emitter.addInitialize(new Proton.Mass(1));
        emitter.addInitialize(new Proton.Life(0.5));
        emitter.addInitialize(new Proton.Body(this.createSprite()));
        emitter.addInitialize(new Proton.Radius(this._params.particle_radius));
        //emitter.addInitialize(new Proton.V(200, new Proton.Vector3D(0, 0, -1), 0));

		
		if(this._params.alpha)
			emitter.addBehaviour(new Proton.Alpha(this._params.alpha.x,this._params.alpha.y));
        emitter.addBehaviour(new Proton.Color(color1, color2));
		if(this._params.scale)
			emitter.addBehaviour(new Proton.Scale(this._params.scale.x,this._params.scale.y));
        //emitter.addBehaviour(new Proton.CrossZone(new Proton.ScreenZone(camera, renderer), 'dead'));
		if(this._params.random_drift)
			emitter.addBehaviour(new Proton.RandomDrift(this._params.random_drift.x, 
													    this._params.random_drift.y,
														this._params.random_drift.z));

        //emitter.addBehaviour(new Proton.Force(0, 20,0));
       
        emitter.p.x = x;
        emitter.p.y = y;
		emitter.p.z = z;
        
		const emit_time=this._params.emit_time;
		const emit_life=this._params.emit_life;
		emitter.emit(emit_time,emit_life);
		

        return emitter;
    }
	
}
export {Sparks2}