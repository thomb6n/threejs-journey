import * as THREE from "three";
import GUI from "lil-gui";

import "./style.css";

const variables = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const gui = new GUI({
  width: 200,
  title: "Debug Panel",
  closeFolders: true,
});

const canvas = document.querySelector("canvas.three");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  65,
  variables.width / variables.height
);
camera.position.z = 3;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(variables.width, variables.height);
renderer.setClearColor(0x111111);

const clock = new THREE.Clock();

const updateFrame = () => {
  const elapsedTime = clock.getElapsedTime();
  renderer.render(scene, camera);
  window.requestAnimationFrame(updateFrame);
};

updateFrame();

window.addEventListener("resize", (e) => {
  variables.height = e.target.window.innerHeight;
  variables.width = e.target.window.innerWidth;
  camera.aspect = variables.width / variables.height;

  camera.updateProjectionMatrix();

  renderer.setSize(variables.width, variables.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
