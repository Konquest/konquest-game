var jsdom = require('jsdom')
var HeadlessRenderer = require('services/game/renderers/headless');

/**
  Game instance. Make sure to initialize after `Game.ready` is true.
*/
var Game = module.exports = function(callback) {
  var Phaser = require('phaser/build/custom/phaser-arcade-physics')
  this.game = new Phaser.Game(800, 600, Phaser.HEADLESS)
}

jsdom.env('<html><body></body></html>', function(err, window) {
  var canvas = require('canvas')

  // Fake out some Phaser required things
  global.document = window.document
  global.Image = canvas.Image
  global.window = window
  global.Element = window.Element
  global.window.process = process
  global.navigator = {userAgent: 'node.js'}
  global.XMLHttpRequest = require('local-xmlhttprequest').XMLHttpRequest

  global.PIXI = require('ext/pixi')
  // global.PIXI = {}

  var Phaser = require('phaser/build/custom/phaser-arcade-physics')
  Phaser.Game.prototype.setUpRenderer = function() {
    this.canvas = Phaser.Canvas.create(this, this.width, this.height, this.config['canvasID'], true)
    this.renderer = new HeadlessRenderer(this.width, this.height, {view: this.canvas})
  }

  Game.ready = true

  Game.onReady && Game.onReady()
})



