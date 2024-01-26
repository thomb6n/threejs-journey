import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// DeviceOrientationControls - automatically retrieves the device orientation, useful for immersive and VR experiences on mobile devices
// FlyControls - enables moving the camera like you're on a spaceship
// FirstPersonControls - like fly control, but without changing the up vector, so like a bird
// PointerLockControls - uses the Pointer Lock JavaScript API, perfect for first-person 3D games, makes the mouse disappear
// OrbitControls - you can move, zoom and rotate, but can not go beneath the floor or upside down
// TrackballControls - similar to OrbitControls but without a constant camera up vector
// TransformControls - had nothing to do with the camera, can transform 3D objects
// DragControls - similar to TransformControls, makes it possible to move objects

// To use the mouse as a control, we need the coordinates on the page
// We can get the exact pixels on the screen, but it's better to convert them to a scale of 0-1
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (e) => {
  // The -0.5 makes the range -0.5 to 0.5
  cursor.x = e.clientX / width - 0.5;
  cursor.y = e.clientY / height - 0.5;
});

const canvas = document.querySelector("canvas.three");

const scene = new THREE.Scene();

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0ff0a0 })
);
// cube.rotation.y = Math.PI * 0.25;

scene.add(cube);

const { height, width } = {
  height: 600,
  width: 800,
};

const camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 1000);
camera.position.z = 3;
// camera.lookAt(cube.position);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(width, height);

const clock = new THREE.Clock();

let time = Date.now();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  const currentTime = Date.now();
  const deltaTime = currentTime - time;
  time = currentTime;

  //   // The * 2 is solely to make the movements bigger and is not necessary
  //   camera.position.x = cursor.x * 2;
  //   // This has to be negative so the camera doesn't follow the cursor
  //   // This is because in Three the Y axis counts up when going higher, but in the browser the Y axis starts at 0 at the top instead of at the bottom
  //   camera.position.y = -cursor.y * 2;

  // To move on a circle, we have to use sin() and cos() on the z and x axes as long as the given numbers are the same
  //   camera.position.x = Math.sin(cursor.x * Math.PI) * 3;
  //   camera.position.z = Math.cos(cursor.x * Math.PI) * 3;
  //   camera.position.y = -cursor.y * 3;

  //   camera.lookAt(cube.position);
  controls.update(0.005 * deltaTime);

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
