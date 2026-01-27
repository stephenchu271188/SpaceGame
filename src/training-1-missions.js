import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/renderers/CSS2DRenderer.js';

import {Utils} from './units/utils.js';
import {UnitLevelMG} from './units/unit-level-mg.js';
import {Menu} from './show-room-menu.js';
import {ChildrenShipPanel} from './show-room-children-ship-panel.js';

let _main_star;
class TrainingMission{
	constructor(params){
		this._params=params;
		this._game=params.game;
		this._universe=params.universe;
		
		this._levelMG=new UnitLevelMG({game:this._game});
		
		this._focus_id=0;
		
		this._prev_btn=document.getElementById("arrow1");
		this._next_btn=document.getElementById("arrow2");
		this._play_btn=document.getElementById("play-btn");
		this._root_container=document.getElementById("root-container");
		
		this._lock=false;
		this._next_btn.addEventListener("click",()=>{
			this.next();
		});
		this._prev_btn.addEventListener("click",()=>{
			this.prev();
		});
		this._play_btn.addEventListener("click",()=>{
			if(!this._game._score_data.is_level_available(this._focus_id)){
				//alert("Finish Level "+(this._focus_id)+" First");
				return false;
			}
			localStorage.setItem("LegionGame_PvsC_Level",this._focus_id);
			if(this._game._legionGameID===1)
				location.href="legion-game-unit-option.html";
			else
				location.href="legion-game.html";
		});
		
		this._unit_speed=document.getElementById("unit-speed");
		this._unit_hp=document.getElementById("unit-hp");
		this._unit_damage=document.getElementById("unit-dam");
		
		this._default_weapon_btn=document.getElementById("default-weapon");
		this._default_weapon_btn.addEventListener("click",()=>{
			this._enable_default_weapon=!this._enable_default_weapon;
		});
		this._enable_default_weapon=false;
		
		//this._menu=new Menu({game:this._game,container:this._root_container});
		//this._menu.init();
		
	}
	init(){
		const _distance=0.03;
		
		this._distance=_distance*this._game._config.magnification_factor;
		const _tpos=new THREE.Vector3();
		_tpos.copy(this._game._graphics.Camera.position);
		_tpos.x+=10;
		_tpos.y-=10;
		
		//this.update_data();
		//this.create_child_ships_btn();
		
		this._galaxy=this._universe.get_current_galaxy();
		
		this._galaxy._root.position.set(100000,100000,100000);
		this._galaxy.arrange_all_star_systems_in_line(new THREE.Vector3(0,0,0),_distance);
	  //alert(_universe.get_current_galaxy()._root.position.z);
	  const min_planet_num=1;
		const _randomStarsystem=this._universe.get_current_galaxy().get_random_starsystem_data_with_condition_1(min_planet_num);
		if(_randomStarsystem===null){
			alert("Something went wrong. Can not find star system!");
			return false;//ko co ket qua
		}
	  const _data=_randomStarsystem[0];//alert(_data.position[0]);
		const _system_id=_data.id;
		const _system_array_id=_randomStarsystem[1];//id trong array
		const _star_id=_randomStarsystem[2];//id(trong array starList) cua star co chua so luong planet nhu yeu cau
		
		const _pos=_data.starList[0].position;
		const _starradius=_data.starList[0].radius*this._game._config.magnification_factor;
		//alert();
		const _px=_pos[0]*this._game._config.magnification_factor;
		const _py=_pos[1]*this._game._config.magnification_factor;
		const _pz=_pos[2]*this._game._config.magnification_factor;//alert(_px);alert(_py);alert(_pz);
		//this._game._entities['player']._model.position.set(_px,_py+_starradius+100,_pz);
		this._universe.get_current_galaxy().create_all_star_systems();
		
		const _result=this._universe.get_current_galaxy().get_random_starsystem_class_with_condition_1(min_planet_num);
		const _star_system=_result[0];
		const _star=_result[1];
		const _planet1=_star._planet_list[0];
		const _planetPos1=_planet1.get_world_position();
		
		setTimeout(()=>{
			this.goto_star(this._focus_id,0);
			
			const _systems=this._galaxy._visible_star_system;
			
			for(let i=0;i<_systems.length;i++){
				const _system=_systems[i];
				const _star=_system._star_list[0];
				const _radius=_star.get_radius();
				const _pos=_star.get_world_position();
				
				//const _starNum=2;//so sao da dat duoc
				const _starNum=this._game._score_data.get_level_score(i);
				this.add_label(i+1,_star,_starNum);
				
			}
			
			
		},1000);
		
		
		//const _labelRenderer=this._game._graphics.enable_CSS2D_Renderer(this._root_container);
		const _labelRenderer=this._game._graphics.enable_CSS2D_Renderer(document.body);
		_labelRenderer.domElement.style.zIndex="0";
	}
	
	add_label(_level,_star,_starNum){
		const _imgSize=30;
		const _maxStar=3;
		var _div = document.createElement( 'div' );
				//_div.className = 'label';
				
					_div.innerHTML = 'Level '+_level;
					_div.innerHTML+="<br/>";
					for(let j=0;j<_maxStar;j++){
						let _starID=2;
						if(j<_starNum)_starID=1;
						_div.innerHTML+="<img width='"+_imgSize+"px' height='"+_imgSize+"px' src='./resources/img/star"+_starID+".png'/>";
					}
					_div.innerHTML+="<br/>";
					_div.innerHTML+="<b style='color:yellow;font-size:15px'>First win reward:</b>";
					_div.innerHTML+="<br/>";
					_div.innerHTML+="<i style='color:turquoise;font-size:15px'>-1000EXP</i>";
					
				_div.style.fontSize="20px";
				_div.style.color="white";
				_div.style.marginTop = '-1em';
				var _label = new CSS2DObject( _div );
				
				_star.root.add(_label);
				_label.position.set(-8000,0,-4000);
	}
	
	update_data(){
		if (this._unit_speed && this._unit_speed.hasAttribute("max-value")){
			this._unit_speed.setAttribute("max-value", 1000);
		}
		if (this._unit_hp && this._unit_hp.hasAttribute("max-value")){
			this._unit_hp.setAttribute("max-value", 1000);
			const _unit=this._unit_list[this._focus_id][1];
			this._unit_hp.setAttribute("value", _unit._params.health);
		}
		if (this._unit_damage && this._unit_damage.hasAttribute("max-value")){
			this._unit_damage.setAttribute("max-value", 50);
			const _unit=this._unit_list[this._focus_id][1];
			this._unit_damage.setAttribute("value", _unit._params.damage);
		}
		
		this.show_infor();
	}
	
	next(){
		if(this._lock)return;
		if(this._focus_id-1<0)return;
		
		this._lock=true;
		this._focus_id--;
		
		this.prepare_move(1);
	}
	prev(){
		if(this._lock)return;
		if(this._focus_id+1>=this._galaxy._data.length)return;
		
		this._lock=true;
		this._focus_id++;
		
		this.prepare_move(-1);
	}
	prepare_move(_direct){
		
		this._starsystems=this._galaxy._visible_star_system;
		let _first_unit=this._starsystems[0];
		this._origin_pos=_first_unit.get_world_position();
		this._target_pos=this._origin_pos.clone();
		this._target_pos.z+=this._distance*_direct;
		
		let _fc=(timeInSeconds)=>{
			const _tpos=_first_unit.get_world_position();//console.log(_tpos.z);
			const _distance=_tpos.distanceTo(this._target_pos);//console.log(_distance);
			if(_distance<=300){
				this._game.remove_function_from_update_list(_fc);
				for(let i=0;i<this._starsystems.length;i++){
					const _unit=this._starsystems[i];
					_unit._root.position.z+=_distance*_direct;
					//this.update_data();
				}
				this._lock=false;
				return;
			}
			else{
				this.move(timeInSeconds*6000*_direct);
			}
		}
		
		this._game.add_to_update_function_list(_fc);
	}
	move(_length){
		for(let i=0;i<this._starsystems.length;i++){
			const _unit=this._starsystems[i];
			_unit._root.position.z+=_length;
		}
	}
	
	reset_camera(_lookPos){
	 
	  this._game._graphics.Camera.position.copy(_main_star.get_world_position());
	 
	  this._game._graphics.Camera.position.x-=9000;
	  this._game._graphics.Camera.position.z-=5000;
	  this._game._graphics.Camera.lookAt(_main_star.get_world_position());
	  
			
  }
	goto_star(star_system_id,star_id){
	 
	  let _galaxy=this._universe.get_current_galaxy();
	  let _star=_galaxy.get_star_class(star_system_id,star_id);
	  _main_star=_star;
	  
	  _galaxy._stop=false;
	  
	  
	  this.reset_camera(_main_star.get_world_position());
	  
	  return _star;
		
  }
	
	show_infor(){
		if(this.infor_container)this.infor_container.remove();
		
		let _unit=this._unit_list[this._focus_id][1];
		_unit._exp=350;
		
		const _level=_unit._level;
		if(_level<1){
			alert("Level Data Corrupted");
			return;
		}
		const _exp=_unit._exp;
		if(_exp<0){
			alert("EXP Data Corrupted");
			return;
		}
		let _exp1;
		if(_level===1)
			_exp1=0;
		else
			_exp1=this._levelMG.get_exp_require_for_combat_unit_level(_level);
		let _exp2=this._levelMG.get_exp_require_for_combat_unit_level(_level+1);
		//console.log("Min="+_exp1);
		//console.log("Max="+_exp2);
		if(_exp1===null||_exp2===null){
			return;
		}
		
		
		
		this.infor_container=document.createElement("div");
		this.infor_container.style.position="absolute";
		this.infor_container.style.width="50%";
		this.infor_container.style.height="70%";
		this.infor_container.style.left="25%";
		this.infor_container.style.top="55%";
		this.infor_container.style.zIndex="99999999999999999";
		document.getElementById("root-container").appendChild(this.infor_container);
		//alert(_exp);alert(_exp1);alert(_exp2);
		init_processbar_1(this.infor_container,_level,
						  "","",
						  _exp1,_exp2,_exp);
	return;
		
	}
}
export{TrainingMission}





let _percent=45;
//let _container=document.getElementById("container");

function init_processbar_1(_tcontainer,_level,_tname1,_tname2,_tscore1,_tscore2,_tvalue)
{
    var _t_distance=_tscore2-_tscore1;
    var _t_percent=(_tvalue)/_t_distance;
    _t_percent=Math.floor(_t_percent*100);
   //alert("Percent:"+_t_percent);
    var styles =` 
:root {
    /* color */
    --color0: hsl(229, 57%, 11%);
    --color0Trans: hsl(229, 57%, 11%, 0.85);
    --color1: hsl(228, 56%, 26%);
    --color2: hsl(170, 92%, 50%);//text color
    --color3: hsl(229, 7%, 55%);
    --color4: hsl(230, 55%, 18%);//progress bar background color
    --color5: hsl(0, 0%, 100%);
    
    /* gradient - Progress Bar Color*/
    --gradient: linear-gradient(90deg, hsl(214, 92%, 50%) 0%, hsl(170, 92%, 50%) 100%);
    
    /* font size */
    --fontSize: 14px;
    
    /* font weight */
    --regularFont: 400;
    --boldFont: 700;
}

/* reset default settings */
* {
    box-sizing: border-box;
}


@-webkit-keyframes progressLineTransmission {
    from {
        width: 0%;
    }

    to {
        width:`+_t_percent+`%;
    }
}

@keyframes progressLineTransmission {
    from {
        width: 0%;
    }

    to {
        width: `+_t_percent+`%;
    }
}


/* section2 - start */
.section2 {
    
    min-width: 450px;
    height: 75%;
    padding: 30px;
    border-radius: 8px;
    position: relative;
}

.section2__text {
    color: var(--color2);
}

.section2__text--bold {
    font-weight: var(--boldFont);
}

.section2__progressBarContainer {
    margin-top: 15px;
    position: relative;
}

.section2__progressBar {
    background-color: var(--color4);
    width: 100%;
    height: 18px;
    padding: 2px;
    border-radius: 50px;

    /* flex */
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.section2__progressBarRect {
    background-image: var(--gradient);
    height: 100%;
    padding: 2px;
    border-radius: inherit;
    -webkit-animation: progressLineTransmission 2.5s 0.3s ease-in-out both;
            animation: progressLineTransmission 2.5s 0.3s ease-in-out both;


    /* flex */
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.section2__progressBarCircle {
    background-color: var(--color5);
    height: calc(14px - 4px);
    width: calc(14px - 4px);
    border-radius: 50%;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}

.section2__progressBarPoint {
    color: var(--color2);
    margin-top: 8px;
    font-size: 12px;
    font-weight: var(--boldFont);
    position: absolute;
}

.section2__progressBarPoint--start {
    left: 0;
}

.section2__progressBarPoint--end {
    right: 0;
}

.section2__storageLeft {
    background-color: var(--color5);
    width: -webkit-fit-content;
    width: -moz-fit-content;
    width: fit-content;
    padding: 20px;
    border-radius: 8px 8px 0px;
    
    /* flex */
    display: flex;
    justify-content: center;
    align-items: center;

    /* position */
    position: absolute;
    top: 0;
    right: 30px;
    transform: translateY(-70%);

}

.section2__storageLeft::before {
    content: '';
    width: 0;
    height: 0;
    border: solid 20px;
    border-color: transparent var(--color5) transparent transparent;

    /* position */
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translateY(50%);

}

.section2__storageLeftDigits {
    color: var(--color0);
    font-size: 32px;
    font-weight: var(--boldFont);
}

.section2__storageLeftText {
    color: var(--color3);
    margin-left: 7px;
    font-weight: var(--boldFont);
    letter-spacing: 1px;
}
/* section2 - end */
;
`
var styleSheet = document.createElement("style")
styleSheet.innerText = styles
document.head.appendChild(styleSheet);


    
    
var _html="";
	_html+="<div class='section2'>";
    _html+="<p class='section2__text'>Level "+_level+"</p>";
    _html+="<div class='section2__progressBarContainer'>";
      _html+="<div class='section2__progressBar'>";
        _html+="<div class='section2__progressBarRect'>";
          _html+="<span class='section2__progressBarCircle'></span>";
        _html+="</div>";
      _html+="</div>";
      _html+="<span class='section2__progressBarPoint section2__progressBarPoint--start'>"+_tname1+""+_tscore1+"</span>";
      _html+="<span class='section2__progressBarPoint section2__progressBarPoint--end'>"+_tname2+""+_tscore2+"</span>";
    _html+="</div>";
    //_html+="<div class='section2__storageLeft'>";
      //_html+="<span class='section2__storageLeftDigits'>185</span>";
      //_html+="<span class='section2__storageLeftText'>GB Left</span>";
    _html+="</div>";
  _html+="</div>";
 
  _tcontainer.innerHTML=_html;
};

