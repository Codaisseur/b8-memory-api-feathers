const games = require('./games/games.service');

const users = require('./users/users.service.js');

module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(games);
  app.configure(users);
};
