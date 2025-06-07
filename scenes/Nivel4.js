export default class Nivel4 extends Phaser.Scene {
  constructor() {
    super("Nivel4");
  }

  init(data){
    this.score = data.score;
    this.tiempo = data.tiempo;
  }

  preload() {
    this.load.tilemapTiledJSON("nivel4", "public/assets/tilemap/Nivel4.json");
    this.load.image("tilemap", "public/assets/tilemap/tilemap.png");
    this.load.image("objetivo", "public/assets/objective.png");
    this.load.spritesheet("player", "public/assets/player.png", {
        frameWidth: 6,
        frameHeight: 6,
    })
    this.load.image("enemigo", "public/assets/enemigo.png");
}

create() {

    this.cameras.main.setOrigin(0.5, 0.5)

    this.textures.get('tilemap').setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.textures.get('player').setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.textures.get('objetivo').setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.textures.get('enemigo').setFilter(Phaser.Textures.FilterMode.NEAREST);
    const map = this.make.tilemap({ key: "nivel4" });
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

    this.objetos = this.objetivosGroup.countActive(true);
    this.recolectados = 0;

    this.restante = this.objetos - this.recolectados;

    const spawn = map.findObject("jugador", (obj) => obj.name === "player");

    this.player = this.physics.add.sprite(spawn.x * 5, spawn.y * 5, "player");
    this.player.setScale(5);
    this.player.setOrigin(0.5, 0.5)

    this.cameras.main.setBounds(0, 0, map.widthInPixels * 5, map.heightInPixels * 5);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.roundPixels = true;

    paredes.setCollisionByExclusion([-1]);
    this.physics.add.collider(this.player, paredes);
    
    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.overlap(this.player, this.objetivosGroup, (player, objetivo) => {
        objetivo.destroy();
        this.recolectados += 1;
        this.score += 10;
        this.restante = this.objetos - this.recolectados;

        if (!this.textorest) {
            this.textorest = this.add.text(this.player.x + 5, this.player.y, `${this.recolectados}/${this.objetos} `, {
                fontSize: '16px',
                fill: '#fff'
            }).setOrigin(0.5, 0.5);

            this.time.delayedCall(1000, () => {
                this.textorest.destroy();
                this.textorest = null;
            });
        }
             
        if (this.recolectados === this.objetos) {
            puerta_abierta.setVisible(true);
        }
    });

    this.tiempotexto = this.add.text(0.5 * this.cameras.main.width, 0.05 * this.cameras.main.height, `${this.tiempo}s`, {
        fontSize: '16px',
        fill: '#fff'
    }).setOrigin(0.5, 0.5);
    this.time.addEvent({
        delay: 1000,
        callback() {
            this.tiempo += 1;
            this.tiempotexto.setText(`${this.tiempo}s`);
        },
        callbackScope: this,
        loop: true
    });
        
    const enemigos = map.getObjectLayer("enemigos");
    this.enemigosGroup = this.physics.add.group();
    enemigos.objects.forEach((obj) => {
        const enemigo = this.enemigosGroup.create(obj.x * 5, obj.y * 5, "enemigo");
        
        enemigo.setScale(5);
        enemigo.setOrigin(0.5, 0.5);

        enemigo.clase = obj.type || null;

        if (enemigo.clase === "x") {
            enemigo.setVelocityX(-275);
            enemigo.setVelocityY(0);
            enemigo.setAngle(90);
        } else if (enemigo.clase === "y") {
            enemigo.setVelocityY(275);
            enemigo.setVelocityX(0);
        }
        this.physics.add.collider(enemigo, paredes);
        enemigo.setBounce(1);

        console.log('Enemigo en:', enemigo.x, enemigo.y, 'clase:', enemigo.clase);
        });

    if (this.player && this.enemigosGroup) {
        this.physics.add.overlap(this.player, this.enemigosGroup, () => {
            this.scene.start("derrota", { score: this.score, tiempo: this.tiempo });
        });
    }

}

update() {

    this.enemigosGroup.children.iterate((enemigo) => {
        if (enemigo.clase === "x" && enemigo.body.velocity.x < 0) {
            enemigo.setAngle(270);
        }else if (enemigo.clase === "x" && enemigo.body.velocity.x > 0) {
            enemigo.setAngle(90);
        }else if (enemigo.clase === "y" && enemigo.body.velocity.y < 0) {
            enemigo.setAngle(0);
        }else if (enemigo.clase === "y" && enemigo.body.velocity.y > 0) {
            enemigo.setAngle(180);
        }
    });

    this.tiempotexto.setPosition(0.5 * this.cameras.main.width, 0.05 * this.cameras.main.height, `${this.tiempo}s`, {
    fontSize: '16px',
    fill: '#fff'
}).setOrigin(0.5, 0.5)
  .setScrollFactor(0);

    if (this.textorestante) {
        this.textorestante.destroy();
    }

    if (this.textorest) {
        this.textorest.setPosition(this.player.x + 5, this.player.y);
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
            this.scene.start("victoria", { score: this.score, tiempo: this.tiempo });
        }
    }
  }
  
}