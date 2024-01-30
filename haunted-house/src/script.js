import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import gsap from "gsap";

import "./style.css";

const gui = new GUI({
  width: 200,
  title: "Debug Panel",
  closeFolders: true,
});

const variables = {
  sceneHeight: window.innerHeight,
  sceneWidth: window.innerWidth,
  hemisphereSkyColor: "#0088ff",
  hemisphereGroundColor: "#bb0000",
};

const triggers = {};

const canvas = document.querySelector("canvas.three");
const scene = new THREE.Scene();

const moonLight = new THREE.DirectionalLight(0xaaaaff, 1);
scene.add(moonLight);

const moonLightHelper = new THREE.DirectionalLightHelper(moonLight);
moonLight.position.y = 14;
moonLight.position.z = 8;
moonLight.position.x = 20;
scene.add(moonLightHelper);

const hemisphereLight = new THREE.HemisphereLight(
  variables.hemisphereSkyColor,
  variables.hemisphereGroundColor,
  0.8
);
scene.add(hemisphereLight);

gui
  .add(hemisphereLight, "intensity")
  .name("Hemisphere Intensity")
  .min(0)
  .max(5)
  .step(0.1);
gui
  .addColor(variables, "hemisphereSkyColor")
  .name("Sky Light Color")
  .onChange((value) => {
    hemisphereLight.color.set(value);
  });
gui
  .addColor(variables, "hemisphereGroundColor")
  .name("Ground Light Color")
  .onChange((value) => {
    hemisphereLight.groundColor.set(value);
  });

const textureLoader = new THREE.TextureLoader();

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(24, 24),
  new THREE.MeshStandardMaterial({
    color: 0x006622,
  })
);
floor.rotation.x += Math.PI * -0.5;
scene.add(floor);

const house = new THREE.Group();
scene.add(house);

const houseBodyMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });

const houseBody = new THREE.Mesh(
  new THREE.BoxGeometry(8, 5, 5),
  houseBodyMaterial
);
houseBody.position.y = 2.5;
house.add(houseBody);

const houseHallBody = new THREE.Mesh(
  new THREE.BoxGeometry(2.5, 7.5, 2.5),
  houseBodyMaterial
);
houseHallBody.position.y = 3.75;
houseHallBody.position.z = 3.75;
houseHallBody.position.x = -1;
house.add(houseHallBody);

const houseCornerGeometry = new THREE.ConeGeometry(4.5, 4, 4);

const houseRoofLeft = new THREE.Mesh(houseCornerGeometry, roofMaterial);
houseRoofLeft.position.x = -2;
houseRoofLeft.position.y = 7;
houseRoofLeft.rotation.y = Math.PI * 0.25;
house.add(houseRoofLeft);

const houseRoofMiddle = new THREE.Mesh(
  new THREE.ConeGeometry(6, 5, 4),
  roofMaterial
);
houseRoofMiddle.position.y = 7.5;
houseRoofMiddle.rotation.y = Math.PI * 0.25;
house.add(houseRoofMiddle);

const houseRoofRight = new THREE.Mesh(houseCornerGeometry, roofMaterial);
houseRoofRight.position.x = 2;
houseRoofRight.position.y = 7;
houseRoofRight.rotation.y = Math.PI * 0.25;
house.add(houseRoofRight);

const hallRoof = new THREE.Mesh(new THREE.ConeGeometry(3, 3, 5), roofMaterial);
hallRoof.position.y = 9;
hallRoof.position.z = 3.75;
hallRoof.position.x = -1;
house.add(hallRoof);

const camera = new THREE.PerspectiveCamera(
  45,
  variables.sceneHeight / variables.sceneWidth,
  0.01,
  100
);
camera.position.y = 10;
camera.position.x = -10;
camera.position.z = 30;
camera.lookAt(house.position);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(variables.sceneWidth, variables.sceneHeight);
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

window.addEventListener("resize", (e) => {
  variables.sceneHeight = e.target.window.innerHeight;
  variables.sceneWidth = e.target.window.innerWidth;

  camera.aspect = variables.sceneWidth / variables.sceneHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(variables.sceneWidth, variables.sceneHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
