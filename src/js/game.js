import Boot from './states/Boot';
import Load from './states/Load';
import Main from './states/Main';

class Game extends Phaser.Game {

	constructor() {
		super(800, 600, Phaser.AUTO, '');
		this.state.add('Boot', Boot);
		this.state.add('Load', Load);
		this.state.add('Main', Main);
		this.state.start('Boot');
	}

}
 
new Game();