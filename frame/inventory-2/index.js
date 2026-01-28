
window.onerror = function (msg, url, lineNo, columnNo, error) 
{
    alert('found error:'+msg);
    alert('found error:'+url);
    alert('found error:'+lineNo);
    //alert('found error:'+error);
    //alert(myGame.questions.current_answer1.name+'-'+myGame.questions.current_answer2.name+'-'+myGame.questions.current_answer3.name+'-'+myGame.questions.current_answer4.name);
    
};

let player_item_list={};
player_item_list['food']=[];
player_item_list['liquid']=["mercury"];
player_item_list['fuel']=[];
player_item_list['solid']=["gold","gold"];
player_item_list['weapon']=[];

let _accessories=new Array();

let _save_fc=function(){};
let _repair_fc=function(){};
let _refuel_fc=function(){};

let _get_cash_fc=()=>{};
let _take_cash_fc=(_cash)=>{};

function SetGetCashFc(_fc){
	_get_cash_fc=_fc;
}
function SetTakeCashFc(_fc){
	_take_cash_fc=_fc;
}

function set_save_fc(_fc){
	_save_fc=_fc;
};
function set_repair_fc(_fc){
	_repair_fc=_fc;
};
function set_refuel_fc(_fc){
	_refuel_fc=_fc;
};

function set_player_item_list(_tlist){
	player_item_list=_tlist;;
};
function get_player_item_list(){
	return player_item_list;
};
function set_player_accessories(_tlist){
	_accessories=_tlist;
};
function get_player_accessories(){
	//return get_equipment_id_list();
	return _accessories;
};
function get_player_item_num(_category,_name){
	let _rs=0;
	let _tlist=player_item_list[_category];
	for(var i=0;i<_tlist.length;i++){
		if(_tlist[i]===_name)
			_rs++;
	}
	return _rs;
};

function remove_item(_item_id,_category){
	const indexToRemove = player_item_list[_category].indexOf(_item_id);
	if (indexToRemove !== -1) {
		player_item_list['solid'].splice(indexToRemove, 1);
	}
};

let avatar_img=document.getElementById("avatar-img");
let avatar_img_text=document.getElementById("avatar-img-text");
let player_name=document.getElementById("player-name");
let character_name=document.getElementById("character-name");
let character_infor_1=document.getElementById("character-infor-1");
let character_infor_2=document.getElementById("character-infor-2");

//let save_button=document.getElementById("save-btt");

let all_items_container = document.querySelectorAll(".items__container");
let all_equipment_container=document.querySelectorAll(".items__container--disabled");//trang bi cho player

let _gun_require_1={};
_gun_require_1["gold"]=["solid",2];
_gun_require_1["mercury"]=["liquid",1];
let _gun_require_2={};
_gun_require_2["silver"]=["solid",2];
_gun_require_2["mercury"]=["liquid",1];
let _gun_require_3={};
_gun_require_3["gold"]=["solid",2];
_gun_require_3["mercury"]=["liquid",1];

let _gun_1_price=5000;
let _gun_2_price=7000;
let _gun_3_price=10000;

/*
let weapon_list=[["lasergun1","Laser Gun 1","img/lasergun.png",_gun_1_price,"Laser guns are made from extremely rare diamonds"],
				 ["lasergun2","Laser Gun 2","img/lasergun.png",_gun_2_price,"Laser guns are made from extremely rare diamonds"],
				 ["plasmagun1","Plasma Gun","img/plasmagun.png",_gun_3_price,"Plasma guns with high-temperature firepower melt enemies"],
				 //["freezegun1","Freeze Gun","img/freezegun-1.png",_gun_require_3]
				 ];
*/
let weapon_list=[];

let _service_require_1={};
_service_require_1["gold"]=["solid",1];
let _service_require_2={};
_service_require_2["gold"]=["solid",2];

let maintenance_service_list=[['refuel','Refueling Spacecraft','img/refuel.png',_service_require_1,"Fill your spaceship with fuel"],
							  ['repair','Spacecraft Repair And Maintenance','img/repair.png',_service_require_2,"Repair any damage on your ship to help it operate more efficiently"]];

avatar_img.src="img/xwing.jpg";
avatar_img_text.innerHTML="XWing";
player_name.innerHTML="Stephen Chu";
character_name.innerHTML="XWing";
character_infor_1.innerHTML="Infor 1";
character_infor_2.innerHTML="Infor 2";

let _current=null;
function show_items_list(_tlist){
	_current=_tlist;
	for (var i = 0; i < all_items_container.length; i++) {
        let _container=all_items_container[i];
		//let _item_img=_container.querySelectorAll(".item__img")[0];
		let _html="";
		if(i<_tlist.length){
			let _item=_tlist[i];
			let _id=_item[0];
			let _name=_item[1];
			let _src=_item[2];
			let _infor=_item[4];
			_html+='<span class="items__number">'+i+'</span>';
			_html+='<div onclick=\'item_click_handle("'+_id+'")\' class="item__container" draggable="true">';
            _html+='<img class="item__img" src="'+_src+'" alt="infinity_blade" draggable="false" />';
            _html+='<div class="item__tooltip" draggable="false">';
              _html+='<div class="item__tooltip__title">';
                _html+='<h2>'+_name+'</h2>';
              _html+='</div>';
              _html+='<div class="item__tooltip__info">';
                _html+=_infor;
              _html+='</div>';
            _html+='</div>';
          _html+='</div>';
		}
		else{
			_html+='<span class="items__number">'+i+'</span>';
			_html+='<div class="item__container"></div>';
		}
		
		_container.innerHTML=_html;
    }
	
	document.getElementById("menu").style.visibility="visible";
};

function get_item_by_id(_id,_tlist){
	for(var i=0;i<_tlist.length;i++){
		if(_tlist[i][0]===_id)
			return _tlist[i];
	}
	return null;
};
function select_handle(_id){
	
	let _current_cash=_get_cash_fc();
	//alert("CurrentCash:"+_current_cash);
	if(_current===weapon_list){
		_category="weapon";
		let _item=get_item_by_id(_id,weapon_list);
		let _require_assets=_item[3];
		if(_require_assets>_current_cash){
			show_message("Not enough "+_asset_name);
				return false;
		}
		/*
		for (const key in _require_assets) {//Kiem tra xem co du item ko
			if (_require_assets.hasOwnProperty(key)) {
			const value = _require_assets[key];
			
			const _asset_name=key;
			const _category=value[0];
			const _count1=value[1];
			
			const _count2=get_player_item_num(_category,_asset_name);
			if(_count2===0||_count2<_count1){
				show_message("Not enough "+_asset_name);
				return false;
			}
			}
		}
		
		for (const key in _require_assets) {
			if (_require_assets.hasOwnProperty(key)) {
				const value = _require_assets[key];
			
				//const _asset_name=key;
				const _category=value[0];
				const _count1=value[1];
				
				for(var i=0;i<_count1;i++){
					remove_item(key,_category);
				}
			}
		}
		*/
		
		let _found=false;
		for(var i=0;i<_accessories.length;i++){
			if(_accessories[i][1]===_category){
				_accessories[i][0]=_id;
				_found=true;
			}
		}
		if(!_found){
			_accessories.push([_id,_category]);
			_take_cash_fc(_require_assets);
		}
				
		change_equipment(0,_item);
		return;
	};
	if(_current===maintenance_service_list){
		//_category="service";
		let _item=get_item_by_id(_id,maintenance_service_list);
		let _require_assets=_item[3];
		for (const key in _require_assets) {//Kiem tra xem co du item ko
			if (_require_assets.hasOwnProperty(key)) {
			const value = _require_assets[key];
			
			const _asset_name=key;
			const _category1=value[0];
			const _count1=value[1];
			
			const _count2=get_player_item_num(_category1,_asset_name);
			if(_count2===0||_count2<_count1){
				show_message("Not enough "+_asset_name);
				return false;
			}
			}
		}
		
		for (const key in _require_assets) {
			if (_require_assets.hasOwnProperty(key)) {
				const value = _require_assets[key];
			
				//const _asset_name=key;
				const _category=value[0];
				const _count1=value[1];
				
				for(var i=0;i<_count1;i++){
					remove_item(key,_category);
				}
			}
		}
		//alert("FINISH");
		if(_id==='repair'){
			_repair_fc();
		}
		if(_id==='refuel'){
			_refuel_fc();
		}
		return;
	};
};


function item_click_handle(_id){
	let _item,_require_assets;
	if(_current===weapon_list){
		_item=get_item_by_id(_id,weapon_list);
		_require_assets=_item[3];
	}
	if(_current===maintenance_service_list){
		_item=get_item_by_id(_id,maintenance_service_list);
		_require_assets=_item[3];
	}
	
	// Tạo một overlay để che phủ trang web
const overlay = document.createElement("div");
overlay.style.position = "fixed";
overlay.style.top = "0";
overlay.style.left = "0";
overlay.style.width = "100%";
overlay.style.height = "100%";
overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
overlay.style.zIndex = "999";
document.body.appendChild(overlay);

// Tạo confirm box
const confirmBox = document.createElement("div");
confirmBox.style.position = "fixed";
confirmBox.style.top = "50%";
confirmBox.style.left = "50%";
confirmBox.style.transform = "translate(-50%, -50%)";
confirmBox.style.backgroundColor = "white";
confirmBox.style.padding = "20px";
confirmBox.style.borderRadius = "10px";
confirmBox.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
confirmBox.style.zIndex = "1000";
confirmBox.style.backgroundColor="turquoise";
confirmBox.style.color="white";
document.body.appendChild(confirmBox);

const title = document.createElement("h1");
title.textContent = "Confirm";
title.style.fontSize = "24px"; // Thiết lập kích thước phông chữ cho tiêu đề
confirmBox.appendChild(title);

let _br=document.createElement("br");
confirmBox.appendChild(_br);

let message = document.createElement("p");
message.textContent = "This item costs:";
confirmBox.appendChild(message);
	
		if(isNaN(_require_assets)){
			for (const key in _require_assets) {
				if (_require_assets.hasOwnProperty(key)) {
					const value = _require_assets[key];
			
					const _asset_name=key;
					const _category=value[0];
					const _count1=value[1];
			
					message = document.createElement("p");
					message.textContent = "+"+_category+": "+_count1;
					confirmBox.appendChild(message);
			
					_br=document.createElement("br");
					confirmBox.appendChild(_br);
				}
			}
		}
		else{
			message = document.createElement("p");
			message.textContent = _require_assets+"$";
			confirmBox.appendChild(message);
		}
_br=document.createElement("br");
confirmBox.appendChild(_br);

// Thêm nội dung và các nút vào confirm box
message = document.createElement("p");
message.textContent = "Do you want to continue?";
confirmBox.appendChild(message);

_br=document.createElement("br");
confirmBox.appendChild(_br);

const yesButton = document.createElement("button");
yesButton.textContent = "Yes";
yesButton.style.marginRight = "10px";
yesButton.addEventListener("click", () => {
  select_handle(_id);
  document.body.removeChild(overlay);
  document.body.removeChild(confirmBox);
});
confirmBox.appendChild(yesButton);

const noButton = document.createElement("button");
noButton.textContent = "No";
noButton.addEventListener("click", () => {
  document.body.removeChild(overlay);
  document.body.removeChild(confirmBox);
});
confirmBox.appendChild(noButton);

};

function change_equipment(_id,_item){//_id la vi tri cua 1 trong 6 icon xung quanh avatar
	let _container=all_equipment_container[_id];
	let _item_id=_item[0];
	let _name=_item[1];
	let _src=_item[2];
		
	let _html='';
	_html+='<div class="item__container disabled">';
            _html+='<img class="item__img" src="'+_src+'" alt="" />';
                _html+='<div class="item__tooltip item__tooltip--higher">';
                  _html+='<div class="item__tooltip__title">';
                    _html+='<h2 id="'+_item_id+'" class="equipment-icon">'+_name+'</h2>';
                    _html+='<h3 class="item__tooltip__category item__tooltip__category--wearable">';
                      _html+='Footwear';
                    _html+='</h3>';
                  _html+='</div>';
                  _html+='<div class="item__tooltip__info">';
                    _html+='The fuzzy lining keeps your ankles so warm.';
                  _html+='</div>';
                _html+='</div>';
              _html+='</div>';
	_container.innerHTML=_html;
	
	_save_fc();
	
};

//lay thong tin cac equipment trang bi cho player
function get_equipment_id_list(){
	let _tlist=document.querySelectorAll(".equipment-icon");
	let _rs=new Array();
	for(var i=0;i<_tlist.length;i++){
		_rs.push(_tlist[i].id.trim());
	}
	return _rs;
};

function show_weapon_list(){
	show_items_list(weapon_list);
};
function show_service_list(){
	show_items_list(maintenance_service_list);
};

document.getElementById("weapon-img").addEventListener("click",()=>{
	show_weapon_list();
});
document.getElementById("service-img").addEventListener("click",()=>{
	show_service_list();
});
/*
save_button.addEventListener("click",()=>{
	
	let _rs=get_equipment_id_list();
	
	_save_fc();
});
*/

function init(){
	show_weapon_list();
	for(var i=0;i<_accessories.length;i++){
		if(_accessories[i]!=null){
			let _item_id=_accessories[i][0];
			let _category=_accessories[i][1];
			
			if(_category==='weapon'){
				let _item=get_item_by_id(_item_id,weapon_list);
				change_equipment(0,_item);
			}
		}
	}
	
	/*
		cac accessories khac change_equipment(1->5,_item);
	*/
};

