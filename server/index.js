var errorHandler = require('server/middleware/error-handler')
var compression = require('compression')
var bodyParser = require('body-parser')
var express = require('express')
var route = require('server/routes')
var helmet = require('helmet')
var cors = require('cors')
var pkg = require('package.json')
var http = require('http')
var sio = require('socket.io')
var PrepareGame = require('server/prepare-game')
var path = require('path')

var BASE_URL = path.dirname(__dirname)

/**
  Initialize Express Application

  @return {Express}
*/
module.exports = function () {
  var app = express()

  app.set('name', pkg.name)
  app.set('version', pkg.version)
  app.set('state', 'running')
  app.set('port', process.env.PORT)
  app.disable('x-powered-by')

  // Middleware
  app.use(compression())
  app.use(helmet.xframe())
  app.use(helmet.nosniff())
  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(express.static('dist'))

  // Routing
  route(app)

  // Error handler
  app.use(errorHandler)

  // Socket.io
  var server = http.Server(app)
  app.io = sio(server)

  // Passing app variables over
  server.get = function (name) {
    return app.get(name)
  }
  server.app = app

  var listen = server.listen
  var ready = function() {
    var Phaser = require('phaser/dist/phaser.min')
    var HeadlessRenderer = require('./renderers/headless')
    var GameEngine = require('services/game-engine')

    var game = new Phaser.Game(300, 400, Phaser.HEADLESS)

    app.gameEngine = new GameEngine(game, path.join(BASE_URL, 'dist'))
    app.gameEngine.start()
    return listen.apply(server, arguments)
  }

  server.listen = function () {
    var args = arguments

    if (PrepareGame.ready) {
      return ready.apply(this, args)
    }

    var self = this
    PrepareGame.onReady = function () {
      ready.apply(server, args)
    }
  }

  return server
}
