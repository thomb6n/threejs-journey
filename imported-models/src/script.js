import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"; // Needed to load models
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import "./style.css";

/**
You can create complex shapes in dedicated 3D software like Blender
In this project we learn how to import these models

There are a lot of different 3D model formats
Every format has different properties, some are more lightweight than others, they can be open source, etc.
Some popular formats are: OBJ, FBX, STL, PLY, COLLADA, 3DS, GLTF

GLTF (GL Transmission Format) is becoming the standard and is the one we're using
It supports different sets of data like geometries, materials, cameras, lights, animations, etc
It comes in various formats like json, binary and embed textures and is also supported in e.g. game engines

GLTF has different formats itself: glTF, glTF-Binary, glTF-Draco, glTF-Embedded

glTF
Has multiple files
.gltf is a JSON that contains cameras, lights, scenes, materials, transformations
.bin is a binary that usually contains data like the geometries
.png is the texture
If you load the .gltf file, the other files load automatically

glTF-Binary
Is only one file, a .glb binary file, which contains all the data
It's easier to load, usually lighter, but harder to alter its data

glTF-Draco
Has multiple files
The buffer data is compressed using the Draco algorithm, making it much lighter

glTF-Embedded
Is just one file, a .gltf, but it's readable json and thus heavier

You choose one depending on if you want to be able to alter the textures and such later
We need light to see the models, because it's using PBR
*/

const variables = {
  width: window.innerWidth,
  height: window.innerHeight,
  materialColor: "#ffeded",
};

const canvas = document.querySelector("canvas.three");
const scene = new THREE.Scene();

const dracoLoader = new DRACOLoader();
const gltfLoader = new GLTFLoader();

/**
When you load a model, onLoad you get a GLTF object which contains the scene property
This scene property is a THREE.Group that contains the camera, the meshes, etc.
You can use this code for glTF, glTF-Binary and glTF-Embedded, but not for glTF-Draco as it needs a DRACOLoader
*/
gltfLoader.load(
  "models/Duck/glTF/Duck.gltf",
  (gltf) => {
    // The things we need, like a camera and model, are inside gltf.scene.children[0].children
    const duck = gltf.scene.children[0].children[0];

    // There are multiple ways of adding the model to our scene, but the best is to re-open the file in 3D software, clean it, and then export it again

    // You can add all the children to the scene and ignore the things you don't need (like the camera)
    // scene.add(gltf.scene);

    // Or you can filter the children before adding them to the scene (where you'll have to handle the scale, position, etc.)
    // scene.add(gltf.scene.children[0]);
  },
  () => {
    console.log("model is loading");
  },
  (err) => {
    throw Error(err);
  }
);

gltfLoader.load(
  "models/FlightHelmet/glTF/FlightHelmet.gltf",
  (gltf) => {
    /**
    When a model has multiple children, you need to add each separately
    */

    // You can't just loop through the children, you'll end up with missing parts
    // Each time you add one child to the scene, you're making the original array smaller
    // That means when we pick the second object, the original second object is the first in the array and we skip it
    // gltf.scene.children.forEach((child) => {
    //   scene.add(child);
    // });

    // You can use a while loop
    // while (gltf.scene.children.length) {
    //   scene.add(gltf.scene.children[0]);
    // }

    // Or copy the array
    const children = [...gltf.scene.children];
    children.forEach((child) => {
      //scene.add(child);
    });
  },
  () => {
    console.log("model is loading");
  },
  (err) => {
    throw Error(err);
  }
);

/**
The Draco version can be much more lightweight, as compression is applied to buffer data (usually the geometry)
Draco is not exclusive to glTF but got popular at the same time
Google develops the algorithm under an open source license

You can use a WebAssembly decoder by copying the draco folder from three/examples/jsm/libs/draco
This isn't necessary but it is way faster
*/
dracoLoader.setDecoderPath("/draco/");
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load(
  "models/Duck/glTF-Draco/Duck.gltf",
  (model) => {
    console.log("model loaded");
    scene.add(model.scene);
  },
  () => {
    console.log("model loading");
  },
  (err) => {
    console.error(err);
  }
);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x0000ff, 2);
scene.add(directionalLight);

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(4, 4),
  new THREE.MeshStandardMaterial({ color: variables.materialColor })
);
plane.rotation.x = Math.PI * -0.5;
scene.add(plane);

const camera = new THREE.PerspectiveCamera(
  35,
  variables.width / variables.height
);
camera.position.z = 2;
camera.position.y = 1;
camera.position.x = -1;
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
