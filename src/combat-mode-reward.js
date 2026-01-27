
const _reward_level_1_win_num_require=2;//so tran thang de duoc nhan phan thuong o level 1(lan dau tien)
const _reward_win_num_max_require=30;//so tran thang toi da

const _reward_wheel_turn_level_1=2;
const _reward_wheel_turn_max=30;

let _reward_cash_level_1=0;//khoi tao trong constructor

const _reward_data_name="combat-mode-reward-data";

class CombatModeRewardMG{
	constructor(params){
		this._game=params.game;
		_reward_cash_level_1=this._game._parameters._standard_price*20;
		
		this._reward_data=this._game.get_data_in_database(_reward_data_name);
		let _reset_reward_data=()=>{
			this._reward_data={
				last_reward_level:0,//reward level da duoc nhan gan day nhat
				recent_win_num:0,//so tran thang' gan day(ke tu sau khi nhan duoc reward)
			};
			this._game.update_data_in_database(_reward_data_name,this._reward_data);
		};
		if(this._reward_data===null){
			_reset_reward_data();
		}
		//_reset_reward_data();
		//alert("Reset: LastLevel="+this._reward_data.last_reward_level+" and RecentWinNum="+this._reward_data.recent_win_num);
		//alert(this.check_reward());
		/*
		let _str="";
		_str+=("Level 1="+this.get_win_num_require(1)+"</br>");
		_str+=("Level 2="+this.get_win_num_require(2)+"</br>");
		_str+=("Level 3="+this.get_win_num_require(3)+"</br>");
		_str+=("Level 4="+this.get_win_num_require(4)+"</br>");
		_str+=("Level 5="+this.get_win_num_require(5)+"</br>");
		_str+=("Level 10="+this.get_win_num_require(10)+"</br>");
		_str+=("Level 15="+this.get_win_num_require(15)+"</br>");
		_str+=("Level 20="+this.get_win_num_require(20)+"</br>");
		_str+=("Level 30="+this.get_win_num_require(30)+"</br>");
		_str+=("Level 40="+this.get_win_num_require(40)+"</br>");
		_str+=("Level 50="+this.get_win_num_require(50)+"</br>");
		alert(_str);
		*/
	}
	
	get_reward_infor(){
		let _last_level=this._reward_data.last_reward_level;
		let _next_level=_last_level+1;
		let _win_num=this.get_win_num_require(_next_level);
		let _recent_win_num=this._reward_data.recent_win_num;
		
		let _cash=this.get_reward_cash(_next_level);
		let _turns=this.get_reward_lucky_wheel_turn(_next_level);
		
		return {
			last_level:_last_level,
			next_level:_next_level,
			win_num_require:_win_num,
			current_win_num:_recent_win_num,
			cash:_cash,
			turn:_turns,
		}
	}
	
	win_a_match(){//function nay duoc goi ngay khi win 1 tran
		this._reward_data.recent_win_num=this._reward_data.recent_win_num+1;
		this._game.update_data_in_database(_reward_data_name,this._reward_data);
	}
	
	check_reward(){//khi goi function nay se kiem tra va trao phan thuong neu du dieu kien
		let _rs=null;
		//this._reward_data.recent_win_num=this._reward_data.recent_win_num+1;
		let _last_level=this._reward_data.last_reward_level;
		if(_last_level<0){
			//alert("False: Current="+this._reward_data.last_reward_level+" and "+this._reward_data.recent_win_num);
		}			
		else{
			//alert("Accept: Before:  LastLevel="+this._reward_data.last_reward_level+" and RecentWin="+this._reward_data.recent_win_num);
			let _next_level=_last_level+1;
			let _win_num=this.get_win_num_require(_next_level);
			//alert("NextLevel="+_next_level+" and WinNum="+_win_num);
			if(this._reward_data.recent_win_num>=_win_num){
				this._reward_data.last_reward_level++;
				this._reward_data.recent_win_num=0;//reset
				//alert("Success: after:  LastLevel="+this._reward_data.last_reward_level+" and RecentWin="+this._reward_data.recent_win_num);
				let _cash=this.get_reward_cash(_next_level);
				let _turns=this.get_reward_lucky_wheel_turn(_next_level);
				_rs={
					cash:_cash,
					wheel_turn:_turns,
				};
				let _lucky_wheel_turn_id=-1;//trong item-package.js
				this._game._item_package.add_item(_lucky_wheel_turn_id,_turns);
				this._game._root_inventory.AddCash(_cash);
				this._game.update_data_in_database(_reward_data_name,this._reward_data);
			}
		}
		//this._game.update_data_in_database(_reward_data_name,this._reward_data);
		//alert("Current="+this._reward_data.last_reward_level+" and "+this._reward_data.recent_win_num);
		
		return _rs;//thong bao la da nhan duoc phan thuong hay chua
	}
	
	get_reward_cash(_reward_level){//moi level deu nhu nhau
		return _reward_cash_level_1;
	}
	get_reward_lucky_wheel_turn(_reward_level){
		if(_reward_level<1)return 0;
		
		let _rs=_reward_wheel_turn_level_1;
		    _rs+=(_reward_level-1)*1.5;
			_rs=Math.floor(_rs);
			
		if(_rs>_reward_wheel_turn_max)
			_rs=_reward_wheel_turn_max;
		
		return _rs;
	}
	get_win_num_require(_reward_level){//kiem tra xem can bao nhieu tran thang de nhan phan thuong
		if(_reward_level<1)return false;
		
		let _rs=_reward_level_1_win_num_require;
		    _rs+=(_reward_level-1)*1.5;
			_rs=Math.floor(_rs);
			
		if(_rs>_reward_win_num_max_require)
			_rs=_reward_win_num_max_require;
		
		return _rs;
	}
}
export {CombatModeRewardMG}