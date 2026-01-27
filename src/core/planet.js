import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {SphericalObject} from './spherical-object.js';
import {Satellite} from './satellite.js';
let axisX=new THREE.Vector3(1,0,0);	
let axisY=new THREE.Vector3(0,1,0);	
class Planet extends SphericalObject{
	constructor(params){
		super(params);
		this._star=params.star;
		this._is_planet=true;
		this.add_to_after_create_function_list(()=>{
			this.root._is_planet=true;
		});
		this._lock_planet_rotate=false;
		
		this._able_to_create_base=true;//co the tu dong create base khi player ship lai gan
		
		if(this._params.data){
			this._type=this._params.data.type;
			this._skin_id=this._params.data.skinID;
		
			let _texture_path='RockWorldsPack/';
			this._type_name=null;
			if(this._type===1){
				_texture_path='HabitableWorldsPack/';
				this._type_name='habitable';
			}
			if(this._type===2){
				_texture_path='GasWorldsPack/';
				this._type_name='gas';
			}
			if(this._type===3){
				_texture_path='RockWorldsPack/';
				this._type_name='rock';
			}
			if(this._type===4){
				_texture_path='IcylWorldsPack/';
				this._type_name='icy';
			}
		
			_texture_path='./texture/planet/'+_texture_path;
			if(this._skin_id>5)this._skin_id=Math.floor(Math.random() * 5) + 1;//(do chua co du texture)sau nay phai sua
			_texture_path+=this._skin_id+'.png';
			this._params.texture_url=_texture_path;
		}
	}
	create(){
		//alert(this._params.game);
		super.create();
		this._moon_list=new Array();
		this._max_moon_number=2;
		if(this._params.data){
			this.rotate_center_point=new THREE.Vector3(0,0,0);
			this.create_all_moon();
			
		}
			
	}
	
	update(timeInSeconds,t_center_point,t_rate){
		if(this._lock_planet_rotate)return;
		
		this.rotateY(this._params.speed2*t_rate);
		this.rotate_about_point(t_center_point,axisY,this._params.speed1*t_rate*timeInSeconds,false);
		for(var i=0;i<this._moon_list.length;i++){
			this._moon_list[i].rotate_about_point(this.rotate_center_point,
			axisY,this._moon_list[i]._params.speed1*timeInSeconds,false);
		}
		
		super.update();
	}
	rotate_random_angle_around_host_star(t_center_point){//sử dụng để tạo một góc ngẫu nhiên lúc ban đầu
		var randomAngle = Math.random() * (Math.PI*2);
		this.rotate_about_point(t_center_point,axisY,randomAngle,false);
	}
	
	create_all_moon(){
		let _moon_list=this._params.data.moonList;
		
		let _space_between_two_moon=300;
		for(var i=0;i<_moon_list.length;i++){
			
			this.create_new_moon(_moon_list[i],i*_space_between_two_moon);
		}
		
	}
	
	create_new_moon(_data,_space){
		if(this._moon_list.length>=this._max_moon_number){
			return false;
		}
		let _min_distance=400;//khoang cach toi hanh tinh
		let _position=new THREE.Vector3(this._params.radius + _min_distance +_space,0,0);
		let _texture_path="./texture/moon/";
		let _skin_id=_data.skinID;
		if(_skin_id>8)_skin_id=Math.floor(Math.random() * 8) + 1;//(do chua co du texture)sau nay phai sua
		_texture_path+=_skin_id+'.jpg';//luu y extension=jpg khac voi png cua planet va star
			//alert(_texture_path);
			let _moon=new Satellite({
					planet:this,
					scene: this._params.game._graphics.Scene,
					radius:_data.radius*this._params.scale_factor,
					speed1:_data.speed1,
					speed2:_data.speed2,
					position:_position,
					scale_factor:this._params.scale_factor,
					//altitude_atmosphere:5,
					texture_url:_texture_path,
					//color_atmosphere:new THREE.Color(0x034d8e),
					game:this._params.game
					});
			_moon.create();
			this.get_root().add(_moon.get_root());
			this._moon_list.push(_moon);
			
			return true;
	}
	add_new_moon(_data){
		if(this.create_new_moon(_data,this._params.radius + 400 +500))//Phai Sua
			this._params.data.moonList.push(_data);
	}

}

export { Planet };