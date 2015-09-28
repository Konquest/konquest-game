var ping = require('./ping');

/**
 * Router Export
 *
 * @param  {Express} app Express application
 */
module.exports = function (app) {
  app.get('/ping', ping);
};
