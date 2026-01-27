import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';


import {StarSystem} from './star-system.js';
class Galaxy{
    
    constructor(params) {
		this._params=params;
		this._game=params.game;
		//id, universe_id, position
        this._id=this._params.id;
        this._universe_id=this._params.universe_id;
        //this.position=position;
        this._data=null;  
        this._after_load_data_fc=null;
        this._visible_star_system=new Array();//nhung star system dang duoc hien thi
        this._root=new THREE.Group();
        this._root.position.copy(this._params.position);
        this._params.game._graphics.Scene.add(this._root);
		
		this.show_center_position();
		
		this._stop=false;
    }
	
	update(timeInSeconds){
		if(this._stop===true){
			return;
		}
		
		for(var i=0;i<this._visible_star_system.length;i++){
			this._visible_star_system[i].update(timeInSeconds);
		}
	}
	
	show_center_position(){//tao 1 khoi cau nam tai trung tam galaxy(dung cho viec test)
		let _geometry = new THREE.SphereGeometry( 50, 32, 16 ); 
        let _material = new THREE.MeshBasicMaterial( { color: 0x05EE05 } ); 
        let _sphere = new THREE.Mesh( _geometry, _material ); 
        _sphere.position.copy(this._root.position);
		this._params.game._graphics.Scene.add(_sphere);
	}
    
    clear()//remove all
    {
        this._root.parent.remove(this._root);
    };
    
    load_data(_url,_fc)
    {
        this._after_load_data_fc=_fc;
        fetch(_url)
		.then((response) => {
			if (!response.ok) {alert("load failed");
			throw new Error('Network response was not ok');
		}
		return response.json();
		})
		.then((json) => this.execute_data(json))
		.catch((error) => {
			// Xử lý lỗi ở đây, ví dụ: hiển thị thông báo lỗi
			console.error('Error:', error);
			alert(error);
		});

    };
    
    execute_data(_json)
    {
        this._data=_json;
        if(this._after_load_data_fc!=null)
            this._after_load_data_fc();
    }
    
    get_position(){
        return this._root.position;
    }
	get_data(){
		return this._data;
	}
	
	//get_all_visible_starsystem_class(){	
	//}
	
	//lấy 1 star system ngẫu nhiên với điều kiện có 1 ngôi sao có ít nhất 1 số lượng hành tinh nhập vào
	//phải chắc chắn trong data có nhiều star thỏa mãn điều kiện _min_planet thì mới sử dụng function này
	//bởi vì thuật toán chạy sẽ rất nặng nếu có ít star thỏa mãn điều kiện (do ko sử dụng thuật toán shuffle data-để chạy nhanh hơn)
	get_random_starsystem_data_with_condition_1(_min_planet_num){
		var min = 0;
		var max = this._data.length-1;
		var randID = Math.floor(Math.random() * (max - min + 1)) + min;
		
		for(var i=randID;i<max;i++){
			let _system=this._data[i];
			let _star_list=_system.starList;
			for(var j=0;j<_star_list.length;j++){
				let _star=_star_list[j];
				if(_star.planetList.length>=_min_planet_num){
					return [_system,i,j];
				}
			}
		}
		
		return this.get_random_starsystem_data_with_condition_1(_min_planet_num);
	}
	get_random_starsystem_data(){
		const _system_id= Math.floor(Math.random() * this._data.length);
		const _system=this._data[_system_id];
		return _system;
	}
	get_random_star_data(){//lay trong data list
		const _system=this.get_random_starsystem_data();
		const _star_id=Math.floor(Math.random() * _system.starList.length);
		const _star=_system.starList[_star_id];
		return _star;
	}
	get_random_planet_data(){
		const _star=this.get_random_star_data();
		const _planet_id=Math.floor(Math.random() * _star.planetList.length);
		const _planet=_star.planetList[_planet_id];
		return _planet;
	}
	
	get_star_system_class_by_id(id){//id trong database
		for(var i=0;i<this._visible_star_system.length;i++){
			//alert("ID="+this._visible_star_system[i]._id);
			if(this._visible_star_system[i]._id===id){
				return this._visible_star_system[i];
			}
		}
		return null;
	}
	get_random_starsystem_class_with_condition_1(min_planet_num){//tim class starsystem trong do phai co 1 ngoi sao co it nhat _planet_num so hanh tinh quay xung quah
		for(var i=0;i<this._visible_star_system.length;i++){
			let _system=this._visible_star_system[i];
			for(var j=0;j<_system._star_list.length;j++){
				let _star=_system._star_list[j];
				if(_star._planet_list.length>=min_planet_num){
					return [_system,_star];
				}
			}
		}
		return null;
	}
	get_star_system_class_by_data_id(_id){
		for(let i=0;i<this._visible_star_system.length;i++){
			if(this._visible_star_system[i]._id===_id)
				return this._visible_star_system[i];
		}
		return null;
	}
	//star_system_id la id trong data
	get_star_class_by_data_id(star_system_id,star_id){
		let _star_system=this.get_star_system_class_by_data_id(star_system_id);
		return _star_system._star_list[star_id];
	}
	get_star_system_class(star_system_id){//_id nay la id trong array,ko phai id cua class
		return this._visible_star_system[star_system_id];
	}
	get_star_class(star_system_id,star_id){//id trong array, chi lay trong visible list
		let _star_system=this.get_star_system_class(star_system_id);
		return _star_system._star_list[star_id];
	}
	get_planet_class(star_system_id,star_id,planet_id){
		let _star=this.get_star_class(star_system_id,star_id);
		return _star._planet_list[planet_id];
	}
	get_random_planet_class(star_system_id,star_id){
		let _star=this.get_star_class(star_system_id,star_id);
		let _planet_id=Math.floor(Math.random() * _star._planet_list.length);
		return _star._planet_list[_planet_id];
	}
	get_moon_class(star_system_id,star_id,planet_id,moon_id){
	  let _planet=this.get_planet_class(star_system_id,star_id,planet_id);
	  return _planet._moon_list[moon_id];
	}
	
	focus_on_star_sytem(star_system_class){//hiển thị 1 starsystem và ẩn hết các starsystem khác
		for(let i=0;i<this._visible_star_system.length;i++){
			const _system=this._visible_star_system[i];
			if(_system===star_system_class)
				_system._root.visible=true;
			else
				_system._root.visible=false;
		}
	}
	show_all_star_system(){
		for(let i=0;i<this._visible_star_system.length;i++){
			const _system=this._visible_star_system[i];
			_system._root.visible=true;
		}
	}
	
	arrange_all_star_systems_in_line(first_position,distance){//sắp xếp tất cả các he sao theo hàng dọc
		for(var i=0;i<this._data.length;i++){
            const _system=this._data[i];
			let _nextPos=first_position.clone();
			_nextPos.z+=i*distance;
			//console.log(_system.position);
            _system.position=[_nextPos.x,_nextPos.y,_nextPos.z];
			//console.log(_system.position);
		}
	}
    
	//Tao va hien thi tat cac cac star system co trong data
	create_all_star_systems(){//chi su dung trong game vd nhu legion game
		for(var i=0;i<this._data.length;i++){
            //_system=this._data[i];
            this.create_new_star_system(this._data[i]);
		}
	}
    create_neighboring_star_systems(_position,_radius)//hien thi cac star system xung quanh
    {
        let _star_system_data_list=this.get_neighboring_star_systems(_position,_radius);
       
        for(var i=0;i<_star_system_data_list.length;i++){
			const _item=_star_system_data_list[i];
            let _id=_item.id;
            let _found=false;//Kiem tra neu da ton tai trong list roi thi bo qua
            for(var j=this._visible_star_system.length-1;j>=0;j--){
                if(this._visible_star_system[j]._id===_id){
					//console.log("Is Label:"+this._visible_star_system[j]._star_list[0]._is_just_label);
					if(this._visible_star_system[j]._star_list[0]._is_just_label===true){
						
						this._visible_star_system[j].clear();//xoa di va re-create
						this._visible_star_system.splice(j,1);
					}
					else{
                    	_found=true;
                    	break;
					}
                }
            }
            if(_found)continue;
            const _distance=_item._current_distance;
			if(_distance<_radius/2)
            	this.create_new_star_system(_item,false);
			else
				this.create_new_star_system(_item,true);
        }
	  
    }
	
	create_new_star_system(_tdata,_just_show_label){
		let _star_system=new StarSystem({parent_object:this._root,
			data:_tdata,game:this._params.game});
            //if(i<3)alert(_star_system_data_list[i].position);
            //if(!_just_show_label)
				this._visible_star_system.push(_star_system);
            _star_system.create(_just_show_label);
	}
	add_new_star_system(_tdata){//create and add to database
	//alert(_tdata.position);
		this._data.push(_tdata);
		this.create_new_star_system(_tdata);
		//alert((_tdata.planetList.length));
	}
    
    clear_out_range_star_systems(_position,_radius){//xoa nhung he sao nam xa vi tri hien tai
    
        var _counter=0;
        for (let i = this._visible_star_system.length - 1; i >= 0; i--){
            let _star_system=this._visible_star_system[i];
            let _distance=_position.distanceTo(_star_system.get_world_position());
            if(_distance>_radius){
                _star_system.clear();
                this._visible_star_system.splice(i,1);
                _counter++;
            }
        }
      
    }
    
    //_position -> vi tri trung tam de tim kiem xung quanh
    //_radius -> ban kinh tim kiem
    get_neighboring_star_systems(_position,_radius)//trả về data những hệ sao lân cận
    {
        let _rs=new Array();
        let _length=this._data.length;
        let _x,_y,_z;
        let _distance,_pos;
        let _system,_starlist,_star,_planetlist;
        let _scale=this._params.game._config.magnification_factor;//he so phong dai khoang cach
        for(var i=0;i<_length;i++){
            _system=this._data[i];
            _pos=_system.position;
            _x=_pos[0]*_scale;
            _y=_pos[1]*_scale;
            _z=_pos[2]*_scale;
			
			_distance=this.calculate_distance(this._root.position.x+_x,this._root.position.y+_y,
			this._root.position.z+_z,_position.x,_position.y,_position.z);

			_system._current_distance=_distance;
			
            if(_distance<=_radius)_rs.push(_system);
            
        }
        
        return _rs;
    }
	
	
	get_all_starsystem_with_id_name_and_position(){//lay toan bo danh sach cac he sao voi vi tri va Name cua chung
		let _rs=new Array();
        let _length=this._data.length;
        let _system,_pos;
        let _scale=this._params.game._config.magnification_factor;
		let _x,_y,_z;
		for(var i=0;i<_length;i++){
			_system=this._data[i];
			_pos=_system.position;
            _x=_pos[0]*_scale;
            _y=_pos[1]*_scale;
            _z=_pos[2]*_scale;
			_rs.push([_system.id,"noname",[_x,_y,_z]]);
		}
		return _rs;
	}
    
    calculate_distance(x1, y1, z1, x2, y2, z2) {//tinh toa do giua 2 diem A(x1,y1,z1) va B(x2,y2,z2)
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dz = z2 - z1;
  
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        return distance;
    }
    
};

export {Galaxy};


