let config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'gal-container',
        width: 800,
        height: 600
    },
    parent: "gal-container",
    backgroundColor: "black",
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 0 }
      }
    },
    scene: [
        SceneMainMenu,
        SceneMain,
        SceneGameOver],
    pixelArt: true,
    roundPixels: true
}

var game = new Phaser.Game(config);