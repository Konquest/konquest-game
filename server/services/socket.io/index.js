var http = require('http')
var sio = require('socket.io')
var events = require('lib/game-engine/events')

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

  // TODO authentication

  // Setup event listeners
  server.io.on('connection', function (socket) {
    console.log('Socket connected', socket.id)
    app.gameEngine.emit(events.NETWORK_CONNECT, socket.id)

    // TODO more player details
    var player = {
      id: socket.id
    }

    app.gameEngine.emit(events.PLAYER_JOIN, player)

    socket.emit('waah', 'rawr!')  // Why doesn't this get emited?

    // Inform all players
    server.io.emit(events.PLAYER_JOIN, player)

    // Update the new player with everyone's player state
    socket.emit(events.GAME_SYNC, app.gameEngine.getPlayersFull())

    // Handlers
    socket.on(events.PLAYER_UPDATE, function (playerState) {
      app.gameEngine.emit(events.PLAYER_SYNC, [playerState])
    })

    socket.on('disconnect', function () {
      app.gameEngine.emit(events.NETWORK_DISCONNECT, socket.id)
      app.gameEngine.emit(events.PLAYER_LEAVE, socket.id)
      console.log('Socket closed!', socket.id)
    })

    // // Update play state
    // setInterval(function () {
    //   socket.emit(events.PLAYER_SYNC, app.gameEngine.getPlayers())
    // }, 100)   // This should be tuned to high freq user latency

    // Full sync
    setInterval(function () {
      socket.emit(events.GAME_SYNC, app.gameEngine.getPlayersFull())
    }, 2000)  // This should be tuned to low freq user latency
  })

  return server
}
