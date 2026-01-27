import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';

//Dich chuyen tuc thoi khi bam' vao star list

class DemoEffect2{
	constructor(params){
		this._game=params.game;
		this.tha = 0;
		//this.ctha = 0;
		this.R = 15;
		this._update_fc=(timeInSeconds)=>{
			this.update(timeInSeconds);
		 };
		this._game.add_to_update_function_list(this._update_fc);
		
	}
	update(){
		
		this.tha += .13;
		
        //this.emitter1.p.z = this._position.z + this.R * Math.cos(this.tha);
        //this.emitter1.p.x = this._position.x +this.R * Math.sin(this.tha);
		//this.emitter1.p.y = this._position.y;
		//this.emitter1.p.z+=10;
		
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
	create_system_1(position,direction){
		this._position=position;
		this._direction=direction;
		
		this.addProton(position);
	}
	createEmitter(x, y, z, color1, color2) {
        var emitter = new Proton.Emitter();
         emitter.rate = new Proton.Rate(
          new Proton.Span(1, 2),
          new Proton.Span(0.01, 0.02)
        );
        emitter.addInitialize(new Proton.Mass(1));
        emitter.addInitialize(new Proton.Life(1));
        emitter.addInitialize(new Proton.Body(this.createSprite()));
        emitter.addInitialize(new Proton.Radius(120));

        emitter.addBehaviour(new Proton.Color("#1CF7CF", "#1CF7CF"));
        //emitter.addBehaviour(new Proton.Scale(5, 5));
		emitter.addBehaviour(new Proton.Force(5, 10, 0));
		
        
		//emitter.addBehaviour(new Proton.RandomDrift(50, 50, 0.01));
		//emitter.addBehaviour(new Proton.Rotate(0, Proton.getSpan(-8, 9), "add"));
		
		//emitter.addBehaviour(new Proton.Repulsion(new THREE.Vector3(10500,150,-500), 50, 50,100));
		
        emitter.emit();
		
		
		const emit_time=400.0;
		const emitter_life=400.0;
		emitter.emit(emit_time,emitter_life);
		

        return emitter;
		

        return emitter;
    }
}
export {DemoEffect2}
