import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';

import {Planet} from './planet.js';

class Earth extends Planet{
	
	create(_position){
		//this._params.texture_url="./texture/2k_earth_daymap.png";
		this._params.radius=2400;
		this._params.position=_position;
		this._params.altitude_atmosphere=250;
		this._params.color_atmosphere=new THREE.Color(0x034d8e);
		super.create();
		
		this._params.scene.add(this.get_root());
		
		//let TEXTURE_PATH = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/123879/';
		let TEXTURE_PATH ='./texture/planet/Earth/';
		
		let geometry = new THREE.SphereGeometry( this._params.radius, 128, 128 );
		let loader = new THREE.TextureLoader();
		//loader.setCrossOrigin( 'https://s.codepen.io' );
		let texture = loader.load( TEXTURE_PATH + 'ColorMap.jpg' );

		let bump = null;
		bump = loader.load( TEXTURE_PATH + 'Bump.jpg' );
		let spec = null;
		spec = loader.load( TEXTURE_PATH + 'SpecMask.jpg' );
		
		
		//this.main_object.material.color="#ffffff";
		//this.main_object.material.shininess=5;
		this.main_object.material.map=texture;
		//this.main_object.material.specularMap=spec;
		//this.main_object.material.specular="#666666";
		this.main_object.material.bumpMap=bump;
		
		let geometryCloud = new THREE.SphereGeometry( this._params.radius + 35, 128, 128 );
		loader = new THREE.TextureLoader();
		//loader.setCrossOrigin( 'https://s.codepen.io' );
		let alpha = loader.load( TEXTURE_PATH + "alphaMap.jpg" );
		let materialCloud = new THREE.MeshPhongMaterial({
			alphaMap: alpha,
		});
		materialCloud.transparent = true;
		let sphereCloud = new THREE.Mesh( geometryCloud, materialCloud );
		this.root.add( sphereCloud );
		
		this._params.game.add_to_update_function_list((timeElapsedS)=>{
			sphereCloud.rotation.y += timeElapsedS*0.01;
		});
	}
	
}

export { Earth };