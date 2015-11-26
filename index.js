var pkg = require('package.json')
var Server = require('server')
var dotenv = require('dotenv')
var winston = require('winston')

dotenv.load()

global.log = winston.loggers.add(pkg.name, {
  console: {
    colorize: 'true'
  }
})

var server = new Server()
server.listen(server.express.get('port'), function () {
  log.info('Started **%s** on port `%s` in *%s* mode.', pkg.name, server.express.get('port'), server.express.get('env'))
})
