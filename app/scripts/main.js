(function() {

  Phaser.Game.prototype.showDebugHeader = function () {}
  window.onload = function () {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game')

    var engine = new GameEngine(game)

    var bootState = GameEngine.States.get('boot')
    bootState.prototype.preload = function () {
      this.load.image('preloader', 'images/preloader.gif')
    }

    var preloadState = GameEngine.States.get('preload')
    preloadState.prototype.preloadRender = function () {
      this.asset = this.add.sprite(this.game.width / 2, this.game.height / 2, 'preloader')
      this.asset.anchor.setTo(0.5, 0.5)

      this.load.setPreloadSprite(this.asset)
    }

    engine.start()
  }

})()
