/* globals io */

/**
  Game Networking
**/
(function () {
  window.GameNetwork = function (gameEngine) {
    this.engine = gameEngine

    // TODO authentication
    this.io = io()

    this.io.on('player-join', this.engine.onPlayerJoin.dispatch)
    this.io.on('player-leave', this.engine.onPlayerLeave.dispatch)
    this.io.on('player-update', this.engine.onPlayerUpdate.dispatch)
    this.io.on('sync', this.engine.onGameSync.dispatch)
  }
})()
