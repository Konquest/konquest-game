(function() {

  window.onload = function () {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game')

    var engine = new GameEngine(game)

    var bootState = GameEngine.States.get('boot')
    engine.start()
  }

})()
