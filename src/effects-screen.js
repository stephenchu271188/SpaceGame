

class EffectsScreen{
	constructor(params){
		this._game=params.game;
	}
	show_speed_up_effect_1(_time){
		this.remove_speed_up_effect_1();
		this._speed_up_effect_1_container=document.createElement("div");
		this._speed_up_effect_1_container.classList.add("speedup-effect-root");
		this._speed_up_effect_1_container.innerHTML=`
			<div class="speedup-effect-container">
				<div class="speedup-effect-group">
					<div class="speedup-effect-item item-right"></div>
					<div class="speedup-effect-item item-left"></div>   
					<div class="speedup-effect-item item-top"></div>
					<div class="speedup-effect-item item-bottom"></div> 
					<div class="speedup-effect-item item-middle"></div>    
				</div>
			</div>
		`;
		this._game._root_div.appendChild(this._speed_up_effect_1_container);
		
		if(_time-3>0)
		this._game.add_to_timer(()=>{
			this._speed_up_effect_1_container.style.opacity="0.6";
		},_time-3);
		if(_time-2>0)
		this._game.add_to_timer(()=>{
			this._speed_up_effect_1_container.style.opacity="0.4";
		},_time-2);
		if(_time-1>0)
		this._game.add_to_timer(()=>{
			this._speed_up_effect_1_container.style.opacity="0.2";
		},_time-1);
		this._game.add_to_timer(()=>{
			this.remove_speed_up_effect_1();
		},_time);
	}
	remove_speed_up_effect_1(){
		if(this._speed_up_effect_1_container&&this._speed_up_effect_1_container!=null){
			this._speed_up_effect_1_container.remove();
			this._speed_up_effect_1_container=null;
		}
	}
}
export {EffectsScreen}