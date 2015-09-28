var pkg = require('./package.json')
var Server = require('./server')
var dotenv = require('dotenv')
var colors = require('colors/safe')

dotenv.load()
var server = new Server()

server.listen(server.get('port'), function() {
  console.log('Started %s on port %s in %s mode.', colors.inverse(pkg.name), colors.inverse(server.get('port')), colors.inverse(server.get('env')))
})
