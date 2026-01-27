

class LegionGameMissionScoreData{
	constructor(params){
		this._id=params.id;
		this._data={};
		this._item_name="LegionGameMissionScoreData-"+this._id;
	}
	save_data(){
		var dataString = JSON.stringify(this._data);
		//alert(dataString);
		var currentStorageSize = JSON.stringify(localStorage).length;
		var maxSize = 5 * 1024 * 1024; // Ví dụ: giới hạn 5 MB cua browser
		if (currentStorageSize + dataString.length < maxSize){
			localStorage.setItem(this._item_name, dataString);
			
			return true;
		}
		else{
			alert('LocalStorage đã đầy. Không thể lưu trữ thêm dữ liệu.');
			return false;
		}
		
	}
	load_data(){
		var storedDataString = localStorage.getItem(this._item_name);
		if(storedDataString===null){
			this.init_data();
			return false;
		}
		this._data=JSON.parse(storedDataString);
			this.init_data();
			return true;
	}
	set_data(_data){
		this._data=_data;
		if(this._data===null)this._data={};
		
		this.init_data();
	}
	get_data(){
		return this._data;
	}
	
	init_data(){
		
	}
	get_highest_finished_level_id(){//lay' ve id cua level da hoan thanh gan day nhat
		let _highest_id=-1;
		for (let _key in this._data) {
          const _item=this._data[_key];
		  const _id=parseInt(_key.split("Level-")[1]);
		  if(_id>_highest_id)_highest_id=_id;
        }
		return _highest_id;
	}
	set_level_score(level_id,star_num){
		this._data["Level-"+level_id]=star_num;
	}
	finish_level(level_id,star_num1){
		let star_num2;
		if(this._data["Level-"+level_id])
			star_num2=parseInt(this._data["Level-"+level_id]);
		else
			star_num2=star_num1;
		
		this.set_level_score(level_id,star_num2);
	}
	finish_current_level(star_num){
		const current_level=this.get_highest_finished_level_id()+1;
		this.finish_level(current_level,star_num);
	}
	is_level_finish(level_id){
		if(this._data["Level-"+level_id])
			return true;
		
		return false;
	}
	is_level_available(level_id){//kiem tra 1 level co duoc choi ko
		if(level_id-1>=0)
		if(!this._data["Level-"+(level_id-1)]){
			return false;
		}
		else{
			if(this.get_level_score(level_id-1)<=0)
				return false;
		}
			
		return true;
	}
	get_level_score(level_id){
		if(this._data["Level-"+level_id])
			return parseInt(this._data["Level-"+level_id]);
		
		return 0;
	}
}
export {LegionGameMissionScoreData}