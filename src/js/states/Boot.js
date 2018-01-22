class Boot extends Phaser.State {
	preload() {

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
	create() {
		this.game.time.advancedTiming = true;
		this.game.state.start('Load');
	}
}

export default Boot;