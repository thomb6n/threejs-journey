import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import "./style.css";

/**
Core shadow is shadow on an object where the light does not touch it, it works out of the box
Drop shadows are shadows on other objects, these are harder but Three.js has a built-in solution
You have to enable the shadow map for the renderer, and the ability to cast and receive shadows per object (also the light)

With every render, Three.js does a render for each light supporting shadows (PointLight, DirectionalLight, SpotLight)
Each render simulates what the light sees (similar to a camera)
During each render, MeshDepthMaterial replaces all meshes materials
The light renders are stored as textures, called shadow maps
They are used on every material that's supposed to receive shadow and is projected on the geometry
The PointCamera makes a render for every side of the cube (6) with a perspective camera

You can bake shadows, where you bake the shadow into a texture, by mapping a texture that has a shadow baked in to a mesh
You can also make simple baked shadows that move when the casting meshed move, to create a more realistic effect
This is often a texture or alpha map on a plane, just above the floor (to prevent z-glitching)
*/

const canvas = document.querySelector("canvas.three");
const scene = new THREE.Scene();
const sizes = {
  height: window.innerHeight,
  width: window.innerWidth,
};

const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 10, 10, Math.PI * 0.3);
spotLight.position.y = 4;
spotLight.position.z = -1;
spotLight.position.x = 2;
spotLight.castShadow = true;

scene.add(spotLight);

const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
material.roughness = 0.4;

const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
cube.castShadow = true;

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5), material);
sphere.position.x = -2;
sphere.castShadow = true;

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2), material);
torus.position.x = 2;
torus.castShadow = true;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(), material);
plane.position.y = -1;
plane.rotation.x = -Math.PI / 2;
plane.scale.set(8, 4);
plane.receiveShadow = true;

scene.add(sphere, torus, plane, cube);

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

// You have to enable the shadow maps
renderer.shadowMap.enabled = true;

/**
You can choose what algorithm to use to make the shadow map
- BasicShadowMap, very performant but mediocre quality
- PCFShadowMap, less performant but smoother edges (and the default)
- PCFSoftShadowMap, less performant, even smoother edges (radius doesn't work)
- VSMShadowMap, less performant, more constraints, can have unexpected results
*/
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
The shadow map has a width and height, so they need to be set
The shadow maps are stored on the light, so that's where you can change them
Always use a power of 2 value (because of mipmapping)
*/
spotLight.shadow.mapSize.set(1024, 1024);

/**
The lightcamera used to create the shadow map has the near and far properties
You need to configure these to avoid shadow glitches and for optimisation
These also have helpers so you can easily find the good near and far
You can also optimise things like the amplitude (top, left, bottom, right on orthographic cameras, fov on perspective cameras)
*/
spotLight.shadow.camera.near = 2.5;
spotLight.shadow.camera.far = 8;
spotLight.shadow.camera.fov = 60;
// You can control the shadow blur with the radius
// spotLight.shadow.radius = 5;
const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(spotLightCameraHelper);

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
