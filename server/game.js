var jsdom = require('jsdom')

module.exports = function(callback) {

  jsdom.env('<html><body></body></html>', function(err, window) {
    var canvas = require('canvas')

    global.document = window.document
    global.Image = canvas.Image
    global.window = window
    global.Element = window.Element
    global.window.process = process
    global.navigator = {userAgent: 'node.js'}
    global.XMLHttpRequest = require('local-xmlhttprequest').XMLHttpRequest

    // global.PIXI = require('./ext/pixi')
    global.PIXI = {}

    // var Phaser = require('./ext/phaser')
    var Phaser = require('phaser/build/custom/phaser-arcade-physics')

    var HeadlessRenderer = require('./renderers/headless');
    Phaser.Game.prototype.setUpRenderer = function() {
      this.canvas = Phaser.Canvas.create(this, this.width, this.height, this.config['canvasID'], true)
      this.renderer = new HeadlessRenderer(this.width, this.height, {view: this.canvas})
    }

    var game = new Phaser.Game(800, 600, Phaser.HEADLESS)

    callback(game)
  })
}
