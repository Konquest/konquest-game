/* globals Phaser */

var Boot = module.exports = function () {}

Boot.prototype.preload = function () {
  this.load.onLoadComplete.addOnce(this.onLoadComplete, this)

  // TODO dynamic based on map
  this.load.image('bulletLaser', 'assets/sprites/bullet-laser.png')
  this.load.image('bulletFireball', 'assets/sprites/bullet-fireball.png')
  this.load.image('bulletRocket', 'assets/sprites/bullet-rocket.png')
  this.load.spritesheet('kaboom', 'assets/sprites/explode.png', 128, 128)

  this.load.tilemap('level1', 'assets/maps/level1.json', null, Phaser.Tilemap.TILED_JSON)

  this.load.image('tiles-1', 'assets/tiles/tiles-1.png')
  this.load.spritesheet('dude', 'assets/sprites/dude.png', 32, 48)
  this.load.spritesheet('droid', 'assets/sprites/droid.png', 32, 32)
  this.load.image('starSmall', 'assets/sprites/star.png')
  this.load.image('starBig', 'assets/sprites/star2.png')
  this.load.image('background', 'assets/backgrounds/background2.png')

}

Boot.prototype.create = function () {
  // this.game.input.maxPointers = 1
}

Boot.prototype.onLoadComplete = function () {
  this.ready = true
}

Boot.prototype.update = function () {
  if (this.ready) {
    this.game.state.start('play')
  }
}
