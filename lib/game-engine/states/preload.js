/* globals Phaser */

var Preload = module.exports = function () {}

Preload.prototype.nextState = 'play'

Preload.prototype.preload = function () {
  this.preloadRender && this.preloadRender()

  this.load.onLoadComplete.addOnce(this.onLoadComplete, this)

  // TODO dynamic based on map
  this.load.image('bulletLaser', this.game.baseUrl + '/images/sprites/bullet-laser.png')
  this.load.image('bulletFireball', this.game.baseUrl + '/images/sprites/bullet-fireball.png')
  this.load.image('bulletRocket', this.game.baseUrl + '/images/sprites/bullet-rocket.png')
  this.load.spritesheet('kaboom', this.game.baseUrl + '/images/sprites/explode.png', 128, 128)

  this.load.tilemap('map', this.game.baseUrl + '/maps/grass-xs.json', null, Phaser.Tilemap.TILED_JSON)

  this.load.image('grass', this.game.baseUrl + '/images/tiles/grass-70x70.png')
  this.load.spritesheet('phaserDude', this.game.baseUrl + '/images/sprites/dude.png', 32, 48)
  this.load.image('background', this.game.baseUrl + '/images/backgrounds/background2.png')
}

Preload.prototype.create = function () {
  this.game.input.maxPointers = 1
}

Preload.prototype.onLoadComplete = function () {
  this.ready = true
}

Preload.prototype.update = function () {
  if (this.ready) {
    this.game.state.start(this.nextState)
  }
}
