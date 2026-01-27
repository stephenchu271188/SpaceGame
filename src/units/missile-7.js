import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
//import {SpaceShip} from './space-ship.js';
import {Rocket} from './rocket.js';
import {thruster} from './thruster.js';


//Tầm bắn cực xa, bay được một đoạn rất xa rồi mới kích hoạt chức năng chọn và bám theo mục tiêu
//Trong quá trình bay sẽ gây sát thương(ko lớn lắm) lên các unit ở gần đường bay mà nó bay qua
//Khi phát nổ hoặc khi đâm vào mục tiêu đã chọn sẽ gây sát thương lớn hơn
//Bán kính sát thương khi phát nổ khá lớn
class Missile7 extends Rocket {
	
	constructor(params){
		
		params.health=99999999;
		params.damage=params.game._parameters._standard_hp;
		
		super(params);
		
		
		this._radius_effect1=15*this._game.rocket_multiplier;//khoảng cách mà khi tên lửa ở gần mục tiêu sẽ phát nổ
		this._radius_effect2=70*this._game.rocket_multiplier;//bán kính tầm ảnh hưởng của vụ nổ
		this._radius_effect3=50*this._game.rocket_multiplier;//ở khoảng cách này enemy-unit sẽ bị thiệt hại khi tên lửa bay ngang qua
		this._origin_position=this.get_world_position();//vị trí ban đầu
		this._max_distance=5000*this._game.rocket_multiplier;//quãng đường xa nhất tên lửa có thể bay đi
		this._seek_enemy_distance=parseInt(500);//quãng đường mà tên lửa bay theo đường thẳng, sau khi vượt qua quãng đường này sẽ tìm mục tiêu
		
		this._missile_speed1=this._game._parameters._standard_rocket_speed*2.7;
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
		//var map = new THREE.CanvasTexture(this._game._image_preloader.getImage('particle3'));
		const _image = this._game._image_preloader.getImage('particle3');
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
        emitter.addInitialize(new Proton.Radius(26));
        //emitter.addInitialize(new Proton.V(200, new Proton.Vector3D(0, 0, -1), 0));


        emitter.addBehaviour(new Proton.Alpha(1, 0));
        emitter.addBehaviour(new Proton.Color(color1, color2));
        emitter.addBehaviour(new Proton.Scale(1, 0));
        //emitter.addBehaviour(new Proton.CrossZone(new Proton.ScreenZone(camera, renderer), 'dead'));


        //emitter.addBehaviour(new Proton.Force(0, 0, -20));
       
        emitter.p.x = x;
        emitter.p.y = y;
		emitter.p.z = z;
        
		const emit_time=2.0;
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
	
	cause_damage(_full_damage){
		let _targets=this._game._unitMG.get_enemy_combat_unit_in_range_3(this,this.Position,this._radius_effect3);
			for(let i=0;i<_targets.length;i++){
					const _target=_targets[i][0];
					const _distance=_targets[i][1];
					
					if(!_target.hit_by_missile_7)
					_target.hit_by_missile_7=new Array();//để giới hạn số lần takedamage
				
					let _found=false;
					for(let j=0;j<_target.hit_by_missile_7.length;j++){
						if(_target.hit_by_missile_7[j]===this){
							_found=true;
							break;
						}
					}
					if(_found)continue;
					_target.hit_by_missile_7.push(this);
					
					let _damage=_full_damage;
					if(_distance>this._radius_effect2*3/4)_damage=_full_damage/3;
					if(_distance>this._radius_effect2*1/2)_damage=_full_damage/2;
					//else _damage=this._params.damage;
				
					//_target.TakeDamage(_damage);
					_target.Take_Damage(this._unit,this.constructor.name,super.constructor.name,_damage);
				}
	}
	
	chase_target(_position){//tìm và bám theo mục tiêu
			
			if(!this._ahead_point){
				this._ahead_point=this.get_back_point(this._max_distance/4);
			}
			if(!this._target_object||this._target_object===null){
				this._target_object=null;
				let _targets=this._game._unitMG.get_enemy_combat_unit_in_range_3(this,this._ahead_point,this._max_distance/4);
				for(let i=0;i<_targets.length;i++){
					const _target=_targets[i][0];
					if(_target.Dead)continue;
					if(this._utils.calculateAngleDeg(_position,_target.Position,this.get_back_point(100))>30)
						continue;
					
					const _t_distance2=this._utils.distanceToLine(_position,this._ahead_point,_target.get_world_position());
					_target._t_distance2=_t_distance2;
					if(this._target_object===null){
						this._target_object=_target;
					}
					
				}
				
			}
			
			if(this._target_object!=null){
				if(this._target_object.Dead){
					
				}
				else{
					const _pos=this._utils.calculateSymmetricPoint(this._model.position,this._target_object.get_world_position());
					this._model.lookAt(_pos);
					if(this.Position.distanceTo(this._target_object.Position)<=this._radius_effect1){
						this.cause_damage(this._damage);
						this.SelfDestroy();
					}
				}
			}
			
	}
	
	CheckTarget(timeInSeconds){
		
			const _position=this.get_world_position();
			const _direction=this.get_world_direction();
			//const _ahead_point=this.get_ahead_point(90);
			const _t_distance=_position.distanceTo(this._origin_position);
			const _speed1=this._missile_speed1;
			const _speed2=this._missile_speed1;
			if(_t_distance>this._max_distance){
				this.SelfDestroy();
			}
			
			this.cause_damage(this._damage/2);//gây sát thương khi bay ngang qua
			
				
			if(_t_distance<this._seek_enemy_distance)
				this.move_forward(timeInSeconds*_speed1);
			else{
				this.move_forward(timeInSeconds*_speed2);
				if(_t_distance>this._max_distance){
					this.cause_damage(this._damage);
					this.SelfDestroy();
				}
				else{
					this.chase_target(_position);
				}
			}
				
			
	}
	
}

export{Missile7};