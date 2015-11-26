/* globals describe, before */

require('should')
var pkg = require('package.json')
var dotenv = require('dotenv')
var bunyan = require('bunyan')

dotenv.load()

global.log = bunyan.createLogger({name: pkg.name + '.test'})

describe('Library', function () {
  before(function (next) {
    var GameEngine = require('lib/game-engine')
    GameEngine.onReady = next
  })

  require('./lib/game')
})

// describe('Server', function () {

// })
