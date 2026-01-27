//import {MissionDataMG} from './mission-data.js';

class MissionList{
	constructor(params){
		this._game=params.game;
		this._data=params.data;
		
		//alert("Data="+this._data);
		
		this._container=null;
		
		this._last_id=-1;//id cua mission cao nhat da hoan thanh
	}
	
	create_list(_fc){
		this.close_panel();
		
		let _mission_num=250;
		
		const _max_star=3;
		
		const _width=120;
		const _height=120;
		
		const _col_num=10;
		const _fX=40;
		const _fY=50;
		const _spX=_width+20;
		const _spY=_height+20;
		
		var elements = document.getElementsByTagName("*");
		var highest_index = 0;
		for (var i = 0; i < elements.length - 1; i++) {
			if (parseInt(elements[i].style.zIndex) > highest_index) {
				highest_index = parseInt(elements[i].style.zIndex);
			}
		}
		
		this._container=document.createElement("div");
		this._container.style.position="absolute";
		this._container.style.top="0px";
		this._container.style.left="0px";
		this._container.style.width="100%";
		this._container.style.height="100%";
		this._container.style.zIndex=(highest_index+9999)+"";
		//this._container.style.backgroundColor="black";
		this._container.style.background="radial-gradient(circle, blue, #000000)";
		this._container.style.overflow="auto";
		
		let _close_btn=document.createElement("button");
		_close_btn.innerHTML="X";
		_close_btn.style.position="absolute";
		_close_btn.style.top="0px";
		_close_btn.style.right="0px";
		_close_btn.style.width="40px";
		_close_btn.style.height="40px";
		//this._container.appendChild(_close_btn);
		_close_btn.addEventListener("click",()=>{
			this.close_panel();
		});
		
		this._list_container=document.createElement("div");
		this._list_container.style.position="absolute";
		this._list_container.style.top="5%";
		this._list_container.style.left="0px";
		this._list_container.style.width="100%";
		this._list_container.style.height="95%";
		this._container.appendChild(this._list_container);
		
		document.body.appendChild(this._container);
		
		
		let _px,_py;
		let _colID=0,_rowID=0;
		for(let i=0;i<_mission_num;i++){
			let _level_data=null;
			let _star_num=0;
			for(let j=0;j<this._data.length;j++){
				const _element=this._data[j];
				const _level=parseInt(_element[0]);
				const _star_num2=parseInt(_element[1]);
				if(_level===i+1){
					_star_num=_star_num2;
					this._last_id=i;
					break;
				}
			}
			//console.log("StarNum="+_star_num);
			
			_px=_fX+(_colID*_spX);
			_py=_fY+(_rowID*_spY);
			let _cell=document.createElement("div");
			_cell.classList.add("animated-button8");
			_cell.style.position="absolute";
			_cell.style.width=_width+"px";
			_cell.style.height=_height+"px";
			_cell.style.left=_px+"px";
			_cell.style.top=_py+"px";
			_cell.style.backgroundColor="turquoise";
			_cell.style.overflow="visible";
			_cell.style.border="2px solid";
			_cell.style.borderImage="linear-gradient(45deg, #e5330c, #3333ff) 1";
			_cell.style.filter="brightness( 140% ) ";
			this._container.appendChild(_cell);
			
			const _label1=document.createElement("div");
			_label1.style.position="absolute";
			_label1.style.width="70%";
			_label1.style.height="10px";
			_label1.style.top="-10px";
			_label1.style.left="17%";
			_label1.style.color="white";
			_label1.style.fontSize="18px";
			_label1.style.fontWeight="bold";
			//_label1.innerHTML="Level "+(i+1);
			_label1.innerHTML=`<b  style="
									background: linear-gradient(to bottom,blue ,white ,red );
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
									font-size: 24px;
									font-weight: bold;
				"'>Level 
			`
			+(i+1)+`</b>`;
			_cell.appendChild(_label1);
			
			const _star_container=document.createElement("div");
			_star_container.style.position="absolute";
			_star_container.style.bottom="-8px";
			_star_container.style.left="23%";
			for(let j=0;j<_max_star;j++){
				const _star=document.createElement("img");
				_star.style.width="20px";
				_star.style.height="20px";
				
				if(j<_star_num)
					_star.src="./resources/img/star1.png";
				else
					_star.src="./resources/img/star2.png";
				
				_star_container.appendChild(_star);
			}
			_cell.appendChild(_star_container);
			
			let _missionLevel=(i+1);
			_cell.addEventListener("click",()=>{
				if(localStorage.getItem('demo-game-level')==null||localStorage.getItem('demo-game-level')=="null")
				if(i>this._last_id+1){
					//alert("Hay hoan thanh level thap hon truoc");
					return false;
				}
				if(i===this._last_id+1){
					_cell.style.borderImage="linear-gradient(45deg, #f5f0ef, #3333ff) 1";
				}
				this.close_panel();
				localStorage.setItem('mission-level', _missionLevel);
				_fc();
			});
			
			
			_colID++;
			if(_colID>=_col_num){
				_colID=0;
				_rowID++;
			}
		}
	}
	
	close_panel(){
		if(this._container!=null)
			this._container.remove();
		this._container=null;
	}
}
export {MissionList}