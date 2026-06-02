// Load.js

class Load extends Phaser.Scene {

    constructor() {
        super("loadScene");
    }

    preload() {

        this.load.setPath("./assets/");

        // =====================================
        // TILEMAP
        // =====================================

        this.load.image(
            "tilemap_tiles",
            "monochrome_tilemap_packed.png"
        );

        this.load.tilemapTiledJSON(
            "first_orbit",
            "first_orbit_embedded.json"
        );

        // Same image, loaded as spritesheet for coin animation
        this.load.spritesheet(
            "tilemap_sheet",
            "monochrome_tilemap_packed.png",
            {
                frameWidth: 16,
                frameHeight: 16
            }
        );

        // =====================================
        // PLAYER
        // =====================================

        this.load.spritesheet(
            "player",
            "player.png",
            {
                frameWidth: 16,
                frameHeight: 16
            }
        );

        // =====================================
        // AUDIO
        // =====================================

        this.load.audio(
            "bgm",
            "moonlight_factory_bgm.wav"
        );

        this.load.audio(
            "collect",
            "collect.wav"
        );

        this.load.audio(
            "jump",
            "jump.wav"
        );

        this.load.audio(
            "land",
            "land.wav"
        );

        this.load.audio(
            "hurt",
            "hurt.wav"
        );
    }

    create() {

        // =====================================
        // PLAYER ANIMATIONS
        // =====================================

        this.anims.create({
            key: "idle",

            frames: [
                {
                    key: "player",
                    frame: 0
                }
            ],

            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: "walk",

            frames: this.anims.generateFrameNumbers(
                "player",
                {
                    start: 0,
                    end: 5
                }
            ),

            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "jump",

            frames: [
                {
                    key: "player",
                    frame: 0
                }
            ],

            frameRate: 1
        });

        // =====================================
        // COIN ANIMATION
        // coin frame IDs are 1 and 2
        // =====================================

        this.anims.create({
            key: "coinSpin",

            frames: [
                {
                    key: "tilemap_sheet",
                    frame: 1
                },
                {
                    key: "tilemap_sheet",
                    frame: 2
                }
            ],

            frameRate: 6,
            repeat: -1
        });

        // =====================================
        // SIMPLE PARTICLE TEXTURE
        // =====================================

        let graphics = this.make.graphics({
            x: 0,
            y: 0,
            add: false
        });

        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(4, 4, 4);
        graphics.generateTexture("whiteParticle", 8, 8);
        graphics.destroy();

        this.scene.start("platformerScene");
    }
}