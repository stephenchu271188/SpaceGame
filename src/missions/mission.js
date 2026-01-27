import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/loaders/GLTFLoader.js';


class Mission{
	constructor(params){
		this._params=params;
		this._game=params.game;
		
		this._mission_bonus=0;//so tien nhan duoc sau khi hoan thanh nhiem vu
		this._finished=false;
		this._unit_list=new Array();
		this._model_url_list=new Array();
		this._data_list={};
		this._remove_all_enemy_unit_as_finish=false;//sau khi hoan thanh mission co xoa bo toan bo enemy unit hay ko
	}
	load_resource(_fc){
		let _counter=0;
		
		let _loader;
		for(let i=0;i<this._model_url_list.length;i++){
			let _id=this._model_url_list[i][0];
			let _url=this._model_url_list[i][1];
			_loader= new GLTFLoader();
			_loader.load(_url,( gltf )=> {
				this._data_list[_id]=gltf;
				_counter++;
				if(_counter===this._model_url_list.length){//load complete
				
					//try{
						_fc();
						this.init();
					//}catch(e){alert(e.toString());}
					
				}
			});
		}
	}
	init(){
		this._game.hide_nav_bar();
		this.start();
	}
	start(){
		
	}
	stop(){
		
	}
	finish(params){
		if(this._finished)return;
		this._finished=true;
		
		if(this._remove_all_enemy_unit_as_finish){
			for(let i=this._unit_list.length-1;i>=0;i--){
				this._unit_list[i].SelfDestroy();
			}
		}
		this._unit_list=new Array();
		
		this._game.show_nav_bar();
	}
	add_enemy_unit(style,count,position,obj_target){
		for(let i=0;i<count;i++){
			let _eunit;
			if(style===1)
				_eunit=this._game._unitMG.create_enemy_combat_ship_level_3_style_4(position,obj_target);
			if(style===2)
				_eunit=this._game._unitMG.create_enemy_combat_ship_level_3_style_5(position,obj_target);			
			_eunit._t_min_distance=350;
			this._game._graphics.Scene.add(_eunit._model);
			//_eunit._target_object=this._navigation_ship;
			this._unit_list.push(_eunit);
		}
	}
	update(){
		
	}
	
	
}
export{Mission}