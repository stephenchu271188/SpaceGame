import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import Stats from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/libs/stats.module.js';
import {WEBGL} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/WebGL.js';

import {OutlinePass} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/postprocessing/OutlinePass.js';
import {RenderPass} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/postprocessing/RenderPass.js';
import {ShaderPass} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/postprocessing/ShaderPass.js';
import {CopyShader} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/shaders/CopyShader.js';
import {FXAAShader} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/shaders/FXAAShader.js';
import {EffectComposer} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/postprocessing/EffectComposer.js';

import {UnrealBloomPass} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/postprocessing/UnrealBloomPass.js';

import { CSS2DRenderer, CSS2DObject } from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/renderers/CSS2DRenderer.js';


import {scattering_shader} from './scattering-shader.js';

import {Planet} from './core/planet.js';
import {Earth} from './core/earth.js';
import {Sun} from './core/sun.js';
import {Satellite} from './core/satellite.js';

export const graphics = (function() {

  function _GetImageData(image) {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    const context = canvas.getContext( '2d' );
    context.drawImage(image, 0, 0);

    return context.getImageData(0, 0, image.width, image.height);
  }

  function _GetPixel(imagedata, x, y) {
    const position = (x + imagedata.width * y) * 4;
    const data = imagedata.data;
    return {
        r: data[position],
        g: data[position + 1],
        b: data[position + 2],
        a: data[position + 3]
    };
  }

  class _Graphics {
    constructor(game) {
		this._game=game;
    }
	

    Initialize() {
      if (!WEBGL.isWebGL2Available()) {
        return false;
      }

	  	this._standardW=1536;
		this._standardH=743;
		this._CheckScreenDimension();
		
		this._stopGlowing=false;

      this.canvas = document.createElement('canvas');
      const context = this.canvas.getContext('webgl2', {alpha: false});
	  
	  this._labelRenderer=null;
	  
      this._threejs = new THREE.WebGLRenderer({
        canvas: this.canvas,
        context: context,
      });
      this._threejs.setPixelRatio(window.devicePixelRatio);
      this._threejs.setSize(window.innerWidth, window.innerHeight);
      this._threejs.autoClear = false;

      const target = document.getElementById('target');
      if(target!=null)target.appendChild(this._threejs.domElement);

      this._stats = new Stats();
      //target.appendChild(this._stats.dom);

      window.addEventListener('resize', () => {
        this._OnWindowResize();
      }, false);

      const fov = 60;
      //const aspect = 1920 / 1080;
	  const aspect=(window.innerWidth) / (window.innerHeight);
      const near = 0.1;
      const far = 100000.0;
      this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      this._camera.position.set(9500,0,-500);

      this._scene = new THREE.Scene();
      this._scene.background = new THREE.Color(0xaaaaaa);

      const renderPass = new RenderPass(this._scene, this._camera);
      const fxaaPass = new ShaderPass(FXAAShader);
      const scatterPass = new ShaderPass(scattering_shader.Shader);
      const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight));
      bloomPass.threshold = 1.5;
      bloomPass.strength = 2.5;
      bloomPass.radius = 0.3;
      bloomPass.exposure = 1.5;

	  this._renderPass=renderPass;
      this._bloomPass = bloomPass;
      this._fxassPass = fxaaPass;
      // this.scatterPass = depthPass;
      this._fxassPass.setSize(window.innerWidth, window.innerHeight);
      this._bloomPass.setSize(window.innerWidth, window.innerHeight);
	  this._outlinePass=new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this._scene, this._camera);
		this._outlinePass.edgeStrength = 10;
		this._outlinePass.edgeGlow = 1;
		this._outlinePass.edgeThickness = 3;
		this._outlinePass.pulsePeriod = 0;
		this._outlinePass.hiddenEdgeColor = new THREE.Color(0xF71009);
		this._outlinePass.visibleEdgeColor = new THREE.Color(0x14F609);


      this._composer = new EffectComposer(this._threejs);
      this._composer.addPass(renderPass);
	 // this._composer.addPass(this._outlinePass);
	  //this._composer.addPass(bloomPass);
      // this._composer.addPass(fxaaPass);
      // this._composer.addPass(scatterPass);
      //this._composer.addPass();
      this._composer.renderToScreen = true;
      //this._composer.addPass(depthPass);

      function _CreateBuffer() {
		  
        const buf = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
        buf.texture.format = THREE.RGBAFormat;
        buf.texture.type = THREE.FloatType;
        buf.texture.minFilter = THREE.NearestFilter;
        buf.texture.magFilter = THREE.NearestFilter;
        buf.texture.generateMipmaps = false;
        buf.stencilBuffer = false;
        buf.depthBuffer = true;
        buf.depthTexture = new THREE.DepthTexture();
        buf.depthTexture.format = THREE.DepthFormat;
        buf.depthTexture.type = THREE.FloatType;
        return buf;
      }

      this._targets = [_CreateBuffer(), _CreateBuffer()];

      this._postCamera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
      this.scatterPass = new THREE.ShaderMaterial( {
        vertexShader: scattering_shader.VS,
        fragmentShader: scattering_shader.PS,
        uniforms: {
          cameraNear: { value: this.Camera.near },
          cameraFar: { value: this.Camera.far },
          cameraPosition: { value: this.Camera.position },
          cameraForward: { value: null },
          tDiffuse: { value: null },
          tDepth: { value: null },
          inverseProjection: { value: null },
          inverseView: { value: null },
          planetPosition: { value: null },
          planetRadius: { value: null },
          atmosphereRadius: { value: null },
        }
      } );
      var postPlane = new THREE.PlaneBufferGeometry( 2.5, 2.5 );//gia tri cang cao thi zoom cang gan
	  //let t_material = new THREE.MeshBasicMaterial()
      var postQuad = new THREE.Mesh( postPlane, this.scatterPass );
      this._postScene = new THREE.Scene();
      this._postScene.add(postQuad);
	  

      //this._CreateLights();
	 
	  return true;
    }
	
	create_center_div(){
		this.center_div=document.createElement("div");
		this.center_div.style.zIndex="99";
		//this.center_div.style.display="flex";
		//this.center_div.style.justifyContent="center";
		//this.center_div.style.alignItems="center";
		this.center_div.style.position="absolute";
		this.center_div.style.width="100px";
		this.center_div.style.height="100px";
		this.center_div.style.left="50%";
		this.center_div.style.top="50%";
		this.center_div.style.transform="translate(-50%, -50%)";
		this.center_div.style.backgroundImage="url('resources/triangle-2.png')";
		this.center_div.style.backgroundSize="contain";
		this.center_div.style.backgroundRepeat="no-repeat";
		this.center_div.style.backgroundPosition="center";
		document.body.appendChild(this.center_div);
	}
	
	getPositionInFrontOfCamera(distance) {//lay toa do diem phia truoc camera
        const direction = new THREE.Vector3();
        this.Camera.getWorldDirection(direction);
        const positionInFront = new THREE.Vector3();
        positionInFront.copy(this.Camera.position).add(direction.multiplyScalar(distance));
        return positionInFront;
    }
	
	createTextureBackground(_url){
		let _graphics=this;
		const loader = new THREE.TextureLoader();
		loader.load(_url, function(texture) {
			try{
			_graphics.Scene.background = texture;
			}catch(e){alert(e.stack);}
		});
		
	}
	
	createGradientBackground(){
		const gradientTexture = this.createGradientTexture_1('black','purple');
        this.Scene.background = gradientTexture;
	}
	
	createGradientTexture_1(_color1,_color2) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 512;

        const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, _color1); 
        gradient.addColorStop(1, _color2); 

        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        return texture;
    }
	
	addAxis(){
		this._scene.add(new THREE.AxisHelper( 100 ));
		var CANVAS_WIDTH = 200;
		var CANVAS_HEIGHT = 200;
		this.arrowRenderer = new THREE.WebGLRenderer( { alpha: true } ); // clear
		this.arrowRenderer.setClearColor( 0x000000, 0 );
		this.arrowRenderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT );
		var arrowCanvas = document.getElementById("axis-container").appendChild( this.arrowRenderer.domElement );
		arrowCanvas.setAttribute('id', 'arrowCanvas');
		arrowCanvas.style.width = CANVAS_WIDTH;
		arrowCanvas.style.height = CANVAS_HEIGHT;
		arrowCanvas.style.position="absolute";
		arrowCanvas.style.right="0px";
		arrowCanvas.style.bottom="0px";
		this.arrowScene = new THREE.Scene();
		this.arrowCamera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );
		this.arrowCamera.up = this._camera.up; // important!
		var arrowPos = new THREE.Vector3( 0,0,0 );
		this.arrowScene.add( new THREE.ArrowHelper( new THREE.Vector3( 1,0,0 ), arrowPos, 90, 0x7F2020, 20, 15 ) );
		this.arrowScene.add( new THREE.ArrowHelper( new THREE.Vector3( 0,1,0 ), arrowPos, 90, 0x207F20, 20, 15 ) );
		this.arrowScene.add( new THREE.ArrowHelper( new THREE.Vector3( 0,0,1 ), arrowPos, 90, 0x20207F, 20, 15 ) );
		
		this._game.add_to_update_function_list(()=>{
			this.arrowCamera.position.copy( this._camera.position );
			if(this._game._entities["player"])
				this.arrowCamera.position.sub( this._game._entities["player"]._model.position );
			this.arrowCamera.position.setLength( 300 );
			this.arrowCamera.lookAt( this.arrowScene.position );
			this.arrowRenderer.render( this.arrowScene, this.arrowCamera );
		});
	}
	
	getMaxZIndex(){//lay zindex cao nhat
		var elements = document.body.getElementsByTagName('*');
		var maxZIndex = 0;
		for (var i = 0; i < elements.length; i++) {
			var zIndex = parseInt(window.getComputedStyle(elements[i]).zIndex);
			maxZIndex = Math.max(maxZIndex, zIndex);
		}
		return maxZIndex+1;
	}
	
	
	createLoadingIcon(style){
		let loading=document.createElement("div");
		if(style===1)loading.innerHTML=`
			<section class="talign-center">
				<div class="spinner spinner--steps icon-spinner" aria-hidden="true"></div>
			</section>
		`;
		if(style===2)loading.innerHTML=`
			<section class="talign-center">
				<div class="spinner icon-spinner-2" aria-hidden="true"></div>
			</section>
		`;
		if(style===3)loading.innerHTML=`
			<section class="talign-center">
				<div class="spinner icon-spinner-3" aria-hidden="true"></div>
			</section>
		`;
		if(style===4)loading.innerHTML=`
			<section class="talign-center">
				<div class="spinner icon-spinner-4" aria-hidden="true"></div>
			</section>
		`;
		if(style===5)loading.innerHTML=`
			<section class="talign-center">
				<div class="spinner icon-spinner-5" aria-hidden="true"></div>
			</section>
		`;
		if(style===6)loading.innerHTML=`
			<section class="talign-center">
				<div class="spinner icon-spinner-6" aria-hidden="true"></div>
			</section>
		`;
		if(style===7)loading.innerHTML=`
			<section class="talign-center">
				<div class="spinner spinner--steps2 icon-spinner-7" aria-hidden="true"></div>
			</section>
		`;
		
		return loading;
	}
	createLoadingScreen(_style){
		
		document.body.style.display="flex";//<================
		
		let _container=document.createElement("div");
		//_container.classList.add("loadingScreenContainer");
		_container.style.position="absolute";
		_container.style.stop="0px";
		_container.style.left="0px";
		_container.style.width=this._standardW+"px";
		_container.style.height=this._standardH+"px";
		_container.style.backgroundColor="black";
		
		let _scale=()=>{
			_container.style.transformOrigin="0px 0px";
			let _scaleX=parseFloat(window.innerWidth/this._standardW);
			let _scaleY=parseFloat(window.innerHeight/this._standardH);
			_container.style.transform="scale("+_scaleX+","+_scaleY+")";
			_container.style.stop="0px";
			_container.style.left="0px";
		};
		_scale();
		window.addEventListener('resize', () => {
			_scale();
	    }, false);
		
		
		if(_style===1)
			_container.innerHTML=`
				<div class="spinner-box" style="position:absolute;top:50%;left:50%;transform: translate(-50%, -50%);">
				<div class="blue-orbit leo">
				</div>

				<div class="green-orbit leo">
				</div>
  
				<div class="red-orbit leo">
				</div>
  
				<div class="white-orbit w1 leo">
				</div><div class="white-orbit w2 leo">
				</div><div class="white-orbit w3 leo">
				</div>
				</div>
			`;
		if(_style===2)
			_container.innerHTML=`
				<div class="spinner-box" style="position:absolute;top:50%;left:50%;transform: translate(-50%, -50%);">
				<div class="leo-border-1">
				<div class="leo-core-1"></div>
				</div> 
				<div class="leo-border-2">
				<div class="leo-core-2"></div>
				</div> 
				</div>
			`;
		if(_style===3)
			_container.innerHTML=`
				<div class="spinner-box" style="position:absolute;top:50%;left:50%;transform: translate(-50%, -50%);">
				<div class="configure-border-1">  
				<div class="configure-core"></div>
				</div>  
				<div class="configure-border-2">
				<div class="configure-core"></div>
				</div> 
				</div>
			`;
		if(_style===4)
			_container.innerHTML=`
				<div class="spinner-box" style="position:absolute;top:50%;left:50%;transform: translate(-50%, -50%);">
				<div class="pulse-container">  
				<div class="pulse-bubble pulse-bubble-1"></div>
				<div class="pulse-bubble pulse-bubble-2"></div>
				<div class="pulse-bubble pulse-bubble-3"></div>
				</div>
				</div>
			`;
		document.body.appendChild(_container);
		this._loading_screen=_container;
		return _container;
	}
	removeLoadingScreen(){
		if(this._loading_screen)
			this._loading_screen.remove();
		document.body.style.display="";//<================(xoa)
	}
	
	create_divider(_parent,_color){//màng chắn
		this.remove_divider();
	
		this._divider=document.createElement("div");
		this._divider.style.position="absolute";
		this._divider.style.width="100%";
		this._divider.style.height="100%";
		this._divider.style.top="0px";
		this._divider.style.left="0px";
		this._divider.style.backgroundColor=_color;
		this._divider.style.zIndex=""+this.getMaxZIndex();
		
		_parent.appendChild(this._divider);
	}
	remove_divider(){
		if(this._divider&&this._divider!=null){
			this._divider.remove();
			this._divider=null;
		}
	}
	
	enable_CSS2D_Renderer(_container){
		this._labelRenderer = new CSS2DRenderer();
		this._labelRenderer.setSize( window.innerWidth, window.innerHeight );
		this._labelRenderer.domElement.style.position = 'absolute';
		this._labelRenderer.domElement.style.top = '0px';
		this._labelRenderer.domElement.style.zIndex=0;
		_container.appendChild( this._labelRenderer.domElement );
		
		return this._labelRenderer;
	}
	
	create_laser(_color,_parent_obj){
		this.clean_all_laser();
		for(let i=0;i<this._lasers.length;i++){
			const _item=this._lasers[i];
			if(_item[0]===_color){
				const _laser=_item[1];
				if(_laser._using===false){
					_laser._using=true;
					_laser.visible=true;
					if(!_laser._added){
						_laser._added=true;
						if(_parent_obj!=null){
							this.Scene.add(obj.object3d);
							this.Scene.add(obj.pointLight);
						}
						else
							this.add2Scene(_laser);
					}
					return _item;
				}
			}
		}
		return null;
	}
	/*
		Do cac enemy-photon-ship sau khi chet da return cac laser nhung 
		chua ro nguyen nhan vi sao ko return dc het nen su dung function nay
		de check unit dang su dung cac laser, tia laser nao co unit ko ton tai
		hoac da bi tiet diet thi clean lai
		Nhung unit nao su dung function nay phai gan thuoc tinh unit cho laser
		
		VD: simple-photon-ship-2.js
	*/
	clean_all_laser(){
		for(let i=0;i<this._lasers.length;i++){
			const _laser=this._lasers[i][1];
			if(_laser._unit&&_laser._unit!=null)
				if(_laser._unit.Dead&&_laser._using===true){
					_laser._using=false;
					_laser._unit=null;
					this._lasers[i][2].change_color(_laser._origin_color);
				}
		}
		
	}
	remove_laser(_laser){
		//_laser._using=false;
		
		for(let i=0;i<this._lasers.length;i++){
			const _item=this._lasers[i];
			if(_item[1]===_laser||_item[2]===_laser){
				//_item[1].scale.z=0;
				_item[1].visible=false;
				_item[1]._using=false;//alert("FOUND");
			}
		}
		
	}
	
	show_laser(_laser){
		for(let i=0;i<this._lasers.length;i++){
			const _item=this._lasers[i];
			if(_item[1]===_laser||_item[2]===_laser){
				//_item[1].scale.z=0;
				_item[1].visible=true;
				_item[1]._using=true;//alert("FOUND");
			}
		}
	}
	hide_laser(_laser){
		//_laser._using=false;
		
		for(let i=0;i<this._lasers.length;i++){
			const _item=this._lasers[i];
			if(_item[1]===_laser||_item[2]===_laser){
				//_item[1].scale.z=0;
				_item[1].visible=false;
				//_item[1]._using=false;//alert("FOUND");
			}
		}
		
	}
	
	init_lasers(_num1,_num2){//tao san de su dung sau
		this._lasers=new Array();
		let _l_num1=80;
		let _l_num2=15;
		if(_num1!=null)_l_num1=_num1;
		if(_num2!=null)_l_num2=_num2;
		
		for(let i=0;i<_l_num1;i++){
			const _white=new THREE.Object3D();
			_white._added=false;
			this.Scene.add(_white);
			let _laser1 = new LaserBeam({reflectMax: 0,origin_object:_white});
			_white._using=false;//co dang su dung khong
		    _white._origin_color="white";
			this._lasers.push(['white',_white,_laser1]);
		}
		for(let i=0;i<_l_num2;i++){
			const _purple=new THREE.Object3D();
			_purple._added=false;
			this.Scene.add(_purple);
			let _laser1 = new LaserBeam({reflectMax: 0,origin_object:_purple});
			_laser1.change_color("purple");
			_purple._using=false;//co dang su dung khong
			_purple._origin_color="purple";
			this._lasers.push(['purple',_purple,_laser1]);
		}
		
		for(let i=0;i<24;i++){//su dung rieng cho player
			const _purple=new THREE.Object3D();
			_purple._added=false;
			this.Scene.add(_purple);
			//this._game._me._model.add(_purple);
			let _laser1 = new LaserBeam({reflectMax: 0,origin_object:_purple});
			_laser1.change_color("white");
			_purple._using=false;//co dang su dung khong
			_purple._origin_color="white";
			this._lasers.push(['player',_purple,_laser1]);
		}
	}
	
	add2Scene(obj) {
		this.Scene.add(obj.object3d);
		this.Scene.add(obj.pointLight);
		if (obj.reflectObject != null) {
			this.add2Scene(obj.reflectObject);
		}
	}
	
  create_demo_planets(){
	  let _earth=new Earth({scene: this.Scene,game:this._game});
	  _earth.create(new THREE.Vector3(2000,300,-8000));
	  
	  
	  let _moon=new Satellite({game:this._game,scene: this.Scene,radius:500,position:new THREE.Vector3(5000,0,-8000),
					altitude_atmosphere:null,
					texture_url:"./texture/moonmap1k.jpg",
					color_atmosphere:new THREE.Color(0x034d8e)});
	  _moon.create();
	  this.Scene.add(_moon.get_root());

	  
	  
	  let _mars=new Planet({scene: this.Scene,radius:1000,
					position:new THREE.Vector3(13000,2000,8000),
					altitude_atmosphere:100,
					texture_url:"./texture/planet/HabitableWorldsPack/Savannah.png",
					color_atmosphere:new THREE.Color(0xF50909),game:this._game});
	  _mars.create({});
	  this.Scene.add(_mars.get_root());
	  this._game._entities['_mars']=_mars;
					
	  let _neptune=new Planet({scene: this.Scene,radius:2000,position:new THREE.Vector3(6000,0,6000),
					altitude_atmosphere:100,
					texture_url:"./texture/planet/HabitableWorldsPack/Tropical.png",
					//texture_url:"./texture/planet/InhospitableWorldsPack/Martian.png",
					//texture_url:"./texture/planet/TerrestrialWorldsPack/Terrestrial1.png",
					//texture_url:"./texture/planet/GasWorldsPack/Gaseous2.png",
					//texture_url:"./texture/planet/CloudsPack/Clouds4.png",
					//texture_url:"./texture/planet/Terrestrial-EQUIRECTANGULAR-1-1024x512.png",
					color_atmosphere:new THREE.Color(0x034d8e)});
	  _neptune.create();
	  this.Scene.add(_neptune.get_root());
	  this._game._entities['_neptune']=_neptune;
	  
	  let _demoplanet1=new Planet({scene: this.Scene,radius:3000,
					position:new THREE.Vector3(17429,1647,-4970),
					altitude_atmosphere:100,
					texture_url:"./texture/planet/HabitableWorldsPack/Tropical.png",
					color_atmosphere:new THREE.Color(0xF50909),game:this._game});
	  _demoplanet1.create({});
	  this.Scene.add(_demoplanet1.get_root());
	  
	  
	  
	  let _demoplanet2=new Planet({scene: this.Scene,radius:3000,
					position:new THREE.Vector3(-20,11557,-400),
					altitude_atmosphere:100,
					texture_url:"./texture/planet/InhospitableWorldsPack/Icy.png",
					color_atmosphere:new THREE.Color(0xF50909),game:this._game});
	  _demoplanet2.create({});
	  this.Scene.add(_demoplanet2.get_root());
  }
	
	_ClearScene(){
		while (this._scene.children.length > 0) {
			var child = this._scene.children[0];
			this._scene.remove(child);
		}
	}

    _CreateLights() {
		
      let light = new THREE.DirectionalLight(0xFFFFFF, 1);
      light.position.set(100, 100, -100);
      light.target.position.set(0, 0, 0);
      light.castShadow = false;
      this._scene.add(light);

      light = new THREE.DirectionalLight(0x404040, 1);
      light.position.set(100, 100, -100);
      light.target.position.set(0, 0, 0);
      light.castShadow = false;
      this._scene.add(light);

      light = new THREE.DirectionalLight(0x404040, 1);
      light.position.set(100, 100, -100);
      light.target.position.set(0, 0, 0);
      light.castShadow = false;
      this._scene.add(light);

      light = new THREE.DirectionalLight(0x202040, 1);
      light.position.set(100, -100, 100);
      light.target.position.set(0, 0, 0);
      light.castShadow = false;
      this._scene.add(light);

    }
	_AddAmbientLight(){
		let light = new THREE.AmbientLight(0xFFFFFF, 1.0);
		this._scene.add(light);
	}
	
	_CheckScreenDimension(){
		if(window.innerWidth>this._standardW){
			let _scale=this._standardW/window.innerWidth;
			document.body.style.transform="scale("+_scale+")";
		}
	}

    _OnWindowResize() {
      this._camera.aspect = window.innerWidth / window.innerHeight;
      this._camera.updateProjectionMatrix();
      this._threejs.setSize(window.innerWidth, window.innerHeight);
      this._composer.setSize(window.innerWidth, window.innerHeight);
      this._targets[0].setSize(window.innerWidth, window.innerHeight);
      this._targets[1].setSize(window.innerWidth, window.innerHeight);
      this._bloomPass.setSize(window.innerWidth, window.innerHeight);
      this._fxassPass.setSize(window.innerWidth, window.innerHeight);
    }

    get Scene() {
      return this._scene;
    }

    get Camera() {
      return this._camera;
    }
	get Renderer(){
		return this._threejs;
	}

    Render(timeInSeconds) {//update
      const forward = new THREE.Vector3();
      this._camera.getWorldDirection(forward);

      let src = this._targets[0];
      let dst = this._targets[1];
      let tmp = null;

      let firstDepth = dst;

	  if(!this._stopGlowing){
		   this._threejs.autoClearDepth = false;
		   this._threejs.setRenderTarget(dst);
           this._threejs.clear();
	  }
     
	  
	  //Luan phien render
      this._threejs.render(this._scene, this._camera);
	  
	  if(!this._stopGlowing){
		  this._threejs.setRenderTarget(null);
		  this._bloomPass.render(this._threejs, src, dst, timeInSeconds, false);
	      //this._composer.render();
	      //this._outlinePass.render(timeInSeconds);	
		
		  if(this.scatterPass.uniforms.planetRadius.value===null){
			this.scatterPass.uniforms.inverseProjection.value = this._camera.projectionMatrixInverse;
			this.scatterPass.uniforms.inverseView.value = this._camera.matrixWorld;
			this.scatterPass.uniforms.tDiffuse.value = dst.texture;
			this.scatterPass.uniforms.tDepth.value = firstDepth.depthTexture;
			this.scatterPass.uniforms.cameraNear.value = this._camera.near;
			this.scatterPass.uniforms.cameraFar.value = this._camera.far;
			this.scatterPass.uniforms.cameraPosition.value = this._camera.position;
			this.scatterPass.uniforms.cameraForward.value = forward;
			this.scatterPass.uniforms.planetPosition.value = new THREE.Vector3(0, 0, 0);
			this.scatterPass.uniforms.planetRadius.value = 4000.0;
			this.scatterPass.uniforms.atmosphereRadius.value = 4400.0;
			this.scatterPass.uniformsNeedUpdate = true;
	      }
	  
		  this._threejs.setRenderTarget(null);
          this._threejs.render(this._postScene, this._postCamera);
	  }
      
	 
	  if(this._labelRenderer!=null){
		  this._labelRenderer.render(this._scene, this._camera);
	  }

      this._stats.update();
    }
  }

  return {
    Graphics: _Graphics,
    GetPixel: _GetPixel,
    GetImageData: _GetImageData,
  };
})();



function LaserBeam(iconfig) {
    var config = {
        length: 30000,
        reflectMax: 0
    };
    if (iconfig) {
        for (var prop in iconfig) {
            if (iconfig.hasOwnProperty(prop)) {
                config[prop] = iconfig[prop];
            }
        }
    }
	if(iconfig.origin_object)
		this.object3d = iconfig.origin_object;
	else
		this.object3d = new THREE.Object3D();
	
    this.reflectObject = null;
    this.pointLight = new THREE.PointLight(0xffffff, 1, 4);
    var raycaster = new THREE.Raycaster();
    var canvas = generateLaserBodyCanvas();
    //var texture = new THREE.Texture(canvas);
	const texture = new THREE.TextureLoader().load( "texture/laser.png" );
    texture.needsUpdate = true;

    // Texture
    var material = new THREE.MeshBasicMaterial({
        map: texture,
        blending: THREE.AdditiveBlending,
        color: 0xffffff,
        side: THREE.DoubleSide,
        depthWrite: false,
        transparent: true
    });
    var geometry = new THREE.PlaneGeometry(1, 0.1 * 120);//parameter thu 2 la chieu rong cua tia laser
    geometry.rotateY(0.5 * Math.PI);

    // Use planes to simulate laserbeam
    var i, nPlanes = 15;
    for (i = 0; i < nPlanes; i++) {
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = 1 / 2;
        mesh.rotation.z = i / nPlanes * Math.PI;
        this.object3d.add(mesh);
    }

    if (config.reflectMax > 0) {
        this.reflectObject = new LaserBeam({
            length: config.length,
            reflectMax: config.reflectMax - 1
        });
    }
	
	this.change_color=function(_color){
		const _col=new THREE.Color(_color);
		
		for(let i=0;i<this.object3d.children.length;i++){
			const _obj=this.object3d.children[i];
			_obj.material.color=_col;
		}
	}

    this.intersect = function (direction, objectArray = []) {
        raycaster.set(
            this.object3d.position.clone(),
            direction.clone().normalize()
        );

        var intersectArray = [];
        intersectArray = raycaster.intersectObjects(objectArray, true);
		
        if (intersectArray.length > 0) {
            this.object3d.scale.z = intersectArray[0].distance;
            this.object3d.lookAt(intersectArray[0].point.clone());
            this.pointLight.visible = true;

            var normalMatrix = new THREE.Matrix3().getNormalMatrix(intersectArray[0].object.matrixWorld);
            var normalVector = intersectArray[0].face.normal.clone().applyMatrix3(normalMatrix).normalize();

            this.pointLight.position.x = intersectArray[0].point.x + normalVector.x * 0.5;
            this.pointLight.position.y = intersectArray[0].point.y + normalVector.y * 0.5;
            this.pointLight.position.z = intersectArray[0].point.z + normalVector.z * 0.5;

            var reflectVector = new THREE.Vector3(
                intersectArray[0].point.x - this.object3d.position.x,
                intersectArray[0].point.y - this.object3d.position.y,
                intersectArray[0].point.z - this.object3d.position.z
            ).normalize().reflect(normalVector);

            if (this.reflectObject != null) {
                this.reflectObject.object3d.visible = true;
                this.reflectObject.object3d.position.set(
                    intersectArray[0].point.x,
                    intersectArray[0].point.y,
                    intersectArray[0].point.z
                );
                this.reflectObject.intersect(reflectVector.clone(), objectArray);
            }
        } else {
            this.object3d.scale.z = config.length;
            this.pointLight.visible = false;
            this.object3d.lookAt(
                this.object3d.position.x + direction.x,
                this.object3d.position.y + direction.y,
                this.object3d.position.z + direction.z
            );
            this.hiddenReflectObject();
        }
    };

    this.hiddenReflectObject = function () {
        if (this.reflectObject != null) {
            this.reflectObject.object3d.visible = false;
            this.reflectObject.pointLight.visible = false;
            this.reflectObject.hiddenReflectObject();
        }
    };

}
let canvas;
function generateLaserBodyCanvas() {
        canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.width = 1;
        canvas.height = 64;
        var gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(  0,  0,  0,0.1)');
        gradient.addColorStop(0.1, 'rgba(160,160,160,0.3)');
        gradient.addColorStop(0.5, 'rgba(55, 240, 9,0.5)');//màu của laser
        gradient.addColorStop(0.9, 'rgba(160,160,160,0.3)');
        gradient.addColorStop(1.0, 'rgba(  0,  0,  0,0.1)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        return canvas;
    }
function change_laser_color(color){
	return;
	var context = canvas.getContext('2d');
	var gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(  0,  0,  0,0.1)');
        gradient.addColorStop(0.1, 'rgba(160,160,160,0.3)');
        gradient.addColorStop(0.5, color);//màu của laser
        gradient.addColorStop(0.9, 'rgba(160,160,160,0.3)');
        gradient.addColorStop(1.0, 'rgba(  0,  0,  0,0.1)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
}