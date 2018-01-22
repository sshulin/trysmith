import tableUpgrades from '../data/tableUpgrades';

import stringifyNum from '../helpers/stringifyNum';

class CurrentWeaponPanel extends Phaser.Sprite {

	constructor(game, x, y, data) {

		var panelImg = game.cache.getBitmapData('currentPanel');

		super(game, x, y);

		var panel = this;

		// Current weapon panel
		game.add.existing(this);

    panel.upgradeButtons = {};
    Object.keys(tableUpgrades).forEach(function(key, index) {
    	panel.renderUpgrade(key);
    	panel.updateUpgrade(key);
    });

		panel.events.onBuy = new Phaser.Signal();

	};
	renderUpgrade(upgrade) {
		var panel = this;
  	panel.upgradeButtons[upgrade] = {};
    panel.upgradeButtons[upgrade].button = panel.addChild(panel.game.add.button(0, tableUpgrades[upgrade].position * 40, panel.game.cache.getBitmapData('upgradeButton')));
    panel.upgradeButtons[upgrade].button.events.onInputDown.add(panel.onUpgradeClick, panel);

    panel.upgradeButtons[upgrade].button.data = upgrade;

  	panel.upgradeButtons[upgrade].lvlText = panel.upgradeButtons[upgrade].button.addChild(panel.game.add.text(17.5, 20, '', {
      font: '14px PressStart2P',
      fill: '#dedeef',
      strokeThickness: 4
  	}));
  	panel.upgradeButtons[upgrade].lvlText.anchor.setTo(0.5,0.5);
    
  	panel.upgradeButtons[upgrade].costText = panel.upgradeButtons[upgrade].button.addChild(panel.game.add.text(75, 20, '', {
      font: '14px PressStart2P',
      fill: '#c79030',
      strokeThickness: 4
  	}));
  	panel.upgradeButtons[upgrade].costText.anchor.setTo(0, 0.5);

    panel.upgradeButtons[upgrade].icon = panel.upgradeButtons[upgrade].button.addChild(panel.game.add.image(35, 0, panel.game.cache.getBitmapData('upgradeIcon')));
    panel.upgradeButtons[upgrade].img = panel.upgradeButtons[upgrade].icon.addChild(panel.game.add.image(17.5, 17.5, tableUpgrades[upgrade].image));      
  	panel.upgradeButtons[upgrade].img.anchor.setTo(0.5,0.5);
  	panel.upgradeButtons[upgrade].img.scale.setTo(0.4,0.4);
	};
	updateUpgrade(upgrade) {
		var panel = this;
		var upgradeCost = parseInt(Math.pow(tableUpgrades[upgrade].multiplier, panel.game.player.upgrades[upgrade]) * tableUpgrades[upgrade].cost);


		panel.upgradeButtons[upgrade].lvlText.text = panel.game.player.upgrades[upgrade];
		panel.upgradeButtons[upgrade].costText.text = stringifyNum(upgradeCost) + 'g';

		if(upgradeCost > panel.game.player.wealth) {
			panel.upgradeButtons[upgrade].costText.fill = "#ff0000";
			panel.upgradeButtons[upgrade].button.inputEnabled = false;
		} else {
			panel.upgradeButtons[upgrade].costText.fill = "#c79030";
			panel.upgradeButtons[upgrade].button.inputEnabled = true;
		}
	};
	updateAllUpgrades() {
		var panel = this;

    Object.keys(tableUpgrades).forEach(function(key, index) {
    	panel.updateUpgrade(key);
    });
	}
	onUpgradeClick(button) {
		var panel = this;

		var upgradeCost = parseInt(Math.pow(tableUpgrades[button.data].multiplier, panel.game.player.upgrades[button.data]) * tableUpgrades[button.data].cost);
		if(upgradeCost <= panel.game.player.wealth) {
			panel.game.player.wealth -= upgradeCost;
			panel.game.player.upgrades[button.data] += 1;

    	this.events.onBuy.dispatch(this);
		}
	}

}

export default CurrentWeaponPanel;