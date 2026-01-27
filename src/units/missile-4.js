import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {SpaceShip} from './space-ship.js';
import {Rocket} from './rocket.js';
import {thruster} from './thruster.js';

//bắn 1 lúc ra 4 quả rocket tầm bay xa và gây thiệt hại cho tất cả các unit mà nó bay ngang qua
//khi chưa đạt tới cự ly xa nhất thì gây sát thương cho các unit mà nó bay ngang qua
//chỉ khi bay tới cự ly cực đại mới phát nổ và gây sát thương mạnh hơn
class Missile4 extends Rocket {
	constructor(params){
		super(params);
		
		this._model.visible=false;
		
		this._damage=params.game._parameters._standard_hp/3;
		
		setTimeout(()=>{
		
		let _child_num=4;
		
		for(let i=0;i<_child_num;i++){
			const _position=this.Position;
		const _left_pos=this.get_left_point();
		const _right_pos=this.get_right_point();
		const _front_pos=this.get_ahead_point(900);
		const _bellow_pos=this.get_bellow_point();
		const _above_pos=this.get_above_point();
		const _pos_list=[
			findPointP4(_position,_left_pos,_front_pos),//phia truoc, ben trai
			findPointP4(_position,_right_pos,_front_pos),//phia truoc, ben phai
			findPointP4(_position,_bellow_pos,_front_pos),//phia truoc, phia duoi'
			findPointP4(_position,_above_pos,_front_pos)
		];
		
			const _child_rocket= this._game._unitMG.create_uncombat_unit(ChildMissile6,this._model.clone(),_position,false);
			_child_rocket._model.lookAt(_pos_list[i]);
			_child_rocket._damage=this._damage;
			_child_rocket._player_id=this._player_id;
			//_child_rocket._model.lookAt(this.get_ahead_point(50));
		}
		
		},50);
		
		this.SelfDestroy();
		//console.log("DONE!!!!!!");
	}
}

class ChildMissile6 extends SpaceShip {//tàu thám hiểm
	
	constructor(params){
		
		params.health=99999999;
		//params.damage=params.game._parameters._standard_hp/2;
		
		super(params);
		
		
		this._radius_effect1=40*this._game.rocket_multiplier;//khoảng cách mà khi tên lửa ở gần mục tiêu sẽ phát nổ
		this._radius_effect2=40*this._game.rocket_multiplier;//bán kính tầm ảnh hưởng của vụ nổ
		this._origin_position=this.get_world_position();//vị trí ban đầu
		this._max_distance=800*this._game.rocket_multiplier;//quãng đường xa nhất tên lửa có thể bay đi
		
		this._missile_speed1=this._game._parameters._standard_rocket_speed*1.7;
		this._missile_speed2=this._game._parameters._standard_rocket_speed*2.7;
		
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
        //var map = new THREE.TextureLoader().load("./resources/particle/noname-3.png");
		//var map = new THREE.CanvasTexture(this._game._image_preloader.getImage('particle38'));
		const _image = this._game._image_preloader.getImage('particle38');
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
        emitter.addInitialize(new Proton.Radius(16));
        //emitter.addInitialize(new Proton.V(200, new Proton.Vector3D(0, 0, -1), 0));


        emitter.addBehaviour(new Proton.Alpha(1, 0));
        emitter.addBehaviour(new Proton.Color(color1, color2));
        emitter.addBehaviour(new Proton.Scale(1, 0));
        //emitter.addBehaviour(new Proton.CrossZone(new Proton.ScreenZone(camera, renderer), 'dead'));


        //emitter.addBehaviour(new Proton.Force(0, 0, -20));
       
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
			this.destroy_thruster();
		},2);
		this._game.add_to_timer(()=>{//neu stop update qua' som' thi cac particle chua xoa' di het
			this._game.remove_function_from_update_list(this._update_fc);
		},13);
		
	}
	
	CheckTarget(timeInSeconds){
			if(!this._damage1){
				this._damage1=this._damage/2;//sát thương gây ra khi bay ngang qua đối phương
				this._damage2=this._damage;//sát thương gây ra khi phát nổ
			}
			const _position=this.get_world_position();
			const _direction=this.get_world_direction();
			//const _ahead_point=this.get_ahead_point(90);
			const _t_distance=_position.distanceTo(this._origin_position);
			const _speed1=this._missile_speed1;
			const _speed2=this._missile_speed2;
			
			this.move_forward(timeInSeconds*_speed1);
			//console.log(this._player_id);
			//const _targets=this._game._unitMG.get_enemy_combat_unit_in_range(_position,this._radius_effect1);
			const _targets=this._game._unitMG.get_enemy_combat_unit_in_range_3(this,_position,this._radius_effect1);
			//const _targets=this._game._unitMG.get_enemy_combat_unit_in_range_2(this._player_id,_position,this._radius_effect1);
			for(let i=0;i<_targets.length;i++){
				//console.log(1111111111111111111111);
				const _target=_targets[i][0];
				if(!_target.hit_by_missile_6)
					_target.hit_by_missile_6=new Array();//để giới hạn số lần takedamage
				
				if(_target.hit_by_missile_6.length>=4)continue;
				let _found=false;
				for(let j=0;j<_target.hit_by_missile_6.length;j++){
					if(_target.hit_by_missile_6[j]===this){
						_found=true;
						break;
					}
				}
				if(_found)continue;
				_target.hit_by_missile_6.push(this);
				
				_target.hit_by_missile_6++;
				if(_target.hit_by_missile_6>4)continue;
				
				const _distance=_targets[i][1];
				
				let _damage=this._damage1;
				if(_distance>this._radius_effect1*3/4)_damage=this._damage1/3;
				if(_distance>this._radius_effect1*1/2)_damage=this._damage1/2;
				
				_target.TakeDamage(_damage);
			}
			
			if(_t_distance>this._max_distance){
				for(let i=0;i<_targets.length;i++){
					const _target=_targets[i][0];
					const _distance=_targets[i][1];
				
					let _damage=this._damage2;
					if(_distance>this._radius_effect2*3/4)_damage=this._damage2/3;
					if(_distance>this._radius_effect2*1/2)_damage=this._damage2/2;
				
					_target.TakeDamage(_damage);
				}
				this.SelfDestroy();
			}
			
	}
	
}

export{Missile4};


function findPointP4(vectorP1, vectorP2, vectorP3) {
  
  // Calculate direction vectors for P1P2 and P1P3
  const directionP1P2 = vectorP2.clone().sub(vectorP1);
  const directionP1P3 = vectorP3.clone().sub(vectorP1);

  // Normalize direction vectors
  directionP1P2.normalize();
  directionP1P3.normalize();

  // Calculate cross product of direction vectors to find perpendicular direction for P2P4
  const perpendicularDirection = directionP1P2.cross(directionP1P3);

  // Normalize perpendicular direction
  perpendicularDirection.normalize();

  // Calculate midpoint of P2P3
  const midpointP2P3 = vectorP2.clone().add(vectorP3).divideScalar(2);

  // Extend perpendicular direction from midpointP2P3 to find P4
  let vectorP4 = midpointP2P3.clone().add(perpendicularDirection.multiplyScalar(length));

	return vectorP4;
  // Convert Three.js vector to object
  //return { x: vectorP4.x, y: vectorP4.y, z: vectorP4.z };
}
/*
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {SpaceShip} from './space-ship.js';
import {Rocket} from './rocket.js';
import {thruster} from './thruster.js';

var _particle='particle38';
//Tên lửa chùm, bắn 1 lần ra 5 quả
class Missile4 extends Rocket{
	constructor(params){
		
		params.health=99999999;
		params.damage=params.game._parameters._standard_hp/4;
		
		super(params);
		
		this._radius_effect1=15*this._game.rocket_multiplier;//khoảng cách mà khi tên lửa ở gần mục tiêu sẽ phát nổ
		this._radius_effect2=25*this._game.rocket_multiplier;//bán kính tầm ảnh hưởng của vụ nổ
		this._origin_position=this.get_world_position();//vị trí ban đầu
		this._max_distance=800*this._game.rocket_multiplier;//quãng đường xa nhất tên lửa có thể bay đi
		
		this._missile_speed1=this._game._parameters._standard_rocket_speed*2.7;
		this._missile_speed2=this._game._parameters._standard_rocket_speed*2.7;
		
		this._target_id=0;
		this._lock_missile=true;
		
		this.tha = 0;
		this.R = 15;
		this._update_fc=(timeInSeconds)=>{
			this.update(timeInSeconds);
		 };
		this._game.add_to_update_function_list(this._update_fc);
		
		this.create_thruster(new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0));
		
		this._child_rocket_num=5;
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
        //var map = new THREE.TextureLoader().load("./resources/particle/noname-7.png");
		var map = new THREE.CanvasTexture(this._game._image_preloader.getImage(_particle));
        var material = new THREE.SpriteMaterial({
            map: map,
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
        emitter.addInitialize(new Proton.Radius(4));
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
		//this._params.game._entities['_explosionSystem'].Splode(this.Position,"#E8EF0D","#E8EF0D",24,96);
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
			const _position=this.get_world_position();
			const _direction=this.get_world_direction();
			
			const _t_distance=_position.distanceTo(this._origin_position);
			const _speed1=this._missile_speed1;
			const _speed2=this._missile_speed2;
			
			if(!this._ahead_point){
				this._ahead_point=this.get_back_point(250);
			}
			
			let _targets=this._game._unitMG.get_enemy_combat_unit_in_range_3(this,_position,this._radius_effect1);;
			if(_t_distance<80)
			{
				this.move_forward(timeInSeconds*_speed1);
			}	
			if(_t_distance>80||_targets.length>0){
				for(let i=0;i<_targets.length;i++){
					const _target=_targets[i][0];
					const _distance=_targets[i][1];
					
					let _damage=this._params.damage;
					if(_distance>this._radius_effect2*3/4)_damage=this._params.damage/3;
					if(_distance>this._radius_effect2*1/2)_damage=this._params.damage/2;
					
					//_target.TakeDamage(_damage);
					_target.Take_Damage(this._unit,this.constructor.name,super.constructor.name,_damage);
				}
			
				const _left_pos=this.get_left_point();
				const _right_pos=this.get_right_point();
				const _front_pos=this.get_ahead_point(300);
				const _bellow_pos=this.get_bellow_point();
				const _above_pos=this.get_above_point();
				const _pos_list=[
					findPointP4(_position,_left_pos,_front_pos),//phia truoc, ben trai
					findPointP4(_position,_right_pos,_front_pos),//phia truoc, ben phai
					findPointP4(_position,_bellow_pos,_front_pos),//phia truoc, phia duoi'
					findPointP4(_position,_above_pos,_front_pos),
					findPointP4(_position,_bellow_pos,_front_pos),
					findPointP4(_position,_bellow_pos,_front_pos)
				];
				for(let i=0;i<this._child_rocket_num;i++){
					const _child_rocket= this._game._unitMG.create_uncombat_unit(ChildMissile4,this._model,this.Position,false);
					_child_rocket._model.lookAt(_pos_list[i]);
					//_child_rocket._player_id=this._player_id;
					//_child_rocket._unit=this._unit;
					
					//const geometry = new THREE.SphereGeometry( 15, 32, 16 ); 
					//const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
					//const sphere = new THREE.Mesh( geometry, material ); 
					//this._game._graphics.Scene.add( sphere );
				}
				
				this.SelfDestroy();
			}
				
			
	}
}

class ChildMissile4 extends SpaceShip {
	
	constructor(params){
		
		params.health=99999999;
		params.damage=params.game._parameters._standard_hp/3;
		
		super(params);
		
		this._radius_effect1=20;//khoảng cách mà khi tên lửa ở gần mục tiêu sẽ phát nổ
		this._radius_effect2=45;//bán kính tầm ảnh hưởng của vụ nổ
		this._origin_position=this.get_world_position();//vị trí ban đầu
		this._max_distance=800*this._game.rocket_multiplier;//quãng đường xa nhất tên lửa có thể bay đi
		
		this._missile_speed1=this._game._parameters._standard_rocket_speed*2.7;
		this._missile_speed2=this._game._parameters._standard_rocket_speed*2.7;
		
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
        //var map = new THREE.TextureLoader().load("./resources/particle/noname-7.png");
		var map = new THREE.CanvasTexture(this._game._image_preloader.getImage(_particle));
        var material = new THREE.SpriteMaterial({
            map: map,
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
        emitter.addInitialize(new Proton.Radius(8));
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
		const _position=this.get_world_position();
			const _direction=this.get_world_direction();
			//const _ahead_point=this.get_ahead_point(90);
			const _t_distance=_position.distanceTo(this._origin_position);
			const _speed1=this._missile_speed1;
			const _speed2=this._missile_speed2;
			
			if(!this._ahead_point){
				this._ahead_point=this.get_back_point(250);
			}
			
			if(_t_distance<600)
			{
				this.move_forward(timeInSeconds*_speed1);
			}	
			else{
				
				this.SelfDestroy();
				return;
			}
			let _targets=this._game._unitMG.get_enemy_combat_unit_in_range_3(this,_position,this._radius_effect1);
			
				for(let i=0;i<_targets.length;i++){
					const _target=_targets[i][0];
					const _distance=_targets[i][1];
					//let _damage=(_distance/this._radius_effect2)*this._params.damage;
					let _damage=this._params.damage;
					if(_distance>this._radius_effect2*3/4)_damage=this._params.damage/3;
					if(_distance>this._radius_effect2*1/2)_damage=this._params.damage/2;
					//else _damage=this._params.damage;
				
					//_target.TakeDamage(_damage);
					_target.Take_Damage(this._unit,this.constructor.name,super.constructor.name,_damage);
				}
				if(_targets.length>0)
					this.SelfDestroy();
	}
	
}

export{Missile4};

function findPointP4(vectorP1, vectorP2, vectorP3) {
  
  // Calculate direction vectors for P1P2 and P1P3
  const directionP1P2 = vectorP2.clone().sub(vectorP1);
  const directionP1P3 = vectorP3.clone().sub(vectorP1);

  // Normalize direction vectors
  directionP1P2.normalize();
  directionP1P3.normalize();

  // Calculate cross product of direction vectors to find perpendicular direction for P2P4
  const perpendicularDirection = directionP1P2.cross(directionP1P3);

  // Normalize perpendicular direction
  perpendicularDirection.normalize();

  // Calculate midpoint of P2P3
  const midpointP2P3 = vectorP2.clone().add(vectorP3).divideScalar(2);

  // Extend perpendicular direction from midpointP2P3 to find P4
  let vectorP4 = midpointP2P3.clone().add(perpendicularDirection.multiplyScalar(length));

	return vectorP4;
  // Convert Three.js vector to object
  //return { x: vectorP4.x, y: vectorP4.y, z: vectorP4.z };
}

*/