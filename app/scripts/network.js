/* globals io */

/**
  Game Networking
**/
(function () {
  var GameNetwork = window.GameNetwork = function (game) {
    var self = this
    this.game = game
    this.gameStarted = false
    this.prestartPlayers = []

    this.game.onStart.add(this._onStart.bind(this))
    this.game.updatePlayer.add(this._updatePlayer.bind(this))

    // TODO authentication
    this.io = io()
    this.io.on('connect', function () {
      self.id = self.io.id
      console.log('connected', self.id)
    })

    // this.io.on('player-join', this.game.onPlayerJoin.dispatch)
    this.io.on('player-join', this._onPlayerJoin.bind(this))
    this.io.on('player-leave', this.game.onPlayerLeave.dispatch)
    this.io.on('player-update', this._onPlayerUpdate.bind(this))
    this.io.on('sync', this.game.onSync.dispatch.bind(this.game.onSync))
  }

  GameNetwork.prototype._onStart = function () {
    console.log('game start!', this.prestartPlayers.length, 'prestart players')
    this.gameStarted = true

    // Handle missed players
    for (var i = 0; i < this.prestartPlayers.length; i++) {
      // Re dispatch prestart players
      console.log('prestart player joined!', this.prestartPlayers[i])
      this.game.onPlayerJoin.dispatch(this.prestartPlayers[i])
    }
    this.prestartPlayers = null
  }

  GameNetwork.prototype._onPlayerJoin = function (player) {
    console.log('player joined', player)

    if (!this.gameStarted) {
      console.log('pushed player to prestart list')
      this.prestartPlayers.push(player)
    } else {
      this.game.onPlayerJoin.dispatch(player)
    }
  }

  GameNetwork.prototype._onPlayerLeave = function (player) {
    console.log('player left', player)

    if (!this.gameStarted) {
      var index = this.prestartPlayers.indexOf(player)
      if (index > 0) {
        this.prestartPlayers.splice(index, 1)
      }
    } else {
      this.game.onPlayerLeave.dispatch(player)
    }
  }

  GameNetwork.prototype._onPlayerUpdate = function (state) {
    this.game.onPlayerUpdate.dispatch(state)
  }

  GameNetwork.prototype._updatePlayer = function (state) {
    this.io.emit('player-update', state)
  }
})();
