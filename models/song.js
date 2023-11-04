const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SongSchema = new Schema({
  album: { type: Schema.Types.ObjectId, ref: "Album" },
  songName: { type: String, required: true, maxLength: 40, minLength: 2 },
  runtime: { type: Number, required: true, min: 1 },
  artist: { type: Schema.Types.ObjectId, ref: "Artist" },
  featured: [{ type: Schema.Types.ObjectId, ref: "Artist" }],
});
SongSchema.virtual("url").get(function () {
  return `/catalog/song/${this._id}`;
});

// Export model
module.exports = mongoose.model("Song", SongSchema);
