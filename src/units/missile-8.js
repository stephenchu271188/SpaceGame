import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
//import {SpaceShip} from './space-ship.js';
import {Rocket} from './rocket.js';
import {thruster} from './thruster.js';

var _speed;
var _max_distance=1000;
// Bắn ra 2 quả rocket: 1 rocket lửa 1 rocket băng
// Rocket lửa có sát thương lớn nhưng tầm ảnh hưởng hẹp
//Rocket băng có sát thương nhỏ nhưng tầm ảnh hưởng lớn và làm giảm speed của enemy-ship bị ảnh hưởng
class Missile8 extends Rocket {
	
	constructor(params){
		
		params.health=99999999;
		params.damage=params.game._parameters._standard_hp*1.5;
		
		super(params);
		
		
		this._radius_effect1=15*this._game.rocket_multiplier;
		this._radius_effect2=30*this._game.rocket_multiplier;
		this._origin_position=this.get_world_position();//vị trí ban đầu
		this._max_distance=_max_distance*this._game.rocket_multiplier;//quãng đường xa nhất tên lửa có thể bay đi
		
		_speed=this._game._parameters._standard_rocket_speed*2.7;
		//this._missile_speed2=this._game._parameters._standard_rocket_speed*2.7;
		
		setTimeout(()=>{
			const _left_pos=this.get_left_point2();
			const _right_pos=this.get_right_point2();
			const _front_pos=this.get_ahead_point(5000);
			
			this._fire_rocket= this._game._unitMG.create_uncombat_unit(FireRocket,this._model.clone(),_left_pos,false);
			this._fire_rocket._model.lookAt(_front_pos);
			this._ice_rocket= this._game._unitMG.create_uncombat_unit(IceRocket,this._model.clone(),_right_pos,false);
			this._ice_rocket._model.lookAt(_front_pos);
			
			this._fire_rocket._move_direct=1;
			this._ice_rocket._move_direct=-1;
			
			this._fire_rocket._damage=this._damage;
			this._ice_rocket._damage=this._damage;
			
			this._fire_rocket._player_id=this._player_id;
			this._ice_rocket._player_id=this._player_id;
			
			this._fire_rocket._unit=this._unit;
			this._ice_rocket._unit=this._unit;
			
		},10);
		
	}
	
	
	CheckTarget(timeInSeconds){
		
			const _position=this.get_world_position();
			
			this.move_forward(timeInSeconds*_speed);
			
			const _t_distance=_position.distanceTo(this._origin_position);
			
			if(_t_distance>this._max_distance){
				this.SelfDestroy();
			}
			
	}
	
}

class FireRocket extends Rocket {
	
	constructor(params){
		
		params.health=99999999;
		params.damage=params.game._parameters._standard_hp/3;
		
		super(params);
		
		this._radius_effect1=30;//khoảng cách mà khi tên lửa ở gần mục tiêu sẽ phát nổ
		this._radius_effect2=50;//bán kính tầm ảnh hưởng của vụ nổ
		this._origin_position=this.get_world_position();//vị trí ban đầu
		this._max_distance=_max_distance;//quãng đường xa nhất tên lửa có thể bay đi
		
		this._target_id=0;
		this._lock_missile=true;
		
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
		//this.proton.removeEmitter(this.emitter2);
		this.proton.destroy();
		//this._game.remove_function_from_update_list(this._update_fc);
		
	}	
	createSprite() {
       
		//var map = new THREE.CanvasTexture(this._game._image_preloader.getImage("particle7"));
		const _image = this._game._image_preloader.getImage('particle7');
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
        emitter.addInitialize(new Proton.Radius(22));
        //emitter.addInitialize(new Proton.V(200, new Proton.Vector3D(0, 0, -1), 0));


        emitter.addBehaviour(new Proton.Alpha(1, 0));
        emitter.addBehaviour(new Proton.Color(color1, color2));
        emitter.addBehaviour(new Proton.Scale(1, 0));
		//emitter.addBehaviour(new Proton.RandomDrift(10, 10, 0.02));
        //emitter.addBehaviour(new Proton.CrossZone(new Proton.ScreenZone(camera, renderer), 'dead'));


        //emitter.addBehaviour(new Proton.Force(0, 0, -20));
       
        emitter.p.x = x;
        emitter.p.y = y;
		emitter.p.z = z;
        //emitter.emit();
		
		
		const emit_time=0.5;
		const emitter_life=0.3;
		emitter.emit(emit_time,emitter_life);
		

        return emitter;
    }
	
	
	SelfDestroy(){
		super.SelfDestroy();
		this._params.game._entities['_explosionSystem'].Splode(this.Position,"#E8EF0D","#E8EF0D",24,96);
		this._game.add_to_timer(()=>{
			this.destroy_thruster();
		},2);
		this._game.add_to_timer(()=>{//neu stop update qua' som' thi cac particle chua xoa' di het
			this._game.remove_function_from_update_list(this._update_fc);
		},13);
		
		if(this._target_object&&this._target_object!=null){
			this._target_object._is_missile_3_target=false;
		}
	}
	
	CheckTarget(timeInSeconds){
		
			const _direction=this.get_world_direction();
			const _position=this.get_world_position();
			if(_position.distanceTo(this._origin_position)>this._max_distance){
				this.SelfDestroy();
			}
			this.move_forward(timeInSeconds*_speed);
			
			const _targets=this._game._unitMG.get_enemy_combat_unit_in_range_3(this,_position,this._radius_effect1);
			for(let i=0;i<_targets.length;i++){
				const _target=_targets[i][0];
				const _distance=_targets[i][1];
				
				let _damage=this._damage;
				if(_distance>this._radius_effect2*3/4)_damage=this._damage/3;
				if(_distance>this._radius_effect2*1/2)_damage=this._damage/2;
				
				//_target.TakeDamage(_damage);
				_target.Take_Damage(this._unit,this.constructor.name,super.constructor.name,_damage);
			}
			if(_targets.length>0)this.SelfDestroy();
	}
	
}


class IceRocket extends Rocket {
	
	constructor(params){
		
		params.health=99999999;
		params.damage=params.game._parameters._standard_hp/3;
		
		super(params);
		
		this._radius_effect1=30;//khoảng cách mà khi tên lửa ở gần mục tiêu sẽ phát nổ
		this._radius_effect2=50;//bán kính tầm ảnh hưởng của vụ nổ
		this._origin_position=this.get_world_position();//vị trí ban đầu
		this._max_distance=_max_distance;//quãng đường xa nhất tên lửa có thể bay đi
		
		this._target_id=0;
		this._lock_missile=true;
		
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
		//this.proton.removeEmitter(this.emitter2);
		this.proton.destroy();
		//this._game.remove_function_from_update_list(this._update_fc);
		
	}	
	createSprite() {
       
		//var map = new THREE.CanvasTexture(this._game._image_preloader.getImage("particle18"));
		const _image = this._game._image_preloader.getImage('particle18');
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
        emitter.addInitialize(new Proton.Radius(22));
        //emitter.addInitialize(new Proton.V(200, new Proton.Vector3D(0, 0, -1), 0));


        emitter.addBehaviour(new Proton.Alpha(1, 0));
        emitter.addBehaviour(new Proton.Color(color1, color2));
        emitter.addBehaviour(new Proton.Scale(1, 0));
		//emitter.addBehaviour(new Proton.RandomDrift(10, 10, 0.02));
        //emitter.addBehaviour(new Proton.CrossZone(new Proton.ScreenZone(camera, renderer), 'dead'));


        //emitter.addBehaviour(new Proton.Force(0, 0, -20));
       
        emitter.p.x = x;
        emitter.p.y = y;
		emitter.p.z = z;
        //emitter.emit();
		
		
		const emit_time=0.5;
		const emitter_life=0.3;
		emitter.emit(emit_time,emitter_life);
		

        return emitter;
    }
	
	
	SelfDestroy(){
		super.SelfDestroy();
		this._params.game._entities['_explosionSystem'].Splode(this.Position,"#E8EF0D","#E8EF0D",24,96);
		this._game.add_to_timer(()=>{
			this.destroy_thruster();
		},2);
		this._game.add_to_timer(()=>{//neu stop update qua' som' thi cac particle chua xoa' di het
			this._game.remove_function_from_update_list(this._update_fc);
		},13);
		
		if(this._target_object&&this._target_object!=null){
			this._target_object._is_missile_3_target=false;
		}
	}
	
	CheckTarget(timeInSeconds){
		
			const _direction=this.get_world_direction();
			const _position=this.get_world_position();
			if(_position.distanceTo(this._origin_position)>this._max_distance){
				this.SelfDestroy();
			}
			this.move_forward(timeInSeconds*_speed);
			
			const _targets=this._game._unitMG.get_enemy_combat_unit_in_range_3(this,_position,this._radius_effect1);
			for(let i=0;i<_targets.length;i++){
				const _target=_targets[i][0];
				const _distance=_targets[i][1];
				//let _damage=(_distance/this._radius_effect)*this._params.damage;
				let _damage=this._damage;
				if(_distance>this._radius_effect2*3/4)_damage=this._damage/3;
				if(_distance>this._radius_effect2*1/2)_damage=this._damage/2;
				//else _damage=this._params.damage;
				
				//_target.TakeDamage(_damage);
				_target.Take_Damage(this._unit,this.constructor.name,super.constructor.name,_damage);
			}
			if(_targets.length>0)this.SelfDestroy();
	}
	
}
export{Missile8};