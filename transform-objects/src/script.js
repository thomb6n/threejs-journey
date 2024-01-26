import * as THREE from "three";

// 4 properties to transform objects: position, scale, rotation, quaternation
// All subclasses from Object3D (like cameras and meshes) have these properties
// The properties will be compiled to matrices

const canvas = document.querySelector("canvas.three");

const scene = new THREE.Scene();

const material = new THREE.MeshBasicMaterial({ color: 0x00aaff });
const geometry = new THREE.BoxGeometry(1, 1, 1);
const mesh = new THREE.Mesh(geometry, material);

// Positioning units are arbitrary, you can decide if a unit is 1cm, 1m, 1km, etc.
// You can also use position.set()
mesh.position.x = 1.65;
mesh.position.y = 0.25;
mesh.position.z = -1;

mesh.scale.set(0.5, 1, 1.5);

// Rotation vs. quaternion, updating one will automatically update the other
// Rotation isn't just an object, it inherits from the Euler object, it rotates around an axis
// Half a rotation is Math.PI, a full rotation is Math.PI * 2
// When rotating, be careful of the order, the axes are rotating as well, you can change this order with rotation.reorder()
// You can use this to avoid a gimbal lock where an axis is stuck, because this can get complicated we can use quaternion
// Quaternion expresses rotation in a more mathematical way, but it's a bit harder to visualize, look it up later
mesh.rotation.y = 0.4;

// You can also instantiate a Mesh with Geometry and Material at once
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 0.5, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ffcc })
);

const { width, height } = {
  height: 600,
  width: 800,
};

const camera = new THREE.PerspectiveCamera(45, width / height);
camera.position.set(0.75, 1, 4);
scene.add(camera);

// Position isn't just an object, it's a Vector3 object with a lot of methods
// You can for example get the distance to the camera
console.log(
  "Distance from mesh to camera",
  mesh.position.distanceTo(camera.position)
);

// Or normalize, which takes the vector length and reduces it to 1, will get into more depth later
console.log("Normalized mesh", mesh.position.normalize());

// You can tell any Object3D to look at another object, by giving it a Vector3
camera.lookAt(mesh.position);

// Helps to see the axes when positioning
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

// You can create groups, Group inherits from Object3D meaning you can make changes to the entire group
let group = new THREE.Group();
group.add(mesh);
group.add(cube);
group.position.x = 0.25;
scene.add(group);

// If you change the positioning after rendering, it won't be visible
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(width, height);
renderer.render(scene, camera);
