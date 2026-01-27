import {GameClient} from './game-client.js';

var client=null;
var player_id=null;//playerID do game-server cung cap, ko lien quan toi user-id trong database
var player_name='null';

var is_me=false;
var is_enemy=false;

var is_key_player=false;
class Player{
    
	constructor(params){
		this._params=params;
		this._game=params.game;
		this._init_data=null;//truoc khi bat dau tran dau phai co thong tin ban dau(VD:number of ships, type of ships...)
		
		this._action_list=new Array();
		this._damage_list=new Array();
	}
	set_init_data(x){
		this._init_data=x;
	}
	update_client_time(){
		client.update_passing_second();
	}
	add_action(_name){
		this._action_list.push(_name);
	}
	cause_damage(_player_id,_damage){
		this._damage_list.push({id:_player_id,damage:_damage});
	}
	update_status(){//overwrite o legion-game
		//try{
		if(this._entity){
			const _my_position=this._entity._model.position;
			const _my_rotation=this._entity._model.rotation;
			let _msg=parseInt(_my_position.x)+"%"+parseInt(_my_position.y)+"%"+parseInt(_my_position.z);
			_msg+="%"+_my_rotation.x+"%"+_my_rotation.y+"%"+_my_rotation.z;
			_msg+="%";
			if(typeof this._game._entities['_controls2']!='undefined'&&this._game._entities['_controls2']._move.fire===true)
				_msg+="fire";
			else
				_msg+="notfire";
			
			_msg+="%";
			
			//_msg+=this._game._players[0]._health;
			for(let i=0;i<this._game._players.length;i++){
				const _player=this._game._players[i];
				_msg+=_player._player_id+":"+_player._health;
				if(i<this._game._players.length-1)
					_msg+="+";
			}
			
			_msg+="%";
			if(this._action_list.length>0){
				for(let i=0;i<this._action_list.length;i++){
					_msg+=this._action_list[i];
					_msg+="^";
				}
				this._action_list=new Array();
			}
			else{
				_msg+="no-skill";
			}
			_msg+="%";
			if(this._damage_list.length>0){
				for(let i=0;i<this._damage_list.length;i++){
					_msg+=this._damage_list[i].id+":"+this._damage_list[i].damage;
					if(i<this._damage_list.length-1)_msg+="^";
				}
				this._damage_list=new Array();
			}
			else{
				_msg+="no-damage";
			}
			
			client.update_status(_msg);
			/*
			if(this._game._enemy_1.get_entity().Dead){
				if(!this._show_end_game){
					this._show_end_game=true;
					this._game.add_to_timer(()=>{
						client._stop=true;
						this._game._StopGame();
						this._game.show_message_box_2('success2','Game Over!',"You win!",5);
					},2);
					setTimeout(()=>{
						this._game.show_game_menu_1();
					},6000);
				}
			}
			*/
		}
	//}catch(e){alert(e.toString());}
	}
	
	set_entity(x)
	{
		this._entity=x;
	}
	get_entity()
	{
		return this._entity;
	}
	
    set_key=function(x)
    {
        is_key_player=x;
    };
    is_key=function()
    {
        return is_key_player;
    };
    
    init_myself=function()
    {
        is_me=true;
        is_enemy=false;
       
        client=new GameClient({game:this._game,player_name:player_name,player:this});
        //client.set_connect_success_fc(function(){
            //client.request_identity(false,this._init_data);
        //});
		client.set_connect_success_fc(()=>{
			client.request_identity(false,this._init_data);
		});
        client.connect_server();
		this._client=client;
    };
    init_enemy=function()
    {
        is_me=false;
        is_enemy=true;
    };
    
    is_myself=function()
    {
        return is_me;
    };
    is_enemy=function()
    {
        return is_enemy;
    };
    
    set_player_id=function(x)
    {
        player_id=x;
    };
    get_player_id=function()
    {
        return player_id;
    };
    set_player_name=function(x)
    {
        player_name=x;
    };
    get_player_name=function()
    {
        return player_name;
    };
   
   
    shoot_at=function(obj)
    {
        
    };

};

export{Player}