import Main from './states/Main';

class Game extends Phaser.Game {

	constructor() {
		super(800, 600, Phaser.AUTO, '');
		this.state.add('Main', Main);
		this.state.start('Main');
	}

}
 
new Game();