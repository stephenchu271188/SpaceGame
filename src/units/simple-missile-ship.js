import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {SpaceShip} from './space-ship.js';
import {Sparks} from './skills/sparks.js';
import {FlashEffect1} from './flash-effect-1.js';

class SimpleMissileShip extends SpaceShip {
	
	constructor(params){
		params.laser_color=new THREE.Color(247, 10, 2);
		params.shoot_delay=0.5;//thời gian delay giữa 2 lần bắn
		
		params.health=params.game._parameters._standard_hp*1;
		params.damage=params.game._parameters._standard_hp/10;
		
		super(params);
		
		//this._damage=params.damage;
		
		
		this._recovery_time=7;//thời gian hồi phục
		this._lock_fire=true;
		
		this._rocket_speed=this._game._parameters._standard_rocket_speed*2.5;
	}
	Fire(){//overwrite
		
		if(typeof this._target_object==='undefined'||this._target_object===null||this._target_object.Dead)return;
		if(this._lock_fire)return;
		this._lock_fire=true;
		
		this._game.add_to_timer(()=>{
			this._lock_fire=false;
		},this._recovery_time);
		
		let _pos1=this.get_ahead_point(15);
		//let _pos2=this.get_ahead_point(150);
	
		let gltf=this._game._unitMG._data_list["missile-1"];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(3.5);
		model.rotation.z=Math.PI;
		let _UnitClass=SimpleMissile;
		let _rocket= this._game._unitMG.create_combat_unit(_UnitClass,model,_pos1,true);
		_rocket._damage=this._damage;
		//_rocket._game=this._game;
		_rocket._missile_speed=this._rocket_speed;
		this._game._graphics.Scene.add(_rocket._model);
		//_rocket._model.lookAt(_pos2);		
		const _lookPos=this._utils.calculateSymmetricPoint(_rocket._model.position,this._target_object.Position);
		_rocket._model.lookAt(_lookPos);
		
		
		this._game._sound.play('missile-launch');
	}
	
}

class SimpleMissile extends SpaceShip {
	
	constructor(params){
	
		params.health=5;
		//params.damage=params.game._parameters._standard_hp/30;
		
		super(params);
	
		this._radius_effect1=7;//khoảng cách mà khi tên lửa ở gần mục tiêu sẽ phát nổ
		this._radius_effect2=20*this._game.rocket_multiplier;//bán kính tầm ảnh hưởng của vụ nổ
		this._origin_position=this.get_world_position();//vị trí ban đầu
		this._max_distance=2000*this._game.rocket_multiplier;//quãng đường xa nhất tên lửa có thể bay đi
		this._missile_speed=0;
		this._damage=params.damage;
		
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
		/*
		this.proton.emitters.forEach(emitter => {
			emitter.stopEmit();
		});
		
		
		this.proton.emitters.forEach(emitter => {
			emitter.particles.forEach(particle => {
				
				//emitter.removeParticle(particle);//sẽ gây lỗi, nhưng nhờ có lỗi mới destroy được,(chưa rõ nguyên nhân vì sao khi destroy mà system vẫn ko bị remove khỏi scene
				
			});
			emitter.removeAllParticles();
		});
		this.emitter1.destroy();
		this.proton.removeEmitter(this.emitter1);
		this.proton.destroy();
		*/
	}	
	createSprite() {
		//var map = new THREE.CanvasTexture(this._game._image_preloader.getImage('particle9'));
		const _image = this._game._image_preloader.getImage('particle9');
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
        emitter.rate = new Proton.Rate(new Proton.Span(3, 9), new Proton.Span(.005, .01));
        //emitter.addInitialize(new Proton.Mass(1));
        emitter.addInitialize(new Proton.Life(0.5));
        emitter.addInitialize(new Proton.Body(this.createSprite()));
        emitter.addInitialize(new Proton.Radius(12));
        //emitter.addInitialize(new Proton.V(200, new Proton.Vector3D(0, 0, -1), 0));


        //emitter.addBehaviour(new Proton.Alpha(1, 0));
        //emitter.addBehaviour(new Proton.Color(color1, color2));
        emitter.addBehaviour(new Proton.Scale(1, 0));
        //emitter.addBehaviour(new Proton.CrossZone(new Proton.ScreenZone(camera, renderer), 'dead'));


        //emitter.addBehaviour(new Proton.Force(0, 0, -20));
       
        emitter.p.x = x;
        emitter.p.y = y;
		emitter.p.z = z;
        
		const emit_time=0.5;
		const emitter_life=0.5;
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
	
	CheckTarget(timeInSeconds){
		//try{
			const _position=this.Position;
			const _t_distance=_position.distanceTo(this._origin_position);
			const _speed1=70;
			const _speed2=100;
			if(_t_distance>this._max_distance){
				this.SelfDestroy();
			}
			
			let _targets;
				
			this._target_object=this._game._me;
			
			if(_t_distance<70)
				this.move_forward(timeInSeconds*_speed1);
			else
				this.move_forward(timeInSeconds*_speed2);
			
			
			if(this._target_object!=null&&!this._target_object.Dead){
				this.look_at(this._target_object.Position);
				if(_position.distanceTo(this._target_object.Position)<=this._radius_effect1){
					
					//_targets=this._game._unitMG.get_enemy_combat_unit_in_range_2(-1,_position,this._radius_effect1);
					_targets=[[this._target_object,0]];
					for(let i=0;i<_targets.length;i++){
						const _target=_targets[i][0];
						const _distance=_targets[i][1];
						if(_target.Dead)continue;
						
						let _damage=this._damage;
						if(_distance>this._radius_effect2*3/4)_damage=this._damage/3;
						if(_distance>this._radius_effect2*1/2)_damage=this._damage/2;
						
						_target.TakeDamage(_damage);//alert(_damage);
					}
					this.SelfDestroy();
				}	
			}
		//}catch(e){alert(e.stack);}	
	}
}

export{SimpleMissileShip};