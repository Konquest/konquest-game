/* globals describe, before, it */


describe('Game', function () {
  var Game
  var game

  before(function () {
    Game = require('services/game')
    game = new Game()
  })

  it('should be a game', function (next) {
    // console.log(game)
    next()
  })
})
