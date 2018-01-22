import tableUpgrades from '../data/tableUpgrades';
import tableWeapons from '../data/tableWeapons';
import tableQualities from '../data/tableQualities';

import Anvil from '../objects/Anvil';
import Weapon from '../objects/Weapon';

import QualityPanel from '../panels/QualityPanel';
import CurrentWeaponPanel from '../panels/CurrentWeaponPanel';
import UpgradesPanel from '../panels/UpgradesPanel';

import stringifyNum from '../helpers/stringifyNum';

class Main extends Phaser.State {

	preload() {

    this.tableWeapons = tableWeapons;
    this.tableUpgrades = tableUpgrades;

    // game config
    this.game.constants = {

    	baseClickPower: 10,
    	baseClickUpgradePower: 5,

    	// Autoclick period = baseAutoTime / (1 + baseAutoDivider * upgrades.idleSpeed)

    	baseAutoTime: 2000,
    	baseAutoDivider: 0.2,
    	baseAutoPower: 5,

    	// isCritical = random > 1 - (baseCritChance + (critChanceMultiplier * upgrades.critChance))
    	// CriticalMultiplier = critMultiplierBase + (critMultiplierGrower * upgrades.critPower)
    	baseCritChance: 0.01,
    	critChanceMultiplier: 0.002,
    	critMultiplierBase: 3,
    	critMultiplierGrower: 0.2
    };

    this.game.player = {
        strength: 1,
        wealth: 888800,
        quality: 0,
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
			var affort = state.game.constants.baseClickPower + (state.game.constants.baseClickUpgradePower *  state.game.player.upgrades.click);
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

	    var randWeapon = {};
	    var randWeaponData = Object.assign(state.tableWeapons[Math.floor(Math.random() * state.tableWeapons.length)]);
	    randWeapon.image = randWeaponData.imagePrefix + state.game.player.quality;
	    randWeapon.difficulty = randWeaponData.difficulty * tableQualities[state.game.player.quality].difficulty;
	    randWeapon.price = randWeaponData.price * tableQualities[state.game.player.quality].price;
	    randWeapon.name = tableQualities[state.game.player.quality].name + ' ' + randWeaponData.name;

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
    	state.qualityPanel.renderQuality();
		};
		this.onAutoHit = function() {
			var state = this;
			if(!state.game.player.upgrades.idlePower > 0) {
				return false;
			}

			state.currentWeapon.progress += state.game.constants.baseAutoPower * (state.game.player.upgrades.idlePower);
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
    state.upgradePanel = new UpgradesPanel(state.game, 20, 65);
    state.upgradePanel.events.onBuy.add(function() {
			state.onWealthChanged();
    })

    // Current weapon panel
    this.currentPanel = new CurrentWeaponPanel(state.game, state.game.world.centerX, state.game.world.height - this.game.cache.getBitmapData('currentPanel').height - 25);
    this.currentPanel.anchor.setTo(0.5, 0);

    // Anvil
    this.anvilSprite = new Anvil(state.game, state.game.world.centerX, state.game.world.centerY);
    this.anvilSprite.anchor.setTo(0.5, 0.5);
    this.anvilSprite.events.onInputDown.add(state.onHitAnvil, state);

    state.spawnWeapon();

    // Current wealth
    this.gameUI = this.game.add.group();
    this.gameUI.position.setTo(0, 0);
    this.gameUIPoints = this.gameUI.addChild(state.game.add.text(state.game.world.centerX, 30, stringifyNum(state.game.player.wealth) + ' gold', {
        font: '28px PressStart2P',
        fill: '#999999',
        strokeThickness: 4
    }));
    this.gameUIPoints.anchor.setTo(0.5, 0);

    // Quality button
    state.qualityPanel = new QualityPanel(state.game, 20, 20);
    state.qualityPanel.anchor.setTo(0, 0);
    state.qualityPanel.events.onBuy.add(function() {
			state.onWealthChanged();
	    state.currentWeapon.destroy();
			state.spawnWeapon();
    })

    // Autohit timer
    this.autoHitTimer = this.game.time.events.loop(state.game.constants.baseAutoTime/(1+state.game.constants.baseAutoDivider*state.game.player.upgrades.idleSpeed), this.onAutoHit, this);



	}
}

export default Main;