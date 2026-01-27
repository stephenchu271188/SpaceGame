import {PriceList} from '../core/price-list.js';

let _game,_menu_class;
let _cash_container=document.getElementById("cash-container");
function goto_star(i,j){
	_game.goto_star(i,j);
}
function goto_planet(i,j,k){
	_game.goto_planet(i,j,k);
}
function goto_moon(i,j,k,l){
	_game.goto_moon(i,j,k,l);
};
class MenuBar{
	constructor(params){
		this._params=params;
		this._data=params.data;
		this._game=params.game;
		_game=this._game;
		_menu_class=this;
		this._price_list=new PriceList();
		
		this._next_id=0;
		try{
		this.init();
		
		}catch(e){alert(e.toString());}
	}
	
	get_next_id(){
		this._next_id++;
		return this._next_id;
	}
	
	add_new_system(){//try{
		if(this._game._me._inventory._cash<this._price_list.add_new_star_system_price){
			alert("Not Enough Money");
			return false;
		}
		let _new_data={"id":20,"userID":null,"position":[0,0,0],"starList":[{"radius":0.3862257952510356,"position":[0,0,0],"skinID":1,"planetList":[{"radius":0.1,"skinID":1,"distance":0.1,"speed1":1,"speed2":2,"moonList":[{"radius":0.02,"skinID":1,"distance":0.03,"alpha":1.5,"speed1":0.01,"speed2":0.02}]},{"radius":0.1,"skinID":1,"distance":0.1,"speed1":1,"speed2":2,"moonList":[{"radius":0.02,"skinID":1,"distance":0.03,"alpha":1.5,"speed1":0.01,"speed2":0.02}]},{"radius":0.1,"skinID":1,"distance":0.1,"speed1":1,"speed2":2,"moonList":[{"radius":0.02,"skinID":1,"distance":0.03,"alpha":1.5,"speed1":0.01,"speed2":0.02}]}]}],"asteroidBelt":[],"cometList":[]};
		this._game.get_universe().get_current_galaxy().add_new_star_system(_new_data);
		let _ul1=document.getElementById("_ul");
		_ul1.innerHTML="";
	
		this.init();
		this._game._me._inventory.take_cash(this._price_list.add_new_star_system_price);
		this.update_cash();
	//}catch(e){alert(e.toString());}
	}
	add_new_planet(star_system_id,star_id){
		if(this._game._me._inventory._cash<this._price_list.add_new_planet_price){
			alert("Not Enough Money");
			return false;
		}
		let _new_data={"type":1,"radius":0.1,"skinID":1,"distance":0.1,"speed1":1,"speed2":2,"moonList":[{"radius":0.02,"skinID":1,"distance":0.03,"alpha":1.5,"speed1":0.01,"speed2":0.02}]};
		let _star=this._game.get_universe().get_current_galaxy().get_star_class(star_system_id,star_id);
		_star.add_new_planet(_new_data);
		let _ul1=document.getElementById("_ul");
		_ul1.innerHTML="";
		this.init();
		this._game._me._inventory.take_cash(this._price_list.add_new_planet_price);
		this.update_cash();
	}
	add_new_moon(star_system_id,star_id,planet_id){
		if(this._game._me._inventory._cash<this._price_list.add_new_moon_price){
			alert("Not Enough Money");
			return false;
		}
		let _new_data={"radius":0.02,"skinID":1,"distance":0.03,"alpha":1.5,"speed1":0.01,"speed2":0.02};
		let _planet=this._game.get_universe().get_current_galaxy().get_planet_class(star_system_id,star_id,planet_id);
		_planet.add_new_moon(_new_data);
		let _ul1=document.getElementById("_ul");
		_ul1.innerHTML="";
		this.init();
		this._game._me._inventory.take_cash(this._price_list.add_new_moon_price);
		this.update_cash();
	}
	update_cash(){
		_cash_container.innerHTML="Cash: "+this._game._me._inventory._cash;
	}
	init(){
		
		let _ul1=document.getElementById("_ul");
		_ul1.innerHTML="";
		for(let i=0;i<this._data.length;i++){
			let _system_data=this._data[i];
			let _id=_system_data.id;
			let _position=_system_data.position;
			
			let _li_1=document.createElement("li");
			_ul1.appendChild(_li_1);
			_li_1.innerHTML=' <a href="#"><i class="bx bx-home"></i><span class="link_name">Home</span></a>';
			
			let _ul2=document.createElement("ul");
			_li_1.appendChild(_ul2);
			_ul2.classList.add("sub-menu");
			_ul2.classList.add("blank");
			_ul2.innerHTML="<li><a class='link_name' href='#'>System "+(i+1)+"</a></li>";
			
			let _starList=_system_data.starList;
			for(let j=0;j<_starList.length;j++){
				let _star=_starList[j];
				let _planetList=_star.planetList;
				
				let _li_2=document.createElement("li");
				_ul2.appendChild(_li_2);
				
				let _ul3=this.add_sub_menu(_ul2,
										  "&nbsp; &nbsp; &nbsp;Star " + (j + 1),
										  ()=>{goto_star(i,j);});
				
				for(let k=0;k<_planetList.length;k++){
					let _planet=_planetList[k];
					
					let _li_3=document.createElement("li");
					_ul3.appendChild(_li_3);
					
					let _ul4=this.add_sub_menu(_ul3,
										  "&nbsp; &nbsp; &nbsp;Planet " + (k + 1),
										  ()=>{goto_planet(i, j, k);});

					let _moonList=_planet.moonList;
					for(let l=0;l<_moonList.length;l++){
						let _li_4=document.createElement("li");
						_ul4.appendChild(_li_4);
						
						this.add_sub_menu(_ul4,
										  "&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;Moon " + (l + 1),
										  ()=>{goto_moon(i, j, k,l);});
					}
					this.add_sub_menu(_ul4,"&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;+New Moon",()=>{_menu_class.add_new_moon(i,j,k);});
				}
				this.add_sub_menu(_ul3,"&nbsp; &nbsp; &nbsp;+New Planet",()=>{_menu_class.add_new_planet(i,j);});
			}
			
			this.add_sub_menu(_ul2,"+New System",()=>{_menu_class.add_new_system();});
		}
	}
	
	add_sub_menu(_ul,_text,_fc){
		let _add_li=document.createElement("li");
				_ul.appendChild(_add_li);
				
				let _add_ul=document.createElement("ul");
				_add_li.appendChild(_add_ul);
				//_ul3.innerHTML="<li><a class='link_name' href='#'>Star "+(j+1)+"</a></li>";
				let add_Element = document.createElement("a");
					let _nID=this.get_next_id();
					add_Element.setAttribute("id", "objectLink" + _nID);
					add_Element.classList.add("link_name");
					add_Element.href = "#";
					add_Element.innerHTML = _text;
					let listItem1 = document.createElement("li");
					listItem1.appendChild(add_Element);
					_add_ul.appendChild(listItem1);
					document.getElementById("objectLink" + _nID).addEventListener("click", function() {
						_fc();
					});
					
					return _add_ul;
	}
	
}


export{MenuBar}