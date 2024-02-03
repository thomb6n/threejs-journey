import GUI from "lil-gui";

export default class Debug {
  constructor() {
    this.active = window.location.hash === "#debug";

    if (this.active) {
      this.gui = new GUI({
        width: 200,
        title: "Debug Panel",
        closeFolders: true,
      });
    }
  }
}
