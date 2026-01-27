import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {  CSS2DObject } from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/renderers/CSS2DRenderer.js';

import {SphericalObject} from './spherical-object.js';
import {SphericalGlowingObject} from './spherical-glowing-object.js';
import {Planet} from './planet.js';

let axisX=new THREE.Vector3(1,0,0);	
let axisY=new THREE.Vector3(0,1,0);	

class Star extends SphericalObject{
	constructor(params){
		super(params);
		this._is_star=true;
		this.add_to_after_create_function_list(()=>{
			this.root._is_star=true;
		});

		this._label1=null;
		
		this._max_planet_number=10;
		this._scale_factor=1000;//hệ số phóng đại
		this._speed_rate=100/100;//(tính theo phần trăm)khi càng lại gần thì rate càng giảm, tốc độ của các hành tinh càng chậm
	}
	create(_just_show_label){
		
		let _skin_id=this._params.data.skinID;
		if(_skin_id>14)_skin_id=Math.floor(Math.random() * 14) + 1;//(do chua co du texture)sau nay phai sua
		let _texture_path='./texture/star/'+_skin_id+'.png';
		
		this._params.texture_url=_texture_path;
		
		this._params.radius=parseInt(this._params.data.radius*this._scale_factor);
		this._params.position=new THREE.Vector3(this._params.data.position[0],
		this._params.data.position[1],this._params.data.position[2]);
		this._params.altitude_atmosphere=10;
		this._params.color_atmosphere=new THREE.Color(0xFFFF0B);

		this._planet_list=new Array();

		if(_just_show_label===true){
			let div = document.createElement( 'div' );
			div.innerHTML="Star";
			div.style.fontSize="15px";
			div.style.color="yellow";
			this._label1 = new CSS2DObject( div );
			this.get_root().add(this._label1);
			
			this._is_just_label=true;

			if(this._params.game){//de dam bao rang khi su dung o game khac se ko anh huong gi
				if(this._params.game.add_to_function_list_4){
					this._params.game.add_to_function_list_4(()=>{
						const _t_distance=this.get_world_position().distanceTo(this._params.game._me.Position);
						if(div!=null){
							div.innerHTML="Star<br/>"+parseInt(_t_distance)+"AU";
						}
					});
				}
			}

			this._remove_label_1=()=>{
				
				this._label1.remove();
				div.remove();
				this.get_root().remove(this._label1);
				
				this._label1=null;
				div=null;
			};
			
			return;
		}

		super.create();
		
		
		this.rotate_center_point=new THREE.Vector3(0,0,0);
		this.create_all_planet();
		
    }

	clear(){
		if(this._label1!=null)this._remove_label_1();
	}
	
	create_all_planet(){
		let _planet_data_list=this._params.data.planetList;
		let _space_between_two_planet=2000;//<==tam thoi chua su dung space trong data
		for(let i=0;i<_planet_data_list.length;i++){
			this.create_new_planet(_planet_data_list[i],i*_space_between_two_planet);
		}
		
	}
	
	create_new_planet(_data,_space){
		if(this._planet_list.length>=this._max_planet_number){
			
			return false;
		}
		let _min_distance=2000;//khoang cach toi ngoi sao chu
		let _position=new THREE.Vector3(this._params.radius + _min_distance +_space,0,0);
			let _planet=new Planet({
					star:this,
					scene: this._params.game._graphics.Scene,
					scale_factor:this._scale_factor,
					radius:_data.radius*this._scale_factor,
					speed1:_data.speed1,
					speed2:_data.speed2,
					position:_position,
					altitude_atmosphere:40,
					//texture_url:"./texture/planet/HabitableWorldsPack/Tropical.png",
					color_atmosphere:new THREE.Color(0x034d8e),
					game:this._params.game,
					data:_data
					});
			_planet.create();
			_planet.rotate_random_angle_around_host_star(this.rotate_center_point);
			this.get_root().add(_planet.get_root());
			this._planet_list.push(_planet);
			
			return true;
	}
	add_new_planet(_data){//create and add to database
		if(this.create_new_planet(_data,this._params.radius + 1400 +1000))//Phai Sua
			this._params.data.planetList.push(_data);
	}
	
	update(timeInSeconds){
		for(var i=0;i<this._planet_list.length;i++){
			this._planet_list[i].update(timeInSeconds,this.rotate_center_point,this._speed_rate);
			
		}
	}
   
}

export { Star };