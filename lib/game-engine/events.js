/**
  Definition of events

  Keep in present tense
*/
module.exports.NETWORK_CONNECT = 'network:connect'  // Client connected to server
module.exports.NETWORK_DISCONNECT = 'network:disconnect'  // Client disconnected from server

module.exports.SERVER_DISCONNECT = 'server:disconnect'  // (reason) Server actively disconnectes client

module.exports.GAME_PRELOAD = 'game:preload'
module.exports.GAME_CREATE = 'game:create'
module.exports.GAME_DESTROY = 'game:destroy'
module.exports.GAME_SYNC = 'game:sync' // (playerStates, worldStates)

module.exports.PLAYER_JOIN = 'player:join' // (playerState)
module.exports.PLAYER_LEAVE = 'player:leave' // (playerId)
module.exports.PLAYER_SYNC = 'player:sync'   // (playerStates) Passive server to clients players sync
module.exports.PLAYER_UPDATE = 'player:update' // (playerState) Active client to server update
module.exports.PLAYER_ERROR = 'player:error' // (playerId, message) Active player caused an error
// exports.PLAYER_UPDATE_HIGH = 'player:updated:high'  // High priority update
// exports.PLAYER_UPDATE_LOW = 'player:updated:low'  // Low priority update
