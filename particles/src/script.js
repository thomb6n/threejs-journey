import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./style.css";

/**
Creating particles is similar to creating a mesh
You need a Geometry, a PointsMaterial and a Points instance (instead of a Mesh)

When you add particles you can often still see the edges
This is because particles are drawn in the same order as they are created
WebGL doesn't know which one is in front of the other

One way to fix this is using the alphaTest, which enables WebGL to know when to render a pixel according to its transparency
The default value is 0, meaning it will always be rendered, we can try 0.001

When drawing, WebGL tests if what's being drawn is closer than what's already drawn
This is called depth testing and can be deactivated with depthTest
It can create bugs if you have other objects that should hide particles behind it

You can also opt to not write particles to the depth buffer by using depthWrite

You have to test to find the best solution

WebGL currently draws pixels on top of each other, for better performance
With blending we can tell WebGL to add the color of the pixel to the pixel already drawn

The particles position array is saved inside an attribute
You can access it when you want to update each vertex separately in particlesGeometry.attributes.position.array
Note that every vertex has 3 values (x, y, z)
When you update this, you need to set particlesGeometry.attributes.position.needsUpdate to true
You should avoid this technique because it's bad for performance, it's better to use a custom shader which we will do later
*/

const canvas = document.querySelector("canvas.three");
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/textures/particles/8.png");

const planetGeometry = new THREE.SphereGeometry(1, 32, 32);
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 2000;

// You can also do this for colors
const vertices = new Float32Array(starsCount * 3);
for (let i = 0; i < starsCount * 3; i++) {
  vertices[i] = (Math.random() - 0.5) * 10;
}
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.02,
  sizeAttenuation: true, // Makes particles bigger when they're closer to the camera
  alphaMap: particleTexture,
  alphaTest: 0.001,
  transparent: true,
  // depthTest: false,
});
starsGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
const stars = new THREE.Points(starsGeometry, particlesMaterial);
scene.add(stars);

const planet = new THREE.Points(planetGeometry, particlesMaterial);
scene.add(planet);

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 0.5, 0.5),
  new THREE.MeshBasicMaterial({ color: 0x0ff0a0, wireframe: true })
);
scene.add(cube);

const sizes = {
  height: window.innerHeight,
  width: window.innerWidth,
};

window.addEventListener("resize", (e) => {
  sizes.height = e.target.window.innerHeight;
  sizes.width = e.target.window.innerWidth;
  camera.aspect = sizes.width / sizes.height;

  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(
  65,
  sizes.width / sizes.height,
  0.01,
  1000
);
camera.position.y = 1;
camera.position.z = 3;
camera.lookAt(cube.position);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.enableZoom = false;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height);

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  planet.rotation.y = elapsedTime * 0.03;
  planet.rotation.x = elapsedTime * 0.03;
  planet.rotation.z = elapsedTime * 0.03;

  stars.rotation.y = elapsedTime * -0.05;
  stars.rotation.x = elapsedTime * -0.05;
  stars.rotation.z = elapsedTime * -0.05;

  controls.update();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
