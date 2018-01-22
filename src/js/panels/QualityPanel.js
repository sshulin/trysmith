import stringifyNum from '../helpers/stringifyNum';

import tableQualities from '../data/tableQualities';

class QualityPanel  extends Phaser.Button {

	constructor(game, x, y, data) {

		var qualityImg = game.cache.getBitmapData('qualityButton');
		var qualityTextBgImg = game.cache.getBitmapData('qualityTextBg');

		super(game, x, y, qualityImg);

		var panel = this;

		// Quality panel
		game.add.existing(this);

		panel.events.onBuy = new Phaser.Signal();

    panel.onInputDown.add(panel.onQualityClick, panel);

  	panel.lvlText = panel.addChild(panel.game.add.text(17.5, 20, '', {
      font: '14px PressStart2P',
      fill: '#ffffff',
      strokeThickness: 4
  	}));
  	panel.lvlText.anchor.setTo(0.5,0.5);

  	panel.nameBlock = panel.addChild(panel.game.add.image(35, 0, qualityTextBgImg));
  	panel.nameBlock.anchor.setTo(0, 0);
    panel.nameText = panel.nameBlock.addChild(panel.game.add.text(panel.nameBlock.width / 2, 2 + panel.nameBlock.height / 2, '', {
      font: '14px PressStart2P',
      fill: '#dedeef',
      strokeThickness: 4
  	}));
    panel.nameText.anchor.setTo(0.5, 0.5);

  	panel.costText = panel.addChild(panel.game.add.text(207.5, 20, '', {
      font: '14px PressStart2P',
      fill: '#c79030',
      strokeThickness: 4
  	}));
  	panel.costText.anchor.setTo(0.5, 0.5);

		panel.renderQuality();

	};
	renderQuality() {
		var panel = this;
		var upgradeCost = parseInt(tableQualities[panel.game.player.quality + 1].cost);

		panel.lvlText.text = panel.game.player.quality;
		panel.nameText.text = tableQualities[panel.game.player.quality].name;
		panel.costText.text = stringifyNum(upgradeCost) + '';

		if(upgradeCost > panel.game.player.wealth) {
			panel.costText.fill = "#ff0000";
			panel.inputEnabled = false;
		} else {
			panel.costText.fill = "#c79030";
			panel.inputEnabled = true;
		}
	};
	onQualityClick() {
		var panel = this;
		var upgradeCost = parseInt(tableQualities[panel.game.player.quality + 1].cost);

		if(upgradeCost <= panel.game.player.wealth) {
			panel.game.player.wealth -= upgradeCost;
			panel.game.player.quality += 1;

    	this.events.onBuy.dispatch(this);
		}
	}

}

export default QualityPanel;