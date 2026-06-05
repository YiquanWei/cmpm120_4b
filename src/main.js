// main.js

/*
 DEVELOPER COMMENT
 Yiquan Wei

 MOVEMENT & GAME FEEL
 I spent a lot of time trying to make the jumping feel good. A few things I added:
   - Coyote time: gives the player a 10-frame window to jump after walking off a
     ledge. Without this, platformers feel unfair and stiff, so this was one of
     the first things I researched and added.
   - Variable jump height: holding Space keeps adding upward velocity each frame
     (via a jumpHold countdown). Tapping gives a short hop, holding gives a full
     jump. I learned about this technique online and thought it made a huge
     difference in how the movement feels.
   - Wall jump: if you're airborne and touching a wall, you can jump off it. I
     added a wallJumped flag so you can't just stick to one wall and jump forever.
   - Double jump: tracked with jumpCount and MAX_JUMPS so it's easy to tune.
   - Separate drag values for ground vs air (DRAG vs AIR_DRAG) — this makes the
     player feel snappy on the ground but floaty in the air.

  PARTICLES
  I added three particle emitters to give more feedback to the player:
    - A walking dust trail that follows the player's feet and points in the
      direction they're moving.
    - A downward burst of particles on every jump.
    - A radial burst at the coin's position when collected.
  The particle texture ("whiteParticle") is generated at runtime using Phaser
  Graphics in Load.js, so I didn't need to add an extra image file for it.
 
  AUDIO
  The land sound uses a hasPlayedLandSound flag so it only plays once when you
  touch the ground instead of firing every frame you're standing on it.
 
  CAMERA
  I used a lerp factor of 0.18 and set a deadzone (100x80 px) so the camera
  doesn't jerk around on small jumps. It only starts moving when the player gets
  far enough from the center of the view. Camera and world bounds are both locked
  to the tilemap size.
 
  TILEMAP & COINS
  I load the tileset PNG twice: once as a regular image for the tile layer, and
  once as a spritesheet for the animated coins. That way the same asset handles
  both the platforms and the spinning collectibles without needing a second file.
 
  SCENE FLOW
  The full flow is: Load → Title → Platformer → Credits.
  When you collect all coins, the camera shakes, waits 700ms, then fades to black
  before moving to the Credits scene. I wanted the ending to feel more complete
  than just popping up a "you win" text.
 */

"use strict";

let config = {
    parent: "phaser-game",

    type: Phaser.CANVAS,

    render: {
        pixelArt: true
    },

    physics: {
        default: "arcade",

        arcade: {
            debug: false,

            gravity: {
                x: 0,
                y: 600
            }
        }
    },

    width: 1440,
    height: 900,

    scene: [
        Load,
        Title,
        Platformer,
        Credits
    ]
};

var cursors;

var my = {
    sprite: {},
    text: {},
    vfx: {}
};

// Level configs — mapKey must match the key used in Load.js, spawnX/Y is player start position
const LEVELS = [
    { mapKey: "first_orbit",  spawnX: 56,  spawnY: 264 },
    { mapKey: "second_orbit", spawnX: 24,  spawnY: 552 }
];

const game = new Phaser.Game(config);