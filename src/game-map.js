import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/loaders/GLTFLoader.js';


class GameMap{
	constructor(params){
		this._params=params;
		this._game=params.game;
		
		this._data_list={};
		this._root=new THREE.Object3D();
		this._game._graphics.Scene.add(this._root);
		this._root.position.set(0,0,0);
		
		this._raycaster = new THREE.Raycaster();
		
		this._scale_val=null;
	}
	
	load_data(_id,_fc){
		let _map_model_file;
		this._path_list=new Array();
		if(_id===1){
			_map_model_file="snowy_mountain_v2";
			this._scale_val=4000;
			this._path_list.push([{x:999815,y:1973,z:128},{x:998867,y:1913,z:794},{x:996081,y:2151,z:1439},{x:992920,y:2553,z:3199},{x:992331,y:2644,z:3915},{x:993707,y:2657,z:7778},{x:996667,y:2386,z:8731},{x:998209,y:2186,z:7767}]);
			this._path_list.push([{x:999204,y:1686,z:3616},{x:1000371,y:1434,z:5671},{x:1002991,y:1089,z:6591},{x:1004798,y:892,z:5893},{x:1005818,y:806,z:4051}]);
			this._path_list.push([{x:1010402,y:1267,z:731},{x:1011800,y:994,z:-6},{x:1012040,y:1171,z:-2814},{x:1012730,y:1309,z:-3470},{x:1014659,y:1145,z:-4426},{x:1016835,y:1101,z:-3313}]);
			this._path_list.push([{x:1020351,y:-306,z:20593},{x:1021480,y:-426,z:22699},{x:1023098,y:-299,z:24638},{x:1025264,y:55,z:26618},{x:1028999,y:176,z:26964},{x:1031578,y:-1,z:26019},{x:1032941,y:-221,z:22763},{x:1030994,y:-142,z:20367}]);
			const near = 6000;
			const far = 15000;
			const color = 'lightblue';
			this._game._graphics.Scene.background = new THREE.Color( color );
			this._game._graphics.Scene.fog = new THREE.Fog(color, near, far);
			
			this._player_init_pos=new THREE.Vector3(1012579,564,2196);//22579
			this._bound_radius=35000;
		}
		if(_id===2){
			_map_model_file="green_island";
			this._scale_val=60000;
			this._path_list.push([{x:999815,y:1973,z:128},{x:998867,y:1913,z:794},{x:996081,y:2151,z:1439},{x:992920,y:2553,z:3199},{x:992331,y:2644,z:3915},{x:993707,y:2657,z:7778},{x:996667,y:2386,z:8731},{x:998209,y:2186,z:7767}]);
			this._path_list.push([{x:999204,y:1686,z:3616},{x:1000371,y:1434,z:5671},{x:1002991,y:1089,z:6591},{x:1004798,y:892,z:5893},{x:1005818,y:806,z:4051}]);
			this._path_list.push([{x:1010402,y:1267,z:731},{x:1011800,y:994,z:-6},{x:1012040,y:1171,z:-2814},{x:1012730,y:1309,z:-3470},{x:1014659,y:1145,z:-4426},{x:1016835,y:1101,z:-3313}]);
			const near = 6000;
			const far = 15000;
			const color = 'lightblue';
			this._game._graphics.Scene.background = new THREE.Color( color );
			this._game._graphics.Scene.fog = new THREE.Fog(color, near, far);
			
			this._player_init_pos=new THREE.Vector3(1012579,564,2196);
			this._bound_radius=35000;
		}
		if(_id===3){
			_map_model_file="sketch_background_terrain";
			this._scale_val=60000;
			this._path_list.push([{x:999815,y:1973,z:128},{x:998867,y:1913,z:794},{x:996081,y:2151,z:1439},{x:992920,y:2553,z:3199},{x:992331,y:2644,z:3915},{x:993707,y:2657,z:7778},{x:996667,y:2386,z:8731},{x:998209,y:2186,z:7767}]);
			this._path_list.push([{x:999204,y:1686,z:3616},{x:1000371,y:1434,z:5671},{x:1002991,y:1089,z:6591},{x:1004798,y:892,z:5893},{x:1005818,y:806,z:4051}]);
			this._path_list.push([{x:1010402,y:1267,z:731},{x:1011800,y:994,z:-6},{x:1012040,y:1171,z:-2814},{x:1012730,y:1309,z:-3470},{x:1014659,y:1145,z:-4426},{x:1016835,y:1101,z:-3313}]);
			const near = 6000;
			const far = 15000;
			const color = 'lightblue';
			this._game._graphics.Scene.background = new THREE.Color( color );
			this._game._graphics.Scene.fog = new THREE.Fog(color, near, far);
			
			this._player_init_pos=new THREE.Vector3(1012579,564,2196);
			this._bound_radius=35000;
		}
		//try{
		const _new_path_list=this._game._utils.shuffle_array(this._path_list);
		this._path_list=_new_path_list;
		//}catch(e){alert(e.stack);}
		this._url_list=[
			["terrain-1","./resources/models/Terrain/"+_map_model_file+"/scene.gltf"],
		];
		
		let _url_list=this._url_list;
		
		let _counter=0;
		
		let _loader;
		for(let i=0;i<_url_list.length;i++){
			let _id=_url_list[i][0];
			let _url=_url_list[i][1];
			_loader= new GLTFLoader();
			_loader.load(_url,( gltf )=> {
				this._data_list[_id]=gltf;
				_counter++;
				if(_counter===_url_list.length){//load complete
					_fc();
				}
			});
		}
		
	}
	//rocky_path scale:3000
	//terrain_2 scale:1
	//snowy-terrain scale: 20000, y-1000
	init(_position){
		
		//model.scale.setScalar(this._scale_val);
		let gltf=this._data_list["terrain-1"];
		const model = gltf.scene.children[0];
		model.scale.setScalar(this._scale_val);
		//model.rotation.y=Math.PI;
		//model.rotation.z=Math.PI;
		model.position.y-=1000;
		
		this._root.add(model);
		this._root.position.copy(_position);
		
		//return;
		
			
	}
	
	get_min_max_coordinates(){
		const _rs=this.calculateMinMaxCoordinates(this._root);
		return _rs;
	}
	
	get_enemy_ship_path(_id){
		
		let _rs;
		if(_id<this._path_list.length)
			_rs=this._path_list[_id];
		else
			_rs=this._path_list[0];
		
		if(Math.random() >= 0.5)_rs.reverse();//xác xuất 50% đảo ngược mảng
		
		if(Math.random() >= 0.5){//xác xuất 50% add thêm 1 điểm nữa vào giữa 2 điểm
			let _new_rs=new Array();
			for(let i=0;i<_rs.length;i++){
				_new_rs.push(_rs[i]);
				if(i>0&&i%2===0&&i+1<_rs.length-1){//lấy trung điểm ở giữa 2 điểm rồi tăng chiều cao (y+=...)
					const _mid=this._game._utils.findMidpoint(_rs[i],_rs[i+1]);
					_mid.y+=this._game._utils.get_random_in_range(10,70);
					_new_rs.push(_mid);
				}
			}
			
			_rs=_new_rs;
		}
		
		return _rs;
	}
	
	check_collision(){
		
		const _distance_to_ground=20;
		
		const _pos1=this._game._me.Position;
		const _pos2=this._game._me.get_bellow_point();
		const _direction=new THREE.Vector3();
			  _direction.subVectors( _pos2, _pos1 ).normalize();
			  this._raycaster.set(_pos1,_direction);
        
		const _intersections = this._raycaster.intersectObjects([this._root],true);
		if(_intersections.length > 0){
				const intersect_point=_intersections[0].point;
				const distance=_pos1.distanceTo(intersect_point);
				if(distance<_distance_to_ground){
					//this._game._me.SelfDestroy();
					this._game._StopGame(false);
					this._game.add_to_timer(()=>{
						//this._game._StopGame(false);
					},3);
					
				}								
		}
		
	}
	
	calculateMinMaxCoordinates(model) {//tinh' toan' cac diem cao nhat, thap nhat,.... cua map model
		let minY = Infinity, maxY = -Infinity;
		let minX = Infinity, maxX = -Infinity;
		let minZ = Infinity, maxZ = -Infinity;

		let minYPoint = null, maxYPoint = null;
		let minXPoint = null, maxXPoint = null;
		let minZPoint = null, maxZPoint = null;
		let scale=this._scale_val;
		model.traverse((child) => {
        if (child.isMesh) {
            child.geometry.computeBoundingBox();
            const boundingBox = child.geometry.boundingBox;

            if (boundingBox.min.y * scale < minY) {
                minY = boundingBox.min.y * scale;
                minYPoint = new THREE.Vector3(
                    (boundingBox.min.x + boundingBox.max.x) / 2 * scale,
                    boundingBox.min.y * scale,
                    (boundingBox.min.z + boundingBox.max.z) / 2 * scale
                );
            }
            if (boundingBox.max.y * scale > maxY) {
                maxY = boundingBox.max.y * scale;
                maxYPoint = new THREE.Vector3(
                    (boundingBox.min.x + boundingBox.max.x) / 2 * scale,
                    boundingBox.max.y * scale,
                    (boundingBox.min.z + boundingBox.max.z) / 2 * scale
                );
            }
            if (boundingBox.min.x * scale < minX) {
                minX = boundingBox.min.x * scale;
                minXPoint = new THREE.Vector3(
                    boundingBox.min.x * scale,
                    (boundingBox.min.y + boundingBox.max.y) / 2 * scale,
                    (boundingBox.min.z + boundingBox.max.z) / 2 * scale
                );
            }
            if (boundingBox.max.x * scale > maxX) {
                maxX = boundingBox.max.x * scale;
                maxXPoint = new THREE.Vector3(
                    boundingBox.max.x * scale,
                    (boundingBox.min.y + boundingBox.max.y) / 2 * scale,
                    (boundingBox.min.z + boundingBox.max.z) / 2 * scale
                );
            }
            if (boundingBox.min.z * scale < minZ) {
                minZ = boundingBox.min.z * scale;
                minZPoint = new THREE.Vector3(
                    (boundingBox.min.x + boundingBox.max.x) / 2 * scale,
                    (boundingBox.min.y + boundingBox.max.y) / 2 * scale,
                    boundingBox.min.z * scale
                );
            }
            if (boundingBox.max.z * scale > maxZ) {
                maxZ = boundingBox.max.z * scale;
                maxZPoint = new THREE.Vector3(
                    (boundingBox.min.x + boundingBox.max.x) / 2 * scale,
                    (boundingBox.min.y + boundingBox.max.y) / 2 * scale,
                    boundingBox.max.z * scale
                );
            }
        }
    });
		
		return { 
				min_y:minY, 
				max_y:maxY, 
				min_x:minX, 
				max_x:maxX, 
				min_z:minZ, 
				max_z:maxZ, 
				min_y_point:minYPoint, 
				max_y_point:maxYPoint, 
				min_x_point:minXPoint, 
				max_x_point:maxXPoint, 
				min_z_point:minZPoint, 
				max_z_point:maxZPoint };
	}
}

export {GameMap}