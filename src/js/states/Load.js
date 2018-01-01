import LoadingPanel from '../panels/LoadingPanel';

class Load extends Phaser.State {

	preload() {
		var state = this;
		var loadingBg = this.game.add.image(0, 0, this.game.cache.getBitmapData('loadingBg'));

    this.loadingPanel = new LoadingPanel(state.game, state.game.world.centerX, state.game.world.height - this.game.cache.getBitmapData('currentPanel').height - 25);
    this.loadingPanel.anchor.setTo(0.5, 0);

    this.load.onFileComplete.add(function(progress, cacheKey, success, totalLoaded, totalFiles) {
    	state.loadingPanel.updateProgress(progress);
    }, state);
    this.load.onLoadComplete.add(function() {
    }, state);

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

	};

	create() {
		this.game.state.start('Main');
	}
}

export default Load;