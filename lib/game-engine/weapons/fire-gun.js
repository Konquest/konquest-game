/* globals Phaser */

var BaseWeapon = require('./base')

var FireGun = module.exports = function (game) {
  Phaser.Group.call(this, game, game.world, 'FireGun', false, true, Phaser.Physics.ARCADE)

  var i
  this.radius = 10

  this.nextFire = 0
  this.bulletSpeed = 500
  this.fireRate = 1000
  this.damage = 50
  this.gravity = game.physics.arcade.gravity

  this.explosions = game.add.group()
  for (i = 0; i < 5; i++) {
    var explosion = this.explosions.create(0, 0, 'kaboom', [0], false)
    explosion.anchor.set(0.5, 0.5)
    explosion.animations.add('kaboom')
  }

  for (i = 0; i < 5; i++) {
    var rocket = new BaseWeapon(game, 'bulletFireball')
    rocket.anchor.set(0.75, 0.5)
    rocket.tracking = true
    this.add(rocket, true)
  }

  return this
}

FireGun.Assets = {
  images: [
    {name: 'bulletFireball', path: 'sprites/bullet-fireball.png'}
  ],
  spritesheets: [
    {name: 'explosion', path: 'sprites/explode.png', width: 128, height: 128}
  ]
}

FireGun.prototype = Object.create(Phaser.Group.prototype)
FireGun.prototype.constructor = FireGun

FireGun.prototype.firePrimary = function (source, rotation) {
  if (this.game.time.time < this.nextFire) { return }

  var x = source.x + 10
  var y = source.y + 10

  this.getFirstExists(false).fire(x, y, rotation, this.bulletSpeed, 0, -this.gravity.y + 250)

  this.nextFire = this.game.time.time + this.fireRate
}

FireGun.prototype.collide = function (bullet, floor) {
  var explosion = this.explosions.getFirstExists(false)

  explosion.reset(bullet.x, bullet.y)
  explosion.play('kaboom', 16, false, true)

  bullet.kill()
}

FireGun.prototype.collision = function (bullet, floor) {
  var circle = {x: bullet.x, y: bullet.y, r: this.radius}
  var rect = {x: floor.worldX, y: floor.worldY, w: floor.width, h: floor.height}

  var halfRectW = rect.w / 2
  var halfRectH = rect.h / 2

  var distX = Math.abs(circle.x - rect.x - halfRectW)
  var distY = Math.abs(circle.y - rect.y - halfRectH)

  if (distX > (halfRectW + circle.r)) { return false }
  if (distY > (halfRectH + circle.r)) { return false }

  if (distX <= halfRectW) { return true }
  if (distY <= halfRectH) { return true }

  var dx = distX - halfRectW
  var dy = distY - halfRectH
  return (dx * dx + dy * dy <= (circle.r * circle.r))
}
