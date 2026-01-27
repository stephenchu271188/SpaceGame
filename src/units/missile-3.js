import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
//import {SpaceShip} from './space-ship.js';
import {Rocket} from './rocket.js';
import {thruster} from './thruster.js';

let _speed1;
let _speed2;
let _targets;
			
//Tên lửa tự động đuổi theo mục tiêu, khi đến đủ gần thì phát nổ
class Missile3 extends Rocket {//tàu thám hiểm
	
	constructor(params){
		
		params.health=99999999;
		params.damage=params.game._parameters._standard_hp/2.2;
		
		super(params);
		
		this._radius_effect1=4;//khoảng cách mà khi tên lửa ở gần mục tiêu sẽ phát nổ
		this._radius_effect2=25;//bán kính tầm ảnh hưởng của vụ nổ
		this._radius_scan=90*this._game.rocket_multiplier;//pham vi quet muc tieu
		this._origin_position=this.get_world_position();//vị trí ban đầu
		
		this._max_distance=800*this._game.rocket_multiplier;//quãng đường xa nhất tên lửa có thể bay đi
		this._life=2*this._game.rocket_multiplier;
		
		_speed1=this._game._parameters._standard_rocket_speed*1.7;
		_speed2=this._game._parameters._standard_rocket_speed*2.7;
		
		this._target_id=0;
		this._lock_missile=true;
		
		this.tha = 0;
		this.R = 15;
		this._update_fc=(timeInSeconds)=>{
			this.update(timeInSeconds);
		 };
		this._game.add_to_update_function_list(this._update_fc);
		
		this.create_thruster(new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0));
		
		this._game.add_to_timer(()=>{
			this.SelfDestroy();
		},this._life);
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
		
		//this.rotate_system();
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
        //var map = new THREE.TextureLoader().load("./resources/particle/noname-7.png");
		//var map = new THREE.CanvasTexture(this._game._image_preloader.getImage('particle8'));
		const _image = this._game._image_preloader.getImage('particle8');
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
        //emitter.rate = new Proton.Rate(new Proton.Span(3, 9), new Proton.Span(.001, .02));
		emitter.rate = new Proton.Rate(new Proton.Span(3, 9), new Proton.Span(.01, .02));
        //emitter.addInitialize(new Proton.Mass(1));
        emitter.addInitialize(new Proton.Life(0.5));
        emitter.addInitialize(new Proton.Body(this.createSprite()));
        emitter.addInitialize(new Proton.Radius(8));
        //emitter.addInitialize(new Proton.V(200, new Proton.Vector3D(0, 0, -1), 0));


        //emitter.addBehaviour(new Proton.Alpha(1, 0));
        emitter.addBehaviour(new Proton.Color(color1, color2));
        emitter.addBehaviour(new Proton.Scale(1, 0));
		//emitter.addBehaviour(new Proton.RandomDrift(10, 10, 0.02));
        //emitter.addBehaviour(new Proton.CrossZone(new Proton.ScreenZone(camera, renderer), 'dead'));


        //emitter.addBehaviour(new Proton.Force(0, 0, -20));
       
        emitter.p.x = x;
        emitter.p.y = y;
		emitter.p.z = z;
        //emitter.emit();
		
		
		const emit_time=1.0;
		const emitter_life=0.3;
		emitter.emit(emit_time,emitter_life);
		

        return emitter;
    }
	
	
	SelfDestroy(){
		super.SelfDestroy();
		this._params.game._entities['_explosionSystem'].Splode(this.Position,"#E8EF0D","#E8EF0D",24,96);
		this._game.add_to_timer(()=>{
			this._game.remove_function_from_update_list(this._update_fc);
			this.destroy_thruster();
		},2);
		
		if(this._target_object&&this._target_object!=null){
			this._target_object._is_missile_3_target=false;
		}
	}
	
	CheckTarget(timeInSeconds){
			const _position=this.Position;
			const _t_distance=_position.distanceTo(this._origin_position);
			if(_t_distance>this._max_distance){
				this.SelfDestroy();
				return;
			}
			
			if(!this._ahead_point){
				this._ahead_point=this.get_back_point(250);
			}
			if(_t_distance<100)
			{
				this.move_forward(timeInSeconds*_speed1);
				if(!this._target_object||this._target_object===null||this._target_object.Dead){
					this._target_object=null;
					_targets=this._game._unitMG.get_enemy_combat_unit_in_range_3(this,this._ahead_point,this._radius_scan);
					for(let i=0;i<_targets.length;i++){
						const _target=_targets[i][0];
						if(_target.Dead)continue;
						if(this._utils.calculateAngleDeg(_position,this.getFrontPos(5000),_target.Position)>15)
							continue;
					
						if(_target._is_missile_3_target)//ko de cho 2 ten lua ban' cung muc tieu
							continue;
						if(this._target_object===null){
							this._target_object=_target;
							this._target_object._is_missile_3_target=true;
							break;
						}
					
					}
				
				}
			}	
			else{
				const _length=timeInSeconds*_speed2;
				let _dis;
				if(this._target_object!=null&&!this._target_object.Dead)
					_dis=this.Position.distanceTo(this._target_object.Position);
				else
					_dis=_length;
				
				if(_length<_dis)
					this.move_forward(_length);
				else
					this.move_forward(_dis);
				
				if(this._target_object!=null){
					this.look_at(this._target_object.Position);
				}
				this.Cause_Dammage();
			}
			
	}
	
	Cause_Dammage(){
		let _targets=this._game._unitMG.get_enemy_combat_unit_in_range_3(this,this.Position,this._radius_effect1);
			    
				for(let i=0;i<_targets.length;i++){
					const _target=_targets[i][0];
					if(_target.Dead)continue;
					const _distance=_targets[i][1];
					let _damage=this._params.damage;
					if(_distance>this._radius_effect2*3/4)_damage=this._params.damage/3;
					if(_distance>this._radius_effect2*1/2)_damage=this._params.damage/2;
					
					_target.Take_Damage(this._unit,this.constructor.name,super.constructor.name,_damage);
				}
				if(_targets!=null&&_targets.length>0)this.SelfDestroy();
	}
}

export{Missile3};