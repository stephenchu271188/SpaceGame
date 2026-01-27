import {LaserShip1} from './units/laser-ship-1.js';
import {FlashShip1} from './units/flash-ship-1.js';
import {RocketShip1} from './units/rocket-ship-1.js';

//*Luu y trong van de update du lieu: phai lam sao han che su dung  ham` save_data
//*Tên,Thứ Tự, Số Lượng các loại ChildShip lấy ở đây
class ChildShipStore{//luu tru child-ships cua mother ship
	constructor(params){
		this._game=params.game;
		
		//this._id=params.mother_ship_id;//su dung de save-data, neu parent class la warehouse2 thi ko can su dung
		this._data={};
		
		if(typeof params.package_name==='undefined'||params.package_name===null){
			this._package_name='child-ship-store-undefined';//can than ko thi se co package trung` ten
		}
		else{
			this._package_name=params.package_name;//de phan biet cac package khac nhau
		}
		
	}
	save_data(){
		var dataString = JSON.stringify(this._data);
		//alert(dataString);
		var currentStorageSize = JSON.stringify(localStorage).length;
		var maxSize = 5 * 1024 * 1024; // Ví dụ: giới hạn 5 MB cua browser
		if (currentStorageSize + dataString.length < maxSize){
			localStorage.setItem(this._package_name, dataString);
			//console.log("AfterSave="+this.get_unit_num_by_id(0));
			return true;
		}
		else{
			alert('LocalStorage đã đầy. Không thể lưu trữ thêm dữ liệu.(child-ship-store.js)');
			return false;
		}
		
	}
	load_data(){
		var storedDataString = localStorage.getItem(this._package_name);
		if(storedDataString===null){
			this.init_data();
			return false;
		}
		this._data=JSON.parse(storedDataString);
			this.init_data();
			return true;
	}
	set_data(_data){
		this._data=_data;
		if(this._data===null)this._data={};
		
		this.init_data();
	}
	get_data(){//su dung trong warehouse2 khi save data
		return this._data;
	}
	init_data(){//**MOI SU THAY DOI(THEM HAY BO? BOT') CAC LOAI(TYPE) SHIP DEU PHAI CHINH SUA HAM get_infor_list
		const _num_id_list=new Array();
		this._highest_id_list=new Array();
		
		this._ls_num_id="laser-ship-num";
		_num_id_list.push(this._ls_num_id);
		this._rs_num_id="rocket-ship-num";
		_num_id_list.push(this._rs_num_id);
		this._fs_num_id="flash-ship-num";
		_num_id_list.push(this._fs_num_id);
		
		this._ls_highest_num_id="laser-ship-highest-num";//so' luong nhieu nhat trong lich su
		//_num_id_list.push(this._ls_highest_num_id);
		this._highest_id_list.push(this._ls_highest_num_id);
		this._rs_highest_num_id="rocket-ship-highest-num";
		//_num_id_list.push(this._rs_highest_num_id);
		this._highest_id_list.push(this._rs_highest_num_id);
		this._fs_highest_num_id="flash-ship-highest-num";
		//_num_id_list.push(this._fs_highest_num_id);
		this._highest_id_list.push(this._fs_highest_num_id);
		
		for(let i=0;i<_num_id_list.length;i++){//neu chua co data thi gan' gia tri mac dinh la 0
			const _value=this._data[_num_id_list[i]];
			if(typeof _value==='undefined'||_value===null)
				this._data[_num_id_list[i]]=0;
		}
		
		const _tlist=this.get_infor_list();
		for(let i=0;i<_tlist.length;i++){//neu highest value < current value thi set highest=current
			const _id=_tlist[i][2];
			const _highest_id=_tlist[i][3];
			const _highest_value=this.get_unit_num(_highest_id);
			const _current_value=this.get_unit_num(_id);
			//console.log("Highest="+_highest_value+" and Current="+_current_value);
			if(_current_value>_highest_value){
				this.set_unit_num(_highest_id,_current_value);
			}
		}
		//console.log("AfterLoad="+this.get_unit_num_by_id(0));
	}
	
	get_infor_list(){//***CAN PHAI LUU Y, MOI SU THAY DOI VE SO LUONG CAC LOAI(TYPE) SHIP DEU PHAI CHINH SUA DANH SACHNAY
		const _rs=new Array();
			_rs.push(["laser-ship",this.get_laser_ship_num(),
			this._ls_num_id,this._ls_highest_num_id,this.get_unit_num(this._ls_highest_num_id),
			this._game._unitMG.create_laser_ship_1,LaserShip1]);
			
			_rs.push(["rocket-ship",this.get_rocket_ship_num(),this._rs_num_id,
			this._rs_highest_num_id,this.get_unit_num(this._rs_highest_num_id),
			this._game._unitMG.create_flash_ship_1,RocketShip1]);
			
			_rs.push(["flash-ship",this.get_flash_ship_num(),this._fs_num_id,
			this._fs_highest_num_id,this.get_unit_num(this._fs_highest_num_id),
			this._game._unitMG.create_rocket_ship_1,FlashShip1]);
		return _rs;
	}
	get_id_by_class_name(_class_name1){
		const _tlist=this.get_infor_list();
		for(let i=0;i<_tlist.length;i++){
			const _class_name2=_tlist[i][6].name;
			if(_class_name1===_class_name2)
				return i;
		}
		return null;
	}
	get_create_child_ship_fc(_id){
		const _tlist=this.get_infor_list();
		return _tlist[_id][5];
	}
	get_child_ship_type_num(){//tra ve so' luong cac loai child ship
		const _tlist=this.get_infor_list();
		return _tlist.length;
	}
	set_unit_num_by_id(_id,_value){//update so' luong unit by array id
		const _tlist=this.get_infor_list();
		const _element=_tlist[_id];
		const _num_id=_element[2];
		this.set_unit_num(_num_id,_value);
	}
	get_unit_num_by_id(_id){
		const _tlist=this.get_infor_list();
		const _element=_tlist[_id];
		const _num_id=_element[2];
		return parseInt(this.get_unit_num(_num_id));
		
	}
	get_unit_highest_num_by_id(_id){//lay' so' luong cao nhat trong lich su
		const _tlist=this.get_infor_list();
		const _element=_tlist[_id];
		const _highest_num_id=_element[3];
		return this.get_unit_num(_highest_num_id);
	}
	add_unit_num_by_id(_id,_value){
		const _current_num=parseInt(this.get_unit_num_by_id(_id));
		this.set_unit_num_by_id(_id,_current_num+parseInt(_value));
	}
	remove_unit_num_by_id(_id,_value){
		const _current_num=parseInt(this.get_unit_num_by_id(_id));
		let _new_value=_current_num-parseInt(_value);
		if(_new_value<0)_new_value=0;
		this.set_unit_num_by_id(_id,_new_value);
	}
	update_last_num_by_id(_id){
		const _tlist=this.get_infor_list();
		const _last_num_id="last-"+_tlist[_id][2];
		this._data[_last_num_id]=this.get_unit_num_by_id(_id);
		
	}
	set_last_num_by_id(_id,_value){
		const _tlist=this.get_infor_list();
		const _last_num_id="last-"+_tlist[_id][2];
		this._data[_last_num_id]=_value;
	}
	get_last_num_by_id(_id){
		const _tlist=this.get_infor_list();
		const _last_num_id="last-"+_tlist[_id][2];
		if(!this._data[_last_num_id])
			this._data[_last_num_id]=0;
		return this._data[_last_num_id];
	}
	
	get_the_most_numerous_type(){//lay' ship-type co' so' luong nhieu nhat
		const _tlist=this.get_infor_list();
		let _num1=0;
		let _type=0;
		for(let i=0;i<_tlist.length;i++){
			//const _element=_tlist[i];
			//const _num2=_element[1]();
			const _num2=this.get_unit_num_by_id(i);
			if(_num2>_num1){
				_num1=_num2;
				_type=i;
			}
		}
		return _type;
	}
	/*
	get_type_that_still_available_1(){//lấy về ship-type mà vẫn còn trong kho(duyệt theo thứ tự)
		const _tlist=this.get_infor_list();
		let _num1=0;
		let _type=0;
		for(let i=0;i<_tlist.length;i++){
			const _num2=this.get_unit_num_by_id(i);
			if(_num2>_num1){
				_num1=_num2;
				_type=i;
			}
		}
		return null;
	}
	*/
	get_the_most_numerous_num(){//lay' so' luong ship cua type co so luong nhieu nhat
		const _type=this.get_the_most_numerous_type();
		return this.get_unit_num_by_id(_type);
	}
	
	update_values(){//moi lan save data(warehouse2) deu phai goi ham nay
		const _tlist=this.get_infor_list();
		for(let i=0;i<_tlist.length;i++){
			const _id=_tlist[i][2];
			const _highest_id=_tlist[i][3];
			const _last_value=this.get_unit_num(_highest_id);
			const _new_value=this.get_unit_num(_id);
			if(_new_value>_last_value){
				this.set_unit_num(_highest_id,_new_value);
			}
		}
	}
	
	//-------------------------------------------------------------
	set_laser_ship_num(x){
		this.set_unit_num(this._ls_num_id,x);
	}
	get_laser_ship_num(){
		return this.get_unit_num(this._ls_num_id);
	}
	minus_laser_ship_num(){
		this.minus_unit_num(this._ls_num_id);
	}
	increase_laser_ship_num(){
		this.increase_unit_num(this._ls_num_id);
	}
	decrease_laser_ship_num(){
		this.decrease_unit_num(this._ls_num_id);
	}
	get_laser_ship_highest_num(){
		this.get_unit_num(this._ls_highest_num_id);
	}
	//---------------------------------------------------------
	set_rocket_ship_num(x){
		this.set_unit_num(this._rs_num_id,x);
	}
	get_rocket_ship_num(){
		return this.get_unit_num(this._rs_num_id);
	}
	minus_rocket_ship_num(){
		this.minus_unit_num(this._rs_num_id);
	}
	increase_rocket_ship_num(){
		this.increase_unit_num(this._rs_num_id);
	}
	decrease_rocket_ship_num(){
		this.decrease_unit_num(this._rs_num_id);
	}
	get_rocket_ship_highest_num(){
		this.get_unit_num(this._rs_highest_num_id);
	}
	//----------------------------------------------------------------
	set_flash_ship_num(x){
		this.set_unit_num(this._fs_num_id,x);
	}
	get_flash_ship_num(){
		return this.get_unit_num(this._fs_num_id);
	}
	minus_flash_ship_num(){
		this.minus_unit_num(this._fs_num_id);
	}
	increase_flash_ship_num(){
		this.increase_unit_num(this._fs_num_id);
	}
	decrease_flash_ship_num(){
		this.decrease_unit_num(this._fs_num_id);
	}
	get_flash_ship_highest_num(){
		this.get_unit_num(this._fs_highest_num_id);
	}
	//-----------------------------------------------------------------
	
	set_unit_num(_id,x){
		this._data[_id]=x;
	}
	get_unit_num(_id){
		if(!this._data[_id])
			this._data[_id]=0;
		return this._data[_id];
	}
	minus_unit_num(_id){
		if(this._data[_id]<=0)return;
		this._data[_id]=this._data[_id]-1;
	}
	increase_unit_num(_id){//cong them 1
		if(!this._data[_id])this._data[_id]=0;
		this._data[_id]++;
	}
	decrease_unit_num(_id){//tru di 1
		if(!this._data[_id])this._data[_id]=0;
		if(this._data[_id]<=0)return false;
		
		this._data[_id]--;
		return true;
	}
	/*
	check_highest_num(_highest_id,_num){//kiem tra neu so luong lon hon so luong cao nhat thi thay the'
		const _last_value=this.get_unit_num(_highest_id);
		if(_num>_last_value){
			this.set_unit_num(_highest_id,_num);
		}
	}
	*/
}
export {ChildShipStore}