import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/loaders/GLTFLoader.js';

import {MinaralBase_1} from './base/minaral-base-1.js';
import {ServiceBase_1} from './base/service-base-1.js';
import {MissileArsenalBase_1} from './base/missile-arsenal-base-1.js';
import {ItemMG} from './item-mg.js';

class BaseMG{
	constructor(params){
		this._params=params;
		this._game=this._params.game;
		this._data_list={};
		this._base_list=new Array();
		this._base_item_mg=new ItemMG();
		
		this._load_complete_fc=()=>{};
		
		//Service Base ko push vao _base_list
		this._service_base=null;//load va hien thi duy nhat 1 lan, moi lan player tiep can 1 hanh tinh thi dich chuyen base toi vi tri hanh tinh do chu ko tao moi
	}
	load_data(){
		//alert(this._params.game);
		let _url_list=[
					   
					   ["space-station-1","./resources/models/SpaceStation/space-station-1/scene.gltf"],
					   
					   //["space-station-3","./resources/models/SpaceStation/space-station-3/scene.gltf"],
					   
					   //["space-station-5","./resources/models/SpaceStation/space-station-5/scene.gltf"],
					   //["space-station-6","./resources/models/SpaceStation/space-station-6/scene.gltf"],//OK
					   //["space-station-7","./resources/models/SpaceStation/space-station-7/scene.gltf"],//GOOD
					   //["space-station-8","./resources/models/SpaceStation/space-station-8/scene.gltf"],//GOOD
					   //["space-station-9","./resources/models/SpaceStation/space-station-9/scene.gltf"],//GOOD VERY BIG
					   ["space-station-10","./resources/models/SpaceStation/space-station-10/scene.gltf"],//VERY GOOD
					   //["space-station-11","./resources/models/SpaceStation/space-station-11/scene.gltf"],//GOOD CA 1 THANH PHO
					   //["space-station-12","./resources/models/SpaceStation/space-station-12/scene.gltf"],
					   //["space-station-13","./resources/models/SpaceStation/space-station-13/scene.gltf"],//GOOD
					   //["space-station-14","./resources/models/SpaceStation/space-station-14/scene.gltf"],//GOOD
					   //["space-station-15","./resources/models/SpaceStation/space-station-15/scene.gltf"],//VERY GOOD, RAT TO HOANH TRANG
					   //["space-station-16","./resources/models/SpaceStation/space-station-16/scene.gltf"],//VERRY GOOD, RAT TO 
					   //["space-station-17","./resources/models/SpaceStation/space-station-17/scene.gltf"],//GOOD
					   //["space-station-18","./resources/models/SpaceStation/space-station-18/scene.gltf"],//OK
					   //["space-station-19","./resources/models/SpaceStation/space-station-19/scene.gltf"],//GOOD
					   //["space-station-20","./resources/models/SpaceStation/space-station-20/scene.gltf"],//GOOD
					   //["space-station-21","./resources/models/SpaceStation/space-station-21/scene.gltf"],//GOOD
					   
					];
					
			let _counter=0;
	
		let _loader;
		for(let i=0;i<_url_list.length;i++){
			let _id=_url_list[i][0];
			let _url=_url_list[i][1];
			_loader= new GLTFLoader();
			_loader.load(_url,( gltf )=> {
				this._data_list[_id]=gltf;
				_counter++;
				if(_counter===_url_list.length){//load complete
					//alert(this._params.game._graphics.Camera.position);
						//return;
						let _tpos=new THREE.Vector3(this._game._graphics.Camera.position.x,
													this._game._graphics.Camera.position.y-150,
													this._game._graphics.Camera.position.z);
						//this._service_base=this.create_service_base_1(_tpos);//su dung nhieu lan
						//this._game._entities['_radar'].addTarget(this._service_base);
						this._load_complete_fc();
				}
			});
		}
		
	}
	
	get_next_id(){
		if(this._next_id){
			this._next_id++;
		}
		else{
			this._next_id=1;
		}
		
		return this._next_id;
	}
	get_planet_base_list(_planet_entity){//Lay ve danh sach cac base cua planet
		var _rs=new Array();
		for(var i=0;i<this._base_list.length;i++){
			let _base=this._base_list[i];
			if(_base._host===_planet_entity){
				_rs.push(_base);
			}
		}
		return _rs;
	}
	check_planet_base_num(_planet_entity){//Kiem tra xem da create base cho planet nay chua
		var _rs=0;
		for(var i=0;i<this._base_list.length;i++){
			let _base=this._base_list[i];
			if(_base._host===_planet_entity){
				//alert("FOUND");
				_rs++;
			}
		}
		return _rs;
	};
	//Kiem tra xem toan bo unit trong cac base tren planet da bi tieu diet het chua
	check_if_all_base_in_planet_defeated(_planet_entity){
		var _t_list=new Array();
		for(var i=0;i<this._base_list.length;i++){
			let _base=this._base_list[i];
			if(_base._host===_planet_entity){
				_t_list.push(_base);
			}
		}
		
		if(_t_list.length===0)
			return false;
		
		for(var i=0;i<_t_list.length;i++){
			let _base=_t_list[i];
			if(!_base.all_combat_unit_dead())
				return false;
		}
		//alert("Planet Defeated");
		return true;
	}
	
	remove_all_base(){
		for (let i = this._base_list.length - 1; i >= 0; i--){
            let _unit=this._base_list[i];
            _unit.SelfDestroy();
        }
		
		this._base_list=new Array();
	}
	
	create_base_for_planet(_planet_entity,has_a_missile_arsenal){
		var _base_num=this.check_planet_base_num(_planet_entity);
		if(_base_num>=2)return;
		
		let _star=_planet_entity._star;
		let _planet_pos=_planet_entity.get_world_position();
		let _radius=_planet_entity.get_radius();
		
		if(this._service_base!=null)
		if(!this._service_base._planet||this._service_base._star!=_star){//he sao se chi co duy nhat 1 service base, nam tren planet dau tien ma player tiep can
			let _service_base_pos=new THREE.Vector3();
			_service_base_pos.copy(_planet_pos);
			_service_base_pos.y+=(_radius+600);//phai dam bao vi tri cao hon cac base khac va thap hon cac mat trang(neu co)
			this._service_base.goto_position(_service_base_pos);
		
		}
		
		
		//try{
		//if(has_a_missile_arsenal===true){//kho ten lua
			let _base_pos=new THREE.Vector3();
			_base_pos.copy(_planet_pos);
			_base_pos.y+=(_radius+100);
			let _base=this.create_missile_arsenal_base(1,20,_base_pos,_planet_entity);
			_base._host=_planet_entity;
			this._base_list.push(_base);
			//let _lookat_pos=this.calculateSymmetricPoint(_base.get_world_position(),_planet_pos);
			//_base._model.lookAt(_planet_pos);//để có góc phù hợp
			//alert(_lookat_pos_1.x+" ^ "+_lookat_pos_1.y+" ^ "+_lookat_pos_1.z);
			_base.rotate_about_host_entity(new THREE.Vector3(0,0,1),-Math.PI/2);
			_base._model.rotation.z=-Math.PI/2;
		//}
		//}catch(e){alert(e.stack);}
		
		let _service_base_pos=new THREE.Vector3();//moi mot planet co 1 service base o vi tri ngau nhien
		_service_base_pos.copy(_planet_pos);
		_service_base_pos.y+=(_radius+600);//phai dam bao vi tri cao hon cac base khac va thap hon cac mat trang(neu co)
		let _service_base=this.create_service_base_1(_service_base_pos);
		_service_base._host=_planet_entity;
		this._base_list.push(_service_base);
		let _rand_theta=Math.random() * Math.PI/2;
		_service_base.rotate_about_host_entity(new THREE.Vector3(0,1,0),_rand_theta);
		_service_base._model.rotation.y=_rand_theta;
		
		
		let _base_pos_1=new THREE.Vector3();
		_base_pos_1.copy(_planet_pos);
		_base_pos_1.y+=(_radius+100);
		let _base_1=this.create_mineral_base(1,20,_base_pos_1,_planet_entity);
		_base_1._host=_planet_entity;
		this._base_list.push(_base_1);
		let _lookat_pos_1=this.calculateSymmetricPoint(_base_1.get_world_position(),_planet_pos);
		//_base_1._model.lookAt(_planet_pos);//để có góc phù hợp
		//alert(_lookat_pos_1.x+" ^ "+_lookat_pos_1.y+" ^ "+_lookat_pos_1.z);
		_base_1.rotate_about_host_entity(new THREE.Vector3(0,1,0),Math.PI/2);
		_base_1._model.rotation.y=Math.PI/2;
		
		
		
		let _base_pos_2=new THREE.Vector3();
		_base_pos_2.copy(_planet_pos);
		_base_pos_2.y+=(_radius+100);
		let _base_2=this.create_mineral_base(1,20,_base_pos_2,_planet_entity);
		_base_2._host=_planet_entity;
		this._base_list.push(_base_2);
		let _lookat_pos_2=this.calculateSymmetricPoint(_base_2.get_world_position(),_planet_pos);
		//_base_2._model.lookAt(_lookat_pos_2);//để có góc phù hợp
		_base_2.rotate_about_host_entity(new THREE.Vector3(1,0,0),-Math.PI/2);
		_base_2._model.rotation.x=Math.PI/2;
		
		
		let _base_pos_3=new THREE.Vector3();
		_base_pos_3.copy(_planet_pos);
		_base_pos_3.y+=(_radius+100);
		let _base_3=this.create_mineral_base(1,20,_base_pos_3,_planet_entity);
		_base_3._host=_planet_entity;
		this._base_list.push(_base_3);
		_base_3.rotate_about_host_entity(new THREE.Vector3(0,0,1),Math.PI/2);
		_base_3._model.rotation.z=Math.PI/2;
		
		//alert("Base Created");
		//alert(this._base_list.length);
	}
	remove_base_planet(_planet_entity){
		
	}
	
	create_missile_arsenal_base(model_id,scale,position,_planet_entity){
		let _id=this.get_next_id();
		
		let gltf=this._data_list["space-station-"+model_id];
		const model = gltf.scene.children[0];
		model.scale.setScalar(scale);

		const _group = new THREE.Group();
		_group.add(model.clone());

		this._game._graphics.Scene.add(_group);
		_group.position.copy(position);
		
		let _item_list=this._base_item_mg.get_planet_base_random_items(_planet_entity._type_name);
		
		this._game._entities['missile-arsenal-base-'+_id]=new MissileArsenalBase_1({model: _group, game: this._game,position:position,items:_item_list});
		this._game._entities['missile-arsenal-base-'+_id].create_all_unit();
		
		this._base_list.push(this._game._entities['missile-arsenal-base-'+_id]);
		
		return this._game._entities['missile-arsenal-base-'+_id];
	}
	
	create_mineral_base(model_id,scale,position,_planet_entity){
		
		let _id=this.get_next_id();
		
		let gltf=this._data_list["space-station-"+model_id];
		const model = gltf.scene.children[0];
		model.scale.setScalar(scale);

		const _group = new THREE.Group();
		_group.add(model.clone());

		this._game._graphics.Scene.add(_group);
		_group.position.copy(position);
		
		let _item_list=this._base_item_mg.get_planet_base_random_items(_planet_entity._type_name);
		//alert(_item_list);
		//let _item_list={};
		//_item_list['food']=['meat1','meat1'];
		//_item_list['liquid']=['water','mercury'];
		//_item_list['fuel']=['battery'];
		////_item_list['solid']=['gold','iron','coal'];
		//_item_list['weapon']=['sword1'];
		
		this._game._entities['minaral-base-'+_id]=new MinaralBase_1({model: _group, game: this._game,position:position,items:_item_list});
		this._game._entities['minaral-base-'+_id].create_all_unit();
		
		this._base_list.push(this._game._entities['minaral-base-'+_id]);
		
		return this._game._entities['minaral-base-'+_id];
	};
	
	create_service_base_1(position){
		
		const light = new THREE.PointLight( 0xC316E6, 1, 100 );
		light.position.set( position.x,position.y+20,position.z );
		this._game._graphics.Scene.add( light );
		
		return this.create_service_base(10,0.2,position);
	}
	
	create_service_base_2(position){
		//this.create_service_base(19,2,position);
		//const light = new THREE.PointLight( 0xC316E6, 1, 100 );
		//light.position.set( position.x,position.y+20,position.z );
		//this._game._graphics.Scene.add( light );
	}
	
	create_service_base(model_id,scale,position){
		let _id=this.get_next_id();
		
		let gltf=this._data_list["space-station-"+model_id];
		const model = gltf.scene.children[0];
		model.scale.setScalar(scale);

		const _group = new THREE.Group();
		_group.add(model.clone());

		this._game._graphics.Scene.add(_group);
		_group.position.copy(position);
		
		this._game._entities['service-base-'+_id]=new ServiceBase_1({model: _group, game: this._game,position:position});
		//this._game._entities['service-base-'+_id].create_all_unit();
		
		//this._base_list.push(this._game._entities['service-base-'+_id]);
		
		return this._game._entities['service-base-'+_id];
	};
	
	calculateSymmetricPoint(pointA, pointB) {//tinh' toa do diem doi xung'
		const x1 = pointA.x;
		const y1 = pointA.y;
		const z1 = pointA.z;

		const x2 = pointB.x;
		const y2 = pointB.y;
		const z2 = pointB.z;

		const xC = 2 * x1 - x2;
		const yC = 2 * y1 - y2;
		const zC = 2 * z1 - z2;

		return new THREE.Vector3(xC,yC,zC);
	}
}
export{BaseMG};