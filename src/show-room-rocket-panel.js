

class ShowRoomRocketPanel{
	constructor(params){
		this._game=params.game;
		this._ship_package=params.ship_package;
		if(params.root_ui)
			this._root_ui=params.root_ui;
		else
			this._root_ui=document.getElementById("root-container");
		
		if(params.close_panel_callback)
			this._close_panel_callback=params.close_panel_callback;
		else
			this._close_panel_callback=()=>{};
		/*
			Su dung de thong bao khi 1 rocket nao do duoc kich hoat
			Chi thong bao 1 lan ko thong bao lai
		*/
		let _notic_rocket_data_name="showroom-rocket-notic-data";
		let _notic_data=this._game.get_data_in_database(_notic_rocket_data_name);
		let _reset_notic_data=()=>{
			_notic_data=new Array();
			this._game.update_data_in_database(_notic_rocket_data_name,_notic_data);
		};
		if(_notic_data===null){
			_reset_notic_data();
		}
		this._add_noticed_rocket_id=(_ship_id,_rocket_id)=>{
			for(let i=0;i<_notic_data.length;i++){
				if(_notic_data[i].ship_id===_ship_id&&_notic_data[i].rocket_id===_rocket_id)
					return false;
			}
			_notic_data.push({ship_id:_ship_id,rocket_id:_rocket_id});
			this._game.update_data_in_database(_notic_rocket_data_name,_notic_data);
			
			return true;
			
		};
	}
	play_sound(_sid){
		if(this._game._show_room)
			this._game._show_room._show_room_sound.play(_sid);
	}
	init(){
		
		this._rocket_ids=this._ship_package.get_rocket_in_compartment_id();
		//this._rocket_ids.reverse();
		//alert(this._rocket_ids);
		let num1=this._ship_package.get_rocket_num(this._rocket_ids[0]);
		let num2=this._ship_package.get_rocket_num(this._rocket_ids[1]);
		let num3=this._ship_package.get_rocket_num(this._rocket_ids[2]);
		let num4=this._ship_package.get_rocket_num(this._rocket_ids[3]);
		let _max_rocket_num=this._ship_package.get_max_rocket_num();
		//alert(num1+" and "+num2+" and "+num3+" and "+num4);
		//num1=2;num2=1;num3=3;num4=3;_max_rocket_num=10;
		
		
		let _id_list=new Array();//neu' trong ship_package co' luu 1 so rocket thi them vao panel
		let _counter1=0,_counter2=0,_counter3=0,_counter4=0;
		let _max_num=Math.max(num1, num2, num3, num4);//tim so lon' nhat
		for(let i=0;i<_max_num;i++){
				if(i<num1)_id_list.push(this._rocket_ids[0]);
				if(i<num2)_id_list.push(this._rocket_ids[1]);
				if(i<num3)_id_list.push(this._rocket_ids[2]);
				if(i<num4)_id_list.push(this._rocket_ids[3]);
		}
		_id_list.sort(function(a, b) {//sap xep theo thu tu tu nho den lon
			return a - b;
		});
		_id_list.reverse();
	
		//this._count=num1+num2+num3+num4;
		this._count=_max_rocket_num;//so luong o kha? dung
		const _colNum=7;
		const _rowNum=7;
		const _totalNum=_colNum*_rowNum;
		
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
		this._child_ships_panel.style.width="700px";
		this._child_ships_panel.style.height="70%";
		this._child_ships_panel.style.left="23%";
		this._child_ships_panel.style.top="15%";
		this._child_ships_panel.style.border="2px solid transparent";
		this._child_ships_panel.style.boxShadow="0 0 10px 5px #33BBFF";
		this._child_ships_panel.style.backgroundColor="rgba(0, 0, 0, 0.9)";
		this._child_ships_panel.style.zIndex="99999999999999999";
		this._root_ui.appendChild(this._child_ships_panel);
		
		this._child_ships_panel.style.transform="scale(1.3)";
		this._child_ships_panel.style.transformOrigin="center";
		
		const _close_btn=document.createElement("button");
		_close_btn.classList.add('custom-new-btn','new-btn-2');
		_close_btn.style.position="absolute";
		_close_btn.style.width="25px";
		_close_btn.style.height="25px";
		_close_btn.style.top="0%";
		_close_btn.style.right="0%";
		_close_btn.innerHTML="X";
		this._child_ships_panel.appendChild(_close_btn);
		_close_btn.addEventListener("click",()=>{
			this.play_sound('click3');
			this.clear_panel();
			this._close_panel_callback();
		});
		
		const _save_btn=document.createElement("button");
		_save_btn.classList.add('custom-new-btn','new-btn-2');
		_save_btn.style.position="absolute";
		_save_btn.style.width="75px";
		_save_btn.style.height="45px";
		_save_btn.style.bottom="5px";
		_save_btn.style.right="5px";
		_save_btn.innerHTML="SAVE";
		this._child_ships_panel.appendChild(_save_btn);
		_save_btn.addEventListener("click",()=>{
			this.play_sound('click4');
			this.clear_panel();
			this._close_panel_callback();
		});
		
		const _width=50;
		const _height=_width;
		const _spX=_width+10;
		const _spY=_spX;
		const _fx=50;
		const _fy=50;
		
		const _border_style_1="0 0 10px 5px";
		const _border_style_2="0 0 10px 5px #7DFF33"
		
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
				_icon_container.style.border="1px solid transparent";
				_icon_container.style.backgroundColor="rgba(202, 213, 196, 0.4)";
				_icon_container._selected=false;
				const _container_id=i;
				_icon_container._container_id=_container_id;
				_icon_container.id="showroom-rocket-icon-"+i;
				_icon_container._contain_id=null;
				_icon_container.addEventListener("click",(event)=>{
					event.preventDefault();
					this.play_sound('click2');
					if(_icon_container._container_id<this._count){
						_icon_container.style.boxShadow=_border_style_2;
						if(this._select_container){
							this._select_container.style.boxShadow=_border_style_1;
						}
						this._select_container=_icon_container;
					}
						
				});
				if(i<this._count){
					_icon_container.style.boxShadow=_border_style_1;
					
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
	
	get_rocket_types(){//so luong type of rocket trong panel
		let _type_list=new Array();//dung de kiem tra xem co bao nhieu loai rocket
			for(let i=0;i<this._list.length;i++){
				const _id1=this._list[i]._contain_id;
				if(_id1===null)continue;
				let _found=false;
				for(let j=0;j<_type_list.length;j++){
					const _id2=_type_list[j];
					if(_id2===_id1){
						_found=true;
						break;
					}
				}
				if(!_found)_type_list.push(_id1);
			}
		return _type_list;
	}
	remove(){
		this.clear_panel();
		
	}
	clear_panel(){
			//alert(this._rocket_ids);
			//this._rocket_ids=this._ship_package.get_rocket_in_compartment_id();//reset lai
			
			let _type_list=this.get_rocket_types();
			
			//alert(_type_list);
			if(_type_list.length>3){
				//alert("chi duoc chon toi da 3 loai rocket");
				this._game.createMessageBox("Notification",
									"No more than 3 types of rockets",
									()=>{
							
									});
				return false;
			}
			
			
			for(let i=0;i<this._rocket_ids.length;i++){//những id nào nằm trong list cũ mà ko có trong list mới thì phải set=0 để tránh gây lỗi
				const _id1=this._rocket_ids[i];//(lỗi xảy ra khi xóa hết 1 loại rocket khỏi ship-package thì nó ko update vào data, tức là ko hề xóa đi)
				let _found=false;
				for(let j=0;j<_type_list.length;j++){
					const _id2=_type_list[j];
					if(_id1===_id2){
						_found=true;
						break;
					}
				}
				if(!_found){
					this._ship_package.set_rocket_num(_id1,0);
				}
			}
			
			this._rocket_ids=_type_list;
			
			this._child_ships_panel.remove();
			
			let _rs1=0,_rs2=0,_rs3=0,_rs4=0;
			for(let i=0;i<this._list.length;i++){
				const _rs=this._list[i]._contain_id;//alert(this._list[i]._contain_id);
				if(this._rocket_ids[0])if(_rs===this._rocket_ids[0])_rs1++;
				if(this._rocket_ids[1])if(_rs===this._rocket_ids[1])_rs2++;
				if(this._rocket_ids[2])if(_rs===this._rocket_ids[2])_rs3++;
				if(this._rocket_ids[3])if(_rs===this._rocket_ids[3])_rs4++;
			}//alert(this._rocket_ids[0]+"="+_rs1);
			if(this._rocket_ids[0])this._ship_package.set_rocket_num(this._rocket_ids[0],_rs1);
			if(this._rocket_ids[1])this._ship_package.set_rocket_num(this._rocket_ids[1],_rs2);
			if(this._rocket_ids[2])this._ship_package.set_rocket_num(this._rocket_ids[2],_rs3);
			if(this._rocket_ids[3])this._ship_package.set_rocket_num(this._rocket_ids[3],_rs4);
			this._ship_package.save_data();
			this._game._warehouse.save_data();
			
			
	}
	create_add_button(_width,_height,_icon_container,_border_style_2){//add rocket slot button
		let _add_btn=this.get_add_button(_width,_height,()=>{
						this.clear_panel();
						
						const _current_rocket_slot_num=this._ship_package.get_max_rocket_num();
						const _current_ship_level=this._ship_package.get_ship_level();
						const _ship_level_required=this._game._parameters._get_increase_rocket_slot_level_require(_current_rocket_slot_num,_current_ship_level);
						if(_current_ship_level<_ship_level_required){
							this._game.createMessageBox("Request Not Available","Required ship level: "+_ship_level_required,()=>{
								this.init();
							});
							return false;
						}
						
						
						const title="Add Rocket Slot";
						const content="<h2>"+this._game._parameters._price_add_1_rocket_slot+"$</h2>";
						const _fc1=()=>{
							
							const _cash=this._game._root_inventory.GetCash();
						    if(this._game._parameters._price_add_1_rocket_slot>_cash){
								this._game.createMessageBox("Transaction Failed","Not enough money",()=>{});
								this.play_sound('fail1');
								return;
					        }
							this.play_sound('sucess2');
							this._game._root_inventory.TakeCash(this._game._parameters._price_add_1_rocket_slot);
							_icon_container.style.border=_border_style_2;
							_icon_container.innerHTML="";
							this._ship_package.increase_max_rocket_num();
							this._ship_package.save_data();
							this._count++;
							const _next=document.getElementById("showroom-rocket-icon-"+(_icon_container._container_id+1));
							if(_next!=null){
								this.create_add_button(_width,_height,_next,_border_style_2);
							}
							
							this.init();
						};
						const _fc2=()=>{
							this.init();
						};
						this._game.createConfirmBox(title,content,_fc1,_fc2);			
					});
					_icon_container.appendChild(_add_btn);
	}
	get_add_button(_width,_height,_fc){
		let _add_btn=document.createElement("button");
					_add_btn.classList.add('custom-new-btn','new-btn-2');
					_add_btn.style.position="absolute";
					_add_btn.style.width=_width/2+"px";
					_add_btn.style.height=_height/2+"px";
					_add_btn.style.left=_width/4+"px";
					_add_btn.style.top=_height/4+"px";
					_add_btn.style.fontSize="20px";
					_add_btn.style.fontWeight="500";
					_add_btn.style.textAlign="center";
					_add_btn.innerHTML="+";
					
					_add_btn.addEventListener("click",()=>{
						this.play_sound('click2');
						_fc();
						//this._child_ships_panel.remove();
						//this._children_ship_panel=new ChildrenShipPanel({game:this._game,container:this._root_container});
						//this._children_ship_panel.init();
					});
		return _add_btn;
	}
	add_icon(_icon_id,_icon_container,_add_effect){//ô rocket trong ship-package panel
		let _img=this.get_rocket_icon(_icon_id,"100%","100%",()=>{
						_img.remove();
						_icon_container._contain_id=null;
						
						this._game._warehouse.add_rocket_num(_icon_id,1);
						this.update_store_item();
					});
					_icon_container.appendChild(_img);
					_icon_container._contain_id=_icon_id;
		
		if(_add_effect===true){//tao pulse effect
			//this._game._show_room._show_room_sound.play('drum1');
			let _effect_container=document.createElement("div");
			_effect_container.classList.add("ripple-loader");
			_effect_container.innerHTML="<div></div><div></div>";
			_effect_container.style.position="absolute";
			_effect_container.style.width="100%";
			_effect_container.style.height="100%";
			_effect_container.style.left="-10px";
			_effect_container.style.top="-10px";
			
			_icon_container.appendChild(_effect_container);
			//let _pos;
			/*
			if(this._game._root_div){
				_pos=this.getRelativePosition(_img,this._game._root_div);
				this._game._root_div.appendChild(_effect_container);
			}
			else{
				_pos=this.getAbsolutePosition(_img);
				document.body.appendChild(_effect_container);
			}
			*/
			//_pos=this.getRelativePosition(_img,this._game._root_div);
				//_pos=this.getAbsolutePosition(_img);
				//this._game._root_div.appendChild(_effect_container);
				//document.body.appendChild(_effect_container);
			//_effect_container.style.left=(_pos.x*(window.innerWidth/this._game._graphics._standardW))+"px";
			//_effect_container.style.top=(_pos.y*(window.innerHeight/this._game._graphics._standardH))+"px";
			//_effect_container.style.left=(_pos.x)+"px";
			//_effect_container.style.top=(_pos.y)+"px";
			
			this._game.add_to_timer(()=>{
				_effect_container.remove();
			},2);
		}
		
	}
	getAbsolutePosition(_element) {//lay toa do tuyet doi cua element trong dom
		const rect = _element.getBoundingClientRect();
		const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
		const scrollTop = window.scrollY || document.documentElement.scrollTop;
  
		return {
			x: rect.left + scrollLeft,
			y: rect.top + scrollTop
		};
	}
	getRelativePosition(fromElement, toElement) {//lay toa do cua element A so voi element B
		const fromRect = fromElement.getBoundingClientRect();
		const toRect = toElement.getBoundingClientRect();

		return {
			x: fromRect.left - toRect.left,
			y: fromRect.top - toRect.top
		};
	}
	
	create_store_panel(num1,num2,num3,num4){//kho luu tru
		let _store_panel=document.createElement("div");
		_store_panel.style.position="absolute";
		
		this._store_item_list=new Array();
		const _t_list=this.get_all_rockets_infor();
		const _pos_list=[
			{x:"0px",y:"0px"},
			{x:"70px",y:"0px"},
			{x:"140px",y:"0px"},
			{x:"210px",y:"0px"},
			{x:"0px",y:"110px"},
			{x:"70px",y:"110px"},
			{x:"140px",y:"110px"},
			{x:"210px",y:"110px"}
		];
		if(_t_list.length>_pos_list.length){
			alert("So luong pos-array ko du");
			return;
		}
		for(let i=0;i<_t_list.length;i++){
			const _id=_t_list[i].id;
			const _pos=_pos_list[i];
			const _item1=this.get_store_item(_id,this._game._warehouse.get_rocket_num(_id),_pos.x,_pos.y,
			this._game._warehouse.add_rocket_num_1);
			_store_panel.appendChild(_item1);
			this._store_item_list.push([_id,_item1,this._game._warehouse.get_rocket_num_1]);
		}
		
		this.update_store_item();
		
		return _store_panel;
	}
	update_store_item(){
		let _ship_level=this._ship_package.get_ship_level();
		
		for(let i=0;i<this._store_item_list.length;i++){
			const _element=this._store_item_list[i];
			const _id=_element[0];
			const _label=_element[1]._label;
			//const _fc=_element[1];
			
			let _level_require=this._game._unitMG.get_rocket_level_require(_id);//ship-level yeu cau de co the su dung rocket(tinh' rieng theo tung ship)
		
			let _labelContent;
			if(_level_require>_ship_level){
				_labelContent=`<b  style="
									background: linear-gradient(to bottom, turquoise,white, yellow);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
									font-size: 12px;
									font-weight: bold;
				"'>Lv:`+_level_require+`</b>`;
			}
			else{
				_labelContent=this._game._warehouse.get_rocket_num(_id);
			}
			_label.innerHTML=_labelContent;
		}
	}
	get_store_item(_id,_num,_top,_left){//create icon trong store panel
		let _ship_id=this._ship_package.get_ship_id();
		let _ship_level=this._ship_package.get_ship_level();
		let _level_require=this._game._unitMG.get_rocket_level_require(_id);//ship-level yeu cau de co the su dung rocket(tinh' rieng theo tung ship)
		//alert("ID="+_id+" LevelRequire="+_level_require+" ShipLevel="+_ship_level);
		
		let _item=document.createElement("div");
		_item.style.position="absolute";
		_item.style.top=_top;
		_item.style.left=_left;
		_item.style.width="50px";
		_item.style.height="50px";
		//_item.style.width="200px";
		//_item.style.overflow="hidden";
		//_item.style.borderImage="linear-gradient(-90deg, #fc00ff, #F0CB35, #2c7744, #1fddff) 1";
		//_item.style.border="white 1px solid";
		_item.style.background="linear-gradient(to right, black, gray)";
		
		let _file_name=this.get_rocket_image_path(_id);
		
		const _img=document.createElement("img");
		_img.src=_file_name;
		_img.style.width="50px";
		_img.style.height="50px";
		//_img.style.transform="scale(1.3)";
		_img.style.clipPath="inset(4px 4px 4px 4px)";
		//_img.style.border="solid 1px black";
		_img.style.borderRadius="15px";
		_img.style.filter="brightness( 220% ) ";
		
		_item.appendChild(_img);
		
		
		let _not_noticed=null;
		if(_level_require<=_ship_level)
			_not_noticed=this._add_noticed_rocket_id(_ship_id,_id);
		if(_not_noticed===true){//hieu ung khi rocket moi' duoc kich hoat
			/*
				Khi rocket kich hoat se tu dong add 10 rocket vao kho
			*/
			this._game._warehouse.add_rocket_num(_id,10);//<=============Quan Trong
			let _effect_container=document.createElement("div");
					   _effect_container.classList.add("ripple-loader");
					   _effect_container.innerHTML="<div></div><div></div>";
					   _effect_container.style.position="absolute";
					   _effect_container.style.width="140%";
					   _effect_container.style.height="140%";
					   _effect_container.style.left="-5px";
					   _effect_container.style.top="-5px";
					   _effect_container.style.filter="brightness( 190% ) ";
					   _effect_container.addEventListener("click",()=>{_img.click();});
					   _item.appendChild(_effect_container);
					   _item.style.transformOrigin="center";
					   this._game.add_to_timer(()=>{
							_effect_container.remove();
						},4);
						//add_to_function_list_2
						//remove_function_from_list_2
						let _zoom=false;
						let _zoom_fc=()=>{
							if(!_zoom){
								//if(this._game._show_room)
									_item.style.transform="scale(1.2)";
								//else
									//_item.style.visibility="hidden";
							}
							else{
								//if(this._game._show_room)
									_item.style.transform="scale(1.0)";
								//else
									//_item.style.visibility="visible";
							}
							_zoom=!_zoom;
						};
						this._game.add_to_every_second_passes_fcs(_zoom_fc);
						this._game.add_to_timer(()=>{
							this._game.remove_from_every_second_passes_fcs(_zoom_fc);
							_item.style.transform="scale(1.0)";
						},7);
		}
		
		_img.addEventListener("click",(event)=>{
			event.preventDefault();
			this.play_sound('click2');
			//const _remain_num=this.get_num_function(_id)();
			const _remain_num=this._game._warehouse.get_rocket_num(_id);
			if(_remain_num<=0)return;
			
			let _type_list=this.get_rocket_types();
			if(_type_list.length>=3){
				let _found=false;
				for(let i=0;i<_type_list.length;i++){
					if(_type_list[i]===_id){
						_found=true;
						break;
					}
				}
				if(!_found){//khi da co 3 type of roket ma them 1 rocket thuoc type khac
					this._game.createMessageBox("Notification",
									"No more than 3 types of rockets",
									()=>{
							
									});
					return false;
				}
			}
			
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
			
				if(_t_container._contain_id!=null){
					_t_container.innerHTML="";
					//const _rs=this.get_increase_function(_t_container._contain_id)();
					this._game._warehouse.add_rocket_num(_id,1);
					_t_container._contain_id=null;
				}
				this.add_icon(_id,_t_container,true);
				//this.get_decrease_function(_id)();
				this._game._warehouse.minus_rocket_num(_id,1);
				this.update_store_item();
			
			this._select_container=null;
		});
		
		let _labelContent=_num;
		let _color="yellow";
		if(_level_require>_ship_level){
			_color="red";
		}
		
		const _label=document.createElement("div");//hien thi so luong trong kho
		_label.style.position="absolute";
		_label.style.top="-15px";
		_label.style.left="-15px";
		_label.style.width="35px";
		_label.style.height="35px";
		_label.style.color=_color;
		_label.style.fontSize="15px";
		_label.style.fontFamily="'Courier New', Courier, monospace";
		_label.style.fontWeight="600";
		_label.style.backgroundColor="rgba(0, 0, 0, 0.6)";
		//_label.style.border="1px solid white";
		_label.style.borderRadius="50px";
		_label.style.justifyContent="center";
		_label.style.display="flex";
		_label.style.alignItems="center";
		_label.innerHTML=`<i  style="
									background: linear-gradient(to bottom, turquoise,white, yellow);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
									
				"'>`+_labelContent+`</i>`;
		_item.appendChild(_label);
		
		
		if(_level_require<=_ship_level){
			const _btn=document.createElement("button");//them vao kho
			_btn.classList.add('custom-new-btn','new-btn-2');
			_btn.style.position="absolute";
			_btn.style.top="10px";
			_btn.style.left="60px";
			_btn.style.width="27px";
			_btn.style.height="27px";
			_btn.style.fontSize="13px";
			_btn.style.fontWeight="600";
			_btn.innerHTML="+";
			_item.appendChild(_btn);
			_btn.addEventListener("click",()=>{
				this.play_sound('click2');
				this.clear_panel();
				this.show_market_panel(_id);
			});
		}
		_item._label=_label;
		
		return _item;
	}
	
	show_market_panel(_id){//panel mua ban rocket
	
		if(this._market_panel&&this._market_panel!=null){
			this._market_panel.remove();
			this._market_panel=null;
		}
	
		this._market_panel=document.createElement("div");
		this._market_panel.style.position="absolute";
		this._market_panel.style.width="600px";
		this._market_panel.style.height="70%";
		this._market_panel.style.left="25%";
		this._market_panel.style.top="15%";
		this._market_panel.style.border="2px solid transparent";
		this._market_panel.style.boxShadow="0 0 10px 5px #33BBFF";
		this._market_panel.style.backgroundColor="rgba(0, 0, 0, 0.8)";
		this._market_panel.style.zIndex="99999999999999999";
		this._root_ui.appendChild(this._market_panel);
		
		this._market_panel.style.transform="scale(1.23)";
		this._market_panel.style.transformOrigin="center";
		
		const _close_btn=document.createElement("button");
		_close_btn.style.position="absolute";
		_close_btn.style.width="30px";
		_close_btn.style.height="30px";
		_close_btn.style.top="0%";
		_close_btn.style.right="0%";
		_close_btn.innerHTML="X";
		this._market_panel.appendChild(_close_btn);
		_close_btn.addEventListener("click",()=>{
			this.close_market_panel();
		});
		
		const _unit_price=this.get_rocket_price(_id);
		const _price_infor=[
			{quantity:1,total:_unit_price},
			{quantity:2,total:_unit_price*2},
			{quantity:5,total:_unit_price*4},
			{quantity:10,total:_unit_price*8},
			{quantity:20,total:_unit_price*16},
			{quantity:30,total:_unit_price*24},
			{quantity:50,total:_unit_price*42},
			{quantity:100,total:_unit_price*70},
			//{quantity:1000,total:_unit_price*9999999999}
		];
		
		let _infor_panel=document.createElement("div");
			_infor_panel.style.marginLeft="100px";
			_infor_panel.style.marginTop="5px";
			_infor_panel.style.width="70%";
		for(let i=0;i<_price_infor.length;i++){
			const _infor=_price_infor[i];
			let _quantity=parseInt(_infor.quantity);
			let _total=parseInt(_infor.total);
			
			const _line=document.createElement("div");
				  _line.style.width="100%";
				  _line.style.height="40px";
				  _line.style.borderBottom="1px solid #ffffff";
				  //_line.style.border="solid white 1px";
				  _line.style.display="flex";
			const _image=this.get_rocket_icon(_id,"35px","35px",()=>{});
				  _image.style.display="inline-block";
				  _image.style.marginRight="10px";
				  _image.style.boxShadow="0 0 5px 2px #FFFFFF";
				  _line.appendChild(_image);
			const _number=document.createElement("div");
				  _number.style.color="white";
				  _number.style.fontSize="20px";
				  _number.style.width="280px";
				  _number.style.marginTop="7px";
				  _number.innerHTML=`x   `+_quantity+` :    <b style='color:yellow;font-family:"Orbitron", sans-serif;'>`+_total+`$</b>`;
				  _number.style.display="inline-block";
				  _number.style.marginRight="10px";
				  _number.style.fontFamily=`'Orbitron', sans-serif`;
				  _line.appendChild(_number);
			const _buy=document.createElement("button");
				  _buy.classList.add('custom-new-btn','new-btn-10');
				  _buy.innerHTML="BUY";
				  _buy.style.display="inline-block";
				  _buy.style.marginLeft="40px";
				  _buy.style.marginTop="7px";
				  _buy.style.width="50px";
				  _buy.style.height="25px";
				  _line.appendChild(_buy);
				  
				  _infor_panel.appendChild(_line);
				  _buy.addEventListener("click",()=>{
					 
					  const _cash=this._game._root_inventory.GetCash();
					  if(_total>_cash){
						  this._game.createMessageBox("Transaction Failed","Not enough money",()=>{});
						  this.play_sound('fail1');
						  return;
					  }
					   this.play_sound('sucess2');
					  this._game._root_inventory.TakeCash(_total);
					 //_fc(_quantity);
					 this._game._warehouse.add_rocket_num(_id,_quantity);
					 this.close_market_panel();
					 this.update_store_item();
					 this._game._warehouse.save_data();
				  });
				 
		}
		 
		const _cash_infor=document.createElement("div");
			  _cash_infor.style.width="100%";
			  _cash_infor.style.color="white";
			  _cash_infor.style.fontFamily=`'Orbitron', sans-serif`;
			  _cash_infor.innerHTML="Cash:"+parseInt(localStorage.getItem('player-cash'))+"<b style='color:yellow;'>$</b>";
			  _infor_panel.appendChild(_cash_infor);
		
		this._market_panel.appendChild(_infor_panel);
		
	}
	close_market_panel(){
		this._market_panel.remove();
		this._market_panel=null;
		this.init();
	}
	
	get_all_rockets_infor(){
		return this._game._unitMG.get_all_rockets_infor();
	}
	/*
	get_increase_function(_id){
		const _infor=this.get_rocket_infor(_id);
		return _infor.increase;
	}
	*/
	/*
	get_decrease_function(_id){
		const _infor=this.get_rocket_infor(_id);
		
		return _infor.decrease;
	}
	
	get_num_function(_id){
		const _infor=this.get_rocket_infor(_id);
		
		return _infor.get_num;
	}
	*/
	get_rocket_infor(_id){
		const _infors=this.get_all_rockets_infor();
		for(let i=0;i<_infors.length;i++){
			const _infor=_infors[i];
			if(_infor.id===_id)
				return _infor;
		}
		return null;
	}
	get_rocket_price(_id){
		return this.get_rocket_infor(_id).price;
	}
	get_rocket_image_path(_id){
		return this.get_rocket_infor(_id).image_file_path;
	}
	
	get_rocket_icon(_id,_width,_height,_fc){
		let _file_name=this.get_rocket_image_path(_id);
		
		
		let _icon=document.createElement("div");
		_icon.style.width=_width;
		_icon.style.height=_height;
		_icon.style.overflow="hidden";
		//_icon.style.borderImage=`linear-gradient(-90deg, #fc00ff, #F0CB35, #2c7744, #1fddff) 1`;
		const _img=document.createElement("img");
		_img.src=_file_name;
		_img.style.transform="scale(1.452)";
		_img.style.width="100%";
		_img.style.height="100%";
		_img.style.filter="brightness( 220% ) ";
		
		_icon.appendChild(_img);
		
		_icon.addEventListener("click",(event)=>{
			event.preventDefault();
			_fc();
		});
		
		return _icon;
	}
	
	
}
export {ShowRoomRocketPanel}