import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';

import {Mission} from './mission.js';
import {Mission4_EnemyStation} from './mission-4-enemy-station.js';
import {NavigationShip1} from '../units/navigation-ship-1.js';

class Mission4 extends Mission{
	constructor(params){
		super(params);
		this._mission_bonus=1000;
		this._model_url_list=[
			["enemy-station-1","./resources/models/Object/power_station/scene.gltf"],
			["navigation-ship","./resources/models/SpaceShip/spaceship-8/scene.gltf"],
		];
		this._remove_all_enemy_unit_as_finish=true;
	}
	
	init(){
		super.init();
		this._game._me._model.position.set(26478,0,-6645);
		this._game.show_notification("Hãy phóng tàu định vị về hướng căn cứ của kẻ địch để dẫn đường cho tên lửa");
		
		let gltf=this._data_list["enemy-station-1"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(1);
		let _group = new THREE.Group();
		_group.add(model.clone());
        this._game._graphics.Scene.add(_group);
		//_group.position.copy(this._game._graphics.Camera.position);
		let _items={};
		//let _station_pos=this._game._graphics.Camera.position;
		//_station_pos.x+=2550;
		//_station_pos.z+=750;
		let _station_pos=new THREE.Vector3(26478,0,-7000);
		this._enemy_station=new Mission4_EnemyStation({game:this._game,model:_group,
		position:_station_pos,items:_items});
		let _tpos=this._enemy_station.get_world_position();
		_tpos.z-=180;//để căn chỉnh cho vào giữa model(do model bi lech)
		this._enemy_station.get_world_position=()=>{
			return _tpos;
		};
		//this._game._me._model.lookAt(this._utils.calculateSymmetricPoint(_station_pos,this._game._me.Position));
		
		this._navigation_ship_icon_container=document.createElement("div");
		this._navigation_ship_icon_container.style.position="absolute";
		this._navigation_ship_icon_container.style.top="80%";
		this._navigation_ship_icon_container.style.left="45%";
		this._navigation_ship_icon_container.style.width="50px";
		this._navigation_ship_icon_container.style.height="50px";
		this._navigation_ship_icon_container.style.backgroundColor="rgba(0, 0, 0, 0.4)";
		this._navigation_ship_icon_container.style.zIndex="9999999999";
		  
		document.body.appendChild(this._navigation_ship_icon_container);
		
		const _navigation_ship_icon=document.createElement("img");
		_navigation_ship_icon.src="./resources/icons/navigation-ship.png";
		_navigation_ship_icon.width=50;
		_navigation_ship_icon.height=50;
		_navigation_ship_icon.addEventListener("click",()=>{
			this._navigation_ship_icon_container.remove();
			this._game.remove_notification();
			
			let _pos1=this._game._me.get_ahead_point(5);//alert(_pos.x+ " "+_pos.y+" "+_pos.z);
			let _pos2=this._game._me.get_ahead_point(150);
			
			this._navigation_ship=this._game._unitMG.create_navigation_ship_1(_pos1);
			this._navigation_ship._target_object=this._enemy_station;
			this._navigation_ship._model.lookAt(_pos2);
			this._navigation_ship.add_to_after_dead_function_list(()=>{
				this.finish({win:false});
			});
			this._game._graphics.Scene.add(this._navigation_ship._model);
			//this._game._entities['_radar'].addTarget(this._navigation_ship);
			this._game._sound.play('missile-launch');
			
			this._navigation_ship.after_entered_orbit=()=>{
				//try{
				this.launch_missile();
				//}catch(e){alert(e.stack);}
			}
			
			//}catch(e){alert(e.stack);}
			
		});
		
		this._navigation_ship_icon_container.appendChild(_navigation_ship_icon);
	}
	
	finish(params){
		//try{
		super.finish();
		//}catch(e){alert(e.stack);}
		if(params.win===true){
			this._game.add_to_function_list_2(()=>{
				this._game.createMessageBox("Mission Completed!","You have earned "+this._mission_bonus+"$");
				this._game._me._inventory.add_cash(this._mission_bonus);
			},4);
		}
		else{
			this._game.add_to_function_list_2(()=>{
				this._game.createMessageBox("Defeated!");
			},4);
		}
		try{
		this._game.remove_function_from_list_3(this._countdown_fc);
		this._enemy_station.SelfDestroy();
		this._navigation_ship.SelfDestroy();//dòng này phải để cuối cùng (phòng trường hợp ship đã remove rồi)
		//this._missile.SelfDestroy();
		}catch(e){alert(e.stack);}
	}
	
	launch_missile(){
		
		this._game._unitMG.remove_all_enemy_combat_unit();
		//_navigation_ship
			let _total_num1=21,_total_num2=7;
			let _visible_num1=3,_visible_num2=1;
			let _unit_counter=0;
			//let _level=1;
			//try{
				//tan cong navigation ship
				this.add_enemy_unit(2,_visible_num1,this.get_random_enemy_position_1(),this._navigation_ship);
				//tan cong player
				this.add_enemy_unit(1,_visible_num2,this.get_random_enemy_position_2(),this._game._me);
			//}catch(e){alert(e.toString());}
			let _finish_fc=()=>{
					this._game.add_to_function_list_2(()=>{
						this.add_enemy_unit(2,_visible_num1,this.get_random_enemy_position_1(),this._navigation_ship);
						this.add_enemy_unit(1,_visible_num2,this.get_random_enemy_position_2(),this._game._me);
						this._game._unitMG._all_enemy_combat_unit_dead=_finish_fc;
					},5);
					this._game._unitMG._all_enemy_combat_unit_dead=function(){};
					
					return;
				/*
				_unit_counter+=(_visible_num1+_visible_num2);
				if(_unit_counter<_total_num1+_total_num2){
					
					this.add_enemy_unit(2,_visible_num1,this.get_random_enemy_position_1(),this._navigation_ship);
					this.add_enemy_unit(1,_visible_num2,this.get_random_enemy_position_2(),this._game._me);
					this._game._unitMG._all_enemy_combat_unit_dead=_finish_fc;
					return;
				}
				else{
					this._game._unitMG._all_enemy_combat_unit_dead=function(){};
					
					
					return;
				}
				*/
			}
			this._game._unitMG._all_enemy_combat_unit_dead=_finish_fc;
		
		//--------------------------------------------
		let _missile_position=new THREE.Vector3();
		_missile_position.copy(this._enemy_station.get_world_position());
		_missile_position.x+=22000;
		_missile_position.y+=3200;
				
		let _missile=this._game._unitMG.create_cruise_missile_1(_missile_position);
		this._missile=_missile;
		_missile._target_object=this._enemy_station;
		//_missile._is_enemy=true;
		this._game._graphics.Scene.add(_missile._model);
		//this._game._entities['_radar'].addTarget(_missile);
		
		this._game.show_notification("Tên lửa đang bay tới mục tiêu, hãy bảo vệ tàu định vị");
		this._game.add_to_function_list_2(()=>{this._game.remove_notification();},4);
		
		this._time_container=document.createElement("div");
		this._time_container.style.position="absolute";
		this._time_container.style.width="50px";
		this._time_container.style.left="47%";
		this._time_container.style.top="10%";
		this._time_container.style.textAlign="center";
		this._time_container.style.color="white";
		this._time_container.style.zIndex="999999";
		this._time_container.style.fontSize="30px";
		
		_missile._t_destroy_fc=()=>{
			this._time_container.remove();
			this.finish({win:true});
		};
		
		//this._time_container.innerHTML="The missile will reach the target in ";
		//this._time_container.innerHTML+="";
		
		document.body.appendChild(this._time_container);
		
		this._countdown_fc=()=>{
			const _distance=parseInt(_missile.Position.distanceTo(this._enemy_station.get_world_position()));
			
			this._time_container.innerHTML =_distance-50;
		};
		this._game.add_to_function_list_3(this._countdown_fc);
		
	}
	
	get_random_enemy_position_1(){
		let _rand_1=Math.floor(Math.random() * 30) + 10;//ngau nhien tu 30->100
		let _rand_2=Math.floor(Math.random() * 30) + 10;
		let _rand_3=Math.floor(Math.random() * 30) + 10;
		
		return new THREE.Vector3(this._navigation_ship.Position.x+_rand_1,
									this._navigation_ship.Position.y+_rand_2,
									this._navigation_ship.Position.z+_rand_3
								 );
		
	}
	get_random_enemy_position_2(){
		let _rand_1=Math.floor(Math.random() * 30) + 10;//ngau nhien tu 30->100
		let _rand_2=Math.floor(Math.random() * 30) + 10;
		let _rand_3=Math.floor(Math.random() * 30) + 10;
		
		return new THREE.Vector3(this._game._me.Position.x+_rand_1,
									this._game._me.Position.y+_rand_2,
									this._game._me.Position.z+_rand_3
								 );
		
	}
}
export {Mission4}