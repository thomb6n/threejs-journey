import * as THREE from "three";
import "./style.css";

// When making the canvas the full size of your browser window, there's a few things to keep in mind
// You have to update the sizes, camera aspect ratio and update it's projection matrix on the resize event
// You have to remove any standard body margins, set an overflow to hidden on html, and make the canvas position fixed, in CSS

// All older computers had a pixel ratio of one, companies like Apple added pixel ratios of 2 making them more precise, some go even higher
// It basically means diving your pixels up in smaller areas to get clearer images, the GPU does the calculations for this
// Higher pixel ratios usually go on the weakest devices like mobile phones, to see your pixelratio use window.devicePixelRatio
// You can set the pixelratio on the renderer with renderer.setPixelRatio()

const canvas = document.querySelector("canvas.three");

const scene = new THREE.Scene();

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0ff0a0 })
);
scene.add(cube);

// You can use the window's properties to make the scene fullscreen
const sizes = {
  height: window.innerHeight,
  width: window.innerWidth,
};

window.addEventListener("resize", (e) => {
  sizes.height = e.target.window.innerHeight;
  sizes.width = e.target.window.innerWidth;
  camera.aspect = sizes.width / sizes.height;

  // Must be called after updating camera properties
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);

  // For when someone changes to a monitor with a different pixel ratio
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(
  65,
  sizes.width / sizes.height,
  0.01,
  1000
);
camera.position.y = 1;
camera.position.z = 3;
camera.lookAt(cube.position);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas });
// To optimize performance, we want to limit the pixel ratio by using Math.min()
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height);

// This lets you doubleclick to enter and exit full screen mode
window.addEventListener("dblclick", (e) => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

let time = Date.now();

const tick = () => {
  const currentTime = Date.now();
  const deltaTime = currentTime - time;
  time = currentTime;

  cube.rotation.y += deltaTime * 0.001;

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
