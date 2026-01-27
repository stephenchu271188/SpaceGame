import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/loaders/GLTFLoader.js';

//import {Unit} from './units/unit.js';
import {Cannon} from './units/cannon.js';
import {SpaceShip} from './units/space-ship.js';
import {SpaceStation} from './units/space-station.js';
import {controls} from './controls.js';
import {blaster} from './units/blaster.js';

import {SpaceShip1} from './units/space-ship-1.js';
import {SpaceShip2} from './units/space-ship-2.js';
import {SpaceShip3} from './units/space-ship-3.js';
import {SpaceShip4} from './units/space-ship-4.js';
import {SpaceShip5} from './units/space-ship-5.js';
import {SpaceShip6} from './units/space-ship-6.js';
import {SpaceShip7} from './units/space-ship-7.js';
import {SpaceShip8} from './units/space-ship-8.js';
import {SpaceShip9} from './units/space-ship-9.js';
import {SpaceShip10} from './units/space-ship-10.js';
import {SpaceShip11} from './units/space-ship-11.js';
import {SpaceShip12} from './units/space-ship-12.js';
import {SpaceShip13} from './units/space-ship-13.js';
import {SpaceShip14} from './units/space-ship-14.js';
import {SpaceShip15} from './units/space-ship-15.js';
import {SpaceShip16} from './units/space-ship-16.js';
import {SpaceShip17} from './units/space-ship-17.js';
import {SpaceShip18} from './units/space-ship-18.js';
import {SpaceShip19} from './units/space-ship-19.js';
import {SpaceShip20} from './units/space-ship-20.js';
import {SpaceShip21} from './units/space-ship-21.js';
import {SpaceShip22} from './units/space-ship-22.js';
import {SpaceShip23} from './units/space-ship-23.js';
import {SpaceShip24} from './units/space-ship-24.js';
import {SpaceShip25} from './units/space-ship-25.js';
import {SpaceShip26} from './units/space-ship-26.js';
import {SpaceShip27} from './units/space-ship-27.js';

import {SpaceCannon1} from './units/space-cannon-1.js';

import {SimpleEnergyShip} from './units/simple-energy-ship.js';
import {SimpleRocketShip} from './units/simple-rocket-ship.js';
import {SimpleMissileShip} from './units/simple-missile-ship.js';
import {SimpleSuicideShip} from './units/simple-suicide-ship.js';
import {SimpleLaserShip} from './units/simple-laser-ship.js';
import {SimplePhotonShip} from './units/simple-photon-ship.js';
import {SimplePhotonShip2} from './units/simple-photon-ship-2.js';
import {SimplePhotonShip3} from './units/simple-photon-3.js';
import {SimplePhotonShip4} from './units/simple-photon-4.js';
import {SimplePhotonShip5} from './units/simple-photon-5.js';
import {SimpleThunderShip} from './units/simple-thunder-ship.js';
import {SimpleClusterBulletShip} from './units/simple-cluster-bullet-ship.js';
import {SimpleFireShip} from './units/simple-fire-ship.js';
import {SimpleIcyShip} from './units/simple-icy-ship.js';
import {SimpleVirusShip} from './units/simple-virus-ship.js';
import {SimpleDefenseShip} from './units/simple-defense-ship.js';
import {SimpleRocketDefenseShip} from './units/simple-rocket-defense-ship.js';
import {SimpleAmbulanceShip} from './units/simple-ambulance-ship.js';
import {SimpleCounterAttackShip} from './units/simple-counter-attack-ship.js';


import {Satellite1} from './units/satellite-1.js';

import {ExplorationShip1} from './units/exploration-ship-1.js';
import {NavigationShip1} from './units/navigation-ship-1.js';

import {Missile1} from './units/missile-1.js';
import {Missile2} from './units/missile-2.js';
import {Missile3} from './units/missile-3.js';
import {Missile4} from './units/missile-4.js';
import {Missile5} from './units/missile-5.js';
import {Missile6} from './units/missile-6.js';
import {Missile7} from './units/missile-7.js';
import {Missile8} from './units/missile-8.js';
import {CruiseMissile1} from './units/cruise-missile-1.js';

import {TransportShip1} from './units/transport-ship-1.js';

import {LaserGun1} from './units/laser-gun-1.js';
import {LaserGun2} from './units/laser-gun-2.js';
import {PlasmaGun1} from './units/plasma-gun-1.js';
import {RocketGun1} from './units/rocket-gun.js';

import {PlayerShip1} from './player-ship-1.js';
import {PlayerShip2} from './player-ship-2.js';
import {PlayerShip3} from './player-ship-3.js';
import {PlayerShip4} from './player-ship-4.js';
import {PlayerShip5} from './player-ship-5.js';

import {RocketShip1} from './units/rocket-ship-1.js';

import {Utils} from './units/utils.js';

import {inventory} from './inventory.js';

import {thruster} from './thruster.js';

import {ShipPackage} from './ship-package.js';

import { CSS2DRenderer, CSS2DObject } from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/renderers/CSS2DRenderer.js';


var _my_game_unit_mg;

class UnitMG{
	constructor(params){
		this._params=params;
		this._game=this._params.game;
		
		_my_game_unit_mg=this;
		
		this._data_list={};
		
		this._unit_class_list=new Array();
		
		this._full_unit=new Array();//toan bo unit, sau nay nen su dung _full_unit thay vi _combat_unit_list
		this._combat_unit_list=new Array();//unit, cac item cua player hoac cua cac base ko dc add vao day
		this._building_unit_list=new Array();
		this._lock_auto_create_enemy=true;
		
		this._utils=new Utils();
		
		this.add_unit_class("Mother-Ship","Mother-Heating-Ship",this.create_mother_heating_ship_1);
		this.add_unit_class("Mother-Ship","Mother-Freezing-Ship",this.create_mother_freezing_ship_1);
		this.add_unit_class("Mother-Ship","Mother-Rocket-Ship",this.create_mother_rocket_ship_1);
		
		this._ship_groups=[
			{id:1,name:"Mercury",generate:2,inhibit:4},//thuy
			{id:2,name:"Jupiter",generate:4,inhibit:5},//moc
			{id:3,name:"Venus",generate:1,inhibit:2},//kim
			{id:4,name:"Mars",generate:5,inhibit:3},//hoa
			{id:5,name:"Saturn",generate:3,inhibit:1},//tho
		];
		
		/*
			skill_upgrade_cost_min: la so luong gem-stone can phai co de update 1 ky nang tu level1->level2
		*/
		
		this._player_ship_infors=[
			{id:1,name:"God Of Thunder",group:1,player_level:1,model_id:"spaceship-1",price:1000,ship_class:PlayerShip1,create_fc:_my_game_unit_mg.create_player_entity_1,get_model:_my_game_unit_mg.create_player_ship_model_1,skill_upgrade_cost_min:10,skill_upgrade_item_require_id:1,additional_skill_premium_group:[1,2]},
			{id:2,name:"Hell Devil",group:2,player_level:3,model_id:"spaceship-24",price:this._game._parameters._standard_price*5000,ship_class:PlayerShip2,create_fc:_my_game_unit_mg.create_player_entity_2,get_model:_my_game_unit_mg.create_player_ship_model_2,skill_upgrade_cost_min:10,skill_upgrade_item_require_id:2,additional_skill_premium_group:[1,3]},
			{id:3,name:"Silver Lightning",group:3,player_level:7,model_id:"spaceship-22",price:this._game._parameters._standard_price*10000,ship_class:PlayerShip3,create_fc:_my_game_unit_mg.create_player_entity_3,get_model:_my_game_unit_mg.create_player_ship_model_3,skill_upgrade_cost_min:10,skill_upgrade_item_require_id:3,additional_skill_premium_group:[1,4]},
			{id:4,name:"Fire Dragon",group:4,player_level:9,model_id:"spaceship-50",price:this._game._parameters._standard_price*16000,ship_class:PlayerShip4,create_fc:_my_game_unit_mg.create_player_entity_4,get_model:_my_game_unit_mg.create_player_ship_model_4,skill_upgrade_cost_min:10,skill_upgrade_item_require_id:4,additional_skill_premium_group:[1,5]},
			{id:5,name:"Iron Buffalo",group:5,player_level:11,model_id:"spaceship-49",price:this._game._parameters._standard_price*21000,ship_class:PlayerShip5,create_fc:_my_game_unit_mg.create_player_entity_5,get_model:_my_game_unit_mg.create_player_ship_model_5,skill_upgrade_cost_min:10,skill_upgrade_item_require_id:5,additional_skill_premium_group:[1,6]}
		];
		this._player_ship_skill_upgrade_arithmetic_progression=5;//cap so cong
		
		const _path="./resources/icons/";
		const _extension=".png";
		this._sub_rocket_infor=[//rocket trong defend planet mode
				{id:1,name:'Sub-rocket 1',image_file_path:_path+"missle-1"+_extension,
					price:this._game._parameters._standard_price*20,
					ship_level:1,
					count:5,
					particle_id:'particle10',
					particle_color:'green',
					damage:this._game._parameters._standard_hp/10
				},
				{id:2,name:'Sub-rocket 2',image_file_path:_path+"missle-2"+_extension,
					price:this._game._parameters._standard_price*20,
					ship_level:1,
					count:6,
					particle_id:'particle10',
					particle_color:'red',
					damage:this._game._parameters._standard_hp/15
				},
				{id:3,name:'Sub-rocket 3',image_file_path:_path+"missle-4"+_extension,
					price:this._game._parameters._standard_price*20,
					ship_level:1,
					count:7,
					particle_id:'particle10',
					particle_color:'purple',
					damage:this._game._parameters._standard_hp/20
				},
			];
	}
	//-------------------------------------
	get_sub_rocket_infor(_id){
		for(let i=0;i<this._sub_rocket_infor.length;i++){
			const _infor=this._sub_rocket_infor[i];
			if(_infor.id===_id)
				return _infor;
		}
		return null;
	}
	//-----------------------------------
	is_player_ship(_name){//chua test
		for(let i=0;i<this._player_ship_infors.length;i++){
			if(this._player_ship_infors[i].ship_class.name===_name)
				return true;
		}
		return false;
	}
	get_all_player_ship_ids(){//lay toan bo id cua cac ship theo thu' tu trong array
		let _rs=new Array();
			for(let i=0;i<this._player_ship_infors.length;i++){
				_rs.push(this._player_ship_infors[i].id);
			}
		return _rs;
	}
	get_all_player_ship_group_ids(){//lay toan bo id cua cac ship-group theo thu' tu trong array
		let _rs=new Array();
			for(let i=0;i<this._player_ship_infors.length;i++){
				_rs.push(this._player_ship_infors[i].group);
			}
		return _rs;
	}
	get_player_ship_model_id(_id){
		const _infor=this.get_player_ship_infor(_id);
		return _infor.model_id;
	}
	get_player_ship_skill_upgrade_cost(_id,_current_level){
		const _infor=this.get_player_ship_infor(_id);
		let _cost=_infor.skill_upgrade_cost_min;
		for(let i=2;i<_current_level+1;i++){
			_cost+=this._player_ship_skill_upgrade_arithmetic_progression;
		}
		return _cost;
	}
	get_player_ship_skill_upgrade_item_require_id(_id){//id cua item can co' de upgrade skill
		const _infor=this.get_player_ship_infor(_id);
		//alert("ShipID=="+_id);alert(_infor.skill_upgrade_item_require_id);
		return _infor.skill_upgrade_item_require_id;
	}
	
	get_player_ship_additional_skill_premium_groups(_id){
		const _infor=this.get_player_ship_infor(_id);
		return _infor.additional_skill_premium_group;
	}
	
	is_premium_additional_skill_group(_ship_id,_skill_group_id){
		const _groups=this.get_player_ship_additional_skill_premium_groups(_ship_id);
		for(let i=0;i<_groups.length;i++){
			if(_groups[i]===_skill_group_id)
				return true;
		}
		return false;
	}
	
	get_player_ship_infor(_id){
		for(let i=0;i<this._player_ship_infors.length;i++){
			const _infor=this._player_ship_infors[i];
			if(_infor.id===_id)
				return _infor;
		}
		return null;
	}
	get_player_ship_class(_id){
		const _infor=this.get_player_ship_infor(_id);
		return _infor.ship_class;
	}
	get_player_ship_id(_ship){//nhap vao ship va tra ve id
		let _name1=_ship.constructor.name;
		for(let i=0;i<this._player_ship_infors.length;i++){
			const _infor=this._player_ship_infors[i];
			const _name2=this.get_player_ship_class(_infor.id).name;
			if(_name1===_name2)
				return _infor.id;
		}
		return null;
	}
	get_player_ship_name(_id){
		const _infor=this.get_player_ship_infor(_id);
		return _infor.name;
	}
	get_player_ship_level_require(_id){
		const _infor=this.get_player_ship_infor(_id);
		return _infor.player_level;
	}
	get_player_ship_price(_id){
		const _infor=this.get_player_ship_infor(_id);
		return _infor.price;
	}
	get_player_ship_create_fc(_id){
		const _infor=this.get_player_ship_infor(_id);
		return _infor.create_fc;
	}
	get_player_ship_model(_id){
		const _infor=this.get_player_ship_infor(_id);
		return _infor.get_model;
	}
	get_player_ship_group_id(_id){
		const _infor=this.get_player_ship_infor(_id);
		return _infor.group;
	}
	get_player_ship_group_name(_id){
		const _infor=this.get_player_ship_infor(_id);
		return this.get_player_ship_group_name_by_id(_infor.group);
	}
	get_player_ship_group_by_class_name(_name){//chua test
		for(let i=0;i<this._player_ship_infors.length;i++){
			if(this._player_ship_infors[i].ship_class.name===_name)
				return this._player_ship_infors[i].group;
		}
		return null;
	}
	get_player_ship_group_name_by_id(_group_id){
		return this.get_ship_group_infor(_group_id);
	}
	get_ship_group_infor(_id){
		for(let i=0;i<this._ship_groups.length;i++){
			const _infor=this._ship_groups[i];
			if(_infor.id===_id)
				return _infor;
		}
		return null;
	}
	_Generate(_group_id_1,_group_id_2){//kiem tra xem group_1 co generate group_2 ko
		if(_group_id_1===null||_group_id_2===null)
			return false;
		
		if(this.get_generate_type(_group_id_1)===_group_id_2)
			return true;
		
		return false;
	}
	_IsGenerate(_ship_id,_group_id){//kiem tra xem player ship co generate group_id nay ko
		if(_ship_id===null||_group_id===null)
			return false;
		
		let _ship_group_id=this.get_player_ship_group_id(_ship_id);
		let _generate_id=this.get_generate_type(_ship_group_id);
		if(_generate_id===_group_id)
			return true;
		
		return false;
	}
	_Inhibit(_group_id_1,_group_id_2){//kiem tra xem group_1 co inhibit group_2 ko
		if(_group_id_1===null||_group_id_2===null)
			return false;
		
		if(this.get_inhibit_type(_group_id_1)===_group_id_2)
			return true;
		
		return false;
	}
	_IsInhibit(_ship_id,_group_id){//kiem tra xem player ship co inhibit group_id nay ko
		if(_ship_id===null||_group_id===null)
			return false;
		
		let _ship_group_id=this.get_player_ship_group_id(_ship_id);
		let _generate_id=this.get_inhibit_type(_ship_group_id);
		if(_generate_id===_group_id)
			return true;
		
		return false;
	}
	get_generate_type(_id){//lay id cua group dc group này sinh
		return this.get_ship_group_infor(_id).generate;
	}
	get_inhibit_type(_id){//lay id cua group bi group này khắc
		return this.get_ship_group_infor(_id).inhibit;
	}
	get_inhibited_type(_id){//lay id cua group khac group nay
		for(let i=0;i<this._ship_groups.length;i++){
			const _infor=this._ship_groups[i];
			if(this._Inhibit(_infor.id,_id))
				return _infor.id;
		}
		return null;
	}
	
	add_unit_class(_type,_name,_init_fc){
		for(let i=0;i<this._unit_class_list.length;i++){
			const _class=this._unit_class_list[i];
			if(_class.name===_name){
				alert("The class name "+_name+" has been added");
				return false;
			}
		}
		this._unit_class_list.push({type:_type,name:_name,init_fc:_init_fc});
	}
	get_all_unit_class_by_type(_type){
		let _rs=new Array();
		for(let i=0;i<this._unit_class_list.length;i++){
			const _class=this._unit_class_list[i];
			if(_class.type===_type){
				_rs.push(_class);
			}
		}
		return _rs;
	}
	get_unit_class_init_fc(_name){
		for(let i=0;i<this._unit_class_list.length;i++){
			const _class=this._unit_class_list[i];
			if(_class.name===_name){
				return _class.init_fc;
			}
		}
		return null;
	}
	
	get_rocket_level_require(_id){
		const _infor=this.get_rocket_infor(_id);
		return _infor.ship_level;
	}
	get_rocket_create_fc(_id){
		const _infor=this.get_rocket_infor(_id);
		return _infor.create_fc;
	}
	get_rocket_infor(_id){
		const _full_infor=this.get_all_rockets_infor();
		for(let i=0;i<_full_infor.length;i++){
			let _infor=_full_infor[i];
			if(_infor.id===_id)
				return _infor;
		}
		return null;
	}
	get_rocket_infor_by_class_name(_name){
		const _full_infor=this.get_all_rockets_infor();
		for(let i=0;i<_full_infor.length;i++){
			let _infor=_full_infor[i];
			if(_infor.class_name===_name)
				return _infor;
		}
		return null;
	}
	get_all_rockets_infor(){
		const _path="./resources/icons/missile/";
		const _extension=".jpg";
		if(!this._rocket_infor)
		this._rocket_infor=[
			{id:1,class_name:'Missile1',image_file_path:_path+"missle-4"+_extension,
			price:this._game._parameters._standard_price,
			create_fc:(_ship,_pos,_is_enemy)=>{return this._game._unitMG.create_missile_1(_ship,_pos,_is_enemy);},
			ship_level:1},
			
			{id:2,class_name:'Missile2',image_file_path:_path+"missle-1"+_extension,
			price:this._game._parameters._standard_price*4,
			create_fc:(_ship,_pos,_is_enemy)=>{return this._game._unitMG.create_missile_2(_ship,_pos,_is_enemy);},
			ship_level:2},
			
			{id:3,class_name:'Missile3',image_file_path:_path+"missle-2"+_extension,
			price:parseInt(this._game._parameters._standard_price*8),
			create_fc:(_ship,_pos,_is_enemy)=>{return this._game._unitMG.create_missile_3(_ship,_pos,_is_enemy);},
			ship_level:4},
			
			{id:4,class_name:'Missile4',image_file_path:_path+"missle-3"+_extension,
			price:parseInt(this._game._parameters._standard_price*12),
			create_fc:(_ship,_pos,_is_enemy)=>{return this._game._unitMG.create_missile_4(_ship,_pos,_is_enemy);},
			ship_level:8},
			/*
			{id:5,class_name:'Missile5',image_file_path:_path+"missle-5"+_extension,
			price:parseInt(this._game._parameters._standard_price*15),
			create_fc:(_ship,_pos,_is_enemy)=>{return this._game._unitMG.create_missile_5(_ship,_pos,_is_enemy);},
			ship_level:8},
			*/
			{id:6,class_name:'Missile6',image_file_path:_path+"missle-6"+_extension,
			price:parseInt(this._game._parameters._standard_price*20),
			create_fc:(_ship,_pos,_is_enemy)=>{return this._game._unitMG.create_missile_6(_ship,_pos,_is_enemy);},
			ship_level:12},
			
			{id:7,class_name:'Missile7',image_file_path:_path+"missle-7"+_extension,
			price:parseInt(this._game._parameters._standard_price*30),
			create_fc:(_ship,_pos,_is_enemy)=>{return this._game._unitMG.create_missile_7(_ship,_pos,_is_enemy);},
			ship_level:16},
			
			{id:8,class_name:'Missile8',image_file_path:_path+"missle-5"+_extension,
			price:parseInt(this._game._parameters._standard_price*40),
			create_fc:(_ship,_pos,_is_enemy)=>{return this._game._unitMG.create_missile_8(_ship,_pos,_is_enemy);},
			ship_level:20},
			
			//{id:4,image_file_path:_path+"exploration-ship.png",
			//price:this._game._parameters._standard_price}
		];
		
		return this._rocket_infor;
	}
	
	get_model_file_path(_id){
		for(let i=0;i<this._full_model_file_path.length;i++){
			if(this._full_model_file_path[i][0]===_id)
				return this._full_model_file_path[i][1];
		}
		return null;
	}
	
	get_model_file_path_list(_id_list){
		let _rs=new Array();
			for(let i=0;i<_id_list.length;i++){
				for(let j=0;j<this._full_model_file_path.length;j++){
					if(_id_list[i]===this._full_model_file_path[j][0])
						_rs.push(this._full_model_file_path[j]);
				}
			}
		return _rs;
	}
	
	init_url_list(){
		//alert(this._game._game_id);
		this._full_model_file_path=[
						//["satellite-1","./resources/models/Sattelite/satellite_low_poly/scene.gltf"],
						
					   //["lasergun-1","./resources/models/Weapon/infinite_armament_blaster/scene.gltf"],
					   //["lasergun-1","./resources/models/SpaceGun/anti-material_aircraft_cannondraft/scene.gltf"],//scale:1.5
					   //["lasergun-1","./resources/models/SpaceGun/modular_shotgun/scene.gltf"],//scale:0.01
					   //["lasergun-1","./resources/models/SpaceGun/racers_spaceship/scene.gltf"],//scale:20
					   //["lasergun-1","./resources/models/SpaceGun/spaceship_b-br/scene.gltf"],//GOOD scale:1
					   //["lasergun-1","./resources/models/SpaceGun/spaceship_ezno/scene.gltf"],//Good scale:0.3
					   ["lasergun-1","./resources/models/SpaceGun/spaceship-1/scene.gltf"],//VeryGood scale:3
					   //["lasergun-1","./resources/models/SpaceGun/spaceship-2/scene.gltf"],//scale 60
					   //["lasergun-1","./resources/models/SpaceGun/spaceship-3/scene.gltf"],//good for rocket scale 0.4
					   //["lasergun-1","./resources/models/SpaceGun/spaceship-4/scene.gltf"],//scale 1.2
					   
					   ["spaceship-11","./resources/models/SpaceShip/phoenix_sci-fi_spaceship/scene.gltf"],
					   
					   //["plasmagun-1","./resources/models/Weapon/plasma_rifle/scene.gltf"],
					   ["plasmagun-1","./resources/models/SpaceGun/spaceship_ezno/scene.gltf"],
					   
					   ["rocketgun-1","./resources/models/SpaceGun/spaceship_b-br/scene.gltf"],
					   
					   ["cannon1","./resources/models/Cannon/cannon1/scene.gltf"],
					   ["cannon2","./resources/models/Cannon/cannon2/scene.gltf"],
					   
					   //["spaceship-1","./resources/models/SpaceShip/x-wing/scene.gltf"],
					   ["spaceship-1","./resources/models/space-ship/new-1/scene.gltf"],
					   ["spaceship-2","./resources/models/space-ship/guardian/scene.gltf"],
					  //createSimpleLaser
					   ["spaceship-3","./resources/models/SpaceShip/spaceship-3/scene.gltf"],//OK
					   ["spaceship-4","./resources/models/SpaceShip/spaceship-4/scene.gltf"],//GOOD
					   ["spaceship-5","./resources/models/SpaceShip/spaceship-5/scene.gltf"],//GOOD FOR ENEMY
					   ["spaceship-6","./resources/models/SpaceShip/spaceship-6/scene.gltf"],//OK FOR ENEMY
					   ["spaceship-7","./resources/models/SpaceShip/spaceship-7/scene.gltf"],//CARTOON
					   ["spaceship-8","./resources/models/SpaceShip/spaceship-8/scene.gltf"],//GOOD FOR ENEMY
					   //["spaceship-9","./resources/models/SpaceShip/spaceship-9/scene.gltf"],//GOOD
					   //["spaceship-10","./resources/models/SpaceShip/spaceship-10/scene.gltf"],//GOOD
					   //["spaceship-11","./resources/models/SpaceShip/red_ranger_x_wing/scene.gltf"],
					   //["spaceship-12","./resources/models/SpaceShip/helicopter_space_ship/scene.gltf"],
					   ["spaceship-12","./resources/models/space-ship/spacecraft/scene.gltf"],
					   ["spaceship-13","./resources/models/SpaceShip/cartoon_spaceship/scene.gltf"],
					   ["spaceship-14","./resources/models/space-ship/guardians_of_the_galaxy_starblaster_spaceship/scene.gltf"],
					   ["spaceship-15","./resources/models/space-ship/libra_moth/scene.gltf"],
					   ["spaceship-16","./resources/models/space-ship/spaceship-20220201/scene.gltf"],
					   ["spaceship-17","./resources/models/space-ship/zume-3_uss_galileo/scene.gltf"],
					   ["spaceship-18","./resources/models/space-ship/spaceship/scene.gltf"],
					   ["spaceship-19","./resources/models/space-ship/spaceship1/scene.gltf"],
					   ["spaceship-20","./resources/models/space-ship/spaceship2/scene.gltf"],
					   
					   //["spaceship-21","./resources/models/space-ship/new-2/scene.gltf"],
					   ["spaceship-21","./resources/models/space-ship/new_tackle_veil/scene.gltf"],
					   
					   ["spaceship-22","./resources/models/SpaceShip/guardians_of_the_galaxy_milano_mandela_spaceship/scene.gltf"],
					   //["spaceship-23","./resources/models/SpaceShip/guardians_of_the_galaxy_starblaster_spaceship/scene.gltf"],
					   ["spaceship-24","./resources/models/SpaceShip/guardians_of_the_galaxy_warbird_spaceship/scene.gltf"],
					   //["spaceship-25","./resources/models/SpaceShip/spaceship_version_0/scene.gltf"],
					   //["spaceship-26","./resources/models/SpaceShip/safine/scene.gltf"],
					   ["spaceship-27","./resources/models/SpaceShip/nave_espacial-spaceship_lowpoly/scene.gltf"],
					   //["spaceship-28","./resources/models/SpaceShip/kezrek_g1_spaceship/scene.gltf"],
					   ["spaceship-29","./resources/models/SpaceShip/zume-3_uss_galileo/scene.gltf"],
					   //["spaceship-30","./resources/models/SpaceShip/spaceship-lowpoly/scene.gltf"],
					   //["spaceship-31","./resources/models/SpaceShip/spaceship_model/scene.gltf"],
					   //["spaceship-32","./resources/models/SpaceShip/weekly_challenge_25_spaceship/scene.gltf"],
					   //["spaceship-33","./resources/models/SpaceShip/spaceship_medium_fighter/scene.gltf"],
					   //["spaceship-34","./resources/models/SpaceShip/spaceship_08/scene.gltf"],
					   //["spaceship-35","./resources/models/SpaceShip/spaceship-09/scene.gltf"],//phu hop lam icy-ship
					   //["spaceship-36","./resources/models/SpaceShip/spaceship-05/scene.gltf"],
					   //["spaceship-37","./resources/models/SpaceShip/spaceship-07/scene.gltf"],
					   //["spaceship-38","./resources/models/SpaceShip/custom_3d_spaceship/scene.gltf"],
					   //["spaceship-39","./resources/models/SpaceShip/sci-fi_luminaris_spaceship/scene.gltf"],
					   //["spaceship-40","./resources/models/SpaceShip/star_wars_spaceship/scene.gltf"],
					   //["spaceship-41","./resources/models/SpaceShip/exon_90/scene.gltf"],
					   //["spaceship-42","./resources/models/SpaceShip/spaceship_333/scene.gltf"],
					   //["spaceship-43","./resources/models/SpaceShip/spaceship_evil_gravity/scene.gltf"],
					   ["spaceship-44","./resources/models/SpaceShip/spaceship_tank/scene.gltf"],
					   ["spaceship-45","./resources/models/SpaceShip/darth_vaders_tie-fighter/scene.gltf"],
					   
					   //model cu: SpaceShip/New-1
					   ["spaceship-46","./resources/models/space-ship/eas_badger/scene.gltf"], //for photon-ship
					  
					   
					   ["spaceship-49","./resources/models/SpaceShip/new-4/scene.gltf"],
					   ["spaceship-50","./resources/models/SpaceShip/new-5/scene.gltf"],
					   //["spaceship-51","./resources/models/SpaceShip/new-6/scene.gltf"],
					   
					   ["spaceship-52","./resources/models/space-ship/alien_military_aircraft/scene.gltf"],
					   ["spaceship-53","./resources/models/space-ship/spaceship_clipper_v2/scene.gltf"],
					   
					   ["spaceship-54","./resources/models/space-ship/spaceship_draft/scene.gltf"],
					   
					   ["simple-laser-ship","./resources/models/SpaceShip/toon_spaceship/scene.gltf"],
					   
					   ["missile-1","./resources/models/missile/aim-9_missile/scene.gltf"],
					   ["missile-2","./resources/models/missile/missile_model_murder_drones/scene.gltf"],
					  ];
		
		if(this._game._game_id===4){//show room
			let _register_list=["missile-1"];
			this._url_list=this.get_model_file_path_list(_register_list);
		}
			
		if(this._game._game_id===1){//cac game space-ship-game
			/*
			let _register_list=["satellite-1","lasergun-1","plasmagun-1","rocketgun-1","cannon1","cannon2",
						"spaceship-1","spaceship-2","spaceship-3","spaceship-4","spaceship-5","spaceship-6","spaceship-7","spaceship-8",
						"spaceship-11","spaceship-12","spaceship-13","spaceship-14","spaceship-15","spaceship-16",
						"spaceship-17","spaceship-18","spaceship-19","spaceship-20","spaceship-21",
						"spaceship-22","spaceship-24","spaceship-27","spaceship-29","spaceship-44","spaceship-45",
						"spaceship-46","spaceship-49","spaceship-50","spaceship-51","spaceship-52","spaceship-53","spaceship-54","simple-laser-ship","missile-1","missile-2"];
			*/
			//this._unitMG.get_player_ship_class(this._unitMG._player_ship_id)
			//alert(this._player_ship_id);
			const _current_ship_id=this.get_current_player_ship_id();//alert(_current_ship_id);
			const _current_ship_model_id=this.get_player_ship_model_id(_current_ship_id);
			const _ship_package=this.get_current_player_ship_package();
			
			let _register_list=new Array();
				_register_list.push("missile-1");
				_register_list.push(_current_ship_model_id);
			
			let _item_id1=_ship_package.get_current_auxiliary_id(1);
			if(_item_id1!=null){
				let _item_name1=_ship_package.get_current_auxiliary_name(1);
				let _model_id_1=this._game._parameters.get_auxiliary_model_id(_item_id1);
				let _url_1=this.get_model_file_path(_model_id_1);
				_register_list.push(_model_id_1);
				//alert(_model_id_1);
				//alert(_url_1);
			}
		
			let _item_id2=_ship_package.get_current_auxiliary_id(2);
			if(_item_id2!=null){
				let _item_name2=_ship_package.get_current_auxiliary_name(2);
				let _model_id_2=this._game._parameters.get_auxiliary_model_id(_item_id2);
				let _url_2=this.get_model_file_path(_model_id_2);
				_register_list.push(_model_id_2);
				//alert(_model_id_2);
				//alert(_url_2);
			}
			//alert(_item_id1);
			//alert(_current_ship_model_id);
			//let _register_list=["spaceship-1","spaceship-24","spaceship-22","spaceship-50","spaceship-49",
			//"missile-1"];
			
			
			this._url_list=this.get_model_file_path_list(_register_list);
		}
			
		if(this._game._game_id===2)//legion-game			  
		this._url_list=[
		
					   ["lasergun-1","./resources/models/Weapon/infinite_armament_blaster/scene.gltf"],
					   ["plasmagun-1","./resources/models/Weapon/plasma_rifle/scene.gltf"],
					   
					   ["cannon1","./resources/models/Cannon/cannon1/scene.gltf"],
					   ["cannon2","./resources/models/Cannon/cannon2/scene.gltf"],
					   
					   ["spaceship-1","./resources/models/SpaceShip/x-wing/scene.gltf"],
					  
					   ["spaceship-24","./resources/models/SpaceShip/guardians_of_the_galaxy_warbird_spaceship/scene.gltf"],
					   
					   ["spaceship-44","./resources/models/SpaceShip/spaceship_tank/scene.gltf"],
					   ["spaceship-45","./resources/models/SpaceShip/darth_vaders_tie-fighter/scene.gltf"],
					  ];	
	}
	load_data(_fc){
		this.init_url_list();
		
		let _url_list=this._url_list;
		
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
				
					try{
						_fc();
						//this.create_player_entity();
						
						//this.add_random_enemy_combat_unit(1);
					
					}catch(e){
						alert(e.toString());
						}
					
					this.enable_auto_create_enemy();
					//this._lock_auto_create_enemy=false;
				}
			});
		}
		
	}
	
	enable_auto_create_enemy(){
		this._lock_auto_create_enemy=false;
	}
	disable_auto_create_enemy(){
		this._lock_auto_create_enemy=true;
	}
	/*
	create_enemy_unit_of_base_when_player_approach(base_class){//khi player lai gan base
		if(this._lock_auto_create_enemy===true)return;
		if(!this._unit_of_base_list){
			this._unit_of_base_list=new Array();
		}
		for(var i=0;i<this._unit_of_base_list.length;i++){
			let _base_class=this._unit_of_base_list[i];
			if(_base_class===base_class){//moi base chi create 1 lan
				return false;
			}
		}
		
		this._unit_of_base_list.push(base_class);
		this.after_create_enemy_combat_unit_fc_2=function(_eunit){
			_eunit._base_class=base_class;
		}
		this.add_enemy_combat_unit_group(5,7);
		
	}
	*/
	create_enemy_unit_of_planet_when_player_approach(planet_class){//khi player lại gần planet
		if(this._lock_auto_create_enemy===true)return;
		
		if(!this._unit_of_planet_list){
			this._unit_of_planet_list=new Array();
		}
		for(var i=0;i<this._unit_of_planet_list.length;i++){
			let _planet_class=this._unit_of_planet_list[i];
			if(_planet_class===planet_class){//moi hanh tinh chi create 1 lan
				return false;
			}
		}
		
		this._unit_of_planet_list.push(planet_class);
		this.after_create_enemy_combat_unit_fc_2=function(_eunit){
			_eunit._planet_class=planet_class;
		}
		
		//Khi tạo các eunit của 1 hành tinh mới thì các eunit của hành tinh cũ chưa tiêu diệt hết sẽ bị xóa bỏ
		for(let i=this._combat_unit_list.length-1;i>=0;i--){
			let _eunit2=this._combat_unit_list[i];
			if(_eunit2._planet_class!=planet_class){
				//this.remove_unit(_eunit2);	
				this._combat_unit_list.splice(i,1);
				_eunit2.SelfDestroy();
			}
		}
		this.add_enemy_combat_unit_group(5,7);
		
	}
	add_computer_enemy_units(count,mission_level,_after_create_fc){//thay the cho function add_enemy_combat_unit_group
	//try{
			let _missionLevel=1;
			if(typeof mission_level!='undefined'&&mission_level!=null)
			_missionLevel=mission_level;
		//_missionLevel=60;
		//let _counter=1;
		//let _full_types=["laser1","icy1","fire1","rocket1","missile1","photon1"];
		/*Cac name phai copy theo get_full_enemy_ship_infor_1*/
		let _full_ships_infor=[
		//{id:3,name:"machine-gun-1",create_fc:this.createSimpleMachineGunShip,count_rate:1},
			{id:1,name:"laser1",create_fc:this.createSimpleLaserShip,count_rate:2},
			{id:2,name:"icy1",create_fc:this.createSimpleIcyShip,count_rate:1},
			{id:3,name:"photon2",create_fc:this.createSimplePhotonShip2,count_rate:1},
			
			{id:4,name:"fire1",create_fc:this.createSimpleFireShip,count_rate:1},
			
			{id:5,name:"photon3",create_fc:this.createSimplePhotonShip3,count_rate:1},
			{id:6,name:"photon4",create_fc:this.createSimplePhotonShip4,count_rate:1},
			
			{id:7,name:"rocket1",create_fc:this.createSimpleRocketShip,count_rate:1},
			{id:8,name:"missile1",create_fc:this.createSimpleMissileShip,count_rate:1},
			{id:9,name:"rocket2",create_fc:this.create_rocket_ship_type_2,count_rate:1},
			
			{id:10,name:"photon1",create_fc:this.createSimplePhotonShip,count_rate:1},
		];
		//_missionLevel=10;
		let _type_num=1+Math.floor(_missionLevel/5);
		if(_type_num>=_full_ships_infor.length)_type_num=_full_ships_infor.length;
		//alert("TypeNum="+_type_num);
		let _model_id_list=new Array();
		let _infor_id=0;/*Doan nay copy ben duoi', nen neu sua phai sua ca 2*/
		for(let i=0;i<count;i++){
			if(_infor_id>=_type_num)_infor_id=0;
			
			let _infor=_full_ships_infor[_infor_id];
			let _id=_infor.id;
			let _name=_infor.name;
			let _model_id=this.get_enemy_ship_model_id(_name);//alert(_model_id);
			_model_id_list.push(_model_id);
			
			_infor_id++;
		}
		//alert(_model_id_list);
		let _loader;
		let _counter=0;
		for(let i=0;i<_model_id_list.length;i++){
			const _model_id=_model_id_list[i];
			const _model_path=this.get_model_file_path(_model_id);
			
			let _create_unit=()=>{
				_counter++;	
				if(_counter===_model_id_list.length){//load complete
					
					_infor_id=0;
					for(let j=0;j<count;j++){
						if(_infor_id>=_type_num)_infor_id=0;
			
						let _infor=_full_ships_infor[_infor_id];
						let _id=_infor.id;
						let _name=_infor.name;
						let _model_id=this.get_enemy_ship_model_id(_name);
						let _create_fc=_infor.create_fc;
						let _ship_count=_infor.count_rate;
						let _eunit;
						for(let k=0;k<_ship_count;k++){
							_eunit=_create_fc(this.get_random_enemy_position_1());
							_eunit._lock_fire=false;
							this._game._graphics.Scene.add(_eunit._model);
							_eunit._target_object=this._game._me;
						}
			
						_infor_id++;
					}
					let _enemy_unit_level=1;
					_enemy_unit_level+=Math.floor(_missionLevel/2);
					this.update_enemy_combat_unit_list();
					const _tlist=this.get_all_other_team_unit(this._game._playerID);
					for(let i=0;i<_tlist.length;i++){//tăng các chỉ số theo level
						const _tunit=_tlist[i];
						_tunit._level_rate=2;//de cho cac chi so' tang nhanh hon
						_tunit._ship_package.set_ship_level(_enemy_unit_level);
						_tunit.apply_space_ship_level_package();
			
					}
					
					this._lock_check_unit_dead=false;
					
					if(_after_create_fc)_after_create_fc();
				}
			};
			
			if(this._data_list[_model_id]){
				_create_unit();
			}
			else{
				_loader= new GLTFLoader();
				_loader.load(_model_path,( gltf )=> {
					this._data_list[_model_id]=gltf;
					_create_unit();
				});
			}
			
			
		}
		
		
		
		
			
			
	//}catch(e){alert(e.stack);}
	}
	//*** level de xac dinh loai space-ship, level cang cao thi xuat hien space-ship cang khung?
	//*** mission_level la cap do mission, mission cang cao thi cac chi so cua spaceship cang manh
	//*** ko nhat thiet phai truyen vao mission_level, mission_level duoc su dung khi thuc hien cac mission
	add_enemy_combat_unit_group(level,count,mission_level){
		if(level<1)return;
		
		let _missionLevel=1;
		if(typeof mission_level!='undefined'&&mission_level!=null)
			_missionLevel=mission_level;
		//console.log("MissionLevel="+mission_level);
		let _count=0;
		let _full_unit_fc=new Array();
		
		//--------------------------------
		/*
		for(let i=0;i<count;i++){
				let _eunit=this.create_enemy_combat_ship_level_1_style_1(this.get_random_enemy_position_1());
				//let _eunit=this.create_enemy_combat_ship_level_3_style_5(this.get_random_enemy_position_1());
				this._game._graphics.Scene.add(_eunit._model);
				
		}
		*/
		//--------------------------------------
		
		if(level===1){
			for(let i=0;i<count;i++){
				let _eunit=this.create_enemy_combat_ship_level_1_style_1(this.get_random_enemy_position_1());
				//let _eunit=this.create_enemy_combat_ship_level_3_style_5(this.get_random_enemy_position_1());
				this._game._graphics.Scene.add(_eunit._model);
				
			}
		}
		else if(level===2){
			for(let i=0;i<count/2;i++){
				let _eunit=this.create_enemy_combat_ship_level_1_style_1(this.get_random_enemy_position_1());
				this._game._graphics.Scene.add(_eunit._model);
			}
			for(let i=0;i<count/2;i++){
				let _eunit=this.create_enemy_combat_ship_level_1_style_2(this.get_random_enemy_position_1());
				this._game._graphics.Scene.add(_eunit._model);
			}
			
		}
		else if(level===3){
			for(let i=0;i<count/2;i++){
				let _eunit=this.create_enemy_combat_ship_level_1_style_2(this.get_random_enemy_position_1());
				this._game._graphics.Scene.add(_eunit._model);
			}
			for(let i=0;i<count/2;i++){
				let _eunit=this.create_enemy_combat_ship_level_2_style_1(this.get_random_enemy_position_1());
				this._game._graphics.Scene.add(_eunit._model);
			}
			
		}
		else if(level===4){
			for(let i=0;i<count;i++){
				let _eunit=this.create_enemy_combat_ship_level_3_style_1(this.get_random_enemy_position_1());
				this._game._graphics.Scene.add(_eunit._model);
			}
		}
		else if(level===5){
			for(let i=0;i<count;i++){
				let _eunit=this.create_enemy_combat_ship_level_3_style_3(this.get_random_enemy_position_1());
				this._game._graphics.Scene.add(_eunit._model);
			}
			
		}
		else if(level===6){
			for(let i=0;i<count;i++){
				let _eunit=this.create_enemy_combat_ship_level_3_style_4(this.get_random_enemy_position_1());
				this._game._graphics.Scene.add(_eunit._model);
			}
				
		}
		else if(level===7){
			for(let i=0;i<count;i++){
				let _eunit=this.create_enemy_combat_ship_level_3_style_5(this.get_random_enemy_position_1());
				this._game._graphics.Scene.add(_eunit._model);
			}
		}
		else if(level===8){
			for(let i=0;i<count/2;i++){
				let _eunit=this.create_enemy_combat_ship_level_3_style_4(this.get_random_enemy_position_1());
				this._game._graphics.Scene.add(_eunit._model);
			}
			for(let i=0;i<count/2;i++){
				let _eunit=this.create_enemy_combat_ship_level_3_style_5(this.get_random_enemy_position_1());
				this._game._graphics.Scene.add(_eunit._model);
			}
				
		}
		else{
			for(let i=0;i<count;i++){
				let _eunit=this.create_enemy_combat_ship_level_3_style_5(this.get_random_enemy_position_1());
				this._game._graphics.Scene.add(_eunit._model);
			}
				
		}
		
		this.update_enemy_combat_unit_list();
		
		const _tlist=this.get_all_other_team_unit(this._game._playerID);
		for(let i=0;i<_tlist.length;i++){//tăng các chỉ số theo level
			const _tunit=_tlist[i];
			_tunit._level_rate=1.5;//de cho cac chi so' tang nhanh hon
			_tunit._ship_package.set_ship_level(_missionLevel);
			_tunit.apply_space_ship_level_package();
			//console.log("Level="+_tunit.get_space_ship_level());
			//console.log("HP="+_tunit.get_space_ship_hp());
			//console.log("ATK="+_tunit.get_space_ship_damage());
			//console.log("---------------------------------------");
		}
		//console.log("Unit Count="+_tlist.length);
		
	}
	
	get_random_enemy_position_1(){
		let _rand_1=Math.floor(Math.random() * 400) + 30;//ngau nhien tu 30->100
		let _rand_2=Math.floor(Math.random() * 400) + 30;
		let _rand_3=Math.floor(Math.random() * 400) + 30;
		
		return new THREE.Vector3(this._game._me.Position.x+_rand_1,
									this._game._me.Position.y+_rand_2,
									this._game._me.Position.z+_rand_3
								 );
		
	}
	
	add_random_enemy_combat_unit(count){
		const _max=30;
		
		//let _full_unit_fc=this.create_enemy_combat_unit_list_fc(1,count);
		
		for(let i=0;i<count;i++){
			if(this._combat_unit_list.length>=_max){
				break;
			}
			let _rand_1=Math.floor(Math.random() * 400) + 30;//ngau nhien tu 30->100
			let _rand_2=Math.floor(Math.random() * 400) + 30;
			let _rand_3=Math.floor(Math.random() * 400) + 30;
			let _eunit=this.create_enemy_combat_ship_level_3_style_5(new THREE.Vector3(
						this._game._graphics.Camera.position.x+_rand_1,
						this._game._graphics.Camera.position.y+_rand_2,
						this._game._graphics.Camera.position.z+_rand_3
			));
			this._game._graphics.Scene.add(_eunit._model);
			//this._game._entities['_radar'].addTarget(_eunit);
			
			if(this.after_create_enemy_combat_unit_fc_1)
				this.after_create_enemy_combat_unit_fc_1(_eunit);
			if(this.after_create_enemy_combat_unit_fc_2)
				this.after_create_enemy_combat_unit_fc_2(_eunit);
		}
		
		this.update_enemy_combat_unit_list();
	};
	
	update_enemy_combat_unit_list(){//Hien thi cac enemy unit xung quanh de player chon
		return;
		if(typeof this._enemy_unit_list_container==='undefined'){
			this._enemy_unit_list_container=document.createElement("div");
			this._enemy_unit_list_container.style.display="flex";
			this._enemy_unit_list_container.style.justifyContent="right";
			this._enemy_unit_list_container.style.alignItems="right";
			this._enemy_unit_list_container.style.width="100%";
			this._enemy_unit_list_container.style.height="5%";
			this._enemy_unit_list_container.style.position="absolute";
			this._enemy_unit_list_container.style.zIndex="999999999999999999999999999999";
			document.body.appendChild(this._enemy_unit_list_container);
		}
		else{
			this._enemy_unit_list_container.innerHTML='';
		}
		
		let _content_div=document.createElement("div");
		this._enemy_unit_list_container.appendChild(_content_div);
		
		//_content_div.innerHTML+="";
		for(let i=0;i<this._combat_unit_list.length;i++){
			
			if(typeof this._combat_unit_list[i] ==='undefined'||
						this._combat_unit_list[i] ===null||
						this._combat_unit_list[i].Dead) continue;
			
			let _img=document.createElement("img");
			_img.src="./resources/icons/target-1.png";
			_img.width=50;
			_img.height=50;
			_img.style.border="solid 1px white";
			
			if(this._select_entity===this._combat_unit_list[i]){
				_img.style.border="solid 2px yellow";
			}
			
			_content_div.appendChild(_img);
			
			_img.addEventListener("click",()=>{
				
				try{
					if(typeof this._combat_unit_list[i] ==='undefined'||
						this._combat_unit_list[i] ===null||
						this._combat_unit_list[i].Dead)
						return;
					_img.style.border="solid 2px yellow";
					this._game._me.set_target(this._combat_unit_list[i]);
					this._select_entity=this._combat_unit_list[i];
				
				}catch(e){alert(e.toString());}
			});
		}
		//_content_div.innerHTML+="";
	}
	
	create_new_player_ship(ship_id,position){
		let model=this.get_player_ship_model(ship_id)()[1];
		
		let _player=this.create_combat_unit(SpaceShip1,model,position,true);
		
		this._game._graphics.Scene.add(_player._model);
		this._combat_unit_list.push(_player);
		
		_player.CheckTarget=()=>{};//loai bo chuc nang tu dong ban'
		
		return _player;
	}
	
	create_player_enemy_entity(ship_id,position){//player doi thu trong che do multi player(chi co 2 player)
	
		let model=this.get_player_ship_model(ship_id)()[1];
		
		this._game._entities['enemy-player-1']=this.create_combat_unit(SpaceShip1,model,position,true);
		
		this._game._graphics.Scene.add(this._game._entities['enemy-player-1']._model);
		this._combat_unit_list.push(this._game._entities['enemy-player-1']);
		
		this._game._entities['enemy-player-1'].CheckTarget=()=>{};//loai bo chuc nang tu dong ban'
		
	}
	
	get_player_enemey_entity(){
		return this._game._entities['enemy-player-1'];
	}
	get_current_player_ship_id(){
		let _ship_id=parseInt(localStorage.getItem('player-ship-id'));
		if(typeof _ship_id==='undefined'||_ship_id===null||isNaN(_ship_id))_ship_id=1;
		
		return _ship_id;
	}
	get_current_player_ship_package(){
		let _ship_id=this.get_current_player_ship_id();
		let _ship_package=new ShipPackage({game:this._game});
		_ship_package.load_data(_ship_id);
		
		return _ship_package;
	}
	create_player_entity(){
		
		//let _ship_id=parseInt(localStorage.getItem('player-ship-id'));
		//if(_ship_id===null)_ship_id=1;
		let _ship_id=this.get_current_player_ship_id();
		this._player_ship_id=_ship_id;
		if(typeof _ship_id==='undefined'||_ship_id===null)_ship_id=1;
		
		this.get_player_ship_create_fc(_ship_id)(_ship_id);
		
		var _ship_package=new ShipPackage({game:this._game});
		_ship_package.load_data(_ship_id);
		
		
		this.create_arrow();
		this._game._ship_mode=false;
		this._game._ChangeMode(_ship_id,_ship_package);
		
		this._game._me.set_group_id(this.get_player_ship_group_id(_ship_id));
		const _armour_id=this._game._me._ship_package.get_using_armour_id();
		if(_armour_id!=null){
			const _armour_level=this._game._me._ship_package.get_armour_level(_armour_id);
			this._game._me.EquipArmour(_armour_id,_armour_level);
			//console.log("Found Armour ID="+_armour_id+" and Level="+_armour_level);
		}
		//alert(this._game._me.get_group_id());
	};
	create_arrow(){
		let _arrow = new THREE.Group();;
					let loader_2 = new GLTFLoader();
					//loader_2.setPath('./resources/models/directional_arrow_1/');
					loader_2.load('./resources/models/arrow.glb', (gltf) => {
						let _new_material=_my_game_unit_mg.get_gradient_material("turquoise","purple");
						gltf.scene.traverse((o) => {
							if (o.isMesh) o.material = _new_material;
						});
			
					const model = gltf.scene.children[0];
					//model.material=_new_material;
					model.scale.setScalar(5);
					//model.rotation.z=Math.PI/2;
					model.rotation.y=Math.PI;
					
					//var _mat=new THREE.MeshStandardMaterial({
						//color:new THREE.Color("#50FE2D"),
						//emissive:new THREE.Color("#50FE2D")});
					//model.material=_mat;
					
					_arrow.add(model);
					this._game._me._model.add(_arrow);
					//this._graphics.Camera.add(_arrow);
					//_arrow.position.set(0,0,50);
					_arrow.position.set(-0.3,7.5,1);//Z cang nho thi vi tri cang tien' ve phia truoc
					_arrow.scale.set(0.12,0.12,0.2);
					});
					
					//this._game._entities['player-inventory-1']=new inventory.Inventory({game:this._game});
					//this._entities['player-inventory-1']._item_list['food']=["meat1","meat1","carrot"];
					
		this._game._arrow=_arrow;
	}
	
	load_player_ship_model(_id,_position,_call_back){//su dung trong showroom
		let _model_id=this.get_player_ship_model_id(_id);
		if(this._data_list[_model_id]){
			_call_back(true);
			return false;
		}
		
		let _t_loader= new GLTFLoader();
		let _url=this.get_model_file_path(_model_id);
		//alert(_url);
			_t_loader.load(_url,( gltf )=> {
				this._data_list[_model_id]=gltf;
				//let _unit=this.create_player_ship(_id,_position);
				_call_back(false);
			});
		return true;
	}
	create_empty_player_ship(_id,position,target_object){//su dung trong showroom
		
		//const _rs=_my_game_unit_mg.create_player_ship_model_1();
		//let gltf=_my_game_unit_mg._data_list[this.get_player_ship_model_id(1)];
		//const model = gltf.scene.children[0].clone();
		//model.scale.setScalar(0.5);
		//return [gltf,model];
		
		//let _skills_infor=_unit.get_main_skill_ids_and_names();
		//for(let i=0;i<_skills_infor.length;i++){
		
		const _rs=[new THREE.Object3D(),new THREE.Object3D()];
		
		const gltf=_rs[0];
		const model=_rs[1];
		let _UnitClass=this.get_player_ship_class(_id);
		let _unit= _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);
		
		if(target_object!=null)
			_unit._target_object=target_object;
		else
			_unit._target_object=_my_game_unit_mg._game._me;
		
		_unit.init_skills();
		
		
		
		return _unit;
	}
	create_player_ship(_id,_position){//for show room, phai lam sao cho tuong ung voi play-entity trong game vi 2 ben khac nhau
		
		if(_id===1)
			return this.create_player_ship_1(_position,null);
		if(_id===2)
			return this.create_player_ship_2(_position,null);
		if(_id===3)
			return this.create_player_ship_3(_position,null);
		if(_id===4)
			return this.create_player_ship_4(_position,null);
		if(_id===5)
			return this.create_player_ship_5(_position,null);
		return;
		
	}
	/*
	create_player_ship_model_1(){
		let gltf=_my_game_unit_mg._data_list[_my_game_unit_mg.get_player_ship_model_id(1)];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(0.6);
		return [gltf,model];
	}
	*/
	create_player_ship_model_1(){
		let gltf=_my_game_unit_mg._data_list[_my_game_unit_mg.get_player_ship_model_id(1)];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(0.3);
		model.position.z-=2;
		return [gltf,model];
	}
	create_player_ship_model_2(){
		let gltf=_my_game_unit_mg._data_list[_my_game_unit_mg.get_player_ship_model_id(2)];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(0.7);
		model.rotation.x=Math.PI*3/4;
		model.rotation.y=Math.PI;
		return [gltf,model];
	}
	create_player_ship_model_3(){
		let gltf=_my_game_unit_mg._data_list[_my_game_unit_mg.get_player_ship_model_id(3)];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(0.0023);
		return [gltf,model];
	}
	
	create_player_ship_model_4(){
		let gltf=_my_game_unit_mg._data_list[_my_game_unit_mg.get_player_ship_model_id(4)];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(2);
	    model.rotation.z=Math.PI;
		//model.rotation.x=Math.PI;
		return [gltf,model];
	}
	
	
	create_player_ship_model_5(){
		let gltf=_my_game_unit_mg._data_list[_my_game_unit_mg.get_player_ship_model_id(5)];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(2);
	    model.rotation.z=0;
		//model.rotation.x=Math.PI;
		return [gltf,model];
	}
	
	create_player_entity_1(){
		
		const _rs=_my_game_unit_mg.create_player_ship_model_1();
		const gltf=_rs[0];
		const model=_rs[1];
		
		const group = new THREE.Group();
		group.add(model);

		_my_game_unit_mg._game._graphics.Scene.add(group);
	 
			_my_game_unit_mg._game._ship_shape=group;
			_my_game_unit_mg._game._ship_gltf=gltf;
			
			return group;
	};
	
	
	create_player_entity_2(){//ko lien quan toi cac class trong shop.html, nhung phai chu y sao cho cac model cua shop.html va game.html tuong ung voi nhau
		
		const _rs=_my_game_unit_mg.create_player_ship_model_2();
		const gltf=_rs[0];
		const model=_rs[1];
		const group = new THREE.Group();
		group.add(model);

		_my_game_unit_mg._game._graphics.Scene.add(group);
	 
			_my_game_unit_mg._game._ship_shape=group;
			_my_game_unit_mg._game._ship_gltf=gltf;
			
			return group;
	};
	
	create_player_entity_3(){//ko lien quan toi cac class trong shop.html, nhung phai chu y sao cho cac model cua shop.html va game.html tuong ung voi nhau
		
		const _rs=_my_game_unit_mg.create_player_ship_model_3();
		const gltf=_rs[0];
		const model=_rs[1];
		const group = new THREE.Group();
		group.add(model);

		_my_game_unit_mg._game._graphics.Scene.add(group);
	 
			_my_game_unit_mg._game._ship_shape=group;
			_my_game_unit_mg._game._ship_gltf=gltf;
			
			return group;
	};
	
	create_player_entity_4(){//ko lien quan toi cac class trong shop.html, nhung phai chu y sao cho cac model cua shop.html va game.html tuong ung voi nhau
		
		const _rs=_my_game_unit_mg.create_player_ship_model_4();
		const gltf=_rs[0];
		const model=_rs[1];
		const group = new THREE.Group();
		group.add(model);

		_my_game_unit_mg._game._graphics.Scene.add(group);
	 
			_my_game_unit_mg._game._ship_shape=group;
			_my_game_unit_mg._game._ship_gltf=gltf;
			
			return group;
	};
	
	create_player_entity_5(){//ko lien quan toi cac class trong shop.html, nhung phai chu y sao cho cac model cua shop.html va game.html tuong ung voi nhau
		
		const _rs=_my_game_unit_mg.create_player_ship_model_5();
		const gltf=_rs[0];
		const model=_rs[1];
		const group = new THREE.Group();
		group.add(model);

		_my_game_unit_mg._game._graphics.Scene.add(group);
	 
			_my_game_unit_mg._game._ship_shape=group;
			_my_game_unit_mg._game._ship_gltf=gltf;
			
			return group;
	};
	
	no_unit_alive(){
		for (let i = this._combat_unit_list.length - 1; i >= 0; i--){
			if(!this._combat_unit_list[i].Dead)
				return false;
		}
		return true;
	}
	Update(timeInSeconds){
		
		//if(this._lock_auto_create_enemy===true)return;//co tu dong tao enemy hay ko
		let _found=false;
		for (let i = this._combat_unit_list.length - 1; i >= 0; i--){
			if(this._combat_unit_list[i].Dead)
				continue;
			_found=true;
		}
		
		if(!_found){
			
			if(typeof this._lock_check_unit_dead!='undefined'&&this._lock_check_unit_dead===false)
			if(this._all_enemy_combat_unit_dead){
				this._all_enemy_combat_unit_dead();
				//this._all_enemy_combat_unit_dead=function(){};
			}
			return;
		}
		
	}
	/*
	get_nearest_combat_unit_with_limited_angle(_position,_position2,_radius){
		let _unit1=null;
		for (let i = this._combat_unit_list.length - 1; i >= 0; i--){
			const _unit2=this._combat_unit_list[i];
			if(_unit2.Dead)
				continue;
			const _position3=_unit2.get_world_position();
			const _distance1=_position.distanceTo(_position3);
			if(_distance1<_radius){
				
				const _angle=this._utils.calculateAngleBetweenLines(_position,_position2,_position3);
				if(_angle<Math.PI/4){
				if(_unit1!=null){
					const _distance2=_position.distanceTo(_unit1.get_world_position());
					if(_distance1<_distance2){
						_unit1=_unit2;
					}
				}
				else{
					_unit1=_unit2;
				}
				}
			}
		}
		
		return _unit1;
	}
	*/
	
	get_nearest_combat_unit_with_direction(_position,_direction,_radius){//trả về unit nằm gần nhất trong bán kính
		let _unit1=null;
		for (let i = this._combat_unit_list.length - 1; i >= 0; i--){
			const _unit2=this._combat_unit_list[i];
			if(_unit2.Dead)
				continue;
			if(!this._utils.isSameDirection(_position, _direction, _unit2.get_world_position()))
				continue;
			
			const _distance1=_position.distanceTo(_unit2.get_world_position());
			if(_distance1<_radius){
				if(_unit1!=null){
					const _distance2=_position.distanceTo(_unit1.get_world_position());
					if(_distance1<_distance2){
						_unit1=_unit2;
					}
				}
				else{
					_unit1=_unit2;
				}
			}
		}
		
		return _unit1;
	}
	
	get_nearest_combat_unit(_position,_radius){//trả về unit nằm gần nhất trong bán kính
		let _unit1=null;
		for (let i = this._combat_unit_list.length - 1; i >= 0; i--){
			const _unit2=this._combat_unit_list[i];
			if(_unit2.Dead)
				continue;
			
			const _distance1=_position.distanceTo(_unit2.get_world_position());
			if(_distance1<_radius){
				if(_unit1!=null){
					const _distance2=_position.distanceTo(_unit1.get_world_position());
					if(_distance1<_distance2){
						_unit1=_unit2;
					}
				}
				else{
					_unit1=_unit2;
				}
			}
		}
		
		return _unit1;
	}
	
	get_opponents_combat_unit_in_range(_position,_radius){//chua test
		let _rs=new Array();
		let _found;
		const _ids=this._game._get_opponents_ids();
		for (let i = this._combat_unit_list.length - 1; i >= 0; i--){
			const _unit=this._combat_unit_list[i];
			if(_unit.Dead)
				continue;
			_found=false;
			for(let j=0;j<_ids.length;j++){
				if(_ids[j]===_unit._player_id){
					_found=true;
					break;
				}
			}
			
			if(_found){
				const _distance=_position.distanceTo(_unit.get_world_position());
				if(_distance<_radius){
					_rs.push([_unit,_distance]);
				}
			}
		}
		return _rs;
	}
	get_all_unit(_player_id){//lay toan bo unit dang ton tai trong map
		let _rs=new Array();
		for (let i = this._full_unit.length - 1; i >= 0; i--){
			const _unit=this._full_unit[i];
			if(_unit.Dead)
				continue;
			
			if(_unit._player_id===_player_id)
				_rs.push(_unit);
		}
		return _rs;
	}
	get_all_other_team_unit(_player_id){//lay toan bo cac unit khac team dang ton tai trong map
		let _rs=new Array();
		for (let i = this._full_unit.length - 1; i >= 0; i--){
			const _unit=this._full_unit[i];
			if(_unit.Dead||_unit._player_id===_player_id)
				continue;
			
			_rs.push(_unit);
		}
		return _rs;
	}
	get_all_combat_unit_with_exception(_player_id,_position,_radius){//all unit ngoai tru player_id
		let _rs=new Array();
		for (let i = this._full_unit.length - 1; i >= 0; i--){
			const _unit=this._full_unit[i];
			if(_unit.Dead||_unit._player_id===_player_id)
				continue;
			
			const _distance=_position.distanceTo(_unit.get_world_position());
			if(_distance<_radius){
				_rs.push([_unit,_distance]);
			}
		}
		return _rs;
	}
	get_other_teams_unit_in_range(_position,_radius){//lay tat ca unit cua cac player/computer khac
		let _rs=new Array();
		for (let i = this._full_unit.length - 1; i >= 0; i--){
			const _unit=this._full_unit[i];
			if(_unit.Dead||_unit._player_id===this._game._playerID)
				continue;
			
			const _distance=_position.distanceTo(_unit.get_world_position());
			if(_distance<_radius){
				_rs.push([_unit,_distance]);
			}
		}
		return _rs;
	}
	get_combat_unit_in_range(_player_id,_position,_radius){//lay ta ca unit cua player_id
		let _rs=new Array();
		for (let i = this._full_unit.length - 1; i >= 0; i--){
			const _unit=this._full_unit[i];
			if(_unit.Dead||_unit._player_id!=_player_id)
				continue;
			
			const _distance=_position.distanceTo(_unit.get_world_position());
			if(_distance<_radius){
				_rs.push([_unit,_distance]);
			}
		}
		return _rs;
	}
	get_enemy_combat_unit_in_range_3(_unit,_position,_radius){
		const _player_id=_unit._player_id;
		const _rs=this.get_enemy_combat_unit_in_range_2(_player_id,_position,_radius);
		if(_unit._is_enemy||_unit._team_id!=this._game._me._team_id){
			if(_unit._unit!=this._game._me){//truong hop rocket
			const _distance=this._game._me.Position.distanceTo(_unit.Position);
			//console.log("Distance="+_distance);
			if(_distance<_radius)
				_rs.push([this._game._me,_distance]);
			}
		}
		return _rs;
	}
	get_enemy_combat_unit_in_range_2(_player_id,_position,_radius){
		let _rs=new Array();
		for (let i = this._full_unit.length - 1; i >= 0; i--){
			const _unit=this._full_unit[i];
			//if(!_unit._player_id||_unit._player_id===null)
				//continue;
			if(_unit._player_id===_player_id||_unit.Dead)
				continue;
			
			const _distance=_position.distanceTo(_unit.Position);
			if(_distance<_radius){
				_rs.push([_unit,_distance]);
			}
		}
		return _rs;
	}
	
	get_enemy_combat_unit_in_range_4(_unit1,_position,_radius){
		let _rs=new Array();
		for (let i = this._full_unit.length - 1; i >= 0; i--){
			const _unit=this._full_unit[i];
			if(_unit._player_id===_unit1._player_id||_unit.Dead)
				continue;
			
			const _distance=_position.distanceTo(_unit.Position);
			if(_distance<_radius){
				_rs.push([_unit,_distance]);
			}
		}
		/*
		if(_unit1._is_enemy){
			const _distance=this._game._me.Position.distanceTo(_unit1.Position);
			if(_distance<_radius)
				_rs.push([this._game._me,_distance]);
		}
		*/
		if(_unit1._is_enemy||_unit1._team_id!=this._game._me._team_id){
			if(_unit1._unit!=this._game._me){//truong hop rocket
			const _distance=this._game._me.Position.distanceTo(_unit1.Position);
			if(_distance<_radius)
				_rs.push([this._game._me,_distance]);
			}
		}
		return _rs;
	}
	get_units_in_range(_position,_radius){//trả về các unit nằm trong bán kính, bao gom ca player ship
		let _rs=new Array();
		for (let i = this._full_unit.length - 1; i >= 0; i--){
			const _unit=this._full_unit[i];
			//if(_unit._is_enemy===false||_unit._player_id===this._game._playerID||_unit.Dead)
				//continue;
			
			const _distance=_position.distanceTo(_unit.Position);
			if(_distance<_radius){
				_rs.push([_unit,_distance]);
			}
		}
		
		const _distance1=this._game._me.Position.distanceTo(_position);
			//console.log("Distance="+_distance1);
			if(_distance1<_radius)
				_rs.push([this._game._me,_distance1]);
			
		return _rs;
	}
	get_enemy_combat_unit_in_range(_position,_radius){//trả về các unit nằm trong bán kính
	
		let _rs=new Array();
		for (let i = this._full_unit.length - 1; i >= 0; i--){
			const _unit=this._full_unit[i];
			if(_unit._is_enemy===false||_unit._player_id===this._game._playerID||_unit.Dead)
				continue;
			
			const _distance=_position.distanceTo(_unit.Position);
			if(_distance<_radius){
				_rs.push([_unit,_distance]);
			}
		}
		return _rs;
	
	}
	
	
	remove_all_enemy_combat_unit(){
		for (let i = this._combat_unit_list.length - 1; i >= 0; i--){
            let _unit=this._combat_unit_list[i];
            _unit.SelfDestroy();
        }
		
		this._combat_unit_list=new Array();
	}
	
	remove_unit(_unit){
		
		  for (let i = this._combat_unit_list.length - 1; i >= 0; i--){
            let _tunit=this._combat_unit_list[i];
            if(_tunit===_unit){
                this._combat_unit_list.splice(i,1);
                
            }
        }
		//alert("REMOVE");
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
	
	//------------------------------------------------------
	create_missile_1(_ship,position,_is_enemy){
		let gltf=this._data_list["missile-1"];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(3.5);
		model.rotation.z=Math.PI;
		let _UnitClass=Missile1;
		return [this.create_uncombat_unit(_UnitClass,model,position,_is_enemy)];
	}
	create_missile_2(_ship,position,_is_enemy){
		let gltf=this._data_list["missile-1"];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(3.5);
		model.rotation.z=Math.PI;
		let _UnitClass=Missile2;
		return [this.create_uncombat_unit(_UnitClass,model,position,_is_enemy)];
	}
	create_missile_3(_ship,position,_is_enemy){//ban' 1 luc 2 qua ten lua
		let _rs=new Array();
		let _pos=[
			_ship.getLeftPos(3),
			_ship.getRightPos(3),
		];
		for(let i=0;i<_pos.length;i++){
			let gltf=this._data_list["missile-1"];
			const model = gltf.scene.children[0].clone();
			model.scale.setScalar(3.5);
			model.rotation.z=Math.PI;
			let _UnitClass=Missile3;
			let _missile=this.create_uncombat_unit(_UnitClass,model,_pos[i],_is_enemy);
			//_missile._target_id=i;//dung de cho 3 qua ten lua duoi theo 3 muc tieu khac nhau
			//_missile._lock_missile=false;
			
			_rs.push(_missile);
		}
		return _rs;
	
	}
	create_missile_4(_ship,position,_is_enemy){
		let gltf=this._data_list["missile-1"];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(3.5);
		model.rotation.z=Math.PI;
		let _UnitClass=Missile4;
		return [this.create_uncombat_unit(_UnitClass,model,position,_is_enemy)];
	}
	create_missile_5(_ship,position,_is_enemy){
		let gltf=this._data_list["missile-1"];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(3.5);
		model.rotation.z=Math.PI;
		let _UnitClass=Missile5;
		return [this.create_uncombat_unit(_UnitClass,model,position,_is_enemy)];
	}
	create_missile_6(_ship,position,_is_enemy){
		let gltf=this._data_list["missile-1"];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(3.5);
		model.rotation.z=Math.PI;
		let _UnitClass=Missile6;
		return [this.create_uncombat_unit(_UnitClass,model,position,_is_enemy)];
	}
	create_missile_7(_ship,position,_is_enemy){
		let gltf=this._data_list["missile-1"];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(3.5);
		model.rotation.z=Math.PI;
		let _UnitClass=Missile7;
		return [this.create_uncombat_unit(_UnitClass,model,position,_is_enemy)];
	}
	create_missile_8(_ship,position,_is_enemy){
		let gltf=this._data_list["missile-1"];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(3.5);
		model.rotation.z=Math.PI;
		let _UnitClass=Missile8;
		return [this.create_uncombat_unit(_UnitClass,model,position,_is_enemy)];
	}
	create_cruise_missile_1(position){//tên lửa hành trình (damage lớn+tầm xa)
		let gltf=this._data_list["missile-2"];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(7);
		model.rotation.y=Math.PI/2;
		const _group=new THREE.Group();
		_group.add(model);
		_group.rotation.y=-Math.PI/2;
		
		let _UnitClass=CruiseMissile1;
		return this.create_uncombat_unit(_UnitClass,_group,position,true);
	}
	create_cruise_missile_2(position){//tên lửa hành trình (damage lớn+tầm xa)(cua enemy trong mission2)
		let gltf=this._data_list["missile-1"];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(14);
		model.rotation.y=Math.PI;
		//model.rotation.z=-Math.PI;
		//const _group=new THREE.Group();
		//_group.add(model);
		//_group.rotation.y=-Math.PI/2;
		
		let _UnitClass=CruiseMissile1;
		return this.create_combat_unit(_UnitClass,model,position,true);
	}
	//-------------------------------------------------------
	create_exploration_ship_1(position){
		
		let gltf=this._data_list["spaceship-8"];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(4);
		let _UnitClass=ExplorationShip1;
		return this.create_uncombat_unit(_UnitClass,model,position,false);
		
	}
	
	create_navigation_ship_1(position){
		
		let gltf=this._data_list["spaceship-8"];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(4);
		let _UnitClass=NavigationShip1;
		return this.create_uncombat_unit(_UnitClass,model,position,false);
		
	}
	
	//----------------------------------------------------
	
	create_player_ship_1(position,target_object){
		
		const _rs=_my_game_unit_mg.create_player_ship_model_1();
		const gltf=_rs[0];
		const model=_rs[1];
		let _UnitClass=PlayerShip1;
		let _unit= _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);
		if(target_object!=null)
			_unit._target_object=target_object;
		else
			_unit._target_object=_my_game_unit_mg._game._me;
		return _unit;
	}
	create_player_ship_2(position,target_object){
		
		const _rs=_my_game_unit_mg.create_player_ship_model_2();
		const gltf=_rs[0];
		const model=_rs[1];
		let _UnitClass=PlayerShip2;
		let _unit= _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);
		if(target_object!=null)
			_unit._target_object=target_object;
		else
			_unit._target_object=_my_game_unit_mg._game._me;
		return _unit;
	}
	create_player_ship_3(position,target_object){
		
		const _rs=_my_game_unit_mg.create_player_ship_model_3();
		const gltf=_rs[0];
		const model=_rs[1];
		let _UnitClass=PlayerShip3;
		let _unit= _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);
		if(target_object!=null)
			_unit._target_object=target_object;
		else
			_unit._target_object=_my_game_unit_mg._game._me;
		return _unit;
	}
	create_player_ship_4(position,target_object){
		
		const _rs=_my_game_unit_mg.create_player_ship_model_4();
		const gltf=_rs[0];
		const model=_rs[1];
		let _UnitClass=PlayerShip4;
		let _unit= _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);
		if(target_object!=null)
			_unit._target_object=target_object;
		else
			_unit._target_object=_my_game_unit_mg._game._me;
		return _unit;
	}
	create_player_ship_5(position,target_object){
		
		const _rs=_my_game_unit_mg.create_player_ship_model_5();
		const gltf=_rs[0];
		const model=_rs[1];
		let _UnitClass=PlayerShip5;
		let _unit= _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);
		if(target_object!=null)
			_unit._target_object=target_object;
		else
			_unit._target_object=_my_game_unit_mg._game._me;
		return _unit;
	}
	//-----------------------------------------------------
	
	//xwing with gray color
	//đối phương có đường bay xu hướng lao vào chính giữa tâm bắn của player
	create_enemy_combat_ship_level_1_style_1(position,target_object){
		
		let gltf=_my_game_unit_mg._data_list["spaceship-11"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.5);
		let _UnitClass=SpaceShip1;
		let _unit= _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);
		if(target_object!=null)
			_unit._target_object=target_object;
		else
			_unit._target_object=_my_game_unit_mg._game._me;
		return _unit;
	}
	
	//định cho bay song song với player mà ko như ý muốn, nhưng có vẻ dùng được
	create_enemy_combat_ship_level_1_style_2(position,target_object){
		let gltf=_my_game_unit_mg._data_list["spaceship-4"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.05);
		let _UnitClass=SpaceShip4;
		let _unit= _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);
		if(target_object!=null)
			_unit._target_object=target_object;
		else
			_unit._target_object=_my_game_unit_mg._game._me;
		return _unit;
	}
	
	
	//xwing with orange color
	//đối phương có đường bay xu hướng lao vào chính giữa tâm bắn của player
	create_enemy_combat_ship_level_2_style_1(position,target_object){
		let gltf=_my_game_unit_mg._data_list["spaceship-11"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.22);
		model.rotation.y=Math.PI;
		model.rotation.z=Math.PI;
		let _UnitClass=SpaceShip2;
		let _unit= _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);
		if(target_object!=null)
			_unit._target_object=target_object;
		else
			_unit._target_object=_my_game_unit_mg._game._me;
		return _unit;
	}
	//đối phương có đường bay xu hướng lao vào chính giữa tâm bắn của player
	create_enemy_combat_ship_level_3_style_1(position,target_object){
		let gltf=_my_game_unit_mg._data_list["spaceship-3"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(1.5);
		model.rotation.y=Math.PI;
		model.rotation.z=Math.PI/2;
		let _UnitClass=SpaceShip3;
		let _unit= _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);
		if(target_object!=null)
			_unit._target_object=target_object;
		else
			_unit._target_object=_my_game_unit_mg._game._me;
		return _unit;
	}
	
	//đối phương quay tròn xung quanh player ship theo truc oy
	create_enemy_combat_ship_level_3_style_3(position,target_object){
		let gltf=_my_game_unit_mg._data_list["spaceship-5"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.001);
		let _UnitClass=SpaceShip5;
		let _unit= _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);
		if(target_object!=null)
			_unit._target_object=target_object;
		else
			_unit._target_object=_my_game_unit_mg._game._me;
		return _unit;
	}
	//đối phương quay tròn xung quanh player ship theo 2 truc oy va ox
	create_enemy_combat_ship_level_3_style_4(position,target_object){
		let gltf=_my_game_unit_mg._data_list["spaceship-6"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(3);
		let _UnitClass=SpaceShip6;
		let _unit= _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);
		if(target_object!=null)
			_unit._target_object=target_object;
		else
			_unit._target_object=_my_game_unit_mg._game._me;
		return _unit;
	}
	//đối phương quay tròn xung quanh player ship theo 2 truc oy va ox
	create_enemy_combat_ship_level_3_style_5(position,target_object){
		let gltf=_my_game_unit_mg._data_list["spaceship-7"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(4);
		let _UnitClass=SpaceShip7;
		let _unit= _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);
		if(target_object!=null)
			_unit._target_object=target_object;
		else
			_unit._target_object=_my_game_unit_mg._game._me;
		return _unit;
	}
	//-----------------------------------------------------------
	
	
	
	//xuat hien khi lam nhiem vu(mission)
	create_enemy_transport_ship_1(position){
		let gltf=_my_game_unit_mg._data_list["spaceship-27"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(1.5);
		model.rotation.z=Math.PI/2;
		model.rotation.y=Math.PI;
		let _UnitClass=TransportShip1;
		return _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);
	}
	
	
	/*
	create_enemy_spaceship_2(position){
		let gltf=this._data_list["spaceship-11"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.22);
		model.rotation.y=Math.PI;
		model.rotation.z=Math.PI;
		let _UnitClass=SpaceShip2;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	*/
	/*
	create_enemy_spaceship_3(position){
		let gltf=this._data_list["spaceship-3"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(1.5);
		model.rotation.y=Math.PI;
		model.rotation.z=Math.PI/2;
		let _UnitClass=SpaceShip3;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	*/
	/*
	create_enemy_spaceship_4(position){
		let gltf=this._data_list["spaceship-4"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.1);
		let _UnitClass=SpaceShip4;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	*/
	/*
	create_enemy_spaceship_5(position){
		let gltf=this._data_list["spaceship-5"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.003);
		let _UnitClass=SpaceShip5;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	*/
	/*
	create_enemy_spaceship_6(position){
		let gltf=this._data_list["spaceship-6"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(3);
		let _UnitClass=SpaceShip6;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	*/
	/*
	create_enemy_spaceship_7(position){
		let gltf=this._data_list["spaceship-7"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(4);
		let _UnitClass=SpaceShip7;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	*/
	/*
	create_enemy_spaceship_8(position){
		let gltf=this._data_list["spaceship-8"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(6);
		let _UnitClass=SpaceShip8;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	*/
	create_enemy_spaceship_9(position){//Co the dung lam player ship
		let gltf=this._data_list["spaceship-9"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(2);
		model.rotation.z=Math.PI/2;
		let _UnitClass=SpaceShip9;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	create_enemy_spaceship_10(position){//co the dung lam player ship
		let gltf=this._data_list["spaceship-10"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(1.5);
		model.rotation.z=-Math.PI/2;
		let _UnitClass=SpaceShip10;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	create_enemy_spaceship_11(position){// chibi low poly
		let gltf=this._data_list["spaceship-2"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(1.5);
		model.rotation.z=Math.PI/2;
		let _UnitClass=SpaceShip11;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	create_enemy_spaceship_12(position){//low poly
		let gltf=this._data_list["spaceship-12"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(40);
		model.rotation.z=Math.PI/2;
		let _UnitClass=SpaceShip12;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	create_enemy_spaceship_13(position){//low poly
		let gltf=this._data_list["spaceship-13"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.4);
		let _UnitClass=SpaceShip13;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	create_enemy_spaceship_14(position){//low poly, co the lam player ship
		let gltf=this._data_list["spaceship-14"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.7);
		model.rotation.z=Math.PI;
		let _UnitClass=SpaceShip14;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	create_enemy_spaceship_15(position){//low poly, co the lam player ship
		let gltf=this._data_list["spaceship-15"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(35);
		model.rotation.z=Math.PI;
		let _UnitClass=SpaceShip15;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	create_enemy_spaceship_16(position){//low poly
		let gltf=this._data_list["spaceship-16"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.06);
		model.rotation.z=Math.PI;
		let _UnitClass=SpaceShip16;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	create_enemy_spaceship_17(position){//low poly
		let gltf=this._data_list["spaceship-17"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.5);
		model.rotation.z=Math.PI;
		let _UnitClass=SpaceShip17;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	create_enemy_spaceship_18(position){//low poly, co the lam player ship
		let gltf=this._data_list["spaceship-18"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.2);
		model.rotation.z=Math.PI;
		let _UnitClass=SpaceShip18;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	create_enemy_spaceship_19(position){//low poly
		let gltf=this._data_list["spaceship-19"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.015);
		model.rotation.z=Math.PI;
		let _UnitClass=SpaceShip19;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	create_enemy_spaceship_20(position){
		let gltf=this._data_list["spaceship-20"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.5);
		model.rotation.z=Math.PI;
		let _UnitClass=SpaceShip20;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	create_enemy_spaceship_21(position){
		let gltf=this._data_list["spaceship-21"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(2.5);
		//model.rotation.z=Math.PI;
		let _UnitClass=SpaceShip21;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	create_enemy_spaceship_22(position){//co the la player ship
		let gltf=this._data_list["spaceship-22"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.004);
		//model.rotation.z=Math.PI;
		let _UnitClass=SpaceShip22;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	create_enemy_spaceship_23(position){//
		let gltf=this._data_list["spaceship-23"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.4);
		//model.rotation.z=Math.PI;
		let _UnitClass=SpaceShip23;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	create_enemy_spaceship_24(position){//co the lam player ship
		let gltf=this._data_list["spaceship-24"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.7);
	  model.rotation.x=Math.PI*3/4;
	  model.rotation.y=Math.PI;
		let _UnitClass=SpaceShip24;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	create_enemy_spaceship_25(position){//black cannon
		let gltf=this._data_list["spaceship-25"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(1);
	  model.rotation.z=Math.PI;
		let _UnitClass=SpaceShip25;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	create_enemy_spaceship_26(position){//
		let gltf=this._data_list["spaceship-26"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.01);
	  model.rotation.z=Math.PI;
		let _UnitClass=SpaceShip26;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	create_enemy_spaceship_27(position){//co the lam player ship
		let gltf=this._data_list["spaceship-27"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.5);
	  model.rotation.z=Math.PI/2;
	  model.rotation.y=Math.PI;
		let _UnitClass=SpaceShip27;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	create_enemy_spaceship_28(position){//co the lam player ship
		let gltf=this._data_list["spaceship-28"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.5);
	  model.rotation.z=Math.PI;
		let _UnitClass=SpaceShip27;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	create_enemy_spaceship_29(position){//co the lam player ship(rat nhe)
		let gltf=this._data_list["spaceship-29"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(1.5);
	  model.rotation.z=Math.PI;
		let _UnitClass=SpaceShip27;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	create_enemy_spaceship_30(position){//co the lam player ship(rat nhe)
		let gltf=this._data_list["spaceship-30"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(1.5);
	  model.rotation.z=Math.PI;
		let _UnitClass=SpaceShip27;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	create_enemy_spaceship_31(position){//
		let gltf=this._data_list["spaceship-31"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(2.5);
	  model.rotation.z=Math.PI;
		let _UnitClass=SpaceShip27;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	create_enemy_spaceship_32(position){//Hinh quai vat
		let gltf=this._data_list["spaceship-32"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.5);
	  model.rotation.z=-Math.PI/2;
		let _UnitClass=SpaceShip27;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	create_enemy_spaceship_33(position){//Mau den
		let gltf=this._data_list["spaceship-33"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(1.5);
	  model.rotation.z=Math.PI;
		let _UnitClass=SpaceShip27;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	create_enemy_spaceship_34(position){//Chibi
		let gltf=this._data_list["spaceship-34"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.005);
	  model.position.z=Math.PI;
		let _UnitClass=SpaceShip27;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	create_enemy_spaceship_35(position){//
		let gltf=this._data_list["spaceship-35"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(1.5);
	  model.rotation.z=Math.PI;
		let _UnitClass=SpaceShip27;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	create_enemy_spaceship_36(position){//Mau den
		let gltf=this._data_list["spaceship-36"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(50);
	  model.rotation.z=Math.PI;
		let _UnitClass=SpaceShip27;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	create_enemy_spaceship_37(position){//co the lam player ship
		let gltf=this._data_list["spaceship-37"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(3.5);
	  model.rotation.z=Math.PI/2;
		let _UnitClass=SpaceShip27;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	
	create_enemy_spaceship_38(position){//co the lam player ship
		let gltf=this._data_list["spaceship-38"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.1);
	  model.rotation.z=Math.PI;
		let _UnitClass=SpaceShip27;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	
	create_enemy_spaceship_39(position){//co the lam player ship
		let gltf=this._data_list["spaceship-39"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.1);
	  model.rotation.z=Math.PI;
		let _UnitClass=SpaceShip27;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	
	create_enemy_spaceship_40(position){//co the lam player ship
		let gltf=this._data_list["spaceship-40"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(5);
	  model.rotation.z=Math.PI;
		let _UnitClass=SpaceShip27;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	
	create_enemy_spaceship_41(position){//
		let gltf=this._data_list["spaceship-41"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.004);
	  model.rotation.z=Math.PI/2;
		let _UnitClass=SpaceShip27;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	
	create_enemy_spaceship_42(position){//co the lam player ship
		let gltf=this._data_list["spaceship-42"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.005);
	  model.rotation.z=Math.PI/2;
		let _UnitClass=SpaceShip27;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	create_enemy_spaceship_43(position){//co the lam player ship
		let gltf=this._data_list["spaceship-43"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.2);
	  model.rotation.z=Math.PI;
		let _UnitClass=SpaceShip27;
		return this.create_combat_unit(_UnitClass,model,position,true);
	}
	
	create_enemy_spaceship_44(position){//co the lam player ship
		let gltf=this._data_list["spaceship-44"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(4);
	  model.rotation.z=-Math.PI/2;
		let _UnitClass=SpaceShip27;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	
	create_enemy_spaceship_45(position){//co the lam player ship
		let gltf=this._data_list["spaceship-45"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.7);
		let _UnitClass=SpaceShip27;
		return this.create_combat_unit(_UnitClass,model,position);
	}
	//---------------------------------------
	
	create_satellite_1(position){
		let gltf=this._data_list["satellite-1"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(30);
		let _UnitClass=Satellite1;
		return this.create_uncombat_unit(_UnitClass,model,position,false);
	}
	//----------------------------------------------
	create_unit_2(_UnitClass,model,position,_is_combat,_is_enemy){
		let _id=this.get_next_id();
		let _group = new THREE.Group();
		_group.add(model.clone());
        //this._game._graphics.Scene.add(_group);
		_group.position.copy(position);
		/*
		let _camera=this._game._graphics.Camera.clone();
	    
	    _camera.position.copy(_group.position);
	  */
		  this._game._entities['combat-unit-'+_id] = new _UnitClass(
          {model: _group, camera: null, game: this._game,id:_id});
		  
		  if(_is_combat===true){
			  //this._game._entities['combat-unit-'+_id].init_blaster_and_direction();
			  this._combat_unit_list.push(this._game._entities['combat-unit-'+_id]);
		  }
		  
		  
		  let _unit=this._game._entities['combat-unit-'+_id];
		  _unit._is_enemy=_is_enemy;
		  
		  
		  this._full_unit.push(_unit);
		  
		  if(this.after_create_enemy_combat_unit_fc_1)
				this.after_create_enemy_combat_unit_fc_1(_unit);
		  if(this.after_create_enemy_combat_unit_fc_2)
				this.after_create_enemy_combat_unit_fc_2(_unit);
		  		
		  return _unit;
	}
	//---------------------------------------
	
	create_unit(_UnitClass,model,position,_is_combat,_is_enemy,_params1){
		let _id=this.get_next_id();
		let _group = new THREE.Group();
		_group.add(model.clone());
        //this._game._graphics.Scene.add(_group);
		
		let _camera=this._game._graphics.Camera.clone();
	    _group.position.copy(position);
	    _camera.position.copy(_group.position);
	     const _params2={model: _group, camera: _camera, game: this._game,id:_id};
		 let _new_params;
		 if(_params1)
			 _new_params= Object.assign({}, _params1, _params2);//gop 2 map lai voi nhau
		 else
			 _new_params=_params2;
		 
		  this._game._entities['combat-unit-'+_id] = new _UnitClass(_new_params);
		  
		  if(_is_combat===true){
			  this._game._entities['combat-unit-'+_id].init_blaster_and_direction();
			  this._combat_unit_list.push(this._game._entities['combat-unit-'+_id]);
		  }
		  
		  
		  let _unit=this._game._entities['combat-unit-'+_id];
		  _unit._is_enemy=_is_enemy;
		  
		  
		  this._full_unit.push(_unit);
		  
		  if(this.after_create_enemy_combat_unit_fc_1)
				this.after_create_enemy_combat_unit_fc_1(_unit);
		  if(this.after_create_enemy_combat_unit_fc_2)
				this.after_create_enemy_combat_unit_fc_2(_unit);
		  		
		  return _unit;
	}
	create_combat_unit(_UnitClass,model,position,is_enemy,params){
		return this.create_unit(_UnitClass,model,position,true,is_enemy,params);
	}
	create_uncombat_unit(_UnitClass,model,position,is_enemy,params){
		return this.create_unit(_UnitClass,model,position,false,is_enemy,params);
	}
	
	create_space_station(model_id,scale,position){
		//try{
		let _id=this.get_next_id();
		
		let gltf=this._data_list["space-station-"+model_id];
		const model = gltf.scene.children[0];
		model.scale.setScalar(scale);

		const _group = new THREE.Group();
		_group.add(model.clone());

		this._game._graphics.Scene.add(_group);
		_group.position.copy(position);
		
		this._game._entities['space-station-'+_id]=new SpaceStation({model: _group, game: this._game});
		this._building_unit_list.push(this._game._entities['space-station-'+_id]);
		//}catch(e){alert(e.toString());}
	};
	
	
	create_base_guard_ship_1(position){
		let gltf=this._data_list["spaceship-5"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.001);
		let _UnitClass=SpaceCannon1;
		return this.create_combat_unit(_UnitClass,model,position,true);
	}
	
	/*
	createSimpleLaserShip(position){
		let gltf=_my_game_unit_mg._data_list["spaceship-20"];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(16);
		//model.rotation.z=Math.PI;
		//model.rotation.y=Math.PI/2;
		//model.position.x-=2;
		
		let _UnitClass=SimpleLaserShip;
		let _unit= _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);
		
		//const geometry = new THREE.SphereGeometry( 3, 32, 16 ); 
		//const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
		//const sphere = new THREE.Mesh( geometry, material ); 
		//_unit._model.add(sphere);
		
		return _unit;
	}
	*/
	/*
	createSimpleLaserShip(position){
		let gltf=_my_game_unit_mg._data_list["spaceship-19"];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(120);
		model.rotation.z=Math.PI;
		//model.rotation.y=Math.PI/2;
		//model.position.x-=2;
		
		let _UnitClass=SimpleLaserShip;
		let _unit= _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);
		
		//const geometry = new THREE.SphereGeometry( 3, 32, 16 ); 
		//const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
		//const sphere = new THREE.Mesh( geometry, material ); 
		//_unit._model.add(sphere);
		
		return _unit;
	}
	*/
	
	createSimpleLaserShip(position){
		let gltf=_my_game_unit_mg._data_list["spaceship-18"];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(0.015);
		model.rotation.z=Math.PI/2;
		//model.rotation.y=Math.PI/2;
		//model.position.x-=2;
		
		let _UnitClass=SimpleLaserShip;
		let _unit= _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);
		
		//const geometry = new THREE.SphereGeometry( 3, 32, 16 ); 
		//const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
		//const sphere = new THREE.Mesh( geometry, material ); 
		//_unit._model.add(sphere);
		
		return _unit;
	}
	
	/*
	createSimpleLaserShip(position){
		let gltf=_my_game_unit_mg._data_list["spaceship-17"];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(2.0);
		model.rotation.z=Math.PI;
		//model.rotation.y=Math.PI/2;
		//model.position.x-=2;
		
		let _UnitClass=SimpleLaserShip;
		let _unit= _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);
		
		//const geometry = new THREE.SphereGeometry( 3, 32, 16 ); 
		//const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
		//const sphere = new THREE.Mesh( geometry, material ); 
		//_unit._model.add(sphere);
		
		return _unit;
	}
	*/
	/*
	createSimpleLaserShip(position){
		let gltf=_my_game_unit_mg._data_list["spaceship-15"];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(4.0);
		model.rotation.z=Math.PI;
		model.rotation.y=Math.PI/2;
		//model.position.x-=2;
		
		let _UnitClass=SimpleLaserShip;
		let _unit= _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);
		
		//const geometry = new THREE.SphereGeometry( 3, 32, 16 ); 
		//const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
		//const sphere = new THREE.Mesh( geometry, material ); 
		//_unit._model.add(sphere);
		
		return _unit;
	}
	*/
	/* HINH NGOI SAO
	createSimpleLaserShip(position){
		let gltf=_my_game_unit_mg._data_list["spaceship-14"];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(1.0);
		//model.rotation.z=Math.PI;
		//model.position.y-=6;
		//model.position.x-=2;
		
		let _UnitClass=SimpleLaserShip;
		let _unit= _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);
		
		//const geometry = new THREE.SphereGeometry( 3, 32, 16 ); 
		//const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
		//const sphere = new THREE.Mesh( geometry, material ); 
		//_unit._model.add(sphere);
		
		return _unit;
	}
	*/
	/*
	createSimpleLaserShip(position){
		let gltf=_my_game_unit_mg._data_list["spaceship-2"];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(1.5);
		model.rotation.z=Math.PI;
		//model.position.y-=6;
		//model.position.x-=2;
		
		let _UnitClass=SimpleLaserShip;
		let _unit= _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);
		
		//const geometry = new THREE.SphereGeometry( 3, 32, 16 ); 
		//const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
		//const sphere = new THREE.Mesh( geometry, material ); 
		//_unit._model.add(sphere);
		
		return _unit;
	}
	*/
	/*
	createSimpleLaserShip(position){
		let gltf=_my_game_unit_mg._data_list["spaceship-11"];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(0.015);
		model.rotation.z=-Math.PI/2;
		model.position.y-=14;
		//model.position.x-=2;
		
		let _UnitClass=SimpleLaserShip;
		let _unit= _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);
		
		//const geometry = new THREE.SphereGeometry( 3, 32, 16 ); 
		//const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
		//const sphere = new THREE.Mesh( geometry, material ); 
		//_unit._model.add(sphere);
		
		return _unit;
	}
	*/
	createSimpleClusterBulletShip(position){
		let gltf=_my_game_unit_mg._data_list["spaceship-11"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.5);
		model.rotation.y=Math.PI;
		model.rotation.z=Math.PI;
		let _ship=_my_game_unit_mg.create_combat_unit(SimpleClusterBulletShip,model,position,true);
		
		return _ship;
	}
	createSimpleMachineGunShip(position){
		let _enemy_ship=_my_game_unit_mg.createSimpleMissileShip(position);
					_enemy_ship._lock_fire=false;
					_enemy_ship._rocket_speed=50;
					_enemy_ship._model.scale.multiplyScalar(1.2);
					_enemy_ship._bound_radius*=40.1;
					
					_enemy_ship._player_id=null;
					_enemy_ship._is_enemy=true;
					
					//_enemy_ship._rocket_package._rockets_infor=this._unitMG.get_all_rockets_infor();//
					_enemy_ship._lock_missile=false;
					
					_enemy_ship.Fire=()=>{
						if(_enemy_ship._lock_fire)return;
						_enemy_ship._lock_fire=true;
						_my_game_unit_mg._game.add_to_timer(()=>{
							_enemy_ship._lock_fire=false;
						},10);
						
						_enemy_ship.apply_rain_of_bullets_skill(_enemy_ship,1,0.5);
					};
		return _enemy_ship;
	}
	createSimplePhotonShip(position,_material){
		let gltf=_my_game_unit_mg._data_list["spaceship-46"];
		//let _new_material=_my_game_unit_mg.get_gradient_material("yellow","green");
		if(_material!=null){
			gltf.scene.traverse((o) => {
				if (o.isMesh) o.material = _material;
			});
		}
		
		const model = gltf.scene.children[0];
		model.scale.setScalar(1.1);
		
		//model cu~:
		//model.scale.setScalar(10);
		//model.rotation.z=Math.PI/2;
		
		let _ship=_my_game_unit_mg.create_combat_unit(SimplePhotonShip,model,position,true);
		_ship._target_object=_my_game_unit_mg._me;
		_ship._bound_radius=70;
			
		return _ship;
	}
	createSimplePhotonShip2(position){
		let gltf=_my_game_unit_mg._data_list["spaceship-8"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(12.0);
		//model.rotation.x=Math.PI/2;
		//model.rotation.y=Math.PI;
		model.rotation.z=Math.PI;
		model.position.y-=0.5;
		let _ship=_my_game_unit_mg.create_combat_unit(SimplePhotonShip2,model,position,true);
		_ship._target_object=_my_game_unit_mg._me;
		_ship._bound_radius=70;
		
		//const geometry = new THREE.SphereGeometry( 3, 32, 16 ); 
		//const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
		//const sphere = new THREE.Mesh( geometry, material ); 
		//_ship._model.add(sphere);
			
		return _ship;
	}
	createSimplePhotonShip2_2(position){
		let gltf=_my_game_unit_mg._data_list["spaceship-54"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.015);
		model.rotation.z=Math.PI;
		let _ship=_my_game_unit_mg.create_combat_unit(SimplePhotonShip2,model,position,true);
		_ship._target_object=_my_game_unit_mg._me;
		_ship._bound_radius=70;
			
		return _ship;
	}
	createSimplePhotonShip3(position){
		let gltf=_my_game_unit_mg._data_list["spaceship-14"];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(0.6);
		
		let _ship=_my_game_unit_mg.create_combat_unit(SimplePhotonShip3,model,position,true);
		_ship._target_object=_my_game_unit_mg._me;
		_ship._bound_radius=70;
			
		return _ship;
	}
	createSimplePhotonShip4(position){
		let gltf=_my_game_unit_mg._data_list["spaceship-15"];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(2.5);
		model.rotation.z=Math.PI;
		model.rotation.y=Math.PI/2;
		
		let _ship=_my_game_unit_mg.create_combat_unit(SimplePhotonShip4,model,position,true);
		_ship._target_object=_my_game_unit_mg._me;
		_ship._bound_radius=70;
			
		return _ship;
	}
	createSimplePhotonShip5(position){
		let gltf=_my_game_unit_mg._data_list["spaceship-3"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(1.0);
		//model.rotation.x=Math.PI/2;
		//model.rotation.y=Math.PI;
		model.rotation.z=Math.PI/2;
		let _ship=_my_game_unit_mg.create_combat_unit(SimplePhotonShip5,model,position,true);
		_ship._target_object=_my_game_unit_mg._me;
		_ship._bound_radius=70;
			
		return _ship;
	}
	createSimplePhotonShip6(position){
		let gltf=_my_game_unit_mg._data_list["spaceship-11"];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(0.015);
		model.rotation.z=-Math.PI/2;
		model.position.y-=14;
		
		let _ship=_my_game_unit_mg.create_combat_unit(SimplePhotonShip5,model,position,true);
		_ship._target_object=_my_game_unit_mg._me;
		_ship._bound_radius=70;
			
		return _ship;
	}
	createSimpleThunderShip(position){
		let gltf=_my_game_unit_mg._data_list["spaceship-4"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.07);
		//model.rotation.x=Math.PI/2;
		//model.rotation.y=Math.PI;
		//model.rotation.z=Math.PI/2;
		let _ship=_my_game_unit_mg.create_combat_unit(SimpleThunderShip,model,position,true);
		_ship._target_object=_my_game_unit_mg._me;
		_ship._bound_radius=140;
			
		return _ship;
	}
	createSimpleEnergyShip(position){
		let gltf=_my_game_unit_mg._data_list["spaceship-2"];
		
		let _new_material=_my_game_unit_mg.get_gradient_material("gray","black");
		//let _new_material=_my_game_unit_mg.get_gradient_material("black","turquoise");
		gltf.scene.traverse((o) => {
			if (o.isMesh) o.material = _new_material;
		});
		
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(1.5);
		model.rotation.z=Math.PI;
		
		const _eunit=_my_game_unit_mg.create_combat_unit(SimpleEnergyShip,model,position,true);	
			  _eunit._player_id=null;
		return _eunit;
	}
	createSimpleRocketShip(position){
		
		let gltf=_my_game_unit_mg._data_list["spaceship-2"];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(1.5);
		model.rotation.z=Math.PI;
		
		const _eunit=_my_game_unit_mg.create_combat_unit(SimpleRocketShip,model,position,true);	
			  _eunit._player_id=null;
		return _eunit;
	}
	createSimpleRocketShip2(position){
		
		let gltf=_my_game_unit_mg._data_list["spaceship-52"];
		const model = gltf.scene.children[0].clone();
		model.scale.setScalar(0.02);
		//model.rotation.z=Math.PI;
		
		const _eunit=_my_game_unit_mg.create_combat_unit(SimpleRocketShip,model,position,true);	
			  _eunit._player_id=null;
		return _eunit;
	}
	createSimpleFireShip(position){
		let gltf=_my_game_unit_mg._data_list["spaceship-12"];
		
		const model = gltf.scene.children[0];
		
		model.rotation.z=-Math.PI/2;
		let _UnitClass=SimpleFireShip;
		return _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);	
	}
	createSimpleIcyShip(position){
		let gltf=_my_game_unit_mg._data_list["spaceship-21"];
		//let _new_material=_my_game_unit_mg.get_gradient_material("black","red");
		//gltf.scene.traverse((o) => {
			//if (o.isMesh) o.material = _new_material;
		//});
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.9);
		
		let _UnitClass=SimpleIcyShip;
		return _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);
	}
	createSimpleVirusShip(position){
		let gltf=_my_game_unit_mg._data_list["spaceship-5"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.001);
		let _UnitClass=SimpleVirusShip;
		return _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);
	}
	
	createSimpleDefenseShip(position){
		let gltf=_my_game_unit_mg._data_list["spaceship-3"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(1.5);
		model.rotation.y=Math.PI;
		model.rotation.z=Math.PI/2;
		let _UnitClass=SimpleDefenseShip;
		return _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);
	}
	
	createSimpleRocketDefenseShip(position){
		let gltf=_my_game_unit_mg._data_list["spaceship-27"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(1.5);
		model.rotation.z=-Math.PI/2;
		model.rotation.y=Math.PI;
		let _UnitClass=SimpleRocketDefenseShip;
		return _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);
	}
	createSimpleAmbulanceShip(position){
		let gltf=_my_game_unit_mg._data_list["spaceship-5"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.001);
		let _UnitClass=SimpleAmbulanceShip;
		return _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);
	}
	
	
	createSimpleMissileShip(position){
		let gltf=_my_game_unit_mg._data_list["spaceship-53"];
		//let _new_material=_my_game_unit_mg.get_gradient_material("black","turquoise");
		//gltf.scene.traverse((o) => {
			//if (o.isMesh) o.material = _new_material;
		//});
		const model = gltf.scene.children[0];
		model.scale.setScalar(2);
		model.rotation.z=Math.PI;
		let _UnitClass=SimpleMissileShip;
		return _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);	
	}
	createSimpleCounterAttackShip(position){
		let gltf=_my_game_unit_mg._data_list["spaceship-5"];
		let _new_material=_my_game_unit_mg.get_gradient_material("black","red");
		gltf.scene.traverse((o) => {
			if (o.isMesh) o.material = _new_material;
		});
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.001);
		let _UnitClass=SimpleCounterAttackShip;
		return _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);
	}
	createSimpleSuicideShip(position){
		let gltf=_my_game_unit_mg._data_list["spaceship-6"];
		let _new_material=_my_game_unit_mg.get_gradient_material("black","white");
		gltf.scene.traverse((o) => {
			if (o.isMesh) o.material = _new_material;
		});
		const model = gltf.scene.children[0];
		model.scale.setScalar(2);
		let _UnitClass=SimpleSuicideShip;
		return _my_game_unit_mg.create_combat_unit(_UnitClass,model,position,true);	
	}
	
	
	create_rocket_ship_type_2(_pos){
		let _enemy_ship=_my_game_unit_mg.createSimpleRocketShip2(_pos);
		_my_game_unit_mg._game._graphics.Scene.add(_enemy_ship._model);
		let _lock_fire=false;
					//_enemy_ship._rocket_speed=50;
					_enemy_ship._bound_radius*=14.1;
		    _enemy_ship._rocket_package._rockets_infor=_my_game_unit_mg.get_all_rockets_infor();
			_enemy_ship.Fire=()=>{
				if(_lock_fire)return;
				_lock_fire=true;
				_my_game_unit_mg._game.add_to_timer(()=>{
					_lock_fire=false;
				},10);
				
				let _launch=()=>{
					let _rockets=_enemy_ship._rocket_package.launch_rocket(1);
					for(let i=0;i<_rockets.length;i++){
						let _rocket=_rockets[i];
						const _dam=_my_game_unit_mg._game._parameters._standard_hp/40;
						_rocket._params.damage=_dam;
						_rocket._damage=_dam;
						_rocket._explodable=false;//ko gay choi' mat'
					}
				};
				
				//_enemy_ship._rocket_package.launch_rocket(1);
				_launch();
				_my_game_unit_mg._game.add_to_timer(()=>{
				//_enemy_ship._rocket_package.launch_rocket(1);
				_launch();
				},1);
				_my_game_unit_mg._game.add_to_timer(()=>{
				//_enemy_ship._rocket_package.launch_rocket(1);
				_launch();
				},2);
				//_my_game_unit_mg._game.add_to_timer(()=>{
				
				//_launch();
				//},3);
				_my_game_unit_mg._game.add_to_timer(()=>{
				//_enemy_ship._rocket_package.launch_rocket(1);
				_launch();
				},4);
			};
			
		return _enemy_ship;
	}
	
	create_photon_ship_type_2(_laser_color,_duration,_pos){
		 let _enemy_ship=this.createSimplePhotonShip2(_pos);
					//_enemy_ship._model.scale.multiplyScalar(0.08);
					_enemy_ship._bound_radius=3.2;
					
					this._game._graphics.Scene.add(_enemy_ship._model);
					
					_enemy_ship._photon_color=_laser_color;
					
		return _enemy_ship;
	}
	create_photon_ship_type_2_2(_laser_color,_duration,_pos){
		 let _enemy_ship=this.createSimplePhotonShip2_2(_pos);
					
					_enemy_ship._bound_radius=3.2;
					
					this._game._graphics.Scene.add(_enemy_ship._model);
					
					_enemy_ship._photon_color=_laser_color;
					
		return _enemy_ship;
	}
	create_photon_ship_type_3(_laser_color,_duration,_pos){
	 let _enemy_ship=this.createSimplePhotonShip3(_pos);
					//_enemy_ship._model.scale.multiplyScalar(0.08);
					_enemy_ship._bound_radius=3.2;
					this._game._graphics.Scene.add(_enemy_ship._model);
					_enemy_ship._photon_color=_laser_color;
	 
	  return _enemy_ship;
   }
   
   create_photon_ship_type_4(_laser_color,_duration,_pos){
	 let _enemy_ship=this.createSimplePhotonShip4(_pos);
					//_enemy_ship._model.scale.multiplyScalar(0.08);
					_enemy_ship._bound_radius=3.2;
					_enemy_ship._photon_color=_laser_color;
					this._game._graphics.Scene.add(_enemy_ship._model);
	 
	  return _enemy_ship;
   }
	
	create_photon_ship_type_5(_laser_color,_duration,_pos){
	  let _enemy_ship=this.createSimplePhotonShip5(_pos);
	  //_enemy_ship._model.scale.multiplyScalar(0.08);
	  _enemy_ship._bound_radius=3.2;
	  //_enemy_ship._player_id=null;
	  this._game._graphics.Scene.add(_enemy_ship._model);
	  //_enemy_ship._target_object=this._me;
	  _enemy_ship._photon_color=_laser_color;
	  _enemy_ship._duration=_duration;
	 
	  return _enemy_ship;
   }
   create_photon_ship_type_6(_laser_color,_duration,_pos){
	  let _enemy_ship=this.createSimplePhotonShip6(_pos);
					
					_enemy_ship._bound_radius=3.2;
	  //_enemy_ship._player_id=null;
	  this._game._graphics.Scene.add(_enemy_ship._model);
	  //_enemy_ship._target_object=this._me;
	  _enemy_ship._photon_color=_laser_color;
	  _enemy_ship._duration=_duration;
	 		
	  return _enemy_ship;
   }
	//------------------------------------------------------------
	/*  DRAFT(chua chac chan')
		laser+photon: kim
		fire+missile+rocket:hoa
		icy:thuy
		suicide:tho
		machine-gun:moc
	*/
	get_full_enemy_ship_infor_1(){
		return [
			{name:"laser1",group_id:3,model_id:"spaceship-18"},
			{name:"photon2.2",group_id:3,model_id:"spaceship-54"},
			
			
			{name:"rocket1",group_id:4,model_id:"spaceship-2"},
			
			{name:"photon2",group_id:3,model_id:"spaceship-8"},
			
			{name:"fire1",group_id:4,model_id:"spaceship-12"},
			
			{name:"rocket2",group_id:4,model_id:"spaceship-52"},
			
			{name:"photon1",group_id:3,model_id:"spaceship-46"},
			{name:"photon4",group_id:3,model_id:"spaceship-15"},
			
			{name:"missile1",group_id:4,model_id:"spaceship-53"},
			{name:"missile2",group_id:4,model_id:"spaceship-53"},
			
			{name:"photon1.2",group_id:3,model_id:"spaceship-46"},
			{name:"photon1.3",group_id:3,model_id:"spaceship-46"},//<===========
			
			{name:"energy1",group_id:4,model_id:"spaceship-2"},
			
			{name:"photon3",group_id:3,model_id:"spaceship-14"},
			
			{name:"photon5",group_id:3,model_id:"spaceship-3"},
			{name:"photon5.2",group_id:3,model_id:"spaceship-3"},
			{name:"photon6",group_id:3,model_id:"spaceship-11"},
			
			
			{name:"icy1",group_id:1,model_id:"spaceship-21"},
			{name:"thunder1",group_id:1,model_id:"spaceship-4"},
			
			{name:"suicide1",group_id:5,model_id:"spaceship-6"},
			
			{name:"machine-gun-1",group_id:2,model_id:"spaceship-53"},
		];
	}
	get_enemy_ship_model_id(_name){
		let _infors=this.get_full_enemy_ship_infor_1();
	 
	  for(let i=0;i<_infors.length;i++){
		  if(_infors[i].name===_name)
			  return _infors[i].model_id;
	  }
	  return null;
	}
	get_enemy_ship_group_id_1(_name){
	  let _infors=this.get_full_enemy_ship_infor_1();
	 
	  for(let i=0;i<_infors.length;i++){
		  if(_infors[i].name===_name)
			  return _infors[i].group_id;
	  }
	  return null;
	}
	get_full_enemy_normal_ship_name_1(){//mouse controlled game
		/*
		return ["laser1","suicide1","fire1","icy1","rocket1","rocket2","missile1","missile2",
	  "machine-gun-1","photon1","photon2","photon2.2","photon3","photon4"
	  ,"photon5","photon5.2","photon6","thunder1"]
	  */
	  /*
	  return ["laser1","photon2","fire1","photon2.2","icy1","rocket1","photon3",
	  "rocket2","suicide1","photon1","missile1","missile2",
	  "machine-gun-1","photon4"
	  ,"photon5","photon5.2","photon6","thunder1"]
	  */
	  let _infors=this.get_full_enemy_ship_infor_1();
	  let _rs=new Array();
	  for(let i=0;i<_infors.length;i++){
		  _rs.push(_infors[i].name);
	  }
	  return _rs;
	}
	get_full_enemy_special_ship_name_1(){//mouse controlled game
		return ["ambulance1","rocket-defense1","rocket-defense2"];
	}
	/*
		$ nhan duoc se tang dan theo thu tu ten cua enemy-ship trong array
	*/
	get_enemy_ship_money_reward_1(_name){//mouse controlled game --- tinh' toan' $ nhan duoc khi tieu diet enemy ship
		let _names_1=this.get_full_enemy_normal_ship_name_1();
		let _names_2=this.get_full_enemy_special_ship_name_1();
		
		const _min=this._game._parameters._standard_reward;
		let _counter=1;
		for(let i=0;i<_names_1.length;i++){
			if(_names_1[i]===_name){
				let _money=_min*_counter;
				return _money;
			}
			_counter+=0.2;//tang len 20 %
		}
		
		
		for(let i=0;i<_names_2.length;i++){
			if(_names_2[i]===_name){
				let _money=_min*_counter;
				return _money;
			}
			_counter+=0.2;//tang len 20 %
		}
		
		return 0;
	}
	/*
		Exp nhan duoc se tang dan theo thu tu ten cua enemy-ship trong array
	*/
	get_enemy_ship_exp_reward_1(_name){//mouse controlled game --- tinh' toan' exp nhan duoc khi tieu diet enemy ship
		let _names_1=this.get_full_enemy_normal_ship_name_1();
		let _names_2=this.get_full_enemy_special_ship_name_1();
		
		const _min=this._game._parameters._standard_exp_2;
		let _counter=1;
		for(let i=0;i<_names_1.length;i++){
			if(_names_1[i]===_name){
				let _exp=_min*_counter;
				return _exp;
			}
			_counter+=0.2;//tang len 20 %
		}
		
		
		for(let i=0;i<_names_2.length;i++){
			if(_names_2[i]===_name){
				let _exp=_min*_counter;
				return _exp;
			}
			_counter+=0.2;//tang len 20 %
		}
		
		return 0;
	}
	//--------------------------------------------------------------
	get_gradient_material(color1,color2){
		var material = new THREE.ShaderMaterial({
			uniforms: {
			color1: {
				value: new THREE.Color(color1)
			},
			color2: {
				value: new THREE.Color(color2)
			}
			},
			vertexShader: `
				varying vec2 vUv;

				void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
				}
			`,
			fragmentShader: `
				uniform vec3 color1;
				uniform vec3 color2;
  
				varying vec2 vUv;
    
				void main() {
      
				gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
				}
			`,
			wireframe: false
			});
		return material;
	}
	
	create_cannon_1(position){
		let gltf=this._data_list["cannon1"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(2);
		let _UnitClass=SpaceCannon1;
		return this.create_combat_unit(_UnitClass,model,position,true);
		
	}
	
	
	create_cannon_2(position){
		
		let gltf=this._data_list["cannon2"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(2);
		let _UnitClass=SpaceCannon1;
		return this.create_combat_unit(_UnitClass,model,position,true);
		/*
		let _id=this.get_next_id();
		
		let gltf=this._data_list["cannon2"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(3);

		const _group = new THREE.Group();
		_group.add(model.clone());

		this._game._graphics.Scene.add(_group);
		_group.position.copy(position);
		
		let _camera=this._game._graphics.Camera.clone();
		
		_camera.position.copy(_group.position);
		
		let _blSystem=this._game._entities['_cannonBlasterSystem'+_id] = new blaster.BlasterSystem(//LASER GUN
		  {
            game: this._game,
			camera:_camera,
            texture: "./resources/blaster.jpg",
            visibility: this._game._visibilityGrid,
          });
		  
		  this._game._entities['_cannon'+_id]=new Cannon({model: _group, camera: _camera, game: this._game,
		  blasterSystem:_blSystem});
		
		this._game._entities['_cannonControls'+_id] = new controls.EnemyShipControls({
			target: this._game._entities['_cannon'+_id],
			camera: _camera,
			scene: this._game._graphics.Scene,
			domElement: this._game._graphics._threejs.domElement,
			gui: this._game._gui,
			guiParams: this._game._guiParams,
			game:this._game,
			visibility: this._game._visibilityGrid
          });
		  
		  //Bat buoc phai lam the nay de kich hoat dieu chinh vi tri camera va huong' cua cannon
		  //Do chua biet lam sao tinh' toan'
		  //Neu bo? doan code nay thi vi tri cua cannon ko biet nam o dau
		  this._game._entities['_cannonControls'+_id]._move.forward = true;
		  //this._entities['_controls2']._move.forward = false;
		  
		  //this._combat_unit_list.push(this._game._entities['_cannon'+_id]);
		  
		  return this._game._entities['_cannon'+_id];
		  */
	}
	
	create_lasergun_1(position,_level){
		return this.create_lasergun(position,_level,false);
	}
	create_lasergun_2(position,_level){
		return this.create_lasergun(position,_level,true);
	}
	create_lasergun(position,_level,_auto_aim){//chi su dung de? gan' len spaceship cua player
		let _id=this.get_next_id();
		
		//let _damage=this._game._parameters._standard_hp/20;
		let _damage=this._game._parameters._lasergun_1_default_dam;
		//let _add_dam=_damage/4;
		let _add_dam=this._game._parameters._lasergun_1_add_dam_rate;
		_damage+=(_level*_add_dam);
		
		let _min_delay=0.03;
		//let _delay=0.5;
		let _delay=this._game._parameters._lasergun_1_default_fire_delay;
		//let _minus_dam=0.005;
		let _minus_delay=this._game._parameters._lasergun_1_add_fire_rate;
		_delay-=((_level-1)*_minus_delay);
		if(_delay<_min_delay)_delay=_min_delay;
		
		//alert(_delay);
		//alert("Infor:"+_level+" and "+_damage);
		const _model_id=this._game._parameters.get_auxiliary_model_id(1);
		let gltf=this._data_list[_model_id];
		const model = gltf.scene.children[0];
		model.scale.setScalar(3);
		model.rotation.x=Math.PI/2;

		const _group = new THREE.Group();
		_group.add(model.clone());

		//this._game._graphics.Scene.add(_group);
		_group.position.copy(position);
		
		let _camera=this._game._graphics.Camera.clone();
		
		_camera.position.copy(_group.position);
		
		let _blSystem=this._game._entities['_cannonBlasterSystem'+_id] = new blaster.BlasterSystem(//LASER GUN
		  {
            game: this._game,
			camera:_camera,
            texture: "./resources/blaster.jpg",
            visibility: this._game._visibilityGrid,
			damage:_damage,
			affect_player:false
          });
		  //alert(this._game.me);
		  this._game._entities['_cannon'+_id]=new LaserGun1({model: _group, camera: _camera, game: this._game,
		  blasterSystem:_blSystem,parent_unit:this._game._entities['player'],radius:1,auto_aim:_auto_aim});
		
		this._game._entities['_cannonControls'+_id] = new controls.EnemyShipControls({
			target: this._game._entities['_cannon'+_id],
			camera: _camera,
			scene: this._game._graphics.Scene,
			domElement: this._game._graphics._threejs.domElement,
			gui: this._game._gui,
			guiParams: this._game._guiParams,
			game:this._game,
			visibility: this._game._visibilityGrid
          });
		  
		  //Bat buoc phai lam the nay de kich hoat dieu chinh vi tri camera va huong' cua cannon
		  //Do chua biet lam sao tinh' toan'
		  //Neu bo? doan code nay thi vi tri cua cannon ko biet nam o dau
		  this._game._entities['_cannonControls'+_id]._move.forward = true;
		  //this._entities['_controls2']._move.forward = false;
		  
		  //this._combat_unit_list.push(this._game._entities['_cannon'+_id]);
		  
		   this._game._entities['_cannon'+_id]._params.shoot_delay=_delay;
		  this._game._entities['_cannon'+_id]._shoot_delay=_delay;
		  
		  return this._game._entities['_cannon'+_id];
		  
	}
	create_lasergun_3(position,_level){//chi su dung de? gan' len spaceship cua player
		let _id=this.get_next_id();
		
		let _damage=this._game._parameters._standard_hp/30;
		let _add_dam=_damage/5;
		_damage+=(_level*_add_dam);
		
		let _min_delay=0.01;
		let _delay=0.5;
		let _minus_dam=0.0005;
		_delay-=(_level*_minus_dam);
		
		let gltf=this._data_list["lasergun-1"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(3);

		const _group = new THREE.Group();
		_group.add(model.clone());

		//this._game._graphics.Scene.add(_group);
		_group.position.copy(position);
		
		let _camera=this._game._graphics.Camera.clone();
		
		_camera.position.copy(_group.position);
		
		let _blSystem=this._game._entities['_cannonBlasterSystem'+_id] = new blaster.BlasterSystem(//LASER GUN
		  {
            game: this._game,
			camera:_camera,
            texture: "./resources/blaster.jpg",
            visibility: this._game._visibilityGrid,
			damage:_damage,
			affect_player:false
          });
		  
		  this._game._entities['_cannon'+_id]=new LaserGun2({model: _group, camera: _camera, game: this._game,
		  blasterSystem:_blSystem});
		
		this._game._entities['_cannonControls'+_id] = new controls.EnemyShipControls({
			target: this._game._entities['_cannon'+_id],
			camera: _camera,
			scene: this._game._graphics.Scene,
			domElement: this._game._graphics._threejs.domElement,
			gui: this._game._gui,
			guiParams: this._game._guiParams,
			game:this._game,
			visibility: this._game._visibilityGrid
          });
		  
		  //Bat buoc phai lam the nay de kich hoat dieu chinh vi tri camera va huong' cua cannon
		  //Do chua biet lam sao tinh' toan'
		  //Neu bo? doan code nay thi vi tri cua cannon ko biet nam o dau
		  this._game._entities['_cannonControls'+_id]._move.forward = true;
		  //this._entities['_controls2']._move.forward = false;
		  
		  //this._combat_unit_list.push(this._game._entities['_cannon'+_id]);
		  
		   this._game._entities['_cannon'+_id]._params.shoot_delay=_delay;
		  this._game._entities['_cannon'+_id]._shoot_delay=_delay;
		  
		  return this._game._entities['_cannon'+_id];
		  
	}
	create_plasmagun_1(position,_level){
		return this.create_plasmagun(position,_level,false);
	}
	create_plasmagun_2(position,_level){
		return this.create_plasmagun(position,_level,true);
	}
	create_plasmagun(position,_level,_auto_aim){//chi su dung de? gan' len spaceship cua player
		let _id=this.get_next_id();
		
		//let _damage=this._game._parameters._standard_hp/20;
		let _damage=this._game._parameters._plasmagun_1_default_dam;
		//let _add_dam=_damage/4;
		let _add_dam=this._game._parameters._plasmagun_1_add_dam_rate;
		_damage+=(_level*_add_dam);
		
		let _min_delay=0.01;
		//let _delay=0.5;
		let _delay=this._game._parameters._plasmagun_1_default_fire_delay;
		//let _minus_dam=0.005;
		let _minus_delay=this._game._parameters._plasmagun_1_add_fire_rate;
		_delay-=((_level-1)*_minus_delay);
		if(_delay<_min_delay)_delay=_min_delay;
		//alert(this._game._parameters._plasmagun_1_add_fire_rate);
		//alert(_delay);
		const _model_id=this._game._parameters.get_auxiliary_model_id(4);
		let gltf=this._data_list[_model_id];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.3);

		const _group = new THREE.Group();
		_group.add(model.clone());

		//this._game._graphics.Scene.add(_group);
		_group.position.copy(position);
		
		let _camera=this._game._graphics.Camera.clone();
		
		_camera.position.copy(_group.position);
		
		let _blSystem=this._game._entities['_cannonBlasterSystem'+_id] = new blaster.BlasterSystem(//LASER GUN
		  {
            game: this._game,
			camera:_camera,
            texture: "./resources/blaster.jpg",
            visibility: this._game._visibilityGrid,
			damage:_damage,
			affect_player:false
          });
		  
		  this._game._entities['_cannon'+_id]=new PlasmaGun1({model: _group, camera: _camera, game: this._game,
		  blasterSystem:_blSystem,parent_unit:this._game._entities['player'],radius:1,auto_aim:_auto_aim});
		
		this._game._entities['_cannonControls'+_id] = new controls.EnemyShipControls({
			target: this._game._entities['_cannon'+_id],
			camera: _camera,
			scene: this._game._graphics.Scene,
			domElement: this._game._graphics._threejs.domElement,
			gui: this._game._gui,
			guiParams: this._game._guiParams,
			game:this._game,
			visibility: this._game._visibilityGrid
          });
		  
		  //Bat buoc phai lam the nay de kich hoat dieu chinh vi tri camera va huong' cua cannon
		  //Do chua biet lam sao tinh' toan'
		  //Neu bo? doan code nay thi vi tri cua cannon ko biet nam o dau
		  this._game._entities['_cannonControls'+_id]._move.forward = true;
		  //this._entities['_controls2']._move.forward = false;
		  
		  //this._combat_unit_list.push(this._game._entities['_cannon'+_id]);
		  
		   this._game._entities['_cannon'+_id]._params.shoot_delay=_delay;
		  this._game._entities['_cannon'+_id]._shoot_delay=_delay;
		  
		  return this._game._entities['_cannon'+_id];
		  
	}
	
	create_rocket_gun_1(position,_level){
		return this.create_rocket_gun(position,_level,false);
	}
	create_rocket_gun_2(position,_level){
		return this.create_rocket_gun(position,_level,true);
	}
	create_rocket_gun(position,_level,_auto_aim){
		let _id=this.get_next_id();
		
		let _damage=this._game._parameters._rocketgun_1_default_dam;
		let _add_dam=this._game._parameters._rocketgun_1_add_dam_rate;
		_damage+=(_level*_add_dam);//damage nay ko su dung ma su dung ben trong class RocketGun+Rocket2
		
		let _min_delay=1.5;
		let _delay=this._game._parameters._rocketgun_1_default_fire_delay;
		let _minus_delay=this._game._parameters._rocketgun_1_add_fire_rate;
		_delay-=((_level-1)*_minus_delay);
		if(_delay<_min_delay)_delay=_min_delay;
		//alert(_delay);alert(_damage);
		/*
		let _damage=this._game._parameters._standard_hp/20;
		let _add_dam=_damage/4;
		_damage+=(_level*_add_dam);
		//alert("Infor:"+_level+" and "+_damage);
		
		let _min_delay=0.03;
		let _delay=0.5;
		let _minus_dam=0.005;
		_delay-=(_level*_minus_dam);
		*/
		
		const _model_id=this._game._parameters.get_auxiliary_model_id(6);
		let gltf=this._data_list[_model_id];
		const model = gltf.scene.children[0];
		model.scale.setScalar(1);

		const _group = new THREE.Group();
		_group.add(model.clone());

		//this._game._graphics.Scene.add(_group);
		_group.position.copy(position);
		
		let _camera=this._game._graphics.Camera.clone();
		
		_camera.position.copy(_group.position);
		
		let _blSystem=this._game._entities['_cannonBlasterSystem'+_id] = new blaster.BlasterSystem(//LASER GUN
		  {
            game: this._game,
			camera:_camera,
            texture: "./resources/blaster.jpg",
            visibility: this._game._visibilityGrid,
			damage:_damage,
			affect_player:false
          });
		  
		  this._game._entities['_cannon'+_id]=new RocketGun1({model: _group, camera: _camera, game: this._game,level:_level,
		  blasterSystem:_blSystem,parent_unit:this._game._entities['player'],radius:1,auto_aim:_auto_aim});
		
		this._game._entities['_cannonControls'+_id] = new controls.EnemyShipControls({
			target: this._game._entities['_cannon'+_id],
			camera: _camera,
			scene: this._game._graphics.Scene,
			domElement: this._game._graphics._threejs.domElement,
			gui: this._game._gui,
			guiParams: this._game._guiParams,
			game:this._game,
			visibility: this._game._visibilityGrid
          });
		  
		  //Bat buoc phai lam the nay de kich hoat dieu chinh vi tri camera va huong' cua cannon
		  //Do chua biet lam sao tinh' toan'
		  //Neu bo? doan code nay thi vi tri cua cannon ko biet nam o dau
		  this._game._entities['_cannonControls'+_id]._move.forward = true;
		  //this._entities['_controls2']._move.forward = false;
		  
		  //this._combat_unit_list.push(this._game._entities['_cannon'+_id]);
		  
		   this._game._entities['_cannon'+_id]._params.shoot_delay=_delay;
		  this._game._entities['_cannon'+_id]._shoot_delay=_delay;
		  
		  return this._game._entities['_cannon'+_id];
	}
	
	create_freezegun_1(position,_level){//chi su dung de? gan' len spaceship cua player
		let _id=this.get_next_id();
		
		let _damage=this._game._parameters._standard_hp/30;
		let _add_dam=_damage/5;
		_damage+=(_level*_add_dam);
		
		let _min_delay=0.01;
		let _delay=0.5;
		let _minus_dam=0.0005;
		_delay-=(_level*_minus_dam);
		
		let gltf=this._data_list["freezegun-1"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(0.02);

		const _group = new THREE.Group();
		_group.add(model.clone());

		//this._game._graphics.Scene.add(_group);
		_group.position.copy(position);
		
		let _camera=this._game._graphics.Camera.clone();
		
		_camera.position.copy(_group.position);
		
		let _blSystem=this._game._entities['_cannonBlasterSystem'+_id] = new blaster.BlasterSystem(//LASER GUN
		  {
            game: this._game,
			camera:_camera,
            texture: "./resources/blaster.jpg",
            visibility: this._game._visibilityGrid,
			damage:_damage,
			affect_player:false
          });
		  
		  this._game._entities['_cannon'+_id]=new Gun({model: _group, camera: _camera, game: this._game,
		  blasterSystem:_blSystem});
		
		this._game._entities['_cannonControls'+_id] = new controls.EnemyShipControls({
			target: this._game._entities['_cannon'+_id],
			camera: _camera,
			scene: this._game._graphics.Scene,
			domElement: this._game._graphics._threejs.domElement,
			gui: this._game._gui,
			guiParams: this._game._guiParams,
			game:this._game,
			visibility: this._game._visibilityGrid
          });
		  
		  //Bat buoc phai lam the nay de kich hoat dieu chinh vi tri camera va huong' cua cannon
		  //Do chua biet lam sao tinh' toan'
		  //Neu bo? doan code nay thi vi tri cua cannon ko biet nam o dau
		  this._game._entities['_cannonControls'+_id]._move.forward = true;
		  //this._entities['_controls2']._move.forward = false;
		  
		  //this._combat_unit_list.push(this._game._entities['_cannon'+_id]);
		  
		  this._game._entities['_cannon'+_id]._params.shoot_delay=_delay;
		  this._game._entities['_cannon'+_id]._shoot_delay=_delay;
		  
		  return this._game._entities['_cannon'+_id];
		  
	}
}
export{UnitMG};
