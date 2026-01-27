import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';

class EffectsTexture{
	constructor(params){
		this._game=params.game;
		
		this._plane=null;
	}
	
	remove_plane(){
		if(this._plane!=null){
			this._game._graphics.Scene.remove(this._plane);
		}
	}
	
	create_plane(_time){
		
		this.remove_plane();
		
		const geometry = new THREE.PlaneGeometry( 300, 300 );
		
		let _gif=document.createElement("img");
		_gif.src="./resources/gif/wormhole4.webp";
		let sup2 = new SuperGif({ gif: _gif } );
		sup2.load();
		var gifCanvas = sup2.get_canvas();
		
		let material = new THREE.MeshBasicMaterial();
		material.map = new THREE.Texture( gifCanvas );
		material.displacementMap = material.map;
		
		material.transparent=true;
		
		this._plane = new THREE.Mesh( geometry, material );
		this._game._graphics.Scene.add( this._plane );
		
		const _pos=this._game._me.get_back_point(190);
		this._plane.position.copy(_pos);
		
		let _update_fc=()=>{
			//material.displacementScale = 200;
			material.map.needsUpdate = true;
			material.displacementMap.needsUpdate = true;
			this._plane.lookAt(this._game._me.Position);
			
			const _pos=this._game._me.get_back_point(140);
			this._plane.position.copy(_pos);
		};
		
		this._game.add_to_update_function_list(()=>{
			_update_fc();
		});
		
		this._game.add_to_timer(()=>{
			material.opacity=0.6;
		},3);
		this._game.add_to_timer(()=>{
			material.opacity=0.4;
		},4);
		this._game.add_to_timer(()=>{
			material.opacity=0.3;
		},5);
		this._game.add_to_timer(()=>{
			material.opacity=0.2;
		},6);
		this._game.add_to_timer(()=>{
			material.opacity=0.1;
		},7);
		this._game.add_to_timer(()=>{
			this._game.remove_function_from_update_list(_update_fc);
			this.remove_plane();
		},8);
	}
	
	create_worm_hole(){
		this.create_plane();
	}
}
export {EffectsTexture}