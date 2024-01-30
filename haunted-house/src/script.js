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
  hemisphereSkyColor: "#0061ff",
  hemisphereGroundColor: "#bb0000",
};

const triggers = {};

const canvas = document.querySelector("canvas.three");
const scene = new THREE.Scene();

const moonLight = new THREE.DirectionalLight(0x7777ff, 1);
scene.add(moonLight);

const moonLightHelper = new THREE.DirectionalLightHelper(moonLight);
moonLight.position.y = 14;
moonLight.position.z = 8;
moonLight.position.x = 20;
scene.add(moonLightHelper);

const hemisphereLight = new THREE.HemisphereLight(
  variables.hemisphereSkyColor,
  variables.hemisphereGroundColor,
  0.5
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

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(30, 36),
  new THREE.MeshStandardMaterial({
    color: 0x006622,
  })
);
ground.rotation.x += Math.PI * -0.5;
scene.add(ground);

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
  new THREE.CylinderGeometry(1.5, 1.5, 7.5, 5),
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

const houseHallRoof = new THREE.Mesh(
  new THREE.ConeGeometry(2.5, 4, 5),
  roofMaterial
);
houseHallRoof.position.y = 9.5;
houseHallRoof.position.z = 3.75;
houseHallRoof.position.x = -1;
house.add(houseHallRoof);

const houseWindowFront = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 2),
  new THREE.MeshBasicMaterial({ color: 0xfbca24 })
);
houseWindowFront.position.set(2.5, 3, 2.5 + 0.05);
house.add(houseWindowFront);

const houseWindowLeft = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 2),
  new THREE.MeshBasicMaterial({ color: 0xfbca24 })
);
houseWindowLeft.position.set(-4.03 - 0.05, 3, 1);
houseWindowLeft.rotation.y = Math.PI * -0.5;
house.add(houseWindowLeft);

const leftWindowLight = new THREE.PointLight("#fbca24", 8, 5);
leftWindowLight.position.set(-3.95 - 0.05, 3, 1);
leftWindowLight.rotation.y = Math.PI * -0.5;
house.add(leftWindowLight);

const frontWindowLight = new THREE.PointLight("#fbca24", 8, 5);
frontWindowLight.position.set(2.5, 3, 2.4);
frontWindowLight.rotation.y = Math.PI * -0.5;
house.add(frontWindowLight);

const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.7, 1.4, 0.25);
const graveMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });

for (let i = 0; i < 20; i++) {
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  const angle = Math.PI * 2 * Math.random();
  const radius = 7 + Math.random() * 8;

  grave.position.x = Math.sin(angle) * radius;
  grave.position.z = Math.cos(angle) * radius;
  grave.position.y = 0.5;
  grave.rotation.y = Math.random() - 0.5;
  grave.rotation.x = (Math.random() - 0.5) * 0.05;
  graves.add(grave);
}

const camera = new THREE.PerspectiveCamera(
  45,
  variables.sceneWidth / variables.sceneHeight,
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
