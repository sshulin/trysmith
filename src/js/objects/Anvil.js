class Anvil extends Phaser.Sprite {

	constructor(game, x, y) {

		super(game, x, y, 'anvil');

		var anv = this;

		anv.game.add.existing(this);

    this.inputEnabled = true;

    this.events.onInputOver.add(function(){
        anv.game.canvas.style.cursor = "pointer";
    });

    this.events.onInputOut.add(function(){
        anv.game.canvas.style.cursor = "default";
    });

	};

	shake(shakeRange) {

		var anv = this;

		var shakeCount = 4;
		var shakeRange = shakeRange;
    var shakeTimer = anv.game.time.create(false);
		shakeTimer.loop(50, function(){
      if (shakeCount == 0) {
          //if shake end set camera to default position 
          anv.x = anv.game.world.centerX;
          shakeTimer.stop();
          return;
      }
      var shift;
      if(shakeCount % 2){
          shift = -shakeRange/2;
      }
      else{
          shift = shakeRange/2;
      }
      anv.x += shift;
      shakeCount--;
		});

		shakeTimer.start();
	}

}

export default Anvil;