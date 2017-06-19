// games-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;

  const cardSchema = new Schema({
    symbol: { type: String, required: true },
    visible: { type: Boolean, default: false },
  });

  const playerSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    pairs: [String],
  });

  const games = new Schema({
    cards: [cardSchema],
    players: [playerSchema],
    turn: { type: Number, default: 0 }, // player index
    winnerId: { type: Schema.Types.ObjectId, ref: 'users' },
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  return mongooseClient.model('games', games);
};
