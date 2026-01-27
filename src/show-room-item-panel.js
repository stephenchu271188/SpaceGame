

class ShowRoomItemPanel{
	constructor(params){
		this._game=params.game;
		this._ship_package=params.ship_package;
		
	}
	_remove(){
		if(this._panel&&this._panel!=null){
			this._panel.remove();
			this._panel=null;
		}
	}
	remove(){
		this._remove();
	}
	init(){
		this._remove();
		this._panel=document.createElement("div");
		this._panel.style.position="absolute";
		this._panel.style.width="550px";
		this._panel.style.height="50%";
		this._panel.style.left="28%";
		this._panel.style.top="20%";
		this._panel.style.border="2px solid transparent";
		this._panel.style.boxShadow="0 0 10px 5px #33BBFF";
		this._panel.style.backgroundColor="rgba(20, 114, 234, 0.8)";
		this._panel.style.zIndex="99999999999999999";
		
		this._panel.style.transform="scale(1.23)";
		this._panel.style.transformOrigin="center";
		
		const _title=document.createElement("div");
			  _title.style.position="absolute";
			  _title.style.top="0px";
			  _title.style.left="0px";
			  _title.style.width="100%";
			  _title.style.height="50px";
			  _title.style.background="rgba(0,0,0,0.4)";
			  //_title.style.fontSize="24px";
			  //_title.style.border="1px gray solid";
			  _title.style.display="flex";
			  _title.style.justifyContent="center";
			  _title.style.alignItems="center";
			  //_title.innerHTML="<h3>Items</h3>";
			  _title.innerHTML=`
					<h1  style="
									background: linear-gradient(to bottom, red,white, yellow);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
									font-size: 30px;
									font-weight: bold;
									font-family: 'Orbitron', sans-serif;
				"'>
			  Items</h1>`;
		this._panel.appendChild(_title);
		  
		const _close_btn=document.createElement("button");
		_close_btn.classList.add('custom-new-btn','new-btn-2');
		_close_btn.style.position="absolute";
		_close_btn.style.width="25px";
		_close_btn.style.height="25px";
		_close_btn.style.top="0%";
		_close_btn.style.right="0%";
		_close_btn.innerHTML="X";
		this._panel.appendChild(_close_btn);
		_close_btn.addEventListener("click",()=>{
			 this._game._show_room._show_room_sound.play('click3');
			 this._panel.remove();
			 this._panel=null;
			 this._game._graphics.remove_divider();//<================
		});
		
		
		document.getElementById("root-container").appendChild(this._panel);
		
		const _ids=this._game._parameters.get_items_ids();
		let _child_icon_list=new Array();
		const _width=60;
		const _height=_width;
		const _spX=_width+10;
		const _spY=_spX;
		const _fx=30;
		const _fy=65;
		let _px,_py;
		let _colID=0,_rowID=0;
		const _colNum=7;
		const _rowNum=3;
		const _num=_colNum*_rowNum;
		//let _border_style_1="3px solid red";//màu của border khi chưa sở hữu vật phẩm
		//let _border_style_2="3px solid white";//đã sở hữu
		//let _border_style_3="3px solid yellow";//đã sở hữu và đang sử dụng
		let _border_style_1="linear-gradient(45deg, #e5330c, #3333ff) 1";//màu của border khi chưa sở hữu vật phẩm
		let _border_style_2="linear-gradient(45deg, #f5f0ef, #3333ff) 1";//đã sở hữu
		let _border_style_3="linear-gradient(45deg, #ebf348, #FFC300) 1";//đã sở hữu và đang sử dụng
		
		let _best_id=0;//tim ra exp-item tot' nhat
		let _max_exp=0;
		for(let i=0;i<_ids.length;i++){
				const _id=_ids[i];
				const _player_level=this._game._parameters.get_item_player_level_require(_id);
				const _ship_level_max=this._game._parameters.get_item_ship_level_max(_id);
				const _exp=this._game._parameters.get_item_value(_id);
				
				const _ship_level=this._ship_package.get_ship_level();
				
				if(_player_level<=this._game.get_player_level()){
					if(_ship_level_max>=_ship_level){
						if(_exp>_max_exp){
							_best_id=_id;
							_max_exp=_exp;
						}
					}
				}
			}		
		
		for(let i=0;i<_num;i++){
			_px=_fx+(_colID*_spX);
			_py=_fy+(_rowID*_spY);
			let _icon_container=document.createElement("div");
			_icon_container.style.position="absolute";
			_icon_container.style.width=_width+"px";
			_icon_container.style.height=_height+"px";
			_icon_container.style.left=_px+"px";
			_icon_container.style.top=_py+"px";
			_icon_container.style.backgroundColor="rgba(0, 0, 0, 0.4)";
			
			if(i<_ids.length){
			
			const _id=_ids[i];
			
			if(_id!=_best_id)continue;//<==chi hien thi item phu hop nhat
			
			const _name=this._game._parameters.get_item_name(_id);
			const _img_path=this._game._parameters.get_item_icon_path(_id);
			const _icon_label=this._game._parameters.get_item_label(_id);
			
			const _player_level=this._game._parameters.get_item_player_level_require(_id);
			const _ship_level_max=this._game._parameters.get_item_ship_level_max(_id);
			const _ship_level=this._ship_package.get_ship_level();
			
			const _limit=false;
			const _groupID=1;
			
			_icon_container._item_id=_id;
			_icon_container._item_name=_name;
			_child_icon_list.push(_icon_container);
			
			let _i_label=this.get_icon_label(_icon_label,"1px","white");
			_icon_container.appendChild(_i_label);
			
			let _img=document.createElement("img");
			_img.src=_img_path;
			_img.style.width="100%";
			_img.style.height="100%";
			_icon_container.appendChild(_img);
			_img.style.filter="brightness( 300% ) ";
			_img.style.border="3px solid";
			_img.style.borderImage=_border_style_1;
			
			if(this._game.get_player_level()>=_player_level){
			_img.addEventListener("click",()=>{
				this._remove();
				this._game._show_room._show_room_sound.play('click2');
				if(_ship_level>_ship_level_max){
					let _confirm_box1=this._game.createMessageBox("Only applies to levels below "+_ship_level_max,"",()=>{});
						
						
					return false;
				}
				
				let _description=this._game._parameters.get_item_description(_id);
				    _description="<i style='color:orange;'>"+_description+"</i>";
				
					let _price=this._game._parameters.get_item_price(_id);
					let _confirm_box1=this._game.createConfirmBox(_description+"<br/>"+"Buy this item?",_price+"$",()=>{
						
						const _cash=this._game._root_inventory.GetCash();
						//const _cash=0;
						if(_price>_cash){
							this._game._show_room._show_room_sound.play('fail1');
							this._game.createMessageBox("Transaction Failed","Not enough money",()=>{});		
						}
						else{
							this._game._show_room._show_room_sound.play('sucess1');
							this._game._root_inventory.TakeCash(_price);
							const _exp=this._game._parameters.get_item_value(_id);
							this._ship_package.plus_ship_exp(_exp);
							//this._ship_package.add_ship_additional_skill(_id);
							this._ship_package.upgrade_level();
							this._ship_package.save_data();	
							
							this._game._show_room.update_data();
							if(this._game._rewardsMG){
								let _new_player_level=this._game.get_player_level();
								let _new_ship_level=this._ship_package.get_ship_level();
								let _ship_id=this._game._show_room.get_focus_ship_id();
								this._game._rewardsMG.check_player_level_reward(_new_player_level);
								this._game._rewardsMG.check_ship_level_reward(_ship_id,_new_ship_level);
								
							}
						}
					},
					()=>{
						this._game._show_room._show_room_sound.play('click3');
					});
					
				
			});
			}
			else{//khi chua du level
				let _label=document.createElement("div");
				  _label.style.position="absolute";
				  _label.style.top="-15px";
				  _label.style.left="-15px";
				  _label.style.width="35px";
				  _label.style.height="35px";
				  _label.style.backgroundColor="rgba(0, 0, 0, 0.7)";
				  _label.style.borderRadius="50px";
				  _label.style.color="red";
				  _label.style.justifyContent="center";
				  _label.style.display="flex";
				  _label.style.alignItems="center";
				  _label.style.fontSize="12px";
				  _label.style.fontFamily="'Courier New', Courier, monospace";
				  _label.style.fontWeight="600";
				  _label.innerHTML=`<i  style="
									background: linear-gradient(to right, turquoise,white, yellow);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
							        "'>Rank`+_player_level+`</i>`;
				  
				  _icon_container.appendChild(_label);
				  
				  _img.addEventListener("click",()=>{
					  this._game._show_room._show_room_sound.play('fail1');
					  this._game.createMessageBox("Message","Rank Requires :"+_player_level,()=>{
						  this._game._show_room._show_room_sound.play('click3');
					  });
				  });
				  
			}
			}
			this._panel.appendChild(_icon_container);
			
			_colID++;
			  if(_colID>=_colNum){
				_colID=0;
				_rowID++;
			  }
		}
	}
	
	
	get_icon_label(_text,_bottom,_color){
		let _label=document.createElement("div");
		_label.innerHTML=_text;//secondary skils
		_label.style.position="absolute";
		if(_bottom)
			_label.style.bottom=_bottom;
		else
			_label.style.bottom="-20px";
		_label.style.width="100px";
		
		if(_color)
			_label.style.color=_color;
		else
			_label.style.color="yellow";
		_label.style.fontSize="10px";
		
		return _label;
	}
}
export {ShowRoomItemPanel}