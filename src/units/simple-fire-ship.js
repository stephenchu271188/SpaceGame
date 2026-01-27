import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {SpaceShip} from './space-ship.js';

class SimpleFireShip extends SpaceShip {
	
	constructor(params){
		params.laser_color=new THREE.Color(247, 10, 2);
		params.shoot_delay=0.5;//thời gian delay giữa 2 lần bắn
		
		params.health=params.game._parameters._standard_hp*1;
		params.damage=params.game._parameters._standard_hp/30;
		//params.blaster_radius=6;
		super(params);
		
		//console.log("InitRocketShipDamage:"+this._damage);
		
		this._recovery_time=8;//thời gian hồi phục
		this._lock_fire=true;
		
		this._rocket_speed=60;
		
		this._counter1=0;
		this._lock_2=false;
	}
	Fire(){//overwrite
	
		if(typeof this._target_object==='undefined'||this._target_object===null||this._target_object.Dead)return false;
		if(this._lock_fire)return false;
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
		let _UnitClass=SimpleFireBall;
		let _rocket= this._game._unitMG.create_combat_unit(_UnitClass,model,_pos1,true);
		_rocket._damage=this._damage;
		_rocket._missile_speed=this._rocket_speed;
		this._game._graphics.Scene.add(_rocket._model);
		//_rocket._model.lookAt(_pos2);		
		const _lookPos=this._utils.calculateSymmetricPoint(_rocket._model.position,this._target_object.Position);
		_rocket._model.lookAt(_lookPos);
		
		
		this._game._sound.play('missile-launch');
		
		return true;
	}

}


class SimpleFireBall extends SpaceShip {
	
	constructor(params){
	
		params.health=200;
		//params.damage=params.game._parameters._standard_hp/30;
		
		super(params);
	
		this._radius_effect1=60;//khoảng cách mà khi tên lửa ở gần mục tiêu sẽ phát nổ
		this._radius_effect2=60;//bán kính tầm ảnh hưởng của vụ nổ
		this._origin_position=this.get_world_position();//vị trí ban đầu
		this._max_distance=600;//quãng đường xa nhất tên lửa có thể bay đi
		this._missile_speed=0;
		this._damage=params.damage;
		
			this.tha = 0;
		this.R = 15;
		this._update_fc=(timeInSeconds)=>{
			this.update(timeInSeconds);
		 };
		this._game.add_to_update_function_list(this._update_fc);
		
		this.create_thruster(new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0));
		
		this._model.visible=false;
		
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

        this.emitter1 = this.createEmitter(position.x,position.y,position.z, '#FFA500', '#FFA500');
		
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
        //var map = new THREE.TextureLoader().load("./resources/particle/noname-3.png");
		//var map = new THREE.CanvasTexture(this._game._image_preloader.getImage('particle11'));
		const _image = this._game._image_preloader.getImage('particle11');
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
        emitter.rate = new Proton.Rate(new Proton.Span(3, 9), new Proton.Span(.001, .002));
        
        emitter.addInitialize(new Proton.Life(0.4));
        emitter.addInitialize(new Proton.Body(this.createSprite()));
        emitter.addInitialize(new Proton.Radius(20));
        //emitter.addInitialize(new Proton.V(200, new Proton.Vector3D(0, 0, -1), 0));
        //emitter.addInitialize(new Proton.Mass(1));

        //emitter.addBehaviour(new Proton.Alpha(1, 0));
        emitter.addBehaviour(new Proton.Color(color1, color2));
        emitter.addBehaviour(new Proton.Scale(1, 0));
        //emitter.addBehaviour(new Proton.CrossZone(new Proton.ScreenZone(camera, renderer), 'dead'));
		//emitter.addBehaviour(new Proton.RandomDrift(20, 15,15));
		//var rotation = new Proton.Rotate(50,50);
        //emitter.addBehaviour(rotation);

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
		//this._params.game._entities['_explosionSystem'].Splode(this.Position,"#109BE7","#109BE7",24,96,12);
		//this._params.game._entities['_explosionSystem'].Splode(this.Position,"#FFFFFF","#FFFFFF",24,96);
		this._game.add_to_timer(()=>{
			this._game.remove_function_from_update_list(this._update_fc);
			this.destroy_thruster();
		},2);
		//this._game.add_to_timer(()=>{//neu stop update qua' som' thi cac particle chua xoa' di het
			//this._game.remove_function_from_update_list(this._update_fc);
		//},13);
	}
	
	CheckTarget(timeInSeconds){//legion-game
		//try{
			const _position=this.get_world_position();
			if(_position.distanceTo(this._origin_position)>this._max_distance){
				this.SelfDestroy();
			}
			this.move_forward(timeInSeconds*this._missile_speed);
			
			
			let _targets=[];
			const _distance_to_target=this._game._me.Position.distanceTo(this.Position);
			if(_distance_to_target<=this._radius_effect1)
				_targets=[[this._game._me,_distance_to_target]];
			
			
			if(_targets.length>0){
				if(!this._last_time){
					this._last_time=0;
					this._rand_second=this._game._utils.get_random_in_range(1,4);
				}
				this._last_time+=timeInSeconds;
				if(this._last_time>=1){//1 giay 1 lan
					this._last_time=0;
					
					for(let i=0;i<_targets.length;i++){
						const _target=_targets[i][0];
						//if(_target._player_id===this._player_id)continue;
				
						const _distance=_targets[i][1];
						//let _damage=(_distance/this._radius_effect)*this._params.damage;
						let _damage=this._damage;
						if(_distance>this._radius_effect2*3/4)_damage=this._damage/3;
						if(_distance>this._radius_effect2*1/2)_damage=this._damage/2;
						//console.log("Damage="+_damage);
						_target.TakeDamage(_damage);
					}
					
					this._counter1++;
					let _delay;
					if(this._lock_2)
						_delay=5+this._rand_second;
					else
						_delay=2+this._rand_second;
					if(this._counter1>=_delay){
						this._counter1=0;
						this._lock_2=!this._lock_2;
					}
				}
			}
		//}catch(e){alert(e.toString());}
	}
}


export {SimpleFireShip}