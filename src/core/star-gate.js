import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {  CSS2DObject } from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/renderers/CSS2DRenderer.js';
//import {EffectsTexture} from '../effects-texture.js';

class StarGate{
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
		/*
        this.emitter1.p.z = this._position.z + this.R * Math.cos(this.tha);
        this.emitter1.p.x = this._position.x +this.R * Math.sin(this.tha);
		this.emitter1.p.y = this._position.y;

        this.emitter2.p.z = this._position.z +this.R * Math.cos(this.tha + Math.PI / 2);
        this.emitter2.p.x = this._position.x +this.R * Math.sin(this.tha + Math.PI / 2);
		this.emitter2.p.y = this._position.y;
		*/
		/*
		this.emitter3.p.z = this._position.z - this.R * Math.cos(this.tha);
        this.emitter3.p.y = this._position.y -this.R * Math.sin(this.tha);
		this.emitter3.p.x = this._position.x;

        this.emitter4.p.z = this._position.z -this.R * Math.cos(this.tha + Math.PI / 2);
        this.emitter4.p.y = this._position.y -this.R * Math.sin(this.tha + Math.PI / 2);
		this.emitter4.p.x = this._position.x;
		*/
		this.proton.update();
		
		const _distance=this._position.distanceTo(this._game._me.Position);
		if(_distance<300){
			this._label_div_1.style.visibility="hidden";
		}
		else{
			this._label_div_1.style.visibility="visible";
		}
		if(_distance<50){
			
			if(typeof this._lock_inventory === 'undefined')
				this._lock_inventory=false;
			
			if(this._lock_inventory===true)return;
			this._lock_inventory=true;
			
			this._game.add_to_timer(()=>{
				this._lock_inventory=false;
			},135);
			
			//this.destroy_system();
			//this._game._effect_texture.create_plane();
			this._game._root_inventory.add_to_root_inventory(this._game._me._inventory);
			this._game.update_player_data();
			this._game.show_message_box_2('success1','Successful!',"All materials have been imported into the warehouse!",7);
		}
		
	}
	addProton(position) {
        this.proton = getNewProton();

        this.emitter1 = this.createEmitter(position.x,position.y,position.z, '#4F1500', '#0029FF');
        this.emitter2 = this.createEmitter(position.x,position.y,position.z, '#004CFE', '#6600FF');
		
		this.emitter3 = this.createEmitter(position.x,position.y,position.z, '#4F1500', '#0029FF');
        this.emitter4 = this.createEmitter(position.x,position.y,position.z, '#004CFE', '#6600FF');

        this.proton.addEmitter(this.emitter1);
        this.proton.addEmitter(this.emitter2);
		this.proton.addEmitter(this.emitter3);
        this.proton.addEmitter(this.emitter4);
        this.proton.addRender(new Proton.SpriteRender(this._game._graphics.Scene));
		
		//this.rotate_system();
    }
	
	destroy_system() {
		
		this._game.remove_function_from_update_list(this._update_fc);
		
		this.proton.emitters.forEach(emitter => {
			emitter.stopEmit();
		});
		
		this.proton.removeEmitter(this.emitter1);
		this.proton.removeEmitter(this.emitter2);
		this.proton.removeEmitter(this.emitter3);
		this.proton.removeEmitter(this.emitter4);
		this.proton.destroy();
		
		
		this.proton.emitters.forEach(emitter => {
			emitter.particles.forEach(particle => {
				emitter.removeParticle(particle);//sẽ gây lỗi, nhưng nhờ có lỗi mới destroy được,(chưa rõ nguyên nhân vì sao khi destroy mà system vẫn ko bị remove khỏi scene
			});
			emitter.removeAllParticles();
		});

		
		
	}	
	createSprite() {
        var map = new THREE.TextureLoader().load("./resources/particle/noname-2.png");
        var material = new THREE.SpriteMaterial({
            map: map,
            color: 0xff0000,
            blending: THREE.AdditiveBlending,
            fog: true
        });
        return new THREE.Sprite(material);
    }
	init(position,direction){
		this._position=position;
		this._direction=direction;
		
		this.addProton(position);
		
		let div = document.createElement( 'div' );
			//div.innerHTML="<img width=30 height=50 src='./resources/gif/location1.gif'/>";
			div.innerHTML+="StarGate";
			
			div.style.cssText=`
			font-family: 'Courier New', Courier, monospace;
				 font-size: 25px;
				color: #d4eaff;
				text-shadow: 
				0 0 10px #2695ff,
				0 0 20px rgba(38, 149, 255, 0.5);
			`;//luu y su dung tex-shadow co the lam giam? performance
			
			this._label1 = new CSS2DObject( div );
			this._game._graphics.Scene.add(this._label1);
			this._label1.position.copy(position);
			this._label_div_1=div;
	}
	createEmitter(x, y, z, color1, color2) {
        var emitter = new Proton.Emitter();
        emitter.rate = new Proton.Rate(new Proton.Span(1, 3), new Proton.Span(.01, .02));
        emitter.addInitialize(new Proton.Mass(1));
        emitter.addInitialize(new Proton.Life(1));
        emitter.addInitialize(new Proton.Body(this.createSprite()));
        emitter.addInitialize(new Proton.Radius(30));
        //emitter.addInitialize(new Proton.V(200, new Proton.Vector3D(0, 0, -1), 0));


        emitter.addBehaviour(new Proton.Alpha(1, 0));
        emitter.addBehaviour(new Proton.Color(color1, color2));
        emitter.addBehaviour(new Proton.Scale(1, 0.1));
		emitter.addBehaviour(new Proton.RandomDrift(10, 10, 0.02));
        //emitter.addBehaviour(new Proton.CrossZone(new Proton.ScreenZone(camera, renderer), 'dead'));


        //emitter.addBehaviour(new Proton.Force(0, 0, -20));
       
        emitter.p.x = x;
        emitter.p.y = y;
		emitter.p.z = z;
        emitter.emit();
		

        return emitter;
    }
}
export {StarGate}