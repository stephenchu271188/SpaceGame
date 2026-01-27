import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {Spacecraft} from './spacecraft.js';

class Rocket5 extends Spacecraft {
	constructor(params){
		
		params.health=99999999;
		params.damage=parseInt(params.game._parameters._standard_hp/4);
		
		super(params);
		
		
		this._radius_effect1=20*this._game.rocket_multiplier;//khoảng cách mà khi tên lửa ở gần mục tiêu sẽ phát nổ
		this._radius_effect2=25*this._game.rocket_multiplier;//bán kính tầm ảnh hưởng của vụ nổ
		this._origin_position=this.get_world_position();//vị trí ban đầu
		
		this.emit_time=1.0;
		this.emitter_life=1.0;
		
		this._lock=true;
	}
	
	/*
		Khi _time!=undefined va _time!=null thi bat che do hen gio (time)
		
	*/
	launch(_target,_particle_id,_particle_radius,_life,_time){
		this._target=_target;
		this._particle_id=_particle_id;
		this._particle_radius=_particle_radius;
		
		
		
		this.tha = 0;
		this.R = 15;
		this._update_fc=(timeInSeconds)=>{
			this.update(timeInSeconds);
		 };
		this._game.add_to_update_function_list(this._update_fc);
		
		this.create_thruster(new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0));
		
		this._lock=false;
	}
	
	update(){
		if(this.proton===null)return;
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
		if(proton===null)return;
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
		
	}		
	createSprite() {
		const _image = this._game._image_preloader.getImage(this._particle_id);
	  const texture = new THREE.Texture(_image);
	  texture.needsUpdate = true;
        var material = new THREE.SpriteMaterial({
            //map: map,
			map:texture,
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
        emitter.rate = new Proton.Rate(new Proton.Span(3, 9), new Proton.Span(.002, .004));
        //emitter.addInitialize(new Proton.Mass(1));
        emitter.addInitialize(new Proton.Life(1.5));
        emitter.addInitialize(new Proton.Body(this.createSprite()));
        emitter.addInitialize(new Proton.Radius(this._particle_radius));
        
        //emitter.addBehaviour(new Proton.Alpha(1, 0));
        emitter.addBehaviour(new Proton.Color(color1, color2));
        emitter.addBehaviour(new Proton.Scale(1, 0));
       
        emitter.p.x = x;
        emitter.p.y = y;
		emitter.p.z = z;
        
		emitter.emit(this.emit_time,this.emitter_life);
		

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
	/*
	CauseDamage(){
		const _position=this.Position;
			const _targets=this._game._unitMG.get_enemy_combat_unit_in_range_3(this,_position,this._radius_effect1);
			for(let i=0;i<_targets.length;i++){
				const _target=_targets[i][0];
				const _distance=_targets[i][1];
				let _damage=this._damage;
				if(_distance>this._radius_effect2*3/4)_damage=this._damage/3;
				if(_distance>this._radius_effect2*1/2)_damage=this._damage/2;
				
				_target.Take_Damage(this._unit,this.constructor.name,super.constructor.name,_damage);
			}
			if(_targets.length>0)this.SelfDestroy();
	}
	*/
	CheckTarget(timeInSeconds){
		if(this._lock)return;
		
		if(!this._target||this._target.Dead){
			this.SelfDestroy();
			return;
		};
		const _target_pos=this._target.Position;
		const _pos=this.Position;
		const _distance=_target_pos.distanceTo(_pos);
		//console.log(_distance);
		if(_distance<20){
			//this.CauseDamage();
			this._target.Take_Damage(this._unit,this.constructor.name,super.constructor.name,this._damage);
			this.SelfDestroy();
			return;
		}
		let _speed;
		if (_distance > 2000) {
			_speed = 1000;
		} else if (_distance > 1500) {
			_speed = 500;
		} 
		else if (_distance > 1000) {
			_speed = 400;
		} 
		else if (_distance > 500) {
			_speed = 200;
		}
		else
			_speed = 150;
		
			this.look_at(this._target.Position);
			this.move_forward(timeInSeconds*_speed);
	}
}

export {Rocket5}