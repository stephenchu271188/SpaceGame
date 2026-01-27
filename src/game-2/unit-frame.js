import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
//import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/loaders/GLTFLoader.js';

class UnitFrame{
	constructor(params){
		this._params=params;
		this._game=params.game;
	}
	show_frame(obj_class,point,_fc){
		let _container=document.createElement("div");
		_container.style.position="absolute";
		_container.style.width="80%";
		_container.style.height="80%";
		_container.style.top="10%";
		_container.style.left="10%";
		_container.style.border="2px white solid";
		_container.style.borderRadius="5px";
		_container.style.backgroundColor="rgba(19, 106, 230, 0.4)";
		document.body.appendChild(_container);
		
		let closeButton = document.createElement("button");
		closeButton.innerText = "Close";
		closeButton.style.position = "absolute";
		closeButton.style.top = "10px";
		closeButton.style.right = "10px";
		
		let _close_fc=()=>{
			document.body.removeChild(_container);
			_fc();
		};
		// Thêm sự kiện click cho nút close để xóa div container
		closeButton.addEventListener("click", function () {
			_close_fc();
		});
		_container.appendChild(closeButton);
		
		let row_num=2;
		let col_num=5;
		let icon_w=100;
		let icon_h=100;
		let space_x=icon_w+20;
		let space_y=icon_h+20;
		let first_x=50;
		let first_y=50;
		
		for(let i=0;i<row_num;i++){
			for(let j=0;j<col_num;j++){
				let _icon=document.createElement("div");
				_icon.style.position="absolute";
				_icon.style.top=(i*space_y)+"px";
				_icon.style.left=(j*space_x)+"px";
				_icon.style.width=icon_w+"px";
				_icon.style.height=icon_h+"px";
				_icon.style.border="2px white solid";
				_icon.style.borderRadius="5px";
				_icon.style.backgroundColor="rgba(64, 230, 19, 0.4)";
				
				_container.appendChild(_icon);
				_icon.addEventListener("click",()=>{
					
					/*
					const geometry = new THREE.SphereGeometry( 10, 8, 8 ); 
					const material = new THREE.MeshBasicMaterial( { color: 0xF5F909  } ); 
					const sphere = new THREE.Mesh( geometry, material ); 
					obj_class.get_root().add(sphere);
					sphere.position.copy(point);
					rotate_about_point(sphere,new THREE.Vector3(0,0,0),
										new THREE.Vector3(0,1,0),
										-obj_class.get_root().rotation.y,
										false);
					*/
					let _unit_class=this._game._unitMG.create_enemy_spaceship_1(point);
					obj_class.get_root().add(_unit_class._model);
					_unit_class._model.scale.set(3,3,3);
					rotate_about_point(_unit_class._model,new THREE.Vector3(0,0,0),
										new THREE.Vector3(0,1,0),
										-obj_class.get_root().rotation.y,
										false);
					
					_close_fc();
				});
			}
		}
	}
}

function rotate_about_point(obj,point, axis, theta, pointIsWorld){
		pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

		if(pointIsWorld){
			obj.parent.localToWorld(obj.position); // compensate for world coordinate
		}

		obj.position.sub(point); // remove the offset
		obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
		obj.position.add(point); // re-add the offset

		if(pointIsWorld){
			obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
		}
	}
export {UnitFrame}