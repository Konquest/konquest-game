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

  // Client signals
  game.onStart = new Phaser.Signal()  // Game start (got to play state)
  game.onPlayerJoin = new Phaser.Signal()
  game.onPlayerLeave = new Phaser.Signal()
  game.onPlayerUpdate = new Phaser.Signal()
  game.onSync = new Phaser.Signal()

  // Server signals
  game.updatePlayer = new Phaser.Signal()

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

GameEngine.prototype.getPlayers = function () {
  if (this.game.state.current === 'play') {
    var state = this.game.state.states.play
    return state.players.map(function (player) {
      return {
        id: player.id,
        controls: player.controls
      }
    })
  } else {
    return []
  }
}

GameEngine.prototype.getPlayersFull = function () {
  if (this.game.state.current === 'play') {
    var state = this.game.state.states.play
    return state.players.map(function (player) {
      return {
        id: player.id,
        position: {x: player.sprite.x, y: player.sprite.y},
        velocity: {x: 0, y: player.sprite.body.velocity.y},
        controls: player.controls
      }
    })
  } else {
    return []
  }
}
