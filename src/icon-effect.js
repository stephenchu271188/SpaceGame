
class IconEffect{
	
	constructor(params){
		
		this._game=params.game;
		this._icon_list=new Array();
		this._phase=true;
		this._game.add_to_every_second_passes_fcs(()=>{
			this.update();
		});
		
	}
	
	add_icon_effect(icon,type,color1,color2){
		for(let i=0;i<this._icon_list.length;i++){
			if(this._icon_list[i][0]===icon){
				return;
			}
		}
		icon.origin_border=icon.style.border;
		icon.style.border="2px "+color1+" solid";
		this._icon_list.push([icon,type,color1,color2]);
	}
	
	remove_icon_effect(icon){
		for(let i=this._icon_list.length-1;i>=0;i--){
			if(this._icon_list[i][0]===icon){
				icon.style.border=icon.origin_border;
				this._icon_list.splice(i,1);
				return;
			}
		}
		
	}
	
	update(){
		this._phase=!this._phase;
		const _length=this._icon_list.length;
		let _item;
		for(let i=0;i<_length;i++){
			_item=this._icon_list[i];
			const _icon=_item[0];
			if(!_icon||_icon===null)continue;
			const _type=_item[1];
			if(_type===1){
				if(this._phase)_icon.style.borderColor=_item[2];
				else _icon.style.borderColor=_item[3];
			}
		}
	}
	
}
export{IconEffect}