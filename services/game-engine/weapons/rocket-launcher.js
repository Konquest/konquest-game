/* globals Phaser */

var BaseWeapon = require('./base')

var Rocket = module.exports = function (game) {
  Phaser.Group.call(this, game, game.world, 'RocketLauncher', false, true, Phaser.Physics.ARCADE)

  this.nextFire = 0
  this.bulletSpeed = 100
  this.fireRate = 2000
  this.accelerationRate = 400
  this.damage = 100
  this.gravity = game.physics.arcade.gravity

  this.explosions = game.add.group()
  for(var i = 0; i < 5; i++) {
    var explosion = this.explosions.create(0, 0, 'kaboom', [0], false)
    explosion.anchor.set(0.75, 0.5)
    explosion.animations.add('kaboom')
  }

  for (var i = 0; i < 5; i++) {
    var rocket = new BaseWeapon(game, 'bulletRocket')
    rocket.accelerationRate = this.accelerationRate
    // rocket.tracking = true
    this.add(rocket, true)
  }

  return this
}

Rocket.Assets = {
  images: [
    {name: 'bulletRocket', path: 'sprites/bullet-rocket.png'},
    // {name: 'gunRocketLauncher', path: 'sprites/gun-rocket-launcher.png'},
  ],
  spritesheets: [
    {name: 'explosion', path: 'sprites/explode.png', width: 128, height: 128}
  ]
}

Rocket.prototype = Object.create(Phaser.Group.prototype)
Rocket.prototype.constructor = Rocket

Rocket.prototype.firePrimary = function (source, rotation) {
  if (this.game.time.time < this.nextFire) { return }

  var x = source.x + 10
  var y = source.y + 10

  this.getFirstExists(false).fire(x, y, rotation, this.bulletSpeed, 0, -this.gravity.y + 50)

  this.nextFire = this.game.time.time + this.fireRate
}

Rocket.prototype.collide = function (bullet, floor) {
  var explosion = this.explosions.getFirstExists(false);

  explosion.reset(bullet.x, bullet.y);
  explosion.play('kaboom', 16, false, true);

  bullet.kill()
}
