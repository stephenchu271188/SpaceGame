
var _lock=false;
class NavigatorBar1{
	constructor(params){
		this._game=params.game;
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
		this._main_container.style.top="330px";
		this._main_container.style.left="1px";
		//this._main_container.style.display="flex";
		//this._main_container.style.flexDirection="column";

		if(this._game._root_div)
			this._game._root_div.appendChild(this._main_container);
		
		var styleTag = document.createElement("style");
		styleTag.textContent=`
			
.glowing-btn-container2{
  position:absolute;
  top:0px;
  left:0px;
  height: 50px;
  width: 50px;
  background-color: #33FFEC;
  padding: 3px;
  border-radius: 50px;
  box-shadow: 0 0 20px 3px #33BBFF;
}
.glowing-btn-container2:hover{
  background: linear-gradient(red, green, blue);
  animation: animation2 1.5s linear infinite;
}
@keyframes animation2{
  0% {
    filter: hue-rotate(0deg);
  }
  100% {
    filter: hue-rotate(360deg);
  }
}
.glowing-btn2{
  position:absolute;
  height: 50px;
  width: 50px;
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
		
		let _html;
		
		this._up=document.createElement("div");
		this._up.classList.add("glowing-btn-container2");
		_html=this.get_button_html_code("W","arrow-5.png");
		this._up.innerHTML+=_html;
		this._up.style.top="150px";
		this._up.style.left="100px";
		this._main_container.appendChild(this._up);
		
		this._down=document.createElement("div");
		this._down.classList.add("glowing-btn-container2");
		_html=this.get_button_html_code("S","arrow-5.png");
		this._down.innerHTML+=_html;
		this._down.style.top="250px";
		this._down.style.left="100px";
		this._main_container.appendChild(this._down);
		
		this._left=document.createElement("div");
		this._left.classList.add("glowing-btn-container2");
		_html=this.get_button_html_code("A","arrow-5.png");
		this._left.innerHTML+=_html;
		this._left.style.top="200px";
		this._left.style.left="50px";
		this._main_container.appendChild(this._left);
		
		this._right=document.createElement("div");
		this._right.classList.add("glowing-btn-container2");
		_html=this.get_button_html_code("D","arrow-5.png");
		this._right.innerHTML+=_html;
		this._right.style.top="200px";
		this._right.style.left="150px";
		this._main_container.appendChild(this._right);
		
		this._up.addEventListener("mousedown",()=>{
			if(_lock)return;
			this._game.auto_key_down(87);
		});
		this._up.addEventListener("mouseup",()=>{
			if(_lock)return;
			this._game.auto_key_up(87);
		});
		this._down.addEventListener("mousedown",()=>{
			if(_lock)return;
			this._game.auto_key_down(83);
		});
		this._down.addEventListener("mouseup",()=>{
			if(_lock)return;
			this._game.auto_key_up(83);
		});
		this._left.addEventListener("mousedown",()=>{
			if(_lock)return;
			this._game.auto_key_down(65);
		});
		this._left.addEventListener("mouseup",()=>{
			if(_lock)return;
			this._game.auto_key_up(65);
		});
		this._right.addEventListener("mousedown",()=>{
			if(_lock)return;
			this._game.auto_key_down(68);
		});
		this._right.addEventListener("mouseup",()=>{
			if(_lock)return;
			this._game.auto_key_up(68);
		});
	}
	
	get_button_html_code(title,img){
		let _transform="";
		if(title==="W")
			_transform=";transform: rotate(-90deg);";
		if(title==="S")
			_transform=";transform: rotate(90deg);";
		if(title==="A")
			_transform=";transform: rotate(180deg);";
		//const _rs=`<button class="glowing-btn2" style="background-image:url('./resources/icons/`+img+`');background-color: rgba(0, 0, 0, 0.4);">
		const _rs=`<button class="glowing-btn2" style="`+_transform+`background: rgba(0, 0, 0, 0) url('./resources/icons/`+img+`') no-repeat center center">
		</button>
		<p style="position:absolute;top:-25px;left:20px;color:orange;font-weight:900;">`+title+`</p>
		`;
		
		return _rs;
	}
}
export {NavigatorBar1}