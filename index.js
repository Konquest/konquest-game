var pkg = require('package.json')
var Server = require('server')
var dotenv = require('dotenv')
var bunyan = require('bunyan')

dotenv.load()

global.log = bunyan.createLogger({name: pkg.name})

var server = new Server()
server.listen(server.get('port'), function () {
  log.info('Started **%s** on port `%s` in *%s* mode.', pkg.name, server.get('port'), server.get('env'))
})
