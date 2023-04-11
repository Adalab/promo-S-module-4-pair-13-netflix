const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const favoriteSchema = new Schema(
  {
    idUser: { type: Schema.Types.ObjectId, ref: 'users' },
    idMovie: { type: Schema.Types.ObjectId, ref: 'movies' },
    score: Number,
  },
  { collection: 'favorite' }
);
const Favorite = mongoose.model('favorite', favoriteSchema);
module.exports = Favorite; 