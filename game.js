function stringifyNum(number) {
	return parseInt(number);
}

var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

game.state.add('play', {
	preload: function() {
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

    this.tableWeapons =  [
      {name: 'Sword',       image: 'sword',       difficulty: 30, price: 20},
      {name: 'Battle Axe',  image: 'battle-axe',  difficulty: 20, price: 15},
      {name: 'Hammer',      image: 'hammer',      difficulty: 10, price: 10}
    ];

    this.tableUpgrades = {
			click: {
				name: 'Click power', image: 'upgrade-click', cost: 100, multiplier: 1.6, position: 0
			},
			critChance: {
				name: 'Crit chance', image: 'upgrade-crit-chance', cost: 500, multiplier: 1.6, position: 1
			},
			critPower: {
				name: 'Crit power', image: 'upgrade-crit-power', cost: 100, multiplier: 1.6, position: 2
			},
			idleSpeed: {
				name: 'Idle speed', image: 'upgrade-speed', cost: 100, multiplier: 1.6, position: 3
			},
			idlePower: {
				name: 'Idle power', image: 'upgrade-timer', cost: 100, multiplier: 1.6, position: 4
			}
    }

    // game config
    this.constants = {

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
    }

    this.player = {
        strength: 1,
        wealth: 0,
        upgrades: {
        	click: 0,
        	critChance: 0,
        	critPower: 0,
        	idleSpeed: 0,
        	idlePower: 0
        }
    };
	},

	create: function() {
		var state = this;

		// Background
    let bgSnowSprite = this.game.add.sprite(this.game.world.width/2, this.game.world.height/2, 'bg-snow');
    bgSnowSprite.anchor.setTo(0.5,0.5);
    bgSnowSprite.scale.setTo(0.6,0.6);

    console.log(bgSnowSprite);

    // Upgrades
    state.upgradePanel = this.game.add.group();
    state.upgradeButtons = {};
    Object.keys(state.tableUpgrades).forEach(function(key, index) {
    	state.onRenderUpgrade(key);
    	state.onUpdateUpgrade(key);
    });

    // Current weapon panel
    this.currentPanel = this.game.add.image(state.game.world.centerX, state.game.world.height - this.game.cache.getBitmapData('currentPanel').height - 25, this.game.cache.getBitmapData('currentPanel'));
    this.currentPanel.anchor.setTo(0.5, 0);

    this.currentNameText = this.currentPanel.addChild(state.game.add.text(0, 20, '', {
        font: '32px Arial Black',
        fill: '#dedeef',
        strokeThickness: 4
    }));
    this.currentNameText.anchor.setTo(0.5, 0);

    this.currentPriceText = this.currentPanel.addChild(state.game.add.text(state.currentPanel.width/2 - 10, 10, '', {
        font: '18px Arial Black',
        fill: '#c79030',
        strokeThickness: 4
    }));
    this.currentPriceText.anchor.setTo(1, 0);

    // Completion panel
    var comPanel = this.game.add.image(-this.game.cache.getBitmapData('completionPanel').width/2, this.currentPanel.height*2/3, this.game.cache.getBitmapData('completionPanel'));
    this.completionPanel = this.currentPanel.addChild(comPanel);
    this.completionPanel.anchor.setTo(0, 0.5);

    var comBar = this.game.add.image(4, 0, this.game.cache.getBitmapData('completionBar'));
    this.completionBar = this.completionPanel.addChild(comBar);
    this.completionBar.anchor.setTo(0, 0.5);

    this.completionText = this.completionPanel.addChild(state.game.add.text(state.completionPanel.width / 2, 3, '', {
        font: '24px Arial Black',
        fill: '#dedeef',
        strokeThickness: 4
    }));
    this.completionText.anchor.setTo(0.5, 0.5);

    // Anvil
    this.anvilSprite = this.game.add.sprite(400, 300, 'anvil');

    this.anvilSprite.anchor.setTo(0.5, 0.5);
    this.anvilSprite.inputEnabled = true;

    this.anvilSprite.events.onInputOver.add(function(){
        state.game.canvas.style.cursor = "pointer";
    });

    this.anvilSprite.events.onInputOut.add(function(){
        state.game.canvas.style.cursor = "default";
    });
    this.anvilSprite.events.onInputDown.add(state.onHitAnvil, state);

    state.onSpawnWeapon();

    // Current wealth
    this.gameUI = this.game.add.group();
    this.gameUI.position.setTo(0, 0);
    this.gameUIPoints = this.gameUI.addChild(state.game.add.text(400, 20, state.player.wealth + ' gold', {
        font: '32px Arial Black',
        fill: '#999999',
        strokeThickness: 4
    }));
    this.gameUIPoints.anchor.setTo(0.5, 0);

    // Autohit timer
    this.autoHitTimer = this.game.time.events.loop(state.constants.baseAutoTime/(1+state.constants.baseAutoDivider*state.player.upgrades.idleSpeed), this.onAutoHit, this);


	},
	onHitAnvil: function() {
		var state = this;
		var random = Math.random();
		var isCritical = (random > 1 - (state.constants.baseCritChance + state.constants.critChanceMultiplier * state.player.upgrades.critChance));
		var shakeShift = isCritical ? 25 : 10;

		state.onHitCurrentWeapon(isCritical);
		state.onShakeAnvil(shakeShift);
	},
	onHitCurrentWeapon: function(isCritical) {
		var state = this;
		var shakeShift = isCritical ? 25 : 10;
		var affort = state.constants.baseClickPower * (1 + state.player.upgrades.click);
		affort = isCritical ? affort * (state.constants.critMultiplierBase + state.constants.critMultiplierGrower * state.player.upgrades.critPower) : affort;
		state.currentWeapon.progress += affort;
		if(state.currentWeapon.progress >= state.currentWeapon.difficulty) {
			state.onFinishedWeapon();
		} else {
			state.onShakeCurrentWeapon(shakeShift);			
		}
		state.onUpdateCompletion();
	},
	onShakeAnvil: function(shakeRange) {
		var state = this;
		var shakeCount = 4;
		var shakeRange = shakeRange;
    var shakeTimer = state.game.time.create(false);
		shakeTimer.loop(50, function(){
      if (shakeCount == 0) {
          //if shake end set camera to default position 
          this.anvilSprite.x = 400;
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
      this.anvilSprite.x += shift;
      shakeCount--;
		}, this);

		shakeTimer.start();
	},
	onShakeCurrentWeapon: function(shakeRange) {
		var state = this;
		var shakeCount = 4;
		var shakeRange = shakeRange;
    var shakeTimer = state.game.time.create(false);
		shakeTimer.loop(50, function(){
      if (shakeCount == 0) {
          //if shake end set camera to default position
          this.currentWeapon.x = 400;
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
      this.currentWeapon.x += shift;
      shakeCount--;
		}, this);

		shakeTimer.start();		
	},
	onSpawnWeapon: function() {
		var state = this;

    var randWeapon = state.tableWeapons[Math.floor(Math.random() * state.tableWeapons.length)];
		state.currentWeapon = state.game.add.sprite(state.game.world.centerX, state.game.world.centerY, randWeapon.image);
		state.currentWeapon.progress = 0;
    state.currentWeapon.difficulty = randWeapon.difficulty;
    // center anchor
    state.currentWeapon.anchor.setTo(0.5, 1);
    // reference to the database
    state.currentWeapon.details = randWeapon;

    state.currentNameText.text = state.currentWeapon.details.name;
    state.currentPriceText.text = state.currentWeapon.details.price + 'g';

    // hook into health and lifecycle events
    state.currentWeapon.events.onKilled.add(state.onFinishedWeapon, state);
		state.onUpdateCompletion();

	},
	onFinishedWeapon: function() {
		var state = this;
		state.player.wealth += state.currentWeapon.details.price;
		state.onWealthChanged();

    state.currentWeapon.destroy();
    state.onSpawnWeapon();
	},
	onRestoreWeapon: function() {

	},
	onUpdateCompletion: function() {
		var state = this;
		state.completionBar.width = 300 * (state.currentWeapon.progress/state.currentWeapon.difficulty);
		state.completionText.text = stringifyNum(state.currentWeapon.progress) + '/' + stringifyNum(state.currentWeapon.difficulty);
	},

	onRenderUpgrade: function(upgrade) {
		var state = this;
  	state.upgradeButtons[upgrade] = {};
    state.upgradeButtons[upgrade].button = state.upgradePanel.addChild(state.game.add.button(20, 20 + state.tableUpgrades[upgrade].position * 40, state.game.cache.getBitmapData('upgradeButton')));
    state.upgradeButtons[upgrade].button.events.onInputDown.add(state.onUpgradeClick, state);
    state.upgradeButtons[upgrade].button.data = upgrade;

  	state.upgradeButtons[upgrade].lvlText = state.upgradeButtons[upgrade].button.addChild(state.game.add.text(17.5, 20, '', {
      font: '20px Arial Black',
      fill: '#dedeef',
      strokeThickness: 4
  	}));
  	state.upgradeButtons[upgrade].lvlText.anchor.setTo(0.5,0.5);
    
  	state.upgradeButtons[upgrade].costText = state.upgradeButtons[upgrade].button.addChild(state.game.add.text(75, 20, '', {
      font: '20px Arial Black',
      fill: '#c79030',
      strokeThickness: 4
  	}));
  	state.upgradeButtons[upgrade].costText.anchor.setTo(0, 0.5);

    state.upgradeButtons[upgrade].icon = state.upgradeButtons[upgrade].button.addChild(state.game.add.image(35, 0, state.game.cache.getBitmapData('upgradeIcon')));
    state.upgradeButtons[upgrade].img = state.upgradeButtons[upgrade].icon.addChild(state.game.add.image(17.5, 17.5, state.tableUpgrades[upgrade].image));      
  	state.upgradeButtons[upgrade].img.anchor.setTo(0.5,0.5);
  	state.upgradeButtons[upgrade].img.scale.setTo(0.4,0.4);
	},

	onUpdateUpgrade: function(upgrade) {
		var state = this;
		var upgradeCost = parseInt(Math.pow(state.tableUpgrades[upgrade].multiplier,state.player.upgrades[upgrade]) * state.tableUpgrades[upgrade].cost);


		state.upgradeButtons[upgrade].lvlText.text = state.player.upgrades[upgrade];
		state.upgradeButtons[upgrade].costText.text = upgradeCost + 'g';

		if(upgradeCost > state.player.wealth) {
			state.upgradeButtons[upgrade].costText.fill = "#ff0000";
			state.upgradeButtons[upgrade].button.inputEnabled = false;
		} else {
			state.upgradeButtons[upgrade].costText.fill = "#c79030";
			state.upgradeButtons[upgrade].button.inputEnabled = true;
		}
	},
	onUpdateAllUpgrades: function() {
		var state = this;
    Object.keys(state.tableUpgrades).forEach(function(key, index) {
    	state.onUpdateUpgrade(key);
    });
	},
	onUpgradeClick: function(button) {
		var state = this;
		var upgradeCost = parseInt(Math.pow(state.tableUpgrades[button.data].multiplier, state.player.upgrades[button.data]) * state.tableUpgrades[button.data].cost);
		if(upgradeCost <= state.player.wealth) {
			state.player.wealth -= upgradeCost;
			state.player.upgrades[button.data] += 1;

			state.onWealthChanged();
		}
	},
	onTryUpgrade: function(upgrade) {

	},
	onWealthChanged: function() {
		var state = this;

		state.gameUIPoints.text = stringifyNum(state.player.wealth) + ' gold';
		state.onUpdateAllUpgrades();
	},

	onAutoHit: function() {
		var state = this;

		state.currentWeapon.progress += state.constants.baseAutoPower * (1 + state.player.upgrades.click);
		if(state.currentWeapon.progress >= state.currentWeapon.difficulty) {
			state.onFinishedWeapon();
		} else {
			state.onShakeAnvil(10);
			state.onShakeCurrentWeapon(10);
		}
		state.onUpdateCompletion(10);
	}
});


game.state.start('play');
