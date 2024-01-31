import * as THREE from "three";
import GUI from "lil-gui";

import "./style.css";

const variables = {
  width: window.innerWidth,
  height: window.innerHeight,
  particleCount: 7000,
  particleSize: 0.02,
  radius: 3,
  branches: 5,
  spin: 1.5,
  insideColor: "#ff8844",
  outsideColor: "#0088ee",
};

const gui = new GUI({
  width: 200,
  title: "Debug Panel",
  closeFolders: true,
});

gui
  .add(variables, "particleCount")
  .min(1000)
  .max(10000)
  .step(1000)
  .onFinishChange(generateGalaxy);
gui
  .add(variables, "particleSize")
  .min(0.015)
  .max(0.02)
  .step(0.001)
  .onFinishChange(generateGalaxy);

const canvas = document.querySelector("canvas.three");
const scene = new THREE.Scene();

let particleMaterial = null;
let particleGeometry = null;
let particles = null;

function generateGalaxy() {
  if (particles !== null) {
    // We have to dispose of everything when updating through the debugger
    particleGeometry.dispose();
    particleMaterial.dispose();
    scene.remove(particles);
  }

  particleGeometry = new THREE.BufferGeometry();
  const vertices = new Float32Array(variables.particleCount * 3);
  const colors = new Float32Array(variables.particleCount * 3); // Also needs three values (r, g, b)

  const colorInside = new THREE.Color(variables.insideColor);
  const colorOutside = new THREE.Color(variables.outsideColor);

  particleMaterial = new THREE.PointsMaterial({
    size: variables.particleSize,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  for (let i = 0; i < variables.particleCount; i++) {
    const i3 = i * 3;
    const randomness = 2;

    const randomX =
      Math.pow(Math.random(), randomness) *
      (Math.random() < 0.5 ? 0.05 : -0.35);
    const randomY =
      Math.pow(Math.random(), randomness) *
      (Math.random() < 0.5 ? 0.05 : -0.35);
    const randomZ =
      Math.pow(Math.random(), randomness) *
      (Math.random() < 0.5 ? 0.05 : -0.35);

    // The radius is the width from the center to the side of the circle
    const radius = Math.random() * variables.radius;
    // (i % variables.branches) will make sure we switch angles in a round robin way
    // By multiplying with Math.PI * 2, we skip through the circle's radius in even steps
    const angle = ((i % variables.branches) / variables.branches) * Math.PI * 2;

    // The further away, the bigger the radius, the higher the spin
    const spin = radius * variables.spin;

    // To position on a circle we need to use the angle in sin and cos on different axes
    vertices[i3] = Math.cos(angle + spin) * radius + randomX; // the x vertex
    vertices[i3 + 1] = randomY; // the y vertex
    vertices[i3 + 2] = Math.sin(angle + spin) * radius + randomZ; // the z vertex

    // Clone makes sure we don't change the original value
    const mixedColor = colorInside.clone();
    // Lerp will mix two THREE.Color instances
    mixedColor.lerp(colorOutside, radius / variables.radius);

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(vertices, 3)
  );

  particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);
}
generateGalaxy();

const camera = new THREE.PerspectiveCamera(
  65,
  variables.width / variables.height
);
camera.position.x = -3;
camera.position.y = 2;
camera.position.z = 1;
camera.lookAt(particles.position);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(variables.width, variables.height);
renderer.setClearColor(0x111111);

const clock = new THREE.Clock();

const updateFrame = () => {
  const elapsedTime = clock.getElapsedTime();
  particles.rotation.y = elapsedTime * 0.05;
  renderer.render(scene, camera);
  window.requestAnimationFrame(updateFrame);
};

updateFrame();

window.addEventListener("resize", (e) => {
  variables.height = e.target.window.innerHeight;
  variables.width = e.target.window.innerWidth;

  camera.updateProjectionMatrix();

  renderer.setSize(variables.width, variables.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
