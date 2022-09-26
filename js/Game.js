class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton (" ");

    this.leaderboardTitle = createElement ("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    fuels = new Group();
    powerCoins = new Group();

    this.addSprites(fuels, 4, fuelImage, 0.02);
    this.addSprites(powerCoins, 18, powerCoinImage, 0.09);

    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    cars = [car1, car2];
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    //C39
    this.resetTitle.html ("Reiniciar juego");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width/2+200,40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width/2+230,100);

    this.leaderboardTitle.html ("Puntuacion");
    this.leaderboardTitle.class("resetText");
    this.leaderboardTitle.position(width/3-60);

    this.leader1.class("leadersText");
    this.leader1.position(whidth/3-50,80);

    this.leader2.class("leadersText");
    this.leader2.position(whidth/3-50,130);
  }

  play() {
    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo();

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);

      //llamar a la funcion leader board
      this.showLeaderboard();
      //índice de la matriz
      var index = 0;
      for (var plr in allPlayers) {
        //agrega 1 al índice por cada bucle
        index = index + 1;

        //utiliza datos de la base de datos para mostrar los autos en las direcciones x e y
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);

          // cambiar la posición de la cámara en la dirección y
          camera.position.y = cars[index - 1].position.y;
        }
      }

      // manejar eventos teclado
      this.handlePlayerControls();

      drawSprites();
    }
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {}
      });
      window.location.reload();
    });
  }

  showLeaderboard() {
   var leader1, leader2;
   var players = Object.values(allPlayers);

   if 
    (players[0].rank === 0 && players[1].rank === 0 || players [0].rank === 1){
      leader1 = players[0].rank+"&emps;"+
                players[0].name+"&emps;"+
                players[0].score;
      leader2 = players[1].rank+"&emps;"+
                players[1].name+"&emps;"+
                players[1].score;          
    }
    
    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  handlePlayerControls() {
    if (keyIsDown(UP_ARROW)) {
      player.positionY += 10;
      player.update();
    }

    if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
      player.positionX -= 5;
      player.update();
    }

    if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
      player.positionX += 5;
      player.update();
    }
  }

  addSprites (spriteGroup, numberOfSprites, spriteImage, scale) {
    for (var i = 0; i< numberOfSprites; i++) {
      var x,y;
      x = random (width /2 + 150, width/2 - 150);
      y = random (-height * 4.5, height-400);

      var sprite = createSprite (x,y);
      sprite.addImage("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }
}
