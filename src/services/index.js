const games = require('./games/games.service');

module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(games);
};
