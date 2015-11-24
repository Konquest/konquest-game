var States = function() {}

// Default states
States.boot = require('./boot')
States.play = require('./play'),
States.preload = require('./preload'),

States.prototype.States = States  // So meta

States.prototype.register = function(state, stateClass) {
  States[state] = stateClass
}
States.prototype.get = function(state) {
  return States[state]
}

module.exports = new States()
