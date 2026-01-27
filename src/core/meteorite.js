import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';

const importMap = {
  "imports": {
    "three": THREE,
    "three/addons/": "https://unpkg.com/three@0.161.0/examples/jsm/"
  }
};

export { importMap };
//Bị lỗi khi ở cách xa gốc tọa độ, càng xa thì càng mất hình các particles
class Meteorite{
	constructor(params){
		this._game=params.game;
	}
	create(_pos){
		let canvas = document.createElement( 'CANVAS' );
		canvas.width = 128;
		canvas.height = 128;

		let context = canvas.getContext( '2d' );
		
		context.globalAlpha = 0.3;
		context.filter = 'blur(16px)';
		context.fillStyle = 'white';
		context.beginPath();
		context.arc( 64, 64, 40, 0, 2*Math.PI );
		context.fill( );
		context.globalAlpha = 1;
		context.filter = 'blur(5px)';
		context.fillStyle = 'white';
		context.beginPath();
		context.arc( 64, 64, 16, 0, 2*Math.PI );
		context.fill( );

		let texture = new THREE.CanvasTexture( canvas );

		let N = 200,//so luong diem(point)
			M = 3;

		let position = new THREE.BufferAttribute( new Float32Array(3*N), 3),
		color = new THREE.BufferAttribute( new Float32Array(3*N), 3),
		v = new THREE.Vector3( );
		
		v.copy(_pos);
		
		for( let i=0; i<N; i++ )
		{
			v.randomDirection( ).setLength( 3+2*Math.pow(Math.random(),1/3) );
			position.setXYZ( i,v.x, v.y, v.z );
			color.setXYZ( i, Math.random( ), Math.random( ), Math.random( ) );
		}
		
		let	geometry = new THREE.BufferGeometry( );
		geometry.setAttribute( 'position', position );
		geometry.setAttribute( 'color', color );
		let material = new THREE.PointsMaterial( {
				color: 'white',
				vertexColors: true,
				size: 480,
				sizeAttenuation: true,
				map: texture,
				transparent: true,
				blending: THREE.AdditiveBlending,
				depthWrite: false
		} );
		let cloud = new THREE.Points( geometry, material );
		this._game._graphics.Scene.add( cloud );

		let ball = new THREE.Mesh(
			new THREE.IcosahedronGeometry( 120 ),
			new THREE.MeshPhysicalMaterial({
					color: 'silver',
					roughness: 0,
					metalness: 0.6,
					flatShading: true,
			})
		);
		this._game._graphics.Scene.add( ball );
		ball.position.copy(_pos);

		let idx = 0;
		//let idx = 0,
			//v = new THREE.Vector3();
		
		this._game.add_to_update_function_list((t)=>{
			
			ball.rotation.set( t/400, t/500, t/470 );
			//ball.position.setFromSphericalCoords(1400,Math.PI/2+0.5*Math.sin(t/300+Math.sin(t/1120+Math.cos(t/1720))),
												//-t/700);
			ball.position.z+=25;								
			//ball.position.x+=25;
			//ball.position.x-=3;
			//ball.position.z+=3;
			// take the oldest M particles and placed
			// them as fresh particles around the ball
			for( var j=0; j<M; j++ )
			{
				//v.randomDirection().divideScalar(0.1).add( ball.position );
				v.randomDirection().divideScalar(0.1).add( ball.position );
				//v.copy(ball.position);
				
				position.setXYZ( idx, v.x, v.y, v.z );
				color.setXYZ( idx, 1, 1, 2 );
				idx = (idx+1)%N;
			}
	
			// recolor all the rest particles
			var k = 1;
			for( var j=idx+N; j>idx-M; j-- )
			{
				color.setXYZ( j%N, k, k**1.5, 5*(k**3) );
				k = 0.98*k;
			}
			position.needsUpdate = true;
			color.needsUpdate = true;
			
		});
		
	}
}
export {Meteorite}