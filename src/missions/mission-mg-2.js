import {Mission4} from './mission-4.js';


class MissionMG2{
	constructor(params){
		this._params=params;
		this._game=params.game;
		this._mission=null;
	}
	
	start_mission(id){
		this._game.show_loading_screen();
		if(id===4){
			this._mission=new Mission4({game:this._game});
		}
		
		if(this._mission===null){
			this._game.remove_loading_screen();
			return;
		}
			
		
		this._mission.load_resource(()=>{
			this._game.remove_loading_screen();
		});
	}
}
export{MissionMG2}