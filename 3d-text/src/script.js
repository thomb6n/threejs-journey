import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

import "./style.css";
import typeface from "three/examples/fonts/optimer_bold.typeface.json";

// For the TextBufferGeometry we need a font format called typeface
// You can convert a font to a typeface on gero3.github.io/facetype.js
// You can also use fonts provided by Three.js

const canvas = document.querySelector("canvas.three");
const scene = new THREE.Scene();
const sizes = {
  height: window.innerHeight,
  width: window.innerWidth,
};

const axesHelper = new THREE.AxesHelper(1);
// scene.add(axesHelper);

const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
matcapTexture.colorSpace = THREE.SRGBColorSpace;
const matcapMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

// You need to import the FontLoader explicitly and then load the fonts
const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_bold.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Cloudy with a chance of donuts", {
    font: font,
    size: 0.5,
    height: 0.05,
    curveSegments: 6, // Depends how many triangles are used for curves
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 2, // Depends how many triangles are used for bevels
  });

  // More matcaps are available on github.com/nidorx/matcaps
  const text = new THREE.Mesh(textGeometry, matcapMaterial);

  // Bounding is information associated with a geometry that tells what space it's occupying, can be a box or sphere
  // It helps Three.js calculate if the object is on the screen (frustum culling, e.g. not rendering if something is behind the camera)
  textGeometry.computeBoundingBox(); // If you don't calculate first, it's null
  console.log(textGeometry.boundingBox); // Returns a Box3 with min and max value

  // We use it to center the text geometry by moving it back by half the size
  // textGeometry.translate(
  //   -(textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x) / 2,
  //   -(textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y) / 2,
  //   -(textGeometry.boundingBox.max.z - textGeometry.boundingBox.min.z) / 2
  // );

  // We can also do it the easy way
  textGeometry.center();

  scene.add(text);
});

const torusGeometry = new THREE.TorusGeometry(0.25, 0.15, 20, 45);

console.time("donuts");

for (let i = 0; i < 200; i++) {
  const donut = new THREE.Mesh(torusGeometry, matcapMaterial);

  donut.position.set(
    (Math.random() - 0.5) * 14,
    (Math.random() - 0.5) * 14,
    (Math.random() - 0.5) * 14
  );

  donut.rotation.set(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  );

  const randomScale = Math.random() + 0.5;
  donut.scale.set(randomScale, randomScale, randomScale);

  scene.add(donut);
}

console.timeEnd("donuts");

const camera = new THREE.PerspectiveCamera(
  65,
  sizes.width / sizes.height,
  0.01,
  100
);
camera.position.y = 1;
camera.position.z = 3;
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

  controls.update(0.005 * deltaTime);

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
