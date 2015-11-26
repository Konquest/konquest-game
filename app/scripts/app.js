/* globals GameEngine, GameNetwork */

(function () {
  var GameApp = window.GameApp = function () {
    this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'game')
    this.engine = new GameEngine(this.game)
    this.network = new GameNetwork(this.game)
    // TODO networking

    this._initialize()
  }

  GameApp.prototype._initialize = function () {
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
      if (player.id === this.game.localPlayerId) {
        this.game.camera.follow(this.playerMap[this.game.localPlayerId].sprite)
      }
    }

    playState.prototype.onGameCreate = function () {
      this.game.localPlayerId = 123

      this.W = this.game.input.keyboard.addKey(Phaser.Keyboard.W)
      this.A = this.game.input.keyboard.addKey(Phaser.Keyboard.A)
      this.S = this.game.input.keyboard.addKey(Phaser.Keyboard.S)
      this.D = this.game.input.keyboard.addKey(Phaser.Keyboard.D)
      this.spaceButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

      setTimeout(function () {
        // Mock player join
        this._onPlayerJoin({
          id: 123
        })

        setInterval(function () {
          if (!this.playerMap[this.game.localPlayerId]) {
            return
          }
          var state = {
            id: 123,
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
          this._onPlayerUpdate(state)
        }.bind(this), 100)
      }.bind(this), 50)
    }
  }

  GameApp.prototype.start = function () {
    this.engine.start()
  }
})()
