import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import CANNON, { Vec3 } from "cannon";

import "./style.css";

/**
You can create physics with math and solutions like Raycaster
If you want realistic or complicated physics, it's easier to use a library

We make an invisible copy world where the physics calculations will take place
After calculating these values, we apply the updated coordinates to our scene

There are many libraries, some for 3D and some for 2D
Some 3D scenes' physics can be calculated in 2D (e.g. a pool table, pinball)
This helps getting better performance

3D libraries: ammo.js (most used), cannon.js (easiest to implement), oimo.js
2D libraries: matter.js, p2.js, planck.js, box2d.js
*/

const variables = {
  width: window.innerWidth,
  height: window.innerHeight,
  materialColor: "#ffeded",
};

const actions = {};

// You can listen to physical events to respond, in this case with SFX
const hitSound = new Audio("/sounds/hit.mp3");
const playHitSound = (collision) => {
  const impactStrength = collision.contact.getImpactVelocityAlongNormal();
  if (impactStrength > 1.5) {
    hitSound.volume = Math.random();
    hitSound.currentTime = 0; // If it's already playing, reset it
    hitSound.play();
  }
};

const canvas = document.querySelector("canvas.three");
const scene = new THREE.Scene();

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.x = 0;
directionalLight.position.z = 0;
directionalLight.position.y = 25;
directionalLight.castShadow = true;
directionalLight.shadow.camera.near = 0;
directionalLight.shadow.camera.far = 30;
directionalLight.shadow.camera.left = 20;
directionalLight.shadow.camera.top = 20;
directionalLight.shadow.camera.bottom = -20;
directionalLight.shadow.camera.right = -20;
directionalLight.scale.set(10, 10, 10);
scene.add(directionalLight);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  1,
  0xff0000
);
scene.add(directionalLightHelper);
directionalLightHelper.visible = false;

const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(cameraHelper);
cameraHelper.visible = false;

// Creating our physics world
const world = new CANNON.World();

// Add gravity, which has a Cannon.js class called Vec3 (-9.82 is the gravity on earth)
world.gravity = new Vec3(0, -9.82, 0);

/**
Every body is by default checking collisions with every other body, even if they will never get close to each other
We can optimise for this by using the broadphase
- NaiveBroadphase - testing all bodies against each other (default)
- GridBroadphase, divides the scene and tests bodies in the same grid or neighbour grid boxes
- SAPBroadPhase - (Sweep and Prune) tests bodies on arbitrary axes during multiple steps
*/
world.broadphase = new CANNON.SAPBroadphase(world);

// With different broadphases, every body is still testing against other bodies
// We can optimise this by letting bodies sleep, and wake it up when it gets touches
world.allowSleep = true;

// To know how objects behave, they have to have a material (like jelly, concrete, etc)
// const floorMaterial = new CANNON.Material("concrete");
// const ballMaterial = new CANNON.Material("plastic");

// You can often get away with just one basic material, in that case you can set world.defaultContactMaterial
const defaultMaterial = new CANNON.Material("default");

// The contact material decides what happens when two certain material types collide
const contactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1, // Friction on collision
    restitution: 0.7, // Bounciness
  }
);
world.addContactMaterial(contactMaterial);
world.defaultContactMaterial = contactMaterial;

const objects = [];
const boxMaterial = new THREE.MeshStandardMaterial({
  color: variables.materialColor,
});
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const createBox = (scale, position) => {
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.castShadow = true;
  box.scale.set(scale, scale, scale);
  box.position.copy(position);
  scene.add(box);

  // In CANNON, the scale is measured from the center using the half extent (to the corner)
  const shape = new CANNON.Box(
    new CANNON.Vec3(scale / 2, scale / 2, scale / 2)
  );
  const body = new CANNON.Body({
    shape: shape,
    mass: 1,
  });
  body.position.copy(position);

  body.addEventListener("collide", playHitSound);

  world.addBody(body);

  objects.push({
    mesh: box,
    body: body,
  });
};

actions.createBoxDebug = () => {
  createBox(Math.random() * 0.5, {
    x: (Math.random() - 0.5) * 3,
    y: Math.random() * 3,
    z: (Math.random() - 0.5) * 3,
  });
};

const sphereMaterial = new THREE.MeshStandardMaterial({
  color: variables.materialColor,
});
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);

const createBall = (scale, position) => {
  const ball = new THREE.Mesh(sphereGeometry, sphereMaterial);
  ball.castShadow = true;
  ball.scale.set(scale, scale, scale);
  ball.position.copy(position);
  scene.add(ball);

  // In the physics worlds, we make a Body (mesh) and Shape (geometry), which falls and collides
  const shape = new CANNON.Sphere(scale); // Same radius as our ball
  const body = new CANNON.Body({
    shape: shape,
    mass: 1,
  });
  body.position.copy(position);

  body.addEventListener("collide", playHitSound);

  world.addBody(body);

  objects.push({
    mesh: ball,
    body: body,
  });
};

actions.createBallDebug = () => {
  createBall(Math.random() * 0.5, {
    x: (Math.random() - 0.5) * 3,
    y: Math.random() * 3,
    z: (Math.random() - 0.5) * 3,
  });
};

createBall(0.5, { x: 0, y: 3, z: 0 });

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
  shape: floorShape,
  mass: 0,
});

// Rotation in CANNON can only be done using quaternion
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI * -0.5);
world.addBody(floorBody);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(30, 30),
  new THREE.MeshStandardMaterial({ color: 0xffffff })
);
floor.position.y = -0.5;
floor.rotation.x = Math.PI * -0.5;
floor.receiveShadow = true;
scene.add(floor);

const camera = new THREE.PerspectiveCamera(
  35,
  variables.width / variables.height
);
camera.position.z = 10;
camera.position.y = 6;
camera.position.x = -6;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(variables.width, variables.height);
renderer.setClearColor(0xffffff);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

window.addEventListener("resize", (e) => {
  variables.height = e.target.window.innerHeight;
  variables.width = e.target.window.innerWidth;

  camera.aspect = variables.width / variables.height;
  camera.updateProjectionMatrix();

  renderer.setSize(variables.width, variables.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const clock = new THREE.Clock();
let prevTime = 0;

const updateFrame = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - prevTime;
  prevTime = elapsedTime;

  // Update the physics world in steps
  // 1. 1 / 60 for 60 fps
  // 2. deltaTime
  // 3. how many steps we can skip if the physics world is delayed
  // ballBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), ballBody.position);

  world.step(1 / 60, deltaTime, 3);
  // ball.position.set(
  //   ballBody.position.x,
  //   ballBody.position.y,
  //   ballBody.position.z
  // );
  floor.position.set(
    floorBody.position.x,
    floorBody.position.y,
    floorBody.position.z
  );

  for (const object of objects) {
    object.mesh.position.copy(object.body.position);
    object.mesh.quaternion.copy(object.body.quaternion);
  }

  controls.update();
  renderer.render(scene, camera);

  window.requestAnimationFrame(updateFrame);
};

updateFrame();

const gui = new GUI({
  width: 200,
  title: "Debug Panel",
  closeFolders: true,
});

gui.add(actions, "createBallDebug");
gui.add(actions, "createBoxDebug");
