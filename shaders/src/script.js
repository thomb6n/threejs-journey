import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./style.css";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

/**
 * A shader is a program written in GLSL that is sent to the GPU
 * It positions each vertex and colors each pixel of the geometry
 * It would be more accurate to say each fragment instead of each pixel
 *
 * We send a lot of data to the shader:
 * - Vertex coordinates
 * - Mesh transformation
 * - Information about the camera
 * - Colors
 * - Textures
 * - Lights
 * - Fog
 * - and more
 *
 * The vertex shader will position all vertices using provided data
 * Every vertex will use the same vertex shader
 * Attributes - data that differs for each vertex (e.g. vertex position)
 * Uniforms - data that's the same for all vertices (e.g. camera position)
 *
 * Once all vertices are placed, the GPU knows what pixels are visible and proceeds to the fragment shader
 *
 * The fragment shader colors each fragment of the geometry using provided data
 * It also gets uniforms, but no attributes because they are linked to specific vertices
 * It's possible to send data from the vertex shader known as varying
 *
 * We can use ShaderMaterial (some code provided) or RawShaderMaterial
 */

const variables = {
  width: window.innerWidth,
  height: window.innerHeight,
  materialColor: "#ffeded",
};

const canvas = document.querySelector("canvas.three");
const scene = new THREE.Scene();

const cube = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1, 32, 32),
  // When using RawShaderMaterial you provide your own shaders
  new THREE.RawShaderMaterial({
    vertexShader,
    fragmentShader,
  })
);
scene.add(cube);

const camera = new THREE.PerspectiveCamera(
  35,
  variables.width / variables.height
);
camera.position.set(-3, 2, 6);
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

const controls = new OrbitControls(camera, canvas);

const clock = new THREE.Clock();

const updateFrame = () => {
  const elapsedTime = clock.getElapsedTime();

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

gui.addColor(variables, "materialColor").onChange(() => {
  cube.material.color.set(variables.materialColor);
});
