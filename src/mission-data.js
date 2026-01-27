
class MissionDataMG{
	constructor(params){
		this._game=params.game;
		this._data={};
	}
	
	save_data(){
		
		this._data["mission-1"]=this._mission1.get_data();
		this._data["mission-2"]=this._mission2.get_data();
		this._data["mission-3"]=this._mission3.get_data();
		
		var dataString = JSON.stringify(this._data);
		//alert(dataString);
		
		var currentStorageSize = JSON.stringify(localStorage).length;
		var maxSize = 5 * 1024 * 1024; // Ví dụ: giới hạn 5 MB cua browser
		if (currentStorageSize + dataString.length < maxSize){
			localStorage.setItem('mission-data', dataString);
			return true;
		}
		else{
			alert('LocalStorage đã đầy. Không thể lưu trữ thêm dữ liệu.(warehouse.js)');
			return false;
		}
	}
	load_data(){
		var storedDataString = localStorage.getItem('mission-data');
		//alert(storedDataString);
		if(storedDataString===null){
			this.init_data();
			return false;
		}
		this._data=JSON.parse(storedDataString);
			this.init_data();
			return true;
	}
	
	init_data(){
		//alert(this._data["mission-2"]);
		if(!this._data["mission-1"])this._data["mission-1"]=new Array();
		if(!this._data["mission-2"])this._data["mission-2"]=new Array();
		if(!this._data["mission-3"])this._data["mission-3"]=new Array();
		
		this._mission1=new MissionData();
		this._mission1.set_data(this._data["mission-1"]);
		this._mission2=new MissionData();
		this._mission2.set_data(this._data["mission-2"]);
		this._mission3=new MissionData();
		this._mission3.set_data(this._data["mission-3"]);
		
		//alert(this.get_mission_2_data());
	}
	
	finish_level_mission(mission_id,level,star_num){
		if(mission_id===1)this._mission1.finish_level_mission(level,star_num);
		if(mission_id===2)this._mission2.finish_level_mission(level,star_num);
		if(mission_id===3)this._mission3.finish_level_mission(level,star_num);
		
		this.save_data();
	}
	
	get_mission_1_data(){
		return this._data["mission-1"];
	}
	get_mission_2_data(){
		return this._data["mission-2"];
	}
	get_mission_3_data(){
		return this._data["mission-3"];
	}
}
export {MissionDataMG}

class MissionData{
	
	set_data(_data){
		
		//this._data["mission"]=new Array();
		this._data=_data;
		
		//if(!this._data["mission"])this._data["mission"]=new Array();
	}
	
	get_data(){
		return this._data;
	}
	passed_level(level){//da hoan thanh level chua
		for(let i=0;i<this._data.length;i++){
			const _element=this._data[i];
			const _passed_level=_element[0];
			if(_passed_level===level)
				return true;
		}
		return false;
	}
	finish_level_mission(level,star_num){//hoan thanh mot level
		for(let i=0;i<this._data.length;i++){
			const _element=this._data[i];
			const _passed_level=_element[0];
			const _star_num=_element[1];
			
			if(_passed_level===level){
				if(star_num>_star_num){
					this._data[i]=[_passed_level,star_num];
					
				}
				return;
			}
		}
		
		this._data.push([level,star_num]);
	}
}
