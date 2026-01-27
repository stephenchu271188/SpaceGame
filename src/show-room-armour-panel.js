

class ShowRoomArmourPanel{
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
		//this._game._graphics.remove_divider();
	}
	init(){
		this._remove();
		//this._game._graphics.create_divider(document.getElementById("root-container"),"rgba(0, 0, 0, 1)");
		this._panel=document.createElement("div");
		this._panel.style.position="absolute";
		this._panel.style.width="700px";
		this._panel.style.height="75%";
		this._panel.style.left="25%";
		this._panel.style.top="15%";
		this._panel.style.border="2px solid transparent";
		this._panel.style.boxShadow="0 0 10px 5px #33BBFF";
		this._panel.style.backgroundColor="rgba(20, 114, 234, 0.8)";
		this._panel.style.zIndex="99999999999999999";
		
		this._panel.style.transform="scale(1.23)";
		this._panel.style.transformOrigin="center";
		
		const _title=document.createElement("div");
			  _title.style.textAlign="center";
			  _title.style.color="white";
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
			  //_title.innerHTML="<h3>Armours</h3>";
			  _title.innerHTML=`
					<h1  style="
									background: linear-gradient(to bottom, red,white, yellow);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
									font-size: 34px;
									font-weight: bold;
									font-family: 'Orbitron', sans-serif;
				"'>
			  Armours</h1>`;
		this._panel.appendChild(_title);
		  
		const _close_btn=document.createElement("button");
		_close_btn.classList.add('custom-new-btn','new-btn-2');
		_close_btn.style.position="absolute";
		_close_btn.style.width="30px";
		_close_btn.style.height="30px";
		_close_btn.style.top="0%";
		_close_btn.style.right="0%";
		//_close_btn.style.backgroundColor="turquoise";
		_close_btn.innerHTML="X";
		_close_btn.classList.add('close-icon');
		
		this._panel.appendChild(_close_btn);
		_close_btn.addEventListener("click",()=>{
			 this._panel.remove();
			 this._panel=null;
			 this._game._graphics.remove_divider();//<================
		});
		
		
		document.getElementById("root-container").appendChild(this._panel);
		
		const _ids=this._game._parameters.get_armours_ids();
		let _child_icon_list=new Array();
		const _width=75;
		const _height=_width;
		const _spX=_width+20;
		const _spY=_spX+10;
		const _fx=30;
		const _fy=65;
		let _px,_py;
		let _colID=0,_rowID=0;
		const _colNum=7;
		const _rowNum=3;
		const _num=_colNum*_rowNum;
		
		//let _border_style_1="linear-gradient(45deg, #e5330c, #3333ff) 1";//màu của border khi chưa sở hữu vật phẩm
		//let _border_style_2="linear-gradient(45deg, #f5f0ef, #3333ff) 1";//đã sở hữu
		//let _border_style_3="linear-gradient(45deg, #ebf348, #FFC300) 1";//đã sở hữu và đang sử dụng
		let _border_style_1="linear-gradient(45deg, #141313, #141313) 1";//màu của border khi chưa sở hữu vật phẩm
		let _border_style_2="linear-gradient(45deg, #e5330c, #3333ff) 3";//đã sở hữu
		let _border_style_3="linear-gradient(45deg, #ebf348, #FFC300) 3";//đã sở hữu và đang sử dụng
		
		for(let i=0;i<_num;i++){
			
			_px=_fx+(_colID*_spX);
			_py=_fy+(_rowID*_spY);
			let _icon_container=document.createElement("div");
			
			_icon_container.style.position="absolute";
			_icon_container.style.width=_width+"px";
			_icon_container.style.height=_height+"px";
			_icon_container.style.left=_px+"px";
			_icon_container.style.top=_py+"px";
			//_icon_container.style.backgroundColor="#3F5EFB";
			//_icon_container.style.backgroundColor="rgba(0, 0, 0, 0.7)";
			//_icon_container.style.backgroundImage="linear-gradient(-30deg, #0b243d 50%, #081a2b 50%)";
			_icon_container.style.backgroundImage="linear-gradient(-30deg, #000000 50%, #081a2b 50%)";
			

			if(i<_ids.length){
			
			const _id=_ids[i];
			const _name=this._game._parameters.get_armour_name(_id);
			const _img_path=this._game._parameters.get_armour_icon_path(_id);
			const _icon_label=this._game._parameters.get_armour_label(_id);
			const _price=this._game._parameters.get_armour_price(_id);
			const _ship_level=this._game._parameters.get_armour_ship_level_require(_id);
			const _limit=false;
			const _max_level=10;
			_icon_container._armour_id=_id;
			_icon_container._armour_name=_name;
			_child_icon_list.push(_icon_container);
			let _skill_level=this._ship_package.get_armour_level(_id);
			let _upgrade_fc=()=>{};
			if(this._ship_package.has_armour(_id)){
					
					//let _skill_level=this._ship_package.get_armour_level(_id);
					if(_skill_level<_max_level){
						let _upgrade=document.createElement("button");
							_upgrade.innerHTML="+";
							_upgrade.classList.add('custom-new-btn','new-btn-2');//co 12 loai button
							//_upgrade.style.background="linear-gradient(45deg, #f9374f, #f9a737)";
							_upgrade.style.color="yellow";
							_upgrade.style.border="2px solid yellow";
							_upgrade.style.boxShadow="0 0 5px yellow,  0 0 5px yellow inset";
							_upgrade.style.position="absolute";
							_upgrade.style.width="25px";
							_upgrade.style.height="25px";
							_upgrade.style.bottom="-15px";
							_upgrade.style.left="22px";
							_upgrade.style.fontSize="25px";
							_upgrade.style.fontWeight="300";
							_upgrade.style.display="flex";
							_upgrade.style.alignItems="center";
							_upgrade.style.justifyContent="center";
							_upgrade.addEventListener("click",()=>{
								    
							});
							//_icon_container.appendChild(_upgrade);
							let _dark_energy_id=2001;//trong item-package.js
							let _dark_energy_count=this._game._item_package.get_item_num(_dark_energy_id);
							let _dark_energy_upgrade_require=this._game._parameters.get_armour_upgrade_item_num_require(_id,_skill_level);
							if(_dark_energy_count>=_dark_energy_upgrade_require){
								let _upgrade_container=document.createElement("div");
								_upgrade_container.style.position="absolute";
								_upgrade_container.style.width="40%";
								_upgrade_container.style.height="40%";
								_upgrade_container.style.left="0px";
								_upgrade_container.style.top="0px";
								_upgrade_container.style.filter="brightness( 190% ) ";
								_upgrade_container.innerHTML=`
									<img src="./resources/icons/upgrade-3.png" style="width:100%;height:width:100%"/>
								`;
								_icon_container.appendChild(_upgrade_container);
								let _zoom=false;
								let _zoom_fc=()=>{
									if(!_zoom){
										_upgrade_container.style.transform="scale(1.3)";
									}
									else{
										_upgrade_container.style.transform="scale(1.0)";
									}
									_zoom=!_zoom;
								};
								this._game.add_to_function_list_4(_zoom_fc);
								this._game.add_to_timer(()=>{
									this._game.remove_function_from_list_4(_zoom_fc);
									_upgrade_container.style.transform="scale(1.0)";
								},7);
							}
					  
					}
					else{
						let _max_txt=`
							<h4  style="
									color:white;
									text-shadow:
    0 0 7px #000000,
    0 0 10px #000000,
    0 0 21px #000000,
    0 0 42px #000000,
    0 0 82px #000000,
    0 0 92px #000000,
    0 0 102px #000000,
    0 0 151px #000000;
									font-size: 14px;
									font-weight: bold;
									font-family: 'Orbitron', sans-serif;
							"'>
							max</h4>
						`;
						//let _max_label=this.get_icon_label(_max_txt,"1px","white");
						let _max_label=document.createElement("div");
						_max_label.innerHTML=_max_txt;
						_icon_container.appendChild(_max_label);
						//_max_label.style.backgroundColor="rgba(0, 0, 0, 0.8)";
						_max_label.style.position="absolute";
						_max_label.style.width="40px";
						_max_label.style.height="40px";
						_max_label.style.top="20px";
						_max_label.style.left="22px";
						_max_label.style.borderRadius="50px";
						_max_label.style.zIndex="9999";
						//_max_label.style.textAlign="center";
					}
			}
			
			let _i_label=this.get_icon_label(_icon_label,"1px","white");
			_icon_container.appendChild(_i_label);
			
			let _img=document.createElement("img");
			_img.src=_img_path;
			_img.style.width="100%";
			_img.style.height="100%";
			_img.style.filter="brightness( 190% ) ";
			_img.style.border="3px solid";
			_icon_container.appendChild(_img);
			if(this._ship_package.has_armour(_id)){
				if(this._ship_package.using_armour(_id))
					_img.style.borderImage=_border_style_3;
				else
					_img.style.borderImage=_border_style_2;
			}
			else{
				_img.style.borderImage=_border_style_1;
			}
			//alert(this._ship_package.get_ship_level());
			if(this._ship_package.get_ship_level()>=_ship_level){
			_img.addEventListener("click",()=>{
				this._game._show_room._show_room_sound.play('click2');
				this._remove();
				let _confirm_box;
				let _description="<p style='color:white;'>"+this._game._parameters.get_armour_description(_id)+"<p/>";
				//let _ship=this.get_focus_ship();
				if(this._ship_package.has_armour(_id)){
					_upgrade_fc=()=>{
							if(_skill_level>=_max_level)return;
							this._game._show_room._show_room_sound.play('click2');
									this._remove();
									_confirm_box.remove();
									this._game._graphics.create_divider(document.getElementById("root-container"),"rgba(0, 0, 0, 0.4)");
									//let _upgrade_cost=this._game._parameters.get_auxiliary_upgrade_cost(_id,_current_level);
									let _item_id=this._game._parameters.spaceship_armour_upgrade_item_require_id;
									let _item_name=this._game._item_package.get_item_name(_item_id);
									let _item_img_path=this._game._item_package.get_item_img_path(_item_id);
									//let _upgrade_cost=100;
									const _t_item_num=this._game._item_package.get_item_num(_item_id);
									let _upgrade_cost=this._game._parameters.get_armour_upgrade_item_num_require(_id,_skill_level);
									//alert("Upgrade Cost="+_upgrade_cost);
									let _confirm_box1=this._game.createConfirmBox("Upgrade Level "+_skill_level+" to Level "+(_skill_level+1),
									"<div style='display:flex; justify-content: center;font-family: Orbitron, sans-serif;"
									+"'>requires:"+
									"<div style='width:64px;height:64px;margin-top:-16px;clip-path: polygon(25% 0%, 75% 0%,100% 50%, 75% 100%,25% 100%, 0% 50%);background: white;display:flex; justify-content: center;'>"+
									"<div style='width:60px;height:60px;margin-top:3px;clip-path: polygon(25% 0%, 75% 0%,100% 50%, 75% 100%,25% 100%, 0% 50%);background: black;'>"+
									"<img style='border:0px solid white;border-radius:50px;' src='"+_item_img_path+"' width=60 height=60/></div></div>x"+_upgrade_cost+
									"/<div style='color:yellow;font-family: Orbitron, sans-serif;'>"+_t_item_num+"</div>"+
									"</div>",
									
									()=>{
											//const _cash=this._game._root_inventory.GetCash();
											//const _cash=0;
											const _item_num=this._game._item_package.get_item_num(_item_id);
											if(_upgrade_cost>_item_num){
												this._game.createMessageBox("Transaction Failed","Not enough "+_item_name,()=>{});
												this._game._show_room._show_room_sound.play('fail1');
											}
											else{
												this._game._item_package.take_item(_item_id,_upgrade_cost);
												this._ship_package.upgrade_armour_level(_id);
												this._ship_package.save_data();
												this.init();
												this._game._show_room._show_room_sound.play('sucess1');
												//alert("NewLevel:"+this._ship_package.get_additional_skill_level(_id));
											}
									this._game._graphics.remove_divider();
									},()=>{
										//_confirm_box1.remove();
										this._game._show_room._show_room_sound.play('click3');
										this._game._graphics.remove_divider();
										this.init();
									});
						};
						let _btn_html=`<button 
								class="custom-new-btn new-btn-2" 
								style="width:120px;height:45px;font-size:24px;"
								id="upgrade-armour-id-`+_id+`"
								>
								Upgrade</button>`; 
					if(!this._ship_package.using_armour(_id)){
						_confirm_box=this._game.createConfirmBox(_name,_description+"<br/> Level "
						+_skill_level+"<br/>"+_btn_html+"<br/><br/>Install this on the ship?"
						,()=>{
							this._ship_package.use_armour(_id);
							this._ship_package.save_data();
							//this._game._graphics.remove_divider();
							//_reset_icons();
							this.init();
						},
						()=>{
							//this._game._graphics.remove_divider();
							this.init();
						});
					}
					else{
						
						_confirm_box=this._game.createConfirmBox(_name,_description+" Level "+_skill_level
						+"<br/>"+_btn_html+"<br/><br/>"+"Detach?",()=>{
							this._ship_package.not_use_armour(_id);
							this._ship_package.save_data();
							//this._game._graphics.remove_divider();
							//_reset_icons();
							this.init();
						},
						()=>{
							//this._game._graphics.remove_divider();
							this.init();
						});
						
						
					}
					
					let _upgrade_btn=document.getElementById("upgrade-armour-id-"+_id);
						if(_upgrade_btn)_upgrade_btn.addEventListener("click",()=>{
							_upgrade_fc();
						});
					return;
				}
				else{
					let _price=this._game._parameters.get_armour_price(_id);
					let _confirm_box1=this._game.createConfirmBox(_name,"<h2 style='color:yellow;'>"+_price+"$</h2>",()=>{
						
						const _cash=this._game._root_inventory.GetCash();
						//const _cash=0;
						if(_price>_cash){
							this._game.createMessageBox("Transaction Failed","Not enough money",()=>{});		
						    this._game._show_room._show_room_sound.play('fail1');
						}
						else{
							this._game._root_inventory.TakeCash(_price);
							this._ship_package.add_armour(_id);
							this._ship_package.save_data();	
							this._game._show_room._show_room_sound.play('sucess2');
							let _confirm_box2=this._game.createConfirmBox("Option","Install this armour?",()=>{
								this._ship_package.use_armour(_id);
								this._ship_package.save_data();
								this.init();
							},
							()=>{
								this.init();
							});
						}
					},
					()=>{
						this._game._show_room._show_room_sound.play('click3');
					});
					
				}
				
			});
			}
			else{//khi player-ship chua du level de su dung skill
				let _label=document.createElement("div");
				  _label.style.position="absolute";
				  _label.style.top="-15px";
				  _label.style.left="-15px";
				  _label.style.width="35px";
				  _label.style.height="35px";
				  _label.style.backgroundColor="rgba(0, 0, 0, 0.7)";
				  _label.style.borderRadius="50px";
				  //_label.style.color="red";
				  _label.style.justifyContent="center";
				  _label.style.display="flex";
				  _label.style.alignItems="center";
				  _label.style.fontSize="14px";
				  _label.style.fontFamily="'Courier New', Courier, monospace";
				  _label.style.fontWeight="600";
				  _label.innerHTML=`<i  style="
									background: linear-gradient(to bottom, turquoise,white, yellow);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
									
							        "'>Lv `+_ship_level+`</i>`;
				  
				  _icon_container.appendChild(_label);
				  _img.addEventListener("click",()=>{
					  this._game._show_room._show_room_sound.play('fail1');
					  this._game.createMessageBox(_name,"Level "+_ship_level,()=>{
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
export {ShowRoomArmourPanel}