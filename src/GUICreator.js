

class GUICreator{
	constructor(params){
		this._game=params.game;
	}
	create_input(_width,_height,_x,_y,_type){
		let _input = document.createElement('input');
			_input.type = _type;
			_input.style.position="absolute";
			_input.style.width=_width+"px";
			_input.style.height=_height+"px";
			_input.style.top=_y+"px";
			_input.style.left=_x+"px";
			
		return _input;
	}
	create_label(_x,_y,_color,_text_size,_content){
		let _label = document.createElement('label');
			_label.style.position="absolute";
			//_label.style.width=_width+"px";
			//_label.style.height=_height+"px";
			_label.style.top=_y+"px";
			_label.style.left=_x+"px";
			_label.style.color=_color;
			_label.style.fontSize=_text_size+"px";
			_label.textContent=_content;
			
		return _label;
	}
	create_panel(_width,_height,_x,_y){
		let _container=document.createElement("div");
		_container.style.position="absolute";
		_container.style.width=_width+"px";
		_container.style.height=_height+"px";
		_container.style.top=_y+"px";
		_container.style.left=_x+"px";
		_container.style.border="2px #33BBFF solid";
		_container.style.borderRadius="5px";
		_container.style.backgroundColor="rgba(19, 106, 230, 0.4)";
		_container.style.boxShadow="0 0 10px 5px #33BBFF";
		//_container.style.display="flex";
		_container.style.textAlign="center";
		//this._dom_container.appendChild(_container);
		
		let closeButton = document.createElement("button");
		closeButton.innerText = "X";
		closeButton.style.position = "absolute";
		closeButton.style.top = "10px";
		closeButton.style.right = "10px";
		
		let _close_fc=()=>{
			_container.remove();
		};
		
		closeButton.addEventListener("click", function () {
			_close_fc();
		});
		
		_container.appendChild(closeButton);
		
		return _container;
	}
	
	create_model_edition_panel(_panel_container,_model){
		
		let _panel=this.create_panel(400,400,10,100);
		_panel_container.appendChild(_panel);
		
		let _input_w=80;
		let _input_h=30;
		
		let _input1=this.create_input(_input_w,_input_h,10,50,"text");
		let _input2=this.create_input(_input_w,_input_h,10,100,"text");
		let _input3=this.create_input(_input_w,_input_h,10,150,"text");
		let _input4=this.create_input(_input_w,_input_h,10,200,"text");
		
		let _input5=this.create_input(_input_w,_input_h,110,100,"text");
		let _input6=this.create_input(_input_w,_input_h,110,150,"text");
		let _input7=this.create_input(_input_w,_input_h,110,200,"text");
			
		let _submit_btn=this.create_input(50,_input_h,30,250,"button");
		    _submit_btn.value="Submit";
			_submit_btn.addEventListener("click",()=>{
				let _val1=_input1.value.trim();
				if(_val1!=''){
					_val1=parseFloat(_val1);
					_model.scale.set(_val1,_val1,_val1);
				}
				
				let _val2=_input2.value.trim();
				if(_val2!=''){
					_val2=parseFloat(_val2);
					_model.position.x=_val2;
				}
					
				let _val3=_input3.value.trim();
				if(_val3!=''){
					_val3=parseFloat(_val3);
					_model.position.y=_val3;
				}
					
				let _val4=_input4.value.trim();//nhap vao duoi' dang: Math.PI
				if(_val4!=''){
					_val4=parseFloat(_val4);
					_model.position.z=_val4;
				}
				
				let _val5=_input5.value.trim();//nhap vao so' Float
				if(_val5!=''){
					_val5=parseFloat(_val5);
					_model.rotation.x=Math.PI*_val5;
				}
				
				let _val6=_input6.value.trim();
				if(_val6!=''){
					_val6=parseFloat(_val6);
					_model.rotation.y=Math.PI*_val6;
				}
				
				let _val7=_input7.value.trim();
				if(_val7!=''){
					_val7=parseFloat(_val7);
					_model.rotation.z=Math.PI*_val7;
				}
			});
		
			_panel.appendChild(_input1);
			_panel.appendChild(_input2);
			_panel.appendChild(_input3);
			_panel.appendChild(_input4);
			_panel.appendChild(_input5);
			_panel.appendChild(_input6);
			_panel.appendChild(_input7);
			
			_panel.appendChild(_submit_btn);
	}
}

export {GUICreator}