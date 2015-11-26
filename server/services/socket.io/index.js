var http = require('http')
var sio = require('socket.io')

module.exports = function (app) {
  var server = http.Server(app)

  server.express = app
  server.io = sio(server, { serveClient: false })

  // TODO authentication

  // Setup event listeners
  server.io.on('connection', function (socket) {
    console.log('player joined', socket.id)

    // TODO more player details
    var player = {
      id: socket.id
    }

    app.gameEngine.game.onPlayerJoin.dispatch(player)

    // Inform all other players
    socket.broadcast.emit('player-join', player)

    // Update the new player with everyone's player state
    app.gameEngine.getPlayers().forEach(function (player) {
      socket.emit('player-join', player)
    })

    socket.on('player-update', function (playerState) {
      app.gameEngine.game.onPlayerUpdate.dispatch(playerState)
    })

    // Update play state
    setInterval(function () {
      app.gameEngine.getPlayers().forEach(function (player) {
        socket.emit('player-update', player)
      })
    }, 100) // This should be tuned the the user's latency

    // Full sync
    setInterval(function () {
      var playersFull = app.gameEngine.getPlayersFull()
      // console.log(playersFull)
      socket.emit('sync', playersFull)
    }, 2000)
  })

  return server
}
