import stringifyNum from '../helpers/stringifyNum';

class CurrentWeaponPanel extends Phaser.Sprite {

	constructor(game, x, y, data) {

		var panelImg = game.cache.getBitmapData('currentPanel');

		super(game, x, y, panelImg);

		var panel = this;

		// Current weapon panel
		game.add.existing(this);

    panel.nameText = panel.addChild(game.add.text(0, 25, '', {
        font: '24px PressStart2P',
        fill: '#dedeef',
        strokeThickness: 4
    }));
    panel.nameText.anchor.setTo(0.5, 0);

    panel.priceText = panel.addChild(game.add.text(panel.width/2 - 10, 10, '', {
        font: '14px PressStart2P',
        fill: '#c79030',
        strokeThickness: 4
    }));
    panel.priceText.anchor.setTo(1, 0);

    // Completion panel
    var comPanel = game.add.sprite(-game.cache.getBitmapData('completionPanel').width/2, panel.height*2/3, game.cache.getBitmapData('completionPanel'));
    panel.completionPanel = panel.addChild(comPanel);
    panel.completionPanel.anchor.setTo(0, 0.5);

    var comBar = game.add.image(4, 0, game.cache.getBitmapData('completionBar'));
    panel.completionBar = panel.completionPanel.addChild(comBar);
    panel.completionBar.anchor.setTo(0, 0.5);

    panel.completionText = panel.completionPanel.addChild(game.add.text(panel.completionPanel.width / 2, 2, '', {
        font: '18px PressStart2P',
        fill: '#dedeef',
        strokeThickness: 4
    }));
    panel.completionText.anchor.setTo(0.5, 0.5);

		

	};
	updateProgress(weapon) {
		var panel = this;

		panel.completionBar.width = 300 * (weapon.progress/weapon.difficulty);
		panel.completionText.text = stringifyNum(weapon.progress) + '/' + stringifyNum(weapon.difficulty);
	};
	updateFull(weapon) {
		var panel = this;

    panel.nameText.text = weapon.details.name;
    panel.priceText.text = stringifyNum(weapon.details.price) + 'g';
		panel.updateProgress(weapon);
	}

}

export default CurrentWeaponPanel;