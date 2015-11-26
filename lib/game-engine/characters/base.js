/* globals PIXI, Phaser */

var BaseCharacter = module.exports = function (game, key, id) {
  Phaser.Sprite.call(this, game, 0, 0, key)

  game.physics.enable(this, Phaser.Physics.ARCADE)

  this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST
  this.anchor.set(0.5, 0.5)

  this.body.collideWorldBounds = true

  // this.debug = true // Un-comment this to see the collision box
}

BaseCharacter.prototype = Object.create(Phaser.Sprite.prototype)
BaseCharacter.prototype.constructor = BaseCharacter
