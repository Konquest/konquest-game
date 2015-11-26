var bodyParser = require('body-parser')
var compression = require('compression')
var cors = require('cors')
var express = require('express')
var helmet = require('helmet')
var pkg = require('package.json')

var errorHandler = require('./middleware/error-handler')
var route = require('./routes')

module.exports = function () {
  var app = express()

  app.set('name', pkg.name)
  app.set('version', pkg.version)
  app.set('port', process.env.PORT)
  app.disable('x-powered-by')

  // Middleware
  app.use(compression())
  app.use(helmet.xframe())
  app.use(helmet.nosniff())
  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}))

  if (app.get('env') === 'development') {
    app.use(express.static('.tmp'))
    app.use(express.static('app'))
    app.use('/node_modules', express.static('node_modules'))
  } else {
    app.use(express.static('dist'))
  }

  // Routing
  route(app)

  // Error handler
  app.use(errorHandler)

  return app
}
