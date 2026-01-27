import {inventory} from './inventory.js';
import {ItemMG} from './item-mg.js';

class InventoryRoot extends inventory.Inventory {
	
	constructor(params){
		super(params);
		
	}
	
	
	add_to_root_inventory(_t_inventory){//lay' cac item cua player-ship thu thap duoc cho vao trong kho
		let _item_mg=new ItemMG();
		let _categories=_item_mg.get_all_category_name();
		
		let _item_list_2=_t_inventory._item_list;
		
		for(let i=0;i<_categories.length;i++){
			const _category=_categories[i];
			if(_item_list_2.hasOwnProperty(_category)){
				if(this._item_list.hasOwnProperty(_category)){
					for(let j=0;j<_item_list_2[_category].length;j++){
						this._item_list[_category].push(_item_list_2[_category][j]);
					}		
				}
			}
		}
		
		_t_inventory._item_list=_item_mg.get_empty_package();//reset player-ship inventory
		
		this.save_data();
		this.load_data();
	}

	
	init_data(){
		// Tạo một đối tượng để lưu trữ số lượng của mỗi item trong mỗi category
		let itemCounts = {};
		let _result=new Array();
		for (const category in this._item_list) {//console.log(category);
			if (this._item_list.hasOwnProperty(category)) {
				const items = this._item_list[category];
				// Tạo một đối tượng để lưu trữ số lượng của mỗi item trong category hiện tại
				itemCounts[category] = {};

				// Duyệt qua từng item trong mảng items
				items.forEach(item => {
					// Nếu item chưa được đếm trong category hiện tại, thêm item vào đối tượng và đếm bằng 1
					if (!itemCounts[category][item]) {
						itemCounts[category][item] = 1;
					} else {
						// Nếu item đã được đếm trước đó, tăng số lượng lên 1
						itemCounts[category][item]++;
					}
				});
			}
		}
		
		// Tạo một đối tượng mới để chứa các phần tương ứng với từng category
		let dividedItemCounts = {};
		this._dividedItemCounts=dividedItemCounts;
		

		// Duyệt qua từng category trong itemCounts và tạo các phần tương ứng
		for (const category in itemCounts) {
			if (itemCounts.hasOwnProperty(category)) {
				dividedItemCounts[category] = { itemCounts: itemCounts[category] };
			}
		}

	}
	
	save_data(){//overwrite
		var dataString = JSON.stringify(this._item_list);
		//alert(dataString);
		var currentStorageSize = JSON.stringify(localStorage).length;
		var maxSize = 5 * 1024 * 1024; // Ví dụ: giới hạn 5 MB cua browser
		if (currentStorageSize + dataString.length < maxSize){
			localStorage.setItem('inventory-root', dataString);
			localStorage.setItem('player-cash',this._cash);
			return true;
		}
		else{
			alert('LocalStorage đã đầy. Không thể lưu trữ thêm dữ liệu.(inventory-root.js)');
			return false;
		}
	}
	load_data(){//overwrite
		
		super.load_data();//de load thong tin ve cash
	
		let _my_data_str=localStorage.getItem('inventory-root');
		if(_my_data_str===null){
			let _item_mg=new ItemMG();
			this._item_list=_item_mg.get_default_items_for_root_inventory();
		}
		else{
			this._item_list=JSON.parse(_my_data_str);
		}
		
	}
	
	init_root_store_panel(){
		this.clear_store_panel();
		
		this.init_data();
		
		this._store_panel=document.createElement("div");
		this._store_panel.style.position="absolute";
		this._store_panel.style.width="600px";
		this._store_panel.style.height="70%";
		this._store_panel.style.left="25%";
		this._store_panel.style.top="15%";
		this._store_panel.style.border="2px solid transparent";
		this._store_panel.style.boxShadow="0 0 10px 5px #33BBFF";
		this._store_panel.style.backgroundColor="rgba(20, 114, 234, 0.4)";
		this._store_panel.style.zIndex="99999999999999999";
		this._game._root_div.appendChild(this._store_panel);
		
		const _close_btn=document.createElement("button");
		_close_btn.style.position="absolute";
		_close_btn.style.width="25px";
		_close_btn.style.height="25px";
		_close_btn.style.top="0%";
		_close_btn.style.right="0%";
		_close_btn.innerHTML="X";
		this._store_panel.appendChild(_close_btn);
		_close_btn.addEventListener("click",()=>{
			this.clear_store_panel();
		});
		
		const _save_btn=document.createElement("button");
		_save_btn.classList.add("ring-button");
		_save_btn.style.position="absolute";
		//_save_btn.style.width="140px";
		//_save_btn.style.height="50px";
		_save_btn.style.bottom="5px";
		_save_btn.style.left="250px";
		_save_btn.innerHTML="SAVE";
		this._store_panel.appendChild(_save_btn);
		_save_btn.addEventListener("click",()=>{
			this.clear_store_panel();
		});
		
		//button.style.cssText = cssCode;
		
		let _br=document.createElement("br");
			this._store_panel.appendChild(_br);
			_br=document.createElement("br");
			this._store_panel.appendChild(_br);
		
		let dividedItemCounts=this._dividedItemCounts;
		let colors=["rgba(37, 239, 13, 0.4)","rgba(232, 13, 239, 0.4)","rgba(252, 249, 88, 0.4)",
		"rgba(252, 249, 88, 0.4)","rgba(37, 239, 13, 0.4)","rgba(37, 239, 13, 0.4)","rgba(37, 239, 13, 0.4)",
		"rgba(37, 239, 13, 0.4)"];
		let color_id=0;
		for (const category in dividedItemCounts) {
			let _t_category=category;
			let _color=colors[color_id];color_id++;
			if (dividedItemCounts.hasOwnProperty(category)) {
				//console.log("Category:", category);
				
				let _category_container=document.createElement("div");
					_category_container.style.width="100%";
					_category_container.style.color="white";
					
				const _title=document.createElement("b");
					  _title.style.fontSize="30px";
					  _title.innerHTML=category;
					  _category_container.appendChild(_title);
					  _br=document.createElement("br");
					  _category_container.appendChild(_br);
					  
				const _item_panel=document.createElement("div");
					  _item_panel.style.width="100%";
					  _item_panel.style.display="grid";
					  _item_panel.style.gridTemplateColumns="repeat(4, 1fr)";
					  _item_panel.style.gap="10px";
					  _category_container.appendChild(_item_panel);
					  
				const itemsCount = dividedItemCounts[category].itemCounts;
				
				for (const item in itemsCount) {	
						let _t_item=item;
					const _item_container=document.createElement("div");
						  _item_container.style.textAlign="left";
						  //_item_container.style.backgroundColor=_color;
						  _item_container.style.border="2px solid transparent";
						  _item_container.style.boxShadow="0 0 10px 5px #ffffff";
						  _item_container.style.backgroundImage="linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5))";
						  _item_container.style.backgroundSize="cover";
						 
					      _item_panel.appendChild(_item_container);
					
					if (itemsCount.hasOwnProperty(item)) {
						let _content=document.createElement("div");
							_content.style.width="100px";
							_content.innerHTML="<div style='width:100px;'>+"+item+":"+itemsCount[item]+"</div>";
							_item_container.appendChild(_content);
						
						let _sell_btn=document.createElement("button");
							_sell_btn.innerHTML="SELL";
							_sell_btn.addEventListener("click",()=>{
								this.clear_store_panel();
								this.init_sell_panel(_t_category,_t_item);
							});
						_item_container.appendChild(_sell_btn);
						
					}
				}
					
					let _br2=document.createElement("br");
					_category_container.appendChild(_br2);
				
				this._store_panel.appendChild(_category_container);
			}
		}

		
	}
	
	clear_store_panel(){
		if(this._store_panel&&this._store_panel!=null){
			this._store_panel.remove();
			this._store_panel=null;
		}
	}
	
	init_sell_panel(category,item){
		this.clear_sell_panel();
		
		let _item_num=this.getItemCount(category,item);
		if(_item_num<=0)return;
		
		this._sell_panel=document.createElement("div");
		this._sell_panel.style.position="absolute";
		this._sell_panel.style.width="600px";
		this._sell_panel.style.height="70%";
		this._sell_panel.style.left="25%";
		this._sell_panel.style.top="15%";
		this._sell_panel.style.border="2px solid transparent";
		this._sell_panel.style.boxShadow="0 0 10px 5px #33BBFF";
		this._sell_panel.style.backgroundColor="rgba(20, 114, 234, 0.4)";
		this._sell_panel.style.zIndex="99999999999999999";
		this._game._root_div.appendChild(this._sell_panel);
		
		const _title=document.createElement("b");
			  _title.style.fontSize="30px";
			  _title.style.color="white";
			  _title.innerHTML=category+"-"+item;
			  this._sell_panel.appendChild(_title);
			  
		let select = document.createElement("select");
		for (let i = 1; i <= _item_num; i++) {
			let option = document.createElement("option");
			option.text = i;
			option.value = i;
			select.appendChild(option);
		}
		this._sell_panel.appendChild(select);
		
		const _close_btn=document.createElement("button");
		_close_btn.style.position="absolute";
		_close_btn.style.width="25px";
		_close_btn.style.height="25px";
		_close_btn.style.top="0%";
		_close_btn.style.right="0%";
		_close_btn.innerHTML="X";
		this._sell_panel.appendChild(_close_btn);
		_close_btn.addEventListener("click",()=>{
			this.clear_sell_panel();
		});
		
		const _sell_btn=document.createElement("button");
		_sell_btn.style.position="absolute";
		_sell_btn.style.width="75px";
		_sell_btn.style.height="45px";
		_sell_btn.style.bottom="5px";
		_sell_btn.style.right="5px";
		_sell_btn.innerHTML="FINISH";
		this._sell_panel.appendChild(_sell_btn);
		_sell_btn.addEventListener("click",()=>{
			this.clear_sell_panel();
			let _sell_num = parseInt(select.value);
			if(_sell_num>_item_num)return;
			let _itemmg=new ItemMG();
			const _unit_price=_itemmg.get_item_price(category,item);
			const _total=_unit_price*_sell_num;
			//alert("UnitPrice:"+_unit_price+" and Total:"+_total);
			this.decreaseItemCount(category, item, _sell_num);
			//alert(_item_num+" and "+_sell_num+" and "+this.getItemCount(category,item));
			this.add_cash(_total);
			this.save_data();
			this.load_data();
			//alert(this._cash);
		});
		
	}
	
	clear_sell_panel(){
		if(this._sell_panel&&this._sell_panel!=null){
			this._sell_panel.remove();
			this._sell_panel=null;
		}
	}
	
}
export {InventoryRoot}