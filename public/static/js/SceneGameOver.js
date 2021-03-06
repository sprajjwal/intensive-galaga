class SceneGameOver extends Phaser.Scene {
  constructor() {
    super({ key: "SceneGameOver" });
  }
  create(data) {
    
    let parser = document.createElement('a');
    let url = getUrl();
    parser.href = url
    console.log(parser.pathname)
    let name;
    if(parser.pathname === '/') {
      name = prompt("New highscore! Please enter name");
    } else {
      name= getCookie("user")
    }

    let params = `name=${name}&score=${data.score}`
    console.log(params)
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true)
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(params);
    if(url.split("/")[5] == "game"){
      console.log()
      let results = url.replace(/\/[^\/]*$/, '/results')
      window.location.href = results
    }
    
    this.backgrounds = [];
    for (var i = 0; i < 5; i++) {
      let keys = ["sprBg0", "sprBg1"];
      let key = keys[Phaser.Math.Between(0, keys.length - 1)];
      let bg = new ScrollingBackground(this, key, i * 10);
      this.backgrounds.push(bg);
    }
    this.title = this.add.text(this.game.config.width * 0.5, 128, "GAME OVER", {
      fontFamily: "monospace",
      fontSize: 48,
      fontStyle: "bold",
      color: "#ffffff",
      align: "center"
    });
    this.title.setOrigin(0.5);
    this.sfx = {
      btnOver: this.sound.add("sndBtnOver"),
      btnDown: this.sound.add("sndBtnDown")
    };
    this.btnRestart = this.add.sprite(
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      "sprBtnRestart"
    );
    this.btnRestart.setInteractive();
    this.btnRestart.on(
      "pointerover",
      function() {
        this.btnRestart.setTexture("sprBtnRestartHover"); // set the button texture to sprBtnPlayHover
        this.sfx.btnOver.play(); // play the button over sound
      },
      this
    );
    this.btnRestart.on("pointerout", function() {
      this.setTexture("sprBtnRestart");
    });
    this.btnRestart.on(
      "pointerdown",
      function() {
        this.btnRestart.setTexture("sprBtnRestartDown");
        this.sfx.btnDown.play();
      },
      this
    );
    this.btnRestart.on(
      "pointerup",
      function() {
        this.btnRestart.setTexture("sprBtnRestart");
        this.scene.start("SceneMain");
      },
      this
    );
  }
  update(){
    for (let i = 0; i < this.backgrounds.length; i++) {
      this.backgrounds[i].update();
    }
  }
}

let getUrl = () => {
  return location.href
}

function getCookie(name) {
  // Split cookie string and get all individual name=value pairs in an array
  var cookieArr = document.cookie.split(";");
  
  // Loop through the array elements
  for(var i = 0; i < cookieArr.length; i++) {
      var cookiePair = cookieArr[i].split("=");
      
      /* Removing whitespace at the beginning of the cookie name
      and compare it with the given string */
      if(name == cookiePair[0].trim()) {
          // Decode the cookie value and return
          return decodeURIComponent(cookiePair[1]);
      }
  }
  
  // Return null if not found
  return null;
}