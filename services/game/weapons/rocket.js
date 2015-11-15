/* globals Phaser */

var BaseWeapon = require('./base')

var Rocket = module.exports = function (game) {
  Phaser.Group.call(this, game, game.world, 'Rocket', false, true, Phaser.Physics.ARCADE)

  this.nextFire = 0
  this.bulletSpeed = 400
  this.fireRate = 500

  for (var i = 0; i < 32; i++) {
    this.add(new BaseWeapon(game, 'bulletRocket'), true)
  }

  this.setAll('tracking', true)

  return this
}

Rocket.prototype = Object.create(Phaser.Group.prototype)
Rocket.prototype.constructor = Rocket

Rocket.prototype.fire = function (source, rotation) {
  if (this.game.time.time < this.nextFire) { return }

  var x = source.x + 10
  var y = source.y + 10

  this.getFirstExists(false).fire(x, y, rotation, this.bulletSpeed, 0, -900)
  // this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, -00)

  this.nextFire = this.game.time.time + this.fireRate
}
