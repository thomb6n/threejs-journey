import * as THREE from "three";

// Camera is an abstract class that you don't use directly, you use a subclass like PerspectiveCamera
// 1. ArrayCamera - renders the scene from multiple cameras (like in splitscreen when gaming)
// 2. StereoCamera - render a scene through two cameras that mimic eyes, creating a parallax effect for e.g. VR headsets
// 3. CubeCamera - does 6 renders, one on each side of the cube, renders the surroundings for things like environment maps, reflections and shadow maps
// 4. OrthographicCamera - renders the scene without perspective (we'll use this)
// 5. PerspectiveCamera - renders the scene with perspective (we'll use this as well)

const canvas = document.querySelector("canvas.three");

const scene = new THREE.Scene();

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xf0ffa0 })
);
cube.rotation.y = Math.PI * 0.25;

scene.add(cube);

const { height, width } = {
  height: 600,
  width: 800,
};

// Perspective Camera
// The first parameter is the vertical field of view in degrees, when you make it bigger the field distorts (like with fisheye)
// The second parameter is the aspect ratio, taking the width and dividing it by the height of the scene
// The third and fourth are the near and far planes, everything that falls outside of those won't show up in the render (extreme values cause z-fighting)
// Together these all make the frustum
const camera = new THREE.PerspectiveCamera(60, width / height, 1, 100);

// Orthographic Camera
// The first four parameters are the left, right, top and bottom
// The last two are the near and far planes again
// Without aspect ratio, the render size squeezes the camera's square to fit
// Together these all make the frustum
// const aspectRatio = width / height;
// const camera = new THREE.OrthographicCamera(
//   -2 * aspectRatio,
//   2 * aspectRatio,
//   2,
//   -2,
//   0.1,
//   100
// );

camera.position.z = 2;
camera.position.y = 0;
camera.lookAt(cube.position);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(width, height);
renderer.render(scene, camera);
