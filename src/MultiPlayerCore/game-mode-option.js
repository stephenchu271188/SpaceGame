//import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
//import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/loaders/GLTFLoader.js';

class GameModeOption{
	constructor(params){
		this._params=params;
		this._game=params.game;
		this._client=params.client;
	}
	
	auto_vao_game_gia_lap(_fc1){//tam thoi de auto vao game gia lap voi computer
		let _container=document.createElement("div");
		_container.style.position="absolute";
		_container.style.width="20%";
		_container.style.height="20%";
		_container.style.top="40%";
		_container.style.left="40%";
		_container.style.border="2px #33BBFF solid";
		_container.style.borderRadius="5px";
		_container.style.backgroundColor="rgba(19, 106, 230, 0.4)";
		_container.style.boxShadow="0 0 10px 5px #33BBFF";
		//_container.style.display="flex";
		_container.style.textAlign="center";
		document.body.appendChild(_container);
		
		let _loading=this._game._graphics.createLoadingIcon(1);
		_container.appendChild(_loading);
		
		let _text=document.createElement("div");
		_text.style.color="white";
		_text.style.fontSize="16px";
		_text.style.textShadow="1px 1px 1px 1px black";
		_text.innerHTML=`<b style="font-family: 'Orbitron', sans-serif;">Searching for opponent...</b>`;
		_container.appendChild(_text);
		
		
		let _delay=this._game._utils.get_random_in_range(4,9);
		this._game.add_to_timer(()=>{
			document.body.removeChild(_container);
			_fc1();
		},_delay);
	}
	init(_fc1,_fc2){
		this.auto_vao_game_gia_lap(_fc1);
		return;
		
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
		//_container.appendChild(closeButton);
		
		let _newGameBtt = document.createElement("button");
		_newGameBtt.classList.add("btn");
		_newGameBtt.classList.add("third");
		_newGameBtt.innerText = "New Game";
		//_newGameBtt.style.position = "absolute";
		//_newGameBtt.style.top = "110px";
		//_newGameBtt.style.right = "290px";
		_newGameBtt.style.width="170px";
		
		let _joinGameBtt = document.createElement("button");
		_joinGameBtt.classList.add("btn");
		_joinGameBtt.classList.add("third");
		_joinGameBtt.innerText = "Join Game";
		//_joinGameBtt.style.position = "absolute";
		//_joinGameBtt.style.top = "110px";
		//_joinGameBtt.style.right = "410px";
		_joinGameBtt.style.width="170px";
		
		let _autoJoinGameBtt = document.createElement("button");
		_autoJoinGameBtt.classList.add("btn");
		_autoJoinGameBtt.classList.add("third");
		_autoJoinGameBtt.innerText = "Auto Join Game";
		//_autoJoinGameBtt.style.position = "absolute";
		//_autoJoinGameBtt.style.top = "110px";
		//_autoJoinGameBtt.style.right = "410px";
		_autoJoinGameBtt.style.width="170px";
		
		_container.appendChild(_newGameBtt);
		_container.appendChild(_joinGameBtt);
		_container.appendChild(_autoJoinGameBtt);
		
		_newGameBtt.addEventListener("click",()=>{
			_close_fc();
			_fc1();
			
		});
		_joinGameBtt.addEventListener("click",()=>{
			_close_fc();
			//_fc2();
			this.create_room_list_panel();
			this._client.request_room_list();
		});
		_autoJoinGameBtt.addEventListener("click",()=>{
			_close_fc();
			this.create_auto_join_game_panel();
		});
	}
	
	
	remove_room_list_panel(){
		if(this._room_list_panel&&this._room_list_panel!=null)
			this._room_list_panel.remove();
		
		if(this._get_room_list_fc&&this._get_room_list_fc!=null){
			clearInterval(this._get_room_list_fc);
			this._get_room_list_fc=null;
		}
	}
	
	update_room_list(_data){
		if(this._room_list_panel&&this._room_list_panel!=null)
			this.create_room_list_panel(_data);
	}
	create_room_list_panel(_data){
		
		this.remove_room_list_panel();
		let _container=document.createElement("div");
		this._room_list_panel=_container;
		_container.style.position="absolute";
		_container.style.width="70%";
		_container.style.height="60%";
		_container.style.top="20%";
		_container.style.left="15%";
		_container.style.border="2px #33BBFF solid";
		_container.style.borderRadius="5px";
		_container.style.backgroundColor="rgba(19, 106, 230, 0.4)";
		_container.style.boxShadow="0 0 10px 5px #33BBFF";
		_container.style.textAlign="center";
		document.body.appendChild(_container);
		
		let cancelButton = document.createElement("button");
		cancelButton.innerText = "Exit";
		cancelButton.style.position = "absolute";
		cancelButton.style.bottom = "10px";
		cancelButton.style.left = "270px";
		cancelButton.style.width="110px";
		cancelButton.classList.add("btn");
		cancelButton.classList.add("third");
		cancelButton.addEventListener("click", function () {
			this.remove_room_list_panel();
		});
		
		/*
		let refreshButton = document.createElement("button");
		refreshButton.innerText = "Refresh";
		refreshButton.style.position = "absolute";
		refreshButton.style.bottom = "10px";
		refreshButton.style.left = "170px";
		refreshButton.style.width="110px";
		refreshButton.classList.add("btn");
		refreshButton.classList.add("third");
		refreshButton.addEventListener("click", function () {
			this._client.request_room_list();
		});
		*/
		
		_container.appendChild(cancelButton);
		//_container.appendChild(refreshButton);
		
		//_rooms_data=_data.split("-");//1+null-2+null
		
		if(!_data||_data===null)return;
		
		const _rooms_data=_data.split("-");//1+null-2+null
		for(let i=0;i<_rooms_data.length;i++){
			const _infor=_rooms_data[i].split("+");
			const _room_id=parseInt(_infor[0]);
			const _room_pass=_infor[1].trim();
			
			let _room = document.createElement("button");
			_room.innerText = "RoomID:"+_room_id;
			_room.style.width="110px";
			_room.classList.add("btn");
			_room.classList.add("third");
			
			_container.appendChild(_room);
			_room.addEventListener("click",()=>{
				this.remove_room_list_panel();
				this._client.request_join_game(_room_id,"null");
			});
		}
		
		
		this._get_room_list_fc=setInterval(()=>{
			this._client.request_room_list();
		},4000);
	}
	remove_room_infor_panel(){
		if(this._room_infor_panel&&this._room_infor_panel!=null)
			this._room_infor_panel.remove();
	}
	create_room_infor_panel(room_id,room_password){//sau khi nhan duoc thong tin create zoom success tu server
		this.remove_room_infor_panel();
		let _container=document.createElement("div");
		this._room_infor_panel=_container;
		_container.style.position="absolute";
		_container.style.width="30%";
		_container.style.height="50%";
		_container.style.top="25%";
		_container.style.left="35%";
		_container.style.border="2px #33BBFF solid";
		_container.style.borderRadius="5px";
		_container.style.backgroundColor="rgba(19, 106, 230, 0.4)";
		_container.style.boxShadow="0 0 10px 5px #33BBFF";
		_container.style.textAlign="center";
		document.body.appendChild(_container);
		let _close_fc=()=>{
			document.body.removeChild(_container);
		};
		let cancelButton = document.createElement("button");
		cancelButton.innerText = "Cancel";
		cancelButton.style.position = "absolute";
		cancelButton.style.bottom = "10px";
		cancelButton.style.left = "40%";
		cancelButton.style.width="110px";
		cancelButton.classList.add("btn");
		cancelButton.classList.add("third");
		cancelButton.addEventListener("click", function () {
			_close_fc();
			this.init(()=>{},()=>{});
		});
		_container.appendChild(cancelButton);
		
		let _roomID=document.createElement("h2");
		_roomID.innerHTML="RoomID:"+room_id;
		_roomID.style.position="absolute";
		_roomID.style.top = "10%";
		_roomID.style.left = "35%";
		_roomID.style.color="white";
		_container.appendChild(_roomID);
		
		if(room_password===null)room_password="No password";
		let _roomPass=document.createElement("h2");
		_roomPass.innerHTML="Password:"+room_password;
		_roomPass.style.position="absolute";
		_roomPass.style.bottom = "230px";
		_roomPass.style.left = "160px";
		_roomPass.style.color="white";
		//_container.appendChild(_roomPass);
		
		let _text=document.createElement("h4");
		_text.innerHTML="Waiting for opponent";
		_text.style.position="absolute";
		_text.style.top = "25%";
		_text.style.left = "35%";
		_text.style.color="white";
		_container.appendChild(_text);
		
		
		let _loading=this._game._graphics.createLoadingIcon(2);
		_loading.style.position="absolute";
		_loading.style.bottom = "80px";
		_loading.style.left = "35%";
		_container.appendChild(_loading);
	}
	
	create_auto_join_game_panel(){
		let _container=document.createElement("div");
		_container.style.position="absolute";
		_container.style.width="30%";
		_container.style.height="50%";
		_container.style.top="25%";
		_container.style.left="35%";
		_container.style.border="2px #33BBFF solid";
		_container.style.borderRadius="5px";
		_container.style.backgroundColor="rgba(19, 106, 230, 0.4)";
		_container.style.boxShadow="0 0 10px 5px #33BBFF";
		//_container.style.display="flex";
		_container.style.textAlign="center";
		document.body.appendChild(_container);
		
		
		let _close_fc=()=>{
			document.body.removeChild(_container);
		};
		
	
		let cancelButton = document.createElement("button");
		cancelButton.innerText = "Cancel";
		cancelButton.style.position = "absolute";
		cancelButton.style.bottom = "10px";
		cancelButton.style.left = "170px";
		cancelButton.style.width="110px";
		cancelButton.classList.add("btn");
		cancelButton.classList.add("third");
		cancelButton.addEventListener("click", function () {
			_close_fc();
			this.init(()=>{},()=>{});
		});
		
		_container.appendChild(cancelButton);
		
		
		let _text=document.createElement("h1");
		_text.innerHTML="Matching...";
		_text.style.position="absolute";
		_text.style.bottom = "250px";
		_text.style.left = "160px";
		_text.style.color="white";
		_container.appendChild(_text);
	
		let _loading=this._game._graphics.createLoadingIcon(1);
		_loading.style.position="absolute";
		_loading.style.bottom = "160px";
		_loading.style.left = "160px";
		_container.appendChild(_loading);
		
	}
}
export {GameModeOption}