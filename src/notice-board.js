
let _unique_id=0;
class NoticeBoard{
	constructor(params){
		this._game=params.game;
		this._message_list=new Array();
		
		this._game.add_to_every_second_passes_fcs(()=>{
			this.check_time();
		});
	}
	show(){
		this._container.style.visibility="visible";
	}
	hide(){
		this._container.style.visibility="hidden";
	}
	init(){
		if(this._container)return;
		
		this._container=document.createElement("div");
		this._container.style.position="absolute";
		this._container.style.width="20%";
		this._container.style.top="40%";
		this._container.style.left="3%";
		this._container.style.textAlign="left";
		this._container.style.fontFamily=" 'Orbitron', sans-serif";
		//this._container.style.display="flex";
		//this._container.style.backgroundColor="rgba(23, 223, 226, 0.2)";
		
		document.body.appendChild(this._container);
		
		const line_num=10;
		let _size=16;
		this.line_list=new Array();
		for(let i=0;i<line_num;i++){
			const _line=document.createElement("div");
			_line.style.color="white";
			_line.style.fontSize=_size+"px";
			//_size-=1;
			_line.style.textAlign="left";
			//_line.style.textShadow="0 0 7px #fff,0 0 10px #fff,0 0 21px #fff,0 0 42px #0fa,0 0 82px #0fa,0 0 92px #0fa,0 0 102px #0fa,0 0 151px #0fa";
			//_line.innerHTML="LINE";
			this._container.appendChild(_line);
			//const _br=document.createElement("br");
			//this._container.appendChild(_br);
			
			this.line_list.push(_line);
		}
		//alert(this.line_list.length);
	}
	get_unique_id(){
		let _rs=_unique_id;
		_unique_id++;
		return _rs;
	};
	add_message(_message,_delay,_callback){
		const _ms_id=this.get_unique_id();
		this._message_list.push({id:_ms_id,message:_message,time:performance.now(),delay:_delay,callback:_callback});
		//alert(this._message_list.length);
		this.update_message();
		
		return _ms_id;
	}
	clear_message(_id){
		for(let i=this._message_list.length-1;i>=0;i--){
			if(this._message_list[i].id===_id){
				this._message_list.splice(i,1);
				return true;
			}
		}
		return false;
	}
	update_message(){
		if(this.line_list.length<this._message_list.length){
			this._message_list.splice(0,1);
		}
		for(let i=0;i<this.line_list.length;i++){
			const _line=this.line_list[i];
			if(i<this._message_list.length)
				_line.innerHTML=this._message_list[i].message;
			else
				_line.innerHTML="";
		}
		
	}
	check_time(){
		const _time1=performance.now();
		for(let i=this._message_list.length-1;i>=0;i--){
			const _time2=this._message_list[i].time;
			let _delay=this._message_list[i].delay;
			if(_delay===null)_delay=4000;
			let _callback=this._message_list[i].callback;
			if(_time1-_time2>_delay){
				if(_callback!=null)_callback();
				this._message_list.splice(i,1);
			}
		}
		this.update_message();
	}
}
export{NoticeBoard}