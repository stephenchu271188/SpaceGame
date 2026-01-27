import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
//import {PointerLockControls  as BasePLC} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/controls/PointerLockControls.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/controls/OrbitControls.js';

import {math} from './math.js';
import {FreePointerLockControls} from './FreePointerLockControls.js';

let clickCount = 0;
let lastClickTime = 0;


export const controls = (function() {

  class _OrbitControls {
    constructor(params) {
      this._params = params;
      this._Init(params);
    }

    _Init(params) {
      this._controls = new OrbitControls(params.camera, params.domElement);
      //this._controls.target.set(0, 0, 0);
	  this._controls.target.copy(this._params.target);
      this._controls.update();
    }

    Update() {
    }
  }

  // FPSControls was adapted heavily from a threejs example. Movement control
  // and collision detection was completely rewritten, but credit to original
  // class for the setup code.
  class _FPSControls {
    constructor(params) {
      this._cells = params.cells;
      this._Init(params);
    }

    _Init(params) {
      this._params = params;
      this._radius = 2;
      this._enabled = false;
      this._move = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        up: false,
        down: false,
      };
      this._standing = true;
      this._velocity = new THREE.Vector3(0, 0, 0);
      this._decceleration = new THREE.Vector3(-10, -10, -10);
      this._acceleration = new THREE.Vector3(15000, 15000, 15000);//speed up

      this._SetupPointerLock();

      this._controls = new FreePointerLockControls(
          params.camera, document.body);
			//this._controls.minPolarAngle = 0;
			//this._controls.maxPolarAngle = Math.PI;
			//this._controls.minAzimuthAngle = -Infinity;
			//this._controls.maxAzimuthAngle = Infinity;
      params.scene.add(this._controls.getObject());
     
		  

      //this._InitGUI();
    }
	
	

    _onKeyDown(event) {
      switch (event.keyCode) {
        case 38: // up
        case 87: // w
          this._move.forward = true;
          break;
        case 37: // left
        case 65: // a
          this._move.left = true;
          break;
        case 40: // down
        case 83: // s
          this._move.backward = true;
          break;
        case 39: // right
        case 68: // d
          this._move.right = true;
          break;
        case 33: // PG_UP
          this._move.up = true;
          break;
        case 34: // PG_DOWN
          this._move.down = true;
          break;
      }
    }

    _onKeyUp(event) {
      switch(event.keyCode) {
        case 38: // up
        case 87: // w
          this._move.forward = false;
          break;
        case 37: // left
        case 65: // a
          this._move.left = false;
          break;
        case 40: // down
        case 83: // s
          this._move.backward = false;
          break;
        case 39: // right
        case 68: // d
          this._move.right = false;
          break;
        case 33: // PG_UP
          this._move.up = false;
          break;
        case 34: // PG_DOWN
          this._move.down = false;
          break;
      }
    }

    _SetupPointerLock() {
      const hasPointerLock = (
          'pointerLockElement' in document ||
          'mozPointerLockElement' in document ||
          'webkitPointerLockElement' in document);
      if (hasPointerLock) {
        const lockChange = (event) => {
          if (document.pointerLockElement === document.body ||
              document.mozPointerLockElement === document.body ||
              document.webkitPointerLockElement === document.body ) {
            this._enabled = true;
            this._controls.enabled = true;
          } else {
            this._controls.enabled = false;
          }
        };
        const lockError = (event) => {
          console.log(event);
        };

        document.addEventListener('pointerlockchange', lockChange, false);
        document.addEventListener('webkitpointerlockchange', lockChange, false);
        document.addEventListener('mozpointerlockchange', lockChange, false);
        document.addEventListener('pointerlockerror', lockError, false);
        document.addEventListener('mozpointerlockerror', lockError, false);
        document.addEventListener('webkitpointerlockerror', lockError, false);
		
		this._event_fc=(event) => {
			this.remove_click_event();
          document.body.requestPointerLock = (
              document.body.requestPointerLock ||
              document.body.mozRequestPointerLock ||
              document.body.webkitRequestPointerLock);

          if (/Firefox/i.test(navigator.userAgent)) {
            const fullScreenChange = (event) => {
              if (document.fullscreenElement === document.body ||
                  document.mozFullscreenElement === document.body ||
                  document.mozFullScreenElement === document.body) {
                document.removeEventListener('fullscreenchange', fullScreenChange);
                document.removeEventListener('mozfullscreenchange', fullScreenChange);
                document.body.requestPointerLock();
              }
            };
            document.addEventListener(
                'fullscreenchange', fullScreenChange, false);
            document.addEventListener(
                'mozfullscreenchange', fullScreenChange, false);
            document.body.requestFullscreen = (
                document.body.requestFullscreen ||
                document.body.mozRequestFullscreen ||
                document.body.mozRequestFullScreen ||
                document.body.webkitRequestFullscreen);
            document.body.requestFullscreen();
          } else {
            document.body.requestPointerLock();
          }
        }
		
        //document.getElementById("focus-img").addEventListener('click',this._event_fc,false);
      }
    }
	
	remove_click_event(){
		//document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
		//document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
		  
		//document.getElementById("save-game-img").removeEventListener('click',this._event_fc,false);
		
		
		//document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
        //document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
		//alert("remove_click_event");
	}
    _FindIntersections(boxes, position) {
      const sphere = new THREE.Sphere(position, this._radius);

      const intersections = boxes.filter(b => {
        return sphere.intersectsBox(b);
      });

      return intersections;
    }

    Update(timeInSeconds) {
      if (!this._enabled) {
        return;
      }

      const frameDecceleration = new THREE.Vector3(
          this._velocity.x * this._decceleration.x,
          this._velocity.y * this._decceleration.y,
          this._velocity.z * this._decceleration.z
      );
      frameDecceleration.multiplyScalar(timeInSeconds);

      this._velocity.add(frameDecceleration);

      if (this._move.forward) {
        this._velocity.z -= this._acceleration.z * timeInSeconds;
      }
      if (this._move.backward) {
        this._velocity.z += this._acceleration.z * timeInSeconds;
      }
      if (this._move.left) {
        this._velocity.x -= this._acceleration.x * timeInSeconds;
      }
      if (this._move.right) {
        this._velocity.x += this._acceleration.x * timeInSeconds;
      }
      if (this._move.up) {
        this._velocity.y += this._acceleration.y * timeInSeconds;
      }
      if (this._move.down) {
        this._velocity.y -= this._acceleration.y * timeInSeconds;
      }

      const controlObject = this._controls.getObject();

      const oldPosition = new THREE.Vector3();
      oldPosition.copy(controlObject.position);

      const forward = new THREE.Vector3(0, 0, 1);
      forward.applyQuaternion(controlObject.quaternion);
      forward.normalize();

      const updown = new THREE.Vector3(0, 1, 0);

      const sideways = new THREE.Vector3(1, 0, 0);
      sideways.applyQuaternion(controlObject.quaternion);
      sideways.normalize();

      sideways.multiplyScalar(this._velocity.x * timeInSeconds);
      updown.multiplyScalar(this._velocity.y * timeInSeconds);
      forward.multiplyScalar(this._velocity.z * timeInSeconds);

      controlObject.position.add(forward);
      controlObject.position.add(sideways);
      controlObject.position.add(updown);

      oldPosition.copy(controlObject.position);
    }
  };

  class _ShipControls {
    constructor(params) {
      this._Init(params);
	  this._game=params.game;
	  this.engine_active=false;
	  this.fast_speed=180000;//van toc khi di chuyen thang? ve phia truoc
	  this.low_speed=170000;//khi re phai hay trai thi van toc tien ve phia truoc giam
	  this.go_ahead_speed=this.fast_speed;
	  this._lock=false;
	  this._stop_auto_move_ahead=false;//tu dong tien ve phia truoc ngay ca khi ko bam' phim'
	  
	  this._onKeyDown = this._onKeyDown.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);
        this._onKeyPress = this._onKeyPress.bind(this);
	 this._lock_enter_key=false;//khoa' phim' Enter	
	 this._lock_move_updown=false;
	 this._lock_roll=false;
	 this._lock_turn_backward=false;
	 this._lock_update_camera=false;
	 
	 this._lock_default_weapon=false;
	 this.lock_default_weapon=()=>{
		 this._lock_default_weapon=true;
	 };
	 this.unlock_default_weapon=()=>{
		 this._lock_default_weapon=false;
	 };
    }

    _Init(params) {
      this._params = params;
      this._radius = 2;
      this._enabled = false;
      this._move = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        up: false,
        down: false,
        rocket: false,
		fire:false
      };
      this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -1);
	  
	  this._origin_speed=100;
      this._acceleration = new THREE.Vector3(this._origin_speed, 0.2, this.go_ahead_speed);//SPEED
	  
	  this._speedX=this._acceleration.y;//toc do xoay trai/phai
	  this._speedY=this._acceleration.y;//toc do xoay len xuong

      this._params.target.Model.position.copy(this._params.camera.position);
      this._params.target.Model.quaternion.copy(this._params.camera.quaternion);
		
    }
	
	
	_destroy_event_listener(){
		
    }
	check_engine(){
		if(this.engine_active)
				{
					turn_off_engine();
				}		
				else
				{
					turn_on_engine();
				}
				//this.engine_active=!this.engine_active;
	}
	
	turn_on_engine(){
		this._move.rocket=true;
					this._params.target.activeEngine();
					this.engine_active=true;
	}
	turn_off_engine(){
		this._move.rocket=false;
					this._params.target.stopEngine();
					this.engine_active=false;
	}
	
    _onKeyPress(event){
		
		switch (event.keyCode) {
			 case 32: // SPACE
			    break;
			case 122://z 
				break;
		}
	}

    _onKeyDown(event) {
		//alert(event.keyCode);
      switch (event.keyCode) {
		   
		case 79://O
			if(this._marking_mode===true)this._game._marking();
		  break;
		case 80://P 
			if(this._marking_mode===true)this._game._print_marking_pos_list();
		  break;
		  
		case 16://SHIFT
			this._game._me.require_speedup_skill();
		  break;
		case 17://ALT
			this._game._me.require_light_shield_skill(this._game._me);
		  break;
		case 82://R 
		  this._game._me._rocket_package.require_launch_current_rocket_id();
		  break;
		case 70://F 
		  this._game._gear_box.next_gear();
		  break;
		case 67://C
		  this._game._gear_box.prev_gear();
		  break;
        case 87: // w
          if(!this._lock_move_updown)this._move.forward = true;
          break;
        case 65: // a
          this._move.left = true;
		  this.go_ahead_speed=this.low_speed;
          break;
        case 83: // s
          if(!this._lock_move_updown)this._move.backward = true;
          break;
        case 68: // d
          this._move.right = true;
		  this.go_ahead_speed=this.low_speed;
          break;
        case 81: // Q
          if(!this._lock_roll)this._move.rollLeft = true;
          break;
        case 69: // E
          if(!this._lock_roll)this._move.rollRight = true;
          break;
		case 84: //T 
			if(!this._lock_turn_backward)this._game._me.turn_backward();
		   break;
        case 13: // ENTER
          if(!this._lock_enter_key)this._move.fire = !this._move.fire;
		  break;
		case 32: // SPACE
			this._game._me.perform_skill();
					const currentTime = new Date().getTime();
					const clickDelta = currentTime - lastClickTime;
					const isDoubleClick = clickDelta < 250;
					lastClickTime = currentTime;
					if(isDoubleClick)
						this._game._me.perform_additional_skill();
          //this._move.fire = true;
		  break;
		case 86: //V 
			this._game._me.next_skill();
		  break;
        case 38: // up
		  //this._game._me.turnUp(Math.PI/2,9000,()=>{});
		  break;
        case 37: // left
		  //this._game._me.turnLeft(Math.PI/2,9000,()=>{});
		  break;
        case 40: // down
		  //this._game._me.turnDown(Math.PI/2,9000,()=>{});
		  break;
        case 39: // right
		  //this._game._me.turnRight(Math.PI/2,9000,()=>{});
          break;
      }
    }

    _onKeyUp(event) {
      switch(event.keyCode) {
        case 87: // w
          this._move.forward = false;
          break;
        case 65: // a
          this._move.left = false;
		  this.go_ahead_speed=this.fast_speed;
          break;
        case 83: // s
          this._move.backward = false;
          break;
        case 68: // d
          this._move.right = false;
		  this.go_ahead_speed=this.fast_speed;
          break;
        case 81: // Q
          this._move.rollLeft = false;
          break;
        case 69: // E
        this._move.rollRight = false;
          break;
        //case 32: // SPACE
          //this._move.rocket = false;
          //break;
        case 13: // ENTER
          //this._move.fire = false;
		  break;
		case 32: // SPACE
          //this._move.fire = false;
		  break;
        case 38: // up
        case 37: // left
        case 40: // down
        case 39: // right
          break;
      }
    }

    Update(timeInSeconds) {
		if(this._lock)return;
		
		if(this._params.target.getfuel()<=0){
			this._params.target.stopEngine();
			this._move.rocket=false;
		}
		
      const velocity = this._params.target.Velocity;
      const frameDecceleration = new THREE.Vector3(
          velocity.x * this._decceleration.x,
          velocity.y * this._decceleration.y,
          velocity.z * this._decceleration.z
      );
      frameDecceleration.multiplyScalar(timeInSeconds);

      velocity.add(frameDecceleration);
	  if(!this._stop_auto_move_ahead)
		velocity.z = -math.clamp(Math.abs(velocity.z), 25.0, 125.0);//<==tu dong tien ve phia truoc

      const controlObject = this._params.target;
      const _Q = new THREE.Quaternion();
      const _A = new THREE.Vector3();
      const _R = controlObject.Model.quaternion.clone();

      if (this._move.forward) {
        _A.set(1, 0, 0);
        _Q.setFromAxisAngle(_A, -Math.PI/2 * timeInSeconds * this._speedY);
        _R.multiply(_Q);
		
      }
      if (this._move.backward) {
        _A.set(1, 0, 0);
        _Q.setFromAxisAngle(_A, Math.PI/2 * timeInSeconds * this._speedY);
        _R.multiply(_Q);
      }
      if (this._move.left) {
        _A.set(0, 1, 0);
        _Q.setFromAxisAngle(_A, Math.PI/2 * timeInSeconds * this._speedX);
        _R.multiply(_Q);
		//this._game._entities['_radar'].rotate_radar_1(Math.PI/2 * timeInSeconds * this._acceleration.y);
      }
      if (this._move.right) {
        _A.set(0, 1, 0);
        _Q.setFromAxisAngle(_A, -Math.PI/2 * timeInSeconds * this._speedX);
        _R.multiply(_Q);
		//this._game._entities['_radar'].rotate_radar_1(-Math.PI/2 * timeInSeconds * this._acceleration.y);
      }
      if (this._move.rollLeft) {
        _A.set(0, 0, -1);
        _Q.setFromAxisAngle(_A, -Math.PI * timeInSeconds * this._acceleration.y);
        _R.multiply(_Q);
      }
      if (this._move.rollRight) {
        _A.set(0, 0, -1);
        _Q.setFromAxisAngle(_A, Math.PI * timeInSeconds * this._acceleration.y);
        _R.multiply(_Q);
      }
      if (this._move.rocket) {//di chuyen ve phia truoc
        velocity.z -= this._acceleration.x * timeInSeconds;
		//this._params.game._sound.play2('thruster2');
		this._params.game._sound.play_player_ship_thruster_sound();
      }

      controlObject.Model.quaternion.copy(_R);

      const oldPosition = new THREE.Vector3();
      oldPosition.copy(controlObject.Model.position);

      const forward = new THREE.Vector3(0, 0, 1);
      forward.applyQuaternion(controlObject.Model.quaternion);
      forward.normalize();

      const updown = new THREE.Vector3(0, 1, 0);

      const sideways = new THREE.Vector3(1, 0, 0);
      sideways.applyQuaternion(controlObject.Model.quaternion);
      sideways.normalize();

      sideways.multiplyScalar(velocity.x * timeInSeconds);
      updown.multiplyScalar(velocity.y * timeInSeconds);
      forward.multiplyScalar(velocity.z * timeInSeconds);

      controlObject.Model.position.add(forward);
      controlObject.Model.position.add(sideways);
      controlObject.Model.position.add(updown);
      controlObject._velocity.copy(velocity);

      oldPosition.copy(controlObject.Model.position);

      this.UpdateCamera(timeInSeconds,velocity);
      
  
      if (this._move.fire) {
		if(!this._lock_default_weapon)
			this._params.target.Fire();
      }
    }
	
	UpdateCamera(timeInSeconds,velocity){
		
		if(this._lock_update_camera)return;
		
	  const offsetFactor = (-velocity.z - 25.0) / 100.0;
      const offset = new THREE.Vector3(0, 4, math.smootherstep(offsetFactor, 10.0, 15.0));
      offset.applyQuaternion(this._params.camera.quaternion);

      this._params.camera.quaternion.slerp(this._params.target.Model.quaternion, timeInSeconds * 2.0);
  
      const position = new THREE.Vector3();
      position.copy(this._params.target.Model.position);
      position.add(offset);
  
      this._params.camera.position.copy(position);
      this._params.camera.updateProjectionMatrix();
  }
  
  UpdateCamera_2(timeInSeconds,velocity){
	  if(this._lock_update_camera)return;
	  
	  if(!this._camera_altitude){
		  this._min_altitude=160;
		  this._max_altitude=400;
		  this._camera_altitude=this._min_altitude;
	  }
	  
	  const position = new THREE.Vector3();
      position.copy(this._params.target.Model.position);
	  position.y+=this._camera_altitude;
	  this._params.camera.position.copy(position);
	  this._params.camera.lookAt(this._params.target.Model.position);
	  
  }
  UpdateCamera_3(timeInSeconds,velocity){
	  if(this._lock_update_camera)return;
	  
	  this._params.camera.position.copy(this._params.target.getBackAbovePos(20,20));
	  this._params.camera.lookAt(this._params.target.getFrontPos(20));
	  
  }
  changeCameraAltitude(_percent){
	  this._camera_altitude=this._min_altitude+Math.floor(_percent*this._max_altitude/100);
	  
  }
  
  };
	
	
  
	
	
   class _EnemyShipControls {
    constructor(params) {
      this._Init(params);
	  this._lock=false;
    }

    _Init(params) {
      this._params = params;
      this._radius = 2;
      this._enabled = false;
      this._move = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        up: false,
        down: false,
        rocket: false,
      };
      this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -1);
      this._acceleration = new THREE.Vector3(100, 0.5, 25000);

      this._params.target._model.position.copy(this._params.camera.position);
      this._params.target._model.quaternion.copy(this._params.camera.quaternion);

      //document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
      //document.addEventListener('keyup', (e) => this._onKeyUp(e), false);

      //this._InitGUI();
    }
	
	_destroy_event_listener(){
        //document.removeEventListener('keydown', this.keydownEventListener, false);
        //document.removeEventListener('keyup', this.keyupEventListener, false);
    }

    

    _onKeyDown(event) {
      switch (event.keyCode) {
        
        case 38: // up
			//this._move.forward = true;
			break;
        case 37: // left
			//this._move.left = true;
			break;
        case 40: // down
			//this._move.backward = true;
            break;
        case 39: // right
			//this._move.right = true;
			break;
          
      }
    }

    _onKeyUp(event) {
      switch(event.keyCode) {
        
        case 38: // up
			//this._move.forward = false;
			break;
        case 37: // left
			//this._move.left = false;
			break;
        case 40: // down
			//this._move.backward = false;
			break;
        case 39: // right
			//this._move.right = false;
			break;
          
      }
    }

    Update(timeInSeconds) {
		if(this._lock)return;
		
      const velocity = this._params.target.Velocity;
      const frameDecceleration = new THREE.Vector3(
          velocity.x * this._decceleration.x,
          velocity.y * this._decceleration.y,
          velocity.z * this._decceleration.z
      );
      frameDecceleration.multiplyScalar(timeInSeconds);

      velocity.add(frameDecceleration);
      velocity.z = -math.clamp(Math.abs(velocity.z), 0.0001, 0.0001);

      const controlObject = this._params.target;
      const _Q = new THREE.Quaternion();
      const _A = new THREE.Vector3();
      const _R = controlObject._model.quaternion.clone();

      if (this._move.forward) {
        _A.set(1, 0, 0);
        _Q.setFromAxisAngle(_A, -Math.PI * timeInSeconds * this._acceleration.y);
        _R.multiply(_Q);
		
      }
      if (this._move.backward) {
        _A.set(1, 0, 0);
        _Q.setFromAxisAngle(_A, Math.PI * timeInSeconds * this._acceleration.y);
        _R.multiply(_Q);
      }
      if (this._move.left) {
        _A.set(0, 1, 0);
        _Q.setFromAxisAngle(_A, Math.PI * timeInSeconds * this._acceleration.y);
        _R.multiply(_Q);
      }
      if (this._move.right) {
        _A.set(0, 1, 0);
        _Q.setFromAxisAngle(_A, -Math.PI * timeInSeconds * this._acceleration.y);
        _R.multiply(_Q);
      }
      if (this._move.rollLeft) {
        _A.set(0, 0, -1);
        _Q.setFromAxisAngle(_A, -Math.PI * timeInSeconds * this._acceleration.y);
        _R.multiply(_Q);
      }
      if (this._move.rollRight) {
        _A.set(0, 0, -1);
        _Q.setFromAxisAngle(_A, Math.PI * timeInSeconds * this._acceleration.y);
        _R.multiply(_Q);
      }
      if (this._move.rocket) {
        velocity.z -= this._acceleration.x * timeInSeconds;
		this._params.game._sound.play('thruster');
      }

      controlObject._model.quaternion.copy(_R);

      const oldPosition = new THREE.Vector3();
      oldPosition.copy(controlObject._model.position);

      const forward = new THREE.Vector3(0, 0, 1);
      forward.applyQuaternion(controlObject._model.quaternion);
      forward.normalize();

      const updown = new THREE.Vector3(0, 1, 0);

      const sideways = new THREE.Vector3(1, 0, 0);
      sideways.applyQuaternion(controlObject._model.quaternion);
      sideways.normalize();

      sideways.multiplyScalar(velocity.x * timeInSeconds);
      updown.multiplyScalar(velocity.y * timeInSeconds);
      forward.multiplyScalar(velocity.z * timeInSeconds);

      controlObject._model.position.add(forward);
      controlObject._model.position.add(sideways);
      controlObject._model.position.add(updown);
      controlObject._velocity.copy(velocity);

      oldPosition.copy(controlObject._model.position);

      // Now place the camera in relation
      const offsetFactor = (-velocity.z - 25.0) / 100.0;
      const offset = new THREE.Vector3(0, 4, math.smootherstep(offsetFactor, 10.0, 15.0));
      offset.applyQuaternion(this._params.camera.quaternion);

      this._params.camera.quaternion.slerp(this._params.target._model.quaternion, timeInSeconds * 2.0);
  
      const position = new THREE.Vector3();
      position.copy(this._params.target._model.position);
      position.add(offset);
  
      this._params.camera.position.copy(position);
      this._params.camera.updateProjectionMatrix();
	
      if (this._move.fire) {
        this._params.target.Fire();
      }
    }
  }	
	
	
 class _HumanControls{
	 constructor(params) {
      this._Init(params);
    }

    _Init(params) {
      this._params = params;
      this._radius = 2;
      this._enabled = false;
      this._move = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        up: false,
        down: false,
        rocket: false,
      };
      this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -1);
      this._acceleration = new THREE.Vector3(100, 0.5, 250000);
		
      this._params.target.Model.position.copy(this._params.camera.position);
      this._params.target.Model.quaternion.copy(this._params.camera.quaternion);

    }
	
    _onKeyDown(event) {
		
      switch (event.keyCode) {
        //case 90://z
				//this._params.game._ChangeMode();
        case 38: // up
				this._move.rocket=true;
				this._params.target.PlayHumanAnimation();
			break;
        case 37: // left
				this._move.left = true;
				this._params.target.PlayHumanAnimation();
			break;
        case 40: // down
				//this._params.target.PlayHumanAnimation();
            break;
        case 39: // right
				this._move.right = true;
				this._params.target.PlayHumanAnimation();
			break;
          
      }
    }

    _onKeyUp(event) {
      switch(event.keyCode) {
        
        case 38: // up
			this._move.rocket=false;
			this._params.target.StopHumanAnimation();
			break;
        case 37: // left
			this._move.left = false;
			this._params.target.StopHumanAnimation();
			break;
        case 40: // down
			this._params.target.StopHumanAnimation();
			break;
        case 39: // right
			this._move.right = false;
			this._params.target.StopHumanAnimation();
			break;
          
      }
    }
	
	_onKeyPress(event){
		switch (event.keyCode) {
        case 122://z
				//this._params.game._ChangeMode();
				break;
		}
	}

    Update(timeInSeconds) {
      const velocity = this._params.target.Velocity;
      const frameDecceleration = new THREE.Vector3(
          velocity.x * this._decceleration.x,
          velocity.y * this._decceleration.y,
          velocity.z * this._decceleration.z
      );
      frameDecceleration.multiplyScalar(timeInSeconds);

      velocity.add(frameDecceleration);
      //velocity.z = -math.clamp(Math.abs(velocity.z), 25.0, 125.0);

      const controlObject = this._params.target;
      const _Q = new THREE.Quaternion();
      const _A = new THREE.Vector3();
      const _R = controlObject.Model.quaternion.clone();

      if (this._move.forward) {
        _A.set(1, 0, 0);
        _Q.setFromAxisAngle(_A, -Math.PI * timeInSeconds * this._acceleration.y);
        _R.multiply(_Q);
		
      }
      if (this._move.backward) {
        _A.set(1, 0, 0);
        _Q.setFromAxisAngle(_A, Math.PI * timeInSeconds * this._acceleration.y);
        _R.multiply(_Q);
      }
      if (this._move.left) {
        _A.set(0, 1, 0);
        _Q.setFromAxisAngle(_A, Math.PI * timeInSeconds * this._acceleration.y);
        _R.multiply(_Q);
      }
      if (this._move.right) {
        _A.set(0, 1, 0);
        _Q.setFromAxisAngle(_A, -Math.PI * timeInSeconds * this._acceleration.y);
        _R.multiply(_Q);
      }
      if (this._move.rollLeft) {
        _A.set(0, 0, -1);
        _Q.setFromAxisAngle(_A, -Math.PI * timeInSeconds * this._acceleration.y);
        _R.multiply(_Q);
      }
      if (this._move.rollRight) {
        _A.set(0, 0, -1);
        _Q.setFromAxisAngle(_A, Math.PI * timeInSeconds * this._acceleration.y);
        _R.multiply(_Q);
      }
      if (this._move.rocket) {
        velocity.z -= this._acceleration.x * timeInSeconds;
		//this._params.game._sound.play('thruster');
      }

      controlObject.Model.quaternion.copy(_R);

      const oldPosition = new THREE.Vector3();
      oldPosition.copy(controlObject.Model.position);

      const forward = new THREE.Vector3(0, 0, 1);
      forward.applyQuaternion(controlObject.Model.quaternion);
      forward.normalize();

      const updown = new THREE.Vector3(0, 1, 0);

      const sideways = new THREE.Vector3(1, 0, 0);
      sideways.applyQuaternion(controlObject.Model.quaternion);
      sideways.normalize();

      sideways.multiplyScalar(velocity.x * timeInSeconds);
      updown.multiplyScalar(velocity.y * timeInSeconds);
      forward.multiplyScalar(velocity.z * timeInSeconds);

      controlObject.Model.position.add(forward);
      controlObject.Model.position.add(sideways);
      controlObject.Model.position.add(updown);
      controlObject._velocity.copy(velocity);

      oldPosition.copy(controlObject.Model.position);

      // Now place the camera in relation
      const offsetFactor = (-velocity.z - 25.0) / 100.0;
      const offset = new THREE.Vector3(0, 4, math.smootherstep(offsetFactor, 10.0, 15.0));
      offset.applyQuaternion(this._params.camera.quaternion);

      this._params.camera.quaternion.slerp(this._params.target.Model.quaternion, timeInSeconds * 2.0);
  
      const position = new THREE.Vector3();
      position.copy(this._params.target.Model.position);
      position.add(offset);
  
      this._params.camera.position.copy(position);
      this._params.camera.updateProjectionMatrix();
  
      if (this._move.fire) {
        this._params.target.Fire();
      }
    }
  
 }
	
	
	
	
  return {
    ShipControls: _ShipControls,
	EnemyShipControls: _EnemyShipControls,
    FPSControls: _FPSControls,
    OrbitControls: _OrbitControls,
	HumanControls: _HumanControls
  };
})();
