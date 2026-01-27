import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/loaders/GLTFLoader.js';


let _player_ship_model;

class EditModeCenter{
	constructor(params){
		this._game=params.game;
		
		this._dom_container=document.body;
		
		this._3d_objects=new Array();
	}
	
	show_main_button(){
		let _btn = document.createElement("button");
		_btn.classList.add("btn");
		_btn.classList.add("third");
		_btn.innerText = "Edition Panel";
		_btn.style.position = "absolute";
		_btn.style.top = "110px";
		_btn.style.left = "0px";
		_btn.style.width="170px";
		_btn.addEventListener("click",()=>{
			this.create_main_panel();
		});
		
		this._dom_container.appendChild(_btn);
	}
	
	create_main_panel(){
		let _container=document.createElement("div");
		_container.style.position="absolute";
		_container.style.width="100%";
		_container.style.height="100%";
		_container.style.top="0%";
		_container.style.left="0%";
		_container.style.border="2px #33BBFF solid";
		_container.style.borderRadius="5px";
		_container.style.backgroundColor="rgba(19, 106, 230, 0.4)";
		_container.style.boxShadow="0 0 10px 5px #33BBFF";
		//_container.style.display="flex";
		_container.style.textAlign="center";
		this._dom_container.appendChild(_container);
		
		let closeButton = document.createElement("button");
		closeButton.innerText = "X";
		closeButton.style.position = "absolute";
		closeButton.style.top = "10px";
		closeButton.style.right = "10px";
		
		let _close_fc=()=>{
			this._dom_container.removeChild(_container);
		};
		
		closeButton.addEventListener("click", function () {
			_close_fc();
		});
		
		let _edit_player_ship_model_btn = document.createElement("button");
		_edit_player_ship_model_btn.classList.add("btn");
		_edit_player_ship_model_btn.classList.add("third");
		_edit_player_ship_model_btn.innerText = "PlayerShipModel";
		_edit_player_ship_model_btn.style.position = "absolute";
		_edit_player_ship_model_btn.style.top = "110px";
		_edit_player_ship_model_btn.style.left = "300px";
		_edit_player_ship_model_btn.style.width="170px";
		_edit_player_ship_model_btn.addEventListener("click",()=>{
			_close_fc();
			
			let files,file,reader;
			
			let onFileLoaded=(e)=>{
				
				let folderName = file.webkitRelativePath.split('/')[0];
				let _gltf_file = files.find(file => file.name.toLowerCase().endsWith('.gltf'));
				if(!_gltf_file)
					return false;
				
				var match = /^data:(.*);base64,(.*)$/.exec(e.target.result);
				if (match == null) {
					throw 'Could not parse result'; // should not happen
				}
				var mimeType = match[1];//type of file
				var content = match[2];//content in file
				//alert(mimeType);
				//alert(content);
				
				let fileUrl = URL.createObjectURL(file);//url cua file
				
				let _fileName=file.name;
				//alert(_fileName);
				let _url="./resources/models/space-ship/"+folderName+"/scene.gltf";
				//alert("URL="+_url);
				this.load_model(_fileName,_url,(_model)=>{
					this._change_player_ship_model(_model);
					this._game._gui_creator.create_model_edition_panel(this._dom_container,_model);
				});
			};
			
			let input = document.createElement('input');
			input.type = 'file';
			input.webkitdirectory = true; // Cho phép chọn thư mục
			input.directory = true;
			input.multiple = true; // Cho phép chọn nhiều file trong thư mục
			input.onchange = ()=> {
    
				files =   Array.from(input.files);
				file=files[0];
				
                reader = new FileReader();
				reader.onload = onFileLoaded;
				reader.readAsDataURL(file);
				
			};
			input.click();
		});
		
		
		let _import_obj_btn=this._game._gui_creator.create_input(150,40,160,300,"button");
		    _import_obj_btn.value="Import 3D Object";
			_import_obj_btn.addEventListener("click",()=>{
				_close_fc();
				this.init_import_gltf_object("./resources/models/space-ship/");
			});
		
		
		let _list_obj_btn=this._game._gui_creator.create_input(150,40,160,400,"button");
		    _list_obj_btn.value="List 3D Objects";
			_list_obj_btn.addEventListener("click",()=>{
				_close_fc();
				this.list_3d_object();
			});
	    
		
		
		let _distance_input=this._game._gui_creator.create_input(150,40,160,450,"text");
		    _distance_input.value="1000";
		let _get_front_pos_btn=this._game._gui_creator.create_input(150,40,160,500,"button");
		    _get_front_pos_btn.value="Get Front Pos";
			_get_front_pos_btn.addEventListener("click",()=>{
				const _distance=parseInt(_distance_input.value);
				const _pos1=this._game._me.Position;
				const _pos2=this._game._me.getFrontPos(_distance);
				alert("X:"+parseFloat(_pos2.x)+"   Y:"+parseFloat(_pos2.y)+"    Z:"+parseFloat(_pos2.z));
				alert("X:"+parseFloat(_pos2.x-_pos1.x)+"   Y:"+parseFloat(_pos2.y-_pos1.y)+"    Z:"+parseFloat(_pos2.z-_pos1.z));
			});
		
		_container.appendChild(closeButton);
		_container.appendChild(_edit_player_ship_model_btn);
		_container.appendChild(_import_obj_btn);
		_container.appendChild(_list_obj_btn);
		_container.appendChild(_distance_input);
		_container.appendChild(_get_front_pos_btn);
	}
	
	list_3d_object(){
		let _panel=this._game._gui_creator.create_panel(400,400,10,100);
		let _fx=10;
		let _fy=20;
		let _spy=40;
		let _counter=0;
		for(let i=this._3d_objects.length-1;i>=0;i--){
				const _item=this._3d_objects[i];
				let _id=_item.id;
				let _name=_item.name;
				let _model=_item.model;
				
				let _px=_fx;
				let _py=_fy+_counter*_spy;
				
				let _label=this._game._gui_creator.create_label(_px,_py,"red",20,_name);
				_label.addEventListener("click",()=>{
					_panel.remove();
					this._game._gui_creator.create_model_edition_panel(this._dom_container,_model);
				});
				
				_panel.appendChild(_label);
				
				_counter++;
		}
		
		this._dom_container.appendChild(_panel);
	}
	
	get_next_object_id(){
		if(!this._next_object_id){
			this._next_object_id=0;
		}
		this._next_object_id++;
		
		return this._next_object_id;
	}
	
	init_import_gltf_object(_folder_path){
		let files,file,reader;
			
			let onFileLoaded=(e)=>{
				
				let folderName = file.webkitRelativePath.split('/')[0];
				let _gltf_file = files.find(file => file.name.toLowerCase().endsWith('.gltf'));
				if(!_gltf_file)
					return false;
				
				var match = /^data:(.*);base64,(.*)$/.exec(e.target.result);
				if (match == null) {
					throw 'Could not parse result'; // should not happen
				}
				var mimeType = match[1];//type of file
				var content = match[2];//content in file
				
				let fileUrl = URL.createObjectURL(file);//url cua file
				
				let _fileName=file.name;
				let _url=_folder_path+folderName+"/scene.gltf";
				this.load_model(_fileName,_url,(_model)=>{
					let _position=this._game._me.getFrontPos(30);
					this._game._graphics.Scene.add(_model);
					_model.position.copy(_position);
					
					let _id=this.get_next_object_id();
					this._3d_objects.push({ id:_id,
											name:"object-"+_id,
											model:_model});
					
					this._game._gui_creator.create_model_edition_panel(this._dom_container,_model);
				});
			};
			
			let input = document.createElement('input');
			input.type = 'file';
			input.webkitdirectory = true; // Cho phép chọn thư mục
			input.directory = true;
			input.multiple = true; // Cho phép chọn nhiều file trong thư mục
			input.onchange = ()=> {
    
				files =   Array.from(input.files);
				file=files[0];
				
                reader = new FileReader();
				reader.onload = onFileLoaded;
				reader.readAsDataURL(file);
				
			};
			input.click();
		
	}
	
	load_model(_file_name,_url,_fc){
		let _loader;
		_loader= new GLTFLoader();
			_loader.load(_url,( _rs )=> {
				_player_ship_model=_rs.scene.children[0];
				_fc(_player_ship_model);
			});
	}
	
	_change_player_ship_model(_model){
		let _group=this._game._me._model;
		_group.children.forEach((child) => {
			if (child.geometry) child.geometry.dispose(); // Giải phóng Geometry
			if (child.material) {
				if (Array.isArray(child.material)) {
					child.material.forEach((mat) => mat.dispose()); // Nếu có nhiều material
				} else {
					child.material.dispose();
				}
			}
		
				_group.remove(child); // Xóa object khỏi Group
			
		});
		//_group.scale.set(1,1,1);
		_group.add(_model);
	}
	
}
export {EditModeCenter}