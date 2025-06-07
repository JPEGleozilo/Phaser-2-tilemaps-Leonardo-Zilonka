import Nivel1 from "./scenes/Nivel1.js";
import Nivel2 from "./scenes/Nivel2.js";
import Nivel3 from "./scenes/Nivel3.js";
import Nivel4 from "./scenes/Nivel4.js";
import victoria from "./scenes/victoria.js";
import derrota from "./scenes/derrota.js"


// Create a new Phaser config object
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 600,
    },
    max: {
      width: 1600,
      height: 1200,
    },
  },
  render: {
    pixelArt: true,
    roundPixels: true
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  // List of scenes to load
  // Only the first scene will be shown
  // Remember to import the scene before adding it to the list
  scene: [Nivel1, Nivel2, Nivel3, Nivel4, victoria, derrota],
};

// Create a new Phaser game instance
window.game = new Phaser.Game(config);
