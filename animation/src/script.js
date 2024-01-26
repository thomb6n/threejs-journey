import * as THREE from "three";
import gsap from "gsap";

// If you want a lot of control over animations, use a library like GSAP

const canvas = document.querySelector("canvas.three");

const scene = new THREE.Scene();

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xf0ffa0 })
);
scene.add(cube);

const { height, width } = {
  height: 600,
  width: 800,
};

const camera = new THREE.PerspectiveCamera(45, width / height);
camera.position.z = 5;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(width, height);

// Not all screens have the same FPS, but we want our animation to look the same irregardless of the framerate
// To make it the same we can use something that's the same for everyone: Date.now()
let time = Date.now();

// Animation is like doing stop motion, showing a lot of pictures (60 p/s or fps)
const tick = () => {
  // The difference between the current and previous timestamp is the delta time
  const currentTime = Date.now();
  const deltaTime = currentTime - time;
  time = currentTime;

  // By multiplying with deltaTime the animation will move at the same speed regardless of the fps of the client
  cube.rotation.y += 0.001 * deltaTime;
  cube.rotation.x += 0.001 * deltaTime;

  // Run the render on each tick
  renderer.render(scene, camera);

  // requestAnimationFrame() calls a function on the next frame, just once, but you can call it again from within the callback function
  window.requestAnimationFrame(tick);
};

// You can also use Three's Clock
const clock = new THREE.Clock();

const clockTick = () => {
  const elapsedTime = clock.getElapsedTime();

  // You can do different calculations on the elapsedTime
  // cube.position.y = Math.sin(elapsedTime);
  // cube.position.x = Math.cos(elapsedTime);
  // cube.rotation.y = elapsedTime;
  // cube.rotation.x = elapsedTime;

  // Run the render on each tick
  renderer.render(scene, camera);

  window.requestAnimationFrame(clockTick);
};

clockTick();

// GreenSock has its own tick, so it's already doing requestAnimationFrame
gsap.to(cube.position, { x: 1.2, duration: 1 });
gsap.to(cube.position, { delay: 1, x: -1.2, duration: 2 });
gsap.to(cube.position, { delay: 3, x: 0, duration: 1 });
