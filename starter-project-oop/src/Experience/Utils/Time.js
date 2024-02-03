export default class Time extends EventTarget {
  constructor() {
    super();
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;
    this.updateFrame();
  }

  updateFrame() {
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;
    this.dispatchEvent(new Event("onupdateframe"));

    window.requestAnimationFrame(() => {
      this.updateFrame();
    });
  }
}
