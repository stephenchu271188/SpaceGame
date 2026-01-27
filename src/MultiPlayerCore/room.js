import {Player} from './player.js';

var room_id=null;
var room_password=null;

var ROLE_ADMIN=1;
var ROLE_PLAYER=2;
var GAME_ROLE=2;

var SINGLE_MODE=1;
var MULTI_PLAYER_MODE=2;
var ADMIN_MODE=3;
var GAME_MODE=MULTI_PLAYER_MODE;

var player_me,player_enemy;
var player_list=new Array();
player_list.push(player_me);
player_list.push(player_enemy);

var admin=null;
var _init_data=null;
class Room{
    
	constructor(params){
		this._params=params;
		this._game=params.game;
		
	}

    set_room_id=function(id)
    {
        room_id=id;
    };
    get_room_id=function()
    {
        return room_id;
    };
    set_room_password=function(x)
    {
        room_password=x;
    };
    get_room_password=function()
    {
        return room_password;
    };
    set_init_data(_data){
		_init_data=_data;
	}
	get_init_data(){
		return _init_data;
	}
    init_single_player_mode=function()
    {
        GAME_MODE=SINGLE_MODE;
        player_me=new Player();
        player_me.init_myself();
        this.init();
    };
    init_multi_player_mode=function(player_init_data)
    {
        GAME_MODE=MULTI_PLAYER_MODE;

        //var validator=new Validate();
        //var p_name=window.prompt('Nhập nick name');
		var p_name="stephen";
		

        player_me=new Player({game:this._game});
        player_me.set_player_name(p_name);
		player_me.set_init_data(player_init_data);
        player_me.init_myself();
        
        player_enemy=new Player({game:this._game});
        player_enemy.init_enemy();

        player_list=new Array();
        player_list.push(player_me);
        player_list.push(player_enemy);

        this.init();
    };
	/*
    update(){
		
	}
	*/
	
    enable_admin_mode=function()
    {
        GAME_ROLE=ROLE_ADMIN;
        GAME_MODE=ADMIN_MODE;
        
    };

    init=function()
    {
       
    };

    get_player_by_id=function(p_id)
    {
        for(var i in player_list){
            var temp_player=player_list[i];
            if(temp_player.get_player_id()===p_id)
                return temp_player;
        }
        return null;
    };
    get_player_by_name=function(p_name)//phai dam bao ko co 2 player trung` nick name
    {
        for(var i in player_list){
            var temp_player=player_list[i];
            if(temp_player.get_player_name()===p_name)
                return temp_player;
        }
        return null;
    };
  
    get_admin=function()
    {
        return admin;
    };
    set_admin=function(x)
    {
        admin=x;
    };
    get_me=function()
    {
        return player_me;
    };
    get_enemy=function()
    {
        return player_enemy;
    };
	/*
	set_me_entity(entity){
		player_me.entity=entity;
	}
	set_enemy_entity(entity){
		player_enemy.entity=entity;
	}
	*/
    i_am_player=function()
    {
        if(GAME_ROLE===ROLE_PLAYER)
            return true;
    
        return false;
    };
    i_am_admin=function()
    {
        if(GAME_ROLE===ROLE_ADMIN)
            return true;
        
        return false;
    };
  
    is_single_player_mode=function()
    {
        if(GAME_MODE===SINGLE_MODE)
            return true;

        return false;
    };
    is_multi_player_mode=function()
    {
        if(GAME_MODE===MULTI_PLAYER_MODE)
            return true;

        return false;
    };
    is_admin_mode=function()
    {
        if(GAME_MODE===ADMIN_MODE)
            return true;

        return false;
    };
}

export {Room}