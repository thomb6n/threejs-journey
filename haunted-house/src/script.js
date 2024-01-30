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

const fog = new THREE.Fog("#002222", 1, 60);
scene.fog = fog;

const moonLight = new THREE.DirectionalLight(0x7777ff, 1);
scene.add(moonLight);

const moonLightHelper = new THREE.DirectionalLightHelper(moonLight);
moonLight.position.y = 14;
moonLight.position.z = 8;
moonLight.position.x = 20;
scene.add(moonLightHelper);
moonLightHelper.visible = false;

const hemisphereLight = new THREE.HemisphereLight(
  variables.hemisphereSkyColor,
  variables.hemisphereGroundColor,
  0.6
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

const groundColorTexture = textureLoader.load(
  "/textures/ground/GroundDirtRocky020_COL_2K.jpg"
);
groundColorTexture.colorSpace = THREE.SRGBColorSpace;
const groundAmbientOcclusionTexture = textureLoader.load(
  "/textures/ground/GroundDirtRocky020_AO_2K.jpg"
);
const groundNormalTexture = textureLoader.load(
  "/textures/ground/GroundDirtRocky020_NRM_2K.jpg"
);
const groundDisplacementTexture = textureLoader.load(
  "/textures/ground/GroundDirtRocky020_DISP_2K.jpg"
);
groundColorTexture.repeat.set(8, 8);
groundNormalTexture.repeat.set(8, 8);
groundAmbientOcclusionTexture.repeat.set(8, 8);
groundDisplacementTexture.repeat.set(8, 8);

// This is needed to repeat textures
groundColorTexture.wrapS = THREE.RepeatWrapping;
groundNormalTexture.wrapS = THREE.RepeatWrapping;
groundAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
groundDisplacementTexture.wrapS = THREE.RepeatWrapping;
groundColorTexture.wrapT = THREE.RepeatWrapping;
groundNormalTexture.wrapT = THREE.RepeatWrapping;
groundAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
groundDisplacementTexture.wrapT = THREE.RepeatWrapping;

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(60, 60),
  new THREE.MeshStandardMaterial({
    map: groundColorTexture,
    aoMap: groundAmbientOcclusionTexture,
    normalMap: groundNormalTexture,
    displacementMap: groundDisplacementTexture,
    displacementScale: 0.1,
  })
);
ground.rotation.x += Math.PI * -0.5;
scene.add(ground);

const house = new THREE.Group();
scene.add(house);

const houseBodyColorTexture = textureLoader.load(
  "/textures/walls/StoneBricksSplitface001_COL_2K.jpg"
);
houseBodyColorTexture.colorSpace = THREE.SRGBColorSpace;
const houseBodyAmbientOcclusionTexture = textureLoader.load(
  "/textures/walls/StoneBricksSplitface001_AO_2K.jpg"
);
const houseBodyNormalTexture = textureLoader.load(
  "/textures/walls/StoneBricksSplitface001_NRM_2K.png"
);

const houseBodyMaterial = new THREE.MeshStandardMaterial({
  map: houseBodyColorTexture,
  aoMap: houseBodyAmbientOcclusionTexture,
  normalMap: houseBodyNormalTexture,
});

const roofColorTexture = textureLoader.load(
  "/textures/roof/RoofShinglesOld002_COL_2K.png"
);
roofColorTexture.colorSpace = THREE.SRGBColorSpace;
const roofAmbientOcclusionTexture = textureLoader.load(
  "/textures/roof/RoofShinglesOld002_AOL_2K.png"
);
const roofNormalTexture = textureLoader.load(
  "/textures/roof/RoofShinglesOld002_NRM_2K.png"
);
const roofRoughnessTexture = textureLoader.load(
  "/textures/roof/RoofShinglesOld002_ROUGHNESS_2K.png"
);
const roofMetalnessTexture = textureLoader.load(
  "/textures/roof/RoofShinglesOld002_METALNESS_2K.png"
);

const roofMaterial = new THREE.MeshStandardMaterial({
  map: roofColorTexture,
  aoMap: roofAmbientOcclusionTexture,
  normalMap: roofNormalTexture,
  metalnessMap: roofMetalnessTexture,
  roughnessMap: roofRoughnessTexture,
});

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

const windowGeometry = new THREE.PlaneGeometry(0.85, 2);
const windowMaterial = new THREE.MeshBasicMaterial({ color: 0xfbca24 });

const houseWindowFront = new THREE.Mesh(windowGeometry, windowMaterial);
houseWindowFront.position.set(2.5, 3, 2.5 + 0.05);
house.add(houseWindowFront);

const houseWindowLeft = new THREE.Mesh(windowGeometry, windowMaterial);
houseWindowLeft.position.set(-4.03 - 0.05, 3, 1);
houseWindowLeft.rotation.y = Math.PI * -0.5;
house.add(houseWindowLeft);

const leftWindowLight = new THREE.PointLight("#fbca24", 8, 5);
leftWindowLight.position.set(-3.85 - 0.05, 3, 1);
leftWindowLight.rotation.y = Math.PI * -0.5;
house.add(leftWindowLight);

const frontWindowLight = new THREE.PointLight("#fbca24", 8, 5);
frontWindowLight.position.set(2.5, 3, 2.4);
frontWindowLight.rotation.y = Math.PI * -0.5;
house.add(frontWindowLight);

const graves = new THREE.Group();
scene.add(graves);

const graveAmbientOcclusionTexture = textureLoader.load(
  "/textures/grave/MetalZincGalvanized001_AO_2K.png"
);
const graveNormalTexture = textureLoader.load(
  "/textures/grave/MetalZincGalvanized001_NRM_2K.png"
);
const graveRoughnessTexture = textureLoader.load(
  "/textures/grave/MetalZincGalvanized001_ROUGHNESS_2K.png"
);
const graveMetalnessTexture = textureLoader.load(
  "/textures/grave/MetalZincGalvanized001_METALNESS_2K.png"
);

const graveGeometry = new THREE.BoxGeometry(
  0.7 + Math.random(),
  1.4 + Math.random(),
  0.25
);
const graveMaterial = new THREE.MeshStandardMaterial({
  color: 0x444444,
  aoMap: graveAmbientOcclusionTexture,
  normalMap: graveNormalTexture,
  roughnessMap: graveRoughnessTexture,
  metalnessMap: graveMetalnessTexture,
});

for (let i = 0; i < 40; i++) {
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  const angle = Math.PI * 2 * Math.random();
  const radius = 7 + Math.random() * 20;

  grave.position.x = Math.sin(angle) * radius;
  grave.position.z = Math.cos(angle) * radius;
  grave.position.y = 0.5;
  grave.rotation.y = Math.random() - 0.5;
  grave.rotation.x = (Math.random() - 0.5) * 0.05;
  graves.add(grave);
}

const ghost = new THREE.PointLight("#d4e3fe", 3, 5);
const ghost2 = new THREE.PointLight("#d4e3fe", 3, 5);
const ghost3 = new THREE.PointLight("#d4e3fe", 3, 5);
scene.add(ghost, ghost2, ghost3);

const camera = new THREE.PerspectiveCamera(
  65,
  variables.sceneWidth / variables.sceneHeight,
  0.01,
  100
);
camera.position.y = 1;
camera.position.x = -15;
camera.position.z = 18;
camera.lookAt(house.position);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(variables.sceneWidth, variables.sceneHeight);
renderer.setClearColor("#002222");
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  const ghostAngle = elapsedTime * 0.5;
  ghost.position.x = Math.cos(ghostAngle) * 10;
  ghost.position.z = Math.sin(ghostAngle) * 13;
  ghost.position.y = Math.sin(elapsedTime * 3) + 2;

  const ghost2Angle = elapsedTime * -0.6;
  ghost2.position.x = Math.cos(ghost2Angle) * 18;
  ghost2.position.z = Math.sin(ghost2Angle) * 17;
  ghost2.position.y = Math.sin(elapsedTime * 2.6) + 2;

  const ghost3Angle = elapsedTime * -0.32;
  ghost3.position.x = Math.cos(ghost3Angle) * 14;
  ghost3.position.z = Math.sin(ghost3Angle) * 8;
  ghost3.position.y = Math.sin(elapsedTime * 2.4) + 2;

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
