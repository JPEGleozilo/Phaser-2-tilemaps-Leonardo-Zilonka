export default class Nivel1 extends Phaser.Scene {
  constructor() {
    super("nivel1");
  }

init() {
}

preload() {
    this.load.tilemapTiledJSON("nivel1", "public/assets/tilemap/Nivel1.json");
    this.load.image("tilemap", "public/assets/tilemap/tilemap.png");
    this.load.image("objetivo", "public/assets/objective.png");
    this.load.spritesheet("player", "public/assets/player.png", {
        frameWidth: 6,
        frameHeight: 6,
    })
}

create() {
    this.objetos = 5;
    this.score = 0;
    this.recolectados = 0;

    this.restante = this.objetos - this.recolectados;

    this.textures.get('tilemap').setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.textures.get('player').setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.textures.get('objetivo').setFilter(Phaser.Textures.FilterMode.NEAREST);
    const map = this.make.tilemap({ key: "nivel1" });
    const tileset = map.addTilesetImage("tilemap", "tilemap");
    const fondo = map.createLayer("fondo", tileset, 0, 0);
    const paredes = map.createLayer("paredes", tileset, 0, 0);
    this.puerta_cerrada = map.createLayer("puerta", tileset, 0, 0);
    const puerta_abierta = map.createLayer("puerta abierta", tileset, 0, 0);
    [fondo, paredes, puerta_abierta].forEach(layer => layer.setScale(5));
    this.puerta_cerrada.setScale(5);

    puerta_abierta.setVisible(false);
    
    const objetivos = map.getObjectLayer("objetivos");
    this.objetivosGroup = this.physics.add.group();
    objetivos.objects.forEach((obj) => {
        const objetivo = this.objetivosGroup.create(obj.x * 5, obj.y * 5, "objetivo")
        
        objetivo.setScale(5);
        objetivo.setOrigin(0.5, 0.5);
    })
    

    const spawn = map.findObject("jugador", (obj) => obj.name === "player");

    this.player = this.physics.add.sprite(spawn.x * 5, spawn.y * 5, "player");
    this.player.setScale(5);
    this.player.setOrigin(0.5, 0.5)

    this.player.setCollideWorldBounds(true);
    paredes.setCollisionByExclusion([-1]);
    this.physics.add.collider(this.player, paredes);
    
    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.overlap(this.player, objetivos, (player, objetivo) => {
        objetivo.destroy();
        this.score += 10;
        this.restante -= 1;
    })

    this.physics.add.overlap(this.player, this.objetivosGroup, (player, objetivo) => {
        objetivo.destroy();
        this.recolectados += 1;
        this.restante = this.objetos - this.recolectados;
             
        if (this.recolectados === this.objetos) {
            puerta_abierta.setVisible(true);
        }
    });

}

update() {

    if (this.textorestante) {
        this.textorestante.destroy();
    }

    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-250);
    }
    if (this.cursors.right.isDown) {
        this.player.setVelocityX(250);
    }
    if (this.cursors.up.isDown) {
        this.player.setVelocityY(-250);
    }
    if (this.cursors.down.isDown) {
        this.player.setVelocityY(250);
    }

    const tile = this.puerta_cerrada.getTileAtWorldXY(this.player.x, this.player.y, true);
    if (tile && tile.properties && tile.properties.overlap) {
        if (this.restante > 0){
            this.textorestante = this.add.text(this.player.x + 5, this.player.y, `${this.recolectados}/${this.objetos} `, {
                fontSize: '16px',
                fill: '#fff'
            });
            this.textorestante.setOrigin(0.5, 0.5);
        } else if (this.restante <= 0) {
            this.scene.stop("Nivel1");
            this.scene.start("victoria")
        }
    }

  }
}
