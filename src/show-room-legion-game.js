import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/controls/OrbitControls.js';


import {ShowRoom} from './show-room.js';
import {UnitMGLegionGame} from './unit-mg-legion-game.js';
import {ShowRoomChildShipPanel} from './show-room-child-ship-panel.js';
import {ChildShipStore} from './child-ship-store.js';

/*
	***Ở các cột hiển thị tổng số child-ship lưu trong warehouse2 thì max-value của
		các range-slider được thiết lập bằng số lượng unit cao nhất trong lịch sử

*/

class ShowRoomLegionGame extends ShowRoom{
	
	constructor(params){
		super(params);
		
		this._game._unitMG=new UnitMGLegionGame(this._game._unitMG._params);
		
		this._game_page="legion-game.html";
		
		this._max_ship_in_type=this._game._parameters._max_mother_ship_in_type;//so ship toi' da trong cung 1 loai
		this._max_type=this._game._parameters._mother_ship_type_num;//so' luong cac loai mother ship
		
		this._game._warehouse2.load_data();
		
		this._mother_ship_list=new Array();
		
		this.create_ship_icons();
		
		/*
		let controls = new OrbitControls( this._game._graphics.Camera, 
		this._game._graphics.Renderer.domElement );
		this._game.add_to_update_function_list(()=>{
			//controls.update();
		});
		setTimeout(()=>{
			controls.target.copy(this._unit_list[0][1].Position);
		},4000);
		controls.update();
		*/
		
		this.move_to=this.move_to_2;
		
		this._prev_btn.style.visibility="hidden";
		this._next_btn.style.visibility="hidden";
		this._root_container.style.visibility="hidden";
		this._game._root_container=this._root_container;
	}
	
	set_play_button_click_fc(_fc){
		let newBtn = this._play_btn.cloneNode(true);
		this._play_btn.parentNode.replaceChild(newBtn, this._play_btn);
		this._play_btn=newBtn;
		this._play_btn.addEventListener("click",_fc);
	}
	
	create_ship_icons(){
		
		if(this._ship_icons_container)this._ship_icons_container.remove();
		
		this._ship_icons_container=document.createElement("div");
		this._ship_icons_container.style.position="absolute";
		this._ship_icons_container.style.top="390px";
		this._ship_icons_container.style.left="500px";
		
		this._root_container.appendChild(this._ship_icons_container);
		
		const _col_num=this._max_ship_in_type;
		const _row_num=this._max_type;
		
		const _num=_col_num*_row_num;
		let _col_id=0,_row_id=0;
		const _width=50;
		const _height=_width;
		const _spX=_width+10;
		const _spY=_height+10;
		let _px,_py;
		
		const _num1=this._game._warehouse2.get_mother_heating_ship_num();
		const _num2=this._game._warehouse2.get_mother_freezing_ship_num();
		const _num3=this._game._warehouse2.get_mother_rocket_ship_num();
		
		const _infor_list=this._game._warehouse2._infor_list;
		
		if(_infor_list.length!=_row_num){
			alert("Something Wrong!(show-room-legion-game.js)");
			return false;
		}
		
		for(let i=0;i<_infor_list.length;i++){//Hien thi ten cac type
			const _item=_infor_list[i];
			const _name=_item[0];
			const _div_name=document.createElement("div");
			_div_name.style.position="absolute";
			_div_name.style.top=(i*_spY)+"px";
			_div_name.style.left="-70px";
			_div_name.style.color="white";
			_div_name.style.fontSize="15px";
			_div_name.innerHTML=_name;
			
			this._ship_icons_container.appendChild(_div_name);
		}
		
		this._icon_list=new Array();
		
		for(let i=0;i<_num;i++){
			_px=_col_id*_spX;
			_py=_row_id*_spY;
			
			const _ship_num=_infor_list[_row_id][3]();
			let _available=false;
			if(_col_id<_ship_num)_available=true;
			
			let _border_color="gray";
			let _click_fc=()=>{};
			let _ship_id=this._game._parameters.get_mother_ship_id(_col_id,_row_id);
			if(_available){
				_border_color="yellow";
				//let _ship_id=this._game._parameters.get_mother_ship_id(_col_id,_row_id);
				_click_fc=()=>{
					//this.create_mother_ship_detail_panel(_ship_id);
				}
			}
			if(!_available){
				if(_col_id===_ship_num){//icon lien` ke ngau sau icon available
					_border_color="white";
					_click_fc=()=>{
						this.show_unlock_unit_option(_ship_id,_col_id,_row_id);
					};
				}
			}
			
			let _icon=document.createElement("div");
			_icon.style.position="absolute";
			_icon.style.top=_py+"px";
			_icon.style.left=_px+"px";
			_icon.style.width=_width+"px";
			_icon.style.height=_height+"px";
			_icon.style.border="solid "+_border_color+" 2px";
			_icon.addEventListener("click",_click_fc);
			
			_icon._array_id=i;
			
			_icon._my_color=_border_color;
			this._icon_list.push(_icon);
			
			const _img=document.createElement("img");
			_img.style.width=_width+"px";
			_img.style.height=_height+"px";
			_img.src="";
			
			_icon.appendChild(_img);
			
			_icon.addEventListener("click",()=>{
				this.select_icon_handle_2(_icon);
			});
			
			this._ship_icons_container.appendChild(_icon);
			
			_col_id++;
			if(_col_id>=_col_num){
				_col_id=0;
				_row_id++;
			}
		}
	}
	
	select_icon_handle_2(_icon){
		this.move_to(parseInt(_icon._array_id));
		for(let j=0;j<this._icon_list.length;j++){
			this._icon_list[j].style.border="solid "+this._icon_list[j]._my_color+" 2px";
		}
		_icon.style.border="solid green 2px";
	}
	select_icon_handle_1(_ship_id){
		const _array_id=this._game._parameters.get_mother_ship_array_id(_ship_id);
		this.select_icon_handle_2(this._icon_list[_array_id]);
	}
	
	show_unlock_unit_option(_ship_id,_col_id,_row_id){
		if(this._unlock_unit_panel){
			this._unlock_unit_panel.remove();
		}
		
		let _type_id=this._game._parameters.get_mother_ship_type_id_by_ship_id(_ship_id);
		
		this._unlock_unit_panel=document.createElement("div");
		this._unlock_unit_panel.style.position="absolute";
		this._unlock_unit_panel.style.top="200px";
		this._unlock_unit_panel.style.left="450px";
		this._unlock_unit_panel.style.width="500px";
		this._unlock_unit_panel.style.height="300px";
		this._unlock_unit_panel.style.backgroundColor="#0E86EA";
		this._unlock_unit_panel.style.border="solid white 1px";
		this._root_container.appendChild(this._unlock_unit_panel);
		
		let _close=document.createElement("button");
		_close.style.position="absolute";
		_close.style.top="0px";
		_close.style.right="0px";
		_close.style.width="40px";
		_close.style.height="40px";
		_close.style.fontSize="20px";
		_close.style.fontWeight="bold";
		_close.innerHTML="X";
		this._unlock_unit_panel.appendChild(_close);
		_close.addEventListener("click",()=>{
			this._unlock_unit_panel.remove();
		});
		
		let _unlock=document.createElement("button");
		_unlock.style.position="absolute";
		_unlock.style.bottom="3px";
		_unlock.style.left="130px";
		_unlock.style.width="140px";
		_unlock.style.height="40px";
		_unlock.style.fontSize="20px";
		_unlock.style.fontWeight="bold";
		_unlock.innerHTML="UNLOCK";
		this._unlock_unit_panel.appendChild(_unlock);
		_unlock.addEventListener("click",()=>{
			this._unlock_unit_panel.remove();
			//alert(_type_id);
			this._game._warehouse2.increase_mother_ship_num(_type_id);
			this._game._warehouse2.save_data();
			this.create_ship_icons();
		});
	}
	
	create_mother_ship_detail_panel(_ship_id){
		//alert("ShipID="+_ship_id);
		
		let _unit=this.get_mother_ship_by_id(_ship_id);//alert(_unit);
		let _child_package=_unit.get_child_ship_store();
		//alert("Num="+_child_package.get_unit_num_by_id(0));
		
		if(this._mother_ship_panel){
			this._mother_ship_panel.remove();
		}
		
		this._child_ships_btn.style.visibility="hidden";
		this._play_btn.style.visibility="hidden";
		
		this._mother_ship_panel=document.createElement("div");
		this._mother_ship_panel.style.position="absolute";
		this._mother_ship_panel.style.top="200px";
		this._mother_ship_panel.style.left="450px";
		this._mother_ship_panel.style.width="500px";
		this._mother_ship_panel.style.height="300px";
		this._mother_ship_panel.style.backgroundColor="rgba(62, 139, 251, 0.4)";
		this._mother_ship_panel.style.border="2px solid transparent";
		this._mother_ship_panel.style.boxShadow="0 0 10px 5px #33BBFF";
		this._root_container.appendChild(this._mother_ship_panel);
		
		let _close=document.createElement("button");
		_close.style.position="absolute";
		_close.style.top="0px";
		_close.style.right="0px";
		_close.style.width="40px";
		_close.style.height="40px";
		_close.style.fontSize="20px";
		_close.style.fontWeight="bold";
		_close.innerHTML="X";
		this._mother_ship_panel.appendChild(_close);
		_close.addEventListener("click",()=>{
			this._mother_ship_panel.remove();
			this._child_ships_btn.style.visibility="visible";
			this._play_btn.style.visibility="visible";
			this._game._graphics.remove_divider();
		});
		
		let _save=document.createElement("button");
		_save.style.position="absolute";
		_save.style.bottom="3px";
		_save.style.left="170px";
		_save.style.width="70px";
		_save.style.height="40px";
		_save.style.fontSize="20px";
		_save.style.fontWeight="bold";
		_save.innerHTML="SAVE";
		this._mother_ship_panel.appendChild(_save);
		
		let _range_container=document.createElement("div");
		_range_container.style.position="absolute";
		_range_container.style.top="10px";
		_range_container.style.left="50px";
		
		let _infor_list=this._game._warehouse2._child_ship_store.get_infor_list();
		if(_infor_list.length!=this._max_type){
			alert("something wrong!(show-room-legion-game.js)");
			return false;
		}
		
		let _iframe;
		let _type_num=_child_package.get_child_ship_type_num();
		let _slider_list=new Array();
		for(let i=0;i<_type_num;i++){//slider cua tung` mother ship
			const _px=20;
			const _py=50+(i*60);
			const _width=250;
			let _range_slider=document.createElement("input");
			_range_slider.style.position="absolute";
			_range_slider.style.width=_width+"px";
			_range_slider.style.top=_py+"px";
			_range_slider.style.left=_px+"px";
			_range_slider.type="range";
			_range_slider.min=0;
			
			let _max_val=this._game._warehouse2._child_ship_store.get_unit_num_by_id(i)+_child_package.get_unit_num_by_id(i);
			if(_max_val>_unit._legion_capacity)_max_val=_unit._legion_capacity;
			
			_range_slider.max=_max_val;
			_range_slider.value=_child_package.get_unit_num_by_id(i);
			_range_slider.last_value=_range_slider.value;
			_range_slider.classList.add("range");
			_range_container.appendChild(_range_slider);
		
			let _range_value=document.createElement("div");
			_range_value.style.position="absolute";
			_range_value.style.top=_py+"px";
			_range_value.style.left=(_px+_width+30)+"px";
			_range_value.style.fontSize="20px";
			_range_value.style.color="white";
			_range_value.innerHTML=_range_slider.value;
			_range_container.appendChild(_range_value);
			
			let _id=i;
			const _change_fc=()=>{//Khi thay doi code o day phai copy paste vao` save function phia duoi
				_change_range_slider_handle(_id,_range_slider,_range_value);
				for(let j=0;j<_type_num;j++){
					if(j!=_id){//khi select 1 loai child-ship thi slider cua cac child-ship khac reset ve 0
						const _other_range_slider=_slider_list[j][1];
						const _t_value=_other_range_slider.value;
						
						const _highest_num=this._game._warehouse2._child_ship_store.get_unit_highest_num_by_id(j);
						const _add_percent=Math.ceil((_t_value*100)/_highest_num);
						
						_iframe.contentWindow.add_value(j,_add_percent);
						//console.log("Num2="+this._game._warehouse2._child_ship_store.get_unit_num_by_id(_id));
						_other_range_slider.value=0;
						
					}
				}
			};
		
			_range_slider.addEventListener("change",_change_fc);
			//_range_slider.addEventListener("mousemove",_change_fc);
			
			_slider_list.push([_id,_range_slider,_range_value]);
		}
		//let _last_value=_child_package.get_last_num_by_id(_id);
		let _change_range_slider_handle=(_id,_range_slider,_range_value,_save_data)=>{
				const _value=parseInt(_range_slider.value);//so luong lua chon
				const _current_num=this._game._warehouse2._child_ship_store.get_unit_num_by_id(_id);
				const _total_num=_value+_current_num;
				//if(_id===0)alert("Current:"+_current_num);
				const _current_num2=_child_package.get_unit_num_by_id(_id);
				//alert("total="+(_current_num+_current_num2));
				//const _highest_num=_current_num+_current_num2;
				const _highest_num=this._game._warehouse2._child_ship_store.get_unit_highest_num_by_id(_id);
				const _current_percent=(_current_num*100)/_highest_num;//phan tram con lai
				
				//if(!_range_slider._last_value)_range_slider._last_value=0;
				//const _last_value=_child_package.get_last_num_by_id(_id);
				const _last_value=_range_slider.last_value;
				
				//_range_value.innerHTML=_value+"/"+_highest_num+"/"+(_current_num+_current_num2);
				_range_value.innerHTML=_value+"/"+(_current_num+_current_num2);
				
				let _remain=_current_num-(_value-_last_value);//console.log("Remain="+_remain);
				const _remain_percent=(_remain*100)/_highest_num;
				
				if(_iframe&&_iframe.contentWindow!=null){//Chi la hien? thi, nen lam` tron` cac con so' ko anh huong gi
				
					_iframe.contentWindow.change_value(_id,Math.ceil(_remain_percent));
				}
					
				//if(_id===0)alert("CurrentValue:"+_value+" and LastValue:"+_last_value+" and Remain:"+_remain);
				
				if(_save_data===true){
					
					this._game._warehouse2._child_ship_store.set_unit_num_by_id(_id,Math.ceil(_remain));
					_child_package.set_unit_num_by_id(_id,Math.ceil(_value));
					
					this._game._warehouse2.save_data();
					_child_package.save_data();
					_child_package.set_last_num_by_id(_id,_value);
					
					_range_slider.last_value=_value;
					//alert(this._game._warehouse2._child_ship_store.get_unit_num_by_id(_id));
				}
				
		}
		
		_save.addEventListener("click",()=>{
			this._mother_ship_panel.remove();//click save thi close panel luon de tranh' click nhieu lan
			this._child_ships_btn.style.visibility="visible";
			this._play_btn.style.visibility="visible";
			for(let i=0;i<_slider_list.length;i++){
				let _id=_slider_list[i][0];
				let _range_slider=_slider_list[i][1];
				let _range_value=_slider_list[i][2];
				_change_range_slider_handle(_id,_range_slider,_range_value,true);
			}
				this._game._graphics.remove_divider();
		});
		
		
		_iframe=document.createElement("iframe");
		_iframe.style.position="absolute";
		_iframe.style.top="-150px";
		_iframe.style.left="-300px";
		_iframe.style.width="300px";
		_iframe.style.height="490px";
		_iframe.style.border="none";
		_iframe.overflow="hidden";
		_iframe.addEventListener("load",()=>{
			_iframe.contentWindow.init(_infor_list,(_t_id)=>{
				this._mother_ship_panel.remove();
				this.show_market_panel(_t_id,()=>{});
			});
			for(let i=0;i<_infor_list.length;i++){
				const _t_id=i;
				const _unit_num=this._game._warehouse2._child_ship_store.get_unit_num_by_id(_t_id);
				const _highest_num=this._game._warehouse2._child_ship_store.get_unit_highest_num_by_id(_t_id);
				//const _unit_num=_infor_list[i][1];
				//const _highest_num=_infor_list[i][4];
				//console.log("Data:"+_unit_num+"/"+_highest_num);
				const _percent=Math.ceil((_unit_num*100)/_highest_num);//convert sang phan tram
				let _id2=i;
				_iframe.contentWindow.change_value(_id2,_percent);
			}
		});
		_iframe.src="./frame/vertical-range-slider/index.html";
		_range_container.appendChild(_iframe);
		
		this._mother_ship_panel.appendChild(_range_container);
		
	}
	
	
	create_unit_infor_list(){//overwrite
		const _max_ship_in_type=this._game._parameters._max_mother_ship_in_type;//so ship toi' da trong cung 1 loai
		const _max_type=this._game._parameters._mother_ship_type_num;
		
		for(let i=0;i<_max_type;i++){
			const _id1=i+1;
			for(let j=0;j<_max_ship_in_type;j++){
				const _id2=j;
				const _d_id=(_id1*this._game._parameters._mother_ship_first_id)+_id2;
				this._unit_list.push([_id1,null,_d_id]);//[type-id,unit,database-id]
			}
		}
		
		
	}
	get_array_id_by_ship_id(_ship_id){
		for(let i=0;i<this._unit_list.length;i++){
			if(this._unit_list[i][2]===_ship_id)
				return this._unit_list[i][0];
		}
		return null;
	}
	get_ship_num_by_type(_type){
		let _rs=0;
		for(let i=0;i<this._unit_list.length;i++){
			if(this._unit_list[i][0]===_type)
				_rs++;
		}
		return _rs;
	}
	get_all_ship_id_by_type(_type){
		let _rs=new Array();
		for(let i=0;i<this._unit_list.length;i++){
			if(this._unit_list[i][0]===_type)
				_rs.push(this._unit_list[i][2]);
		}
		return _rs;
	}
	get_ship_id_by_type(_type,_id1){//truyen vao type va so' thu tu
		const _arr=this.get_all_ship_id_by_type(_type);
		return _arr[_arr];
	}
	
	create_unit_by_id(_id,_next_pos,_ship_id){//overwrite
		//const _id=this.get_type_id(_array_id);
		let _eunit;
		/*
			if(_id===1)
				_eunit=this._game._unitMG.create_mother_heating_ship_1(_next_pos);
			if(_id===2)
				_eunit=this._game._unitMG.create_mother_freezing_ship_1(_next_pos);
			if(_id===3)
				_eunit=this._game._unitMG.create_mother_rocket_ship_1(_next_pos);
			*/
			_eunit=this._game._warehouse2.get_create_mother_ship_fc(_id-1)(_next_pos);
		
		const _scl_rate=0.05;	
		const _scl=new THREE.Vector3(_eunit._model.scale.x*_scl_rate,
									 _eunit._model.scale.y*_scl_rate,
									 _eunit._model.scale.z*_scl_rate);
		_eunit._model.scale.copy(_scl);
		
		//const _child_package=new ChildShipStore({game:this._game,package_name:"MotherShip-ID-"+_ship_id});
		//_child_package.load_data();
		//_eunit.set_child_ship_store(_child_package);
		
		_eunit.set_mother_ship_id(_ship_id);
		_eunit.load_child_ship_store();
		
		_eunit._my_mother_ship_id=_ship_id;//_my_mother_ship_id chỉ sử dụng trong file này mà ko ảnh hưởng tới bất kỳ file code nào khác
		this._mother_ship_list.push(_eunit);
		
		
		//this.add_label(_eunit);
		
		return _eunit;
	}
	get_mother_ship_by_id(_id){
		for(let i=0;i<this._mother_ship_list.length;i++){
			const _tunit=this._mother_ship_list[i];//alert(_tunit._my_mother_ship_id+"=="+_id);
			if(_tunit._my_mother_ship_id===_id)
				return _tunit;
		}
		return null;
	}
	get_focus_ship_id(){//overwrite
		return this._unit_list[this._focus_id][2];//return database-id
	}
	update_data(){//overwrite
		
	}
	check_status(){//overwrite
		super.check_status();
		
		this._rocket_btn.style.visibility="hidden";
		this._unclock_btn.style.visibility="hidden";
		this._play_btn.style.visibility="hidden";
		this.create_child_ships_btn();
	}
	create_child_ships_btn(){
		if(this._child_ships_btn){
			this._child_ships_btn.remove();
		}
		this._child_ships_btn=document.createElement("button");
		this._child_ships_btn.classList.add("btn","fifth2");
		this._child_ships_btn.style.width="120px";
		this._child_ships_btn.style.height="30px";
		this._child_ships_btn.style.top="250px";
		this._child_ships_btn.style.left="150px";
		this._child_ships_btn.innerHTML="Children";
		document.getElementById("root-container").appendChild(this._child_ships_btn);
		this._child_ships_btn.addEventListener("click",()=>{
			this._game._graphics.create_divider(this._root_container,"rgba(0, 0, 0, 0.6)");
			const _unit=this.get_focus_ship();
			this.create_mother_ship_detail_panel(_unit._my_mother_ship_id);
		});
	}
	
	show_market_panel(_id,_fc){//panel mua child-ships
	
		if(this._market_panel&&this._market_panel!=null){
			this._market_panel.remove();
			this._market_panel=null;
		}
	
		this._market_panel=document.createElement("div");
		this._market_panel.style.position="absolute";
		this._market_panel.style.width="600px";
		this._market_panel.style.height="73%";
		this._market_panel.style.left="25%";
		this._market_panel.style.top="15%";
		this._market_panel.style.border="2px solid transparent";
		this._market_panel.style.boxShadow="0 0 10px 5px #33BBFF";
		this._market_panel.style.backgroundColor="rgba(44, 99, 227, 0.4)";
		this._market_panel.style.zIndex="99999999999999999";
		this._root_container.appendChild(this._market_panel);
		
		const _close_btn=document.createElement("button");
		_close_btn.style.position="absolute";
		_close_btn.style.width="25px";
		_close_btn.style.height="25px";
		_close_btn.style.top="0%";
		_close_btn.style.right="0%";
		_close_btn.innerHTML="X";
		this._market_panel.appendChild(_close_btn);
		_close_btn.addEventListener("click",()=>{
			this.close_market_panel();
		});
		
		//const _unit_price=this.get_rocket_price(_id);
		const _unit_price=100;
		const _price_infor=[
			{quantity:100,total:_unit_price},
			{quantity:200,total:_unit_price*2},
			{quantity:500,total:_unit_price*4},
			{quantity:1000,total:_unit_price*8},
			{quantity:2000,total:_unit_price*16},
			//{quantity:3000,total:_unit_price*24},
			{quantity:5000,total:_unit_price*42},
			{quantity:10000,total:_unit_price*70},
			{quantity:20000,total:_unit_price*140},
			{quantity:50000,total:_unit_price*280},
			{quantity:10000000,total:_unit_price*9999999999}
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
			const _image=document.createElement("img");
				  _image.style.width="50px";
				  _image.style.height="50px";
				  _image.style.display="inline-block";
				  _image.style.marginRight="10px";
				  _image.style.boxShadow="0 0 5px 2px #FFFFFF";
				  _line.appendChild(_image);
			const _number=document.createElement("div");
				  _number.style.color="white";
				  _number.style.fontSize="20px";
				  _number.style.width="280px";
				  _number.style.marginTop="7px";
				  _number.innerHTML="x   "+_quantity+"    <b style='color:yellow;'>"+_total+"$</b>";
				  _number.style.display="inline-block";
				  _number.style.marginRight="10px";
				  _line.appendChild(_number);
			const _buy=document.createElement("button");
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
						  this._game.createMessageBox("Transaction Failed","You don't have enough money",()=>{});
						  return;
					  }
				
					  this._game._root_inventory.TakeCash(_total);
					  //alert(this._game._warehouse2._child_ship_store.get_unit_num_by_id(_id)); 
					  this._game._warehouse2._child_ship_store.add_unit_num_by_id(_id,_quantity);
					  this._game._warehouse2.save_data();
					  //alert(this._game._warehouse2._child_ship_store.get_unit_num_by_id(_id)); 
					   
					 this.close_market_panel();
					 this.update_store_item();
					 this._game._warehouse.save_data();
				  });
				 
		}
		 
		const _cash_infor=document.createElement("div");
			  _cash_infor.style.width="100%";
			  _cash_infor.style.color="white";
			  _cash_infor.innerHTML="Cash:"+parseInt(localStorage.getItem('player-cash'))+"$";
			  _infor_panel.appendChild(_cash_infor);
		
		this._market_panel.appendChild(_infor_panel);
		
	}
	close_market_panel(){
		this._market_panel.remove();
		this._market_panel=null;
		this._game._graphics.remove_divider();
		this._child_ships_btn.style.visibility="visible";
	}
}
export {ShowRoomLegionGame}