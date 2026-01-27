import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';

//vật thể hình cầu: hành tinh, mặt trăng, sao
class SphericalGlowingObject{
	constructor(params){
		this._params=params;
		this.root=null;
	}
	
	create(){
		
		let _radius=this._params.radius;
		let _position=this._params.position;
		let _texture_url=this._params.texture_url;
		let _altitude=this._params.altitude_atmosphere;//độ cao của bầu khí quyển
		let _a_color=this._params.color_atmosphere;
		
		let parameters = {
			rotationSpeed: 0.05,
			// relative to rotation
			windSpeed: 0.005,
			c: 0,
			p: 1.35
		};

		
		let textureLoader = new THREE.TextureLoader();
		
		let texture = textureLoader.load(
			_texture_url
			//updateProgress()
		);
		
		this.root = new THREE.Group();
		let shaderPrecision = 'highp';
		//let earth_radius=1500;
		let _segments = 50;
		let _geometry = new THREE.SphereGeometry(_radius, _segments, _segments);
		let _material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			emissive: 0xffffff, // Đặt màu phát sáng của ngôi sao
			emissiveIntensity: 100.0 // Điều chỉnh độ sáng của phát sáng
		});
		let earthMesh = new THREE.Mesh(_geometry, _material);
		this.root.add(earthMesh);
		
		/*
		if(_altitude!=null){
		
		parameters.c = 0;
		parameters.p = 1.35;
		let atmosphereMaterial = new THREE.ShaderMaterial({
			precision: shaderPrecision,
			uniforms: {
				uC: { value: parameters.c },
				uP: { value: parameters.p },
				uColor: { value: _a_color },
			},
			vertexShader: `
				uniform float uC;
				uniform float uP;
				varying float vAlpha;
				void main()
				{
					vec4 viewPosition4 = modelViewMatrix * vec4(position, 1.0);
					vec3 viewPosition = viewPosition4.xyz;
					vec4 viewCameraPosition4 = viewMatrix * vec4(cameraPosition, 1.0);
					vec3 cameraDirection = normalize(viewCameraPosition4.xyz - viewPosition);
					vec3 normalDirection = normalize(normalMatrix * normal);
					float intensity = abs(min(0.0, dot(cameraDirection, normalDirection)));
					vAlpha = pow(intensity + uC, uP);
					gl_Position = projectionMatrix * viewPosition4;
				}
			`,
			fragmentShader: `
				uniform vec3 uColor;
				varying float vAlpha;
				void main()
				{
					gl_FragColor = vec4(uColor, vAlpha);
					}
				`,
			side: THREE.BackSide,
			blending: THREE.AdditiveBlending,
			transparent: true,
		});

		let atmosphereGeometry = new THREE.SphereGeometry(_radius+_altitude, 50, 50);
		let atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
		this.root.add(atmosphereMesh);
		}
	*/
		//this.params.scene.add(this.root);

		//this.root.position.set();
		this.root.position.copy(_position);
		//this.root.position.multiplyScalar(160000)
	}
	
	get_root(){
        return this.root;
    }
	
	destroy(){
		this.root.parent.remove(this.root);
	}
}

export { SphericalGlowingObject };