import stringifyNum from '../helpers/stringifyNum';

class LoadingPanel extends Phaser.Sprite {

	constructor(game, x, y, data) {

		var panelImg = game.cache.getBitmapData('currentPanel');

		super(game, x, y, panelImg);

		var panel = this;

		game.add.existing(this);

    panel.nameText = panel.addChild(game.add.text(0, 20, '', {
        font: '32px Arial Black',
        fill: '#dedeef',
        strokeThickness: 4
    }));
    panel.nameText.text = 'Loading...';
    panel.nameText.anchor.setTo(0.5, 0);

    // Completion panel
    var comPanel = game.add.sprite(-game.cache.getBitmapData('completionPanel').width/2, panel.height*2/3, game.cache.getBitmapData('completionPanel'));
    panel.completionPanel = panel.addChild(comPanel);
    panel.completionPanel.anchor.setTo(0, 0.5);

    var comBar = game.add.image(4, 0, game.cache.getBitmapData('completionBar'));
    panel.completionBar = panel.completionPanel.addChild(comBar);
    panel.completionBar.anchor.setTo(0, 0.5);
		panel.completionBar.width = 0;

    panel.completionText = panel.completionPanel.addChild(game.add.text(panel.completionPanel.width / 2, 3, '', {
        font: '24px Arial Black',
        fill: '#dedeef',
        strokeThickness: 4
    }));
    panel.completionText.anchor.setTo(0.5, 0.5);

		

	};
	updateProgress(progress) {
		var panel = this;

		panel.completionBar.width = 300 * (progress/100);
		panel.completionText.text = '' + progress + '%';
	};
	updateFull(progress) {
		var panel = this;

    panel.nameText.text = 'Loading...';
		panel.updateProgress(progress);
	}

}

export default LoadingPanel;