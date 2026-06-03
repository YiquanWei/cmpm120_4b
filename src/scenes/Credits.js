// Credits.js

class Credits extends Phaser.Scene {

    constructor() {
        super("creditsScene");
    }

    create() {

        const { width, height } = this.scale;

        this.add.rectangle(0, 0, width, height, 0x0a0a1a).setOrigin(0, 0);

        // =========================================
        // ENDING TEXT
        // =========================================

        this.add.text(
            width / 2,
            height * 0.20,
            "You Escaped!",
            {
                fontSize: "52px",
                fill: "#ffffff",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);

        this.add.text(
            width / 2,
            height * 0.31,
            "The factory is behind you. For now.",
            {
                fontSize: "20px",
                fill: "#aaaaaa"
            }
        ).setOrigin(0.5);

        // =========================================
        // CREDITS
        // =========================================

        this.add.text(
            width / 2,
            height * 0.44,
            "Credits",
            {
                fontSize: "26px",
                fill: "#ffffff",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);

        const creditLines = [
            "Design & Programming    Yiquan Wei",
            "Tileset    Kenney 1-Bit Platformer Pack  (kenney.nl)",
            "Background Music    Yiquan Wei",
            "Sound Effects    Pixabay  (pixabay.com/sound-effects)"
        ];

        creditLines.forEach((line, i) => {
            this.add.text(
                width / 2,
                height * 0.515 + i * 32,
                line,
                {
                    fontSize: "18px",
                    fill: "#cccccc"
                }
            ).setOrigin(0.5);
        });

        // =========================================
        // NAVIGATION PROMPTS
        // =========================================

        const titlePrompt = this.add.text(
            width / 2,
            height * 0.78,
            "Press SPACE to return to title",
            {
                fontSize: "22px",
                fill: "#ffffff"
            }
        ).setOrigin(0.5);

        this.tweens.add({
            targets: titlePrompt,
            alpha: 0,
            duration: 600,
            yoyo: true,
            repeat: -1
        });

        this.add.text(
            width / 2,
            height * 0.87,
            "Press R to play again",
            {
                fontSize: "20px",
                fill: "#888888"
            }
        ).setOrigin(0.5);

        // =========================================
        // INPUT
        // =========================================

        this.input.keyboard.once("keydown-SPACE", () => {
            this.scene.start("titleScene");
        });

        this.input.keyboard.once("keydown-R", () => {
            this.scene.start("platformerScene", { level: 0 });
        });
    }
}
