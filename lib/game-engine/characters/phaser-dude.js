/* globals Phaser */

var Weapon = require('../weapons')
var BaseCharacter = require('./base')
var HealthBar = require('../ui/health-bar')

var Weapons = {
  laser: Weapon.Laser,
  rocketLauncher: Weapon.RocketLauncher,
  fireGun: Weapon.FireGun
}

var PhaserDude = module.exports = function (game, id, weapon) {
  Phaser.Group.call(this, game, game.world, 'PhaserDude', false, true, Phaser.Physics.ARCADE)

  this.game = game
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
  var NewWeapon
  if (weapon && Weapons[weapon]) {
    NewWeapon = Weapons[weapon]
  } else {
    var weapons = ['laser', 'rocketLauncher', 'fireGun']
    weapon = weapons[Math.random() * 3 >>> 0]
    NewWeapon = Weapons[weapon]
  }
  this.weapon = weapon
  this._weapon = new NewWeapon(game)
  // this.add(this._weapon)

  // Health Bar
  this.healthbar = new HealthBar(game, this.sprite, 100, 32)
  // this.add(this.healthbar)

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

PhaserDude.prototype.update = function () {
  this.sprite.body.acceleration.y = 0
  this.sprite.body.velocity.x = 0
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
    this.sprite.animations.stop()

    if (this.facing === 'left') {
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

    this._weapon.firePrimary(this.sprite, this.controls.angle)
  }

  this.healthbar.update()
}

PhaserDude.prototype.serialize = function () {
  return {
    id: this.id,
    life: this.healthbar.hp,
    position: {x: this.sprite.x, y: this.sprite.y},
    velocity: {x: 0, y: this.sprite.body.velocity.y},
    weapon: this.weapon,
    controls: this.controls
  }
}

PhaserDude.prototype.serializeDelta = function () {
  return {
    id: this.id,
    life: this.healthbar.hp,
    controls: this.controls
  }
}

PhaserDude.prototype.deserialize = function (data) {
  if (this.id !== data.id) {
    console.log('deserializing incorrect data set, id does not match')
    return  // This is not the correct dataset for this player
  }

  this.healthbar.hp = data.life
  this.sprite.x = data.position.x
  this.sprite.y = data.position.y
  this.sprite.body.velocity.y = data.velocity.y
  this.controls = data.controls

  if (this.weapon !== data.weapon) {
    console.log('change weapon to', data.weapon)
    this.weapon = data.weapon
    this._weapon.destroy()
    this._weapon = new Weapons[data.weapon](this.game)
  }
}

PhaserDude.prototype.deserializeDelta = function (data) {
  if (this.id !== data.id) {
    console.log('delta deserializing incorrect data set, id does not match')
    return  // This is not the correct dataset for this player
  }

  this.healthbar.hp = data.life
  this.controls = data.controls
}

