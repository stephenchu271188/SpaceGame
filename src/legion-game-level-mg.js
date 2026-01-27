

class LegionGameLevelMG{
	constructor(params){
		this._params=params;
		this._game=params.game;
		this._level_list=null;
		this._current_level_id=0;
		
	}
	
	set_level_id(_id){
		this._current_level_id=_id;
	}
	
	generate_level_infor_list(_level_num){//Phai dam bao luon cho 1 ket qua duy nhat cho du duoc goi tu class nao
		//const _level_num=100;
		const _level_list=new Array();
		
		const _min_enemy_unit_num=3;//số lượng enemy unit tại level đầu tiên
		const _max_enemy_unit_num=9;
		const _min_enemy_level_num=1;//level của các enemy unit tại level đầu tiên
		const _level_num_step_1=15;//cứ vượt qua _level_num_step_1 thì số lượng enemy unit tăng thêm 1
		const _level_num_step_2=5;//cứ vượt qua _level_num_step_2 thì level của các enemy unit tăng thêm 1
		const _min_reward=100;//Điểm thưởng nhỏ nhất(1 sao) khi chiến thắng level đầu tiên
		
		const _mother_ship_type_num=this._game._warehouse2.get_mother_ship_type_num();
		let _mother_ship_type_id=0;//để chọn mother-ship-type lần lượt từ 0->type-num
		
		for(let i=0;i<_level_num;i++){
			let _level_id=i;
			let _key_level=false;//level quan trong
				if(_level_id%_level_num_step_1===0)_key_level=true;
			let _level_name="Level-"+(_level_id+1);
			let _enemy_unit_num=_min_enemy_unit_num+Math.floor(_level_id/_level_num_step_1);
				if(_enemy_unit_num>_max_enemy_unit_num)
						_enemy_unit_num=_max_enemy_unit_num;
			let _enemy_unit_level=_min_enemy_level_num+Math.floor(_level_id/_level_num_step_2);
			
			
			
			let _type_list=new Array();
			let _child_type_list=new Array();
			let _child_num_list=new Array();
			
			for(let j=0;j<_enemy_unit_num;j++){
				let _enemy_unit_type=_mother_ship_type_id;
				_type_list.push(_enemy_unit_type);
				_mother_ship_type_id++;
				if(_mother_ship_type_id>=_mother_ship_type_num)_mother_ship_type_id=0;
				
				let _child_type=0;
				let _child_num=1200;
				
				_child_type_list.push(_child_type);
				_child_num_list.push(_child_num);
			}
			
			let _reward1=_min_reward+parseInt((_level_id/_level_num_step_1)*20);//1 sao
				if(_key_level)_reward1=_reward1*2;
			let _reward2=parseInt(_reward1*1.5);//2 sao
			let _reward3=parseInt(_reward1*2);//3 sao
			const _rewards=[_reward1,_reward2,_reward3];
			
			_level_list.push({
				id:_level_id,
				key_level:_key_level,
				name:_level_name,
				unit_types:_type_list,
				units_level:_enemy_unit_level,
				child_types:_child_type_list,
				child_nums:_child_num_list,
				rewards:_rewards
			});
		}
		
			this.log_level_list(_level_list);
		
		this._level_list=_level_list;
		return _level_list;
	}
	
	is_key_current_level(){
		return this.is_key_level(this._current_level_id);
	}
	get_current_unit_types(){
		return this.get_unit_types(this._current_level_id);
	}
	get_current_unit_level(){
		return this.get_unit_level(this._current_level_id);
	}
	get_current_child_types(){
		return this.get_child_types(this._current_level_id);
	}
	get_current_child_nums(){
		return this.get_child_nums(this._current_level_id);
	}
	get_current_rewards(){
		return this.get_rewards(this._current_level_id);
	}
	get_current_reward(){
		return this.get_reward(this._current_level_id);
	}
	
	is_key_level(_id){
		return this._level_list[_id].key_level;
	}
	get_unit_types(_id){
		return this._level_list[_id].unit_types;
	}
	get_unit_level(_id){
		return this._level_list[_id].units_level;
	}
	get_child_types(_id){
		return this._level_list[_id].child_types;
	}
	get_child_nums(_id){
		return this._level_list[_id].child_nums;
	}
	get_rewards(_id){
		return this._level_list[_id].rewards;
	}
	get_reward(_id,_star_num){
		return this._level_list[_id].rewards[_star_num-1];
	}
	
	log_level_list(_level_list){
		for(let i=0;i<_level_list.length;i++){
			console.log(_level_list[i]);
			console.log("EnemyTypes:"+_level_list[i].unit_types);
			console.log("Rewards:"+_level_list[i].rewards);
			console.log("--------------------------------------------");
		}
	}
}
export {LegionGameLevelMG}