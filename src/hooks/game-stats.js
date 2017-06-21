// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

function generateStats(game) {
  game.playerCount = game.players.length;
  game.isPlayable = game.playerCount > 1;
  return game
}


module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations
    if (hook.method === 'find') {
      hook.result.data = hook.result.data.map(generateStats);
    } else {
      hook.result = generateStats(hook.result);
    }

    console.log('hmmmm')

    return hook;
  };
};
