/* globals describe, before */

require('should')
var pkg = require('package.json')
var dotenv = require('dotenv')
var bunyan = require('bunyan')

dotenv.load()

global.log = bunyan.createLogger({name: pkg.name + '.test'})

describe('Server', function () {
  before(function (next) {
    var Game = require('services/game')
    Game.onReady = next
  })

  describe('Services', function () {
    require('./services/game')
  })
})
