/**
  Prepare for the games.

  This is a bunch of hacks to get Phaser working as a backend.
*/
var jsdom = require('jsdom')
var HeadlessRenderer = require('./renderers/headless')

var Game = module.exports = {}

jsdom.env('<html><body></body></html>', function (err, window) {
  if (err) {
    throw err
  }

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
  Phaser.Game.prototype.setUpRenderer = function () {
    this.canvas = Phaser.Canvas.create(this, this.width, this.height, this.config['canvasID'], true)
    this.renderer = new HeadlessRenderer(this.width, this.height, {view: this.canvas})
  }
  global.Phaser = Phaser

  Game.ready = true
  Game.onReady && Game.onReady()
})
