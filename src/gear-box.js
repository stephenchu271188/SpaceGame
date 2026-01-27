let _parking_time=0;//xác định thời điểm Stop 1 chỗ để tính thời gian dừng đỗ
class GearBox{
	constructor(params){
		this._game=params.game;
		
		this._speed_list=params.speed_list;
		this._gearNum=this._speed_list.length;
		this._gearList=new Array();
		this._open=true;
		//this._stop_auto_move_ahead=false;
		this._last_gear="G";
		this._lock_parking_mode=false;
		this._lock_all_number_gear=false;//lock toan bo cac gear tu 1->6,7,8...
		this._lock=false;//total lock
		this._change_gear_fcs=new Array();
	}
	
	add_change_gear_function(_fc){
		this._change_gear_fcs.push(_fc);
	}
	hide_panel(){
		this._main_div.style.visibility="hidden";
	}
	init(){
		this._main_div=document.createElement("div");
		this._main_div.style.position="absolute";
		this._main_div.style.bottom="3px";
		this._main_div.style.left="790px";
		
		let _btn=this.add_gear("P","animated-button12",true);
		_btn.is_parking_mode=true;
		
		let _main_btn=this.add_gear("G","animated-button12",true);
		_main_btn.is_stop_mode=true;
		this._main_btn=_main_btn;
		//let _open=true;
		_main_btn.addEventListener("click",()=>{
			//this.change_visibility();
		});
		
		for(let i=0;i<this._gearNum;i++){
			this.add_gear((i+1),"animated-button1",true);
		}
		
		if(this._game._root_div)
			this._game._root_div.appendChild(this._main_div);
		
	}
	is_parking(){
		if(this._last_gear==='P')
			return true;
		
		return false;
	}
	is_running(){
		if(this._last_gear==='P'||this._last_gear==='G')
			return false;
		
		return true;
	}
	change_visibility(){
		this._open=!this._open;
		let _visibility="visible";
		if(!this._open) _visibility="hidden";
		//else this._game.change_key_mode(1);
			
		this.switch_visibility(_visibility);
	}
	switch_visibility(_visibility){
		for(let i=0;i<this._gearList.length;i++){
				let _btn2=this._gearList[i];
				if(_btn2!=this._main_btn)
					_btn2.style.visibility=_visibility;
			}
	}
	
	add_gear(_title,_class,_add_to_list){
		let _width=50;
		let _height=_width;
		
		let _btn=document.createElement("div");
			_btn.innerHTML=`
			 <span></span>
			 <span></span>
			 <span></span>
			 <span></span>
			 <div style="position:absolute;top:10px;left:20px;font-size:20px;">`+_title+`</div>
			`;
			_btn.classList.add(_class);
			//_btn.style.marginLeft="5px";
			_btn._title=_title;
			_btn._origin_class=_class;
			if(_add_to_list)this._gearList.push(_btn);
			//_btn.style.width=_width+"px";
			//_btn.style.height=_height+"px";
			_btn.style.cursor="pointer";
			//_btn.style.padding="";
			this._main_div.appendChild(_btn);
			
			_btn.addEventListener("click",()=>{
				this.switch_gear(_btn);
			});
			
			return _btn;
	}
	
	get_current_gear(){
		return this._last_gear;
	}
	
	next_gear(){
		let _next;
		if(this._last_gear==='P')
			_next='G';
		else if(this._last_gear==='G')
			_next=1;
		else
			_next=this._last_gear+1;
		
		if(_next>=this._gearList.length+1)
			_next="P";
		
		for(let i=0;i<this._gearList.length;i++){
			const _gear=this._gearList[i];
			if(_gear._title===_next){
				this.switch_gear(_gear);
				return;
			}
		}
		
		
	}
	prev_gear(){
		let _prev;
		if(this._last_gear===1||this._last_gear===0)
			_prev="G";
		else if(this._last_gear==="G")
			_prev="P";
		else
			_prev=this._last_gear-1;
		
		for(let i=0;i<this._gearList.length;i++){
			const _gear=this._gearList[i];
			if(_gear._title===_prev){
				this.switch_gear(_gear);
				return;
			}
		}
	}
	
	switch_gear_by_title(_title){
		for(let i=0;i<this._gearList.length;i++){
					if(this._gearList[i]._title===_title){
						this.switch_gear(this._gearList[i]);
						return;
					}
		}
	}
	switch_gear(_btn){
		if(this._lock)return;
		if(typeof _btn._title === 'number'){
			if(this._lock_all_number_gear)return;
			//this._game._sound.play_player_ship_thruster_sound();
			this._game._entities['_controls2']._stop_auto_move_ahead=false;
			
			const _gear_value=parseInt(_btn._title);
			
			
			if(_gear_value>this._last_gear+1||_gear_value<this._last_gear-1){
				
				return;
			}
				//console.log("T"+2);
			this._game._entities['_controls2'].turn_on_engine();
			
			this._last_gear=_gear_value;
			
			const _origin_speed=this._game._entities['_controls2']._origin_speed;
			this._game._entities['_controls2']._acceleration.x=_origin_speed*this._speed_list[_btn._title-1];
			
		}
		
		if(_btn._title==='P'){
			if(this._lock_parking_mode)return;
			_parking_time=Math.floor(this._game._second_counter);
		}
		
		//console.log("T"+3);
		for(let i=0;i<this._gearList.length;i++){
			const _btn2=this._gearList[i];
			_btn2.classList.remove(..._btn2.classList);
			_btn2.classList.add(_btn2._origin_class);
		}
		//alert(_btn.classList);
		_btn.classList=new Array();
		_btn.classList.add("animated-button8");
		_btn.style.cursor="pointer";
		
		
		if(_btn.is_stop_mode===true||_btn.is_parking_mode===true){
			//this._game.auto_key_press(32);
			//if(!this._game._entities['_controls2'].engine_active)return;
			this._game._entities['_controls2'].turn_off_engine();
			this._last_gear=_btn._title;
			//this._stop_auto_move_ahead=!this._stop_auto_move_ahead;
			//this._game._entities['_controls2']._stop_auto_move_ahead=this._stop_auto_move_ahead;
			
			this._game._sound.stop_player_ship_thruster_sound();
			
			if(_btn.is_stop_mode===true){
				this._game._entities['_controls2']._stop_auto_move_ahead=false;
			}
			if(_btn.is_parking_mode===true){
				this._game._entities['_controls2']._stop_auto_move_ahead=true;
			}
			
		}
		
		for(let i=0;i<this._change_gear_fcs.length;i++){
			this._change_gear_fcs[i]();
		}
	}
	
	get_last_parking_time(){
		return _parking_time;
	}
}
export {GearBox}