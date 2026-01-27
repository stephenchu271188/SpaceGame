
import {GameModeOption} from './game-mode-option.js';

var _game_mode_option;
//var socketServerIP="ws://127.0.0.1:8888/";

var socketServerIP="ws://103.149.86.123:8888/";
var ws;
var channelID=1; 
var connected=false;

var last_time=0;
var passing_second=0;

var ticketID=0;
var ticketList=new Array();

var connect_success_fc=function(){};

var _game_mode=localStorage.getItem('Game-Mode');

class GameClient{
	
	constructor(params){
		this._params=params;
		this._game=params.game;
		this._player=params.player;
		this._stop=false;
		
		_game_mode_option=new GameModeOption({game:this._game,client:this});
	}
	
	get_next_ticket_id=function()
    {
        ticketID++;
        return ticketID;
    };
    remove_ticket=function(_id)
    {
        for(var i in ticketList)
        {
            var _item=ticketList[i];
            if(_item[0]===_id){
                var index = ticketList.indexOf(_item);
                if (index > -1) {
                    ticketList.splice(index, 1);
                }
            }
        }
    };
   
    update_passing_second=function()//goi khi 1 giay troi qua
    {
        passing_second++;

        for(var i in ticketList){
            var _item=ticketList[i];
            var _t_id=_item[0];
            var _t_time=_item[1];
            var _delay=_item[2];//neu vuot qua' thi se ko gui len serve nua
            var _msg=_item[3];
            if(passing_second-_t_time>2&&passing_second-_t_time<_delay){
                sendToServer(_msg);
            }
        }

        if(passing_second-last_time>8){
            return;
			/*
            document.getElementById('option').innerHTML="";
            document.getElementById('option').style.visibility='visible';
            var txt='Something Wrong';
            txt+='<br/>';
            txt+='Mất Kết Nối Server';
            document.getElementById('option').innerHTML=txt;

            gameLogic.end_game();
			*/
        }
    }
	
	set_connect_success_fc=function(fc)
    {
        connect_success_fc=fc;
    };
    
   connect_server=function()
   {
        ws = new WebSocket(socketServerIP);
        ws.onopen = function() {
            connected=true;
            connect_success_fc();
        };
    
        ws.onmessage =  (evt)=>{
            this.analyzeData(evt.data);
       
        };
    
        ws.onclose = function() {
        
        };
    
        ws.onerror = function(err) {
        
        };
   }
   
   analyzeData(data){
		//alert(data);
	   //return;
	    if(this._stop)return;
	   
        last_time=passing_second;

        var infor=data.split('#');
        var requestID=parseInt(infor[0]);
        var requestDetail=infor[1].split('@');
		
        if(requestID===31071)//server thong bao da nhan duoc ticket
        {
            var _ticket_id=parseInt(requestDetail[0]);
            client.remove_ticket(_ticket_id);
            return;
        }
        if(requestID===31002)//indentity for player
        {
            var temp_id=parseInt(requestDetail[0]);
            this._player.set_player_id(temp_id);//id do game-server cung cap ko lien quan toi user-id trong database
            let _show_game_mode_select,_fc1,_fc2;
		   
		    _show_game_mode_select=()=>{
				let _selects=[
					{text:"2D",fc:()=>{this._game._room.set_init_data("mode:2D;");this.request_new_game();}},
					{text:"3D",fc:()=>{this._game._room.set_init_data("mode:3D;");this.request_new_game();}},
					{text:"Cancel",fc:()=>{_game_mode_option.init(_fc1,_fc2);}},
				];
				
				this._game.create_simple_option_panel(_selects);
			};
		   
			_fc1=()=>{
				
				//_show_game_mode_select();
				this._game.start_simulation_multi_player_game();
			};
			_fc2=()=>{
				let _roomID=window.prompt('Input RoomID');
				this.request_join_game(_roomID,"null");
			};
			_game_mode_option.init(_fc1,_fc2);
		
            return;
        }
        if(requestID===31007)//update room data
        {
            var value=requestDetail[0].split('%'); 
            updateRoom(value);

            return;
        }
        if(requestID===31010)//create room success
        {
            var r_id=parseInt(requestDetail[0]);
			//alert("RoomID:"+r_id);
            var r_pass=requestDetail[1].trim();
            this._game._room.set_room_id(r_id);
			this._game._room.get_me().set_key(true);
			
			_game_mode_option.create_room_infor_panel(r_id,r_pass);
			
            return;
        }
        if(requestID===31009)//get room password, dung trong truong hop playr click vao nut Join Room
        {
            var r_id=parseInt(requestDetail[0]);
            var r_pass=requestDetail[1].trim();
            client.request_join_game(r_id,r_pass);
            return;
        }
        if(requestID===31012)//join room
        {
            var r_id=parseInt(requestDetail[0]);
            room.set_room_id(r_id);
            
            return;
        }
        if(requestID===31013)//join room fail
        {
            alert('Room ID hoặc mật khẩu không đúng');
            return;
        }
        if(requestID===31016)//start game
        {
            _game_mode_option.remove_room_infor_panel();
			var _roomID=parseInt(requestDetail[0]);
			var _roomInitData=requestDetail[1].trim();
			var _playersOrder=null;
			//31016#3@mode:2D;@6!ship_id:3%7!ship_id:2@6:0-7:1
			//alert("ROOMID="+_roomID);
			//31016#1@mode:2D@2!ship_id:3%3!ship_id:4
			//var infor=data.split('#');
        //var requestID=parseInt(infor[0]);
        //var requestDetail=infor[1].split('@');
			this._game._room.set_room_id(_roomID);
			this._game._room.set_init_data(_roomInitData);
               // alert(_roomInitData);
            let _init_data=null;
            if(_game_mode==="Campaign"){
                let _full_init_data=requestDetail[2].trim();
				
                _full_init_data=_full_init_data.split("%");
                for(let i=0;i<_full_init_data.length;i++){
                    const _t_data=_full_init_data[i].split("!");
                    //console.log(_t_data);
                    const _p_id=parseInt(_t_data[0]);
                    //console.log("ID="+_p_id+" and EnemyID="+this._game._enemy_player_id);
                    if(_p_id!=this._game._playerID){

                        const _full_unit_infor=_t_data[1].split("add");
                        _init_data=new Array();
                        for(let j=0;j<_full_unit_infor.length;j++){
                            const _elements=_full_unit_infor[j].split("and");
                            //console.log(_elements);
                            let _u_id=parseInt(_elements[0]);
                            let _child_type=parseInt(_elements[1]);
                            let _child_num=parseInt(_elements[2]);

                            _init_data.push({
                                "mother-ship-id":_u_id,
                                "child-type":_child_type,
                                "child-num":_child_num
                            });
                        }
                        break;
                    }
                }
            }
			else{
				let _full_init_data=requestDetail[2].trim();
                //alert(_full_init_data);
				//13!1-ship_id:this._unitMG._player_ship_id%14!1-ship_id:this._unitMG._player_ship_id	
				_init_data=_full_init_data.split("%");
				
				_playersOrder=requestDetail[3].trim();
			}
			
            this._game.start_multi_player_game(_init_data,_playersOrder);//cac game s dung game-client.js deu phai co function start_multi_player_game
            return;
        }
        if(requestID===31020)//1 player giai xong tat ca sudoku
        {
            
            var win_player_id=parseInt(requestDetail[0]);

            if(!room.is_admin_mode())
                temp_player=room.get_player_by_id(win_player_id);
            else
                {
                    temp_player=adminMG.get_player_by_id(win_player_id);
                    adminMG.game_over();
                }

            var temp_p_name=temp_player.get_player_name();
            
            document.getElementById('option').style.visibility='visible';
            var txt='GAME OVER';
            txt+='<br/>';
            txt+=temp_p_name+' WIN';
            document.getElementById('option').innerHTML=txt;

            gameLogic.end_game();

            return;
        }
        if(requestID===31021)//server thong bao admin vao room, player se lien tuc send status, neu ko se ko send status
        {
            var _admin=new Player();
            room.set_admin(_admin);
            //alert(room.get_admin());
            return;
        }
        if(requestID===31023)
        {
            room.set_admin(null);//thong bao admin thoat room de player ko send status nua
            return;
        }

        //---------------------------------------------Admin
        if(requestID===31008)//get room  list, for adminn and player
        {
			//alert("RoomList");
            //if(requestDetail[0].trim()==='')return;
			_game_mode_option.update_room_list(requestDetail[0].trim());
            //var _room_id_list=requestDetail[0].split('-');
            //roomList.updateRoomList(_room_id_list);
            return;
        }
        if(requestID===31022)//reset new game, for admin and player
        {
            var _s_data=requestDetail[0];
            //if(room.is_admin_mode())alert('request replay');
            gameLogic.replay(_s_data);
            return;
        }

        if(requestID===31051)//recieve message, for admin and player
        {
            //alert('got msg');
            var _player_id=parseInt(requestDetail[0]);
            var _player_name=requestDetail[1].trim();
            var _txt=requestDetail[2].trim();
            chat.add_message(_player_id,_player_name,_txt);
            return;
        }
        if(requestID===31019)//player quit game, cho ca admin va player
        {
            var _player_id=parseInt(requestDetail[0]);
            var _player_name=requestDetail[1].trim();
            //alert(_player_name+' has quit game');

            document.getElementById('option').style.visibility='visible';
            var txt='GAME OVER';
            txt+='<br/>';
            txt+=_player_name+' đã thoát game';
            document.getElementById('option').innerHTML=txt;

            gameLogic.end_game();

            return;
        }

        if(requestID===31042)//admin login success
        {
            adminMG.admin_id=parseInt(requestDetail[0]);
            adminMG.admin_name=requestDetail[1].trim();
            adminMG.login_success();
            client.admin_request_room_list();
            return;
        }
        if(requestID===31043)//login fail
        {
            alert('Mật khẩu không đúng, vui lòng nhập lại');
            client.admin_request_login();
            return;
        }
        if(requestID===31004)//cho admin biet' room chua du? player
        {
            //alert('waiting for player');
            instruct.clear_and_add_struction('Waiting for player.....');
            return;
        }
        if(requestID===31005)//(only for admin)send all player infor, and start game
        {
            if(!room.is_admin_mode())return;

            instruct.clear_and_add_struction('');

            var temp_infor_1=requestDetail[0].split('%');
            var temp_infor_2=requestDetail[1].split('%');
            var temp_sudoku_data=requestDetail[2];

            var temp_id_1=parseInt(temp_infor_1[0]);
            var temp_id_2=parseInt(temp_infor_2[0]);

            var temp_name_1=temp_infor_1[1];
            var temp_name_2=temp_infor_2[1];

            adminMG.init_player_1(temp_id_1,temp_name_1);
            adminMG.init_player_2(temp_id_2,temp_name_2);
            //alert(requestDetail[2]);
            var temp_game_data=requestDetail[2].split('=');
            //var temp_sudoku_data=requestDetail[2];
            var temp_sudoku_data=temp_game_data[0];
            charGroup.set_full_data(temp_sudoku_data);
            

            var temp_word_data=temp_game_data[1];
            console.log(temp_word_data);
            wordShapeMG.set_data_by_string(temp_word_data);
            //wordShapeMG.init_all_shape();

            if(paused===true)startGame();//vi co the nhan nhieu msg nay`
          
            return;
        }
        if(requestID===31031)//update player status		
        {//alert(requestDetail[0]);
            if(_game_mode==="Discovery"){
			//var _t_str=requestDetail[0].split('@');
			var _t_p_id=parseInt(requestDetail[0]);//player id
            var pos_str=requestDetail[1].split('%');

            //var p_id=parseInt(pos_str[0]);
            //if(p_id!=adminMG.get_focus_player_id())return;

            var px=parseInt(pos_str[0]);
            var py=parseInt(pos_str[1]);
            var pz=parseInt(pos_str[2]);

            var rx=parseFloat(pos_str[3]);
            var ry=parseFloat(pos_str[4]);
            var rz=parseFloat(pos_str[5]);
			let _e_player=this._game.get_player_ship(_t_p_id);
			//if(typeof this._game._players[0]!='undefined'&&this._game._players[0]!=null){
			if(_e_player!=null){
				//let _e_player=this._game._players[0];
				
				if(!_e_player.Dead){
					_e_player._model.position.set(px,py,pz);
					_e_player._model.rotation.set(rx,ry,rz);
				    //const _health=parseInt(pos_str[7]);//HP cua player(duoc tinh' toan' o may' cua enemy va gui len server)
					
					let _health=this._game._me._health;//HP cua player(duoc tinh' toan' o may' cua enemy va gui len server)
					const _health_infor=pos_str[7].split("+");//alert(this._game._room.get_me().get_player_id()+"-------"+pos_str[7]);
					for(let i=0;i<_health_infor.length;i++){
						const _t_infor=_health_infor[i].split(':');
						//alert(parseInt(_t_infor[0])+"==="+this._room.get_me().get_player_id());
						//alert(_t_infor[0]+" and "+this._game._room.get_me().get_player_id());
						if(parseInt(_t_infor[0])===this._game._room.get_me().get_player_id()){//alert("FOUND");
							_health=parseInt(_t_infor[1]);//alert(_health);
							break;
						}
					}
					/*
					if(this._game._me._health>_health){
						this._game._sound.play('impact-bullet-metal-1');
						const _damage=this._game._me._health-_health;
						this._game._me._health=_health;
						this._game._me._hpBar.remove(Math.ceil(_damage/(this._game._me._health/100)));
					}
					*/
						//this._game._noticeBoard.add_message("Health="+_health);
					if(pos_str[6].trim()==='fire'){
						_e_player.Fire();
					}
					/*
					if(_health<=0){
						this._stop=true;
						this._game._StopGame();
						this._game.show_message_box_2('alert','Game Over!',"You have been destroyed",5);
						setTimeout(()=>{
							this._game.show_game_menu_1();
						},6000);
						
					}
					*/
					if(pos_str[9].trim()!='no-damage'){
						//alert(this._game._room.get_me().get_player_id()+"==="+pos_str[9]);
						//try{
						const _damage_infor=pos_str[9].split('^');
						for(let i=0;i<_damage_infor.length;i++){
							const _infor=_damage_infor[i].split(':');
							const _t_id=parseInt(_infor[0]);//alert(_t_id+" === "+this._game._room.get_me().get_player_id());
							if(_t_id===this._game._room.get_me().get_player_id()){
								//this._game._me.TakeDamage(parseInt(_infor[1]));
								const _damage=parseInt(_infor[1]);//alert(_damage);
								if(_damage<this._game._me._health)
									this._game._me._health=this._game._me._health-_damage;
								else
									this._game._me._health=0;
								this._game._sound.play('impact-bullet-metal-1');
								//this._game._noticeBoard.add_message("Damage:"+_infor[1]+"  YourHP:"+this._game._me._health);
								//this._game._noticeBoard.add_message("YourHP:"+this._game._me._health);
								this._game._me._hpBar.remove(Math.ceil(_damage/(this._game._me._health/100)));
							}
						}
						if(this._game._me._health<=0){
								this._stop=true;
								this._game._StopGame();
								this._game.show_message_box_2('alert','Game Over!',"You have been destroyed",5);
								setTimeout(()=>{
									this._game.show_game_menu_1();
								},6000);
						
							}
						//}catch(e){alert(e.stack);}
					}
					if(pos_str[8].trim()!='no-skill'){
						
						const _action_infor=pos_str[8].split('^');
						for(let i=0;i<_action_infor.length;i++){
							const _action=_action_infor[i].split('=');
							if(_action[0].trim()==='missileLaunch'){
								const _rocket_id=parseInt(_action[1]);
								_e_player._rocket_package.launch_rocket(_rocket_id);
								//this._game._noticeBoard.add_message("RocketID:"+_rocket_id);
							}
							if(_action[0].trim()==='launchContinuousRocket'){
								_e_player.apply_continuous_rocket_skill(_e_player);
							}
							if(_action[0].trim()==='flash'){
								_e_player.apply_flash_skill(_e_player);
							}
							if(_action[0].trim()==='launchLightBall'){
								_e_player.apply_light_ball_skill(_e_player);
							}
							if(_action[0].trim()==='fireBreathing'){
								_e_player.apply_fire_breathing_skill(_e_player);
							}
							if(_action[0].trim()==='fireRainBullet'){
								_e_player.apply_rain_of_bullets_skill(_e_player,1);
							}
							
							
							if(_action[0].trim()==='additional_simple_rocket'){
								const _level=parseInt(_action[1]);
								_e_player.apply_additional_skill_simple_rocket(_e_player,2,_level);
							}
							if(_action[0].trim()==='additional_strengthen_default_weapon_1'){
								const _level=parseInt(_action[1]);
								_e_player.apply_additional_skill_strengthen_default_weapon_1(_e_player,_level);
							}
							if(_action[0].trim()==='additional_spinning_4'){
								_e_player.apply_additional_skill_spinning_4(_e_player,1);
							}
							if(_action[0].trim()==='additional_spinning_3'){
								_e_player.apply_additional_skill_spinning_3(_e_player,1);
							}
							if(_action[0].trim()==='additional_spinning_2'){
								_e_player.apply_additional_skill_spinning_2(_e_player,1);
							}
							if(_action[0].trim()==='additional_spinning_1'){
								_e_player.apply_additional_skill_spinning_1(_e_player,1);
							}
							if(_action[0].trim()==='additional_cyclone_1'){
								_e_player.apply_additional_skill_cyclone_1(_e_player,1);
							}
							if(_action[0].trim()==='additional_multi_rocket_3'){
								_e_player.apply_additional_skill_multi_rocket_3(_e_player,1);
							}
							if(_action[0].trim()==='additional_multi_rocket_2'){
								_e_player.apply_additional_skill_multi_rocket_2(_e_player,1);
							}
							if(_action[0].trim()==='additional_multi_rocket_1'){
								_e_player.apply_additional_skill_multi_rocket_1(_e_player,1);
							}
							if(_action[0].trim()==='additional_freeze_rocket_1'){
								_e_player.apply_additional_skill_freeze_rocket_1(_e_player,1);
							}
							if(_action[0].trim()==='additional_heat_rocket_1'){
								_e_player.apply_additional_skill_heat_rocket_1(_e_player,1);
							}
							if(_action[0].trim()==='additional_time_rocket_4'){
								_e_player.apply_additional_skill_time_rocket_4(_e_player,1);
							}
							if(_action[0].trim()==='additional_time_rocket_3'){
								_e_player.apply_additional_skill_time_rocket_3(_e_player,1);
							}
							if(_action[0].trim()==='additional_time_rocket_2'){
								_e_player.apply_additional_skill_time_rocket_2(_e_player,1);
							}
							if(_action[0].trim()==='additional_time_rocket_1'){
								_e_player.apply_additional_skill_time_rocket_1(_e_player,1);
							}
							if(_action[0].trim()==='additional_generate_multi_photon_3'){
								const _level=parseInt(_action[1]);
								_e_player.apply_additional_skill_generate_multi_photon_3(_e_player,_level);
							}
							if(_action[0].trim()==='additional_generate_multi_photon_2'){
								const _level=parseInt(_action[1]);
								_e_player.apply_additional_skill_generate_multi_photon_2(_e_player,_level);
							}
							if(_action[0].trim()==='additional_generate_multi_photon_1'){
								const _level=parseInt(_action[1]);
								_e_player.apply_additional_skill_generate_multi_photon_1(_e_player,_level);
							}
							if(_action[0].trim()==='additional_generate_photon_1'){
								const _level=parseInt(_action[1]);
								_e_player.apply_additional_skill_generate_photon_1(_e_player,_level);
							}
							if(_action[0].trim()==='additional_invisible'){
								const _level=parseInt(_action[1]);
								_e_player.apply_additional_skill_invisible(_e_player,_level);
							}
							
							
							
							if(_action[0].trim()==='passive_multi_rocket_1'){
								_e_player.apply_passive_skill_multi_rocket_1(_e_player,1);
							}
							if(_action[0].trim()==='passive_multi_rocket_2'){
								_e_player.apply_passive_skill_multi_rocket_2(_e_player,1);
							}
							if(_action[0].trim()==='passive_circling_rocket'){
								_e_player.apply_passive_skill_circling_rocket(_e_player,1,1);
							}
						}
						
					}
				}
			}
			
			
            return;
			}
			
			if(_game_mode==="Campaign"){
				this._game._update_other_player_status(requestDetail[0]);
				return;
			}
        }
        if(requestID===31003)//switch player (for admin only)
        {
            if(!room.is_admin_mode())return;

            //adminMG.reset_all_cube();

            var pos_str=requestDetail[0].split('%');
            var px=parseInt(pos_str[0]);
            var py=parseInt(pos_str[1]);
            var pz=parseInt(pos_str[2]);

            var rx=parseFloat(pos_str[3]);
            var ry=parseFloat(pos_str[4]);
            var rz=parseFloat(pos_str[5]);

            adminMG.update_cam_position(px,py,pz);
            adminMG.update_cam_rotation(rx,ry,rz);

            //sudokuMG2.reset();
            //sudokuMG2.reset_all_id_cube_color();
            //sudokuMG2.clear_all_big_wrap();
            var p_data_2=requestDetail[2];//id cua cac sudoku da giai
            //alert(p_data_2);
            if(p_data_2.trim()!='')
            {
                p_data_2=p_data_2.split('%');
                //alert(p_data_2);
                sudokuMG2.update_finish_list(p_data_2);
            }

            var p_data_1=requestDetail[1];//alert(p_data_1);
            if(p_data_1.trim()!='')
                adminMG.update_cube_list(p_data_1.split('%'));//danh sach id va value cua cac cube da shoot
           

            var s_num=parseInt(requestDetail[3]);//finish num
            //sudokuMG2.set_finish_num(s_num);

            var temp_theta=parseFloat(requestDetail[4]);
            sudokuMG2.set_all_y_theta(temp_theta);

            var is_finish_memorize=requestDetail[6];
            is_finish_memorize=parseInt(is_finish_memorize);
            charGroup.clear();
            wordShapeMG.clear();
            if(is_finish_memorize===1)charGroup.init();
            else wordShapeMG.init_all_shape();

            return;
        }
        if(requestID===31061)//cho ca admin va player
        {
            if(room.is_admin_mode()){
                var sudoku_id=parseInt(requestDetail[0]);
                sudokuMG2.finish_one(sudoku_id);
                //sudokuMG2.show_wrap(sudoku_id);
            }
            //increase_theta();
            charGroup.add_speed();
            return;
        }
        if(requestID===31091)//finish memorize, only for admin
        {
            if(room.is_admin_mode()){
                wordShapeMG.clear();
                charGroup.init();
            }
            
            return;
        }
   }
   
    sendToServer(msg)
    {
		if(this._stop)return;
        if(!connected)return;
	    ws.send(msg);
    };
    request_identity(is_admin,player_init_data)
    {
        if(is_admin===true)
            this.sendToServer(31001+'#0@0@admin@'+channelID);
        else{
            var p_name=this._params.player_name;
			let _msg=31002+'#0@0@'+p_name+'@'+channelID+'@'+this._game._playerID;
			if(player_init_data&&player_init_data!=null)_msg+='@'+player_init_data;
            this.sendToServer(_msg);
        }
		
    };
	request_room_list(){
		var p_id=this._game._room.get_me().get_player_id();
        var p_name=this._game._room.get_me().get_player_name();
        //var r_data="111gamedata111";
        this.sendToServer(31008+'#0@'+p_id+'@'+p_name+'@'+channelID);
	}
	request_new_game()
    {
        var password=0;//ko su dung mat khau
        var p_id=this._game._room.get_me().get_player_id();
        var p_name=this._game._room.get_me().get_player_name();
        var r_data=this._game._room.get_init_data();
        this.sendToServer(31010+'#0@'+p_id+'@'+p_name+'@'+channelID+'@'+r_data+'@'+0+'@');
    };
	request_join_game(room_id,r_pass)
    {
        var room_pass="null";//room ko co mat khau thi se la null
        if(r_pass===null||(r_pass!=null&&r_pass.trim()!='null'&&r_pass.trim()!='')){
                room_pass=window.prompt('Nhập mật khẩu của room');
                if(validateMG.isPasswordInvalid(room_pass)){
                alert('Mật khẩu không hợp lệ');
                this.request_join_game(room_id,r_pass);
                return;
            }
        } 
        var p_id=this._game._room.get_me().get_player_id();
        var p_name=this._game._room.get_me().get_player_name();
        this.sendToServer(31012+'#0@'+p_id+'@'+p_name+'@'+channelID+'@'+room_id+'@'+room_pass+"@");
		
    };
	
	update_status(status_str)//update player infor
    {
        var p_id=this._game._room.get_me().get_player_id();
        var p_name=this._game._room.get_me().get_player_name();
        var room_id=this._game._room.get_room_id();
        this.sendToServer(31031+'#0@'+p_id+'@'+p_name+'@'+channelID+'@'+room_id+'@'+status_str);
    };
}


export{GameClient}