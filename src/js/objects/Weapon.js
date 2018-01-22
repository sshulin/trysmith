class Weapon extends Phaser.Sprite {

	constructor(game, x, y, data) {

		super(game, x, y, data.image);

		var anv = this;

		anv.progress = 0;
		anv.difficulty = data.difficulty;
		anv.details = data;

		anv.game.add.existing(this);
	};

	shake(shakeRange) {

		var anv = this;

		var shakeCount = 4;
		var shakeRange = shakeRange;
    var shakeTimer = anv.game.time.create(false);
		shakeTimer.loop(50, function(){
      if (shakeCount == 0) {
          //if shake end set camera to default position 
          anv.x = 480;
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

export default Weapon;