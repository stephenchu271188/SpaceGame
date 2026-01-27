import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {WEBGL} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/WebGL.js';
import {graphics} from './graphics.js';
import {SoundManager} from './sound-manager.js';
import {UnitMG} from './unit-mg.js';
import {BaseMG} from './base-mg.js';
import {Algorithm} from './my-utils.js';

import {Radar} from './radar.js';

import {MessageMG} from './message-mg.js';
import {NoticeBoard} from './notice-board.js';
import {IconEffect} from './icon-effect.js';

import {WareHouse} from './warehouse.js';
import {WareHouse2} from './warehouse2.js';

import {GameParameters} from './game-parameters.js';

import {Utils} from './units/utils.js';

import {EffectsScreen} from './effects-screen.js';

import {ImagePreloader} from './image-preloader.js';

//import {inventory} from './inventory.js';
import {InventoryRoot} from './inventory-root.js';

import {ShipPackage} from './ship-package.js';

import {ItemPackage} from './item-package.js';

import {GUICreator} from './GUICreator.js';

//import particleFire from '../lib/three-particle-fire.module.js';
//particleFire.install( { THREE: THREE } );
let _mobile_device;
class System{
	constructor(params){
		_mobile_device=(typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
	}
	isMobileDevice() {
		return _mobile_device;
	}
}

export const game = (function() {
  return {
    Game: class {
      constructor(params) {
		  this._params=params;
		  this._game_id=this._params.game_id;
		  this._playerID=1;//<===
		  this._opponentID=2;//(hinh nhu chua su dung den', trong legion-game su dung enemy-player-id)
		  this._allies_ids=new Array();//_playerID phai nam trong _allies_ids
		  this._opponents_ids=new Array();//_opponentID phai nam trong _opponents_ids
		  this._utils=new Utils();
		  
		  this.System=new System({});
		  this._gui_creator=new GUICreator({game:this});
		  //alert(this.System.isMobileDevice());
		  
		  this.rocket_multiplier=1;// hệ số nhân để tính quãng đường mà các loại tên lửa/rocket có thể bay đi tùy theo từng game
		  
		  //this._key_mode=1;
		  
		  this._parameters=new GameParameters({game:this});

		  this._root_div=document.getElementById("root");
		  if(!this._root_div||this._root_div===null)
			this._root_div=document.body;
		  //_threejs
		  //this._root_div=document.getElementById('target');
		  
		  this._root_inventory=new InventoryRoot({game:this,target:null,
				ship_id:"root"});
		  //this._root_inventory.load_data();
		  
		  this._every_second_passes_fcs=new Array();//cac function thuc hien moi 1 giay troi qua
		  
		  this._Initialize();
		  
		  
		  this._second_counter=0;//dem so' giay troi qua
		  let _second_pass_fc=(t)=>{//tam thoi nhu the nay, co le sau khi fix lai cac loi ve thoi gian thi de no' o trong ham OneSecondPass
			 
			  for(let i=0;i<this._every_second_passes_fcs.length;i++){
				  this._every_second_passes_fcs[i]();
			  }
			  this._second_counter++;
			  //console.log("Second="+_time);
			  this.add_to_timer(_second_pass_fc.bind({}),1);
		  };
		  this.add_to_timer(_second_pass_fc,1);
		  
		  
		  this._cash_list=new Array();//luu cash kiem duoc trong game. VD: moi lan kill duoc 1 ship thi luu cash kiem duoc tuong ung voi ship do vao array
		  this._exp_list=new Array();//su dung tuong tu nhu _cash_list
		  
		  
      }
	  get_player_level(){
		  let _exp=this.get_player_exp();
		  const _max_level=999999999; 
		  let _level=1;
		  for(let i=2;i<_max_level;i++){
			  const _exp_require=this.get_exp_require(i);
			  if(_exp_require>_exp){
				  _level=i-1;
				  break;
			  }
		  }
		 
		 return _level;
		 
	  }
	  get_ship_exp_require(_level){//exp mà player-ship cần có để đạt level
		  let _rs=this.get_exp_require(_level);
			  _rs=parseInt(_rs/3);
			  
		  return _rs;
	  }
	  get_exp_require(_level){//exp của account cần có để đạt level
		  if(_level<2)return 0;
		  //const _base_exp=1000;//chỉnh sửa bằng cách tăng giảm hệ số cong này
		  const _base_exp=this._parameters._standard_exp_1;//chỉnh sửa bằng cách tăng giảm hệ số cong này
		  const _multiplier=0.2;//chỉnh sửa bằng cách tăng giảm hệ số nhân này
		  let _rate=(_level-2)*(1.5+(_level*_multiplier));
		  let _rs=parseInt(_base_exp+(_base_exp*_rate));
		  return _rs;
	  }
	  get_player_exp(){
		  let _total_exp=0;
		  let _ships_infor=this._unitMG._player_ship_infors;
		  for(let i=0;i<_ships_infor.length;i++){
			  let _id=_ships_infor[i].id;
			  if(this._warehouse.have_player_ship(_id)){
				  let _ship_package=new ShipPackage({game:this});
				  const _rs=_ship_package.load_data(_id);
				  let _exp=_ship_package.get_ship_exp();
				  _total_exp+=_exp;
			  }
		  }
		  return _total_exp;
	  }
	  
	  update_player_data(){//update to database
		  this.update_cash();//trong update_cash da co save_data cua inventory
		  this.update_exp();
		  //this._root_inventory.save_data();
	  }
	  update_data_in_local_storage(_item_name,_data){//<==Sau này phải dồn hết vào đây chứ ko thưc hiện trong các class nữa
		  var dataString = JSON.stringify(_data);
		  var currentStorageSize = JSON.stringify(localStorage).length;
		  var maxSize = 5 * 1024 * 1024; // Ví dụ: giới hạn 5 MB cua browser
		  if (currentStorageSize + dataString.length < maxSize){
			localStorage.setItem(_item_name, dataString);
			return true;
		  }
		  else{
			alert('LocalStorage đã đầy. Không thể lưu trữ thêm dữ liệu.(child-ship-store.js)');
			return false;
		  }
	  }
	  get_data_in_local_storage(_item_name){
		  var storedDataString = localStorage.getItem(_item_name);
		  if(storedDataString===null){
			return null;
		  }
		 return JSON.parse(storedDataString);
	  }
	  update_data_in_database(_item_name,_data){//<==Sau này phải sửa lại thay từ local-storage sang database
		  var dataString = JSON.stringify(_data);
		  var currentStorageSize = JSON.stringify(localStorage).length;
		  var maxSize = 5 * 1024 * 1024; // Ví dụ: giới hạn 5 MB cua browser
		  if (currentStorageSize + dataString.length < maxSize){
			localStorage.setItem(_item_name, dataString);
			return true;
		  }
		  else{
			alert('LocalStorage đã đầy. Không thể lưu trữ thêm dữ liệu.(child-ship-store.js)');
			return false;
		  }
	  }
	  get_data_in_database(_item_name){
		  var storedDataString = localStorage.getItem(_item_name);
		  if(storedDataString===null){
			return null;
		  }
		 return JSON.parse(storedDataString);
	  }
	  
	  add_to_cash_list(_cash){//cho vao list, chua update vao database
		  this._cash_list.push(_cash);
	  }
	  update_cash(){//update vao database
		  var _total=0;
		  for(let i=0;i<this._cash_list.length;i++){
			  _total+=this._cash_list[i];
		  }
		  this._cash_list=new Array();
		  this._root_inventory.AddCash(_total);
	  }
	  add_to_exp_list(_exp){
		  this._exp_list.push(_exp);
	  }
	  update_exp(){//hien chi su dung duoc trong space-ship-game
		  var _total=0;
		  for(let i=0;i<this._exp_list.length;i++){
			  _total+=this._exp_list[i];
		  }
		  this._exp_list=new Array();
		  this._me._ship_package.plus_ship_exp(_total);
		  this._me._ship_package.save_data();
	  }
	  
	  add_to_every_second_passes_fcs(_fc){
		  this._every_second_passes_fcs.push(_fc);
	  }
	  remove_from_every_second_passes_fcs(_fc){
		for(let i=this._every_second_passes_fcs.length-1;i>=0;i--){
			if(this._every_second_passes_fcs[i]===_fc){
				this._every_second_passes_fcs.splice(i,1);
			}
		}
	  }
	 
	enable_window_resize_event_listener(){//muon su dung thi goi o main-class(vi trong show-room da su dung ham` rieng)
		if(!this._root_div)return;
		this.window_resize_handle();
		//let _t_game=this;
		let _fc=()=>{
			this.window_resize_handle();
		};
		window.addEventListener("resize", _fc);
	}
	window_resize_handle(){
		if(!this._root_div)return;
		
		let _windowW=window.innerWidth;
		let _windowH=window.innerHeight;
		//alert(_windowW);alert(_windowH);
		const _standardW=1536;
		const _standardH=743;
		
		this._root_div.style.width=_standardW+"px";
		this._root_div.style.height=_standardH+"px";
		this._root_div.style.transformOrigin = "top left";
		
		const _sclX=_windowW/_standardW;
		const _sclY=_windowH/_standardH;
		
		this._root_div.style.transform = "scaleX("+_sclX+") scaleY("+_sclY+")";
	}
	  
	  add_ally_id(_id){//chua test
		this._allies_ids.push(_id);
	  }
	  _add_opponent_id(_id){//chua test
		  this._opponents_ids.push(_id);
	  }
	  _get_opponents_ids(){//chua test
		  return this._opponents_ids;
	  }
	  /*
	  change_key_mode(_id){
		this._key_mode=_id;
		//console.log("KeyMode="+this._key_mode);
		if(this._key_mode===1){
			this._me._rocket_package._open=true;
			this._me._rocket_package.change_visibility();
		}
			
		if(this._key_mode===2)
			if(this._gear_box){
				this._gear_box._open=true;
				this._gear_box.change_visibility();
			}
	  }
	  */
	  
		
	  GetUniqueID(){
		  this._uniqueID++;
		  return this._uniqueID;
	  }
	  add_to_update_function_list(_fc){
		  this._update_function_list.push(_fc);
	  }
	  remove_function_from_update_list(_fc){
		  for(let i=this._update_function_list.length-1;i>=0;i--){
			if(this._update_function_list[i]===_fc){
				this._update_function_list.splice(i,1);
			}
		}
	  }
	  clear_update_function_list(){
		  this._update_function_list=new Array();
	  }
	  
	  add_to_function_list_1(_fc){
		  this._function_list_1.push(_fc);
	  }
	  remove_function_from_list_1(_fc){
		for(let i=this._function_list_1.length-1;i>=0;i--){
			if(this._function_list_1[i]===_fc){
				this._function_list_1.splice(i,1);
				//alert("FOOD");alert(this._function_list_1.length);
			}
		}
	  }
	  clear_function_list_1(){
		  this._function_list_1=new Array();
	  }
	  
	  add_to_function_list_2(_fc,_time){
		  const _start_time=this.currentSecond+0;
		  this._function_list_2.push([_fc,_start_time,_time]);
	  }
	  remove_function_from_list_2(_fc){
		for(let i=this._function_list_2.length-1;i>=0;i--){
			if(this._function_list_2[i][0]===_fc){
				this._function_list_2.splice(i,1);
				//alert("FOUND");
			}
		}
	  }
	  clear_function_list_2(){
		  this._function_list_2=new Array();
	  }
	  
	  
	  add_to_function_list_3(_fc){
		  this._function_list_3.push(_fc);
	  }
	  remove_function_from_list_3(_fc){
		for(let i=this._function_list_3.length-1;i>=0;i--){
			if(this._function_list_3[i]===_fc){
				this._function_list_3.splice(i,1);
				//alert("FOOD");alert(this._function_list_1.length);
			}
		}
	  }
	  clear_function_list_3(){
		  this._function_list_3=new Array();
	  }
	  
	  
	  add_to_function_list_4(_fc){
		  this._function_list_4.push(_fc);
	  }
	  remove_function_from_list_4(_fc){
		for(let i=this._function_list_4.length-1;i>=0;i--){
			if(this._function_list_4[i]===_fc){
				this._function_list_4.splice(i,1);
				//alert("FOOD");alert(this._function_list_1.length);
			}
		}
	  }
	  clear_function_list_4(){
		  this._function_list_4=new Array();
	  }
	  
	  set_timer(_fc,_time){
		  const _start_time=performance.now();;
		  this._timer_fc2.push([_fc,_start_time,_time]);
		  return true;
	  }
	  remove_timer(_fc){
		  for(let i=this._timer_fc2.length-1;i>=0;i--){
			if(this._timer_fc2[i][0]===_fc){
				this._timer_fc2.splice(i,1);
			}
		  }
	  }
	  
	  add_to_timer(_fc,_time){
		  const _start_time=performance.now();;
		  this._timer_fc.push([_fc,_start_time,_time]);
		  
		  return true;
	  }
	  remove_function_from_timer(_fc){
		for(let i=this._timer_fc.length-1;i>=0;i--){
			if(this._timer_fc[i][0]===_fc){
				this._timer_fc.splice(i,1);
			}
		}
	  }
	  clear_timer(){
		  this._timer_fc=new Array();
	  }
	  
	  add_radar(){
		   this._entities['_radar']=new Radar({game:this});
		   this._unitMG.after_create_enemy_combat_unit_fc_1=function(_eunit){
			   if(_eunit._is_enemy===true)
				this._game._entities['_radar'].addTarget(_eunit);
		   }
		   this.add_to_function_list_4(()=>{
			   this._entities['_radar'].Update2();
		   });
	  }
      _Initialize() {
		  this._entities = {};
		  this._uniqueID=0;
		  
		  this._image_preloader=new ImagePreloader({game:this});
		  
		  this._warehouse=new WareHouse({game:this});
		  this._warehouse.load_data();
		  this._warehouse2=new WareHouse2({game:this});//ko load data o day, su dung trong game nao thi load o game day
		  this._item_package=new ItemPackage({game:this});
		  this._item_package.load_data();
		 
		  this._last_time=performance.now();
		  this._timer_fc=new Array();
		  this._timer_fc2=new Array();
		 
		  //this._radar.addTarget();
		  this._update_function_list=new Array();
		  this._function_list_1=new Array();//danh sách các hàm được thực hiện cứ mỗi 1 giây trôi qua
		  this._function_list_2=new Array();//các function hẹn giờ, khi đến đúng thời điểm được hẹn thì sẽ thực hiện
		  this._function_list_3=new Array();//
		  this._function_list_4=new Array();
		  
		  this._icon_effect=new IconEffect({game:this});
		  this._messageMG=new MessageMG({game:this});
		  this._noticeBoard=new NoticeBoard({game:this});
		  //try{
		  this._noticeBoard.init();
		  //for(let i=1;i<90;i++)
			  //this._noticeBoard.add_message("Message "+i);
		  
		  //}catch(e){alert(e.stack);}
		  
        this._graphics = new graphics.Graphics(this);
        if (!this._graphics.Initialize()) {
          this._DisplayError('WebGL2 is not available.');
          return;
        }
		this._algorithm=new Algorithm();
		this._unitMG=new UnitMG({game:this,camera:this._graphics.Camera});
		this._baseMG=new BaseMG({game:this});
		
		this._total_elapsedTimeInMS=0;
		this._elapsedTimeInMS = 0; // Tổng thời gian tích luỹ theo mili giây
        this._elapsedSeconds = 0; // Tổng số giây đã trôi qua
        this._previousSecond = -1; // Khởi tạo giây cuối cùng

		
		this._sound=new SoundManager({game:this});

        this._previousRAF = null;
        this._minFrameTime = 1.0 / 10.0;
        

        this._OnInitialize();
        this._RAF();
		
		this._lock_controls=false;
	
		this._unitMG.load_data(this._params.load_unit_model_complete);
		//this._baseMG.load_data();
	
		this._effect_screen=new EffectsScreen({game:this});
		
		//this.create_message_box_2();
		this.add_to_timer(()=>{//neu ko add-to-timer thi bi loi o showroom
			this.create_message_box_2();
		},4);
		
		let _new_player=this.get_data_in_database("new-player");
		//try{
		if(typeof _new_player==='undefined'
		||_new_player===null){//Đăng nhập lần đầu
		
		this._warehouse2.load_data(()=>{
			this.update_data_in_database("new-player",false);//Nếu đăng nhập lần đâu sẽ được tặng free 1 số lượng unit
			
			this._warehouse2.set_mother_heating_ship_num(this._parameters._first_login_mother_heating_ship_num);
			this._warehouse2.set_mother_freezing_ship_num(this._parameters._first_login_mother_freezing_ship_num);
			this._warehouse2.set_mother_rocket_ship_num(this._parameters._first_login_mother_rocket_ship_num);
		
			this._warehouse2._child_ship_store.set_laser_ship_num(this._parameters._first_login_laser_ship_num);
			this._warehouse2._child_ship_store.set_rocket_ship_num(this._parameters._first_login_rocket_ship_num);
			this._warehouse2._child_ship_store.set_flash_ship_num(this._parameters._first_login_flash_ship_num);
			this._warehouse2.save_data();
			
			this._warehouse.add_rocket_num(1,this._parameters._first_login_warehouse_rocket1_num);
			this._warehouse.add_rocket_num(2,this._parameters._first_login_warehouse_rocket2_num);
			this._warehouse.add_rocket_num(3,this._parameters._first_login_warehouse_rocket3_num);
				  
		});
			
		}
		//}catch(e){alert(e.stack);}
      }
	  
	  create_message_box_3(_text,_time){
		  if(this._message_box_3_container||this._message_box_3_container!=null){
				return;
		  }
		  
		  this._message_box_3_container=document.createElement("div");
		  this._message_box_3_container.style.position="absolute";
		  this._message_box_3_container.style.top="150px";
		  this._message_box_3_container.style.left="0px";
		  this._message_box_3_container.style.width="100%";
		  this._message_box_3_container.style.height="50px";
		  this._message_box_3_container.style.overflow="visible";
		  
		  this._message_box_3_container.style.display="flex";
		  this._message_box_3_container.style.justifyContent="center";
		  this._message_box_3_container.style.alignItems="center";
			  
		  
		  this._message_box_3_container.innerHTML=`
					<h1  style="
									background: linear-gradient(to bottom, red,white, red);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
									font-size: 32px;
									font-weight: bold;
									font-family: 'Orbitron', sans-serif;
				"'>
			  `+_text+`</h1>`;
		if(this._root_div)
			this._root_div.appendChild(this._message_box_3_container);
		this.add_to_timer(()=>{
			this._message_box_3_container.remove();
			this._message_box_3_container=null;
		},_time);
	  }
	  
	  create_message_box_2(){  
	  if(this._message_box_2_container||this._message_box_2_container!=null){
		  return;
	  }
	      let _iframe=document.createElement("iframe");
		   _iframe.style.zIndex="999999999999999";	
		 // iframeContainer.style.overflow="hidden";
		 _iframe.style.position="absolute";
		 _iframe.style.top="50px";
		 _iframe.style.left="0px";
		 _iframe.style.width="100%";
		 _iframe.style.height="150px";
		 _iframe.style.border="none";
		 _iframe.style.visibility="hidden";
		  _iframe.src="./src/message-box-2.html";
		_iframe.addEventListener('load', ()=> {
			_iframe._loaded=true;
		});
		if(this._root_div)this._root_div.appendChild(_iframe);
		
		this._message_box_2_container=_iframe;
	  }
	  show_message_box_2(_type,_title,_content,_second){
		  if(!this._message_box_2_container)return;
		  if(!this._message_box_2_container._loaded)return;
		  
		  if(this._message_box_2_fc)
			  this.remove_function_from_timer(this._message_box_2_fc);
		  
		  this._message_box_2_container.contentWindow.message_box.clear();
		  
		  if(_type==='notice')
			this._message_box_2_container.contentWindow.message_box.show_notice_message(_title,_content);
		  if(_type==='warning')
			this._message_box_2_container.contentWindow.message_box.show_warning_message(_title,_content);
		  if(_type==='alert')
			this._message_box_2_container.contentWindow.message_box.show_alert_message(_title,_content);
		  if(_type==='success1')
			this._message_box_2_container.contentWindow.message_box.show_success_message_1(_title,_content);
		  if(_type==='success2')
			this._message_box_2_container.contentWindow.message_box.show_success_message_2(_title,_content);
		
		  this._message_box_2_container.style.visibility="visible";
		  
		  this._message_box_2_fc=()=>{
			  this._message_box_2_container.style.visibility="hidden";
		  };
		  
		  this.add_to_timer(this._message_box_2_fc,_second);
		  return this._message_box_2_container;
	  }
	  
	  
	  _Clear(){
		  this._graphics._ClearScene();
	  }
	  

      _DisplayError(errorText) {
        const error = document.getElementById('error');
        error.innerText = errorText;
      }
	  
	  _RemoveEntity_ByKey(_key){//Chua test thu
		  let _entity=this._entities[_key];
		  if(_entity){
			  this._graphics.Scene.remove(this._model);
			  delete this._entities[_key];
		  }
		  
	  }
	  _RemoveEntity_ByValue(_value){
		  for (var key in this._entities) {
			if (this._entities.hasOwnProperty(key) && this._entities[key] === _value) {
				if(this._entities[key]._model)
					this._graphics.Scene.remove(this._entities[key]._model);
				delete this._entities[key];//Xoa tat ca phan tu co cung gia tri
				//Neu chi xoa 1 phan tu thi them break;				
			}
	      }
		  
		  //this._unitMG.remove_unit(_value);
	  }
		
	   _StopGame(){
		   this._StopRender();
		   this._graphics.create_divider(this._root_div,"rgba(0, 0, 0, 0.3)");
	   }
		
      _RAF() {
		
        requestAnimationFrame((t) => {
          if (this._previousRAF === null) {
            this._previousRAF = t;
          }
          this._Render(t - this._previousRAF);
          this._previousRAF = t;
        });
      }
		
	  _StopRender(){
		  this._stop_render=true;
	  }
	  _StartRender(){
		  this._stop_render=false;
	  }
		
      _StepEntities(timeInSeconds) {
        for (let k in this._entities) {
          this._entities[k].Update(timeInSeconds);
        }
      }

      _Render(timeInMS) {
		if(this._stop_render){
			return;
		};
        let timeInSeconds = Math.min(timeInMS * 0.001, this._minFrameTime);//<===(dam bao chay tren PC toc do render ko qua nhanh)
		//if(timeInSeconds>this._minFrameTime)timeInSeconds = this._minFrameTime;//<===(dam bao chay tren PC toc do render ko qua nhanh)

        this._StepEntities(timeInSeconds);
        //this._OnStep(timeInSeconds);
        this._graphics.Render(timeInSeconds);

        this._RAF();
		
		this._elapsedTimeInMS += timeInMS; // Cập nhật tổng thời gian tích luỹ
		this._total_elapsedTimeInMS+=timeInMS;//tong thoi gian tich luy(ko reset)
		
		for(let i=0;i<this._update_function_list.length;i++){
			this._update_function_list[i](timeInSeconds);
		}
		
		const currentTime = performance.now();
		for(let i=this._timer_fc.length-1;i>=0;i--){
				const _start_time=this._timer_fc[i][1];
				const _delay=this._timer_fc[i][2];
				if((currentTime-_start_time)/1000>=_delay){
					const _fc=this._timer_fc[i][0];
					_fc();
					this.remove_function_from_timer(_fc);
				}
		}
		for(let i=this._timer_fc2.length-1;i>=0;i--){
				const _start_time=this._timer_fc2[i][1];
				const _delay=this._timer_fc2[i][2];
				if((currentTime-_start_time)>=_delay){
					const _fc=this._timer_fc2[i][0];
					_fc();
					this.remove_timer(_fc);
				}
		}
		
		this._last_time=currentTime;
		
		this._UpdateElapsedTime();
		
		this.Update_1(timeInSeconds);
      }
	  
	  _UpdateElapsedTime() {
        const deltaTimeInSeconds = this._elapsedTimeInMS * 0.001;
        this._elapsedSeconds += deltaTimeInSeconds; // Cập nhật tổng số giây đã trôi qua
        this._elapsedTimeInMS = 0; // Đặt lại thời gian tích luỹ
		
		this.currentSecond = Math.floor(this._elapsedSeconds);
        if (this.currentSecond !== this._previousSecond) {//Moi 1 giay troi qua
            this._previousSecond = this.currentSecond;
			//console.log("Second="+this._previousSecond);
			for(let i=0;i<this._function_list_1.length;i++)
				this._function_list_1[i]();
			for(let i=this._function_list_2.length-1;i>=0;i--){
				const _start_time=this._function_list_2[i][1];
				const _delay=this._function_list_2[i][2];
				if(this.currentSecond-_start_time>=_delay){
					const _fc=this._function_list_2[i][0];
					_fc();
					this.remove_function_from_list_2(_fc);
				}
			}
			
			this._OneSecondPass();
            
        }
		
		// Bắt sự kiện mỗi 10 milli giây trôi qua(ko chính xác tuyệt đối)
		if(!this.lastFoundTime1)this.lastFoundTime1 =0;
		if (this._total_elapsedTimeInMS-this.lastFoundTime1>=10) {
			this.lastFoundTime1 = this._total_elapsedTimeInMS;
			for(let i=0;i<this._function_list_3.length;i++)
				this._function_list_3[i]();
		}
		
		// Bắt sự kiện mỗi 300 milli giây trôi qua(ko chính xác tuyệt đối)
		if(!this.lastFoundTime2)this.lastFoundTime2 =0;
		if (this._total_elapsedTimeInMS-this.lastFoundTime2>=300) {
			this.lastFoundTime2 = this._total_elapsedTimeInMS;
			for(let i=0;i<this._function_list_4.length;i++)
				this._function_list_4[i]();
		}
		
    }
	
	_OneSecondPass(){//xu ly khi moi 1 giay troi qua
		 
	}
	
	  
	  Update_1(){
		  
	  }
	  
	  //--------------------------------------------
	  
	  create_simple_option_panel(_arr){
		  let _container=document.createElement("div");
		_container.style.position="absolute";
		_container.style.width="50%";
		_container.style.height="50%";
		_container.style.top="25%";
		_container.style.left="25%";
		_container.style.border="2px #33BBFF solid";
		_container.style.borderRadius="5px";
		_container.style.backgroundColor="rgba(19, 106, 230, 0.4)";
		_container.style.boxShadow="0 0 10px 5px #33BBFF";
		//_container.style.display="flex";
		_container.style.textAlign="center";
		document.body.appendChild(_container);
		let closeButton = document.createElement("button");
		closeButton.innerText = "X";
		closeButton.style.position = "absolute";
		closeButton.style.top = "10px";
		closeButton.style.right = "10px";
		
		let _close_fc=()=>{
			document.body.removeChild(_container);
		};
		
		closeButton.addEventListener("click", function () {
			_close_fc();
		});
		
		for(let i=0;i<_arr.length;i++){
			const _element=_arr[i];
			let _text=_element.text;
			let _fc=_element.fc;
			let _btn = document.createElement("button");
			_btn.classList.add("btn");
			_btn.classList.add("third");
			_btn.innerText = ""+_text;
			//_newGameBtt.style.position = "absolute";
			//_newGameBtt.style.top = "110px";
			//_newGameBtt.style.right = "290px";
			_btn.style.width="170px";
			_container.appendChild(_btn);
			_btn.addEventListener("click",()=>{
				_close_fc();
				_fc();
			});
		}
		
	  }
	  
	//-------------------------------------------------
		create_menu_btton(){
			var styleTag = document.createElement("style");
			styleTag.textContent=`
				
.animated-btn-1-content {
  
  position:absolute;
  width:100px;
  height:50px;
  right:10px;
  top:10px;
}

.animated-btn-1-content h1 {
  font-size: 8rem;
  font-weight: 600;
  -webkit-text-stroke: 2px rgb(168, 239, 255, 1);
  color: transparent;
  transition: all 0.5s ease;
}

.animated-btn-1 {
  width: 100px;
  height: 50px;
  border-radius: 5px;
  background: transparent;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  transition: all 0.3s ease-in;
}

.animated-btn-1:hover {
  transform: translateY(-5px);
}

.light::before {
  content: "";
  position: absolute;
  background-image: conic-gradient(
    rgb(168, 239, 255, 1) 20deg,
    transparent 150deg
  );
  width: 400%;
  height: 400%;
  border-radius: 5px;
  animation: animated-btn-1-rotate 3s linear infinite;
}

.light::after {
  content: "Menu";
  position: absolute;
  width: 170px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(35px);
  -webkit-backdrop-filter: blur(35px);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  border-radius: 5px;
}

@keyframes animated-btn-1-rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

			`;
			document.head.appendChild(styleTag);
			
			let _menu_container=document.createElement("div");
			_menu_container.style.position="absolute";
			_menu_container.style.top="5px";
			_menu_container.style.right="10px";
			_menu_container.style.width="50px";
			_menu_container.style.height="50px";
			this._root_div.appendChild(_menu_container);
			
			
			let _html=`
				<div id="animated-btn-1-content" class="animated-btn-1-content">
					<a href="#" class="animated-btn-1 light"></a>
				</div>
			`;
			
			_menu_container.innerHTML+=_html;
			_menu_container.addEventListener("click",()=>{
					this.show_game_menu_1();
				});
			
			this._menu_button=_menu_container;
		}
	  
	  //--------------------------------------------
	  show_notification(_text){
		  if(this._notification_box)this.remove_notification();
		  
		  this._notification_box=document.createElement("div");
		  this._notification_box.style.position="absolute";
		  this._notification_box.style.width="50%";
		  this._notification_box.style.left="30%";
		  this._notification_box.style.bottom="80%";
		  this._notification_box.style.textAlign="center";
		  this._notification_box.style.color="white";
		  this._notification_box.style.zIndex="999999";
		  this._notification_box.style.fontSize="20px";
		  this._notification_box.style.display="flex";
		  
		  document.body.appendChild(this._notification_box);
		  
		  this._notification_box.innerHTML=_text;
	  }
	  remove_notification(){
		  this._notification_box.remove();
	  }
	  
	  //-----------------------------------------
	  show_loading_screen(){
		  if(this._loading_screen)return;
		  
		  this._loading_screen=document.createElement("div");
		  this._loading_screen.style.position="absolute";
		  this._loading_screen.style.top="0px";
		  this._loading_screen.style.left="0px";
		  this._loading_screen.style.width="100%";
		  this._loading_screen.style.height="100%";
		  this._loading_screen.style.backgroundColor="rgba(0, 0, 0, 0.4)";
		  this._loading_screen.style.zIndex="999999999999999999999999999999999999999999";
		  
		  document.body.appendChild(this._loading_screen);
		  
		  
		  const _loading_text=document.createElement("div");
		  _loading_text.style.position="absolute";
		  _loading_text.style.top="45%";
		  _loading_text.style.left="45%";
		  _loading_text.style.width="10%";
		  _loading_text.style.height="10%";
		  _loading_text.style.textAlign="center";
		  _loading_text.style.fontSize="30px";
		  _loading_text.style.color="white";
		  _loading_text.innerHTML="loading...";
		  
		  this._loading_screen.appendChild(_loading_text);
	  }
	  remove_loading_screen(){
		  if(this._loading_screen)
			  this._loading_screen.remove();
	  }
	  //----------------------------------------
	  
  remove_message_icon(){
	  if(this._message_icon_container!=null){
		  this._message_icon_container.remove();
		  this._message_icon_container=null;
	  }
  }
  create_message_icon(){
	  if(this._message_icon_container!=null)return;
	  this._message_icon_container=document.createElement("div");
	  this._message_icon_container.style.width="60px";
	  this._message_icon_container.style.height="37px";
	  this._message_icon_container.style.position="absolute";
	  this._message_icon_container.style.top="20px";
	  this._message_icon_container.style.right="215px";
	  this._message_icon_container.style.boxShadow="0 0 0 4px rgba(255,255,255,0.1),0 0 0 8px rgba(255,255,255,0.1),0 0 20px rgba(255,255,255,0.1)";
	  this._root_div.appendChild(this._message_icon_container);
	  
	  this._message_icon=document.createElement("img");
	  this._message_icon.src="./resources/icons/message-1.png";
	  this._message_icon.style.width="60px";
	  this._message_icon.style.height="40px";
	  //this._message_icon.style.position="absolute";
	  //this._message_icon.style.top="10px";
	  //this._message_icon.style.left="47%";
	  this._message_icon.style.border ="2px turquoise solid";
	  this._message_icon_container.appendChild(this._message_icon);
	  this._message_icon.addEventListener("click",()=>{
			
			this.show_message_box();
			this._number_container.style.visibility="hidden";
			this._icon_effect.remove_icon_effect(this._message_icon);
	  });
	  
	  this._number_container=document.createElement("div");
	  this._number_container.style.width="15px";
	  this._number_container.style.height="15px";
	  this._number_container.style.position="absolute";
	  this._number_container.style.top="1px";
	  this._number_container.style.left="-3px";
	  this._number_container.style.borderRadius="50px";
	  this._number_container.style.backgroundColor="rgba(240, 16, 9, 1)";
	  this._number_container.style.textAlign="center";
	  this._number_container.style.fontSize="10px";
	  this._number_container.style.fontWeight="bold";
	  this._number_container.style.color="white";
	  this._number_container.style.visibility="hidden";
	  this._message_icon_container.appendChild(this._number_container);
	  
	  //this._number_container.innerHTML="5";
	  
	  this._messageMG.add_new_message_function(()=>{
		  //alert("FUCK");
		  this._number_container.style.visibility="visible";
	  });
	  //this._icon_effect.add_icon_effect(this._message_icon,1,"yellow","white");
  }
  
  show_game_menu_1(){
		let _iframe=this.show_iframe('./frame/menu-1/index.html',function(){
		
		});
		_iframe.addEventListener('load', ()=> {
			_iframe.contentWindow.set_parent_page(window);
			_iframe.contentWindow.set_change_volume_fc((_val)=>{
				this._sound._volume=(_val/100);
			});
			
		});
		
  }
	  
  show_message_box(){
	  let _game=this;
	let _iframe=this.show_iframe('./frame/message/index.html',function(){
		
	});
	_iframe.addEventListener('load', ()=> {
		let iframeContent = _iframe.contentWindow;
		this._messageMG.init_message(iframeContent);
		//
		//iframeContent.select_category_handle('food');
	});
  }
	  
	  
	  //---------------------------------
  create_inventory_icon_1(base){
		if(this._inventory_icon_1!=null)return;
		
		this._focusing_base=base;
		
		this._inventory_icon_1=document.createElement("img");
		this._inventory_icon_1.src="./resources/icons/connect.png";
		this._inventory_icon_1.style.width="60px";
		this._inventory_icon_1.style.height="60px";
		this._inventory_icon_1.style.position="absolute";
		this._inventory_icon_1.style.bottom="10px";
		this._inventory_icon_1.style.left="47%";
		this._inventory_icon_1.style.border ="2px turquoise solid";
		document.body.appendChild(this._inventory_icon_1);
		this._inventory_icon_1.addEventListener("click",()=>{
			this.remove_inventory_icon();
			this.show_base_inventory_1(base);
		});
		
	}
	create_inventory_icon_2(base){
		if(this._inventory_icon_1!=null)return;
		
		this._focusing_base=base;
		
		this._inventory_icon_1=document.createElement("img");
		this._inventory_icon_1.src="./resources/icons/connect.png";
		this._inventory_icon_1.style.width="60px";
		this._inventory_icon_1.style.height="60px";
		this._inventory_icon_1.style.position="absolute";
		this._inventory_icon_1.style.bottom="10px";
		this._inventory_icon_1.style.left="47%";
		this._inventory_icon_1.style.border ="2px turquoise solid";
		document.body.appendChild(this._inventory_icon_1);
		this._inventory_icon_1.addEventListener("click",()=>{
			this.remove_inventory_icon();
			//this.show_base_inventory_2(base);
			this.show_inventory_2();
		});
		
		this._icon_effect.add_icon_effect(this._inventory_icon_1,1,"yellow","white");
	}
	remove_inventory_icon(){
		if(this._inventory_icon_1&&this._inventory_icon_1!=null){
			this._inventory_icon_1.remove();
			this._inventory_icon_1=null;
		}
		if(this._inventory_icon_2&&this._inventory_icon_2!=null){
			this._inventory_icon_2.remove();
			this._inventory_icon_2=null;
		}
		
	}
   show_base_inventory_1(base){
	   this._me._connecting_base=base;
	   let _player_item=this._me._inventory._item_list;
	   //alert(_player_item['food']);
		   //_player_item=this._me._inventory.summarize_item_data();
	   let _base_item=base._items;//alert(_base_item);
	   this.show_inventory_1(_player_item,_base_item);
   };
   show_inventory_1(_item_list_1,_item_list_2){
	//alert(_item_list_1['food']);
	let _game=this;
	let _iframe=this.show_iframe('./frame/inventory-1/index.html',function(){
		_game._connecting_base=null;
		_game._me._connecting_base=null
		_game.unlock_controls();
		_game.remove_inventory_icon();
		this._me._connecting_base=null;
	});
	_iframe.addEventListener('load', ()=> {
		let iframeContent = _iframe.contentWindow;
		iframeContent.set_player_item_list(_item_list_1); 
		iframeContent.set_station_item_list(_item_list_2); 
		iframeContent.select_category_handle('food');
	});
	
	
};

show_inventory_2(){
	let _game=this;
	let _player_item=this._me._inventory._item_list;
	let _player_accessories=this._me._inventory._accessories;
	let _iframe=this.show_iframe('./frame/inventory-2/index.html',function(){});
	_iframe.addEventListener('load', ()=> {
		let iframeContent = _iframe.contentWindow;
		iframeContent.set_player_item_list(_player_item); 
		iframeContent.set_player_accessories(_player_accessories);
		
		iframeContent.init();
		
		iframeContent.SetGetCashFc(()=>{
			return this._root_inventory.GetCash();
		});
		iframeContent.SetTakeCashFc((_cash)=>{
			this._root_inventory.TakeCash(_cash);
		});
		
		iframeContent.set_repair_fc(()=>{
			this._me.repair();
		});
		iframeContent.set_refuel_fc(()=>{
			this._me.refuel();
		});
		iframeContent.set_save_fc(()=>{
			this._me._inventory._item_list=iframeContent.get_player_item_list();
			this._me._inventory._accessories=iframeContent.get_player_accessories();
			this._me._inventory.equip_items();
			//alert(this._entities['player-inventory-1']._accessories);
			//alert(this._entities['player-inventory-1']._item_list);
			//alert(iframeContent.get_player_item_list());
			
			//this.remove_iframe();
		});
		
	});
};

 show_iframe(_src,_fc){
	 try{
	this.lock_controls();
	 }catch(e){}
	 
	 
	 try{
	 
	let iframeContainer = document.getElementById('iframe-container-1');
	this._iframeContainer=iframeContainer;
	iframeContainer.innerHTML='<iframe id="iframe-1"></iframe><button id="iframe-close-button">Close</button>';
	iframeContainer.style.zIndex="999999999999999";	
	let _iframe=document.getElementById("iframe-1");
	_iframe.style.visibility="hidden";
	_iframe.src=_src;
	iframeContainer.style.backgroundColor="black";
	iframeContainer.style.backgroundImage="url('./resources/bg/bg3.jpg')";
	iframeContainer.style.backgroundSize="cover";
	iframeContainer.style.backgroundPosition="center";
	iframeContainer.style.backgroundRepeat="no-repeat";
	
	//iframeContainer.style.zIndex=this._graphics.getMaxZIndex()+"";
	
	
	let _loading=this._graphics.createLoadingIcon(1);
	
	let closeButton = document.getElementById('iframe-close-button');
	//const _iframe = document.querySelector('iframe');

	closeButton.addEventListener('click', () => {
		this.remove_iframe();
		_fc();
		_loading.remove();
	});
	iframeContainer.style.display = 'block';
	iframeContainer.style.zIndex="99999999";
	
	
		
		_loading.style.position="absolute";
		_loading.style.bottom = "43%";
		_loading.style.left = "43%";
		_iframe.addEventListener('load', ()=> {
			this.add_to_timer(()=>{
				_loading.remove();
				
				_iframe.style.visibility="visible";
				iframeContainer.style.backgroundColor="";
				iframeContainer.style.backgroundImage="";
			},1);
		});
		
		iframeContainer.appendChild(_loading);
		
	
	return _iframe;
	}catch(e){alert(e.stack);}
};
 remove_iframe(){
	let iframeContainer = document.getElementById('iframe-container-1');
	iframeContainer.innerHTML="";
	iframeContainer.style.display = 'none';
	try{//de? tranh' bi loi~
		this.unlock_controls();
	}catch(e){}
};
  
	createOptionBox(title,content,select_list){//
		const optionBox = document.createElement('div');
		optionBox.classList.add('message-box');
		optionBox.style.backgroundColor = 'rgba(20, 114, 234, 0.4)';
		optionBox.style.border = '2px solid transparent';
		optionBox.style.boxShadow = '0 0 10px 5px #33BBFF';
		
		optionBox.style.position = 'fixed';
		optionBox.style.top = '50%';
		optionBox.style.left = '50%';
		optionBox.style.transform = 'translate(-50%, -50%)';
		optionBox.style.width = '400px';
		optionBox.style.padding = '10px';
		optionBox.style.textAlign = 'center';
		optionBox.style.zIndex="999999";


		const confirmBoxBoxTitle = document.createElement('div');
		confirmBoxBoxTitle.classList.add('message-box-title');
		confirmBoxBoxTitle.innerHTML = `
				<h1  style="
									background: linear-gradient(to bottom, blue, white, red);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
									font-size: 24px;
									font-weight: bold;
				"'>
			`
			+title+`</h1>`;
		confirmBoxBoxTitle.style.position="absolute";
		confirmBoxBoxTitle.style.top="0px";
		confirmBoxBoxTitle.style.left="0px";
		confirmBoxBoxTitle.style.width="100%";
		//confirmBoxBoxTitle.style.height="40px";
		confirmBoxBoxTitle.style.background="rgba(0,0,0,0.7)";
		confirmBoxBoxTitle.style.fontSize="40px";
		confirmBoxBoxTitle.style.border="1px gray solid";
		confirmBoxBoxTitle.style.fontWeight = 'bold';
		confirmBoxBoxTitle.style.marginBottom = '10px';
		
		const confirmBoxBoxContent = document.createElement('div');
		confirmBoxBoxContent.classList.add('message-box-content');
		confirmBoxBoxContent.innerHTML = content;
		confirmBoxBoxContent.style.padding="80px";
		confirmBoxBoxContent.style.fontSize="20px";
		confirmBoxBoxContent.style.marginBottom = '20px';
		confirmBoxBoxContent.style.color="white";
		
		confirmBoxBoxContent.innerHTML+="<br/>";
		
		optionBox.appendChild(confirmBoxBoxTitle);
		optionBox.appendChild(confirmBoxBoxContent);
		
		
		document.body.appendChild(optionBox);
		
		for (let i = 0; i < select_list.length; i++) {
			let _text = select_list[i].text;
			let _fc = select_list[i].fc;
			let _btn = document.createElement('button');
				_btn.classList.add('custom-new-btn', 'new-btn-2');
				_btn.style.fontSize = "25px";
				_btn.style.width="140px";
				_btn.innerHTML = _text;
				_btn.addEventListener("click", () => {
					optionBox.remove();
					_fc();
				});

			confirmBoxBoxContent.appendChild(document.createElement("br"));
			confirmBoxBoxContent.appendChild(document.createElement("br"));
			confirmBoxBoxContent.appendChild(_btn);
		}
		
	}
	createConfirmBox2(_params){
		let title=_params.title,
			content=_params.content,
			btn_text_1=_params.btn_text_1,
			btn_text_2=_params.btn_text_2,
			_fc1=_params.function1,
			_fc2=_params.function2,
			title_color_1=_params.title_color_1,
			title_color_2=_params.title_color_2,
			title_color_3=_params.title_color_3;
		const confirmBox = document.createElement('div');
		confirmBox.classList.add('message-box');
		confirmBox.style.backgroundColor = 'rgba(20, 114, 234, 0.4)';
		confirmBox.style.border = '2px solid transparent';
		confirmBox.style.boxShadow = '0 0 10px 5px #33BBFF';
		
		confirmBox.style.position = 'fixed';
		confirmBox.style.top = '50%';
		confirmBox.style.left = '50%';
		confirmBox.style.transform = 'translate(-50%, -50%)';
		confirmBox.style.width = '400px';
		confirmBox.style.padding = '10px';
		confirmBox.style.textAlign = 'center';
		confirmBox.style.zIndex="999999";


		const confirmBoxBoxTitle = document.createElement('div');
		confirmBoxBoxTitle.classList.add('message-box-title');
		confirmBoxBoxTitle.innerHTML = `
				<h1  style="
									background: linear-gradient(to bottom, `+title_color_1+`, `+title_color_2+`, `+title_color_3+`);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
									font-size: 24px;
									font-weight: bold;
				"'>
			`
			+title+`</h1>`;
		confirmBoxBoxTitle.style.position="absolute";
		confirmBoxBoxTitle.style.top="0px";
		confirmBoxBoxTitle.style.left="0px";
		confirmBoxBoxTitle.style.width="100%";
		//confirmBoxBoxTitle.style.height="40px";
		confirmBoxBoxTitle.style.background="rgba(0,0,0,0.7)";
		confirmBoxBoxTitle.style.fontSize="40px";
		confirmBoxBoxTitle.style.border="1px gray solid";

		const confirmBoxBoxContent = document.createElement('div');
		confirmBoxBoxContent.classList.add('message-box-content');
		confirmBoxBoxContent.innerHTML = content;
		confirmBoxBoxContent.style.padding="80px";
		confirmBoxBoxContent.style.fontSize="20px";
		confirmBoxBoxContent.style.marginBottom = '20px';
		confirmBoxBoxContent.style.color="white";
		
		const yesButton = document.createElement('button');
		yesButton.classList.add('neonGlowBtn');
		yesButton.textContent = btn_text_1;
		yesButton.addEventListener('click', () => {
			document.body.removeChild(confirmBox);
			
			if(typeof _fc1!='undefined'&&_fc1!=null){
				_fc1();
			}
		});
		
		const noButton = document.createElement('button');
		noButton.classList.add('neonGlowBtn');
		noButton.style.background="linear-gradient(45deg, #f9374f, #f9a737)";
		noButton.textContent = btn_text_2;
		noButton.addEventListener('click', () => {
			document.body.removeChild(confirmBox);
			if(typeof _fc2!='undefined'&&_fc2!=null){
				_fc2();
			}
		});
		
		yesButton.style.width="80px";
		noButton.style.width="80px";
		yesButton.style.color="white";
		noButton.style.color="white";
		
		confirmBoxBoxTitle.style.fontWeight = 'bold';
		confirmBoxBoxTitle.style.marginBottom = '10px';
		//confirmBoxBoxTitle.style.color="yellow";

		yesButton.style.backgroundColor = '#ccc';
		yesButton.style.padding = '5px 10px';
		yesButton.style.cursor = 'pointer';
		
		noButton.style.backgroundColor = '#ccc';
		noButton.style.padding = '5px 10px';
		noButton.style.cursor = 'pointer';
		noButton.style.marginLeft="50px";

		
		confirmBox.appendChild(confirmBoxBoxTitle);
		confirmBox.appendChild(confirmBoxBoxContent);
		confirmBox.appendChild(yesButton);
		confirmBox.appendChild(noButton);

		
		document.body.appendChild(confirmBox);
	}   
	remove_confirm_boxes(){
		if(!this._confirm_boxes)
			return false;
		
		for(let i=this._confirm_boxes.length-1;i>=0;i--){
			let _box=this._confirm_boxes[i];
			if(!_box||_box===null)
				this._confirm_boxes.splice(i,1);
			else{
				_box.remove();
				_box=null;
			}
		}
		
		return true;
	}
	createConfirmBox(title,content,_fc1,_fc2){
		
		if(!this._confirm_boxes)
			this._confirm_boxes=new Array();
		
		const confirmBox = document.createElement('div');
		this._confirm_boxes.push(confirmBox);
		
		confirmBox.classList.add('message-box');
		//confirmBox.style.position="absolute";
		//confirmBox.style.top="250px";
		//confirmBox.style.left="400px";
		//confirmBox.style.width="300px";
		//confirmBox.style.height="150px";
		confirmBox.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
		confirmBox.style.border = '2px solid transparent';
		confirmBox.style.boxShadow = '0 0 10px 5px #33BBFF';
		
		confirmBox.style.position = 'fixed';
		confirmBox.style.top = '18%';
		confirmBox.style.left = '37%';
		//confirmBox.style.transform = 'translate(-50%, -50%)';
		confirmBox.style.width = '400px';
		confirmBox.style.padding = '10px';
		confirmBox.style.textAlign = 'center';
		confirmBox.style.zIndex="999999";
		
		confirmBox.style.transform="scale(1.14)";
		confirmBox.style.transformOrigin="center";

		const confirmBoxBoxTitle = document.createElement('div');
		confirmBoxBoxTitle.classList.add('message-box-title');
		confirmBoxBoxTitle.innerHTML = `
				<h1  style="
									background: linear-gradient(to bottom, blue, turquoise, white);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
									font-size: 20px;
									font-weight: bold;
				"'>
			`
			+title+`</h1>`;
		confirmBoxBoxTitle.style.position="absolute";
		confirmBoxBoxTitle.style.top="0px";
		confirmBoxBoxTitle.style.left="0px";
		confirmBoxBoxTitle.style.width="100%";
		//confirmBoxBoxTitle.style.height="40px";
		confirmBoxBoxTitle.style.background="rgba(0,0,0,0.7)";
		confirmBoxBoxTitle.style.fontSize="24px";
		confirmBoxBoxTitle.style.border="1px gray solid";

		const confirmBoxBoxContent = document.createElement('div');
		confirmBoxBoxContent.classList.add('message-box-content');
		confirmBoxBoxContent.innerHTML = content;
		confirmBoxBoxContent.style.padding="80px";
		confirmBoxBoxContent.style.fontSize="18px";
		
		const yesButton = document.createElement('button');
		yesButton.classList.add('neonGlowBtn');
		yesButton.textContent = 'YES';
		yesButton.addEventListener('click', () => {
			document.body.removeChild(confirmBox);
			if(typeof _fc1!='undefined'&&_fc1!=null){
				_fc1();
			}
		});
		
		const noButton = document.createElement('button');
		noButton.classList.add('neonGlowBtn');
		noButton.style.background="linear-gradient(45deg, #f9374f, #f9a737)";
		noButton.textContent = 'NO';
		noButton.addEventListener('click', () => {
			document.body.removeChild(confirmBox);
			if(typeof _fc2!='undefined'&&_fc2!=null){
				_fc2();
			}
		});
		
		
		
		confirmBoxBoxTitle.style.fontWeight = 'bold';
		confirmBoxBoxTitle.style.marginBottom = '10px';
		confirmBoxBoxTitle.style.color="yellow";

		confirmBoxBoxContent.style.marginBottom = '20px';
		confirmBoxBoxContent.style.color="white";

		
		yesButton.style.backgroundColor = '#ccc';
		yesButton.style.padding = '5px 10px';
		yesButton.style.cursor = 'pointer';
		
		noButton.style.backgroundColor = '#ccc';
		noButton.style.padding = '5px 10px';
		noButton.style.cursor = 'pointer';
		noButton.style.marginLeft="50px";

		
		confirmBox.appendChild(confirmBoxBoxTitle);
		confirmBox.appendChild(confirmBoxBoxContent);
		confirmBox.appendChild(yesButton);
		confirmBox.appendChild(noButton);

		
		document.body.appendChild(confirmBox);
		
		return confirmBox;
	}  
	  
	  
	  
	createMessageBox(title, content, _fc) {
		if(!this._close_message_box_fcs)
			this._close_message_box_fcs=new Array();
		if(this._openning_messge_box===true)
		{
			this._close_message_box_fcs.push(()=>{
				this.createMessageBox(title, content, _fc);
			});
			return;
		}
		this._openning_messge_box=true;
		
		const messageBox = document.createElement('div');
		messageBox.classList.add('message-box');
		//messageBox.style.backgroundColor="rgba(35, 152, 214, 0.5)";
		messageBox.style.backgroundColor="rgba(0, 0, 0, 0.5)";
		messageBox.style.boxShadow="0 0 20px 5px rgba(35, 211, 214, 1)";
		messageBox.style.color="white";

		const messageBoxTitle = document.createElement('div');
		messageBoxTitle.classList.add('message-box-title');
		//messageBoxTitle.textContent = title;
		//messageBoxTitle.innerHTML = title;
		messageBoxTitle.style.position="absolute";
		messageBoxTitle.style.top="0px";
		messageBoxTitle.style.left="0px";
		messageBoxTitle.style.width="100%";
		messageBoxTitle.style.height="50px";
		messageBoxTitle.style.background="rgba(0,0,0,0.7)";
		messageBoxTitle.style.fontSize="30px";
		messageBoxTitle.style.border="1px gray solid";
		messageBoxTitle.style.display="flex";
		messageBoxTitle.style.justifyContent="center";
		messageBoxTitle.style.alignItems="center";
		messageBoxTitle.innerHTML = `
				<h1  style="
									background: linear-gradient(to bottom, turquoise, yellow, orange);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
									font-size: 24px;
									font-weight: bold;
				"'>
			`
			+title+`</h1>`;
		

		const messageBoxContent = document.createElement('div');
		messageBoxContent.classList.add('message-box-content');
		messageBoxContent.style.padding="50px";
		messageBoxContent.innerHTML = content;

		const closeButton = document.createElement('button');
		closeButton.classList.add('custom-new-btn','new-btn-2');
		//closeButton.classList.add('close-button');
		closeButton.textContent = 'Close';
		closeButton.style.width="70px";
		closeButton.style.height="40px";
		closeButton.style.color="white";
		closeButton.style.fontSize="17px";
		closeButton.style.fontWeight="500";
		closeButton.addEventListener('click', () => {
			document.body.removeChild(messageBox);
			if(typeof _fc!='undefined'&&_fc!=null){
				_fc();
			}
			
			this.add_to_timer(()=>{
				this._openning_messge_box=false;
				if(this._close_message_box_fcs.length>0)this._close_message_box_fcs[0]();
				this._close_message_box_fcs.shift();
			},1);
			
			
		});
		
		messageBox.style.position = 'fixed';
		messageBox.style.top = '50%';
		messageBox.style.left = '50%';
		messageBox.style.transform = 'translate(-50%, -50%)';
		messageBox.style.width = '300px';
		//messageBox.style.backgroundColor = '#fff';
		//messageBox.style.border = '1px solid #ccc';
		//messageBox.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
		messageBox.style.padding = '10px';
		messageBox.style.textAlign = 'center';
		messageBox.style.zIndex="999999";
		
		 // Đặt thuộc tính CSS cho messageBoxTitle
		messageBoxTitle.style.fontWeight = 'bold';
		messageBoxTitle.style.marginBottom = '10px';

		// Đặt thuộc tính CSS cho messageBoxContent
		messageBoxContent.style.marginBottom = '20px';

		// Đặt thuộc tính CSS cho closeButton
		//closeButton.style.backgroundColor = '#ccc';
		//closeButton.style.padding = '5px 10px';
		//closeButton.style.cursor = 'pointer';

		// Gắn các phần tử vào message box
		messageBox.appendChild(messageBoxTitle);
		messageBox.appendChild(messageBoxContent);
		messageBox.appendChild(closeButton);

		// Gắn message box vào body
		document.body.appendChild(messageBox);
		
	}

    }
  };
})();
