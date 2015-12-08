var http = require('http')
var sio = require('socket.io')
var events = require('lib/game-engine/events')
var serverEvents = require('server/events')

// /**
//   Helper: Create a function that calls another function with a built-in parameter
// */
// function pass (fn, param) {
//   return function () {
//     var args = Array.prototype.slice.call(arguments)
//     args.unshift(param)
//     fn.apply(this, args)
//   }
// }

module.exports = function (app) {
  var server = http.Server(app)

  server.express = app
  server.io = sio(server, { serveClient: false })
  app.emit(serverEvents.ATTACH_SOCKET_IO)

  // TODO authentication
  // app.io.use...

  // Handle player errors -- disconnect them
  app.on(serverEvents.ATTACH_GAME_ENGINE, function () {
    app.gameEngine.on(events.PLAYER_ERROR, function (id, err) {
      var player = app.gameEngine.getPlayer(id)
      var socket

      if (player) {
        socket = player.socket
      } else {
        socket = server.io.nsps['/'].sockets.find(function (socket) {
          return socket.id === id
        })
      }

      if (socket) {
        socket.emit(events.SERVER_DISCONNECT, err.message)
        socket.disconnect()
      }
    })
  })

  // Setup event listeners
  server.io.on('connection', function (socket) {
    log.info('Socket connected', socket.id)
    app.gameEngine.emit(events.NETWORK_CONNECT, socket.id)

    // TODO more player details
    var player = {
      id: socket.id
    }

    app.gameEngine.emit(events.PLAYER_JOIN, player)
    var currentPlayer = app.gameEngine.getPlayer(player.id)
    if (currentPlayer) {
      currentPlayer.socket = socket

      // Inform all players
      server.io.emit(events.PLAYER_JOIN, player)

      // Update the new player with everyone's player state
      socket.emit(events.GAME_SYNC, app.gameEngine.getPlayersFull())

      // Handlers
      socket.on(events.PLAYER_UPDATE, function (playerState) {
        if (socket.id === playerState.id) {
          app.gameEngine.emit(events.PLAYER_SYNC, [playerState])
        } else {
          socket.emit(events.SERVER_DISCONNECT, 'Invalid player ID')
          socket.disconnect()
        }
      })

      socket.on('disconnect', function () {
        clearInterval(socket.interval)
        app.gameEngine.emit(events.NETWORK_DISCONNECT, socket.id)
        app.gameEngine.emit(events.PLAYER_LEAVE, socket.id)
        server.io.emit(events.PLAYER_LEAVE, socket.id)
        log.info('Socket closed!', socket.id)
      })

      // // Update play state
      // setInterval(function () {
      //   socket.emit(events.PLAYER_SYNC, app.gameEngine.getPlayers())
      // }, 100)   // This should be tuned to high freq user latency

      // Full sync
      socket.interval = setInterval(function () {
        socket.emit(events.GAME_SYNC, app.gameEngine.getPlayersFull())
      }, 2000)  // This should be tuned to low freq user latency
    } else {
      // Something went wrong
      socket.emit(events.SERVER_DISCONNECT, 'Not sure what went wrong')
      socket.disconnect()
    }
  })

  return server
}
