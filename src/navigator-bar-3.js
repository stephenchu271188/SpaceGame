
var _lock=false;
var _skill_ids=new Array();
let _pos_list=[
			{x:"130px",y:"60px"},
			{x:"190px",y:"130px"},
			{x:"190px",y:"200px"},
			{x:"130px",y:"270px"},
			
		];
for(let i=0;i<_pos_list.length;i++){
	_skill_ids.push(null);
}		

class NavigatorBar3{
	constructor(params){
		this._game=params.game;
		
	}
	set_fix_skill(_id){
		_skill_ids[0]={id:_id,fix:true};
	}
	is_using_skill(_id){
		for(let i=0;i<_skill_ids.length;i++){
			if(_skill_ids[i]===null)continue;
			if(_skill_ids[i].id===_id)
				return true;
		}
		return false;
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
		if(this._main_container)
			this._main_container.remove();
	}
	init(){
		this.clear();
		
		this._main_container=document.createElement("div");
		this._main_container.style.position="absolute";
		this._main_container.style.top="300px";
		this._main_container.style.left="10px";
		this._main_container.style.zIndex="9999";
		//this._main_container.style.display="flex";
		//this._main_container.style.flexDirection="column";

		if(this._game._root_div)
		this._game._root_div.appendChild(this._main_container);
	
		this._container1=document.createElement("div");
		this._container1.classList.add("glowing-btn-container");
		let _html1=`<button id="main-rocket-button" class="glowing-btn">Sp x2</button>`;
		this._container1.innerHTML+=_html1;
		this._container1.style.left="80px";
		this._container1.style.top="150px";
		this._main_container.appendChild(this._container1);
		//this._main_rocket_button=document.getElementById("main-rocket-button");
		this._container1.addEventListener("click",()=>{
			//console.log("FOUND");
			this._game._me.perform_additional_skill();
		});
		
		
		for(let i=0;i<_pos_list.length;i++){
			//if(i>_pos.length-1)return;
			let _id=null,_fix=null;
			let _select_id=i;
			if(_skill_ids[i]&&_skill_ids[i].id!=null){
				_id=_skill_ids[i].id;
				_fix=_skill_ids[i].fix;
			}
			
			
			let _html;
			let _icon=document.createElement("div");
			_icon.classList.add("glowing-btn-container2");
			_icon.style.backgroundImage="linear-gradient(120deg, #a6c0fe 0%, #f68084 100%)";
			
			const bg = document.createElement("div");
bg.style.position = "absolute";
bg.style.top = "-15%";
bg.style.left = "-15%";
bg.style.width = "130%";
bg.style.height = "130%";
bg.style.background = `url("./resources/icons/ring-4.png") center/cover no-repeat`;
bg.style.zIndex = "-1";
_icon.appendChild(bg);
			
			_icon.style.top=_pos_list[i].y;
			_icon.style.left=_pos_list[i].x;
			if(_id!=null){
				const _img=this._game._parameters.get_additional_skill_icon_path(_id);
				_html=this.get_button_html_code("",_img);
				_icon.innerHTML+=_html;
				
			}
			else{
				const _img="./resources/icons/null-1.png";
				_html=this.get_button_html_code("",_img);
				_icon.innerHTML+=_html;
			}
			
			this._main_container.appendChild(_icon);
			
			_icon.addEventListener("mousedown",()=>{
				if(_lock)return;
				if(_id!=null){
					//let _perform=this._game._parameters.get_additional_skill_create_fc(_id);
					//_perform(this._game._me,1);
					this._game._me._ship_package.use_additional_skill(_id);
					//this._game._me._ship_package.save_data();
					//let _t_skills=this._ship_package.get_ship_additional_skills();
					this._game._me.perform_additional_skill();
				}
				else{
					this.create_additional_skills_list(_select_id);
				}
			});
		}
		
	}
	
	remove_additional_skills_list(){
		if(this._additional_skills_panel&&this._additional_skills_panel!=null){
			this._additional_skills_panel.remove();
			this._additional_skills_panel=null;
		}
	}
	create_additional_skills_list(_select_id){
		this.remove_additional_skills_list();
		this._additional_skills_panel=document.createElement("div");
		this._additional_skills_panel.style.position="absolute";
		this._additional_skills_panel.style.width="550px";
		this._additional_skills_panel.style.height="50%";
		this._additional_skills_panel.style.left="28%";
		this._additional_skills_panel.style.top="20%";
		this._additional_skills_panel.style.border="2px solid transparent";
		this._additional_skills_panel.style.boxShadow="0 0 10px 5px #33BBFF";
		this._additional_skills_panel.style.backgroundColor="rgba(20, 114, 234, 0.5)";
		this._additional_skills_panel.style.zIndex="99999999999999999";
		
		
		this._game._root_div.appendChild(this._additional_skills_panel);
		
		const _title=document.createElement("div");
			  _title.style.position="absolute";
			  //_title.style.marginTop="0px";
			  //_title.style.background="rgba(0,0,0,0.8)";
			  _title.style.textAlign="center";
			  _title.style.color="white";
			  //_title.innerHTML="<h3>Additional Skills</h3>";
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
			  _title.innerHTML=`
					<h1  style="
									background: linear-gradient(to bottom, red,white, yellow);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
									font-size: 34px;
									font-weight: bold;
									font-family: 'Orbitron', sans-serif;
				"'>
			  Additional Skills</h1>`;
		this._additional_skills_panel.appendChild(_title);
		  
		const _close_btn=document.createElement("button");
		_close_btn.style.position="absolute";
		_close_btn.style.width="25px";
		_close_btn.style.height="25px";
		_close_btn.style.top="0%";
		_close_btn.style.right="0%";
		_close_btn.style.background="rgba(0,0,0,0.8)";
		_close_btn.style.color="white";
		//_close_btn.classList.add('close-icon');
		_close_btn.innerHTML="X";
		this._additional_skills_panel.appendChild(_close_btn);
		_close_btn.addEventListener("click",()=>{
			 this._additional_skills_panel.remove();
			 this._additional_skills_panel=null;
			 this._game._graphics.remove_divider();
		});
		
		const _full_ids=this._game._parameters.get_additional_skills_ids();
		let _ids=new Array();
		for(let i=0;i<_full_ids.length;i++){
			if(this._game._me._ship_package.has_additional_skill(_full_ids[i])&&
			!this.is_using_skill(_full_ids[i]))
				_ids.push(_full_ids[i]);
		}
		//alert(_ids.length);
		let _child_icon_list=new Array();
		const _width=60;
		const _height=_width;
		const _spX=_width+10;
		const _spY=_spX;
		const _fx=30;
		const _fy=75;
		let _px,_py;
		let _colID=0,_rowID=0;
		const _colNum=7;
		const _rowNum=3;
		const _num=_colNum*_rowNum;
		let _border_style_1="3px solid yellow";//premium
		let _border_style_2="3px solid white";//đã sở hữu
		let _border_style_3="3px solid orange";//đã sở hữu và đang sử dụng
			  
		for(let i=0;i<_num;i++){
			_px=_fx+(_colID*_spX);
			_py=_fy+(_rowID*_spY);//console.log(_px+" and "+_py);
			let _icon_container=document.createElement("div");
			_icon_container.style.position="absolute";
			_icon_container.style.width=_width+"px";
			_icon_container.style.height=_height+"px";
			_icon_container.style.left=_px+"px";
			_icon_container.style.top=_py+"px";
			//_icon_container.style.backgroundColor="rgba(0, 0, 0, 0.4)";
			_icon_container.style.backgroundImage="linear-gradient(-30deg, #000000 50%, #081a2b 50%)"
			
			if(i<_ids.length){
			
				const _id=_ids[i];
				const _name=this._game._parameters.get_additional_skill_name(_id);
				const _img_path=this._game._parameters.get_additional_skill_icon_path(_id);
				const _price=this._game._parameters.get_additional_skill_price(_id);
				const _ship_level=this._game._parameters.get_additional_skill_ship_level_require(_id);
				const _limit=this._game._parameters.get_additional_skill_limit(_id);
				const _groupID=this._game._parameters.get_additional_skill_group(_id);
				//const _icon_src=this._game._parameters.get_additional_skill_icon_path(_id);
			
				const _premium_group=this._game._unitMG.is_premium_additional_skill_group(this._game._me._ship_id,_groupID);
			
				_icon_container._additional_skill_id=_id;
				_icon_container._additional_skill_name=_name;
				_child_icon_list.push(_icon_container);
				
				let _img=document.createElement("img");
				_img.src=_img_path;
				_img.style.width="100%";
				_img.style.height="100%";
				_icon_container.appendChild(_img);
				if(_premium_group)
					_img.style.border=_border_style_2;
				else{
					if(this._game._me._ship_package.using_additional_skill(_id))
						_img.style.border=_border_style_3;
					else{
						_img.style.border=_border_style_2;
					}
				}
				
				if(_premium_group===true){
					let _label1=document.createElement("div");
						_label1.style.position="absolute";
						_label1.style.width="36%";
						_label1.style.height="36%";
						_label1.style.right="5px";
						_label1.style.top="5px";
						_label1.style.backgroundColor="rgba(132, 138, 137, 0.4)";
						_icon_container.appendChild(_label1);
					
					const _premium_icon=document.createElement("img");
						_label1.appendChild(_premium_icon);
						_premium_icon.src="./resources/icons/crown-3.png";
						_premium_icon.style.width="100%";
						_premium_icon.style.height="100%";
				}
				
				_icon_container.addEventListener("click",()=>{
					//try{
					if(!this._game._me._ship_package.using_additional_skill(_id)
						&&!this.is_using_skill(_id)){
						_skill_ids[_select_id]={id:_id,fix:false};
						this._game._me._ship_package.use_additional_skill(_id);
						//this._game._me._ship_package.save_data();
						this.remove_additional_skills_list();
						this.init();
						this._game._me.perform_additional_skill();
					}
					//}catch(e){alert(e.stack);}
				});
			}
			
			this._additional_skills_panel.appendChild(_icon_container);
			_colID++;
			  if(_colID>=_colNum){
				_colID=0;
				_rowID++;
			  }
		}	  
	}
	
	get_button_html_code(title,img){
		let _transform="";
		if(title==="Q")
			_transform=";transform: rotate(180deg);";
		//const _rs=`<button class="glowing-btn2" style="background-image:url('./resources/icons/`+img+`')">
		const _rs=`<button class="glowing-btn2" style="`+_transform+`background: rgba(0, 0, 0, 0) url('`+img+`') no-repeat center center">
		<p style="position:absolute;top:-25px;left:20px;color:orange;font-weight:900;">`+title+`</p>
		</button>`;
		
		return _rs;
	}
}
export {NavigatorBar3}