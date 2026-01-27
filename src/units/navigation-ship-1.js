import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {SpaceShip} from '../units/space-ship.js';


class NavigationShip1 extends SpaceShip {//tàu thám hiểm
	
	constructor(params){
		params.laser_color=new THREE.Color(247, 10, 2);
		params.light_color=new THREE.Color(247, 10, 2);//engine
		params.shoot_delay=0.5;//thời gian delay giữa 2 lần bắn
		params.health=9300;
		params.damage=15;
		
		super(params);
		
		let x = 0;
		let y = 0;
		let z = 0;
		this._engine_offsets = [//vị trí của engine
			new THREE.Vector3(x,y,z)
		];
		
		
		//try{
			this.init_thruster_2();
			this.turn_on_thruster(); 
		//}catch(e){alert(e.toString());alert(e.stack);}
		
		
	}
	
	SelfDestroy(){
		super.SelfDestroy();
		this._game._graphics.Scene.remove(this.LaserBeam1.object3d);
		this._game._graphics.Scene.remove(this.LaserBeam1.pointLight);
	}
	
	//has_entered_orbit
	CheckTarget(timeInSeconds){
		//try{	//this.move_forward(timeInSeconds*120);return;
		
			if(!this.init_position&&this.Position.distanceTo(this._game._me.Position)<20){
				this.move_forward(timeInSeconds*120);
				return;
			}
			
			const _position=this.Position;
			const _target_position=this._target_object.get_world_position();
			
			//_target_position.z-=180;//để căn chỉnh cho vào giữa model
			
			if(!this.init_position){//khi chưa đi vào quỹ đạo quay quanh mục tiêu
				this.init_position=true;
				const _distanceX=110;//khoảng cách tới target object
				const _distanceY=100;
				this._first_pos=new THREE.Vector3();//vị trí ban đầu tiến lại để bắt đầu quay xung quanh target
				this._first_pos.copy(_target_position);
				this._first_pos.x+=_distanceX;
				this._first_pos.y+=_distanceY;
				/*
				this._step_num=50;
				this._step_counter=0;
				this._stepX=_position.x-this._first_pos.x;
				this._stepY=_position.y-this._first_pos.y;
				this._stepZ=_position.z-this._first_pos.z;
				*/
			}
			
			
			
			if(!this.has_entered_orbit){
				/*
				this._model.position.x+=this._stepX;
				this._model.position.y+=this._stepY;
				this._model.position.z+=this._stepZ;
				*/
				this._model.lookAt(this._first_pos);
				this._utils.translateObject(this._model,this._first_pos,timeInSeconds*120);
				const _t_distance=this.Position.distanceTo(this._first_pos);
				
				//this._step_counter++;
				//if(this._step_counter>this._step_num){
				if(_t_distance<5){
					this.has_entered_orbit=true;
					this._model.position.copy(this._first_pos);
					this.turn_off_thruster(); 
					/*
					const geometry = new THREE.SphereGeometry( 5, 32, 16 ); 
					const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
					this.sphere = new THREE.Mesh( geometry, material ); 
					this._game._graphics.Scene.add( this.sphere );
					this.sphere.position.copy(_target_position);
					*/
					
					this._object3D=new THREE.Object3D();
					this._game._graphics.Scene.add(this._object3D);
					//const _my_pos=this._game._me.Position;
					const _tpos=this.get_ahead_point(5);
					this._object3D.position.copy(this._first_pos);
					//this._object3D.position.set(_target_position.x+160,_target_position.y+45,_target_position.z);
					this._object3D.lookAt(_target_position);
					const _distance=this._object3D.position.distanceTo(_target_position);
					this._object3D.scale.z=_distance;//chiều dài của tia laser
					this.LaserBeam1 = new LaserBeam({reflectMax: 0,origin_object:this._object3D});
					this.add2Scene(this.LaserBeam1);
					
					this.after_entered_orbit();
					
				}
				return;
			}
			
			const _tpos=this._target_object.get_world_position();
			const _speed=0.3;
			this._model.lookAt(_tpos);
			this._object3D.lookAt(_tpos);
			this._utils.rotateAboutPoint(this._object3D,_tpos, 
										 this._utils.axisY, timeInSeconds*_speed, true);
			this._utils.rotateAboutPoint(this._model,_tpos, 
										 this._utils.axisY, timeInSeconds*_speed, true);
			
			
		//}catch(e){alert(e.stack);}
	}
	
	after_entered_orbit(){
		
	}
	
	add2Scene(obj) {
		this._game._graphics.Scene.add(obj.object3d);
		this._game._graphics.Scene.add(obj.pointLight);
		if (obj.reflectObject != null) {
			this.add2Scene(obj.reflectObject);
		}
	}
	rotate_about_point(point, axis, theta, pointIsWorld){
		pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

		if(pointIsWorld){
			this._model.parent.localToWorld(this._model.position); // compensate for world coordinate
		}

		this._model.position.sub(point); // remove the offset
		this._model.position.applyAxisAngle(axis, theta); // rotate the POSITION
		this._model.position.add(point); // re-add the offset

		if(pointIsWorld){
			this._model.parent.worldToLocal(this._model.position); // undo world coordinates compensation
		}
	}
}

export{NavigationShip1};
function LaserBeam(iconfig) {
    var config = {
        length: 3000,
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
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    // Texture
    var material = new THREE.MeshBasicMaterial({
        map: texture,
        blending: THREE.AdditiveBlending,
        color: 0x4444aa,
        side: THREE.DoubleSide,
        depthWrite: false,
        transparent: true
    });
    var geometry = new THREE.PlaneGeometry(1, 0.1 * 5);
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

function generateLaserBodyCanvas() {
        var canvas = document.createElement('canvas');
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
