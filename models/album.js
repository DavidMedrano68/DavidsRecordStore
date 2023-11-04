const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
  artist: { type: Schema.Types.ObjectId, ref: "Artist", required: true },
  albumName: { type: String, required: true },
  description: { type: String, maxLength: 250 },
  genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
});

AlbumSchema.virtual("url").get(function () {
  return `/catalog/album/${this._id}`;
});

// Export model
module.exports = mongoose.model("Album", AlbumSchema);
