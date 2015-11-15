/* globals Phaser */

var EngineBoot = function () {}

EngineBoot.prototype.preload = function () {
  // TODO dynamic based on map
  this.load.image('bulletBlue', 'assets/sprites/bullet-blue.png')
  this.load.image('bulletFire', 'assets/sprites/bullet-fire.png')
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

EngineBoot.prototype.create = function () {
  this.game.input.maxPointers = 1
}
