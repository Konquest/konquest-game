var pkg = require('package.json')
var Server = require('server')
var dotenv = require('dotenv')
var Game = require('services/game')
var bunyan = require('bunyan')

dotenv.load()

global.log = bunyan.createLogger({name: pkg.name})

log.info('Preparing to test...')
Game.onReady = function() {

  // Begin testing

  var game = new Game()

}

