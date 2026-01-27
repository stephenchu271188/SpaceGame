
const PLANET_FOUND=1;
let _idlist=new Array();
class MessageMG{
	constructor(params){
		this._game=params.game;
		this._message_list=new Array();
		this._nextID=0;
		this._function_list_1=new Array();
	}
	add_new_message_function(_fc){
		this._function_list_1.push(_fc);
	}
	get_next_id(){
		this._nextID++;
		return this._nextID;
	}
	get_next_name(){
		if(!this._name_counter){
			this._name_counter=0;
		}
		this._name_counter++;
		return "name"+this._name_counter;
	}
	init_message(content_window){//bắt buộc phải gọi hàm này từ bên ngoài khi khởi tạo frame để reset lại _idlist
		this._content_window=content_window;
		_idlist=new Array();//
		this.update_message();
	}
	update_message(){
		
		for(let i=0;i<this._message_list.length;i++){
			const _item=this._message_list[i];
			const _id=_item.id;
			
			let _found=false;
			for(let j=0;j<_idlist.length;j++){
				if(_id===_idlist[j]){
					_found=true;
					break;
				}
			}
			if(_found)continue;
			
			const _type=_item.type;
			const _title=_item.title;
			const _content=_item.content;
			const _button_text=_item.button_text;
			const _time=_item.time;
			const _fc1=_item.function1;
			if(_type===PLANET_FOUND){
				if(this._content_window)
				this._content_window.add_message_1(_title,_content,_button_text,_time,_fc1);
			}
			_idlist.push(_id);
		}
		/*
		for(let i=0;i<this._message_list.length;i++){//loại bỏ trường hợp trùng nhau
			const _item=this._message_list[i];
			if(_item.type===_type&&_item.title===_title)
				return;
		}
		*/
	}
	add_planet_found_message_1(_fc1){
		const _title="New Planet Found";
		const _content="has been discovered a large meteorite containing many ores, metals and gems";
		const _button_text="Go";
		const d = new Date();
		let time = d.getTime();
		const _time=""+time;
		//const _name=this.get_next_name();
		this.add_message(PLANET_FOUND,_title,_content,_button_text,_time,_fc1);
		
	}
	add_enemy_star_energy_mining_base_found(_fc1){
		const _title="New Star Mining Base Found";
		const _content="An enemy star energy mining base has been detected";
		const _button_text="Go";
		const d = new Date();
		let time = d.getTime();
		const _time=""+time;
		//const _name=this.get_next_name();
		this.add_message(PLANET_FOUND,_title,_content,_button_text,_time,_fc1);
	}
	add_message(_type,_title,_content,_button_text,_time,_fc1){
		this._game._icon_effect.add_icon_effect(this._game._message_icon,1,"yellow","white");
		const _id=this.get_next_id();
		const _function1=()=>{
			this._game.remove_iframe();
			_fc1();
			this.remove_message(_id);
			//alert(this._message_list.length);
		};
		this._message_list.push({
			id:_id,
			//name:_name,
			type:_type,
			title:_title,
			content:_content,
			button_text:_button_text,
			time:_time,
			function1:_function1,
		});
		
		//try{
			this.update_message();
		//}catch(e){}
		
		for(let i=0;i<this._function_list_1.length;i++){
			this._function_list_1[i]();
		}
		
	}
	remove_message(_id){
		for(let i=this._message_list.length-1;i>=0;i--){
			if(this._message_list[i].id===_id){
				this._message_list.splice(i,1);
			}
		}
	}
	/*
	inform_found_planet_1(){
		let content="has been discovered a large meteorite containing many ores, metals and gems";
		this._content_window.add_message_1("New Planet Found",content,"Go","15:1",function(){
			alert("Found New Planet");
		});
	}
	*/
}
export {MessageMG}