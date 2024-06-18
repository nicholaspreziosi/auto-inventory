const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MakeSchema = new Schema({
  name: { type: String, required: true, minLength: 2, maxLength: 100 },
});

// Virtual for make's URL
MakeSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/inventory/make/${this._id}`;
});

// Export model
module.exports = mongoose.model("Make", MakeSchema);
