import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {SpaceShip} from './space-ship.js';


class ExplorationShip1 extends SpaceShip {//tàu thám hiểm
	
	constructor(params){
		params.laser_color=new THREE.Color(247, 10, 2);
		params.light_color=new THREE.Color(247, 10, 2);//engine
		params.shoot_delay=0.5;//thời gian delay giữa 2 lần bắn
		params.health=1500;
		params.damage=15;
		
		super(params);
		
		let x = 0;
		let y = 0;
		let z = 0;
		this._engine_offsets = [//vị trí của engine
			new THREE.Vector3(x,y,z)
		];
		
		
		//try{
			this.init_thruster_2();
			this.turn_on_thruster(); 
		//}catch(e){alert(e.toString());alert(e.stack);}
		
		this._visible=true;
		
		let min = 1;
		let max = 3;
		this._result_num=Math.floor(Math.random()*(max-min+1))+min;//số lần có thể tìm thấy kết quả
		//alert(this._result_num);
		this._result_num=2;
	}
	
	CheckTarget(timeInSeconds){
		//try{
			if(this._visible){//bay được 1 đoạn sẽ biến mất để tiết kiệm dung lượng
				this.move_forward(timeInSeconds*120);
				if(this.Position.distanceTo(this._game._me.Position)>400){
					this._visible=false;
					this._model.visible=false;
					
					let _time_counter=0;
					for(let i=0;i<this._result_num;i++){
						const _rand_time=this.get_random_time();
						_time_counter+=_rand_time;
						this._game.add_to_function_list_2(()=>{
							//try{
							const _rand_num=this._utils.get_random_in_range(1,10);
							if(_rand_num<=5){
								//this._game._icon_effect.add_icon_effect(this._game._message_icon,1,"yellow","white");
								this._game._noticeBoard.add_message("New planet has been found!");
								this._game._messageMG.add_planet_found_message_1(()=>{
									this.go_to_planet_has_been_found();
								});
							}
							else{
								//this._game._icon_effect.add_icon_effect(this._game._message_icon,1,"yellow","white");
								this._game._noticeBoard.add_message("An enemy star energy mining base has been detected!");
								this._game._messageMG.add_enemy_star_energy_mining_base_found(()=>{
									this._game._missionMG2.start_mission(4);
								});
							}
							//}catch(e){alert(e.stack);}
						},_time_counter);
					}
				}
			}
			else{
				
			}
		//}catch(e){alert(e.stack);}
	}
	
	go_to_planet_has_been_found(){
		const _universe=this._game.get_universe();
					const _galaxy=_universe.get_current_galaxy();
					const _tdata=_galaxy.get_random_starsystem_data_with_condition_1(2);
					const _starsystem_data=_tdata[0];
					let _data_id=_tdata[1];
					const _star_data=_starsystem_data.starList[0];
					//const _planet_data=_star_data.planetList[0];alert(_planet_data.radius);
					const _pos_data=_starsystem_data.position;
					const _mag=this._game._config.magnification_factor;
					const _star_radius=_star_data.radius*1000;//alert(_star_radius);
					let _starpos=new THREE.Vector3(_pos_data[0]*_mag,_pos_data[1]*_mag,_pos_data[2]*_mag);
					this._game._me._model.position.set(_starpos.x,_starpos.y+_star_radius+100,_starpos.z);
					
					//let _tpos=this._utils.calculateSymmetricPoint(this._game._me.Position,_starpos);
					_galaxy.create_neighboring_star_systems(this._game._me.Position,10000);
					
					//const _starsystem_class=_galaxy.get_star_system_class_by_id(_data_id);
					//_galaxy.focus_on_star_sytem(_starsystem_class);
					
					this._game.add_to_function_list_2(()=>{
						const _starsystem_class=_galaxy.get_star_system_class_by_id(_data_id);
						//_galaxy.focus_on_star_sytem(_starsystem_class);
						let _tpos=this._utils.calculateSymmetricPoint(this._game._me.Position,_starsystem_class.get_world_position());
						this._game._me._model.lookAt(_tpos);
					},1);
					
	}
	
	get_random_time(){
		var min = 5;
		var max = 10;

		var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
		
		return randomNumber;
	}
	
}

export{ExplorationShip1};