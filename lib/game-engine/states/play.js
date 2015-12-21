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
  // this.game.physics.startSystem(Phaser.Physics.ARCADE)
  this.game.physics.p2.gravity.y = 1400
  this.game.physics.p2.restitution = 0
  // this.game.physics.arcade.gravity.y = 900

  // Setup background
  this.game.stage.backgroundColor = '#000000'
  var bg = this.game.add.tileSprite(0, 0, 800, 600, 'background')
  bg.fixedToCamera = true

  // Setup map
  var map = this.game.add.tilemap('map')

  map.addTilesetImage('grass')
  map.setCollisionByExclusion([79])

  this.groundLayer = map.createLayer('ground')
  this.groundLayer.resizeWorld()

  // this.game.physics.p2.convertCollisionObjects(, 'collision')
  this.game.physics.p2.convertTilemap(map, this.groundLayer)

  // this.mapCollision = game.physics.p2.convertCollisionObjects(this.map, 'Collision Layer');

  this.playerGroup = this.game.add.group()

  // Done!
  this.engine.emit(events.GAME_CREATE)
}

Play.prototype.update = function () {
  // this.game.physics.arcade.collide(this.playerGroup, this.mapLayer)

  // this.players.forEach(function (player) {
  //   this.game.physics.arcade.collide(player, this.mapLayer)
  //   // this.game.physics.arcade.collide(player.weapon, this.playerGroup, player.weapon.collide, player.weapon.collision, player.weapon)
  //   // this.game.physics.arcade.overlap(player.weapon, this.mapLayer, player.weapon.collide, player.weapon.collision, player.weapon)
  //   this.game.physics.arcade.collide(player._weapon, this.mapLayer, player._weapon.collide, null, player._weapon)
  //   this.game.physics.arcade.collide(player._weapon, this.players, player._weapon.collide, null, player._weapon)
  // }.bind(this))
}

/**
  Event handlers
*/

Play.prototype._onPlayerJoin = function (playerStateData) {
  console.log('Player Joined!')
  if (!this.playerMap[playerStateData.id]) {
    var player = new Characters.PhaserDude(this.game, playerStateData.id, playerStateData.weapon)

    this.playerGroup.add(player)
    this.players.push(player)
    this.playerMap[playerStateData.id] = player
  }
}

Play.prototype._onPlayerSync = function (playerStates) {
  for (var i = 0; i < playerStates.length; i++) {
    var player = this.playerMap[playerStates[i].id]

    if (!player) {
      var err = new Error('Update: Player', playerStates[i].id, 'does not exist')
      this.engine.emit(events.PLAYER_ERROR, playerStates[i].id, err)
      console.warn(err.message)
      continue
    }

    player.deserializeDelta(playerStates[i])
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

    player.deserialize(state)
  }
}
