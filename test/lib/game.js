/* globals describe, before, it */

describe('Game', function () {
  var game

  before(function () {
    var Game = require('lib/game')
    game = new Game()
  })

  it('should be a game', function (next) {
    console.log(game)
    next()
  })
})
