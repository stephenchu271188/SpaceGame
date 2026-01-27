import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
//import Proton from './three.proton-master/build/three.proton.js';


class FlashEffect1{
	
	constructor(params){
		this._game=params.game;
		this._game=params.game;
		this._game.remove_function_from_update_list(this._update_fc);
		
		this.proton=null;this.emitter1=null;this.emitter2=null;this.R=null;
		this.emitter_life=0.5;
		this.ctha = 0;
		this.tha = 0;
		//this._game=null;
		this._update_fc=null;
		this._position=null;this._direction=null;
		
		//_game.clear_update_function_list();
		this._unit=params.unit;
		this._update_fc=(timeInSeconds)=>{
			this.update(timeInSeconds);
		 };
		this._game.add_to_update_function_list(this._update_fc);
	}
	
	create_system_1(position,direction){
		this._position=position;
		this._direction=direction;
		
		this.addProton(position);
	}
	
	update(timeInSeconds){
		
		if (this.emitter2.age > this.emitter_life) {
			//proton.removeEmitter(emitter2); 
			//proton.destroy();
			//return;
		}
		//emitter2.p.x+=5;
		//emitter2.p.y+=1;
		//emitter2.p.z+=1;
		//emitter2.p.x+=parseInt(timeInSeconds*50);//<==Dich Chuyen
		
		try{
			
		//const position=new THREE.Vector3(emitter2.p.x,emitter2.p.y,emitter2.p.z);
		//const new_position=this.translatePointByVector(position,_direction,timeInSeconds*150);
		//const new_position=this.translatePoint(position,_position,timeInSeconds*60);
		
		//emitter2.p.x=parseInt(new_position.x);
		//emitter2.p.y=parseInt(new_position.y);
		//emitter2.p.z=parseInt(new_position.z);
		const _tpos=this._unit.Position;
		this.emitter2.p.x=_tpos.x;
		this.emitter2.p.y=_tpos.y;
		this.emitter2.p.z=_tpos.z;
		
		//console.log(new_position.x +" and "+new_position.y+" and "+new_position.z);
		
		}catch(e){alert(e.stack);}
		
		this.proton.update();
		
	}
	
	translatePointByVector(P, V, l) {//dịch chuyển điểm P một quãng đường l theo hướng vector V
		 const direction = new THREE.Vector3(V.x, V.y, V.z);
		 direction.normalize();
  
	     const newPosition = new THREE.Vector3(P.x, P.y, P.z);
  
         newPosition.addScaledVector(direction, l);
  
			//alert(newPosition.x +" and "+newPosition.y+" and "+newPosition.z);
		 return newPosition;
	}
	translatePoint(p1, p2, distance) {//dịch chuyển điểm P1 tiến tới gần điểm P2 một khoảng quãng đường là d
		// Tính toán vector hướng từ P1 đến P2
		const directionVector = {
			x: p2.x - p1.x,
			y: p2.y - p1.y,
			z: p2.z - p1.z
		};
		
		// Tính độ dài của vector hướng
		const directionLength = Math.sqrt(directionVector.x ** 2 + directionVector.y ** 2 + directionVector.z ** 2);
    
		// Chuẩn hóa vector hướng để có hướng di chuyển
		const normalizedDirection = {
			x: directionVector.x / directionLength,
			y: directionVector.y / directionLength,
			z: directionVector.z / directionLength
		};
    
		// Tính toán vị trí mới của P1 sau khi di chuyển
		const newP1 = {
			x: p1.x + normalizedDirection.x * distance,
			y: p1.y + normalizedDirection.y * distance,
			z: p1.z + normalizedDirection.z * distance
		};
    
		return newP1;
	}
	
	addProton(position) {
        this.proton = getNewProton();
        this.R = 5;
        //emitter1 = createEmitter(position.x-R, position.y, position.z, '#4F1500', '#0029FF');
        //emitter2 = createEmitter(position.x+R, position.y, position.z, '#004CFE', '#6600FF');
		
		//emitter1 = createEmitter(position.x, position.y, position.z, '#4F1500', '#0029FF');
        this.emitter2 = this.createEmitter(position.x, position.y, position.z, '#004CFE', '#6600FF');
		
        //proton.addEmitter(emitter1);
        this.proton.addEmitter(this.emitter2);
        this.proton.addRender(new Proton.SpriteRender(this._game._graphics.Scene));
		
		//removeEmitter
    }

    createSprite() {
        var map = new THREE.TextureLoader().load("./resources/img/dot.png");
        var material = new THREE.SpriteMaterial({
            map: map,
            color: 0xff0000,
            blending: THREE.AdditiveBlending,
            fog: true
        });
        return new THREE.Sprite(material);
    }
	/*
	-emitter.rate: Đây là thuộc tính của đối tượng Emitter và được sử dụng để xác định tốc độ 
		tạo ra các hạt trong một khoảng thời gian cố định.
	-new Proton.Rate(...): 
		Proton.Rate là một đối tượng được sử dụng để điều chỉnh tốc độ tạo ra các hạt
	-new Proton.Span(5, 7): Trong trường hợp này, 
		Proton.Span là một cách để chỉ định khoảng giá trị. 
		Proton.Span chấp nhận hai tham số, là giá trị tối thiểu và giá trị tối đa 
		cho tốc độ tạo ra hạt. Trong ví dụ này, tốc độ tạo hạt được đặt trong khoảng 
		từ 5 đến 7 hạt mỗi khung hình.
	-new Proton.Span(.01, .02): Tương tự như trên, Proton.Span cũng được sử dụng 
	để xác định khoảng giá trị, nhưng ở đây nó áp dụng cho tốc độ tạo hạt trong 
	khoảng thời gian. Trong ví dụ này, tốc độ tạo hạt trong khoảng thời gian cụ thể 
	là từ 0.01 đến 0.02 hạt mỗi mili giây.
	Vậy nghĩa của dòng mã này là Emitter sẽ tạo ra một số hạt mỗi khung hình, và số lượng 
	hạt sẽ nằm trong khoảng từ 5 đến 7 hạt. Ngoài ra, tốc độ tạo hạt trong khoảng thời gian 
	cụ thể (thường là một giây) sẽ nằm trong khoảng từ 0.01 đến 0.02 hạt mỗi mili giây. 
	Điều này tạo ra một hiệu ứng mà số lượng hạt được tạo ra không đều đặn và ngẫu nhiên theo 
	thời gian.

	*/
    createEmitter(x, y,z, color1, color2) {
        var emitter = new Proton.Emitter();
        emitter.rate = new Proton.Rate(new Proton.Span(3, 5), new Proton.Span(.01, .02));
        emitter.addInitialize(new Proton.Mass(0));//trong luong <0 sẽ đổi hướng 
        emitter.addInitialize(new Proton.Life(this.emitter_life));//thoi gian ton tai
        emitter.addInitialize(new Proton.Body(this.createSprite()));
        emitter.addInitialize(new Proton.Radius(150));
        emitter.addInitialize(new Proton.V(200, new Proton.Vector3D(0, 0, -1), 0));//có vẻ là vận tốc ban đầu
		
		// Loại bỏ hành vi Collision khỏi emitter
		emitter.removeBehaviour(Proton.Collision);
		
        emitter.addBehaviour(new Proton.Alpha(1, 0));//sự trong suốt thay đổi theo thời gian
        emitter.addBehaviour(new Proton.Color(color1, color2));
        emitter.addBehaviour(new Proton.Scale(1, 0.5));//kích thước thay đổi theo thời gian
		
		//emitter.addBehaviour(new Proton.CrossZone(new Proton.SphereZone(_campos.x,_campos.y,_campos.z,2000), 'dead'));
        emitter.addBehaviour(new Proton.CrossZone(new Proton.ScreenZone(this._game._graphics.Camera,this._game._graphics.Renderer), 'dead'));
		
        //emitter.addBehaviour(new Proton.Force(0, 0, -20));//QUAN TRONG(hướng)
		
		
        // emitter.addBehaviour(new Proton.Attraction({
        //     x: 0,
        //     y: 0,
        //     z: 0
        // }, 5, 250));


		const emit_time=0.5;
        emitter.p.x = x;
        emitter.p.y = y;
		emitter.p.z = z;
        emitter.emit(emit_time,this.emitter_life);//chưa rõ parameter thứ 2 có phải là emitter_life hay ko

        return emitter;
    }
	
}
export{FlashEffect1}
