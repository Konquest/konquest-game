var Weapons = require('../weapons')
var Characters = require('../characters')

var Play = module.exports = function() {}

Play.prototype.preload = function() {}

Play.prototype._onJoinPlayer = function(playerStateData) {
  var player = new Characters.PhaserDude(this.game, playerStateData.id)

  this.players.push(player)
  this.playerMap[playerStateData.id] = player

  if (playerStateData.id === this.game.localPlayerId) {
    this.game.camera.follow(player)
  }
}

Play.prototype._onUpdatePlayer = function(playerState) {
  // TODO handle x and y updates with threshold and deadreckoning
  var player = this.playerMap[playerState.id];
  player.controls = playerState.controls;
  // player.spaceButton = playerState.spaceButton;

  // TODO make shooting more responsive
  // player.shoot = playerState.fire
  // if (playerState.fire) {
    // player.pointer = playerState.pointer
  // }
}

Play.prototype.setControls = function (controls) {

}

Play.prototype.create = function() {
  this.game.physics.startSystem(Phaser.Physics.P2JS)
  this.game.physics.startSystem(Phaser.Physics.ARCADE)

  this.game.stage.backgroundColor = '#000000'

  var bg = this.game.add.tileSprite(0, 0, 800, 600, 'background')
  bg.fixedToCamera = true

  var map = this.game.add.tilemap('level1');
  map.addTilesetImage('tiles-1');
  map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

  this.mapLayer = map.createLayer('Tile Layer 1');
  // this.mapLayer.debug = true; //  Un-comment this on to see the collision tiles
  this.mapLayer.resizeWorld();

  this.game.physics.arcade.gravity.y = 900;

  this.explosions = this.game.add.group()
  for(var i = 0; i < 30; i++) {
    var explosion = this.explosions.create(0, 0, 'kaboom', [0], false)
    explosion.anchor.set(0.5, 0.5)
    explosion.animations.add('kaboom')
  }

  // TODO connect to socket
  this.players = []
  this.playerMap = {}
  this.game.localPlayerId = 123


  // Temporary offline solution
  this.cursors = this.game.input.keyboard.createCursorKeys();
  this.spaceButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  setTimeout(function() {
    this._onJoinPlayer({
      id: 123
    })

    setInterval(function() {
      var state = {
        id: 123,
        controls: {
          left: this.cursors.left.isDown,
          right: this.cursors.right.isDown,
          jump: this.cursors.up.isDown,
          primary: this.game.input.activePointer.isDown,
          angle: this.game.physics.arcade.angleToXY(this, this.game.input.activePointer.worldX, this.game.input.activePointer.worldY)
        }
      }
      this._onUpdatePlayer(state);
    }.bind(this), 100);
  }.bind(this), 50);
}

Play.prototype.bulletToFloor = function(bullet, floor) {
  var explosionAnimation = this.explosions.getFirstExists(false);

  explosionAnimation.reset(bullet.x, bullet.y);
  explosionAnimation.play('kaboom', 16, false, true);

  bullet.kill()
}

Play.prototype.update = function() {
  this.players.forEach(function(player) {
    this.game.physics.arcade.collide(player, this.mapLayer);
    this.game.physics.arcade.collide(player.weapon, this.mapLayer, this.bulletToFloor, null, this);

    // player.update()
  }.bind(this))
}
