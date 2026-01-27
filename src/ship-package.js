//*Luu y trong van de save_data: trong game-1, moi lan phong' rocket thi so luong rocket
//trong ship-package se thay doi va phai save_data
//nen phai co' phuong an ko update du lieu lien tuc vao database
class ShipPackage{
	
	constructor(params){
		this._params=params;
		try{
		this._game=params.game;
		}catch(e){alert(e.stack);}
		this._data={};
		
		this._min_speed_num=50;//so lan tang toc toi' thieu? luc ban dau level 1(skill mac dinh ship nao cung co)
		this._min_lighting_num=500;//neu space-ship ko co skill nay thi ko su dung
		
		this._min_rocket_num_1=0;
		this._min_rocket_num_2=0;
		this._min_rocket_num_3=0;
		this._min_exploration_ship_num=0;
		
		this._min_rocket_num=this._game._parameters._init_rocket_slot;//so luong rocket+explo-ship toi' thieu(mac dinh) co the mang theo
		
		this._max_ship_level=205;//level toi da ma ship co the dat duoc
		this._max_auxiliary_level=this._game._parameters.spaceship_auxiliary_max_level;//level toi da ma cac auxiliary-object co the dat duoc(laser-gun,...)
		
		//*Dat cong thuc tinh exp o day vi co the moi ship khac nhau se co cong thuc khac nhau
		this._exp_require_list=new Array();//danh sach so diem exp yeu cau de len level tu 2->100
		const _first_upgrade_level_exp_require=500;//so diem exp can phai co de nang cap tu level1->level2
		const plus_coefficient=2.1;//he so cong
		const multiplier=700;//he so nhan
		//let _exp_list=new Array();//for test
		
		/*
		this._exp_require_list.push([2,_first_upgrade_level_exp_require]);
		for(let i=1;i<this._max_ship_level-1;i++){
			let _exp_require=1000+((i-1+plus_coefficient)*multiplier);
			_exp_require=parseInt(_exp_require);
			const _next_level=i+2;
			this._exp_require_list.push([_next_level,_exp_require]);
			//_exp_list.push(_exp_require);
		}
		*/
		for(let i=2;i<=this._max_ship_level;i++){
			this._exp_require_list.push([i,this._game.get_ship_exp_require(i)]);
		}
	}
	
	
	
	get_require_exp(_level){//lay so exp can thiet de len level
		for(let i=0;i<this._exp_require_list.length;i++){
			const _element=this._exp_require_list[i];
			if(_element[0]===_level)
				return _element[1];
		}
		return null;
	}
	
	save_data(){
		var dataString = JSON.stringify(this._data);
		//alert(dataString);
		var currentStorageSize = JSON.stringify(localStorage).length;
		var maxSize = 5 * 1024 * 1024; // Ví dụ: giới hạn 5 MB cua browser
		const _id=this.get_ship_id();
		if (currentStorageSize + dataString.length < maxSize){
			localStorage.setItem('ship-package-'+_id, dataString);
			//alert("saved");
			return true;
		}
		else{
			alert('LocalStorage đã đầy. Không thể lưu trữ thêm dữ liệu.');
			return false;
		}
		
	}
	load_data(_id){
		this.set_ship_id(_id);
		var storedDataString = localStorage.getItem('ship-package-'+_id);
		if(storedDataString===null){
			this.init_data();
			return false;
		}
		this._data=JSON.parse(storedDataString);
			this.init_data();
			return true;
	}
	init_data(){//sau khi load data se dua vao level de tinh toan 1 so thong so ban dau
		let _level=this.get_ship_level();
		//let _level=20;
		let _speed_num=this._min_speed_num;
		_speed_num+=_level*0.2;
		_speed_num=Math.floor(_speed_num);
		this.set_speed_up_num(_speed_num);
		//alert(this.get_speed_up_num());
		
		
		let _lighting_num=this._min_lighting_num;
		_lighting_num+=_level*0.2;
		_lighting_num=Math.floor(_lighting_num);
		this.set_lighting_num(_lighting_num);
		
	}
	
	set_data(x){
		this._data=x;
	}
	get_data(){
		return this._data;
	}
	
	set_value(_map,_value){
		this._data[_map]=_value;
	}
	
	set_ship_id(x){
		this._data["ship-id"]=x;
	}
	get_ship_id(){
		return this._data["ship-id"];
	}
	
	set_ship_level(x){
		this._data["ship-level"]=x;
	}
	get_ship_level(){
		if(this._data["ship-level"])
			return this._data["ship-level"];
		else
			return 1;
	}
	increase_ship_level(){
		if(this._data["ship-level"]+1>this._max_ship_level)return;
		this._data["ship-level"]+=1;
	}
	upgrade_level(){//kiem tra du exp de len level chua, neu du roi thi tien hanh upgrade
		let _level1=this.get_ship_level();//level hien tai
		let _exp1=this.get_ship_exp();//exp hien tai
		
		if(_level1>=this._max_ship_level){
			return false;
		}
		
		let _new_level=_level1;
		for(let i=0;i<this._exp_require_list.length;i++){
			const _level2=this._exp_require_list[i][0];
			const _exp2=this._exp_require_list[i][1];
			if(_exp1<_exp2){
				_new_level=_level2-1;
				break;
			}
		}
		
		if(_new_level>_level1&&_new_level<=this._max_ship_level){
			this.set_ship_level(_new_level);
			return true;
		}
		return false;
	}
	
	set_ship_exp(x){
		this._data["ship-exp"]=parseInt(x);
	}
	get_ship_exp(){
		if(this._data["ship-exp"])
			return this._data["ship-exp"];
		else
			return 0;
	}
	plus_ship_exp(x){
		if(!this._data["ship-exp"])this._data["ship-exp"]=0;
		
		this._data["ship-exp"]+=parseInt(x);
		return this.get_ship_exp();
	}
	
	//-------------------MAIN SKILLS-----------------------------------------------
	
	get_main_skill_infor(_id){
		if(!this._data["ship-main-skills"])
			this._data["ship-main-skills"]=new Array();
		return this._data["ship-main-skills"];
	}
	has_main_skill(_id){
		const _infor=this.get_main_skill_infor(_id);
		for(let i=0;i<_infor.length;i++){
			if(_infor[i].id===_id){
				return true;
			}
		}
		return false;
	}
	add_main_skill(_id){
		if(this.has_main_skill(_id))
			return false;
		
		this._data["ship-main-skills"].push({id:_id,level:1});
	}
	
	get_main_skill_level(_id,_auto_add){
		const _infor=this.get_main_skill_infor(_id);
		for(let i=0;i<_infor.length;i++){
			if(_infor[i].id===_id){
				return _infor[i].level;
			}
		}
		
		if(_auto_add===true){//tu dong add skill vao package(truong hop moi vao showroom)
			this.add_main_skill(_id);
			return this.get_main_skill_level(_id,false);
		}
		return null;
	}
	upgrade_main_skill_level(_id){
		const _infor=this.get_main_skill_infor(_id);
		for(let i=0;i<_infor.length;i++){
			if(_infor[i].id===_id){
				_infor[i].level++;
				return true;
			}
		}
		return false;
	}
	set_main_skill_level(_id,_level){//chua test
		const _infor=this.get_main_skill_infor(_id);
		for(let i=0;i<_infor.length;i++){
			if(_infor[i].id===_id){
				_infor[i].level=_level;
				return true;
			}
		}
		return false;
	}
	set_all_main_skill_level(_level){//set level cho tat ca main skill
		const _infor=this.get_main_skill_infor(null);
		for(let i=0;i<_infor.length;i++){
			_infor[i].level=_level;
		}
	}
	//-----------------------ARMOURS------------------------------------
	get_ship_armours(){
		if(!this._data["ship-armours"])
			this._data["ship-armours"]=new Array();
		
		return this._data["ship-armours"];
	}
	has_armour(_id){
		if(!this._data["ship-armours"])
			this._data["ship-armours"]=new Array();
		
		for(let i=this._data["ship-armours"].length-1;i>=0;i--){
			if(this._data["ship-armours"][i].id===_id){
				return true;
			}
		}
		return false;
	}
	use_armour(_id){//su dung armour
		let _amours=this.get_ship_armours();
		for(let i=0;i<_amours.length;i++){
			if(_amours[i].id===_id){
				_amours.unshift(_amours[i]);//dich chuyen phan tu ve vi tri dau tien trong array
				return;
			}
		}
	}
	not_use_armour(_id){//ko su dung skill
		let _amours=this.get_ship_armours();
		if(_amours.length<2)return;
		if(_amours[0].id!=_id)return;
		
		//dich chuyen toan bo element trong array tien len 1, con phan tu cuoi cung tro ve vi tri thu 1
		const firstElement = _amours[0];
		const lastElement = _amours[_amours.length - 1];
		const rotatedArray = _amours.slice(1).concat(firstElement);
		
		this._data["ship-armours"]=rotatedArray;
		
	}
	get_using_armour_id(){//lay id cua skill dang su dung(phan tu dau tien trong array)
		let _amours=this.get_ship_armours();
		if(_amours[0])return _amours[0].id;
			
		return null;
	}
	using_armour(_id){//kiem tra xem co dang su dung skill nay ko
		let _amours=this.get_ship_armours();
		if(_amours[0].id===_id)
			return true;
		
		return false;
	}
	add_armour(_id){
		if(!this._data["ship-armours"])
			this._data["ship-armours"]=new Array();
		if(this.has_armour(_id))
			return;
		this._data["ship-armours"].push({id:_id,level:1});
	}
	get_armour_level(_id){
		if(!this.has_armour(_id))
			return null;
		let _amours=this.get_ship_armours();
		for(let i=0;i<_amours.length;i++){
			if(_amours[i].id===_id){
				return _amours[i].level;
			}
		}
	};
	upgrade_armour_level(_id){
		if(!this.has_armour(_id))
			return false;
		let _amours=this.get_ship_armours();
		for(let i=0;i<_amours.length;i++){
			if(_amours[i].id===_id){
				_amours[i].level++;
				return true;
			}
		}
		return false;
	}
	set_armour_level(_id,_level){
		if(!this.has_armour(_id))
			return false;
		let _amours=this.get_ship_armours();
		for(let i=0;i<_amours.length;i++){
			if(_amours[i].id===_id){
				_amours[i].level=_level;
				return true;
			}
		}
		return false;
	}
	//-----------------------END ARMOURS-------------------------------------
	//--------------PASSIVE SKILLS---------------------------------------
	has_passive_skill(_id){
		if(!this._data["ship-passive-skills"])
			this._data["ship-passive-skills"]=new Array();
		
		for(let i=this._data["ship-passive-skills"].length-1;i>=0;i--){
			if(this._data["ship-passive-skills"][i].id===_id){
				return true;
			}
		}
		return false;
	}
	use_passive_skill(_id){//su dung skill
		let _t_skills=this.get_ship_passive_skills();
		for(let i=0;i<_t_skills.length;i++){
			if(_t_skills[i].id===_id){
				_t_skills.unshift(_t_skills[i]);//dich chuyen phan tu ve vi tri dau tien trong array
				return;
			}
		}
	}
	get_passive_skill_level(_id){
		if(!this.has_passive_skill(_id))
			return null;
		let _t_skills=this.get_ship_passive_skills();
		for(let i=0;i<_t_skills.length;i++){
			if(_t_skills[i].id===_id){
				return _t_skills[i].level;
			}
		}
	};
	upgrade_passive_skill_level(_id){
		if(!this.has_passive_skill(_id))
			return false;
		let _t_skills=this.get_ship_passive_skills();
		for(let i=0;i<_t_skills.length;i++){
			if(_t_skills[i].id===_id){
				_t_skills[i].level++;
				return true;
			}
		}
		return false;
	}
	set_passive_skill_level(_id,_level){
		if(!this.has_passive_skill(_id))
			return false;
		let _t_skills=this.get_ship_passive_skills();
		for(let i=0;i<_t_skills.length;i++){
			if(_t_skills[i].id===_id){
				_t_skills[i].level=_level;
				return true;
			}
		}
		return false;
	}
	not_use_passive_skill(_id){//ko su dung skill
		let _t_skills=this.get_ship_passive_skills();
		if(_t_skills.length<2)return;
		if(_t_skills[0].id!=_id)return;
		
		//dich chuyen toan bo element trong array tien len 1, con phan tu cuoi cung tro ve vi tri thu 1
		const firstElement = _t_skills[0];
		const lastElement = _t_skills[_t_skills.length - 1];
		const rotatedArray = _t_skills.slice(1).concat(firstElement);
		
		this._data["ship-passive-skills"]=rotatedArray;
		
	}
	get_using_passive_skill_id(){//lay id cua skill dang su dung(phan tu dau tien trong array)
		let _t_skills=this.get_ship_passive_skills();
		if(_t_skills[0])return _t_skills[0].id;
			
		return null;
	}
	using_passive_skill(_id){//kiem tra xem co dang su dung skill nay ko
		let _t_skills=this.get_ship_passive_skills();
		if(_t_skills[0].id===_id)
			return true;
		
		return false;
	}
	get_ship_passive_skills(){
		if(!this._data["ship-passive-skills"])
			this._data["ship-passive-skills"]=new Array();
		
		return this._data["ship-passive-skills"];
	}
	add_ship_passive_skill(_id){
		if(!this._data["ship-passive-skills"])
			this._data["ship-passive-skills"]=new Array();
		if(this.has_passive_skill(_id))
			return;
		this._data["ship-passive-skills"].push({id:_id,level:1});
	}
	remove_ship_passive_skill(_id){
		if(!this._data["ship-passive-skills"])
			this._data["ship-passive-skills"]=new Array();
		
		for(let i=this._data["ship-passive-skills"].length-1;i>=0;i--){
			if(this._data["ship-passive-skills"][i].id===_id){
				this._data["ship-passive-skills"].splice(i,1);
			}
		}
	}
	//---------------END PASSIVE SKILL------------------------------------------
	
	get_additional_skill_num(){//kiem tra co bao nhieu sub skill
		let _counter=0;
		const _full_ids=this._game._parameters.get_additional_skills_ids();
		for(let i=0;i<_full_ids.length;i++){
			if(this.has_additional_skill(_full_ids[i]))
				_counter++;
		}
		return _counter;
	}
	
	has_additional_skill(_id){//kiem tra xem da co skill nay hay chua
		if(!this._data["ship-additional-skills"])
			this._data["ship-additional-skills"]=new Array();
		
		for(let i=this._data["ship-additional-skills"].length-1;i>=0;i--){
			if(this._data["ship-additional-skills"][i].id===_id){
				return true;
			}
		}
		return false;
	}
	use_additional_skill(_id){//su dung skill bang cach dich chuyen phan tu ve vi tri dau tien trong array
		if(!this.has_additional_skill(_id))return false;
		
		let _list1=this.get_ship_additional_skills();
		let _list2=new Array();
			_list2.push(null);//phan tu dau tien
		for(let i=0;i<_list1.length;i++){
			if(_list1[i].id!=_id)
				_list2.push(_list1[i]);
			else
				_list2[0]=_list1[i];
		}
		this._data["ship-additional-skills"]=_list2;
		return true;
		//let _t_id;
		/*
		for(let i=0;i<_t_skills.length;i++){
			if(_t_skills[i].id===_id){
				_t_skills.unshift(_t_skills[i]);//dich chuyen phan tu ve vi tri dau tien trong array
				return;
			}
		}
		*/
	}
	
	not_use_additional_skill(_id){//ko su dung skill
		let _t_skills=this.get_ship_additional_skills();
		if(_t_skills.length<2)return;
		if(_t_skills[0].id!=_id)return;
		
		//dich chuyen toan bo element trong array tien len 1, con phan tu cuoi cung tro ve vi tri thu 1
		const firstElement = _t_skills[0];
		const lastElement = _t_skills[_t_skills.length - 1];
		const rotatedArray = _t_skills.slice(1).concat(firstElement);
		
		this._data["ship-additional-skills"]=rotatedArray;
		
	}
	
	get_using_additional_skill_id(){//lay id cua skill dang su dung(phan tu dau tien trong array)
		let _t_skills=this.get_ship_additional_skills();
		if(_t_skills[0])return _t_skills[0].id;
			
		return null;
	}
	get_additional_skill_level(_id){
		if(!this.has_additional_skill(_id))
			return null;
		
		let _t_skills=this.get_ship_additional_skills();
		for(let i=0;i<_t_skills.length;i++){
			if(_t_skills[i].id===_id){
				return _t_skills[i].level;
			}
		}
	}
	upgrade_additional_skill_level(_id){
		if(!this.has_additional_skill(_id))
			return null;
		
		let _t_skills=this.get_ship_additional_skills();
		for(let i=0;i<_t_skills.length;i++){
			if(_t_skills[i].id===_id){
				_t_skills[i].level++;
				//alert("NewLevel:"+_t_skills[i].level);
				return;
			}
		}
	}
	set_additional_skill_level(_id,_level){
		if(!this.has_additional_skill(_id))
			return null;
		
		let _t_skills=this.get_ship_additional_skills();
		for(let i=0;i<_t_skills.length;i++){
			if(_t_skills[i].id===_id){
				_t_skills[i].level=_level;
				return;
			}
		}
	}
	
	using_additional_skill(_id){//kiem tra xem co dang su dung skill nay ko
		let _t_skills=this.get_ship_additional_skills();
		if(_t_skills[0].id===_id)
			return true;
		
		return false;
	}
	get_ship_additional_skills(){
		if(!this._data["ship-additional-skills"])
			this._data["ship-additional-skills"]=new Array();
		
		return this._data["ship-additional-skills"];
	}
	add_ship_additional_skill(_id){
		if(!this._data["ship-additional-skills"])
			this._data["ship-additional-skills"]=new Array();
		if(this.has_additional_skill(_id))
			return;
		this._data["ship-additional-skills"].push({id:_id,level:1});
	}
	remove_ship_additional_skill(_id){
		if(!this._data["ship-additional-skills"])
			this._data["ship-additional-skills"]=new Array();
		
		for(let i=this._data["ship-additional-skills"].length-1;i>=0;i--){
			if(this._data["ship-additional-skills"][i].id===_id){
				this._data["ship-additional-skills"].splice(i,1);
			}
		}
	}
	//----------------------------------------------------
	
	add_ship_skill(_name){
		if(!this._data["ship-skills"])
			this._data["ship-skills"]=new Array();
		this._data["ship-skills"].push(_name);
	}
	set_ship_skills(x){//skills la 1 array
		this._data["ship-skills"]=x;
	}
	get_ship_skills(){
		if(this._data["ship-skills"])
			return this._data["ship-skills"];
		return [];
	}
	
	minus_speed_up_num(){
		let _rs=0;
		if(this._data["speed-up-num"])
			_rs=parseInt(this._data["speed-up-num"])-1;
		if(_rs<0)
			_rs=0;
		
		this._data["speed-up-num"]=_rs;
	}
	set_speed_up_num(x){
		this._data["speed-up-num"]=x;
	}
	get_speed_up_num(){
		if(this._data["speed-up-num"])
			return this._data["speed-up-num"];
		else
			return 0;
	}
	
	
	
	minus_lighting_num(){
		let _rs=0;
		if(this._data["lighting-num"])
			_rs=parseInt(this._data["lighting-num"])-1;
		if(_rs<0)
			_rs=0;
		
		this._data["lighting-num"]=_rs;
	}
	set_lighting_num(x){
		this._data["lighting-num"]=x;
	}
	get_lighting_num(){
		if(this._data["lighting-num"])
			return this._data["lighting-num"];
		else
			return 0;
	}
	
	
	set_exploration_ship_num(x){
		this._data["exploration-ship-num"]=x;
	}
	get_exploration_ship_num(){
		if(!this._data["exploration-ship-num"])this._data["exploration-ship-num"]=0;
		return this._data["exploration-ship-num"];
	}
	minus_exploration_ship_num(){
		if(this._data["exploration-ship-num"]<=0)return;
		this._data["exploration-ship-num"]=this._data["exploration-ship-num"]-1;
	}
	
	add_auxiliary_object(_group_id,_object){//các đối tượng phụ trợ gắn vào ship VD; laser-gun,plasma-gun,child-ship,v.v....
		let _objects=this.get_auxiliary_objects(_group_id);
		for(let i=0;i<_objects.length;i++){
			const _obj=_objects[i];
			if(_obj.id===_object.id)return false;
		}
		_objects.push(_object);
		//this.set_auxiliary_objects(_group_id,_objects);
	}
	has_auxiliary_object(_group_id,_id){//kiem tra xem da so huu hay chua
		const _arr=this.get_auxiliary_objects(_group_id);
		for(let i=0;i<_arr.length;i++){
			if(_arr[i].id===_id){
				return true;
			}
		}
		return false;
	}
	is_using_auxiliary(_group_id,_id){//kiem tra xem co dang su dung vat pham ko
		const _arr=this.get_auxiliary_objects(_group_id);
		for(let i=0;i<_arr.length;i++){
			if(_arr[i].id===_id){
				return _arr[i].use;
			}
		}
		return null;
	}
	use_auxiliary(_group_id,_id){//su dung vat pham
		const _arr=this.get_auxiliary_objects(_group_id);
		for(let i=0;i<_arr.length;i++){
			if(_arr[i].id===_id){
				_arr[i].use=true;
			}
			else{
				_arr[i].use=false;
			}
		}
	}
	not_use_auxiliary(_group_id,_id){//ko su dung vat pham nua
		const _arr=this.get_auxiliary_objects(_group_id);
		for(let i=0;i<_arr.length;i++){
			if(_arr[i].id===_id){
				_arr[i].use=false;
			}
		}
	}
	set_auxiliary_objects(_group_id,_arr){//vì có thể sử dụng nhiều vật phẩm cùng lúc nên dùng _group_id để phân biệt
		const _data_id="auxiliary-objects-"+_group_id;
		this._data[_data_id]=_arr;
	}
	get_auxiliary_objects(_group_id){
		const _data_id="auxiliary-objects-"+_group_id;
		if(!this._data[_data_id])this._data[_data_id]=new Array();
		return this._data[_data_id];
	}
	get_current_auxiliary_id(_group_id){//lay id cua vat pham dang su dung
		const _arr=this.get_auxiliary_objects(_group_id);
		for(let i=0;i<_arr.length;i++){
			if(_arr[i].use===true){
				return _arr[i].id;
			}
		}
		return null;
	}
	get_current_auxiliary_name(_group_id){//lay name cua vat pham dang su dung
		const _arr=this.get_auxiliary_objects(_group_id);
		for(let i=0;i<_arr.length;i++){
			if(_arr[i].use===true){
				return _arr[i].name;
			}
		}
		return null;
	}
	set_auxiliary_object_level(_group_id,_id,_level){
		const _arr=this.get_auxiliary_objects(_group_id);
		for(let i=0;i<_arr.length;i++){
			if(_arr[i].id===_id){
				_arr[i].level=_level;
				//this.set_auxiliary_objects(_arr);
				return true;
			}
		}
		return false;
	}
	get_auxiliary_object_level(_group_id,_id){
		const _arr=this.get_auxiliary_objects(_group_id);
		for(let i=0;i<_arr.length;i++){
			if(_arr[i].id===_id){
				return _arr[i].level;
			}
		}
		return null;
	}
	level_up_auxiliary_object(_group_id,_id){//tang them 1 level
		const _arr=this.get_auxiliary_objects(_group_id);
		for(let i=0;i<_arr.length;i++){
			if(_arr[i].id===_id){
				if(_arr[i].level<this._max_auxiliary_level){
					_arr[i].level++;
					//this.set_auxiliary_objects(_group_id,_arr);
					//alert("Upgraded:"+_arr[i].level);
					return true;
				}
				else
					return false;
			}
		}
		return false;
	}
	
	set_rocket_num(_id,_num){//sau nay phai su dung function nay, va loai bo dan cac function o duoi
		this._data["rocket-num-"+_id]=_num;
	}
	get_rocket_num(_id){
		const _data_id="rocket-num-"+_id;
		if(!this._data[_data_id])this._data[_data_id]=0;
		return this._data[_data_id];
	}
	minus_rocket_num(_id){
		const _data_id="rocket-num-"+_id;
		if(this._data[_data_id]<=0)return;
		this._data[_data_id]=this._data[_data_id]-1;
	}
	get_rockets_in_compartment(){
		let _rs=new Array();
		const _max=200;
		for(let i=1;i<=200;i++){
			const _num=this.get_rocket_num(i);
			if(_num>0)
				_rs.push({id:i,num:_num});
		}
		return _rs;
	}
	get_rocket_in_compartment_num(){//lay thong tin so luong ten lua nam trong khoang
		return this.get_rockets_in_compartment();
	}
	get_rocket_in_compartment_count(){
		let _rs=this.get_rockets_in_compartment();
		let _count=0;
		for(let i=0;i<_rs.length;i++){
			_count+=_rs[i].num;
		}
		return _count;
	}
	get_rocket_in_compartment_id(){
		let _max_type=4;//so type ten lua to'i da duoc phep co trong package
		let _simple_rocket_id=[1,2,3,4,5,6];//khi ko co hoac ko du id thi chon cac id ngau nhien
		let _rockets_num_infor=this.get_rocket_in_compartment_num();
		if(_rockets_num_infor.length===0)_rockets_num_infor.push({id:1,num:0});
		if(_rockets_num_infor.length<_max_type){
			const _t_num=_max_type-_rockets_num_infor.length;
			//for(let i=0;i<_t_num;i++){
				//_rockets_num_infor.push({id:-(i+1),num:0});
				for(let j=0;j<_simple_rocket_id.length&&_rockets_num_infor.length<_max_type;j++){
					let _found=false;
					for(let k=0;k<_rockets_num_infor.length;k++){
						//alert(_rockets_num_infor.length);
						if(_simple_rocket_id[j]===_rockets_num_infor[k].id){
							//alert(_simple_rocket_id[j]+" and "+_rockets_num_infor[k].id);
							_found=true;
							break;
						}
					}
					if(!_found){
						_rockets_num_infor.push({id:_simple_rocket_id[j],num:0});
					}	
				}
				
			//}
		}
		let _rs=new Array();//id cua cac loai rocket player chon su dung
		for(let i=0;i<_rockets_num_infor.length;i++){
			_rs.push(_rockets_num_infor[i].id);
		}
		return _rs;
	}
	
	
	set_rocket_num_1(x){
		this._data["rocket-num-1"]=x;
	}
	get_rocket_num_1(){
		if(!this._data["rocket-num-1"])this._data["rocket-num-1"]=0;
		return this._data["rocket-num-1"];
	}
	minus_rocket_num_1(){
		if(this._data["rocket-num-1"]<=0)return;
		this._data["rocket-num-1"]=this._data["rocket-num-1"]-1;
	}
	
	set_rocket_num_2(x){
		this._data["rocket-num-2"]=x;
	}
	get_rocket_num_2(){
		if(!this._data["rocket-num-2"])this._data["rocket-num-2"]=0;
		return this._data["rocket-num-2"];
	}
	minus_rocket_num_2(){
		if(this._data["rocket-num-2"]<=0)return;
		this._data["rocket-num-2"]=this._data["rocket-num-2"]-1;
	}
	
	
	set_rocket_num_3(x){
		this._data["rocket-num-3"]=x;
	}
	get_rocket_num_3(){
		if(!this._data["rocket-num-3"])this._data["rocket-num-3"]=0;
		return this._data["rocket-num-3"];
	}
	minus_rocket_num_3(){
		if(this._data["rocket-num-3"]<=0)return;
		this._data["rocket-num-3"]=this._data["rocket-num-3"]-1;
	}
	
	set_max_rocket_num(x){
		this._data["max-rocket-num"]=x;
	}
	get_max_rocket_num(){
		if(!this._data["max-rocket-num"])this._data["max-rocket-num"]=this._min_rocket_num;
		return this._data["max-rocket-num"];
	}
	increase_max_rocket_num(){
		if(!this._data["max-rocket-num"])this._data["max-rocket-num"]=this._min_rocket_num;
		this._data["max-rocket-num"]++;
	}
	
}
export {ShipPackage}