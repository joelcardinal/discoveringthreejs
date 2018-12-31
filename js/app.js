// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let renderer;
let scene;
let mesh;

function init() {

  // Get a reference to the container element that will hold our scene
  container = document.querySelector( '#container' );

  // create a Scene
  scene = new THREE.Scene();
  // Set the background color
  scene.background = new THREE.Color( 0x8FBCD4 );

  // set up the options for a perspective camera
  const fov = 35; // fov = Field Of View
  const aspect = container.clientWidth / container.clientHeight;

  const near = 0.1;
  const far = 100;
  // By convention, one unit on three.js is one meter. Since we’ve set our camera.far value to 100, we now have a scene sized at a scale of about 100 metres
  camera = new THREE.PerspectiveCamera( fov, aspect, near, far );

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

  // every object is initially created at ( 0, 0, 0 )
  // we'll move the camera back a bit so that we can view the scene
  camera.position.set( 0, 0, 10 );

  // create a geometry
  const geometry = new THREE.BoxBufferGeometry( 2, 2, 2 );

  // create a default (white) Basic material
  // MashBasic is not affected by lights, simply shows local color
  // const material = new THREE.MeshBasicMaterial();

  // standard is affected by lights
  const material = new THREE.MeshStandardMaterial( { color: 0x800080 } );
  // can later update with material.color.set( '0xff0000' )
  // NOTE: using hex color is same as CSS but in JS you need to prefix 0x instead of #

  // create a Mesh containing the geometry and material
  mesh = new THREE.Mesh( geometry, material );
  // access the geometry and material at any time using mesh.geometry and mesh.material
  scene.add( mesh );

  // Create a directional light
  // By default, this target is at (0, 0, 0)
  const light = new THREE.DirectionalLight( 0xffffff, 5.0 );
  // move the light back and up a bit
  light.position.set( 0, 3, 3 );
  // remember to add the light to the scene
  scene.add( light );

  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( container.clientWidth, container.clientHeight );

  renderer.setPixelRatio( window.devicePixelRatio );

  // add the automatically created <canvas> element to the page
  // you don’t have to use the <canvas> element, renderer.domElement, that the renderer automatically creates
  // for simplicity we'll use it here
  container.appendChild( renderer.domElement );

  play();

}

// a function that will be called every time the window gets resized.
// It can get called a lot, so don't put any heavy computation in here!
function onWindowResize() {

  // set the aspect ratio to match the new browser window aspect ratio
  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  // NOTE: always needs to be called when any camera setting is changed
  camera.updateProjectionMatrix();

  // update the size of the renderer AND the canvas
  renderer.setSize( container.clientWidth, container.clientHeight );

}

window.addEventListener( 'resize', onWindowResize );


init();


 function play() {
  // setAnimationLoop replaces requestAnimationFrame as it abstracts away issues for differing devices like VR
  renderer.setAnimationLoop( () => {

    update();
    render();

  } );

}

function stop() {

  renderer.setAnimationLoop( null );

}

// perform any updates to the scene, called once per frame
// avoid heavy computation here
function update() {

  // increase the mesh's rotation each frame
  mesh.rotation.z += 0.01;
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;

}

// render, or 'draw a still image', of the scene
function render() {

  renderer.render( scene, camera );

}