/* globals GameEngine, io  */

/**
  Game Networking
**/
(function () {
  /**
    Helper: Create a function that calls another function with a built-in parameter
  */
  // function pass (fn, param) {
  //   return function () {
  //     var args = Array.prototype.slice.call(arguments)
  //     args.unshift(param)
  //     // console.log(fn, args[0])
  //     fn.apply(this, args)
  //   }
  // }

  var GameNetwork = window.GameNetwork = function (game, engine) {
    var self = this
    this.game = game
    this.engine = engine
    this.gameStarted = false
    this.prestartPlayers = []

    this.io = io()
    this.io.on('connect', function () {
      console.log('connected to server')
      self.engine.emit(GameEngine.events.NETWORK_CONNECT, self.io.id)
    })

    this.io.on('disconnect', function () {
      console.log('disconnected from server')
      self.engine.emit(GameEngine.events.NETWORK_DISCONNECT, self.io.id)
    })

    this.io.on(GameEngine.events.SERVER_DISCONNECT, function (reason) {
      console.warn('Server Disconnect:', reason)
    })

    // TODO authentication

    this.engine.on(GameEngine.events.GAME_CREATE, this.onStart.bind(this))
    this.engine.on(GameEngine.events.PLAYER_UPDATE, this.onUpdatePlayer.bind(this))

    this.io.on(GameEngine.events.PLAYER_JOIN, this.onPlayerJoin.bind(this))
    this.io.on(GameEngine.events.PLAYER_LEAVE, this.onPlayerLeave.bind(this))
    this.io.on(GameEngine.events.PLAYER_SYNC, this.onPlayerSync.bind(this))
    this.io.on(GameEngine.events.GAME_SYNC, this.onGameSync.bind(this))
  }

  GameNetwork.prototype.onStart = function () {
    console.log('game start!', this.prestartPlayers.length, 'prestart players')
    this.gameStarted = true

    // Handle missed players
    for (var i = 0; i < this.prestartPlayers.length; i++) {
      // Re dispatch prestart players
      console.log('prestart player joined!', this.prestartPlayers[i])
      this.engine.emit(GameEngine.events.PLAYER_JOIN, this.prestartPlayers[i])
      // this.game.onPlayerJoin.dispatch(this.prestartPlayers[i])
    }
    // this.prestartPlayers = null
  }

  GameNetwork.prototype.onPlayerJoin = function (player) {
    console.log('player joined', player)

    if (!this.gameStarted) {
      console.log('pushed player to prestart list')
      this.prestartPlayers.push(player)
    } else {
      this.engine.emit(GameEngine.events.PLAYER_JOIN, player)
    }
  }

  GameNetwork.prototype.onPlayerLeave = function (playerId) {
    console.log('player left', playerId)

    if (!this.gameStarted) {
      var index = this.prestartPlayers.indexOf(playerId)
      if (index > 0) {
        this.prestartPlayers.splice(index, 1)
      }
    } else {
      this.engine.emit(GameEngine.events.PLAYER_LEAVE, playerId)
    }
  }

  GameNetwork.prototype.onPlayerSync = function (states) {
    this.engine.emit(GameEngine.events.PLAYER_SYNC, states)
  }

  GameNetwork.prototype.onGameSync = function (playerStates, worldStates) {
    this.engine.emit(GameEngine.events.GAME_SYNC, playerStates, worldStates)
  }

  GameNetwork.prototype.onUpdatePlayer = function (state) {
    this.io.emit(GameEngine.events.PLAYER_UPDATE, state)
  }
})(); // eslint-disable-line semi
