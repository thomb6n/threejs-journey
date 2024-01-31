import * as THREE from "three";
import GUI from "lil-gui";

const variables = {
  width: window.innerWidth,
  height: window.innerHeight,
  materialColor: "#a8c6fe",
  objectDistance: 4,
};

const canvas = document.querySelector("canvas.three");
const scene = new THREE.Scene();

const directionalLight = new THREE.DirectionalLight("#ffffff", 2);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");

// By default, Three.js will try to merge colors in gradient, making a smooth gradient
// We tell it to instead grab the nearest value in the gradient map to get the harder edges
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;

const material = new THREE.MeshToonMaterial({
  color: variables.materialColor,
  gradientMap: gradientTexture,
  wireframe: true,
});

const donut = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 16), material);
donut.position.x = 1;
scene.add(donut);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), material);
sphere.position.x = -1;
scene.add(sphere);

const knot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 32, 16),
  material
);
knot.position.x = 1;
scene.add(knot);

donut.position.y = variables.objectDistance * 0;
sphere.position.y = variables.objectDistance * -1;
knot.position.y = variables.objectDistance * -2;

const particleCount = 1000;
const particleMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.02,
  sizeAttenuation: true,
});
const particleGeometry = new THREE.BufferGeometry();
const vertices = new Float32Array(1000 * 3);

for (let i = 0; i < particleCount; i++) {
  const i3 = i * 3;

  vertices[i3] = (Math.random() - 0.5) * 10;
  vertices[i3 + 1] = (Math.random() - 0.5) * 24;
  vertices[i3 + 2] = (Math.random() - 0.5) * 10;
}

particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(vertices, 3)
);

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

const camera = new THREE.PerspectiveCamera(
  35,
  variables.width / variables.height
);
camera.position.z = 6;

// We need a camera group to add easing, in order to control the groups position seperately from the camera's scrolling
const cameraGroup = new THREE.Group();
cameraGroup.add(camera);
scene.add(cameraGroup);

/**
You can make the background of the renderer transparent by setting alpha to true
*/
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(variables.width, variables.height);

window.addEventListener("resize", (e) => {
  variables.height = e.target.window.innerHeight;
  variables.width = e.target.window.innerWidth;

  camera.aspect = variables.width / variables.height;
  camera.updateProjectionMatrix();

  renderer.setSize(variables.width, variables.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

let scrollY = window.scrollY;

const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
});

window.addEventListener("mousemove", (e) => {
  // The event only shows positive values (pixels from 0 to ###)
  // We want negative and positive values so the camera can move left and right
  cursor.x = e.clientX / variables.width - 0.5;
  cursor.y = e.clientY / variables.height - 0.5;
});

const clock = new THREE.Clock();

let prevTime = 0;

const updateFrame = () => {
  const elapsedTime = clock.getElapsedTime();
  // We need the delta time for the easing formula so it's the same speed for every fps
  const deltaTime = elapsedTime - prevTime;
  prevTime = elapsedTime;

  [sphere, donut, knot].forEach((mesh) => {
    mesh.rotation.x = elapsedTime * 0.2;
    mesh.rotation.y = elapsedTime * 0.1;
  });

  // y in Three.js goes down, while in JavaScript it goes up
  const destX = cursor.x * 0.5;
  const destY = -cursor.y * 0.5;

  camera.position.y = (-scrollY / variables.height) * variables.objectDistance;

  // To add easing, we're not moving the camera straight to a target, but at 1/10 at a time
  // First we calculate the distance left, than divide it by 10 to get a tenth
  cameraGroup.position.y += (destY - cameraGroup.position.y) * 1 * deltaTime;
  cameraGroup.position.x += (destX - cameraGroup.position.x) * 1 * deltaTime;

  renderer.render(scene, camera);

  window.requestAnimationFrame(updateFrame);
};

updateFrame();

const gui = new GUI({
  width: 200,
  title: "Debug Panel",
  closeFolders: true,
});

gui.addColor(variables, "materialColor").onChange(() => {
  material.color.set(variables.materialColor);
});

gui.hide();
