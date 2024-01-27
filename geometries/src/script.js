import * as THREE from "three";
import "./style.css";

// A geometry is composer of vertices (point coordinates in 3D spaces) and faces (triangles that join those vertices to create a surface)
// They can be used for meshes as well as for particles - then there are no faces, just vertices (plural of vertex)
// They can store more data than just positions (UV coordinates, normals, colors, etc.)
// All geometries inherit from the BufferGeometry class, the geometry classes ending in -Geometry are:
// Plane, Circle, Cone, Cylinder, Ring, Torus, TorusKnot, Dodecahedron, Octahedron, Tetrahedon, Icosahedron, Sphere, Tube, Extrude, Lathe, Text

const canvas = document.querySelector("canvas.three");
const scene = new THREE.Scene();
const sizes = {
  height: window.innerHeight,
  width: window.innerWidth,
};

// When creating a BufferGeometry we need to store vertices positioning data with a Float32Array
// Float32Array is a typed array that only store one type, in this case floats of a fixed length (32 bits or 4 bytes)
// The digits are the x, y and z positions for three points
// You can only render triangles, so when making e.g. a square you need to give positions for two triangles
// In that case, triangles can share vertices, we can re-use those vertices to send less data, but it's harder as well
// Every triangle has 9 points, 3 points (x, y, z) per point that makes up the triangle
const vertices = new Float32Array([
  0, 0, 0, 0, 1, 0, 1, 0, 0,
  // 0, 1, 0, 1, 1, 0, 1, 0, 0,
]);

// The empty BufferGeometry, we'll populate this with vertices positioning information
const geometry = new THREE.BufferGeometry();

// We use the Float32Array to make a BufferAttribute and assign it to the position attribute on the geometry
// The attributes will be used inside the shaders, faces get added automatically
geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

const cube = new THREE.Mesh(
  // new THREE.BoxGeometry(1, 1, 1, 2, 2, 2),
  geometry,
  new THREE.MeshBasicMaterial({ color: 0x0ff0a0, wireframe: true })
);
scene.add(cube);

const camera = new THREE.PerspectiveCamera(
  65,
  sizes.width / sizes.height,
  1,
  100
);
camera.position.y = 1;
camera.position.z = 3;
camera.lookAt(cube.position);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height);

let time = Date.now();

const tick = () => {
  const currentTime = Date.now();
  const deltaTime = currentTime - time;
  time = currentTime;

  cube.rotation.y += deltaTime * 0.001;

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

window.addEventListener("dblclick", (e) => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

window.addEventListener("resize", (e) => {
  sizes.height = e.target.window.innerHeight;
  sizes.width = e.target.window.innerWidth;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
