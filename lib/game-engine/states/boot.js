/* globals Phaser */

var Boot = module.exports = function () {}

Boot.prototype.nextState = 'preload'

Boot.prototype.create = function () {
  this.game.state.start(this.nextState)
}
