var http = require('http')
var sio = require('socket.io')

module.exports = function (app) {
  var server = http.Server(app)

  server.express = app
  server.io = sio(server, { serveClient: false })

  // Setup event listeners
  server.io.on('connection', function (socket) {
    console.log('player joined', socket.id)
    server.io.emit('player-join', {id: socket.id})
  })

  return server
}
