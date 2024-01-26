import * as THREE from "three";

const canvas = document.querySelector("canvas.three");

// Scene
const scene = new THREE.Scene();

// Geometry
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Material
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});

// Mesh - a visible object, combination between two things, the geometry (shape) and the material (how it looks)
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

const sizes = {
  height: 600,
  width: 800,
};

// Camera, the field of view is given vertically
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.x = -1;
camera.position.y = 0;
camera.position.z = 3;
scene.add(camera); // is optional, but if you don't add it you can get bugs

// Renderer - renders the scene from the camera's pov, result is drawn on canvas which can be created and added to the page manually or automatically by the renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
