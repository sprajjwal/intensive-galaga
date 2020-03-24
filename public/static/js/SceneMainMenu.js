class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super({ key: "SceneMainMenu" });
  }

  preload() {
    this.load.image("sprBtnPlay", "static/content/sprBtnPlay.png");
    this.load.image("sprBtnPlayHover", "static/content/sprBtnPlayHover.png");
    this.load.image("sprBtnPlayDown", "static/content/sprBtnPlayDown.png");
    this.load.image("sprBtnRestart", "static/content/sprBtnRestart.png");
    this.load.image(
      "sprBtnRestartHover",
      "static/content/sprBtnRestartHover.png"
    );
    this.load.image(
      "sprBtnRestartDown",
      "static/content/sprBtnRestartDown.png"
    );
    this.load.audio("sndBtnOver", "static/content/sndBtnOver.wav");
    this.load.audio("sndBtnDown", "static/content/sndBtnDown.wav");
  }

  create() {
    this.sfx = {
      btnOver: this.sound.add("sndBtnOver"),
      btnDown: this.sound.add("sndBtnDown")
    };
    this.btnPlay = this.add.sprite(
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      "sprBtnPlay"
    );
    this.btnPlay.setInteractive();
    this.btnPlay.on(
      "pointerover",
      function() {
        this.btnPlay.setTexture("sprBtnPlayHover");
        this.sfx.btnOver.play(); 
      },
      this
    );
    this.btnPlay.on(
      "pointerdown",
      function() {
        this.btnPlay.setTexture("sprBtnPlayDown");
        this.sfx.btnDown.play();
      },
      this
    );
    this.btnPlay.on(
      "pointerup",
      function() {
        this.btnPlay.setTexture("sprBtnPlay");
        this.scene.start("SceneMain");
      },
      this
    );
  }
}
