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
  var io = sio(server)

  // Passing app variables over
  server.get = function (name) {
    return app.get(name)
  }
  server.app = app
  server.io = io

  app._listen = app._listen
  app.listen = function () {
    var args = arguments

    this.game = require('services/game')

    if (PrepareGame.ready) {
      return this._listen.apply(this, args)
    }

    PrepareGame.onReady = function () {
      this._listen.apply(this, args)
    }
  }

  return server
}
