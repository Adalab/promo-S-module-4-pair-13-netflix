const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favoriteSchema = new Schema(
  {
    idUser: { type: Schema.Types.ObjectId, ref: "users" },
    idMovie: { type: Schema.Types.ObjectId, ref: "movies" },
    score: Number,
  },
  { collection: "favorite" }
  // {
  //   //documentation because of the error of path: "user" and populate
  //   versionKey: false,
  //   timestamps: true,
  // }
);
const Favorite = mongoose.model("favorite", favoriteSchema);
module.exports = Favorite;
