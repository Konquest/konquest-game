var pkg = require('package.json')
var Server = require('server')
var dotenv = require('dotenv')
var Game = require('services/game')
var bunyan = require('bunyan')

dotenv.load()

global.log = bunyan.createLogger({name: pkg.name})

log.info('Preparing to start...')
Game.onReady = function () {
  var server = new Server()
  server.listen(server.get('port'), function () {
    log.info('Started **%s** on port `%s` in *%s* mode.', pkg.name, server.get('port'), server.get('env'))
  })
}
