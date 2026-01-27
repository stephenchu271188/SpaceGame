//*Luu y trong van de update du lieu: phai lam sao han che su dung  ham` save_data
var _warehouse;
class WareHouse{//kho hàng, nha` kho(luu tru rockets,exploration-ship,...)
	constructor(params){
		this._game=params.game;
		
		this._data={};
		this.set_exploration_ship_num(0);
		this.set_rocket_num_1(0);
		this.set_rocket_num_2(0);
		this.set_rocket_num_3(0);
		
		//this._player_ships=new Array();//cac spaceship trong game 1
		//this.add_player_ship(1);//mac dinh spaceship 1 la co' san~
		
		_warehouse=this;
	}
	save_data(){
		var dataString = JSON.stringify(this._data);
		//alert(dataString);
		var currentStorageSize = JSON.stringify(localStorage).length;
		var maxSize = 5 * 1024 * 1024; // Ví dụ: giới hạn 5 MB cua browser
		if (currentStorageSize + dataString.length < maxSize){
			localStorage.setItem('warehouse', dataString);
			return true;
		}
		else{
			alert('LocalStorage đã đầy. Không thể lưu trữ thêm dữ liệu.(warehouse.js)');
			return false;
		}
	}
	load_data(){
		var storedDataString = localStorage.getItem('warehouse');
		if(storedDataString===null){
			this.init_data();
			return false;
		}
		this._data=JSON.parse(storedDataString);
			this.init_data();
			return true;
	}
	init_data(){
		//this.set_rocket_num_1(100);
		//this.set_rocket_num_2(100);
		//this.set_rocket_num_3(100);
		//this.set_exploration_ship_num(100);
		
		if(!this._data["player-ships"])//cac player ship trong game 1
			this._data["player-ships"]=new Array();
		this.add_player_ship(1);//mac dinh co' san~ ship 1 
		
	}
	add_player_ship(_id){
		if(this.have_player_ship(_id))return;
		this._data["player-ships"].push(_id);
		this.save_data();//day la hanh dong quan trong nen save_data luon
	}
	have_player_ship(_id){//kiem tra ship da unlock chua
		for(let i=0;i<this._data["player-ships"].length;i++){
			if(this._data["player-ships"][i]===_id)
				return true;
		}
		return false;
	}
	set_exploration_ship_num(x){
		this._data["exploration-ship-num"]=x;
	}
	get_exploration_ship_num(){
		if(!_warehouse._data["exploration-ship-num"])_warehouse._data["exploration-ship-num"]=0;
		return _warehouse._data["exploration-ship-num"];
	}
	add_exploration_ship_num(_value1){
		const _value2=parseInt(_warehouse.get_exploration_ship_num());
		_warehouse.set_exploration_ship_num(_value1+_value2);
	}
	minus_exploration_ship_num(){
		if(this._data["exploration-ship-num"]<=0)return;
		this._data["exploration-ship-num"]=this._data["exploration-ship-num"]-1;
	}
	increase_exploration_ship_num(){//cong them 1
		if(!_warehouse._data["exploration-ship-num"])_warehouse._data["exploration-ship-num"]=0;
		_warehouse._data["exploration-ship-num"]++;
	}
	decrease_exploration_ship_num(){//tru di 1
		if(!_warehouse._data["exploration-ship-num"])_warehouse._data["exploration-ship-num"]=0;
		if(_warehouse._data["exploration-ship-num"]<=0)return false;
		
		_warehouse._data["exploration-ship-num"]--;
		return true;
	}
	
	
	set_rocket_num(_id,_num){//sau nay phai su dung function nay, va loai bo dan cac function o duoi
		this._data["rocket-num-"+_id]=_num;
	}
	get_rocket_num(_id){
		const _data_id="rocket-num-"+_id;
		if(!this._data[_data_id])this._data[_data_id]=0;
		return this._data[_data_id];
	}
	add_rocket_num(_id,_value1){
		const _value2=parseInt(_warehouse.get_rocket_num(_id));
		_warehouse.set_rocket_num(_id,_value1+_value2);
	}
	minus_rocket_num(_id){
		const _data_id="rocket-num-"+_id;
		if(this._data[_data_id]<=0)return;
		this._data[_data_id]=this._data[_data_id]-1;
	}
	
	
	set_rocket_num_1(x){
		this._data["rocket-num-1"]=x;
	}
	get_rocket_num_1(){
		if(!_warehouse._data["rocket-num-1"])_warehouse._data["rocket-num-1"]=0;
		//alert(this._data["rocket-num-1"]);
		return _warehouse._data["rocket-num-1"];
	}
	add_rocket_num_1(_value1){
		const _value2=parseInt(_warehouse.get_rocket_num_1());
		_warehouse.set_rocket_num_1(_value1+_value2);
	}
	minus_rocket_num_1(){
		if(this._data["rocket-num-1"]<=0)return;
		this._data["rocket-num-1"]=this._data["rocket-num-1"]-1;
	}
	increase_rocket_num_1(){//cong them 1
		if(!_warehouse._data["rocket-num-1"])_warehouse._data["rocket-num-1"]=0;
		_warehouse._data["rocket-num-1"]++;
	}
	decrease_rocket_num_1(){//tru di 1
		if(!_warehouse._data["rocket-num-1"])_warehouse._data["rocket-num-1"]=0;
		if(_warehouse._data["rocket-num-1"]<=0)return false;
		
		_warehouse._data["rocket-num-1"]--;
		return true;
	}
	
	set_rocket_num_2(x){
		this._data["rocket-num-2"]=x;
	}
	get_rocket_num_2(){
		if(!_warehouse._data["rocket-num-2"])_warehouse._data["rocket-num-2"]=0;
		return _warehouse._data["rocket-num-2"];
	}
	add_rocket_num_2(_value1){
		const _value2=parseInt(_warehouse.get_rocket_num_2());
		_warehouse.set_rocket_num_2(_value1+_value2);
	}
	minus_rocket_num_2(){
		if(this._data["rocket-num-2"]<=0)return;
		this._data["rocket-num-2"]=this._data["rocket-num-2"]-1;
	}
	increase_rocket_num_2(){//cong them 1
		if(!_warehouse._data["rocket-num-2"])_warehouse._data["rocket-num-2"]=0;
		_warehouse._data["rocket-num-2"]++;
	}
	decrease_rocket_num_2(){//tru di 1
		if(!_warehouse._data["rocket-num-2"])_warehouse._data["rocket-num-2"]=0;
		if(_warehouse._data["rocket-num-2"]<=0)return false;
		
		_warehouse._data["rocket-num-2"]--;
		return true;
	}
	
	
	set_rocket_num_3(x){
		this._data["rocket-num-3"]=x;
	}
	get_rocket_num_3(){
		if(!_warehouse._data["rocket-num-3"])_warehouse._data["rocket-num-3"]=0;
		return _warehouse._data["rocket-num-3"];
	}
	add_rocket_num_3(_value1){
		const _value2=parseInt(_warehouse.get_rocket_num_3());
		_warehouse.set_rocket_num_3(_value1+_value2);
	}
	minus_rocket_num_3(){
		if(this._data["rocket-num-3"]<=0)return;
		this._data["rocket-num-3"]=this._data["rocket-num-3"]-1;
	}
	increase_rocket_num_3(){//cong them 1
		if(!_warehouse._data["rocket-num-3"])_warehouse._data["rocket-num-3"]=0;
		_warehouse._data["rocket-num-3"]++;
	}
	decrease_rocket_num_3(){//tru di 1
		if(!_warehouse._data["rocket-num-3"])_warehouse._data["rocket-num-3"]=0;
		if(_warehouse._data["rocket-num-3"]<=0)return false;
		
		_warehouse._data["rocket-num-3"]--;
		return true;
	}
}
export {WareHouse}