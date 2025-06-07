export default class victoria extends Phaser.Scene {
  constructor() {
    super("victoria");
  }

  create() {
    this.add.text(0.5 * this.scale.width, 0.5 * this.scale.height, "Ganaste!", {
        fontSize: "64px",
        fill: "#ffffff",
        align: "center",
    }).setOrigin(0.5, 0.5);
  }

}