import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';

class Base{
	constructor(params){
		this._params=params;
		this._game=params.game;
		this._model=params.model;
		this._items=params.items;
		this._unit_entity_list=new Array();
		this._is_base=true;
		this._type=null;
		//this._in_connect_to_player=false;//player dang trao doi item voi base
		
		this._model.position.copy(this._params.position);
		if(this._params.unit_list){
			this._unit_list=this._params.unit_list;//cac unit nhu cannon, spaceship...
		}
		else{
			this._unit_list={};
		}
		
		this._host=null;//vật chủ, vd như một planet hay moon
	}
	
	Update(){
		
	}
	
	SelfDestroy(){//xoa bo, trong truong hop VD nhu khi player click di den starsystem khac
	  this._game._graphics.Scene.remove(this._model);
	  this._game._RemoveEntity_ByValue(this);
	  delete this;
	 
  }
	
	all_combat_unit_dead(){
		if(this._unit_entity_list.length>0){
			let _found=false;
			for(let i=0;i<this._unit_entity_list.length;i++){
				if(!this._unit_entity_list[i].Dead){
					_found=true;
					break;
				}
			}
			
			if(!_found){
				return true;
			}
			else{
				return false;
			}
		}
		
		return null;
	}
	goto_position(_pos){
		this._model.position.copy(_pos);
	}
	get_position(){
		return this._model.position;
	}
	get_world_position(){
		const _rs=new THREE.Vector3();
		this._model.getWorldPosition(_rs);
		return _rs;
	}
	
	create_all_unit(){
		
		this._game._unitMG.after_create_enemy_combat_unit_fc_2=function(_eunit){//hinh nhu ko co' function nay se ko create enemy-ship dc
			_eunit._base_class=this;
		}
		
		for (let i in this._unit_list){
			let _unit=this._unit_list[i];
		    let _unit_id=_unit[0];
		    let _unit_position=_unit[1];
			
			let _unit_entity;
			if(_unit_id==='cannon-1')
				_unit_entity=this._game._unitMG.create_cannon_1(_unit_position);
			if(_unit_id==='cannon-2')
				_unit_entity=this._game._unitMG.create_cannon_2(_unit_position);
			
			this._game._graphics.Scene.add(_unit_entity._model);
			
			_unit_entity._model.position.set(this._model.position.x+_unit_position.x,
								  this._model.position.y+_unit_position.y,
								  this._model.position.z+_unit_position.z);
			//_unit_entity._model.position.copy(this._params.game._me.Position);
			this._unit_entity_list.push(_unit_entity);
		}
		const _player_level=this._game._me.get_space_ship_level();
		//if(_player_level!=1)alert("MyShipLevel:"+_player_level);
		let _ship_count_1=1;
		let _rand_enemy_ships=new Array();
		for(let i=0;i<_ship_count_1;i++){//cac ship xuat hien ngau nhien
			let _enemy_ship=this._game._unitMG.create_enemy_combat_ship_level_3_style_3(this._game._unitMG.get_random_enemy_position_1());
			this._unit_entity_list.push(_enemy_ship);
			this._game._graphics.Scene.add(_enemy_ship._model);
			//alert("Before:"+_enemy_ship.get_space_ship_hp());
			_enemy_ship._level_rate=1.5;//de cho cac chi so' tang nhanh hon
			_enemy_ship._ship_package.set_ship_level(_player_level);//tam thoi de level cua enemy tuong ung voi level cua player-ship
			_enemy_ship.apply_space_ship_level_package();
			//alert("After:"+_enemy_ship.get_space_ship_hp());
			_rand_enemy_ships.push(_enemy_ship);
		}
		
		let _ship_count_2=3;
		this._guard_ships=new Array();
		for(let i=0;i<_ship_count_2;i++){//cac ship xuat hien theo doi hinh xung quanh base de bao ve base
			let _enemy_ship=this._game._unitMG.create_base_guard_ship_1(this._model.position);
			this._unit_entity_list.push(_enemy_ship);
			this._guard_ships.push(_enemy_ship);
			this._game._graphics.Scene.add(_enemy_ship._model);
			
			let _demo_ship=_rand_enemy_ships[0];
			_enemy_ship._health=_demo_ship._health;
			_enemy_ship._damage=_demo_ship._damage;
			_enemy_ship._params.shoot_delay=_demo_ship._params.shoot_delay;
			
			//_enemy_ship._level_rate=1.5;//de cho cac chi so' tang nhanh hon
			//_enemy_ship._ship_package.set_ship_level(_player_level);//tam thoi de level cua enemy tuong ung voi level cua player-ship
			//_enemy_ship.apply_space_ship_level_package();
		}
		
		const _radius=120;
		const _theta=(Math.PI*2)/this._guard_ships.length;
		let _axis=this._game._utils.axisY;
		for(let i=0;i<this._guard_ships.length;i++){
			let _ship=this._guard_ships[i];
			_ship._model.position.copy(this._model.position);
			_ship._model.position.x+=_radius;
			this._game._utils.rotateObjectAroundPoint(_ship._model,this._model.position,_axis,i*_theta);
			//this._game._utils.rotateAboutPoint(_ship._model, this._model.position,this._game._utils.axisY,_theta,true);
		}
		
		this._game.add_to_update_function_list((t)=>{
			for(let i=0;i<this._guard_ships.length;i++){
				let _ship=this._guard_ships[i];
				if(!_ship||_ship===null||_ship.Dead){
					continue;
				}
				this._game._utils.rotateObjectAroundPoint(_ship._model,this._model.position,_axis,t*0.005);
			}
		});
		
		//this._params.game._unitMG.add_enemy_combat_unit_group(4,2,1);
		/*
		for (let i in this._unit_list) {
          let _unit=this._unit_list[i];
		  let _unit_id=_unit[0];
		  let _unit_position=_unit[1];
		  let _unit_entity;
		  
		  switch(_unit_id){
			  case "cannon-1":
					_unit_entity=this._params.game._unitMG.create_cannon_1(_unit_position);
					break;
			  case "cannon-2":
					_unit_entity=this._params.game._unitMG.create_cannon_2(_unit_position);
					break;
			  case "spaceship-1":
					_unit_entity=this.create_enemy_combat_ship_level_1_style_1(_unit_position);
					break;
		  }
		  this._params.game._graphics.Scene.add(_unit_entity._model);
		  
		  _unit_entity._model.position.set(this._model.position.x+_unit_position.x,
								  this._model.position.y+_unit_position.y,
								  this._model.position.z+_unit_position.z);
		
		  this._unit_entity_list.push(_unit_entity);
        }
		*/
	}
	
	
	
	rotate_about_host_entity(axis,theta){//xoay quanh hành tinh chủ, lấy tâm hành tinh làm tâm xoay
			let _host_position=this._host.get_world_position();
			this.rotate_about_point(this._model,_host_position,axis,theta,true);
			for(var i=0;i<this._unit_entity_list.length;i++){
				this.rotate_about_point(this._unit_entity_list[i]._model,_host_position,axis,theta,true);
			}
	}
	
	rotate_about_point(model,point, axis, theta, pointIsWorld){
		pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

		if(pointIsWorld){
			model.parent.localToWorld(model.position); // compensate for world coordinate
		}

		model.position.sub(point); // remove the offset
		model.position.applyAxisAngle(axis, theta); // rotate the POSITION
		model.position.add(point); // re-add the offset

		if(pointIsWorld){
			model.parent.worldToLocal(model.position); // undo world coordinates compensation
		}
	}
	
}
export{Base};