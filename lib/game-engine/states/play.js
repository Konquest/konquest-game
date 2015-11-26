var Weapons = require('../weapons')
var Characters = require('../characters')

var Play = module.exports = function() {}

Play.prototype.preload = function() {
  this.game.onPlayerJoin.add(this._onPlayerJoin, this)
  // this.game.onPlayerLeave.add(this._onPlayerLeave, this)
  this.game.onPlayerUpdate.add(this._onPlayerUpdate, this)
  // this.game.onGameSync.add(this._onGameSync, this)
}

Play.prototype.shutdown = function() {
  this.game.onPlayerJoin.remove(this._onPlayerJoin, this)
  // this.game.onPlayerLeave.remove(this._onPlayerLeave, this)
  this.game.onPlayerUpdate.remove(this._onPlayerUpdate, this)
  // this.game.onGameSync.remove(this._onGameSync, this)
}

Play.prototype._onPlayerJoin = function(playerStateData) {
  var player = new Characters.PhaserDude(this.game, playerStateData.id)

  this.players.push(player)
  this.playerMap[playerStateData.id] = player

  this.onPlayerJoin && this.onPlayerJoin({id: playerStateData.id})
}

Play.prototype._onPlayerUpdate = function(playerState) {
  var player = this.playerMap[playerState.id];
  player.controls = playerState.controls;
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

  this.players = []
  this.playerMap = {}

  this.onGameCreate && this.onGameCreate()
}

Play.prototype.update = function() {
  this.players.forEach(function(player) {
    this.game.physics.arcade.collide(player, this.mapLayer);
    this.game.physics.arcade.collide(player.weapon, this.mapLayer, player.weapon.collide, player.weapon.collision, player.weapon);

    // player.update()
  }.bind(this))
}
