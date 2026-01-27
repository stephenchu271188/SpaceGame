import {ChildShipStore} from './child-ship-store.js';

import {MotherShip} from './units/mother-ship.js';
import {MotherRocketShip} from './units/mother-rocket-ship.js';
import {MotherFlashShip} from './units/mother-flash-ship.js';
import {MotherFreezingShip} from './units/mother-freezing-ship.js';
import {MotherHeatingShip} from './units/mother-heating-ship.js';

import {LaserShip1} from './units/laser-ship-1.js';
import {FlashShip1} from './units/flash-ship-1.js';
import {RocketShip1} from './units/rocket-ship-1.js';

//*Luu y trong van de update du lieu: phai lam sao han che su dung  ham` save_data
var _warehouse2;
class WareHouse2{//kho hàng, nha` kho(luu tru spaceship cho game legion,...)
	constructor(params){
		this._game=params.game;
		
		this._data={};
		
		_warehouse2=this;
	
	}
	save_data(){
		this._child_ship_store.update_values();//bat buoc
		this._data["child-ship-data"]=this._child_ship_store.get_data();
		//console.log(""+this._child_ship_store.get_unit_num_by_id(0));
		//console.log(""+this._child_ship_store.get_unit_highest_num_by_id(0));
		var dataString = JSON.stringify(this._data);
		//alert(dataString);
		var currentStorageSize = JSON.stringify(localStorage).length;
		var maxSize = 5 * 1024 * 1024; // Ví dụ: giới hạn 5 MB cua browser
		if (currentStorageSize + dataString.length < maxSize){
			localStorage.setItem('warehouse2', dataString);
			return true;
		}
		else{
			alert('LocalStorage đã đầy. Không thể lưu trữ thêm dữ liệu.(warehouse2.js)');
			return false;
		}
	}
	load_data(_fc){
		var storedDataString = localStorage.getItem('warehouse2');
		if(storedDataString===null){
			this.init_data(_fc);
			return false;
		}
		this._data=JSON.parse(storedDataString);
			this.init_data(_fc);
			return true;
	}
	init_data(_fc){
		const _num_id_list=new Array();
		this._mh_num_id="mother-heating-ship-num";
		_num_id_list.push(this._mh_num_id);
		this._mf_num_id="mother-freezing-ship-num";
		_num_id_list.push(this._mf_num_id);
		this._mr_num_id="mother-rocket-ship-num";
		_num_id_list.push(this._mr_num_id);
		
		for(let i=0;i<_num_id_list.length;i++){
			const _value=this._data[_num_id_list[i]];
			if(typeof _value==='undefined'||_value===null)
				this._data[_num_id_list[i]]=0;
		}
		
		this._child_ship_store=new ChildShipStore({game:this._game,package_name:"warehouse2-child-ship-store"});
		if(this._data["child-ship-data"]){
			this._child_ship_store.set_data(this._data["child-ship-data"]);
		}
		else{
			this._child_ship_store.set_data(null);
		}
		
		
		
		this._infor_list=new Array();
		this._infor_list.push(["Heating Ship",this._mh_num_id,this.set_mother_heating_ship_num,
								this.get_mother_heating_ship_num,this.increase_mother_heating_ship_num,
								this.decrease_mother_heating_ship_num,this.minus_mother_heating_ship_num,
								this._game._unitMG.create_mother_heating_ship_1,
								MotherHeatingShip]);
		this._infor_list.push(["Freezing Ship",this._mf_num_id,this.set_mother_freezing_ship_num,
								this.get_mother_freezing_ship_num,this.increase_mother_freezing_ship_num,
								this.decrease_mother_freezing_ship_num,this.minus_mother_freezing_ship_num,
								this._game._unitMG.create_mother_freezing_ship_1,
								MotherFreezingShip]);
		this._infor_list.push(["Rocket Ship",this._mr_num_id,this.set_mother_rocket_ship_num,
								this.get_mother_rocket_ship_num,this.increase_mother_rocket_ship_num,
								this.decrease_mother_rocket_ship_num,this.minus_mother_rocket_ship_num,
								this._game._unitMG.create_mother_rocket_ship_1,
								MotherRocketShip]);
		
		//alert("Current="+this._child_ship_store.get_unit_num_by_id(0));
		//alert("Highest="+this._child_ship_store.get_unit_highest_num_by_id(0));
		
		if(typeof _fc!='undefined'&&_fc!=null)_fc();
	}
	
	get_mother_ship_class(_id){
		return _warehouse2._infor_list[_id][8];
	}
	get_create_mother_ship_fc(_id){
		return _warehouse2._infor_list[_id][7];
	}
	
	get_mother_ship_type_num(){//tong? so' cac loai mother ship
		return _warehouse2._infor_list.length;
	}
	set_mother_ship_num(_id,_value){
		let _fc=_warehouse2._infor_list[_id][2];
		_fc(_value);
	}
	get_mother_ship_num(_id){
		return _warehouse2._infor_list[_id][3]();
	}
	increase_mother_ship_num(_id){//_id: type(id trong infor_list)
		//let _value=this.get_mother_ship_num(_id)+1;
		_warehouse2._infor_list[_id][4]();
	}
	add_mother_ship_num(_id,_value){
		const _current_num=parseInt(_warehouse2.get_mother_ship_num(_id));
		_warehouse2.set_mother_ship_num(_id,_current_num+parseInt(_value));
	}
	
	//-------------------------------------------------------------
	set_mother_heating_ship_num(x){
		_warehouse2.set_unit_num(_warehouse2._mh_num_id,x);
	}
	get_mother_heating_ship_num(){
		return _warehouse2.get_unit_num(_warehouse2._mh_num_id);
	}
	minus_mother_heating_ship_num(){
		_warehouse2.minus_unit_num(_warehouse2._mh_num_id);
	}
	increase_mother_heating_ship_num(){
		//_warehouse2.increase_unit_num(this._mh_num_id);
		const _current_num=_warehouse2.get_mother_heating_ship_num();
		_warehouse2.set_mother_heating_ship_num(_current_num+1);
	}
	decrease_mother_heating_ship_num(){//chua test-co the bi loi
		_warehouse2.decrease_unit_num(_warehouse2._mh_num_id);
	}
	//--------------------------------------------------------------------
	set_mother_freezing_ship_num(x){
		_warehouse2.set_unit_num(_warehouse2._mf_num_id,x);
	}
	get_mother_freezing_ship_num(){
		return _warehouse2.get_unit_num(_warehouse2._mf_num_id);
	}
	minus_mother_freezing_ship_num(){
		_warehouse2.minus_unit_num(_warehouse2._mf_num_id);
	}
	increase_mother_freezing_ship_num(){
		//this.increase_unit_num(this._mf_num_id);
		const _current_num=_warehouse2.get_mother_freezing_ship_num();
		_warehouse2.set_mother_freezing_ship_num(_current_num+1);
	}
	decrease_mother_freezing_ship_num(){//chua test-co the bi loi
		_warehouse2.decrease_unit_num(_warehouse2._mf_num_id);
	}
	//----------------------------------------------------------------------
	
	set_mother_rocket_ship_num(x){
		_warehouse2.set_unit_num(_warehouse2._mr_num_id,x);
	}
	get_mother_rocket_ship_num(){
		return _warehouse2.get_unit_num(_warehouse2._mr_num_id);
	}
	minus_mother_rocket_ship_num(){
		_warehouse2.minus_unit_num(_warehouse2._mr_num_id);
	}
	increase_mother_rocket_ship_num(){
		//this.increase_unit_num(this._mr_num_id);
		const _current_num=_warehouse2.get_mother_rocket_ship_num();
		_warehouse2.set_mother_rocket_ship_num(_current_num+1);
	}
	decrease_mother_rocket_ship_num(){//chua test-co the bi loi
		_warehouse2.decrease_unit_num(_warehouse2._mr_num_id);
	}
	
	//-----------------------------------------------------------------
	
	set_unit_num(_id,x){
		_warehouse2._data[_id]=x;
	}
	get_unit_num(_id){
		if(!_warehouse2._data[_id])
			_warehouse2._data[_id]=0;
		return _warehouse2._data[_id];
	}
	minus_unit_num(_id){
		if(_warehouse2._data[_id]<=0)return;
		_warehouse2._data[_id]=_warehouse2._data[_id]-1;
	}
	/*
	increase_unit_num(_id){//cong them 1
		if(!_warehouse2._data[_id])_warehouse2._data[_id]=0;
		const _current_num=parseInt(_warehouse2._data[_id]);
		_warehouse2._data[_id]=_current_num+1;
	}
	*/
	decrease_unit_num(_id){//tru di 1 (CHUA TEST-CO THE BI LOI)
		if(!_warehouse2._data[_id])_warehouse2._data[_id]=0;
		if(_warehouse2._data[_id]<=0)return false;
		
		_warehouse2._data[_id]--;
		return true;
	}
	
}
export {WareHouse2}