var prepareGame = require('./game/prepare')
var path = require('path')

var http = require('./services/http')
var sio = require('./services/socket.io')

var BASE_URL = path.dirname(__dirname)

/**
  Initialize Express Application

  @return {Express}
*/
module.exports = function () {
  var app = http()
  var server = sio(app)

   // Ensure game services are up
  var listen = server.listen
  var ready = function () {
    var GameEngine = require('lib/game-engine')

    var game = new Phaser.Game(300, 400, Phaser.HEADLESS)

    app.gameEngine = new GameEngine(game, path.join(BASE_URL, 'dist'))
    app.gameEngine.start()

    return listen.apply(server, arguments)
  }

  server.listen = function () {
    var args = arguments

    if (prepareGame.ready) {
      return ready.apply(this, args)
    }

    prepareGame.onReady = function () {
      ready.apply(server, args)
    }
  }

  return server
}
