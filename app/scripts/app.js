/* globals GameEngine, GameNetwork */

(function () {
  var GameApp = window.GameApp = function () {
    this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'game')
    this.engine = new GameEngine(this.game)
    this.network = new GameNetwork(this.game, this.engine)

    this._initialize()

    this.engine.on(undefined, function () {
      console.error(new Error('undefined event triggered'))
    })
  }

  GameApp.prototype._initialize = function () {
    var app = this

    this.engine.on(GameEngine.events.NETWORK_CONNECT, function (id) {
      app.game.localPlayerId = id
      console.log('local player id', app.game.localPlayerId)
    })

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

    this.engine.on(GameEngine.events.PLAYER_JOIN, function () {
      app.game.camera.follow(app.game.state.states.play.playerMap[app.game.localPlayerId].sprite)
    })
    this.engine.on(GameEngine.events.GAME_CREATE, function () {
      var playState = app.game.state.states.play

      playState.W = app.game.input.keyboard.addKey(Phaser.Keyboard.W)
      playState.A = app.game.input.keyboard.addKey(Phaser.Keyboard.A)
      playState.S = app.game.input.keyboard.addKey(Phaser.Keyboard.S)
      playState.D = app.game.input.keyboard.addKey(Phaser.Keyboard.D)
      playState.spaceButton = app.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

      setInterval(function () {
        if (!playState.playerMap[app.game.localPlayerId]) {
          return
        }
        var state = {
          id: app.game.localPlayerId,
          controls: {
            left: playState.A.isDown,
            right: playState.D.isDown,
            jump: playState.W.isDown,
            jetpack: playState.spaceButton.isDown,
            primary: app.game.input.activePointer.leftButton.isDown,
            secondary: app.game.input.activePointer.rightButton.isDown,
            angle: app.game.physics.arcade.angleToXY(playState.playerMap[app.game.localPlayerId].sprite, app.game.input.activePointer.worldX, app.game.input.activePointer.worldY)
          }
        }
        app.engine.emit(GameEngine.events.PLAYER_SYNC, [state])
        app.engine.emit(GameEngine.events.PLAYER_UPDATE, state)
      }, 100)
    })
  }

  GameApp.prototype.start = function () {
    this.engine.start()
  }
})(); // eslint-disable-line semi
