import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {SpaceShip} from './space-ship.js';
import {ChildShipStore} from '../child-ship-store.js';

var _radius=120;

let _alive_list=new Array();//Neu 1 player ko con mother ship nao nghia la da thua
let _dead_list=new Array();
let _center_point=new THREE.Vector3(0,0,0);

class MotherShip extends SpaceShip{
	constructor(params){
		
		super(params);
		if(params.attack_radius)
			this._attack_radius=params.attack_radius;
		else
			this._attack_radius=30;

		this._last_pos=this.get_world_position();
		this._ship_num=1;
		this._standard_num=this._game._parameters._standard_unit_num_in_group;//su dung de tinh' so luong child-ship hien? thi, lay total-num/standard-num=child-num
		this._ships=new Array();
		
		this._is_mother_ship=true;
		this._show_laser_connect_great_mother_ship=true;
		
		this._legion_capacity=3000;//sức chứa quân đoàn mặc định
		
		_alive_list.push(this);
		
		this._game.add_to_update_function_list((timeInSeconds)=>{
			if(!this.Dead)
				this._update(timeInSeconds);
		});
		
		this.add_to_after_dead_function_list(()=>{
			_dead_list.push(this._player_id);
			
			for(let i=0;i<_alive_list.length;i++){
				if(_alive_list[i]===this){
					_alive_list.splice(i,1);
				}
			}
			
			this.remove_laser();
			for(let i=0;i<this._ship_num;i++){
				const _ship=this._ships[i];
				if(_ship)_ship.SelfDestroy();
			}
			
			for(let i=0;i<_dead_list.length;i++){
				const _id=_dead_list[i];
				let _found=false;
				for(let j=0;j<_alive_list.length;j++){
					const _ship=_alive_list[j];
					if(_ship._player_id===_id){
						_found=true;
						break;
					}
				}
				if(!_found){
					//alert("PlayerID:"+_id+" has died");
				}
			}
			
		});
	}
	set_mother_ship_id(x){
		this._mother_ship_id=x;
	}
	get_mother_ship_id(){
		return this._mother_ship_id;
	}
	load_child_ship_store(){
		if(!this._mother_ship_id||this._mother_ship_id===null){
			alert("Mother Ship ID Require!(mother-ship.js)");
			return false;
		}
		this._child_ship_store=new ChildShipStore({game:this._game,package_name:"MotherShip-ID-"+this._mother_ship_id});
		this._child_ship_store.load_data();
	}
	set_child_ship_store(x){
		this._child_ship_store=x;
	}
	get_child_ship_store(){
		return this._child_ship_store;
	}
	create_enemy_child_ship_store_1(_child_ship_type,_child_num){//for legion game(ko load_data,ko set_data,ko save_data)
		this._child_ship_store=new ChildShipStore({game:this._game,package_name:"EnemyMotherShip"});
		this._child_ship_store.set_unit_num_by_id(_child_ship_type,_child_num);
	}
	
	init_legion_ships(){
		if(!this._child_ship_store||this._child_ship_store===null){
			//alert("No Child Ship Store Has Been Found!(mother-ship.js)");
			return false;
		}
		
		const _child_ship_type=this._child_ship_store.get_the_most_numerous_type();
		const _child_ship_num=this._child_ship_store.get_the_most_numerous_num();//so luong child ship
		this._ship_num=Math.floor(_child_ship_num/this._standard_num);
		
		this._last_pos=this.get_world_position();
		const _center_pos=this.get_world_position();
		//console.log(this.Position.x+" and "+this.Position.y+" and "+this.Position.z);
			
		for(let i=0;i<this._ship_num;i++){
			const _create_ship_fc=this._child_ship_store.get_create_child_ship_fc(_child_ship_type);
			const _ship=_create_ship_fc(new THREE.Vector3(0,0,0));
			//const _ship=this._game._unitMG.create_laser_ship_1(new THREE.Vector3(0,0,0));
			_ship._player_id=this._player_id;
			//_ship._target_point=_target_point;
			this._game._graphics.Scene.add(_ship._model);
			
			this._ships.push(_ship);
			_ship._mother_ship=this;
		}
		
		setTimeout(()=>{
			this.create_formation(1);
		},500);
		
	}
	
	//Ket qua tra ve co dang [0,1,0,1,0,1...]  (0->die; 1->alive)
	//Chua Test
	/*
	get_child_ships_status(){//lay thong tin cac child-ship con song' hay da chet
		let _rs=new Array();
		for(let i=0;i<this._ships.length;i++){
			const _unit=this._ships[i];
			if(_unit.Dead)_rs.push(0);
			else _rs.push(1);
		}
		return _rs;
	}
	*/
	
	//Ket qua tra ve co dang 0-1-0-1-0-1  (0->die; 1->alive)
	get_child_ships_status_string(){//lay thong tin cac child-ship con song' hay da chet
		let _rs='';
		for(let i=0;i<this._ships.length;i++){
			const _unit=this._ships[i];
			if(_unit.Dead)_rs+=0;
			else _rs+=1;
			
			if(i<this._ship.length){
				_rs+="-";
			}
		}
		return _rs;
	}
	
	change_child_ships_level(_level){
		for(let i=0;i<this._ships.length;i++){
			const _ship=this._ships[i];
			//this._ship_entity._ship_package=_ship_package;
			//this._ship_entity.apply_space_ship_level_package();
			_ship._level_rate=2;//de cho cac chi so' tang nhanh hon
			_ship._ship_package.set_ship_level(_level);
			_ship.apply_space_ship_level_package();
		}
	}
	
	create_formation(type){
		this._virtual_object=new THREE.Group();
		this._game._graphics.Scene.add(this._virtual_object);
		this._virtual_object.position.copy(this.Position);
			
		for(let i=0;i<this._ship_num;i++){
			const _target_point=new THREE.Group();
			this._virtual_object.add(_target_point);
			_target_point.position.set(_radius,0,0);
			
			const _ship=this._ships[i];
			_ship._target_point=_target_point;
		}
		setTimeout(()=>{
			if(type===1)this.create_circular_formation();
		},1500);
		
	}
	
	create_circular_formation(){
		for(let i=0;i<this._ships.length;i++){
			let _theta=(Math.PI*2)/this._ship_num;
				_theta*=i;
				
			const _ship=this._ships[i];
			const _target_point=_ship._target_point;
			
			this._utils.rotateAboutPoint(_target_point,new THREE.Vector3(0,0,0),this._utils.axisY,_theta,false);	
			
			const _tpos=new THREE.Vector3();
			//_tpos.copy(_target_point.position);
			_target_point.getWorldPosition(_tpos);
			//console.log(_tpos.x+" and "+_tpos.y+" and "+_tpos.z);
			_ship._model.position.copy(_tpos);
		}
	}
	
	_change_laser_color(_color){
		if(this._current_laser_color&&this._current_laser_color===_color)
			return;
			
		if(!this._laser1)return;
		this._laser1.change_color(_color);
		
		this._current_laser_color=_color;
	}
	_update(timeInSeconds){
		if(!this._virtual_object)return;
		//return;
		//this._model.position.x+=2;
		const _current_pos=this.get_world_position();
		this._virtual_object.position.copy(_current_pos);
		this._virtual_object.quaternion.copy(this._model.quaternion);
		
		const _dx=_current_pos.x-this._last_pos.x;
		const _dy=_current_pos.y-this._last_pos.y;
		const _dz=_current_pos.z-this._last_pos.z;
		this._last_pos.copy(_current_pos);
		
		const _length=this._ships.length;
		let _distance;
		const _min_distance=200;
		let _target;
		for(let i=0;i<_length;i++){
			const _ship=this._ships[i];
			if(_ship._model.parent===null)continue;
			
			const _target_point=_ship._target_point;
			const _tpos=new THREE.Vector3();
			_target_point.getWorldPosition(_tpos);
			_ship._model.position.copy(_tpos);
			//_ship.Fire();
			//_ship._model.position.x+=_dx;
			//_ship._model.position.y+=_dy;
			//_ship._model.position.z+=_dz;
			
			this._utils.rotateAboutPoint(_ship._target_point,_center_point,this._utils.axisY,timeInSeconds*0.1,false);
			
			if(!_ship._my_target||_ship._my_target===null||_ship._my_target.Dead){
				for(let j=0;j<this._game._unitMG._full_unit.length;j++){
					_target=this._game._unitMG._full_unit[j];
					_distance=_ship.Position.distanceTo(_target.Position);
					//console.log(_ship._player_id+" and "+_target._player_id);
					if(_ship._player_id!=_target._player_id&&_distance<=_min_distance){
						_ship._my_target=_target;
					}
				}
				//continue;
			}
			else{
				_distance=_ship.Position.distanceTo(_ship._my_target.Position);
				if(_distance>_min_distance){
					_ship._my_target=null;
					//continue;
				}
				else{
					//_ship._model.lookAt(_ship._my_target.Position);
					//_ship._model.lookAt(this._utils.calculateSymmetricPoint(_ship._my_target.Position,_ship.Position));
					_ship._model.lookAt(this._utils.calculateSymmetricPoint(_ship.Position,_ship._my_target.Position));
					_ship.Fire();
				}
			}
		}
		
	}
	
	CheckTarget(timeInSeconds){
		
	}
	remove_laser(){
		if(this._object3D)this._game._graphics.Scene.remove(this._object3D);
		if(this._laser1)this._game._graphics.Scene.remove(this._laser1.object3d);
	}
	update_laser(){//laser that connect to great mother ship
		if(!this._show_laser_connect_great_mother_ship)return;
		if(!this._greate_mother_ship||this._greate_mother_ship===null)return;
		//console.log(this._show_laser_connect_great_mother_ship);
		//let _tpos=this.Position;
		if(!this._laser1){
			this._object3D=new THREE.Object3D();
			this._game._graphics.Scene.add(this._object3D);
			//const _my_pos=this._game._me.Position;
			
			this._object3D.position.copy(this.Position);
			//this._object3D.position.set(_target_position.x+160,_target_position.y+45,_target_position.z);
			this._object3D.lookAt(this._greate_mother_ship.Position);
			//const _distance=this._object3D.position.distanceTo(this._greate_mother_ship.Position);
			//this._object3D.scale.z=_distance;//chiều dài của tia laser
			this._laser1 = new LaserBeam({reflectMax: 0,origin_object:this._object3D});
			this.add2Scene(this._laser1);
			
			this._change_laser_color("green");
			//this._change_laser_color('rgba(240, 27, 9, 0.5)');
		}
		const _distance=this._object3D.position.distanceTo(this._greate_mother_ship.Position);
		this._object3D.scale.z=_distance;
		this._object3D.position.copy(this.Position);
		this._object3D.lookAt(this._greate_mother_ship.Position);
	}
	
	add2Scene(obj) {
		this._game._graphics.Scene.add(obj.object3d);
		this._game._graphics.Scene.add(obj.pointLight);
		if (obj.reflectObject != null) {
			this.add2Scene(obj.reflectObject);
		}
	}
}
export {MotherShip}


function LaserBeam(iconfig) {
    var config = {
        length: 30000,
        reflectMax: 0
    };
    if (iconfig) {
        for (var prop in iconfig) {
            if (iconfig.hasOwnProperty(prop)) {
                config[prop] = iconfig[prop];
            }
        }
    }
	if(iconfig.origin_object)
		this.object3d = iconfig.origin_object;
	else
		this.object3d = new THREE.Object3D();
	
    this.reflectObject = null;
    this.pointLight = new THREE.PointLight(0xffffff, 1, 4);
    var raycaster = new THREE.Raycaster();
    var canvas = generateLaserBodyCanvas();
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    // Texture
    var material = new THREE.MeshBasicMaterial({
        map: texture,
        blending: THREE.AdditiveBlending,
        color: 0x4444aa,
        side: THREE.DoubleSide,
        depthWrite: false,
        transparent: true
    });
    var geometry = new THREE.PlaneGeometry(1, 0.1 * 20);//parameter thu 2 la chieu rong cua tia laser
    geometry.rotateY(0.5 * Math.PI);

    // Use planes to simulate laserbeam
    var i, nPlanes = 15;
    for (i = 0; i < nPlanes; i++) {
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = 1 / 2;
        mesh.rotation.z = i / nPlanes * Math.PI;
        this.object3d.add(mesh);
    }

    if (config.reflectMax > 0) {
        this.reflectObject = new LaserBeam({
            length: config.length,
            reflectMax: config.reflectMax - 1
        });
    }
	
	this.change_color=function(_color){
		const _col=new THREE.Color(_color);
		
		for(let i=0;i<this.object3d.children.length;i++){
			const _obj=this.object3d.children[i];
			_obj.material.color=_col;
		}
	}

    this.intersect = function (direction, objectArray = []) {
        raycaster.set(
            this.object3d.position.clone(),
            direction.clone().normalize()
        );

        var intersectArray = [];
        intersectArray = raycaster.intersectObjects(objectArray, true);
		
        if (intersectArray.length > 0) {
            this.object3d.scale.z = intersectArray[0].distance;
            this.object3d.lookAt(intersectArray[0].point.clone());
            this.pointLight.visible = true;

            var normalMatrix = new THREE.Matrix3().getNormalMatrix(intersectArray[0].object.matrixWorld);
            var normalVector = intersectArray[0].face.normal.clone().applyMatrix3(normalMatrix).normalize();

            this.pointLight.position.x = intersectArray[0].point.x + normalVector.x * 0.5;
            this.pointLight.position.y = intersectArray[0].point.y + normalVector.y * 0.5;
            this.pointLight.position.z = intersectArray[0].point.z + normalVector.z * 0.5;

            var reflectVector = new THREE.Vector3(
                intersectArray[0].point.x - this.object3d.position.x,
                intersectArray[0].point.y - this.object3d.position.y,
                intersectArray[0].point.z - this.object3d.position.z
            ).normalize().reflect(normalVector);

            if (this.reflectObject != null) {
                this.reflectObject.object3d.visible = true;
                this.reflectObject.object3d.position.set(
                    intersectArray[0].point.x,
                    intersectArray[0].point.y,
                    intersectArray[0].point.z
                );
                this.reflectObject.intersect(reflectVector.clone(), objectArray);
            }
        } else {
            this.object3d.scale.z = config.length;
            this.pointLight.visible = false;
            this.object3d.lookAt(
                this.object3d.position.x + direction.x,
                this.object3d.position.y + direction.y,
                this.object3d.position.z + direction.z
            );
            this.hiddenReflectObject();
        }
    };

    this.hiddenReflectObject = function () {
        if (this.reflectObject != null) {
            this.reflectObject.object3d.visible = false;
            this.reflectObject.pointLight.visible = false;
            this.reflectObject.hiddenReflectObject();
        }
    };

}
let canvas;
function generateLaserBodyCanvas() {
        canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.width = 1;
        canvas.height = 64;
        var gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(  0,  0,  0,0.1)');
        gradient.addColorStop(0.1, 'rgba(160,160,160,0.3)');
        gradient.addColorStop(0.5, 'rgba(55, 240, 9,0.5)');//màu của laser
        gradient.addColorStop(0.9, 'rgba(160,160,160,0.3)');
        gradient.addColorStop(1.0, 'rgba(  0,  0,  0,0.1)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        return canvas;
    }
function change_laser_color(color){
	var context = canvas.getContext('2d');
	var gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(  0,  0,  0,0.1)');
        gradient.addColorStop(0.1, 'rgba(160,160,160,0.3)');
        gradient.addColorStop(0.5, color);//màu của laser
        gradient.addColorStop(0.9, 'rgba(160,160,160,0.3)');
        gradient.addColorStop(1.0, 'rgba(  0,  0,  0,0.1)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
}