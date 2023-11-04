const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
  firstName: { type: String, maxLength: 25, minLength: 3 },
  lastName: { type: String, maxLength: 25, minLength: 3 },
  bandName: { type: String, maxLength: 40, minLength: 2 },
  origin: { type: String, maxLength: 300 },
  age: { type: Number, required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
});
ArtistSchema.virtual("url").get(function () {
  return `/catalog/artist/${this._id}`;
});
ArtistSchema.virtual("artistName").get(function () {
  if (this.firstName && this.lastName) {
    return this.firstName + " " + this.lastName;
  } else {
    return this.bandName;
  }
});

// Export model
module.exports = mongoose.model("Artist", ArtistSchema);
