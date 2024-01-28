import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import gsap from "gsap";

import "./style.css";

// lil-gui has different types of tweaks: range, color, text, checkbox, select and button
// You only tweak properties of objects, which means that when you want to add custom variables, you have to make an object with properties
const gui = new GUI({
  // Parameters are optional to change the appearance
  width: 200,
  title: "Debugger",
  closeFolders: true,
});

// You can hide the GUI by default and then add an event listener to show it on a specified action
// gui.hide()

const variables = {
  cubeColor: "#74a7fe",
  cubeSubdivisions: 2,
};

const triggers = {
  sayHello: () => {
    alert("Hello");
  },
  rotateCube: () => {
    gsap.to(cube.rotation, { y: cube.rotation.y + Math.PI / 2 });
  },
};

const canvas = document.querySelector("canvas.three");
const scene = new THREE.Scene();
const sizes = {
  height: window.innerHeight,
  width: window.innerWidth,
};

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 2, 2, 2),
  new THREE.MeshBasicMaterial({ color: variables.cubeColor, wireframe: true })
);
scene.add(cube);

// You can create folders in debug ui, these can also be nested or closed on load with close()
const cubeDebugOptions = gui.addFolder("Cube");

// cube.position is the object (Vector3), y is the property
// gui.add(cube.position, "y", -3, 3, 0.1);

// You can also use methods to make it more readable
cubeDebugOptions
  .add(cube.position, "y")
  .name("Cube Elevation")
  .min(-3)
  .max(3)
  .step(0.01)
  .setValue(0.05);

// For some properties you automatically get a different GUI setting, this one adds a checkbox
cubeDebugOptions.add(cube, "visible").name("Cube Visibility");
cubeDebugOptions
  .add(cube.material, "wireframe")
  .name("Cube Wireframe")
  .setValue(false);

// Color has it's own method for adding a field to the debug panel
// Three.js applies some color management to optimise the rendering. The color being displayed in the tweak isn't the same as the one being used.
// You can retrieve the modified color with getHexString() on change with onChange() and update the color accordingly
// The better solution is only dealing with non-modified colors by creating the color outside of Three.js, and changing the material's color on change
cubeDebugOptions
  .addColor(variables, "cubeColor")
  .name("Cube Color")
  .onChange(() => {
    cube.material.color.set(variables.cubeColor);
  });

// For functions we also create an object, because like mentioned we can only add properties (or in this case methods) from objects
gui.add(triggers, "sayHello");
cubeDebugOptions.add(triggers, "rotateCube");

// Some properties will be used only once when generating the geometry
// In this case we need to recreate the geometry
cubeDebugOptions
  .add(variables, "cubeSubdivisions")
  .name("Cube Subdivisions")
  .min(1)
  .max(10)
  .step(1)
  // Building a geometry can use a lot of CPU, so it's better to use onFinishChange()
  .onFinishChange((value) => {
    // The old geometries are still in GPU memory which can create memory leaks, so these need to be disposed
    cube.geometry.dispose();
    cube.geometry = new THREE.BoxGeometry(1, 1, 1, value, value, value);
  });

const camera = new THREE.PerspectiveCamera(
  65,
  sizes.width / sizes.height,
  0.01,
  100
);
camera.position.y = 1;
camera.position.z = 3;
camera.lookAt(cube.position);
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
