import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
//import {SpaceShip} from './space-ship.js';
import {Rocket} from './rocket.js';
import {thruster} from './thruster.js';

//let _nearest_target=null;
//Tên lửa tự động đuổi theo mục tiêu, khi đến đủ gần thì phát nổ
class Missile2 extends Rocket {//tàu thám hiểm
	
	constructor(params){
		
		params.health=99999999;
		params.damage=params.game._parameters._standard_hp/2.2;
		
		super(params);
		
		
		this._radius_effect1=3;//khoảng cách mà khi tên lửa ở gần mục tiêu sẽ phát nổ
		this._radius_effect2=20;//bán kính tầm ảnh hưởng của vụ nổ
		this._radius_scan=90*this._game.rocket_multiplier;//pham vi quet muc tieu
		this._origin_position=this.get_world_position();//vị trí ban đầu
		
		this._max_distance=900*this._game.rocket_multiplier;//quãng đường xa nhất tên lửa có thể bay đi
		this._life=3*this._game.rocket_multiplier;
		
		this._missile_speed1=this._game._parameters._standard_rocket_speed*1.7;
		this._missile_speed2=this._game._parameters._standard_rocket_speed*2.7;
		
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
        //var map = new THREE.TextureLoader().load("./resources/particle/noname-3.png");
		//var map = new THREE.CanvasTexture(this._game._image_preloader.getImage('particle1'));
		const _image = this._game._image_preloader.getImage('particle1');
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
        emitter.rate = new Proton.Rate(new Proton.Span(3, 9), new Proton.Span(.01, .02));
        //emitter.addInitialize(new Proton.Mass(1));
        emitter.addInitialize(new Proton.Life(0.5));
        emitter.addInitialize(new Proton.Body(this.createSprite()));
        emitter.addInitialize(new Proton.Radius(18));
        //emitter.addInitialize(new Proton.V(200, new Proton.Vector3D(0, 0, -1), 0));


        emitter.addBehaviour(new Proton.Alpha(1, 0));
        emitter.addBehaviour(new Proton.Color(color1, color2));
        emitter.addBehaviour(new Proton.Scale(1, 0));
        //emitter.addBehaviour(new Proton.CrossZone(new Proton.ScreenZone(camera, renderer), 'dead'));


        //emitter.addBehaviour(new Proton.Force(0, 20,0));
       
        emitter.p.x = x;
        emitter.p.y = y;
		emitter.p.z = z;
        
		const emit_time=1.0;
		const emitter_life=1.0;
		emitter.emit(emit_time,emitter_life);
		

        return emitter;
    }
	
	SelfDestroy(){
		super.SelfDestroy();
		this._params.game._entities['_explosionSystem'].Splode(this.Position,"#EF2F0D","#EF2F0D",24,96);
		this._game.add_to_timer(()=>{
			this._game.remove_function_from_update_list(this._update_fc);
			this.destroy_thruster();
		},2);
		//this._game.add_to_timer(()=>{//neu stop update qua' som' thi cac particle chua xoa' di het
			//this._game.remove_function_from_update_list(this._update_fc);
		//},13);
		
	}
	
	Cause_Dammage(){
		let _targets=this._game._unitMG.get_enemy_combat_unit_in_range_3(this,this.Position,this._radius_effect1);
			if(_targets.length>0)
				for(let i=0;i<_targets.length;i++){
					const _target=_targets[i][0];
					const _distance=_targets[i][1];
					
					let _damage=this._params.damage;
					if(_distance>this._radius_effect2*3/4)_damage=this._params.damage/3;
					if(_distance>this._radius_effect2*1/2)_damage=this._params.damage/2;
					
					_target.Take_Damage(this._unit,this.constructor.name,super.constructor.name,_damage);
					
				}
		if(_targets!=null&&_targets.length>0)this.SelfDestroy();
	}
	
	CheckTarget(timeInSeconds){
		//try{
			const _position=this.get_world_position();
			const _direction=this.get_world_direction();
		
			const _t_distance=_position.distanceTo(this._origin_position);
			const _speed1=this._missile_speed1;
			const _speed2=this._missile_speed2;
			let _speed;
			if(!this._ahead_point){
				this._ahead_point=this.get_back_point(250);
			}
			
			let _targets;
			if(_t_distance<70)
				_speed=_speed1*timeInSeconds;	
			else
				_speed=_speed2*timeInSeconds;
			
			if(this._target_object&&this._target_object!=null&&!this._target_object.Dead){
				const _tdis=_position.distanceTo(this._target_object.Position);
				if(_speed>_tdis)_speed=_tdis;
			}
			
			this.move_forward(_speed);
			
			this.Cause_Dammage();
				
			//if(_t_distance<70)
			if(!this._target_object||this._target_object===null||this._target_object.Dead){
				this._target_object=null;
				_targets=this._game._unitMG.get_enemy_combat_unit_in_range(this._ahead_point,this._radius_scan);
				for(let i=0;i<_targets.length;i++){
					const _target=_targets[i][0];
					if(_target.Dead)continue;
					if(this._utils.calculateAngleDeg(_position,this.getFrontPos(1000),_target.Position)>10)
						continue;
					
					const _t_distance2=this._utils.distanceToLine(_position,this._ahead_point,_target.get_world_position());
					_target._t_distance2=_t_distance2;
					if(this._target_object===null){
						this._target_object=_target;
					}
					
				}
				
			}
			if(this._target_object!=null){
				if(_t_distance>80){//lúc mới phóng sẽ bay thẳng 1 đoạn rồi mới tự động tìm mục tiêu
					this.look_at(this._target_object.Position);
					if(this.Position.distanceTo(this._target_object.Position)<=this._radius_effect1)
						this.Cause_Dammage();
				}
			}
			else{
				return;
			}
		
		//}catch(e){alert(e.toString());}
	}
	
}

export{Missile2};