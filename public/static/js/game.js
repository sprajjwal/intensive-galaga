let config = {
    type: Phaser.WEBGL,
    width: 500,
    height: 500,
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