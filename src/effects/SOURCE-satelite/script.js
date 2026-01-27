// https://discourse.threejs.org/t/particles-trailing-the-sphere/62221/3



import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";


// general setup, boring, skip to the next comment

console.clear( );

var scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000410 );

var camera = new THREE.PerspectiveCamera( 30, innerWidth/innerHeight );
    camera.position.set( 5, 0, 15 );
    camera.lookAt( scene.position );

var renderer = new THREE.WebGLRenderer( {antialias: true} );
    renderer.setSize( innerWidth, innerHeight );
    renderer.setAnimationLoop( animationLoop );
    document.body.appendChild( renderer.domElement );
			
var controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
		controls.autoRotate = true;
		controls.autoRotateSpeed = 0.5;

window.addEventListener( "resize", (event) => {
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix( );
    renderer.setSize( innerWidth, innerHeight );
});


// point cloud

var canvas = document.createElement( 'CANVAS' );
    canvas.width = 128;
    canvas.height = 128;

var context = canvas.getContext( '2d' );
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

var texture = new THREE.CanvasTexture( canvas );

const N = 200,
			M = 3;

var position = new THREE.BufferAttribute( new Float32Array(3*N), 3),
		color = new THREE.BufferAttribute( new Float32Array(3*N), 3),
		v = new THREE.Vector3( );

for( var i=0; i<N; i++ )
{
		v.randomDirection( ).setLength( 3+2*Math.pow(Math.random(),1/3) );
		position.setXYZ( i, v.x, v.y, v.z );
		color.setXYZ( i, Math.random( ), Math.random( ), Math.random( ) );
}

var	geometry = new THREE.BufferGeometry( );
		geometry.setAttribute( 'position', position );
		geometry.setAttribute( 'color', color );
var material = new THREE.PointsMaterial( {
				color: 'white',
				vertexColors: true,
				size: 2,
				sizeAttenuation: true,
				map: texture,
				transparent: true,
				blending: THREE.AdditiveBlending,
				depthWrite: false,
		} );
var cloud = new THREE.Points( geometry, material );
scene.add( cloud );

var light = new THREE.DirectionalLight( 'white', 2 );
    light.position.set( 1, 1, 1 );
    scene.add( light );


var ball = new THREE.Mesh(
			new THREE.IcosahedronGeometry( 1/4 ),
			new THREE.MeshPhysicalMaterial({
					color: 'silver',
					roughness: 0,
					metalness: 0.6,
					flatShading: true,
			})
);

scene.add( ball );


var idx = 0,
		v = new THREE.Vector3();



// next comment

function animationLoop( t )
{
		// rotate the ball
		ball.rotation.set( t/400, t/500, t/470 );
	
		// move the ball
		ball.position.setFromSphericalCoords(4,Math.PI/2+0.5*Math.sin(t/300+Math.sin(t/1120+Math.cos(t/1720))),-t/700);
	
		// take the oldest M particles and placed
		// them as fresh particles around the ball
		for( var j=0; j<M; j++ )
		{
				v.randomDirection().divideScalar(4).add( ball.position );
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

		controls.update( );
		renderer.render( scene, camera );
}