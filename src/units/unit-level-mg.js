
class UnitLevelMG{
	constructor(params){
		this.combat_unit_level_min=1;
		this.combat_unit_level_max=100;
	}
	
	get_exp_require_for_combat_unit_level(level){//so diem can thiet de len level, tham so level nho nhat=2
		if(level<this.combat_unit_level_min+1){
			alert("Level is invalid!");
		}
		if(level>this.combat_unit_level_max){
			return null;
		}
			//console.log("Level="+level);
		const _base_exp=200;//exp de nang cap tu level 1 -> level 2
		const _multiplier1=1.5;//hệ số nhân 1
		//Moi lan vuot qua _break_point thi nen trao thuong? 1 cai gi do
		const _break_point=10;//moi lan tang them _break_point lan level thi exp se yeu cau cao hon
		let _rate=Math.ceil(level/_break_point);
		if(_rate===0)_rate=1;
			//console.log("Rate="+_rate);
		const _multiplier2=_rate*1.2;//hệ số nhân 2
		
		const _exp=parseInt((level-1)*_base_exp*_multiplier1*_multiplier2);
			//console.log("Exp="+_exp);
		return _exp;
	}
}
export {UnitLevelMG}