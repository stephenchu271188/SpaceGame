
import {SpaceShipGame} from './space-ship-game.js';
class GameDemo extends SpaceShipGame {
  constructor() {
    super({game_id:1,
	load_unit_model_complete:()=>{
		
	}});
	
  }
  _OnInitialize() {
	 
	  let _player_level=this.get_player_level();
	  let _player_exp=this.get_player_exp();
  }
}

let _game = new GameDemo();

let _main_panel=document.getElementById("root");
let _parameters=_game._parameters;
	    
	let _player_rank=_game.get_player_level();
	
	let _game1_single=document.getElementById("game1-single");
	let _game1_multi=document.getElementById("game1-multi");
	let _game1_tunnel=document.getElementById("game1-tunnel");
	let _game1_raid=document.getElementById("game1-raid");
	let _game1_2d=document.getElementById("game1-2d");
	let _game1_discovery=document.getElementById("game1-discovery");
	//let _game2_single=document.getElementById("game2-single");
	//let _game2_multi=document.getElementById("game2-multi");
	
	let _lock=false;
	
	
	function add_condition(_element,_rank,_game_id){
		
		const _icon=_element.getElementsByClassName('status-icon')[0];
		if(_player_rank<_rank){
			_icon.innerHTML="<img src='./resources/icons/lock-3.png' width=40 height=40/>";
			let _progress_bar=document.createElement("div");
			_progress_bar.classList.add("loader");
			let _player_exp=_game.get_player_exp();
			let _exp_require=_game.get_exp_require(_rank);
			let _percent=(_player_exp/_exp_require)*100;
			    _percent=parseInt(_percent);
			_progress_bar.style.setProperty('--progress', _percent+'%');
			_element.appendChild(_progress_bar);
			_element.addEventListener("click",()=>{
				Alert.warning('','Rank Require: '+_rank,
				{displayDuration: 3000, pos: 'top'});
				setTimeout(()=>{
						Alert.trash('','Current Rank: '+_player_rank,
						{displayDuration: 3000, pos: 'top'});
				},3000);
			});
		}
		else{
			_icon.innerHTML="<img src='./resources/icons/lock-2.png' width=40 height=40/>";
			_element.addEventListener("click",()=>{
			if(_lock)return;
				_lock=true;
			setTimeout(()=>{
				localStorage.setItem('DiscoveryModeGameID',_game_id);
				location.href="show-room-1.html";
			},500);
			});
		}
	}
	
	add_condition(_game1_single,_parameters._defend_planet_mode_rank_require,1);
	add_condition(_game1_multi,_parameters._combat_mode_rank_require,2);
	add_condition(_game1_tunnel,1,3);
	add_condition(_game1_raid,35,4);
	add_condition(_game1_2d,_parameters._defend_base_mode_rank_require,5);
	add_condition(_game1_discovery,_parameters._discovery_universe_mode_rank_require,6);
	
	
	function _resize(){
		const _winW=window.innerWidth;
		const _winH=window.innerHeight;
		const _sclW=parseFloat(_winW/_game._graphics._standardW);
		const _sclH=parseFloat(_winH/_game._graphics._standardH);
		_main_panel.style.transform="scale("+_sclW+","+_sclH+")";
	}
	
	_resize();
	 window.addEventListener('resize', () => {
        _resize();
      }, false);