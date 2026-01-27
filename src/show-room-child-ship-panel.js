

class ShowRoomChildShipPanel{
	constructor(params){
		this._game=params.game;
		this._ship_package=params.ship_package;
	}
	init(){//num4:exploration rocket
		let num1=this._ship_package.get_rocket_num_1();
		let num2=this._ship_package.get_rocket_num_2();
		let num3=this._ship_package.get_rocket_num_3();
		let num4=this._ship_package.get_exploration_ship_num();
		let _max_rocket_num=this._ship_package.get_max_rocket_num();
		
		//num1=2;num2=1;num3=3;num4=3;_max_rocket_num=10;
		
		
		let _id_list=new Array();//neu' trong ship_package co' luu 1 so rocket thi them vao panel
		let _counter1=0,_counter2=0,_counter3=0,_counter4=0;
		let _max_num=Math.max(num1, num2, num3, num4);//tim so lon' nhat
		for(let i=0;i<_max_num;i++){
				if(i<num1)_id_list.push(1);
				if(i<num2)_id_list.push(2);
				if(i<num3)_id_list.push(3);
				if(i<num4)_id_list.push(4);
		}
		_id_list.sort(function(a, b) {//sap xep theo thu tu tu nho den lon
			return a - b;
		});
		
	
		//this._count=num1+num2+num3+num4;
		this._count=_max_rocket_num;//so luong o kha? dung
		const _colNum=6;
		const _rowNum=6;
		const _totalNum=_colNum*_rowNum;
		//alert(num1);alert(num2);alert(num3);alert(num4);
		//alert("Num1="+num1+" and "+"Num2="+num2+" and "+"Num3="+num3+" and "+"Num4="+num4);
		this._list=new Array();
		
		if(this._count>_totalNum){
			alert("The number of rockets exceeds the limit(show-room-rocket-panel.js)");
			return false;
		}
		
		if(this._child_ships_panel){
			this._child_ships_panel.remove();
		}
		
		this._child_ships_panel=document.createElement("div");
		this._child_ships_panel.style.position="absolute";
		this._child_ships_panel.style.width="600px";
		this._child_ships_panel.style.height="70%";
		this._child_ships_panel.style.left="25%";
		this._child_ships_panel.style.top="15%";
		this._child_ships_panel.style.backgroundColor="rgba(20, 114, 234, 0.4)";
		this._child_ships_panel.style.zIndex="99999999999999999";
		document.getElementById("root-container").appendChild(this._child_ships_panel);
		
		
		const _close_btn=document.createElement("button");
		_close_btn.style.position="absolute";
		_close_btn.style.width="25px";
		_close_btn.style.height="25px";
		_close_btn.style.top="0%";
		_close_btn.style.right="0%";
		_close_btn.innerHTML="X";
		this._child_ships_panel.appendChild(_close_btn);
		_close_btn.addEventListener("click",()=>{
			this.clear_panel();
		});
		
		const _save_btn=document.createElement("button");
		_save_btn.style.position="absolute";
		_save_btn.style.width="75px";
		_save_btn.style.height="45px";
		_save_btn.style.bottom="5px";
		_save_btn.style.right="5px";
		_save_btn.innerHTML="SAVE";
		this._child_ships_panel.appendChild(_save_btn);
		_save_btn.addEventListener("click",()=>{
			this.clear_panel();
		});
		
		const _width=60;
		const _height=_width;
		const _spX=_width+10;
		const _spY=_spX;
		const _fx=50;
		const _fy=50;
		
		const _border_style_1="solid white 1px";
		const _border_style_2="solid yellow 1px"
		
		let _px,_py;
		let _colID=0,_rowID=0;
		
		for(let i=0;i<_totalNum;i++){
			_px=(_colID*_spX);
			_py=(_rowID*_spY);
				let _icon_container=document.createElement("div");
				this._list.push(_icon_container);
				_icon_container.style.position="absolute";
				_icon_container.style.width=_width+"px";
				_icon_container.style.height=_height+"px";
				_icon_container.style.left=_px+"px";
				_icon_container.style.top=_py+"px";
				_icon_container.style.backgroundColor="rgba(255, 0, 0, 0.4)";
				_icon_container._selected=false;
				const _container_id=i;
				_icon_container._container_id=_container_id;
				_icon_container.id="showroom-rocket-icon-"+i;
				_icon_container._contain_id=null;
				_icon_container.addEventListener("click",()=>{
					if(_icon_container._container_id<this._count){
						_icon_container.style.border=_border_style_2;
						if(this._select_container){
							this._select_container.style.border=_border_style_1;
						}
						this._select_container=_icon_container;
					}
						
				});
				if(i<this._count){
					_icon_container.style.border=_border_style_1;
					
					if(i<_id_list.length){
						let _icon_id=_id_list[i];
						
						this.add_icon(_icon_id,_icon_container);
					}
						
				}
				if(i===this._count){//add button
					//_icon_container.style.border="solid yellow 1px";
					
					this.create_add_button(_width,_height,_icon_container,_border_style_2);
				}
				
				this._child_ships_panel.appendChild(_icon_container);
			_colID++;
			if(_colID>=_colNum){
				_colID=0;
				_rowID++;
			}
		}
		
		const _store_panel=this.create_store_panel(num1,num2,num3,num4);
		_store_panel.style.top="50px";
		_store_panel.style.left="450px";
		this._child_ships_panel.appendChild(_store_panel);
	}
	clear_panel(){
		this._child_ships_panel.remove();
			
			let _rs1=0,_rs2=0,_rs3=0,_rs4=0;
			for(let i=0;i<this._list.length;i++){
				const _rs=this._list[i]._contain_id;
				if(_rs===1)_rs1++;
				if(_rs===2)_rs2++;
				if(_rs===3)_rs3++;
				if(_rs===4)_rs4++;
			}
			this._ship_package.set_rocket_num_1(_rs1);
			this._ship_package.set_rocket_num_2(_rs2);
			this._ship_package.set_rocket_num_3(_rs3);
			this._ship_package.set_exploration_ship_num(_rs4);
			this._ship_package.save_data();
			this._game._warehouse.save_data();
			alert("Num1="+_rs1+" and "+"Num2="+_rs2+" and "+"Num3="+_rs3+" and "+"Num4="+_rs4);
			
	}
	create_add_button(_width,_height,_icon_container,_border_style_2){
		let _add_btn=this.get_add_button(_width,_height,()=>{
						_icon_container.style.border=_border_style_2;
						_icon_container.innerHTML="";
						this._ship_package.increase_max_rocket_num();
						this._count++;
						const _next=document.getElementById("showroom-rocket-icon-"+(_icon_container._container_id+1));
						if(_next!=null){
							this.create_add_button(_width,_height,_next,_border_style_2);
						}
					});
					_icon_container.appendChild(_add_btn);
	}
	get_add_button(_width,_height,_fc){
		let _add_btn=document.createElement("button");
					_add_btn.style.position="absolute";
					_add_btn.style.width=_width/3+"px";
					_add_btn.style.height=_height/3+"px";
					_add_btn.style.left=_width/3.5+"px";
					_add_btn.style.top=_height/3.5+"px";
					_add_btn.style.fontSize="10px";
					_add_btn.innerHTML="+";
					
					_add_btn.addEventListener("click",()=>{
						_fc();
						//this._child_ships_panel.remove();
						//this._children_ship_panel=new ChildrenShipPanel({game:this._game,container:this._root_container});
						//this._children_ship_panel.init();
					});
		return _add_btn;
	}
	add_icon(_icon_id,_icon_container){
		let _img=this.get_rocket_icon(_icon_id,"100%","100%",()=>{
						_img.remove();
						_icon_container._contain_id=null;
						//this._game._warehouse.inc
						//_icon_container._selected=false;
						this.get_increase_function(_icon_id)();
						this.update_store_item();
					});
					_icon_container.appendChild(_img);
					_icon_container._contain_id=_icon_id;
	}
	
	create_store_panel(num1,num2,num3,num4){//kho luu tru
		let _store_panel=document.createElement("div");
		_store_panel.style.position="absolute";
		
		const _item1=this.get_store_item(1,this._game._warehouse.get_rocket_num_1(),"0px","0px",
		this._game._warehouse.increase_rocket_num_1);
		_store_panel.appendChild(_item1);
		const _item2=this.get_store_item(2,this._game._warehouse.get_rocket_num_2(),"70px","0px",
		this._game._warehouse.increase_rocket_num_2);
		_store_panel.appendChild(_item2);
		const _item3=this.get_store_item(3,this._game._warehouse.get_rocket_num_3(),"140px","0px",
		this._game._warehouse.increase_rocket_num_3);
		_store_panel.appendChild(_item3);
		const _item4=this.get_store_item(4,this._game._warehouse.get_exploration_ship_num(),"210px","0px",
		this._game._warehouse.increase_exploration_ship_num);
		_store_panel.appendChild(_item4);
		
		this._store_item_list=new Array();
		this._store_item_list.push([_item1,this._game._warehouse.get_rocket_num_1]);
		this._store_item_list.push([_item2,this._game._warehouse.get_rocket_num_2]);
		this._store_item_list.push([_item3,this._game._warehouse.get_rocket_num_3]);
		this._store_item_list.push([_item4,this._game._warehouse.get_exploration_ship_num]);
		
		this.update_store_item();
		
		return _store_panel;
	}
	update_store_item(){
		for(let i=0;i<this._store_item_list.length;i++){
			const _element=this._store_item_list[i];
			const _label=_element[0]._label;
			const _fc=_element[1];
			
			_label.innerHTML=_fc();
		}
	}
	get_store_item(_id,_num,_top,_left,_fc){
		let _item=document.createElement("div");
		_item.style.position="absolute";
		_item.style.top=_top;
		_item.style.left=_left;
		
		const _path="./resources/icons/";
		let _file_name="";
		if(_id===1)_file_name="missle-1.png";
		if(_id===2)_file_name="missle-2.png";
		if(_id===3)_file_name="missle-3.png";
		if(_id===4)_file_name="exploration-ship.png";
		
		const _img=document.createElement("img");
		_img.src=_path+_file_name;
		_img.style.width="50px";
		_img.style.height="50px";
		_item.appendChild(_img);
		_img.addEventListener("click",()=>{
			const _remain_num=this.get_num_function(_id)();
			if(_remain_num<=0)return;
			
			let _t_container=null;
			
			if(!this._select_container||this._select_container===null){
				for(let i=0;i<this._list.length;i++){//Neu chua co' container nao duoc chon thi tu dong chon
					let _icon_container=this._list[i];
					if(_icon_container._container_id<this._count&&_icon_container._contain_id===null){
						_t_container=_icon_container;
						break;
					}
				}
			}
			else{
				_t_container=this._select_container;
			}
			if(_t_container===null)
				return;//neu ko con container trong' thi huy bo
			
			//if(this._select_container&&this._select_container!=null){
				if(_t_container._contain_id!=null){
					_t_container.innerHTML="";
					const _rs=this.get_increase_function(_t_container._contain_id)();
					_t_container._contain_id=null;
				}
				this.add_icon(_id,_t_container);
				this.get_decrease_function(_id)();
				this.update_store_item();
			//}
			this._select_container=null;
		});
		
		const _label=document.createElement("div");
		_label.style.position="absolute";
		_label.style.top="-5px";
		_label.style.left="-5px";
		_label.style.width="25px";
		_label.style.height="5px";
		_label.style.color="white";
		_label.style.fontSize="20px";
		_label.innerHTML=_num;
		_item.appendChild(_label);
		
		const _btn=document.createElement("button");
		_btn.style.position="absolute";
		_btn.style.top="0px";
		_btn.style.left="80px";
		_btn.style.width="30px";
		_btn.style.height="30px";
		_btn.innerHTML="+";
		_item.appendChild(_btn);
		_btn.addEventListener("click",()=>{
			_fc();
			this.update_store_item();
			this._game._warehouse.save_data();
		});
		
		_item._label=_label;
		
		return _item;
	}
	
	get_rocket_icon(_id,_width,_height,_fc){
		const _path="./resources/icons/";
		let _file_name="";
		if(_id===1)_file_name="missle-1.png";
		if(_id===2)_file_name="missle-2.png";
		if(_id===3)_file_name="missle-3.png";
		if(_id===4)_file_name="exploration-ship.png";
		
		let _icon=document.createElement("div");
		_icon.style.width=_width;
		_icon.style.height=_height;
		const _img=document.createElement("img");
		_img.src=_path+_file_name;
		_img.style.width="100%";
		_img.style.height="100%";
		_icon.appendChild(_img);
		
		_icon.addEventListener("click",()=>{
			_fc();
		});
		
		return _icon;
	}
	
	get_increase_function(_id){
		if(_id===1)return this._game._warehouse.increase_rocket_num_1;
		if(_id===2)return this._game._warehouse.increase_rocket_num_2;
		if(_id===3)return this._game._warehouse.increase_rocket_num_3;
		if(_id===4)return this._game._warehouse.increase_exploration_ship_num;
	}
	get_decrease_function(_id){
		if(_id===1)return this._game._warehouse.get_rocket_num_1;
		if(_id===2)return this._game._warehouse.get_rocket_num_2;
		if(_id===3)return this._game._warehouse.get_rocket_num_3;
		if(_id===4)return this._game._warehouse.decrease_exploration_ship_num;
	}
	get_num_function(_id){
		if(_id===1)return this._game._warehouse.decrease_rocket_num_1;
		if(_id===2)return this._game._warehouse.decrease_rocket_num_2;
		if(_id===3)return this._game._warehouse.decrease_rocket_num_3;
		if(_id===4)return this._game._warehouse.get_exploration_ship_num;
	}
}
export {ShowRoomChildShipPanel}