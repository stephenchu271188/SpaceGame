
var _lock=false;
class NavigatorBar2{
	constructor(params){
		this._game=params.game;
		this._lock_reset_rotation=false;
		this._lock_turn_back_skill=false;
	}
	lock_mouse_event(){
		_lock=true;
	}
	unlock_mouse_event(){
		_lock=false;
	}
	show(){
		this._main_container.style.visibility="visible";
	}
	hide(){
		this._main_container.style.visibility="hidden";
	}
	clear(){
		this._main_container.remove();
	}
	init(){
		this._main_container=document.createElement("div");
		this._main_container.style.position="absolute";
		this._main_container.style.top="150px";
		this._main_container.style.left="1200px";
		this._main_container.style.zIndex="9999";
		//this._main_container.style.display="flex";
		//this._main_container.style.flexDirection="column";

		if(this._game._root_div)
		this._game._root_div.appendChild(this._main_container);
		
		
		let _html;
		
		this._left=document.createElement("div");
		this._left.classList.add("glowing-btn-container2");
		_html=this.get_button_html_code("Q","arrow-6.png");
		this._left.innerHTML+=_html;
		this._left.style.top="230px";
		this._left.style.left="60px";
		this._main_container.appendChild(this._left);
		
		this._right=document.createElement("div");
		this._right.classList.add("glowing-btn-container2");
		_html=this.get_button_html_code("E","arrow-6.png");
		this._right.innerHTML+=_html;
		this._right.style.top="260px";
		this._right.style.left="130px";
		this._main_container.appendChild(this._right);


		this._shoot=document.createElement("div");
		this._shoot.classList.add("glowing-btn-container2");
		_html=this.get_button_html_code("En","focus.png");
		this._shoot.innerHTML+=_html;
		this._shoot.style.top="340px";
		this._shoot.style.left="150px";
		this._main_container.appendChild(this._shoot);
		
		this._turn_back=document.createElement("div");
		this._turn_back.classList.add("glowing-btn-container2");
		_html=this.get_button_html_code("T","arrow-7.png");
		this._turn_back.innerHTML+=_html;
		this._turn_back.style.top="420px";
		this._turn_back.style.left="130px";
		this._main_container.appendChild(this._turn_back);
		
		this._reset_rotation=document.createElement("div");
		this._reset_rotation.classList.add("glowing-btn-container2");
		_html=this.get_button_html_code("T","arrow-8.png");
		this._reset_rotation.innerHTML+=_html;
		this._reset_rotation.style.top="450px";
		this._reset_rotation.style.left="60px";
		this._main_container.appendChild(this._reset_rotation);
		
		
		this._left.addEventListener("mousedown",()=>{
			if(_lock)return;
			this._game.auto_key_down(81);
		});
		this._left.addEventListener("mouseup",()=>{
			if(_lock)return;
			this._game.auto_key_up(81);
		});
		this._right.addEventListener("mousedown",()=>{
			if(_lock)return;
			this._game.auto_key_down(69);
		});
		this._right.addEventListener("mouseup",()=>{
			if(_lock)return;
			this._game.auto_key_up(69);
		});
		this._shoot.addEventListener("mousedown",()=>{
			if(_lock)return;
			this._game.auto_key_down(13);
		});
		this._shoot.addEventListener("mouseup",()=>{
			if(_lock)return;
			this._game.auto_key_up(13);
		});
		this._turn_back.addEventListener("mouseup",()=>{
			if(_lock)return;
			if(this._lock_turn_back_skill)return;
			this._game.auto_key_down(84);
		});
		this._reset_rotation.addEventListener("mouseup",()=>{
			if(_lock)return;
			if(this._lock_reset_rotation)return;
			this._game._me._model.rotation.set(0,0,0);
		});
	}
	
	get_button_html_code(title,img){
		let _transform="";
		if(title==="Q")
			_transform=";transform: rotate(180deg);";
		//const _rs=`<button class="glowing-btn2" style="background-image:url('./resources/icons/`+img+`')">
		const _rs=`<button class="glowing-btn2" style="`+_transform+`background: rgba(0, 0, 0, 0) url('./resources/icons/`+img+`') no-repeat center center">
		<p style="position:absolute;top:-25px;left:20px;color:orange;font-weight:900;">`+title+`</p>
		</button>`;
		
		return _rs;
	}
}
export {NavigatorBar2}