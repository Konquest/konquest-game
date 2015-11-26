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
    // this.game.onPlayerUpdate.add(this._onPlayerUpdate.bind(this))

    // TODO authentication
    this.io = io()
    this.io.on('connect', function () {
      self.id = self.io.id
      console.log('connected', self.id)
    })
    // this.io.on('player-join', this.game.onPlayerJoin.dispatch)
    this.io.on('player-join', this._onPlayerJoin.bind(this))
    this.io.on('player-leave', this.game.onPlayerLeave.dispatch)
    // this.io.on('player-update', this._onPlayerUpdate.bind(this))
    this.io.on('sync', this.game.onSync.dispatch)
  }

  GameNetwork.prototype._onStart = function () {
    var self = this
    console.log('game start!')
    this.gameStarted = true
    this.io.removeAllListeners('player-join')
    // this.io.on('player-join', this.game.onPlayerJoin.dispatch)
    this.io.on('player-join', function(state) {
      self.game.onPlayerJoin.dispatch(state)
    })

    // Handle missed players
    for (var i = 0; i < this.prestartPlayers.length; i++) {
      // Re dispatch
      this.game.onPlayerJoin.dispatch(this.prestartPlayers[i])
    }
    this.prestartPlayers = null
  }

  // GameNetwork.prototype._onPlayerUpdate = function (state) {
  //   this.io.emit('player-update', state)
  // }

  GameNetwork.prototype._onPlayerJoin = function (player) {
    // if (!this.gameStarted) {
      console.log('player joined', player)
      this.prestartPlayers.push(player)
    // } else {}
  }
})()
