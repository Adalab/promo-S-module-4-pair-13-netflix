const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favoriteSchema = new Schema(
  {
    users: { type: Schema.Types.ObjectId, ref: "users" }, // the property of favorites collection has to have the same name as the collection.
    movies: { type: Schema.Types.ObjectId, ref: "movies" },
    score: Number,
  },
  { collection: "favorite" }
);
const Favorite = mongoose.model("favorite", favoriteSchema);
module.exports = Favorite;
