/* globals describe, before, it */

var Game = require('services/game')

describe('Game', function () {
  var game

  before(function () {
    game = new Game()
    console.log('now what?')
  })

  it('should be a game', function (next) {
    game
    next()
  })
})
