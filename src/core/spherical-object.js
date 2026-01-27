import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';

//vật thể hình cầu: hành tinh, mặt trăng, sao
class SphericalObject{
	static _next_id = 0;
	static incrementNextID() {
		SphericalObject._next_id++;
    };
	
	constructor(params){
		this._params=params;
		//this.root=null;
		this.root = new THREE.Group();
		this._is_spherical_entity=true;
		this._after_create_function_list=new Array();
	}
	
	add_to_after_create_function_list(_fc){
		this._after_create_function_list.push(_fc);
	}
	remove_function_from_after_create_list(_fc){
		  for(let i=this._after_create_function_list.length-1;i>=0;i--){
			if(this._after_create_function_list[i]===_fc){
				this._after_create_function_list.splice(i,1);
			}
		}
	}
	clear_after_create_function_list(){
		  this._after_create_function_list=new Array();
	}
	
	
	get_next_id(){
		SphericalObject.incrementNextID();
		return "_spherical_object_"+SphericalObject._next_id;
	}
	Update(){//for update entities call from game loop
		
	}
	update(){
		
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
		let texture=null;
		
		if(_texture_url!=null)//ko muon load texture thi cho bang null
		texture = textureLoader.load(
			_texture_url
			//updateProgress()
		);
		
		//this.root = new THREE.Group();
		
		let shaderPrecision = 'highp';
		//let earth_radius=1500;
		let _segments = 45;
		let _geometry = new THREE.SphereGeometry(_radius, _segments, _segments);
		
		let _material = new THREE.MeshPhongMaterial({
			//precision: shaderPrecision,
			map: texture,
			//specularMap: specularTexture,
			//specular: new THREE.Color(0x111111),
			//shininess: 25,
			//displacementScale: 0.03,
		});
		
		//let _material = new THREE.MeshBasicMaterial({
			//map: texture,
		//});
		let earthMesh = new THREE.Mesh(_geometry, _material);
		this.root.add(earthMesh);
		this.root.my_class=this;
		earthMesh.my_class=this;
		this.main_object=earthMesh;
		
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

		let atmosphereGeometry = new THREE.SphereGeometry(_radius+_altitude, 25, 25);
		this.atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
		this.root.add(this.atmosphereMesh);
		}

		//this.params.scene.add(this.root);

		//this.root.position.set();
		this.root.position.copy(_position);
		//this.root.position.multiplyScalar(160000)
		
		let _next_id=this.get_next_id();
		this._sphere_id=_next_id;
		
		if(this._params.game&&this._params.game._entities){
			this._params.game._entities[this._sphere_id]=this;
		}
		
		for(let i=0;i<this._after_create_function_list.length;i++){
			this._after_create_function_list[i]();
		}
	}
	
	remove_atmosphere(){
		this.root.remove(this.atmosphereMesh);
	}
	
	get_radius(){
		return this._params.radius;
	}
	
	get_root(){
        return this.root;
    }
	get_position(){
		return this.root.position;
	}
	get_world_position(){
		let _rs=new THREE.Vector3()
		this.root.getWorldPosition(_rs);
		return _rs;
	}
	rotateX(theta){
		this.root.rotation.x+=theta;
	}
	rotateY(theta){
		this.root.rotation.y+=theta;
	}
	rotateZ(theta){
		this.root.rotation.z+=theta;
	}
	
	destroy(){
		this.root.parent.remove(this.root);
		if(this._params.game&&this._params.game._entities){
			delete this._params.game._entities[this._sphere_id];
		}
		
	}
	
	rotate_about_point(point, axis, theta, pointIsWorld){
		pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

		if(pointIsWorld){
			this.root.parent.localToWorld(this.root.position); // compensate for world coordinate
		}

		this.root.position.sub(point); // remove the offset
		this.root.position.applyAxisAngle(axis, theta); // rotate the POSITION
		this.root.position.add(point); // re-add the offset

		if(pointIsWorld){
			this.root.parent.worldToLocal(this.root.position); // undo world coordinates compensation
		}
	}
}

export { SphericalObject };