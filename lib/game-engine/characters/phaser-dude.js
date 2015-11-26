/* globals Phaser */

var Weapon = require('../weapons')
var BaseCharacter = require('./base')

var PhaserDude = module.exports = function (game, id) {
  Phaser.Group.call(this, game, game.world, 'PhaserDude', false, true, Phaser.Physics.ARCADE)

  this.sprite = new BaseCharacter(game, 'phaserDude')
  this.add(this.sprite, true)

  this.sprite.animations.add('left', [0, 1, 2, 3], 10, true)
  this.sprite.animations.add('turn', [4], 20, true)
  this.sprite.animations.add('right', [5, 6, 7, 8], 10, true)
  this.sprite.animations.play('turn')

  this.sprite.body.bounce.y = 0.1
  // this.body.setSize(20, 32, 5, 16)
  this.sprite.body.setSize(20, 32, 0, 6)
  this.facing = 'idle'

  // Default weapon
  this.weapon = new Weapon.Laser(game)

  this.id = id
  this.nextFire = 0
  this.controls = {
    left: false,
    right: false,
    jump: false,
    duck: false,
    jetpack: false,
    primary: false,
    secondary: false,
    angle: 0
  }

  return this
}

PhaserDude.Assets = {
  spritesheets: [
    {name: 'phaserDude', path: 'sprites/dude.png', width: 32, height: 48}
  ]
}

PhaserDude.prototype = Object.create(Phaser.Group.prototype)
PhaserDude.prototype.constructor = PhaserDude

PhaserDude.prototype.equip = function (weapon) {
  // remove old weapon
  this.weapon && this.weapon.destroy()

  this.weapon = weapon
}

PhaserDude.prototype.update = function() {
  this.sprite.body.acceleration.y = 0;
  this.sprite.body.velocity.x = 0;
  this.sprite.body.velocity.y = Math.max(this.sprite.body.velocity.y, -1500)
  this.sprite.body.velocity.y = Math.min(this.sprite.body.velocity.y, 600)

  if (this.controls.left) {
      this.sprite.body.velocity.x = -150

      if (this.facing !== 'left') {
          this.sprite.animations.play('left')
          this.facing = 'left'
      }
  } else if (this.controls.right) {
      this.sprite.body.velocity.x = 150

      if (this.facing !== 'right') {
          this.sprite.animations.play('right')
          this.facing = 'right'
      }
  } else if (this.facing !== 'idle') {
      this.sprite.animations.stop();

      if (this.facing == 'left') {
        this.sprite.frame = 0
      } else {
        this.sprite.frame = 5
      }

      this.facing = 'idle'
  }

  if (this.controls.jump && this.sprite.body.onFloor()) {
    this.sprite.body.velocity.y = -350
  }

  if (this.controls.jetpack) {
    this.sprite.body.acceleration.y = -1100
  }

  if (this.controls.primary && this.game.time.now > this.nextFire) {
    this.nextFire = this.game.time.now + 100

    this.weapon.firePrimary(this.sprite, this.controls.angle)
  }
}
