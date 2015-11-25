/* globals PIXI, Phaser */

var BaseWeapon = module.exports = function (game, key) {
  Phaser.Sprite.call(this, game, 0, 0, key)
  this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST
  this.anchor.set(0.5, 0.5)
  this.checkWorldBounds = true
  this.outOfBoundsKill = true
  this.exists = false

  this.tracking = false
  this.accelerationRate = 0
  // this.scaleSpeed = 0

// this.debug = true // Un-comment this to see the collision box
}

BaseWeapon.prototype = Object.create(Phaser.Sprite.prototype)
BaseWeapon.prototype.constructor = BaseWeapon

BaseWeapon.prototype.fire = function (x, y, rotation, speed, gx, gy) {
  gx = gx || 0
  gy = gy || 0

  this.reset(x, y)
  this.rotation = rotation

  var angle = rotation * (180 / Math.PI) // Convert to degrees
  this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity)

  if (this.accelerationRate > 0) {
    this.game.physics.arcade.accelerationFromRotation(rotation, this.accelerationRate, this.body.acceleration)
  }

  this.body.gravity.set(gx, gy)
}

BaseWeapon.prototype.update = function () {
  if (this.tracking) {
    this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x)
  }
}
