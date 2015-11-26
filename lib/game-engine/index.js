/**
  Game Engine instance. Setups up everything for the game stage.

  This wraps a Phaser game.
*/
var GameEngine = module.exports = function (game, baseUrl) {
  if (game.engine) {
    throw new Error('Cannot wrap in GameEngine more than once.')
  }

  this.game = game
  game.engine = this  // Cyclic dependency
  game.baseUrl = baseUrl || ''

  game.onPlayerJoin = new Phaser.Signal()
  game.onPlayerLeave = new Phaser.Signal()
  game.onPlayerUpdate = new Phaser.Signal()
  game.onGameSync = new Phaser.Signal()

  this.states = ['boot', 'preload', 'play']
}

GameEngine.Weapons = require('./weapons')
GameEngine.States = require('./states')

GameEngine.prototype.start = function () {
  var self = this

  this.states.forEach(function (state) {
    self.game.state.add(state, new GameEngine.States.States[state]())
  })
  // this.game.network.initialize()
  this.game.state.start('boot')
}
