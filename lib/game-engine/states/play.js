var Characters = require('../characters')
var events = require('../events')

var Play = module.exports = function () {
  this.playerMap = {} // By id
  this.players = []

  this.onPlayerJoin = this._onPlayerJoin.bind(this)
  this.onPlayerLeave = this._onPlayerLeave.bind(this)
  this.onPlayerSync = this._onPlayerSync.bind(this)
  this.onGameSync = this._onGameSync.bind(this)

}

Play.prototype.preload = function () {
  this.engine = this.game.engine  // Handy reference

  this.engine.on(events.PLAYER_JOIN, this.onPlayerJoin)
  this.engine.on(events.PLAYER_LEAVE, this.onPlayerLeave)
  this.engine.on(events.PLAYER_SYNC, this.onPlayerSync)
  this.engine.on(events.GAME_SYNC, this.onGameSync)

  this.engine.emit(events.GAME_PRELOAD)
}

Play.prototype.shutdown = function () {
  this.engine.emit(events.GAME_DESTROY)

  this.engine.removeListener(events.PLAYER_JOIN, this.onPlayerJoin)
  this.engine.removeListener(events.PLAYER_LEAVE, this.onPlayerLeave)
  this.engine.removeListener(events.PLAYER_SYNC, this.onPlayerSync)
  this.engine.removeListener(events.GAME_SYNC, this.onPlayerSync)
}

Play.prototype.create = function () {
  this.game.physics.startSystem(Phaser.Physics.P2JS)
  this.game.physics.startSystem(Phaser.Physics.ARCADE)
  this.game.physics.arcade.gravity.y = 900

  // Setup background
  this.game.stage.backgroundColor = '#000000'
  var bg = this.game.add.tileSprite(0, 0, 800, 600, 'background')
  bg.fixedToCamera = true

  // Setup map
  var map = this.game.add.tilemap('level1')
  map.addTilesetImage('tiles-1')
  map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ])

  this.mapLayer = map.createLayer('Tile Layer 1')
  this.mapLayer.resizeWorld()

  this.playerGroup = this.game.add.group()

  // Done!
  this.engine.emit(events.GAME_CREATE)
}

Play.prototype.update = function () {
  // this.game.physics.arcade.collide(this.playerGroup, this.mapLayer)

  this.players.forEach(function (player) {
    this.game.physics.arcade.collide(player, this.mapLayer)
    // this.game.physics.arcade.collide(player.weapon, this.playerGroup, player.weapon.collide, player.weapon.collision, player.weapon)
    // this.game.physics.arcade.overlap(player.weapon, this.mapLayer, player.weapon.collide, player.weapon.collision, player.weapon)
    this.game.physics.arcade.collide(player.weapon, this.mapLayer, player.weapon.collide, null, player.weapon)
    this.game.physics.arcade.collide(player.weapon, this.players, player.weapon.collide, null, player.weapon)
  }.bind(this))
}

/**
  Event handlers
*/

Play.prototype._onPlayerJoin = function (playerStateData) {
  console.log('Player Joined!')
  if (!this.playerMap[playerStateData.id]) {
    var player = new Characters.PhaserDude(this.game, playerStateData.id)

    this.playerGroup.add(player)
    this.players.push(player)
    this.playerMap[playerStateData.id] = player
  }
}

Play.prototype._onPlayerSync = function (playerStates) {
  for (var i = 0; i < playerStates.length; i++) {
    var player = this.playerMap[playerStates[i].id]

    if (!player) {
      console.warn(new Error('Update: Player', playerStates[i].id, 'does not exist'))
      continue
    }

    player.controls = playerStates[i].controls
  }
}

Play.prototype._onPlayerLeave = function (playerId) {
  if (this.playerMap[playerId]) {
    var player = this.playerMap[playerId]
    this.playerMap[playerId] = null // Dereference
    this.players.splice(this.players.indexOf(player), 1)
    player.destroy()
  }
}

Play.prototype._onGameSync = function (playerStates, worldStates) {
  for (var i = 0; i < playerStates.length; i++) {
    var state = playerStates[i]
    var player = this.playerMap[state.id]

    if (!player) {
      this.game.engine.emit(events.PLAYER_JOIN, state)
      player = this.playerMap[state.id]
    }

    // console.log('synced player', player.sprite)
    player.sprite.x = state.position.x
    player.sprite.y = state.position.y
    player.sprite.body.velocity.x = state.velocity.x
    player.sprite.body.velocity.y = state.velocity.y
    player.controls = state.controls
  }
}
