var BaseWeapon = require('./base')

var Laser = module.exports = function (game) {
  Phaser.Group.call(this, game, game.world, 'Laser', false, true, Phaser.Physics.ARCADE)

  this.radius = 20
  this.nextFire = 0
  this.bulletSpeed = 750
  this.fireRate = 200
  this.damage = 10

  for (var i = 0; i < 16; i++) {
    var laser = new BaseWeapon(game, 'bulletLaser')
    // laser.scale.set(0.75)
    // laser.anchor.set(1, 0.5)
    this.add(laser, true)
  }

  this.setAll('tracking', true)

  return this
}

Laser.Assets = {
  bulletLaser: 'sprites/bullet-laser.png'
}

Laser.prototype = Object.create(Phaser.Group.prototype)
Laser.prototype.constructor = Laser

Laser.prototype.firePrimary = function (source, rotation) {
  if (this.game.time.time < this.nextFire) { return }

  var x = source.x + 10
  var y = source.y + 10

  this.getFirstExists(false).fire(x, y, rotation, this.bulletSpeed, 0, -900)
  // this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, -00)

  this.nextFire = this.game.time.time + this.fireRate
}

Laser.prototype.collide = function (bullet, floor) {
  bullet.kill()
}
