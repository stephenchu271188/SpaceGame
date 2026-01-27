
const _data_name='score-and-rank';//data of all players
const _data_win_num=_data_name+"-win-num-";
const _data_lose_num=_data_name+"-lose-num-";
class ScoreRankMG{
	constructor(params){
		this._params=params;
		this._game=params.game;
	}
	
	get_win_num(_player_id){//so tran thang
		const _name=_data_win_num+_player_id;
		let _rs=this._game.get_data_in_database(_name);
		if(_rs===null)
			_rs=0;
		else 
			_rs=parseInt(_rs);
		
		return _rs;
	}
	get_lose_num(_player_id){//so tran thua
		const _name=_data_lose_num+_player_id;
		let _rs=this._game.get_data_in_database(_name);
		if(_rs===null)
			_rs=0;
		else 
			_rs=parseInt(_rs);
		
		return _rs;
	}
	
	win_battle(_player_id){//thang tran
		let _num=this.get_win_num(_player_id);
		_num++;
		this._game.update_data_in_database(_data_win_num+_player_id,_num);
	}
	lose_battle(_player_id){//thua tran
		let _num=this.get_lose_num(_player_id);
		_num++;
		this._game.update_data_in_database(_data_lose_num+_player_id,_num);
	}
}
export {ScoreRankMG}