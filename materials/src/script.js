import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import gsap from "gsap";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"; // For environment maps

import "./style.css";

// Materials are used to put color on each pixel of the geometries
// Algorithms that decide the color are written in shaders, Three.js has pre-made shaders

// Some possible material properties are:
// map (for textures), color (can be combined with map), wireframe, opacity (also need to specify transparent)
// alphaMap (for alpha textures, also requires transparent), side (what side is visible)
// Blender uses DoubleSide by default, which is bad for performance, so be careful

const canvas = document.querySelector("canvas.three");
const scene = new THREE.Scene();
const sizes = {
  height: window.innerHeight,
  width: window.innerWidth,
};

// // Light will be covered later, but is required for some materials
// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 30);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// scene.add(pointLight);

// An environment map is an image for the surrounding scene, you can get some on PolyHaven
// Like the lighting, it will be covered later, but is used here to see the effects on materials
const rgbeLoader = new RGBELoader();
const environmentMap = rgbeLoader.load(
  "./textures/environmentMap/2k.hdr",
  (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = environmentMap; // Adds environment to the background
    scene.environment = environmentMap; // Adds reflections on the materials
  }
);

const textureLoader = new THREE.TextureLoader();
const doorAlphaTexture = textureLoader.load("./textures/door/alpha.jpg");
const doorAmbientTexture = textureLoader.load(
  "./textures/door/ambientOcclusion.jpg"
);
const doorColorTexture = textureLoader.load("./textures/door/color.jpg");
doorColorTexture.colorSpace = THREE.SRGBColorSpace;
const doorHeightTexture = textureLoader.load("./textures/door/height.jpg");
const doorMetalnessTexture = textureLoader.load(
  "./textures/door/metalness.jpg"
);
const doorNormalTexture = textureLoader.load("./textures/door/normal.jpg");
const doorRoughnessTexture = textureLoader.load(
  "./textures/door/roughness.jpg"
);
const matcapTexture = textureLoader.load("./textures/matcaps/1.png");
matcapTexture.colorSpace = THREE.SRGBColorSpace;
const gradientTexture = textureLoader.load("./textures/gradients/3.jpg");

// MeshBasicMaterial is the most basic material that has properties that all materials have
const material = new THREE.MeshBasicMaterial({
  map: doorColorTexture,
  alphaMap: doorAlphaTexture,
  transparent: true,
});

// MeshNormalMaterial displays a nice purple color, related to normals
// Normals are encoded information in each vertex that contains the direction of the face (where the outside is)
// Normals are used to calculate how to illuminate the face or how the environment should reflect or refract on the surface
// The color on normals display the orientation relative to the camera
// The normal material has the flatShading property
const normalMaterial = new THREE.MeshNormalMaterial();

// MeshMatcapMaterial is very performant while still looking good
// It needs a referenceTexture that maps to the matcap property (not map!)
// The light in this scene is an illusion, it can not be moved or changed
// You can get matcaps from https://github.com/nidorx/matcaps (check licenses)
const matcapMaterial = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture,
});

// MeshDepthMaterial is used internally by Three.js to save depth, for computations like shadows
const depthMaterial = new THREE.MeshDepthMaterial();

// MeshLambertMaterial requires light to be visible and is the most performant of the ones requiring light
// If you look closely at rounded geometries you can see strange patterns, and the parameters aren't convenient
const lambertMaterial = new THREE.MeshLambertMaterial();

// MeshPhongMaterial also requires light, is a bit less performant
// It does have more properties (shininess, specular) and less glitches, but it's not super realistic
const phongMaterial = new THREE.MeshPhongMaterial();
phongMaterial.shininess = 1000;
phongMaterial.specular = new THREE.Color(0x0000ff);

// MeshToonMaterial has a cartoon effect, it's using something called cell shading often seen in games
// You can add more steps to the default two-part coloration, using a gradientMap and gradient texture
const toonMaterial = new THREE.MeshToonMaterial();
gradientTexture.minFilter = THREE.NearestFilter; // Requires disabling mipmapping
gradientTexture.magFilter = THREE.NearestFilter; // Requires disabling mipmapping
gradientTexture.generateMipmaps = false; // Turning mipmapping off entirely for performance
toonMaterial.gradientMap = gradientTexture;

// MeshStandardMaterial uses physically based rendering principles for a realistic result
// Supports light but with a more realistic algorithm and better parameters (roughness, metalness)
// It's standard because PBR has become the standard
const standardMaterial = new THREE.MeshStandardMaterial();
// standardMaterial.metalness = 0.7;
standardMaterial.metalnessMap = doorMetalnessTexture;
// standardMaterial.roughness = 0.2;
standardMaterial.roughnessMap = doorRoughnessTexture;
standardMaterial.map = doorColorTexture;
standardMaterial.aoMap = doorAmbientTexture; // Creates shade, ao meaning ambient occlusion, only affected by AmbientLight and HemisphereLight
standardMaterial.displacementMap = doorHeightTexture; // Needs a lot of subdivions that are bad for performance
standardMaterial.displacementScale = 0.08;
standardMaterial.alphaMap = doorAlphaTexture;
standardMaterial.transparent = true;
standardMaterial.normalMap = doorNormalTexture;

// MeshPhysicalMaterial extends the standard material, but adds a few effects, worse in performance
const physicalMaterial = new THREE.MeshPhysicalMaterial();
physicalMaterial.metalnessMap = doorMetalnessTexture;
physicalMaterial.roughnessMap = doorRoughnessTexture;
physicalMaterial.map = doorColorTexture;
physicalMaterial.aoMap = doorAmbientTexture; // Creates shade, ao meaning ambient occlusion, only affected by AmbientLight and HemisphereLight
physicalMaterial.displacementMap = doorHeightTexture; // Needs a lot of subdivions that are bad for performance
physicalMaterial.displacementScale = 0.08;
physicalMaterial.alphaMap = doorAlphaTexture;
physicalMaterial.transparent = true;
physicalMaterial.normalMap = doorNormalTexture;

// Clearcoat - simulates a thin layer of varnish on top of the material (bad for performance)
physicalMaterial.clearcoat = 0.4;
physicalMaterial.clearcoatRoughness = 0;

// Sheen - hightlights the material from a narrow angle, usually used on fluffy fabric or plastic
// physicalMaterial.sheen = 1;
// physicalMaterial.sheenRoughness = 0.25;
// physicalMaterial.sheenColor.set(1, 1, 1);

// Iridescence - creates color artifacts like you see on fuel, bubbles or laserdisc
physicalMaterial.iridescence = 1;
physicalMaterial.iridescenceIOR = 1;
physicalMaterial.iridescenceThicknessRange = [100, 800];

// Transmission - enables light to go through the material
physicalMaterial.transmission = 1;
// Index of refraction, depends on the material you want to simulate
// You can look these values up, e.g. water 1.333, diamond 2.417, air 1.000293, index is on Wikipedia
physicalMaterial.ior = 1.5;
physicalMaterial.thickness = 0.5;

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  physicalMaterial
);
scene.add(sphere);
sphere.position.x = -1.25;

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1, 100, 100),
  physicalMaterial
);
scene.add(plane);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  physicalMaterial
);
scene.add(torus);
torus.position.x = 1.25;

const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.01,
  100
);
camera.position.z = 2;
camera.lookAt(sphere.position);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height);

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();
  sphere.rotation.y = elapsedTime * 0.5;
  plane.rotation.y = elapsedTime * 0.5;
  torus.rotation.y = elapsedTime * 0.5;
  sphere.rotation.x = elapsedTime * -0.5;
  plane.rotation.x = elapsedTime * -0.5;
  torus.rotation.x = elapsedTime * -0.5;

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
