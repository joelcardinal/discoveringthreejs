const container = document.querySelector( '#container' );

const scene = new THREE.Scene();
scene.background = new THREE.Color( 'skyblue' );

const fov = 35; // AKA Field of View
const aspect = container.clientWidth / container.clientHeight;
const near = 0.1; // the near clipping plane
const far = 100; // the far clipping plane
// By convention, one unit on three.js is one meter. Since we’ve set our camera.far value to 100, we now have a scene sized at a scale of about 100 metres
const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );

// Three.js coordinate system
//      +y
//       ^
//       | -z
//       |/
// -x <------> +X
//     / |
//  +z   |
//       v
//      -y
// NOTE: CSS coordinate system has y axis poles reversed

// move camera (x,y,z)
camera.position.set( 0, 0, 10 );

// Geometry can take more parameters, we're relying on defaults
const geometry = new THREE.BoxBufferGeometry( 2, 2, 2 );
// create a default (white) Basic material
// MashBasic is not affected by lights, simply shows local color
const material = new THREE.MeshBasicMaterial();
const mesh = new THREE.Mesh( geometry, material );
// access the geometry and material at any time using mesh.geometry and mesh.material
scene.add( mesh );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( container.clientWidth, container.clientHeight );
renderer.setPixelRatio( window.devicePixelRatio );
// you don’t have to use the <canvas> element, renderer.domElement, that the renderer automatically creates
// for simplicity we'll use it here
container.appendChild( renderer.domElement );

// render, or 'create a still image', of the scene
renderer.render( scene, camera );