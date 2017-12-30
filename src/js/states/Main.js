import tableUpgrades from '../data/tableUpgrades';
import tableWeapons from '../data/tableWeapons';

import Anvil from '../objects/Anvil';
import Weapon from '../objects/Weapon';

import CurrentWeaponPanel from '../panels/CurrentWeaponPanel';
import UpgradesPanel from '../panels/UpgradesPanel';

import stringifyNum from '../helpers/stringifyNum';

class Main extends Phaser.State {

	preload() {
		this.game.time.advancedTiming = true;
    this.game.load.image('anvil', 'assets/images/anvil.png');
    this.game.load.image('bg-cave', 'assets/images/bg-cave.png');
    this.game.load.image('bg-snow', 'assets/images/bg-snow.png');

    // Weapons
    this.game.load.image('upgrade-click', 'assets/images/buttons/click.png');
    this.game.load.image('upgrade-crit-chance', 'assets/images/buttons/crit-chance.png');
    this.game.load.image('upgrade-crit-power', 'assets/images/buttons/crit-power.png');
    this.game.load.image('upgrade-speed', 'assets/images/buttons/speed.png');
    this.game.load.image('upgrade-timer', 'assets/images/buttons/timer.png');

    // Upgrade icons
    this.game.load.image('axe', 'assets/images/axe_viking_imperor.png');
    this.game.load.image('hammer', 'assets/images/Hammer.png');
    this.game.load.image('battle-axe', 'assets/images/BattleAxe.png');
    this.game.load.image('sword', 'assets/images/Sword.png');

    var bmdUpgradeBtn = this.game.add.bitmapData(150, 35);
    bmdUpgradeBtn.ctx.fillStyle = '#818ab5';
    bmdUpgradeBtn.ctx.strokeStyle = '#000000';
    bmdUpgradeBtn.ctx.lineWidth = 4;
    bmdUpgradeBtn.ctx.fillRect(0, 0, 150, 35);
    bmdUpgradeBtn.ctx.strokeRect(0, 0, 150, 35);
    this.game.cache.addBitmapData('upgradeButton', bmdUpgradeBtn);

    var bmdUpgradeIcon = this.game.add.bitmapData(35, 35);
    bmdUpgradeIcon.ctx.fillStyle = '#9099b5';
    bmdUpgradeIcon.ctx.strokeStyle = '#000000';
    bmdUpgradeIcon.ctx.lineWidth = 4;
    bmdUpgradeIcon.ctx.fillRect(0, 0, 35, 35);
    bmdUpgradeIcon.ctx.strokeRect(0, 0, 35, 35);
    this.game.cache.addBitmapData('upgradeIcon', bmdUpgradeIcon);

    var bmdCurPanel = this.game.add.bitmapData(508, 158);
    // bmd.ctx.fillStyle = '#818ab5';
    bmdCurPanel.ctx.fillStyle = '#9099b5';
    bmdCurPanel.ctx.strokeStyle = '#000000';
    bmdCurPanel.ctx.lineWidth = 8;
    bmdCurPanel.ctx.fillRect(0, 0, 508, 158);
    bmdCurPanel.ctx.strokeRect(0, 0, 508, 158);
    this.game.cache.addBitmapData('currentPanel', bmdCurPanel);

    var bmdComPanel = this.game.add.bitmapData(308, 38);
    // bmd.ctx.fillStyle = '#818ab5';
    bmdComPanel.ctx.fillStyle = '#696c7e';
    bmdComPanel.ctx.strokeStyle = '#000000';
    bmdComPanel.ctx.lineWidth = 8;
    bmdComPanel.ctx.fillRect(0, 0, 308, 38);
    bmdComPanel.ctx.strokeRect(0, 0, 308, 38);
    this.game.cache.addBitmapData('completionPanel', bmdComPanel);

    var bmdComBar = this.game.add.bitmapData(300, 30);
    bmdComBar.ctx.fillStyle = '#818ab5';
    bmdComBar.ctx.strokeStyle = '#000000';
    bmdComBar.ctx.fillRect(0, 0, 300, 30);
    this.game.cache.addBitmapData('completionBar', bmdComBar);

    this.tableWeapons = tableWeapons;
    this.tableUpgrades = tableUpgrades;

    // game config
    this.game.constants = {

    	baseClickPower: 1,

    	// Autoclick period = baseAutoTime / (1 + baseAutoDivider * upgrades.idleSpeed)

    	baseAutoTime: 10000,
    	baseAutoDivider: 0.2,
    	baseAutoPower: 2,

    	// isCritical = random > 1 - (baseCritChance + (critChanceMultiplier * upgrades.critChance))
    	// CriticalMultiplier = critMultiplierBase + (critMultiplierGrower * upgrades.critPower)
    	baseCritChance: 0.01,
    	critChanceMultiplier: 0.002,
    	critMultiplierBase: 3,
    	critMultiplierGrower: 0.2
    };

    this.game.player = {
        strength: 1,
        wealth: 123000000000,
        upgrades: {
        	click: 0,
        	critChance: 0,
        	critPower: 0,
        	idleSpeed: 0,
        	idlePower: 0
        }
    };

	}

	create() {

		var state = this;

    this.checkCritical = function() {
			var random = Math.random();
			var isCritical = (random > 1 - (state.game.constants.baseCritChance + state.game.constants.critChanceMultiplier * state.game.player.upgrades.critChance));
    	return isCritical;
    }

  	this.onHitAnvil = function() {
			var isCritical = state.checkCritical();
			var shakeShift = isCritical ? 25 : 10;

			state.onHitCurrentWeapon(isCritical);
			state.anvilSprite.shake(shakeShift);
		};
		this.onHitCurrentWeapon = function(isCritical) {
			var shakeShift = isCritical ? 25 : 10;
			var affort = state.game.constants.baseClickPower * (1 + state.game.player.upgrades.click);
			affort = isCritical ? affort * (state.game.constants.critMultiplierBase + state.game.constants.critMultiplierGrower * state.game.player.upgrades.critPower) : affort;
			state.currentWeapon.progress += affort;
			if(state.currentWeapon.progress >= state.currentWeapon.difficulty) {
				state.onFinishedWeapon();
			} else {
				state.currentWeapon.shake(shakeShift);			
			}
			state.currentPanel.updateProgress(state.currentWeapon);
		};

		this.spawnWeapon = function() {
			var state = this;

	    var randWeapon = state.tableWeapons[Math.floor(Math.random() * state.tableWeapons.length)];
	    state.currentWeapon = new Weapon(state.game, state.game.world.centerX, state.game.world.centerY - 50, randWeapon);
	    state.currentWeapon.anchor.setTo(0.5, 0.5);

			state.currentPanel.updateFull(state.currentWeapon);
		};
		this.onFinishedWeapon = function() {
			var state = this;
			state.game.player.wealth += state.currentWeapon.details.price;
			state.onWealthChanged();

	    state.currentWeapon.destroy();
	    state.spawnWeapon();
		};
		this.onWealthChanged = function() {
			var state = this;

			state.gameUIPoints.text = stringifyNum(state.game.player.wealth) + ' gold';
			state.upgradePanel.updateAllUpgrades();
		};
		this.onAutoHit = function() {
			var state = this;

			state.currentWeapon.progress += state.game.constants.baseAutoPower * (1 + state.game.player.upgrades.click);
			if(state.currentWeapon.progress >= state.currentWeapon.difficulty) {
				state.onFinishedWeapon();
			} else {
				state.anvilSprite.shake(10);
				state.currentWeapon.shake(10);
			}
			state.currentPanel.updateProgress(state.currentWeapon);
		};

		// Background
    let bgSnowSprite = this.game.add.sprite(this.game.world.width/2, this.game.world.height/2, 'bg-snow');
    bgSnowSprite.anchor.setTo(0.5,0.5);
    bgSnowSprite.scale.setTo(0.6,0.6);

    // Upgrades
    state.upgradePanel = new UpgradesPanel(state.game);
    state.upgradePanel.events.onBuy.add(function() {
			state.onWealthChanged();
    })

    // Current weapon panel
    this.currentPanel = new CurrentWeaponPanel(state.game, state.game.world.centerX, state.game.world.height - this.game.cache.getBitmapData('currentPanel').height - 25);
    this.currentPanel.anchor.setTo(0.5, 0);

    // Anvil
    this.anvilSprite = new Anvil(state.game, 400, 300);
    this.anvilSprite.anchor.setTo(0.5, 0.5);
    this.anvilSprite.events.onInputDown.add(state.onHitAnvil, state);

    state.spawnWeapon();

    // Current wealth
    this.gameUI = this.game.add.group();
    this.gameUI.position.setTo(0, 0);
    this.gameUIPoints = this.gameUI.addChild(state.game.add.text(400, 20, stringifyNum(state.game.player.wealth) + ' gold', {
        font: '32px Arial Black',
        fill: '#999999',
        strokeThickness: 4
    }));
    this.gameUIPoints.anchor.setTo(0.5, 0);

    // Autohit timer
    this.autoHitTimer = this.game.time.events.loop(state.game.constants.baseAutoTime/(1+state.game.constants.baseAutoDivider*state.game.player.upgrades.idleSpeed), this.onAutoHit, this);



	}
}

export default Main;