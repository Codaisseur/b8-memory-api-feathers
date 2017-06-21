// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const errors = require('feathers-errors');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations

    // see if hook.data has { flip: Number }
    if (hook.data.flip === undefined) return Promise.resolve(hook);

    console.log(`flipping card ${hook.data.flip}`);

    const { user } = hook.params;

    // see if user is a player
    return hook.app.service('games').get(hook.id)
      .then((game) => {
        const { players, turn, cards } = game;
        const playerIds = players.map((p) => (p.userId.toString()));
        const joined = playerIds.includes(user._id.toString());
        const hasTurn = playerIds.indexOf(user._id.toString()) === turn;

        if (!joined) {
          throw new errors.Unprocessable('You are not a player in this game, so you can not play!');
        }

        if (!hasTurn) {
          throw new errors.Unprocessable('It is not your turn to flip cards!');
        }

        const newCards = cards.map((c, i) => {
          if (i === hook.data.flip) {
            return Object.assign({}, c, { visible: true });
          }
          return c;
        });

        const visibleCards = newCards.filter((c) => (c.visible));

        if (visibleCards.length > 2) {
          throw new errors.Unprocessable('You can not flip more than 2 cards!');
        }

        if (visibleCards.length === 2) {
          const symbols = visibleCards.map((c) => (c.symbol))

          // set the lastCard
          hook.data.lastCard = hook.data.flip;

          // flip all the cards back to not visible
          hook.data.cards = cards.map((c) => (
            Object.assign({}, c, { visible: false }))
          );

          if (symbols[0] === symbols[1]) {
            let newPlayers = players;
            newPlayers[turn].pairs.push(symbols[0]);
            hook.data.players = newPlayers;
            // set the cards to won: true
            hook.data.cards = hook.data.cards.map((c) => {
              if (c.symbol === symbols[0]) {
                return Object.assign({}, c, { won: true });
              }
              return c;
            });

            const wonCards = hook.data.cards.filter((c) => (c.won));

            if (wonCards.length === cards.length) {
              const ranked = newPlayers.sort((a, b) => (b.pairs.length - a.pairs.length));
              const winner = ranked[0];
              const secondPlace = ranked[1];

              if (secondPlace && secondPlace.pairs.length === winner.pairs.length) {
                hook.data.draw = true;
              } else {
                hook.data.winnerId = winner.userId;
              }
            }

            // done! Player won this pair, keeps the turn
            return hook;
          }

          // next player's turn!
          let newTurn = turn + 1;
          if (newTurn + 1 > players.length) newTurn = 0;
          hook.data.turn = newTurn;
          // done! Next player's turn...
          return hook;
        }

        // flip the card :)
        hook.data.cards = newCards;
        // unset the lastCard
        hook.data.lastCard = null;

        console.log(hook.data);

        return Promise.resolve(hook);
      });
  };
};
