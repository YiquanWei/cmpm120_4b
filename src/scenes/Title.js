// Title.js

class Title extends Phaser.Scene {

    constructor() {
        super("titleScene");
    }

    create() {

        const { width, height } = this.scale;

        this.add.rectangle(0, 0, width, height, 0x0a0a1a).setOrigin(0, 0);

        // =========================================
        // TITLE TEXT
        // =========================================

        this.add.text(
            width / 2,
            height * 0.28,
            "Moonlight Factory",
            {
                fontSize: "56px",
                fill: "#ffffff",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);

        this.add.text(
            width / 2,
            height * 0.40,
            "Collect all signals to escape the factory.",
            {
                fontSize: "20px",
                fill: "#aaaaaa"
            }
        ).setOrigin(0.5);

        // =========================================
        // CONTROLS
        // =========================================

        this.add.text(
            width / 2,
            height * 0.52,
            "Controls",
            {
                fontSize: "22px",
                fill: "#ffffff",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);

        const controls = [
            "A / ←    Move left",
            "D / →    Move right",
            "Space    Jump  (double jump & wall jump supported)",
            "R    Restart"
        ];

        controls.forEach((line, i) => {
            this.add.text(
                width / 2,
                height * 0.59 + i * 30,
                line,
                {
                    fontSize: "18px",
                    fill: "#cccccc"
                }
            ).setOrigin(0.5);
        });

        // =========================================
        // PRESS TO START (blinking)
        // =========================================

        const startText = this.add.text(
            width / 2,
            height * 0.84,
            "Press SPACE to start",
            {
                fontSize: "26px",
                fill: "#ffffff"
            }
        ).setOrigin(0.5);

        this.tweens.add({
            targets: startText,
            alpha: 0,
            duration: 550,
            yoyo: true,
            repeat: -1
        });

        // =========================================
        // INPUT
        // =========================================

        this.input.keyboard.once("keydown-SPACE", () => {
            this.scene.start("platformerScene");
        });
    }
}
