import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import "./style.css";

/**
A Raycaster can cast a ray in a specific direction and test what objects intersect with it
You can do things like:
- detect if a player is facing a wall
- test if a laser is hitting something
- test if something is under the mouse to simulate mouse events
- show an alert message if a spaceship is heading towards a planet
*/

const variables = {
  width: window.innerWidth,
  height: window.innerHeight,
  materialColor: "#ffeded",
};

const canvas = document.querySelector("canvas.three");
const scene = new THREE.Scene();

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: variables.materialColor })
);
scene.add(cube);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: variables.materialColor })
);
sphere.position.x = 1.5;
scene.add(sphere);

const cone = new THREE.Mesh(
  new THREE.ConeGeometry(0.5, 1, 16),
  new THREE.MeshBasicMaterial({ color: variables.materialColor })
);
cone.position.x = -1.5;
scene.add(cone);

// Three.js updates the objects' coordinates (matrices) before rendering them, but when we raycast, nothing has been rendered yet
// To get the right distances in the intersect arrays, you need to update their Matrix World manually
// cone.updateMatrixWorld();
// cube.updateMatrixWorld();
// sphere.updateMatrixWorld();

const raycaster = new THREE.Raycaster(
  new THREE.Vector3(-3, 0, 0),
  // Normalizing means reducing the size making the length 1, but keeping the same direction
  new THREE.Vector3(10, 0, 0).normalize()
);

// The raycaster has two options to cast a ray, intersectObject and intersectObjects (plural)
// const intersect = raycaster.intersectObject(sphere);
// console.log(intersect);

// const intersects = raycaster.intersectObjects([sphere, cone]);
// console.log(intersects);

/**
The results contain useful information
- distance - distance between the origin of the ray and the collision point
- face - what face of the geometry was hit by the ray
- faceIndex - the index of the face
- object - what object is colliding with the ray
- point - a Vector3 of the exact position of the collision
- uv - the uv coordinates in that geometry
*/

const camera = new THREE.PerspectiveCamera(
  45,
  variables.width / variables.height
);
camera.position.z = 6;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(variables.width, variables.height);
renderer.setClearColor(0x111111);

window.addEventListener("resize", (e) => {
  variables.height = e.target.window.innerHeight;
  variables.width = e.target.window.innerWidth;

  camera.aspect = variables.width / variables.height;
  camera.updateProjectionMatrix();

  renderer.setSize(variables.width, variables.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// We can also use the raycaster in combination with the mouse
const mouse = new THREE.Vector2();

// We need to get the mouse position and map it on a scale of -1 to 1 on the x and y axes
window.addEventListener("mousemove", (e) => {
  // e.clientX / variables.width gives you a scale of 0 to 1, times 2 - 0 to 2, minus 1, -1 to 1
  mouse.x = (e.clientX / variables.width) * 2 - 1;
  mouse.y = -(e.clientY / variables.height) * 2 + 1;
  // We use these in the updateFrame function, cause the amount of mousemove events can me higher than the framerate
});

// You can also use the currentIntersect variable to get click events
window.addEventListener("click", () => {
  if (currentIntersect != null) {
    console.log("clicked", currentIntersect.object.geometry);
  }
});

const controls = new OrbitControls(camera, canvas);

const clock = new THREE.Clock();

// We can keep track of the current intersect to create our own mouseenter and mouseleave events
let currentIntersect;

const updateFrame = () => {
  const elapsedTime = clock.getElapsedTime();

  // If we animate our objects we need to check for the ray intersecting on every frame
  cone.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  cube.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
  sphere.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

  // You can set the raycaster to start the ray from the mouse position vector
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects([sphere, cone, cube]);

  // Uupdate the currentIntersect
  if (intersects.length) {
    if (currentIntersect == null) {
      console.log("mouse enter");
    }
    currentIntersect = intersects[0];
  } else {
    if (currentIntersect != null) {
      console.log("mouse leave");
    }
    currentIntersect = null;
  }

  // We reset all the colors in case they're not intersecting
  [cone, cube, sphere].forEach((shape) =>
    shape.material.color.set(variables.materialColor)
  );

  // Here we update the color when an object intersects with the ray
  for (const i of intersects) {
    i.object.material.color.set(0xff0000);
  }

  renderer.render(scene, camera);
  controls.update();

  window.requestAnimationFrame(updateFrame);
};

updateFrame();

const gui = new GUI({
  width: 200,
  title: "Debug Panel",
  closeFolders: true,
});

gui.addColor(variables, "materialColor").onChange(() => {
  cube.material.color.set(variables.materialColor);
});
