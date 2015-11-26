var http = require('http')
var sio = require('socket.io')

module.exports = function (app) {
  var server = http.Server(app)

  server.express = app
  server.io = sio(server, { serveClient: false })

  return server
}
