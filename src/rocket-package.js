let _can_launch_rocket=true;
let _temp_lock_rocket_fc=()=>{};
let _rocket_ready_callbacks=new Array();

class RocketPackage{
	constructor(params){
		this._game=params.game;
		this._unit=params.unit;
		this._open=false;
		this._current_rocket_id=1;
		
		this._rocket_counter=0;//dem' so' rocket duoc ban' ra
		
		this._after_launch_fc=new Array();
		this._launch_rocket_fail=new Array();
		
		let _game=this._game;
		_temp_lock_rocket_fc=()=>{
			_can_launch_rocket=false;
			_game.add_to_timer(function(){
				_can_launch_rocket=true;
				//_game._sound.play('missile-ready');
				for(let i=0;i<_rocket_ready_callbacks.length;i++){
					_rocket_ready_callbacks[i]();
				}
			},6);
		};
		
	}
	add_rocket_ready_callback(_fc){
		_rocket_ready_callbacks.push(_fc);
	}
	lock_rocket(){
		_can_launch_rocket=false;
	}
	unlock_rocket(){
		_can_launch_rocket=true;
	}
	can_launch_rocket(){
		return _can_launch_rocket;
	}
	get_rocket_count(_id){
		return this._unit._ship_package.get_rocket_num(_id);
	}
	get_rocket_icon_file(_id){
		return this.get_rocket_infor(_id).image_file_path;
	}
	
	get_rocket_creating_fc(_id){
		return this.get_rocket_infor(_id).create_fc;
	}
	get_rocket_infor(_id){
		for(let i=0;i<this._rockets_infor.length;i++){
			const _element=this._rockets_infor[i];
			if(_element.id===_id)
				return _element;
		}
		return null;
	}
	
	get_rocket_counter(){
		return this._rocket_counter;
	}
	reset_rocket_counter(){
		this._rocket_counter=0;
	}
	
	init(unit,num1,rocket_infor){
		if(this._main_container&&this._main_container!=null)
			this._main_container.remove();
		
		this._rockets_infor=rocket_infor;
		this._unit=unit;
		this._num1=num1;
	
		this._num2=0;
		this._num3=0;
		this._num4=0;
		
		this._main_container=document.createElement("div");
		this._main_container.style.position="absolute";
		this._main_container.style.bottom="30%";
		this._main_container.style.right="7%";
		
		if(this._game._root_div)
			this._game._root_div.appendChild(this._main_container);
		
		var styleTag = document.createElement("style");
		styleTag.textContent=`
			
.glowing-btn-container{
  position:absolute;
  top:0px;
  left:0px;
  height: 70px;
  width: 70px;
  background-color: #4b4bd1;
  padding: 3px;
  border-radius: 50px;
  box-shadow: 0 0 20px 3px #4b4bd1;
}
.glowing-btn-container:hover{
  background: linear-gradient(red, green, blue);
  animation: animation 1.5s linear infinite;
}
@keyframes animation{
  0% {
    filter: hue-rotate(0deg);
  }
  100% {
    filter: hue-rotate(360deg);
  }
}
.glowing-btn{
  position:absolute;
  height: 70px;
  width: 70px;
  background-color: #000;
  color: #4b4bd1;
  border: 3px solid transparent;
  border-radius: 50px;
  font-size: 20px;
  color:white;
  background-size: 150% 150%;
  background-position: center;
}
		`;
		
		document.head.appendChild(styleTag);
		
		this._container1=document.createElement("div");
		this._container1.classList.add("glowing-btn-container");
		let _html1=`<button id="main-rocket-button" class="glowing-btn">R</button>`;
		this._container1.innerHTML+=_html1;
		//this._container1.style.visibility="hidden";
		this._main_container.appendChild(this._container1);
		this._main_rocket_button=document.getElementById("main-rocket-button");
		this._main_rocket_button.addEventListener("click",()=>{
			this.require_launch_current_rocket_id();
		});
		
		this._container2=document.createElement("div");
		this._container2.classList.add("glowing-btn-container");
		let _html2=this.get_button_html_code(num1,"exploration-ship.png");
		//let _html2=`<button class="glowing-btn" style="background-image:url('./resources/icons/exploration-ship.png')">`+num1+`</button>`;
		this._container2.innerHTML+=_html2;
		this._container2.style.visibility="hidden";
		//this._container2.style.backgroundImage="url('./resources/icons/missle-1.png')";
		this._main_container.appendChild(this._container2);
		
		this._container3=document.createElement("div");
		this._container3.classList.add("glowing-btn-container");
		let _html3=this.get_button_html_code(this._num2,"missle-1.png");
		//let _html3=`<button class="glowing-btn" style="background-image:url('./resources/icons/missle-1.png')"><p style="position:absolute;top:-5px;left:50px">`+num2+`</p></button>`;
		this._container3.innerHTML+=_html3;
		this._container3.style.visibility="hidden";
		this._main_container.appendChild(this._container3);
		
		this._container4=document.createElement("div");
		this._container4.classList.add("glowing-btn-container");
		let _html4=this.get_button_html_code(this._num3,"missle-2.png");
		//let _html4=`<button class="glowing-btn" style="background-image:url('./resources/icons/missle-2.png')">`+num3+`</button>`;
		this._container4.innerHTML+=_html4;
		this._container4.style.visibility="hidden";
		this._main_container.appendChild(this._container4);
		
		this._container5=document.createElement("div");
		this._container5.classList.add("glowing-btn-container");
		let _html5=this.get_button_html_code(this._num4,"missle-3.png");
		//let _html5=`<button class="glowing-btn" style="background-image:url('./resources/icons/missle-3.png')">`+num4+`</button>`;
		this._container5.innerHTML+=_html5;
		this._container5.style.visibility="hidden";
		this._main_container.appendChild(this._container5);
		
		const _scale='scale(0.8)';
		
		this._container2.style.left="-50px";
		this._container2.style.top="-100px";
		this._container2.style.transform = _scale;
		
		this._container3.style.left="-100px";
		this._container3.style.top="-40px";
		this._container3.style.transform = _scale;
		
		this._container4.style.left="-100px";
		this._container4.style.top="30px";
		this._container4.style.transform = _scale;
		
		this._container5.style.left="-50px";
		this._container5.style.top="100px";
		this._container5.style.transform = _scale;
		
		let _game=this._game;
		
		this._container2.addEventListener("click",()=>{
			//if(!_can_launch_rocket)return;
			//_temp_lock_rocket_fc();
			if(this._unit._ship_package.get_exploration_ship_num()<=0)return;
			this._num1--;
			this._unit._ship_package.minus_exploration_ship_num();
			this.update();
				let _pos1=this._unit.get_ahead_point(5);//alert(_pos.x+ " "+_pos.y+" "+_pos.z);
				let _pos2=this._unit.get_ahead_point(150);
				let _ship=this._game._unitMG.create_exploration_ship_1(_pos1);
				this._game._graphics.Scene.add(_ship._model);
				_ship._model.lookAt(_pos2);
				this._game._sound.play('rocket-5');
		});
		//-----------------------------
		let _t_id=1;
		for(let i=1;i<=3;i++){
			let _rocket_id=this._rockets_infor[i-1].id;
			if(this._unit._ship_package.get_rocket_num(_rocket_id)>0){
				_t_id=i;
				break;
			}
		}
		this.change_current_rocket_id(_t_id);
		//-----------------------
		
		this._container3.addEventListener("click",()=>{
			this.change_current_rocket_id(1);
			//if(!_can_launch_rocket)return;//console.log("CanLaunchRocket:"+_can_launch_rocket);
			//_temp_lock_rocket_fc();
			
			this.require_launch_rocket(1);
		});
		this._container4.addEventListener("click",()=>{
			this.change_current_rocket_id(2);
			//if(!_can_launch_rocket)return;
			//_temp_lock_rocket_fc();
			
			this.require_launch_rocket(2);
		});
		this._container5.addEventListener("click",()=>{
			this.change_current_rocket_id(3);
			//if(!_can_launch_rocket)return;
			//_temp_lock_rocket_fc();
			
			this.require_launch_rocket(3);
		});
		
		this._list1=[this._container2,this._container3,this._container4,this._container5];
		
		let _open=false;
		this._container1.addEventListener("click",()=>{
			//this.change_visibility();
		});
		
		this.change_visibility();
		this.update();
	}
	change_visibility(){
		this._open=!this._open;
		let _visibility="visible";
		if(!this._open) _visibility="hidden";
		//else this._game.change_key_mode(2);
			
		this.switch_visibility(_visibility);
	}
	switch_visibility(_visibility){
		for(let i=0;i<this._list1.length;i++){
				const _element=this._list1[i];
				_element.style.visibility=_visibility;
			}
	}
	
	get_button_html_code(count,img){
		const _rs=`<button class="glowing-btn" style="background-image:url('`+img+`');filter:brightness( 190% );">
		<p style="position:absolute;top:-5px;left:90px;
		
									font-weight: bold;
									font-family: 'Orbitron', sans-serif;
		">`+count+`</p>
		</button>`;
		
		return _rs;
	}
	
	next_rocket(){
		if(this._current_rocket_id<3)
			this.change_current_rocket_id(this._current_rocket_id+1);
	}
	prev_rocket(){
		if(this._current_rocket_id>1)
			this.change_current_rocket_id(this._current_rocket_id-1);
	}
	get_rocket_ready_num(){//lay so rocket con lai trong khoang
		let _rs=0;
		for(let i=1;i<=3;i++){
			let _rocket_id=this._rockets_infor[i-1].id;
			_rs+=this._unit._ship_package.get_rocket_num(_rocket_id);		
		}
		return _rs;
	}
	change_current_rocket_id(_id){
		this._current_rocket_id=_id;
		this._main_rocket_button.innerHTML="R"+_id;
	}
	require_launch_current_rocket_id(){
		//if(!this._current_rocket_id)this._current_rocket_id=1;
		
		let _found=false;
			for(let i=1;i<=3;i++){
			let _rocket_id=this._rockets_infor[i-1].id;
				if(this._unit._ship_package.get_rocket_num(_rocket_id)>0){
					_found=true;
					break;
				}
			}
			if(!_found){//ko con rocket
				this._game.create_message_box_3("out of rockets",2);
			}
		
		return this.require_launch_rocket(this._current_rocket_id);
		
	}
	
	require_launch_rocket(_id){
		
		let _max_type=3;
		if(_id>_max_type)return false;
		
		if(!_can_launch_rocket||this.get_rocket_ready_num()===0){
			for(let i=0;i<this._launch_rocket_fail.length;i++){
					this._launch_rocket_fail[i]();
				}
			return false;
		}
		
		let _rocket_id=this._rockets_infor[_id-1].id;
		this.change_current_rocket_id(_id);
		if(this._unit._ship_package.get_rocket_num(_rocket_id)<=0){
			if(_id<_max_type){
				let _rocket_id_1=this._rockets_infor[_id].id;
				if(this._unit._ship_package.get_rocket_num(_rocket_id_1)>0){
					this.next_rocket();
					return this.require_launch_current_rocket_id();
					//return;
				}
			}
			if(_id>1){
				let _rocket_id_2=this._rockets_infor[_id-2].id;
				if(this._unit._ship_package.get_rocket_num(_rocket_id_2)>0){
					this.prev_rocket();
					return this.require_launch_current_rocket_id();
					//return;
				}
			}
			return false;
		}
		
		_temp_lock_rocket_fc();
		
			this._unit._ship_package.minus_rocket_num(_rocket_id);
			this.update();
		
		this.launch_rocket(_rocket_id);
		
		if(this._game._client){
			this._game._client.add_action("missileLaunch="+_rocket_id);
		}
		
		return true;
	}
	add_launch_rocket_fail_function(_fc){
		this._launch_rocket_fail.push(_fc);
	}
	remove_launch_rocket_fail_function(_fc){
		for(let i=this._launch_rocket_fail.length-1;i>=0;i--){
				if(_fc===this._launch_rocket_fail[i]){
					this._launch_rocket_fail.splice(i,1);
					return true;
				}
		}
		return false;
	}
	add_after_launch_function(_fc){
		this._after_launch_fc.push(_fc);
	}
	remove_after_launch_function(_fc){
		for(let i=this._after_launch_fc.length-1;i>=0;i--){
				if(_fc===this._after_launch_fc[i]){
					this._after_launch_fc.splice(i,1);
					return true;
				}
		}
		return false;
	}
	
	launch_rocket(_id){
		
				this._rocket_counter++;
				let _pos1=this._unit.get_ahead_point(15);
				let _pos2=this._unit.get_ahead_point(150);
				
				let _rockets=this.get_rocket_creating_fc(_id)(this._unit,_pos1,false);
				for(let i=0;i<_rockets.length;i++){
					const _rocket=_rockets[i];
					this._game._graphics.Scene.add(_rocket._model);
					_rocket._model.lookAt(_pos2);
					_rocket._player_id=this._unit._player_id;
					_rocket._unit=this._unit;
					_rocket._is_enemy=this._unit._is_enemy;
				}
			
				if(_id===1)
					this._game._sound.playSound('rocket-1',this._unit);
				else if(_id===2)
					this._game._sound.playSound('rocket-5',this._unit);
				else if(_id===3)
					this._game._sound.playSound('rocket-6',this._unit);
				else
					this._game._sound.playSound('missile-launch',this._unit);
				
				for(let i=0;i<this._after_launch_fc.length;i++){
					this._after_launch_fc[i](_rockets);
				}
				
				return _rockets;
	}
	
	enable_launch_sub_rocket(_id){
		
		const _infor=this._game._unitMG.get_sub_rocket_infor(_id);
		
		this.launch_sub_rocket=()=>{
			return this._unit.launch_sub_rocket(_infor.count,_infor.particle_id,_infor.particle_color,_infor.damage);
		};
		
		let _lock_sub_rocket=false;
		this.add_launch_rocket_fail_function(()=>{
			if(_lock_sub_rocket)
				return;
			_lock_sub_rocket=true;
			this._game.add_to_timer(()=>{
				_lock_sub_rocket=false;
			},6);
				this.launch_sub_rocket();
				//this._unit.launch_sub_rocket(_infor.count,_infor.particle_id,_infor.particle_color,_infor.damage);
		});
	}
	
	update(){
		try{
		this._container2.innerHTML=this.get_button_html_code(this._num1,"./resources/icons/explore-ship.png");
		
		for(let i=0;i<this._rockets_infor.length;i++){
			const _id=this._rockets_infor[i].id;;
			const _icon_file=this.get_rocket_icon_file(_id);//alert(_icon_file);
			const _count=this.get_rocket_count(_id);
			let _container;
			if(i===0)_container=this._container3;
			if(i===1)_container=this._container4;
			if(i===2)_container=this._container5;
			
			if(_container){//alert(_icon_file);
				_container.innerHTML=this.get_button_html_code(_count,_icon_file);
			}
		}
		}catch(e){alert(e.stack);}
	}
}
export {RocketPackage}