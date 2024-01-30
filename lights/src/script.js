import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import "./style.css";

/**
Light can have a big impact on performance, so try to be careful when adding lightning
The AmbientLight and HemisphereLight are the most performant, then the DirectionalLight and PointLight
The SpotLight and RectAreaLight are the less performant lights

When you need a lot of lights, you can use a technique called baking
You can bake light into a texture, but that means you can't move the light anymore and the textures are bigger
How to do this is discussed later
*/

const canvas = document.querySelector("canvas.three");
const scene = new THREE.Scene();
const sizes = {
  height: window.innerHeight,
  width: window.innerWidth,
};

const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

/**
AmbientLight applies omnidirectional lightning
In real life light bounces off of other things, but is hard to create digitally
That's why we can use ambient light to simulate light bouncing with a dim light
*/
const ambientLight = new THREE.AmbientLight(0xffaaff, 1);
// scene.add(ambientLight);

// DirectionalLight has a sun-like effect as if the sun rays were traveling in parallel
const directionalLight = new THREE.DirectionalLight(0x00fffe, 1);
scene.add(directionalLight);

/**
You can use helpers to see a visual representation of the light
Some helpers, like the RectAreaLightHelper, need to be imported separately
*/
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight
);
scene.add(directionalLightHelper);

// HemisphereLight is similar to AmbientLight but with separate colors coming from the sky and the ground
const hemisphereLight = new THREE.HemisphereLight(0x00fff0, 0xff0000, 3);
// scene.add(hemisphereLight);

// PointLight is like a lighter, the light starts at an infinitely small point and spreads uniformly in every direction
const pointLight = new THREE.PointLight(0xffff00, 0.1, 5, 4);
pointLight.position.set(1, -0.5, 1);
scene.add(pointLight);

const pointLightHelper = new THREE.PointLightHelper(pointLight);
scene.add(pointLightHelper);

// RectAreaLight works like a big rectangle light like the lightboxes on photoshoot sets
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 10, 2, 2);
scene.add(rectAreaLight);

/**
SpotLight is like a flashlight, a cone of light starting at a point and oriented in a direction
When using the Spotlight, the target is an Object3D instead of a Vector3D, so lookAt needs an object
*/
const spotLight = new THREE.SpotLight(0xffffff, 80, 6, Math.PI * 0.1, 0.6, 1.5);
spotLight.position.y = 4;
scene.add(spotLight);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
material.roughness = 0.4;

const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
scene.add(cube);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5), material);
sphere.position.x = -2;
scene.add(sphere);

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2), material);
torus.position.x = 2;
scene.add(torus);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(), material);
plane.position.y = -1;
plane.rotation.x = -Math.PI / 2;
plane.scale.set(8, 4);
scene.add(plane);

/**
You can also make lights point at a mesh
When following a mesh, you can update a light with light.update() inside the tick function
*/

rectAreaLight.position.x = -2;
rectAreaLight.position.z = 2;
rectAreaLight.lookAt(sphere.position);
directionalLight.lookAt(torus.position);
pointLight.lookAt(cube.position);

const camera = new THREE.PerspectiveCamera(
  65,
  sizes.width / sizes.height,
  0.01,
  100
);
camera.position.z = 4;
camera.position.y = 1;
camera.lookAt(cube);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height);

let time = Date.now();

const tick = () => {
  const currentTime = Date.now();
  const deltaTime = currentTime - time;
  time = currentTime;

  sphere.rotation.x += 0.0005 * deltaTime;
  sphere.rotation.y += 0.0005 * deltaTime;
  cube.rotation.x += 0.0005 * deltaTime;
  cube.rotation.y += 0.0005 * deltaTime;
  torus.rotation.x += 0.0005 * deltaTime;
  torus.rotation.y += 0.0005 * deltaTime;
  controls.update(0.0005 * deltaTime);

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

window.addEventListener("resize", (e) => {
  sizes.height = e.target.window.innerHeight;
  sizes.width = e.target.window.innerWidth;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
