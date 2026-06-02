// Platformer.js

class Platformer extends Phaser.Scene {

    constructor() {
        super("platformerScene");
    }

    init() {

        this.ACCELERATION = 180;
        this.DRAG = 180;
        this.AIR_DRAG = 40;

        this.JUMP_VELOCITY = -360;
        this.WALL_JUMP_X = 180;
        this.JUMP_HOLD_DURATION = 10;
        this.MAX_JUMPS = 2;
        this.jumpCount = 0;
        this.wallJumped = false;

        this.PARTICLE_VELOCITY = 50;

        this.SCALE = 1.3;

        this.hasPlayedLandSound = false;
        this.coyoteTime = 0;
        this.jumpHold = 0;
    }

    create() {

        my.sprite = {};
        my.text = {};
        my.vfx = {};

        // =========================================
        // BGM
        // =========================================

        this.bgm = this.sound.add(
            "bgm",
            {
                loop: true,
                volume: 0.35
            }
        );

        this.bgm.play();

        // =========================================
        // SCORE UI
        // =========================================

        this.score = 0;

        my.text.score = this.add.text(
            20,
            20,
            "Signals: 0",
            {
                fontSize: "24px",
                fill: "#ffffff"
            }
        );

        my.text.score.setScrollFactor(0);
        my.text.score.setDepth(100);

        // =========================================
        // MAP
        // =========================================

        this.map = this.add.tilemap("first_orbit");

        this.tileset = this.map.addTilesetImage(
            "map_tiles",
            "tilemap_tiles"
        );

        this.platformLayer = this.map.createLayer(
            "Platforms",
            this.tileset,
            0,
            0
        );

        this.platformLayer.setCollisionByProperty({
            collides: true
        });

        this.platformLayer.setCollision(132, false);
        this.platformLayer.setCollision([255, 256, 257, 258, 278], true);

        // =========================================
        // COINS FROM OBJECT LAYER
        //
        // Tiled:
        // Object layer name = Objects
        // coin object Name = coin
        // =========================================

        this.coins = [];

        const objectLayer = this.map.getObjectLayer("Objects");

        if (objectLayer) {

            this.coins = this.map.createFromObjects(
                "Objects",
                {
                    name: "coin",
                    key: "tilemap_sheet",
                    frame: 1
                }
            );

        } else {

            console.warn("No object layer named Objects found.");
        }

        this.physics.world.enable(
            this.coins,
            Phaser.Physics.Arcade.STATIC_BODY
        );

        this.coinGroup = this.add.group(this.coins);

        for (let coin of this.coins) {

            coin.anims.play("coinSpin");

            coin.setDepth(10);

            if (coin.body) {
                coin.body.setSize(12, 12);
                coin.body.setOffset(2, 2);
            }
        }

        // =========================================
        // PLAYER
        // =========================================

        my.sprite.player = this.physics.add.sprite(
            56,
            264,
            "player",
            0
        );

        my.sprite.player.setCollideWorldBounds(true);

        my.sprite.player.setMaxVelocity(
            220,
            600
        );

        my.sprite.player.setDragX(
            this.DRAG
        );

        my.sprite.player.anims.play(
            "idle"
        );

        this.physics.add.collider(
            my.sprite.player,
            this.platformLayer
        );

        my.sprite.player.setMaxVelocity(
            140,
            700
        );

        // =========================================
        // COIN OVERLAP
        // =========================================

        this.totalCoins = this.coins.length;
        this.levelComplete = false;

        this.physics.add.overlap(
            my.sprite.player,
            this.coinGroup,
            (player, coin) => {

                if (this.levelComplete) {
                    return;
                }

                my.vfx.coinBurst.emitParticleAt(
                    coin.x,
                    coin.y
                );

                this.sound.play(
                    "collect",
                    {
                        volume: 0.6
                    }
                );

                coin.destroy();

                this.score += 1;

                my.text.score.setText(
                    "Signals: " + this.score
                );

                if (this.score >= this.totalCoins) {
                    this.completeLevel();
                }
            }
        );

        // =========================================
        // INPUT
        // =========================================

        this.cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey("R");

        this.input.keyboard.on(
            "keydown-D",
            () => {

                this.physics.world.drawDebug =
                    !this.physics.world.drawDebug;

                if (this.physics.world.debugGraphic) {
                    this.physics.world.debugGraphic.clear();
                }

            },
            this
        );

        // =========================================
        // PARTICLES
        // =========================================

        my.vfx.walking = this.add.particles(
            0,
            0,
            "whiteParticle",
            {
                scale: {
                    start: 0.45,
                    end: 0
                },

                lifespan: 250,

                alpha: {
                    start: 0.8,
                    end: 0
                },

                quantity: 1,

                frequency: 90
            }
        );

        my.vfx.walking.stop();

        my.vfx.jump = this.add.particles(
            0,
            0,
            "whiteParticle",
            {
                scale: {
                    start: 0.7,
                    end: 0
                },

                lifespan: 280,

                speed: {
                    min: 40,
                    max: 100
                },

                angle: {
                    min: 230,
                    max: 310
                },

                quantity: 8,

                emitting: false
            }
        );

        my.vfx.coinBurst = this.add.particles(
            0,
            0,
            "whiteParticle",
            {
                scale: {
                    start: 0.6,
                    end: 0
                },

                lifespan: 300,

                speed: {
                    min: 40,
                    max: 120
                },

                quantity: 12,

                emitting: false
            }
        );

        // =========================================
        // CAMERA
        // =========================================

        this.cameras.main.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels
        );

        this.physics.world.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels
        );

        this.physics.world.debugGraphic = this.add.graphics();

        this.cameras.main.startFollow(
            my.sprite.player,
            true,
            0.18,
            0.18
        );

        this.cameras.main.setDeadzone(
            100,
            80
        );

        this.cameras.main.setZoom(
            this.SCALE
        );
    }

    completeLevel() {

        this.levelComplete = true;

        if (my.sprite.player.body) {
            my.sprite.player.body.enable = false;
            my.sprite.player.setVelocity(0, 0);
        }

        this.cameras.main.shake(200, 0.01);

        const { width, height } = this.scale;
        const message = this.add.text(
            width / 2,
            height / 2,
            "LEVEL COMPLETE\nPress R to restart",
            {
                fontSize: "32px",
                fill: "#ffffff",
                align: "center"
            }
        );

        message.setScrollFactor(0);
        message.setOrigin(0.5);
        message.setDepth(200);
    }

    update() {

        if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.sound.stopAll();
            this.scene.restart();
        }

        if (this.levelComplete) {
            return;
        }

        // =========================================
        // MOVE LEFT
        // =========================================

        const onGround = my.sprite.player.body.blocked.down;
        my.sprite.player.setDragX(onGround ? this.DRAG : this.AIR_DRAG);

        if (this.cursors.left.isDown) {

            my.sprite.player.setAccelerationX(
                -this.ACCELERATION
            );

            my.sprite.player.setFlipX(true);

            if (my.sprite.player.body.blocked.down) {

                my.sprite.player.anims.play(
                    "walk",
                    true
                );

                my.vfx.walking.startFollow(
                    my.sprite.player,
                    8,
                    8,
                    false
                );

                my.vfx.walking.setParticleSpeed(
                    this.PARTICLE_VELOCITY,
                    0
                );

                my.vfx.walking.start();
            }
        }

        // =========================================
        // MOVE RIGHT
        // =========================================

        else if (this.cursors.right.isDown) {

            my.sprite.player.setAccelerationX(
                this.ACCELERATION
            );

            my.sprite.player.setFlipX(false);

            if (my.sprite.player.body.blocked.down) {

                my.sprite.player.anims.play(
                    "walk",
                    true
                );

                my.vfx.walking.startFollow(
                    my.sprite.player,
                    -8,
                    8,
                    false
                );

                my.vfx.walking.setParticleSpeed(
                    -this.PARTICLE_VELOCITY,
                    0
                );

                my.vfx.walking.start();
            }
        }

        // =========================================
        // STOP
        // =========================================

        else {

            my.sprite.player.setAccelerationX(0);

            my.vfx.walking.stop();

            if (my.sprite.player.body.blocked.down) {

                my.sprite.player.anims.play(
                    "idle",
                    true
                );
            }
        }

        // =========================================
        // JUMP
        // =========================================

        const onWall = !onGround && (my.sprite.player.body.blocked.left || my.sprite.player.body.blocked.right);

        if (onGround) {
            this.coyoteTime = 10;
            this.jumpCount = 0;
            this.wallJumped = false;
        } else if (this.coyoteTime > 0) {
            this.coyoteTime--;
        }

        if (
            Phaser.Input.Keyboard.JustDown(this.cursors.space) &&
            (this.coyoteTime > 0 || this.jumpCount < this.MAX_JUMPS || (onWall && !this.wallJumped))
        ) {

            if (onWall && !this.wallJumped) {
                my.sprite.player.setVelocityY(this.JUMP_VELOCITY);
                my.sprite.player.setVelocityX(
                    my.sprite.player.body.blocked.left ? this.WALL_JUMP_X : -this.WALL_JUMP_X
                );
                this.wallJumped = true;
            } else {
                my.sprite.player.setVelocityY(this.JUMP_VELOCITY);
                this.jumpCount++;
            }

            this.jumpHold = this.JUMP_HOLD_DURATION;

            my.sprite.player.anims.play(
                "jump",
                true
            );

            my.vfx.jump.emitParticleAt(
                my.sprite.player.x,
                my.sprite.player.y + 8
            );

            this.sound.play(
                "jump",
                {
                    volume: 0.45
                }
            );

            this.hasPlayedLandSound = false;
        }

        if (this.cursors.space.isDown && this.jumpHold > 0) {
            this.jumpHold--;
            if (my.sprite.player.body.velocity.y < 0) {
                my.sprite.player.body.velocity.y = Math.max(
                    my.sprite.player.body.velocity.y - 8,
                    this.JUMP_VELOCITY
                );
            }
        }

        // =========================================
        // AIR / LANDING
        // =========================================

        if (!my.sprite.player.body.blocked.down) {

            my.sprite.player.anims.play(
                "jump",
                true
            );

            my.vfx.walking.stop();

            this.hasPlayedLandSound = false;
        }

        if (
            my.sprite.player.body.blocked.down &&
            !this.hasPlayedLandSound
        ) {

            this.sound.play(
                "land",
                {
                    volume: 0.35
                }
            );

            this.hasPlayedLandSound = true;
        }
    }
}