/* globals describe, before */

require('should')
var pkg = require('package.json')
var dotenv = require('dotenv')
var Game = require('services/game')
var bunyan = require('bunyan')

dotenv.load()

global.log = bunyan.createLogger({name: pkg.name + '.test'})

describe('Server', function () {
  before(function (next) {
    Game.onReady = next
  })

  describe('Services', function () {
    require('./services/game')
  })
})
