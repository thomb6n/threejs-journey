export default class Sizes extends EventTarget {
  constructor() {
    super();
    this.updateSizes();

    window.addEventListener("resize", () => {
      this.updateSizes();
      this.dispatchEvent(new Event("onresize"));
    });
  }

  updateSizes() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
  }
}
