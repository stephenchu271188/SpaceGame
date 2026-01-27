import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
//import Proton from './three.proton-master/build/three.proton.js';

var proton=null, emitter1=null, emitter2=null, R;
var emitter_life=0.5;
var ctha = 0;
var tha = 0;
let _game;
let _update_fc=null;
let _position,_direction;
class ParticleSystem{
	constructor(params){
		this._game=params.game;
		_game=params.game;
		this._unit=params.unit;
		_game.remove_function_from_update_list(_update_fc);
		if(proton!=null){
			emitter2.stopEmit();
			proton.removeEmitter(emitter2);
			proton.destroy();
		}
		_update_fc=(timeInSeconds)=>{
			this.update(timeInSeconds);
		 };
		_game.add_to_update_function_list(_update_fc);
		
	}
	
	create_system_1(position,direction){
		_position=position;
		_direction=direction;
		
		addProton(position);
	}
	
	update(timeInSeconds){
		
		const _tpos=this._unit.get_back_point(5);
		emitter2.p.x=_tpos.x;
		emitter2.p.y=_tpos.y;
		emitter2.p.z=_tpos.z;
		
		proton.update();
		
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
	
}
export{ParticleSystem}


function addProton(position) {
        proton = getNewProton();
        R = 5;
        
        emitter2 = createEmitter(position.x, position.y, position.z, '#004CFE', '#6600FF');
		
        proton.addEmitter(emitter2);
        proton.addRender(new Proton.SpriteRender(_game._graphics.Scene));
		
    }

    function createSprite() {
        //var map = new THREE.TextureLoader().load("./resources/img/dot.png");
		var map = new THREE.CanvasTexture(_game._image_preloader.getImage('particle6'));
        var material = new THREE.SpriteMaterial({
            map: map,
            color: 0xff0000,
            blending: THREE.AdditiveBlending,
            fog: true
        });
        return new THREE.Sprite(material);
    }
	
    function createEmitter(x, y,z, color1, color2) {
        var emitter = new Proton.Emitter();
        emitter.rate = new Proton.Rate(new Proton.Span(3, 9), new Proton.Span(.02, .04));
      
        emitter.addInitialize(new Proton.Life(0.5));
        emitter.addInitialize(new Proton.Body(createSprite()));
        emitter.addInitialize(new Proton.Radius(22));
       
        //emitter.addBehaviour(new Proton.Alpha(1, 0));
        emitter.addBehaviour(new Proton.Color(color1, color2));
        emitter.addBehaviour(new Proton.Scale(1, 0));
       
        emitter.p.x = x;
        emitter.p.y = y;
		emitter.p.z = z;
        
		const emit_time=1.0;
		const emitter_life=1.0;
		emitter.emit(emit_time,emitter_life);
		

        return emitter;
    }