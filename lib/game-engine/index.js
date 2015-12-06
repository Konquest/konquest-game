var EventEmitter = require('events')
var inherit = require('util').inherits

/**
  Game Engine instance. Setups up everything for the game stage.

  This wraps a Phaser game.
*/
var GameEngine = module.exports = function (game, baseUrl) {
  if (game.engine) {
    throw new Error('Cannot wrap in GameEngine more than once.')
  }
  EventEmitter.call(this)

  this.game = game

  game.engine = this  // Cyclic dependency
  game.baseUrl = baseUrl || ''

  this.states = ['boot', 'preload', 'play']
}
inherit(GameEngine, EventEmitter)

GameEngine.events = require('./events')
GameEngine.Weapons = require('./weapons')
GameEngine.States = require('./states')

GameEngine.prototype.start = function () {
  var self = this

  this.states.forEach(function (state) {
    self.game.state.add(state, new GameEngine.States.States[state]())
  })

  this.game.state.start('boot')
}

GameEngine.prototype.getPlayers = function () {
  if (this.game.state.current !== 'play') {
    return []
  }

  var state = this.game.state.states.play
  return state.players.map(function (player) {
    return player.serializeDelta()
  })
}

GameEngine.prototype.getPlayersFull = function () {
  if (this.game.state.current !== 'play') {
    return []
  }

  var state = this.game.state.states.play
  return state.players.map(function (player) {
    return player.serialize()
  })
}

GameEngine.prototype.getPlayer = function (playerId) {
  if (this.game.state.current !== 'play') {
    return
  }

  var state = this.game.state.states.play
  return state.players.find(function (player) {
    return player.id === playerId
  })
}
