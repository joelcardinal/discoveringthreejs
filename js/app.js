// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;
let mesh;

function initControls() {
  // remember, this makes the camera orbit the object, not rotate the object
  controls = new THREE.OrbitControls( camera, container );
  
}
function initCamera(){
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
  // we'll move the camera so not looking straight on 0,0,0 origin
  camera.position.set( -5, 5, 7 );
}
function initLights(){
  // Create a directional light
  // By default, directional light target is at (0, 0, 0)
  // typically, light intensity (here the second parm) should usually be < than 1 
  //const light = new THREE.DirectionalLight( 0xffffff, 3.0 );
  // move the light back and up a bit
  //light.position.set( 0, 3, 3 );
  // remember to add the light to the scene
  //scene.add( light );

  // NOTE: ambient lighting is used for artistic control rather than strong lighting,
  // meaning that it is usually set much more dimly than this, typically:
  // 1. Set the color to a dim grey, somewhere between 0x111111 for a very dim indoor scene and 0xaaaaaa for a bright outdoor scene, while leaving the intensity at 11
  // 2. leave the color as white and set the intensity very low, somewhere around 0.10.1 to 0.30.3
  // TODO: how to limit ambient light to only certain objects or otherways to fake ambient occlusion
  const ambientLight = new THREE.AmbientLight( 0xffffff, 1 );
  scene.add( ambientLight );

  const frontLight = new THREE.DirectionalLight( 0xffffff, 1 );
  frontLight.position.set( 10, 10, 10 );

  const backLight = new THREE.DirectionalLight( 0xffffff, 1 );
  backLight.position.set( -10, 10, -10 );

  scene.add( frontLight, backLight );
}
/*
function initMeshes(){
  // create a geometry
  const geometry = new THREE.BoxBufferGeometry( 2, 2, 2 );

  // create a default (white) Basic material
  // MashBasic is not affected by lights, simply shows local color
  // const material = new THREE.MeshBasicMaterial();

  // standard is affected by lights
  //const material = new THREE.MeshStandardMaterial( { color: 0x800080 } );
  // can later update with material.color.set( '0xff0000' )
  // NOTE: using hex color is same as CSS but in JS you need to prefix 0x instead of #

  // create a texture loader.
  const textureLoader = new THREE.TextureLoader();
  // textureLoader.load returns an instance of Texture that we can immediately use in our material, even though the texture itself may take some time to load
  // loads texture files asynchronously
  const texture = textureLoader.load( 'imgs/uv_test_bw_1024.png' );
  // anisotropy, make your textures look good at glancing angles
  // anisotropic filtering levels are powers of two - 11, 22, 44, 88, up to the maximum level of 1616
  // high memory usage, use only when needed
  texture.anisotropy = 16;

  // create a Standard material using the texture we just loaded as a color map,
  // even though the name is just map it's really a color map,
  // there are other material properties like normalMap, alphaMap...etc.
  // NOTE: We’ve also removed the material’s .color parameter,
  // because the material’s color gets combined (multiplied, technically) with the material’s texture, so if we left it as purple, the texture would have a purple tint
  const material = new THREE.MeshStandardMaterial( {
    map: texture,
  } );

  // create a Mesh containing the geometry and material
  mesh = new THREE.Mesh( geometry, material );
  // access the geometry and material at any time using mesh.geometry and mesh.material
  scene.add( mesh );
}
*/
function initMeshes() {

  // create a Group to hold the pieces of the train
  const train = new THREE.Group();
  scene.add( train );

  const bodyMaterial = new THREE.MeshStandardMaterial( {
      color: 0xff3333, // red
      flatShading: true,
  } );

  const detailMaterial = new THREE.MeshStandardMaterial( {
      color: 0x333333, // darkgrey
      flatShading: true,
  } );

  const noseGeometry = new THREE.CylinderBufferGeometry( 0.75, 0.75, 3, 12 );
  const nose = new THREE.Mesh( noseGeometry, bodyMaterial );
  nose.rotation.z = Math.PI / 2;

  nose.position.x = -1;

  const cabinGeometry = new THREE.BoxBufferGeometry( 2, 2.25, 1.5 );
  const cabin = new THREE.Mesh( cabinGeometry, bodyMaterial );
  cabin.position.set( 1.5, 0.4, 0 );

  train.add( nose, cabin );

  const wheelGeo = new THREE.CylinderBufferGeometry( 0.4, 0.4, 1.75, 16 );
  wheelGeo.rotateX( Math.PI / 2 );


  const smallWheelRear = new THREE.Mesh( wheelGeo, detailMaterial );
  smallWheelRear.position.set( 0, -0.5, 0 );

  const smallWheelCenter = smallWheelRear.clone();
  smallWheelCenter.position.x = -1;

  const smallWheelFront = smallWheelRear.clone();
  smallWheelFront.position.x = -2;

  const bigWheel = smallWheelRear.clone();
  bigWheel.scale.set( 2, 2, 1.25 );
  bigWheel.position.set( 1.5, -0.1, 0 );

  train.add( smallWheelRear, smallWheelCenter, smallWheelFront, bigWheel );

  const chimneyGeometry = new THREE.CylinderBufferGeometry( 0.3, 0.1, 0.5 );
  const chimney = new THREE.Mesh( chimneyGeometry, detailMaterial );
  chimney.position.set( -2, 0.9, 0 );

  train.add( chimney );

}
function initRenderer(){
  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( container.clientWidth, container.clientHeight );

  renderer.setPixelRatio( window.devicePixelRatio );

  // add the automatically created <canvas> element to the page
  // you don’t have to use the <canvas> element, renderer.domElement, that the renderer automatically creates
  // for simplicity we'll use it here
  container.appendChild( renderer.domElement );
}
function init() {

  // Get a reference to the container element that will hold our scene
  container = document.querySelector( '#container' );

  // create a Scene
  scene = new THREE.Scene();
  // Set the background color
  scene.background = new THREE.Color( 0x8FBCD4 );

  initCamera();
  initControls();
  initLights();
  initMeshes();
  initRenderer();
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
  //mesh.rotation.z += 0.01;
  //mesh.rotation.x += 0.01;
  //mesh.rotation.y += 0.01;

}

// render, or 'draw a still image', of the scene
function render() {

  renderer.render( scene, camera );

}