import {ItemMG} from './item-mg.js';

//Hien o show-room dang su dung localStorage.getItem('player-cash') vaf localStorage.setItem('player-cash',this._cash)

export const inventory = (function() {

class _Inventory{
	constructor(params){
		this._game=params.game;
		this._target=params.target;//player entity
		this._ship_id=params.ship_id;
		let _item_mg=new ItemMG();
		this._item_list=_item_mg.get_default_items_for_player();//mặc định lúc xuất phát
		
		/*Phai Dan Dan Loai Bo bien' cash nay*/
		this._cash=0;//tiền mặt - Ko duoc truy cap truc tiep tu ben ngoai, ma phai su dung cac function GetCash,TakeCash,....
		
		this._accessories=new Array();//luu thong tin
		
		//this.save_data();
		this.load_data();
		//this.convert_data_for_inventory();
	}
	
	
	GetCash(){//chi duoc su dung function nay de lay' cash
		const _cash=parseInt(localStorage.getItem('player-cash'));
		this._cash=_cash;
		return this._cash;
	}
	TakeCash(x){
		const _current_cash=this.GetCash();
		let _rs=_current_cash-x;
		this.SetCash(_rs);
	}
	AddCash(x){
		const _current_cash=this.GetCash();
		let _rs=_current_cash+x;
		this.SetCash(_rs);
	}
	SetCash(x){
		this._cash=x;
		this.save_data();
	}
	
	getItemCount(category, item) {
		let itemCount = 0;
    
		// Kiểm tra xem category có tồn tại trong _rs không
		if (this._item_list.hasOwnProperty(category)) {
			// Duyệt qua mảng items của category
			this._item_list[category].forEach(i => {
				// Nếu item trùng khớp
				if (i === item) {
					itemCount++; // Tăng số lượng lên 1
            }	
			});
		}

		return itemCount;
	}
	
	
	decreaseItemCount(category, item, number) {
		let _counter=0;
		if (this._item_list.hasOwnProperty(category)){
			const _category=this._item_list[category];
			for(let i=_category.length-1;i>=0;i--){
				if(_category[i]===item){
					_category.splice(i,1);
					_counter++;
					if(_counter===number)return;
				}
			}
		}
	}
	
	increaseItemCount(category, item, number) {
		// Kiểm tra xem category có tồn tại trong _rs không
		if (this._item_list.hasOwnProperty(category)) {
			// Kiểm tra xem item có tồn tại trong category đó không
			const index = this._item_list[category].indexOf(item);
			if (index !== -1) {
				// Tăng số lượng của item đi number
				for (let i = 0; i < number; i++) {
					this._item_list[category].push(item);
				}
				console.log(`Đã thêm ${number} "${item}" vào "${category}"`);
			} 
			else {
				console.log(`Item "${item}" không tồn tại trong category "${category}"`);
			}
		} 
		else {
			console.log(`Category "${category}" không tồn tại trong _rs`);
		}
	}
	
	//đưa data về dang: 
	//{solid:{gold:100,silver:200},liquid:{...},...}
	summarize_item_array(_category){//_category=solid,liquid...
		let _i_list={};
		for(let i=0;i<_category.length;i++){
			let _name=_category[i];
			if(!_i_list[_name]){
				_i_list[_name]=1;
			}
			else{
				_i_list[_name]++;
			}
		}
		
		return _i_list;
	}
	summarize_item_data(){//làm data ngắn gọn lại
		let _rs='{';
		
		for (let key1 in this._item_list) {
			if (this._item_list.hasOwnProperty(key1)) {
				let _list = this._item_list[key1];
				let _category_data=this.summarize_item_array(_list);
				_rs+='"'+key1+'":';//key1=liquid,solid...
				_rs+='[';
						let _counter2=0;
						let _num2=Object.keys(_category_data).length;
						for (let key2 in _category_data){
							let _data=_category_data[key2];
							_rs+='{';
								_rs+='"'+key2+'":'+_data;
							_rs+='}';
							if(_counter2<_num2-1)
								_rs+=',';
							_counter2++;
						}
				_rs+='],';
			}
		}
		_rs+='"cash":'+this._cash;//ko dung` den', cung ko nen su dung
		_rs+='}';
		return _rs;
	}
	
	
	save_data(){
		//return;
		
		//let _summary_data=this.summarize_item_data();
		//localStorage.setItem('inventory-data-'+this._ship_id, _summary_data);//moi mot ship co inventory rieng
		//localStorage.setItem('player-cash',this._cash);
	
	}
	load_data(){
		
		this._cash=localStorage.getItem('player-cash');
		if(this._cash===null)
		{
			localStorage.setItem('player-cash',this._game._parameters._init_cash);//cash thi su dung chung voi' tat ca cac ship
		}	
		else
			this._cash=parseInt(this._cash);
		
		let _item_mg=new ItemMG();
		this._item_list=_item_mg.get_default_items_for_player();//mặc định lúc xuất phát
		
	}
	//khi lưu data vào database thì dữ liệu có dạng: {"food":{},"liquid":{{"mercury":1}},"fuel":{},"solid":{{"gold":8},{"silver":16},{"iron":4}},"weapon":{},"cash":600000}
	//khi đưa dữ liệu vào inventory thì convert sang dạng: this._item_list['liquid']=["mercury"];
	//this._item_list['fuel']=[];
	convert_data_for_inventory(){
		this._item_list={};
		for (let key1 in this._my_data){
			this._item_list[key1]=new Array();
			let _data1=this._my_data[key1];
			for(let i=0;i<_data1.length;i++){
				let _data2=_data1[i];
				const mapToArray = Object.entries(_data2);//chuyển sang dạng mảng
				
				for (let j = 0; j < mapToArray.length; j++) {
					const [key2, value] = mapToArray[j];
					
					//alert(`Key: ${key2}, Value: ${value}`);
					for(let k=0;k<value;k++){
						this._item_list[key1].push(key2);
					}
				}
			}
			
		}
		
		//alert(this._item_list["cash"]);
		//this._item_list["cash"]=1000;
		//alert(this._item_list["cash"]);
	}
	
	add_cash(value){
		this._cash+=value;
	}
	take_cash(value){
		if(value>this._cash){
			return false;
		}
		this._cash-=value;
		return true;
	}
	
	Update() {
    }
	
	equip_items(){
		
		for(var i=0;i<this._accessories.length;i++){
			let _item=this._accessories[i];
			let _id=_item[0];
			let _category=_item[1];
			
			let _new_entity;
			let _unique_id=this._game.GetUniqueID();
			
			if(_id==="lasergun1"&&_category==="weapon"){
				this._target.remove_laser_gun_1();
				this._target.add_laser_gun_1();
			}
			if(_id==="lasergun2"&&_category==="weapon"){
				this._target.remove_laser_gun_2();
				this._target.add_laser_gun_2();
			}
			if(_id==="plasmagun1"&&_category==="weapon"){
				this._target.remove_plasma_gun();
				this._target.add_plasma_gun();
			}
		}
		
	}
}

return {
    Inventory:_Inventory
  };
})();
