export default class victoria extends Phaser.Scene {
  constructor() {
    super("victoria");
  }

  init(data) {
    this.score = data.score;
    this.tiempo = data.tiempo;
  }

  create() {
    this.add.text(0.5 * this.scale.width, 0.5 * this.scale.height, "Ganaste!", {
        fontSize: "64px",
        fill: "#ffffff",
        align: "center",
    }).setOrigin(0.5, 0.5);

    this.add.text(0.5 * this.scale.width, 0.5 * this.scale.height + 100, `Puntuación: ${this.score}`, {
        fontSize: "32px",
        fill: "#ffffff",
        align: "center",
    }).setOrigin(0.5, 0.5);

    this.add.text(0.5 * this.scale.width, 0.5 * this.scale.height + 55, `Tiempo: ${this.tiempo}s`, {
        fontSize: "32px",
        fill: "#ffffff",
        align: "center",
    }).setOrigin(0.5, 0.5);
  }  

}