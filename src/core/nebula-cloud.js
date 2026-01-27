import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';

class NebulaCloud{
	constructor(params){
		this._game=params.game;
		
		this.init();
	}
	
	init(){
		this.cloudParticles = [];
		let loader = new THREE.TextureLoader();
		let cloudGeo,cloudMaterial;
		let scene=this._game._graphics.Scene;
		
		this.flash = new THREE.PointLight(0x062d89, 30, 500, 1.7);
		this.flash.position.set(9200, 300, 100);
		scene.add(this.flash);
		
	loader.load(
		"https://static.vecteezy.com/system/resources/previews/010/884/548/original/dense-fluffy-puffs-of-white-smoke-and-fog-on-transparent-background-abstract-smoke-clouds-movement-blurred-out-of-focus-smoking-blows-from-machine-dry-ice-fly-fluttering-in-air-effect-texture-png.png",
		(texture)=> {
			cloudGeo = new THREE.PlaneBufferGeometry(500, 500);
			cloudMaterial = new THREE.MeshLambertMaterial({
				map: texture,
				transparent: true
			});

			for (let p = 0; p < 25; p++) {
				let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
				cloud.position.set(
					Math.random() * 800 - 400,
					500,
					Math.random() * 500 - 450
				);
				
				cloud.position.x+=9000;
				
				cloud.rotation.x = 1.16;
				cloud.rotation.y = -0.12;
				cloud.rotation.z = Math.random() * 360;
				cloud.material.opacity = 0.6;
				this.cloudParticles.push(cloud);
				scene.add(cloud);
				
				//7500,100,-500
				
				
				//cloud.rotation.y+=Math.PI/2;
			}
			
		}
	);
	
		this._game.add_to_update_function_list(()=>{
			this.cloudParticles.forEach((p) => {
				p.rotation.z -= 0.002;
				//p.lookAt(this._game._me.Position);
			});
			if (Math.random() > 0.93 || this.flash.power > 100) {
				if (this.flash.power < 100)
				this.flash.position.set(Math.random() * 400, 300 + Math.random() * 200, 100);
				this.flash.power = 50 + Math.random() * 500;
			}
		});
	}
}
export {NebulaCloud}