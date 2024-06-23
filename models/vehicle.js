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
  image: { type: String, required: true },
});

// Virtual for vehicles's URL
VehicleSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/inventory/vehicle/${this._id}`;
});

// Virtual for vehicles's stock
VehicleSchema.virtual("stock").get(function () {
  let stock = this.vin.substring(this.vin.length - 8);
  return stock;
});

// Virtual for vehicles's formatted price
VehicleSchema.virtual("priceFormatted").get(function () {
  return this.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});

// Virtual for vehicles's formatted miles
VehicleSchema.virtual("milesFormatted").get(function () {
  return this.miles.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});

// Export model
module.exports = mongoose.model("Vehicle", VehicleSchema);
