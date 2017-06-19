// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {

    const { user } = hook.params

    // assign the owner of the game
    hook.data.userId = user._id,
    // add the owner to the players, as the first player in the game
    hook.data.players = [{
      userId: user._id,
      pairs: []
    }]

    // create some cards and shuffle them
    const symbols = shuffle('✿★♦✵♣♠♥✖'.repeat(2).split(''))
    hook.data.cards = symbols
      .map((symbol) => ({ visible: false, symbol: symbol }))

    return Promise.resolve(hook);
  };
};
