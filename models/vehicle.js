const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const VehicleSchema = new Schema({
  year: { type: Number, required: true },
  make: { type: Schema.Types.ObjectId, ref: "Make", required: true },
  model: { type: String, required: true },
  trim: { type: String, required: true },
  vin: { type: String, required: true },
  price: { type: Number, required: true },
  miles: { type: Number, required: true },
});

// Virtual for vehicles's URL
VehicleSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/inventory/vehicle/${this._id}`;
});

// Virtual for vehicles's URL
VehicleSchema.virtual("stock").get(function () {
  let stock = this.vin.substring(this.vin.length - 8);
  return stock;
});

// Export model
module.exports = mongoose.model("Vehicle", VehicleSchema);
