import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';



class Effect2{
	constructor(params){
		this._game=params.game;
		this.tha = 0;
		//this.ctha = 0;
		this.R = 70;
		this._update_fc=(timeInSeconds)=>{
			this.update(timeInSeconds);
		 };
		this._game.add_to_update_function_list(this._update_fc);
	}
	update(){
		this.tha += .13;
		
        this.emitter1.p.x = this._position.x + this.R * Math.cos(this.tha);
        this.emitter1.p.y = this._position.y +this.R * Math.sin(this.tha);
		this.emitter1.p.z = this._position.z;

        this.emitter2.p.x = this._position.x +this.R * Math.cos(this.tha + Math.PI / 2);
        this.emitter2.p.y = this._position.y +this.R * Math.sin(this.tha + Math.PI / 2);
		this.emitter2.p.z = this._position.z;
		
		/*
		this.emitter1.p.x=this._position.x;
		this.emitter1.p.y=this._position.y;
		this.emitter1.p.z=this._position.z;
		this.emitter2.p.x=this._position.x;
		this.emitter2.p.y=this._position.y;
		this.emitter2.p.z=this._position.z;
		*/
		
		this.proton.update();
		
	}
	addProton(position) {
        this.proton = getNewProton();

        this.emitter1 = this.createEmitter(position.x,position.y,position.z, '#4F1500', '#0029FF');
        this.emitter2 = this.createEmitter(position.x,position.y,position.z, '#004CFE', '#6600FF');

        this.proton.addEmitter(this.emitter1);
        this.proton.addEmitter(this.emitter2);
        this.proton.addRender(new Proton.SpriteRender(this._game._graphics.Scene));

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
        emitter.rate = new Proton.Rate(new Proton.Span(5, 7), new Proton.Span(.01, .02));
        emitter.addInitialize(new Proton.Mass(1));
        emitter.addInitialize(new Proton.Life(1));
        emitter.addInitialize(new Proton.Body(this.createSprite()));
        emitter.addInitialize(new Proton.Radius(30));
        emitter.addInitialize(new Proton.V(200, new Proton.Vector3D(0, 0, -1), 0));


        emitter.addBehaviour(new Proton.Alpha(1, 0));
        emitter.addBehaviour(new Proton.Color(color1, color2));
        emitter.addBehaviour(new Proton.Scale(1, 0.5));
        //emitter.addBehaviour(new Proton.CrossZone(new Proton.ScreenZone(camera, renderer), 'dead'));


        emitter.addBehaviour(new Proton.Force(0, 0, -20));
       
        emitter.p.x = x;
        emitter.p.y = y;
		emitter.p.z = z;
        emitter.emit();

        return emitter;
    }
}
export {Effect2}
