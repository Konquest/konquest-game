/* globals GameEngine, GameNetwork */

(function () {
  var GameApp = window.GameApp = function () {
    this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'game')
    this.engine = new GameEngine(this.game)
    this.network = new GameNetwork(this.game)

    this._initialize()
  }

  GameApp.prototype._initialize = function () {
    var app = this

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

    var playState = GameEngine.States.get('play')
    playState.prototype.onPlayerJoin = function (player) {
      console.log('player joined', player)
      if (player.id === this.game.localPlayerId) {
        console.log('follow this player!')
        this.game.camera.follow(this.playerMap[this.game.localPlayerId].sprite)
      }
    }

    playState.prototype.onGameCreate = function () {
      this.game.localPlayerId = app.network.id
      console.log('local player id', app.network.id)

      this.W = this.game.input.keyboard.addKey(Phaser.Keyboard.W)
      this.A = this.game.input.keyboard.addKey(Phaser.Keyboard.A)
      this.S = this.game.input.keyboard.addKey(Phaser.Keyboard.S)
      this.D = this.game.input.keyboard.addKey(Phaser.Keyboard.D)
      this.spaceButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

      setInterval(function () {
        if (!this.playerMap[this.game.localPlayerId]) {
          return
        }
        var state = {
          id: this.game.localPlayerId,
          controls: {
            left: this.A.isDown,
            right: this.D.isDown,
            jump: this.W.isDown,
            jetpack: this.spaceButton.isDown,
            primary: this.game.input.activePointer.leftButton.isDown,
            secondary: this.game.input.activePointer.rightButton.isDown,
            angle: this.game.physics.arcade.angleToXY(this.playerMap[this.game.localPlayerId].sprite, this.game.input.activePointer.worldX, this.game.input.activePointer.worldY)
          }
        }
        this.game.onPlayerUpdate.dispatch(state)
        this.game.updatePlayer.dispatch(state)  // For server to update
      }.bind(this), 100)
    }
  }

  GameApp.prototype.start = function () {
    this.engine.start()
  }
})();
