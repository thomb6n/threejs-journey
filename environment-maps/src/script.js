import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

import "./style.css";

const variables = {
  width: window.innerWidth,
  height: window.innerHeight,
  materialColor: "#ffeded",
};

const canvas = document.querySelector("canvas.three");
const scene = new THREE.Scene();

const gltfLoader = new GLTFLoader();
gltfLoader.load("models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
  gltf.scene.scale.set(10, 10, 10);
  gltf.scene.position.set(0, -2, 0);
  scene.add(gltf.scene);
});

// Loading the environment map
const cubeTextureLoader = new THREE.CubeTextureLoader();
// const environmentMap = cubeTextureLoader.load([
//   "/environmentMaps/0/px.png",
//   "/environmentMaps/0/nx.png",
//   "/environmentMaps/0/py.png",
//   "/environmentMaps/0/ny.png",
//   "/environmentMaps/0/pz.png",
//   "/environmentMaps/0/nz.png",
// ]);
// scene.background = environmentMap;

// Make the environment map work on every mesh in the scene
// scene.environment = environmentMap;

// You can change the background bluriness
scene.backgroundBlurriness = 0.02;

// You can also set the intensity of just the background
// scene.backgroundIntensity = 2;

// There's also .hdr files, where hdr stands for High Dynamic Range
const rgbeLoader = new RGBELoader();

// These files are most often equirectangular, so it's only one file for the 360 scene
rgbeLoader.load("/environmentMaps/0/2k.hdr", (environmentMap) => {
  // We need to specify that this file is equirectangular
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = environmentMap;
  scene.environment = environmentMap;
  // These files are usually much heavier
});

// If you want to increase the intensity of the env map on every mesh, you have to update it for each mesh
const updateAllMaterials = () => {
  // Every Object3D (e.g. Group, Mesh, Scene) has the traverse() method
  scene.traverse((child) => {
    // We only want to apply the intensity on meshes with MeshStandardMaterial
    if (child.isMesh && child.material.isMeshStandardMaterial) {
      child.material.envMapIntensity = 3;
    }
  });
};

const camera = new THREE.PerspectiveCamera(
  45,
  variables.width / variables.height
);
camera.position.set(-2, 8, 20);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(variables.width, variables.height);
renderer.setClearColor(0x111111);

updateAllMaterials();

window.addEventListener("resize", (e) => {
  variables.height = e.target.window.innerHeight;
  variables.width = e.target.window.innerWidth;

  camera.aspect = variables.width / variables.height;
  camera.updateProjectionMatrix();

  renderer.setSize(variables.width, variables.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const controls = new OrbitControls(camera, canvas);

const clock = new THREE.Clock();

const updateFrame = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();
  renderer.render(scene, camera);

  window.requestAnimationFrame(updateFrame);
};

updateFrame();
