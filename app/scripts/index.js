/* globals GameApp */

(function () {
  Phaser.Game.prototype.showDebugHeader = function () {}

  window.onload = function () {
    var app = new GameApp()

    app.start()
  }
})();
