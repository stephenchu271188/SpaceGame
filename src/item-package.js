

class ItemPackage{
	constructor(params){
		this._game=params.game;
		this._data=[];
		
		this._items=[
		    {id:-1,type:0,name:"Lucky Wheel",img:"./resources/icons/lucky-wheel-1.png"},//so luot quay lucky wheel
			
			{id:1,type:1,name:"Green Infinity Stone",img:"./resources/icons/Infinity-Stones/3.png"},
			{id:2,type:1,name:"Purple Infinity Stone",img:"./resources/icons/Infinity-Stones/5.png"},
			{id:3,type:1,name:"Blue Infinity Stone",img:"./resources/icons/Infinity-Stones/6.png"},
			{id:4,type:1,name:"Red Infinity Stone",img:"./resources/icons/Infinity-Stones/4.png"},
			{id:5,type:1,name:"Yellow Infinity Stone",img:"./resources/icons/Infinity-Stones/2.png"},	
			
			{id:1001,type:2,name:"Dark Matter",img:"./resources/icons/dark-matter-1.png"},
			
			{id:2001,type:3,name:"Dark Energy",img:"./resources/icons/Energy/energy-6.png"},	
		];
	}
	
	get_random_id(){
		const _rand_item=this._game._utils.get_random_elements_from_array(this._items,1)[0];
		return _rand_item.id;
	}
	
	get_item_infor(_id){
		for(let i=0;i<this._items.length;i++){
			if(this._items[i].id===_id)
				return this._items[i];
		}
		return null;
	}
	get_item_type(_id){
		const _infor=this.get_item_infor(_id);
		if(_infor===null)
			return null;
		
		return _infor.type;
	}
	get_item_name(_id){
		const _infor=this.get_item_infor(_id);
		if(_infor===null)
			return null;
		
		return _infor.name;
	}
	get_item_img_path(_id){
		const _infor=this.get_item_infor(_id);
		if(_infor===null)
			return null;
		
		return _infor.img;
	}
	
	save_data(){
		var dataString = JSON.stringify(this._data);
		//alert(dataString);
		var currentStorageSize = JSON.stringify(localStorage).length;
		var maxSize = 5 * 1024 * 1024; // Ví dụ: giới hạn 5 MB cua browser
		if (currentStorageSize + dataString.length < maxSize){
			localStorage.setItem('item-package', dataString);
			return true;
		}
		else{
			alert('LocalStorage đã đầy. Không thể lưu trữ thêm dữ liệu.(warehouse.js)');
			return false;
		}
	}
	load_data(){
		var storedDataString = localStorage.getItem('item-package');
		if(storedDataString===null){
			this.init_data();
			return false;
		}
		this._data=JSON.parse(storedDataString);
			
			return true;
	}
	
	init_data(){//qua tang lan dau dang nhap
		this._data=[
			{id:-1,count:this._game._parameters._first_login_lucky_wheel_turns_num},//turns of lucky-wheel
		
			{id:1,count:this._game._parameters._first_login_green_infinity_stone_num},//infinity stone
			{id:2,count:this._game._parameters._first_login_purple_infinity_stone_num},
			{id:3,count:this._game._parameters._first_login_blue_infinity_stone_num},
			{id:4,count:this._game._parameters._first_login_red_infinity_stone_num},
			{id:5,count:this._game._parameters._first_login_yellow_infinity_stone_num},
			
			{id:1001,count:this._game._parameters._first_login_dark_matter_num},//dark matter
			
			{id:2001,count:this._game._parameters._first_login_dark_energy_num}//dark energy
		];
	};
	
	get_all_items(_item_type){//item dang co
		let _rs=new Array();
		for(let i=0;i<this._data.length;i++){
			const _id=this._data[i].id;
			const _type=this.get_item_type(_id);
			if(_type!=_item_type)continue;
			const _name=this.get_item_name(_id);
			const _count=this._data[i].count;
			const _img=this.get_item_img_path(_id);
			
			_rs.push({id:_id,name:_name,count:_count,img:_img});
		}
		return _rs;
	}
	
	has_item(_id){
		for(let i=0;i<this._data.length;i++){
			const _element=this._data[i];
			if(_element.id===_id)
				return true;
		}
		return false;
	}
	add_item(_id,_num){
		if(!this.has_item(_id)){
			this._data.push({id:_id,count:_num});
			return;
		}
		for(let i=0;i<this._data.length;i++){
			const _element=this._data[i];
			if(_element.id===_id){
				_element.count+=_num;
				this.save_data();
				return;
			}
		}
		
	}
	take_item(_id,_num){//lay' di
		if(!this.has_item(_id)){
			return false;
		}
		for(let i=0;i<this._data.length;i++){
			const _element=this._data[i];
			if(_element.id===_id){
				_element.count-=_num;
				if(_element.count<0)_element.count=0;
				this.save_data();
				return true;
			}
		}
		
	}
	get_item_num(_id){
		for(let i=0;i<this._data.length;i++){
			const _element=this._data[i];
			if(_element.id===_id)
				return _element.count;
		}
		
		return 0;
	}
}

export {ItemPackage}