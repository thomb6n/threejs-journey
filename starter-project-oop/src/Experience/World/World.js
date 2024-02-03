import { BoxGeometry, Mesh, MeshStandardMaterial } from "three";
import Experience from "../Experience";
import Environment from "./Environment";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.experience.resources.addEventListener("onsourcesloaded", () => {
      this.environment = new Environment();
    });

    const mesh = new Mesh(
      new BoxGeometry(1, 1, 1),
      new MeshStandardMaterial({ color: 0xffffff })
    );
    this.scene.add(mesh);
  }
}
