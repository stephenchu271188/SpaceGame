import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {Spacecraft} from './spacecraft.js';

class Rocket4 extends Spacecraft {
	constructor(params){
		
		params.health=99999999;
		params.damage=params.game._parameters._standard_hp/2;
		
		super(params);
		
		
		this._radius_effect1=15*this._game.rocket_multiplier;//khoảng cách mà khi tên lửa ở gần mục tiêu sẽ phát nổ
		this._radius_effect2=25*this._game.rocket_multiplier;//bán kính tầm ảnh hưởng của vụ nổ
		this._origin_position=this.get_world_position();//vị trí ban đầu
		this._max_distance=800*this._game.rocket_multiplier;//quãng đường xa nhất tên lửa có thể bay đi
		this._missile_speed=this._game._parameters._standard_rocket_speed*1.7;
		
		this.emit_time=1.0;
		this.emitter_life=1.0;
		
		this._lock=true;
	}
	
	/*
		Khi _time!=undefined va _time!=null thi bat che do hen gio (time)
		
	*/
	launch(_particle_id,_particle_radius,_life,_time){
		this._particle_id=_particle_id;
		this._particle_radius=_particle_radius;
		
		this._finish_phase_1=false;
		this._game.add_to_timer(()=>{
			this._finish_phase_1=true;
		},_life);
		
		if(typeof _time!='undefined'&&_time!=null)
			this._time_delay=_time;
		
		
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
        //alert(this._particle_id);
		//var map = new THREE.CanvasTexture(this._game._image_preloader.getImage(this._particle_id));
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
        emitter.rate = new Proton.Rate(new Proton.Span(3, 9), new Proton.Span(.01, .02));
        //emitter.addInitialize(new Proton.Mass(1));
        emitter.addInitialize(new Proton.Life(0.5));
        emitter.addInitialize(new Proton.Body(this.createSprite()));
        emitter.addInitialize(new Proton.Radius(this._particle_radius));
        //emitter.addInitialize(new Proton.V(200, new Proton.Vector3D(0, 0, -1), 0));


        emitter.addBehaviour(new Proton.Alpha(1, 0));
        emitter.addBehaviour(new Proton.Color(color1, color2));
        emitter.addBehaviour(new Proton.Scale(1, 0));
        //emitter.addBehaviour(new Proton.CrossZone(new Proton.ScreenZone(camera, renderer), 'dead'));


        //emitter.addBehaviour(new Proton.Force(0, 0, -20));
       
        emitter.p.x = x;
        emitter.p.y = y;
		emitter.p.z = z;
        
		//const emit_time=1.0;
		//const emitter_life=1.0;
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
	
	CheckTarget(timeInSeconds){
		if(this._lock)return;
		this.CauseDamage();
			if(this._finish_phase_1){
				if(this._time_delay){
					this._model.rotation.y+=(timeInSeconds*0.6);
					if(!this._delaying)this._delaying=false;
					if(this._delaying)return;
					this._delaying=true;
					
					this._game.add_to_timer(()=>{
						//this.CauseDamage();
						this.SelfDestroy();
					},this._time_delay);
					return;
				}
				else
					this.SelfDestroy();
			}
			this.move_forward(timeInSeconds*this._missile_speed);
	}
}

export{Rocket4};
