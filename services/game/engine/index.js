var BootState = require('./boot')
var PlayState = require('./play')

var Engine = module.exports = function (game, states) {
  states.forEach(function (state) {
    game.state.add(state, Engine.States[state])
  })

  game.state.start(states[0])
}

Engine.States = {
  boot: BootState,
  play: PlayState
}

Engine.registerState = function (name, state) {
  Engine.States[name] = state
}
