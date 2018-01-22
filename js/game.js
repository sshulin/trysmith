'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  'use strict';

  var Boot = function (_Phaser$State) {
    _inherits(Boot, _Phaser$State);

    function Boot() {
      _classCallCheck(this, Boot);

      return _possibleConstructorReturn(this, (Boot.__proto__ || Object.getPrototypeOf(Boot)).apply(this, arguments));
    }

    _createClass(Boot, [{
      key: 'preload',
      value: function preload() {

        var bmdCurPanel = this.game.add.bitmapData(508, 158);
        bmdCurPanel.ctx.fillStyle = '#9099b5';
        bmdCurPanel.ctx.strokeStyle = '#000000';
        bmdCurPanel.ctx.lineWidth = 8;
        bmdCurPanel.ctx.fillRect(0, 0, 508, 158);
        bmdCurPanel.ctx.strokeRect(0, 0, 508, 158);
        this.game.cache.addBitmapData('currentPanel', bmdCurPanel);

        var bmdComPanel = this.game.add.bitmapData(308, 38);
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

        var bmdLoadingBg = this.game.add.bitmapData(this.game.world.width, this.game.world.height);
        bmdLoadingBg.ctx.fillStyle = '#d6eef9';
        bmdLoadingBg.ctx.strokeStyle = '#000000';
        bmdLoadingBg.ctx.fillRect(0, 0, this.game.world.width, this.game.world.height);
        this.game.cache.addBitmapData('loadingBg', bmdLoadingBg);
      }
    }, {
      key: 'create',
      value: function create() {
        this.game.time.advancedTiming = true;
        this.game.state.start('Load');
      }
    }]);

    return Boot;
  }(Phaser.State);

  function stringifyNum(number) {
    var int = parseInt(number);

    var prefix = ["", "K", "M", "B", "T", "Quad", "Qiunt", " Z", " Y", " * 10^27", " * 10^30", " * 10^33"]; // should be enough. Number.MAX_VALUE is about 10^308
    var ii = 0;
    while ((int = int / 1000) >= 1) {
      ii++;
    }
    int = parseInt(int * 10000) / 10;
    return int + prefix[ii];
  }

  var LoadingPanel = function (_Phaser$Sprite) {
    _inherits(LoadingPanel, _Phaser$Sprite);

    function LoadingPanel(game, x, y, data) {
      _classCallCheck(this, LoadingPanel);

      var panelImg = game.cache.getBitmapData('currentPanel');

      var _this2 = _possibleConstructorReturn(this, (LoadingPanel.__proto__ || Object.getPrototypeOf(LoadingPanel)).call(this, game, x, y, panelImg));

      var panel = _this2;

      game.add.existing(_this2);

      panel.nameText = panel.addChild(game.add.text(0, 20, '', {
        font: '32px Arial Black',
        fill: '#dedeef',
        strokeThickness: 4
      }));
      panel.nameText.text = 'Loading...';
      panel.nameText.anchor.setTo(0.5, 0);

      // Completion panel
      var comPanel = game.add.sprite(-game.cache.getBitmapData('completionPanel').width / 2, panel.height * 2 / 3, game.cache.getBitmapData('completionPanel'));
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

      return _this2;
    }

    _createClass(LoadingPanel, [{
      key: 'updateProgress',
      value: function updateProgress(progress) {
        var panel = this;

        panel.completionBar.width = 300 * (progress / 100);
        panel.completionText.text = '' + progress + '%';
      }
    }, {
      key: 'updateFull',
      value: function updateFull(progress) {
        var panel = this;

        panel.nameText.text = 'Loading...';
        panel.updateProgress(progress);
      }
    }]);

    return LoadingPanel;
  }(Phaser.Sprite);

  var Load = function (_Phaser$State2) {
    _inherits(Load, _Phaser$State2);

    function Load() {
      _classCallCheck(this, Load);

      return _possibleConstructorReturn(this, (Load.__proto__ || Object.getPrototypeOf(Load)).apply(this, arguments));
    }

    _createClass(Load, [{
      key: 'preload',
      value: function preload() {
        var state = this;
        var loadingBg = this.game.add.image(0, 0, this.game.cache.getBitmapData('loadingBg'));

        this.loadingPanel = new LoadingPanel(state.game, state.game.world.centerX, state.game.world.height - this.game.cache.getBitmapData('currentPanel').height - 25);
        this.loadingPanel.anchor.setTo(0.5, 0);

        this.load.onFileComplete.add(function (progress, cacheKey, success, totalLoaded, totalFiles) {
          state.loadingPanel.updateProgress(progress);
        }, state);
        this.load.onLoadComplete.add(function () {}, state);

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

        var bmdQualityBtn = this.game.add.bitmapData(250, 35);
        bmdQualityBtn.ctx.fillStyle = '#818ab5';
        bmdQualityBtn.ctx.strokeStyle = '#000000';
        bmdQualityBtn.ctx.lineWidth = 4;
        bmdQualityBtn.ctx.fillRect(0, 0, 250, 35);
        bmdQualityBtn.ctx.strokeRect(0, 0, 250, 35);
        this.game.cache.addBitmapData('qualityButton', bmdQualityBtn);

        var bmdQualityTextBg = this.game.add.bitmapData(130, 35);
        bmdQualityTextBg.ctx.fillStyle = '#9099b5';
        bmdQualityTextBg.ctx.strokeStyle = '#000000';
        bmdQualityTextBg.ctx.lineWidth = 4;
        bmdQualityTextBg.ctx.fillRect(0, 0, 130, 35);
        bmdQualityTextBg.ctx.strokeRect(0, 0, 130, 35);
        this.game.cache.addBitmapData('qualityTextBg', bmdQualityTextBg);

        this.game.load.image('anvil', 'assets/images/anvil.png');
        this.game.load.image('bg-snow', 'assets/images/bg-snow.jpg');

        // Upgrade icons
        this.game.load.image('upgrade-click', 'assets/images/buttons/click.png');
        this.game.load.image('upgrade-crit-chance', 'assets/images/buttons/crit-chance.png');
        this.game.load.image('upgrade-crit-power', 'assets/images/buttons/crit-power.png');
        this.game.load.image('upgrade-speed', 'assets/images/buttons/speed.png');
        this.game.load.image('upgrade-timer', 'assets/images/buttons/timer.png');

        // Weapons
        this.game.load.image('axe-0', 'assets/images/weapons/level0/axe_viking_imperor.png');
        this.game.load.image('hammer-0', 'assets/images/weapons/level0/hammer_manowar_loki.png');
        this.game.load.image('sword-0', 'assets/images/weapons/level0/sword_sapphire_king.png');

        this.game.load.image('axe-1', 'assets/images/weapons/level1/axe_viking_imperor.png');
        this.game.load.image('hammer-1', 'assets/images/weapons/level1/hammer_manowar_loki.png');
        this.game.load.image('sword-1', 'assets/images/weapons/level1/sword_sapphire_king.png');

        this.game.load.image('axe-2', 'assets/images/weapons/level2/axe_viking_imperor.png');
        this.game.load.image('hammer-2', 'assets/images/weapons/level2/hammer_manowar_loki.png');
        this.game.load.image('sword-2', 'assets/images/weapons/level2/sword_sapphire_king.png');

        this.game.load.image('axe-3', 'assets/images/weapons/level3/axe_viking_imperor.png');
        this.game.load.image('hammer-3', 'assets/images/weapons/level3/hammer_manowar_loki.png');
        this.game.load.image('sword-3', 'assets/images/weapons/level3/sword_sapphire_king.png');

        this.game.load.image('axe-4', 'assets/images/weapons/level4/axe_viking_imperor.png');
        this.game.load.image('hammer-4', 'assets/images/weapons/level4/hammer_manowar_loki.png');
        this.game.load.image('sword-4', 'assets/images/weapons/level4/sword_sapphire_king.png');
      }
    }, {
      key: 'create',
      value: function create() {
        this.game.state.start('Main');
      }
    }]);

    return Load;
  }(Phaser.State);

  var tableUpgrades = {
    click: {
      name: 'Click power', image: 'upgrade-click', cost: 100, multiplier: 1.6, position: 0
    },
    critChance: {
      name: 'Crit chance', image: 'upgrade-crit-chance', cost: 100, multiplier: 1.6, position: 1
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
  };

  var tableWeapons = [{ name: 'Sword', imagePrefix: 'sword-', difficulty: 150, price: 25 }, { name: 'Hammer', imagePrefix: 'hammer-', difficulty: 50, price: 15 }, { name: 'Axe', imagePrefix: 'axe-', difficulty: 100, price: 20 }];

  var tableQualities = {
    '0': {
      name: 'Regular',
      price: 1,
      difficulty: 1,
      cost: 0
    },
    '1': {
      name: 'Good',
      price: 20,
      difficulty: 10,
      cost: 1500
    },
    '2': {
      name: 'Great',
      price: 400,
      difficulty: 100,
      cost: 30000
    },
    '3': {
      name: 'Excellent',
      price: 8000,
      difficulty: 1000,
      cost: 1000000
    },
    '4': {
      name: 'Marvelous',
      price: 160000,
      difficulty: 10000,
      cost: 15000000
    }

  };

  var Anvil = function (_Phaser$Sprite2) {
    _inherits(Anvil, _Phaser$Sprite2);

    function Anvil(game, x, y) {
      _classCallCheck(this, Anvil);

      var _this4 = _possibleConstructorReturn(this, (Anvil.__proto__ || Object.getPrototypeOf(Anvil)).call(this, game, x, y, 'anvil'));

      var anv = _this4;

      anv.game.add.existing(_this4);

      _this4.inputEnabled = true;

      _this4.events.onInputOver.add(function () {
        anv.game.canvas.style.cursor = "pointer";
      });

      _this4.events.onInputOut.add(function () {
        anv.game.canvas.style.cursor = "default";
      });

      return _this4;
    }

    _createClass(Anvil, [{
      key: 'shake',
      value: function shake(shakeRange) {

        var anv = this;

        var shakeCount = 4;
        var shakeRange = shakeRange;
        var shakeTimer = anv.game.time.create(false);
        shakeTimer.loop(50, function () {
          if (shakeCount == 0) {
            //if shake end set camera to default position 
            anv.x = anv.game.world.centerX;
            shakeTimer.stop();
            return;
          }
          var shift;
          if (shakeCount % 2) {
            shift = -shakeRange / 2;
          } else {
            shift = shakeRange / 2;
          }
          anv.x += shift;
          shakeCount--;
        });

        shakeTimer.start();
      }
    }]);

    return Anvil;
  }(Phaser.Sprite);

  var Weapon = function (_Phaser$Sprite3) {
    _inherits(Weapon, _Phaser$Sprite3);

    function Weapon(game, x, y, data) {
      _classCallCheck(this, Weapon);

      var _this5 = _possibleConstructorReturn(this, (Weapon.__proto__ || Object.getPrototypeOf(Weapon)).call(this, game, x, y, data.image));

      var anv = _this5;

      anv.progress = 0;
      anv.difficulty = data.difficulty;
      anv.details = data;

      anv.game.add.existing(_this5);
      return _this5;
    }

    _createClass(Weapon, [{
      key: 'shake',
      value: function shake(shakeRange) {

        var anv = this;

        var shakeCount = 4;
        var shakeRange = shakeRange;
        var shakeTimer = anv.game.time.create(false);
        shakeTimer.loop(50, function () {
          if (shakeCount == 0) {
            //if shake end set camera to default position 
            anv.x = 480;
            shakeTimer.stop();
            return;
          }
          var shift;
          if (shakeCount % 2) {
            shift = -shakeRange / 2;
          } else {
            shift = shakeRange / 2;
          }
          anv.x += shift;
          shakeCount--;
        });

        shakeTimer.start();
      }
    }]);

    return Weapon;
  }(Phaser.Sprite);

  var QualityPanel = function (_Phaser$Button) {
    _inherits(QualityPanel, _Phaser$Button);

    function QualityPanel(game, x, y, data) {
      _classCallCheck(this, QualityPanel);

      var qualityImg = game.cache.getBitmapData('qualityButton');
      var qualityTextBgImg = game.cache.getBitmapData('qualityTextBg');

      var _this6 = _possibleConstructorReturn(this, (QualityPanel.__proto__ || Object.getPrototypeOf(QualityPanel)).call(this, game, x, y, qualityImg));

      var panel = _this6;

      // Quality panel
      game.add.existing(_this6);

      panel.events.onBuy = new Phaser.Signal();

      panel.onInputDown.add(panel.onQualityClick, panel);

      panel.lvlText = panel.addChild(panel.game.add.text(17.5, 20, '', {
        font: '14px PressStart2P',
        fill: '#ffffff',
        strokeThickness: 4
      }));
      panel.lvlText.anchor.setTo(0.5, 0.5);

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

      return _this6;
    }

    _createClass(QualityPanel, [{
      key: 'renderQuality',
      value: function renderQuality() {
        var panel = this;
        var upgradeCost = parseInt(tableQualities[panel.game.player.quality + 1].cost);

        panel.lvlText.text = panel.game.player.quality;
        panel.nameText.text = tableQualities[panel.game.player.quality].name;
        panel.costText.text = stringifyNum(upgradeCost) + '';

        if (upgradeCost > panel.game.player.wealth) {
          panel.costText.fill = "#ff0000";
          panel.inputEnabled = false;
        } else {
          panel.costText.fill = "#c79030";
          panel.inputEnabled = true;
        }
      }
    }, {
      key: 'onQualityClick',
      value: function onQualityClick() {
        var panel = this;
        var upgradeCost = parseInt(tableQualities[panel.game.player.quality + 1].cost);

        if (upgradeCost <= panel.game.player.wealth) {
          panel.game.player.wealth -= upgradeCost;
          panel.game.player.quality += 1;

          this.events.onBuy.dispatch(this);
        }
      }
    }]);

    return QualityPanel;
  }(Phaser.Button);

  var CurrentWeaponPanel = function (_Phaser$Sprite4) {
    _inherits(CurrentWeaponPanel, _Phaser$Sprite4);

    function CurrentWeaponPanel(game, x, y, data) {
      _classCallCheck(this, CurrentWeaponPanel);

      var panelImg = game.cache.getBitmapData('currentPanel');

      var _this7 = _possibleConstructorReturn(this, (CurrentWeaponPanel.__proto__ || Object.getPrototypeOf(CurrentWeaponPanel)).call(this, game, x, y, panelImg));

      var panel = _this7;

      // Current weapon panel
      game.add.existing(_this7);

      panel.nameText = panel.addChild(game.add.text(0, 25, '', {
        font: '24px PressStart2P',
        fill: '#dedeef',
        strokeThickness: 4
      }));
      panel.nameText.anchor.setTo(0.5, 0);

      panel.priceText = panel.addChild(game.add.text(panel.width / 2 - 10, 10, '', {
        font: '14px PressStart2P',
        fill: '#c79030',
        strokeThickness: 4
      }));
      panel.priceText.anchor.setTo(1, 0);

      // Completion panel
      var comPanel = game.add.sprite(-game.cache.getBitmapData('completionPanel').width / 2, panel.height * 2 / 3, game.cache.getBitmapData('completionPanel'));
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

      return _this7;
    }

    _createClass(CurrentWeaponPanel, [{
      key: 'updateProgress',
      value: function updateProgress(weapon) {
        var panel = this;

        panel.completionBar.width = 300 * (weapon.progress / weapon.difficulty);
        panel.completionText.text = stringifyNum(weapon.progress) + '/' + stringifyNum(weapon.difficulty);
      }
    }, {
      key: 'updateFull',
      value: function updateFull(weapon) {
        var panel = this;

        panel.nameText.text = weapon.details.name;
        panel.priceText.text = stringifyNum(weapon.details.price) + 'g';
        panel.updateProgress(weapon);
      }
    }]);

    return CurrentWeaponPanel;
  }(Phaser.Sprite);

  var CurrentWeaponPanel$2 = function (_Phaser$Sprite5) {
    _inherits(CurrentWeaponPanel$2, _Phaser$Sprite5);

    function CurrentWeaponPanel$2(game, x, y, data) {
      _classCallCheck(this, CurrentWeaponPanel$2);

      var panelImg = game.cache.getBitmapData('currentPanel');

      var _this8 = _possibleConstructorReturn(this, (CurrentWeaponPanel$2.__proto__ || Object.getPrototypeOf(CurrentWeaponPanel$2)).call(this, game, x, y));

      var panel = _this8;

      // Current weapon panel
      game.add.existing(_this8);

      panel.upgradeButtons = {};
      Object.keys(tableUpgrades).forEach(function (key, index) {
        panel.renderUpgrade(key);
        panel.updateUpgrade(key);
      });

      panel.events.onBuy = new Phaser.Signal();

      return _this8;
    }

    _createClass(CurrentWeaponPanel$2, [{
      key: 'renderUpgrade',
      value: function renderUpgrade(upgrade) {
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
        panel.upgradeButtons[upgrade].lvlText.anchor.setTo(0.5, 0.5);

        panel.upgradeButtons[upgrade].costText = panel.upgradeButtons[upgrade].button.addChild(panel.game.add.text(75, 20, '', {
          font: '14px PressStart2P',
          fill: '#c79030',
          strokeThickness: 4
        }));
        panel.upgradeButtons[upgrade].costText.anchor.setTo(0, 0.5);

        panel.upgradeButtons[upgrade].icon = panel.upgradeButtons[upgrade].button.addChild(panel.game.add.image(35, 0, panel.game.cache.getBitmapData('upgradeIcon')));
        panel.upgradeButtons[upgrade].img = panel.upgradeButtons[upgrade].icon.addChild(panel.game.add.image(17.5, 17.5, tableUpgrades[upgrade].image));
        panel.upgradeButtons[upgrade].img.anchor.setTo(0.5, 0.5);
        panel.upgradeButtons[upgrade].img.scale.setTo(0.4, 0.4);
      }
    }, {
      key: 'updateUpgrade',
      value: function updateUpgrade(upgrade) {
        var panel = this;
        var upgradeCost = parseInt(Math.pow(tableUpgrades[upgrade].multiplier, panel.game.player.upgrades[upgrade]) * tableUpgrades[upgrade].cost);

        panel.upgradeButtons[upgrade].lvlText.text = panel.game.player.upgrades[upgrade];
        panel.upgradeButtons[upgrade].costText.text = stringifyNum(upgradeCost) + 'g';

        if (upgradeCost > panel.game.player.wealth) {
          panel.upgradeButtons[upgrade].costText.fill = "#ff0000";
          panel.upgradeButtons[upgrade].button.inputEnabled = false;
        } else {
          panel.upgradeButtons[upgrade].costText.fill = "#c79030";
          panel.upgradeButtons[upgrade].button.inputEnabled = true;
        }
      }
    }, {
      key: 'updateAllUpgrades',
      value: function updateAllUpgrades() {
        var panel = this;

        Object.keys(tableUpgrades).forEach(function (key, index) {
          panel.updateUpgrade(key);
        });
      }
    }, {
      key: 'onUpgradeClick',
      value: function onUpgradeClick(button) {
        var panel = this;

        var upgradeCost = parseInt(Math.pow(tableUpgrades[button.data].multiplier, panel.game.player.upgrades[button.data]) * tableUpgrades[button.data].cost);
        if (upgradeCost <= panel.game.player.wealth) {
          panel.game.player.wealth -= upgradeCost;
          panel.game.player.upgrades[button.data] += 1;

          this.events.onBuy.dispatch(this);
        }
      }
    }]);

    return CurrentWeaponPanel$2;
  }(Phaser.Sprite);

  var Main = function (_Phaser$State3) {
    _inherits(Main, _Phaser$State3);

    function Main() {
      _classCallCheck(this, Main);

      return _possibleConstructorReturn(this, (Main.__proto__ || Object.getPrototypeOf(Main)).apply(this, arguments));
    }

    _createClass(Main, [{
      key: 'preload',
      value: function preload() {

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
          wealth: 0,
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
    }, {
      key: 'create',
      value: function create() {

        var state = this;

        this.checkCritical = function () {
          var random = Math.random();
          var isCritical = random > 1 - (state.game.constants.baseCritChance + state.game.constants.critChanceMultiplier * state.game.player.upgrades.critChance);
          return isCritical;
        };

        this.onHitAnvil = function () {
          var isCritical = state.checkCritical();
          var shakeShift = isCritical ? 25 : 10;

          state.onHitCurrentWeapon(isCritical);
          state.anvilSprite.shake(shakeShift);
        };
        this.onHitCurrentWeapon = function (isCritical) {
          var shakeShift = isCritical ? 25 : 10;
          var affort = state.game.constants.baseClickPower + state.game.constants.baseClickUpgradePower * state.game.player.upgrades.click;
          affort = isCritical ? affort * (state.game.constants.critMultiplierBase + state.game.constants.critMultiplierGrower * state.game.player.upgrades.critPower) : affort;
          state.currentWeapon.progress += affort;
          if (state.currentWeapon.progress >= state.currentWeapon.difficulty) {
            state.onFinishedWeapon();
          } else {
            state.currentWeapon.shake(shakeShift);
          }
          state.currentPanel.updateProgress(state.currentWeapon);
        };

        this.spawnWeapon = function () {
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
        this.onFinishedWeapon = function () {
          var state = this;
          state.game.player.wealth += state.currentWeapon.details.price;
          state.onWealthChanged();

          state.currentWeapon.destroy();
          state.spawnWeapon();
        };
        this.onWealthChanged = function () {
          var state = this;

          state.gameUIPoints.text = stringifyNum(state.game.player.wealth) + ' gold';
          state.upgradePanel.updateAllUpgrades();
          state.qualityPanel.renderQuality();
        };
        this.onAutoHit = function () {
          var state = this;
          if (!state.game.player.upgrades.idlePower > 0) {
            return false;
          }

          state.currentWeapon.progress += state.game.constants.baseAutoPower * state.game.player.upgrades.idlePower;
          if (state.currentWeapon.progress >= state.currentWeapon.difficulty) {
            state.onFinishedWeapon();
          } else {
            state.anvilSprite.shake(10);
            state.currentWeapon.shake(10);
          }
          state.currentPanel.updateProgress(state.currentWeapon);
        };

        // Background
        var bgSnowSprite = this.game.add.sprite(this.game.world.width / 2, this.game.world.height / 2, 'bg-snow');
        bgSnowSprite.anchor.setTo(0.5, 0.5);
        bgSnowSprite.scale.setTo(0.6, 0.6);

        // Upgrades
        state.upgradePanel = new CurrentWeaponPanel$2(state.game, 20, 65);
        state.upgradePanel.events.onBuy.add(function () {
          state.onWealthChanged();
        });

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
        state.qualityPanel.events.onBuy.add(function () {
          state.onWealthChanged();
          state.currentWeapon.destroy();
          state.spawnWeapon();
        });

        // Autohit timer
        this.autoHitTimer = this.game.time.events.loop(state.game.constants.baseAutoTime / (1 + state.game.constants.baseAutoDivider * state.game.player.upgrades.idleSpeed), this.onAutoHit, this);
      }
    }]);

    return Main;
  }(Phaser.State);

  var Game = function (_Phaser$Game) {
    _inherits(Game, _Phaser$Game);

    function Game() {
      _classCallCheck(this, Game);

      var _this10 = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this, 960, 640, Phaser.AUTO, ''));

      _this10.state.add('Boot', Boot);
      _this10.state.add('Load', Load);
      _this10.state.add('Main', Main);
      _this10.state.start('Boot');
      return _this10;
    }

    return Game;
  }(Phaser.Game);

  window.initGame = function () {
    new Game();
  };
})();