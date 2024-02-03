import { CubeTextureLoader, TextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default class Resources extends EventTarget {
  constructor(sources) {
    super();
    this.sources = sources;
    this.items = {};
    this.toLoad = this.sources?.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {
      gltfLoader: new GLTFLoader(),
      cubeTextureLoader: new CubeTextureLoader(),
      textureLoader: new TextureLoader(),
    };
  }

  startLoading() {
    if (this.toLoad == 0) {
      // When there are no sources, the event gets fired before the event listeners are made, so I added a timeout
      setTimeout(() => {
        this.dispatchEvent(new Event("onsourcesloaded"));
      }, 100);
      return;
    }

    for (const source of this.sources) {
      switch (source.type) {
        case "gltfModel":
          this.loaders.gltfLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file);
          });
          break;
        case "texture":
          this.loaders.textureLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file);
          });
          break;
        case "cubeTexture":
          this.loaders.cubeTextureLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file);
          });
          break;
        default:
          console.log("Sourcetype unknown", source.type);
          this.loaded++;
          break;
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;
    this.loaded++;

    if (this.loaded == this.toLoad) {
      this.dispatchEvent(new Event("onsourcesloaded"));
    }
  }
}
