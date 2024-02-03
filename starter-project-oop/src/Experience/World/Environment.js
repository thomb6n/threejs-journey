import { DirectionalLight } from "three";
import Experience from "../Experience";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.setSunLight();
    // this.setEnvironmentMap();
  }

  setSunLight() {
    this.sunLight = new DirectionalLight(0xffffff, 4);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(3, 3, -2.25);
    this.scene.add(this.sunLight);
  }

  setEnvironmentMap() {
    this.environmentMap = {
      intensity: 0.4,
      texture: "", // e.g. this.resources.items.environmentMapTexture (the name in sources)
    };

    this.scene.environment = this.environmentMap.texture;
  }
}
