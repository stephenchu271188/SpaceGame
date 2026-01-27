//import {UnitOptionPanel} from './unit-option-panel.js';

class UnitBar{
	constructor(params){
		this._game=params.game;
		this._container=params.container;
	}
	clear(){
		document.getElementById("unit-bar-1").remove();
	}
	init(posX,count){
		let _html=`
			<!-- Sidebar -->
    <div id="unit-bar-1" class="sidebar" style="left:`+posX+`px">
      <!-- Top -->
      <div class="top">
        <div class="dots flex">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>

        <div class="logo flex">
          <ion-icon name="logo-apple-appstore"></ion-icon>
          <p class="hide"></p>
        </div>
      </div>
      <!-- End Top -->
	  
	  <!-- Messages -->
	  <div class="messages flex">
	  `;
	  
	  for(let i=0;i<count;i++){
		_html+=`
				<div id='unit-`+i+`' class="msg flex">
				<img src="./resources/icons/spaceship-icon-1.png" alt="" />
				<p class="hide">Group `+(i+1)+`</p>
				</div>`;
	  }
	  
        
     _html+=`</div>
      <!-- End Messages -->

      <!-- Menu -->
      <div class="menu">
        <div class="menu-item flex">
          <div class="icon">
            <ion-icon name="storefront-outline"></ion-icon>
          </div>

          <p class="hide" style="--delay: 300ms">Store</p>
        </div>

      </div>
      <!-- End Menu -->

      
    </div>
    <!-- End Sidebar -->
    
		`;
		var styleTag = document.createElement("style");
		styleTag.textContent=`
		@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@200;400;500;700&display=swap");
		*,
*::after,
*::before {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  font-family: "Nunito", sans-serif;
}


.sidebar {
  width: 90px;
  height: 650px;
  background: rgba(0, 0, 0, 0);
  backdrop-filter: blur(6px);
  padding: 10px;
  position: absolute;
  top: calc(50% - 300px);
  left: 0px;
  border-radius: 12px;
  display: grid;
  grid-template-rows: 20% 40% 35%;
  overflow: hidden;
  transition: all 0.3s ease-out 0.3s;
  cursor: pointer;
}

.sidebar p {
  font-size: 14px;
}

.flex {
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar.active {
  width: 230px;
  left: calc(50% - 100px);
}

/* Top */
.top {
  width: 80px;
}

.dots {
  margin: 10px 8px 10px 0;
}

.dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ff5c4c;
  margin: 0 5px;
}

.dot:nth-of-type(2) {
  background: #ffbf38;
}

.dot:nth-of-type(3) {
  background: #66e14f;
}

.logo {
  font-size: 45px;
  cursor: pointer;
  color: #222;
  position: absolute;
  left: calc(45px - 22.5px);
  transition: 0.5s linear;
}

.logo p {
  font-size: 15px;
  font-weight: 700;
  margin-left: 6px;
}

/* End Top */

/* Menu */
.menu {
  width: 200px;
}

.menu-item {
  justify-content: start;
  margin: 0 0 15px 25px;
}

.menu-item p {
  font-size: 16px;
  font-weight: 500;
  margin-left: 30px;
}

/* End Menu */

/* Messages */
.messages {
  width: 70px;
  border-radius: 12px;
  background: #14A6EA;
  transition: inherit;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
  position: relative;
}

.messages::before {
  content: "";
  position: absolute;
  width: 50px;
  height: 25px;
  background: #0460fc;
  bottom: -17px;
  left: calc(50% - 25px);
  border-radius: 10px;
  transition: inherit;
  text-align: center;
}

.msg {
  margin: 4px 0 4px 16px;
  justify-content: flex-start;
}

.msg img {
  width: 40px;
  height: 40px;
  border-radius: 15%;
}

.msg p {
  margin-left: 10px;
  font-size: 16px;
  font-weight: 500;
}

.sidebar.active .messages {
  width: 100%;
}

/* End Messages */

.hide {
  transform: translateX(250px);
  opacity: 0;
  transition: all 0.5s ease;
  transition-delay: var(--delay);
}

.icon {
  font-size: 22px;
  color: #353535;
  position: absolute;
  left: calc(45px - 11px);
  transition: 0.5s linear;
}

.icon::before {
  position: absolute;
  content: "";
  width: 80px;
  height: 40px;
  left: -29px;
  top: -7px;
  border-radius: 12px;
  transition: 0.3s all;
}

.menu-item:hover .icon::before {
  background: rgba(255, 255, 255, 0.5);
  transition: 0.6s ease;
}

.sidebar.active .hide {
  opacity: 1;
  transform: translateX(0);
  transition-property: opacity;
  transition-delay: 0.7s;
}

.sidebar.active .icon::before {
  width: 200px;
  left: -20px;
}


/* YT LINK */

		`;
		
		this._container.innerHTML+=_html;
		
		//if(init_style_and_script){
			document.head.appendChild(styleTag);
			//document.querySelector(".sidebar").addEventListener("click", function () {
				//this.classList.toggle("active");
			//});
		//}
		
		let elements = document.querySelectorAll('div.msg.flex');
		elements.forEach((element) => {
			element.addEventListener("click",()=>{//alert("hello");//return;
				let _id=element.id.split('-')[1];
				_id=parseInt(_id);
				
				if(!this._unit_list)
					this._unit_list=new Array();//chi su dung trong class nay, ko lien quan va ko anh huong den cac class khac
				
				//let _iframe=this._game.show_iframe('./src./legion-game/unit-panel.html',()=>{});
				let _iframe=this._game.show_iframe('./show-room-2.html',()=>{});
			
				this._game._iframeContainer.style.top="0px";
				_iframe.onload=()=>{
					
					let _app=_iframe.contentWindow._get_game_class();
					_app._show_room.set_play_button_click_fc(()=>{
						
						const _ship_id=_app._show_room.get_focus_ship_id();
						const _type_id=this._game._parameters.get_mother_ship_type_id_by_ship_id(_ship_id);
						//alert("TypeID="+_type_id);
						this._game.remove_iframe();
						//this._game._iframeContainer.remove();
						for(let i=0;i<this._unit_list.length;i++){
							const _tunit=this._unit_list[i];
							if(_tunit._pos_id===_id){
								this._unit_list.splice(i,1);
								_tunit.SelfDestroy();
								
							}
						}
						
						this._game._warehouse2.load_data();//reload data
						
						const _player_id=this._game._playerID;
						const _pos=this._game._pos_list_1[_id];
						const _create_fc=this._game._warehouse2.get_create_mother_ship_fc(_type_id);
						//const _mother_ship=this._game._unitMG.create_mother_ship(_player_id,1,_pos);
						
						const _mother_ship=_create_fc(_pos);
						_mother_ship._pos_id=_id;
						_mother_ship._player_id=_player_id;
						_mother_ship.set_mother_ship_id(_ship_id);
						_mother_ship.load_child_ship_store();
						_mother_ship.init_legion_ships();
						this._game._graphics.Scene.add(_mother_ship._model);
						
						this._unit_list.push(_mother_ship);
						
						//_mother_ship._ship_package.set_ship_level(99);
						//_mother_ship.apply_space_ship_level_package();
						//_mother_ship.change_child_ships_level(99);
						//alert("FINISH");
					});
					
				};
			});
		});
	}
}
export{UnitBar}