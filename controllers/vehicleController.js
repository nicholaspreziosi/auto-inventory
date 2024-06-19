const Vehicle = require("../models/vehicle");
const Make = require("../models/make");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  const [numVehicles, numMakes] = await Promise.all([
    Vehicle.countDocuments({}).exec(),
    Make.countDocuments({}).exec(),
  ]);
  res.render("index", {
    title: "Pre-Owned Vehicles",
    vehicle_count: numVehicles,
    make_count: numMakes,
  });
});

// Display list of all vehicles.
exports.vehicle_list = asyncHandler(async (req, res, next) => {
  const [allVehicles, numVehicles, numMakes] = await Promise.all([
    Vehicle.find({}, "year make model price trim vin")
      .sort({ price: 1 })
      .populate("make")
      .exec(),
    Vehicle.countDocuments({}).exec(),
    Make.countDocuments({}).exec(),
  ]);
  res.render("vehicle_list", {
    title: "Pre-Owned Vehicles",
    vehicle_list: allVehicles,
    make_count: numMakes,
    vehicle_count: numVehicles,
  });
});

// Display detail page for a specific vehicle.
exports.vehicle_detail = asyncHandler(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id).populate("make").exec();

  if (vehicle === null) {
    // No results.
    const err = new Error("Vehicle not found");
    err.status = 404;
    return next(err);
  }

  res.render("vehicle_detail", {
    title: "Vehicle Detail",
    vehicle: vehicle,
  });
});

// Display vehicle create form on GET.
exports.vehicle_create_get = asyncHandler(async (req, res, next) => {
  const allMakes = await Make.find({}, "name").sort({ name: 1 }).exec();
  res.render("vehicle_form", { title: "Add Vehicle", makes: allMakes });
});

// Handle vehicle create on POST.
exports.vehicle_create_post = [
  // Validate and sanitize the name field.
  body("year", "Year must be within 1900 and 2025")
    .trim()
    .isInt({ min: 1900, max: 2025 })
    .escape(),
  body("model", "Model must contain at least 1 characters")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("trim", "Trim contain at least 1 characters")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("vin", "VIN must contain 17 characters")
    .trim()
    .isLength({ min: 17, max: 17 })
    .escape(),
  body("price", "Price must be within the range of $1 to $2,000,000")
    .trim()
    .isInt({ min: 1, max: 2000000 })
    .escape(),
  body("miles", "Miles must be within the range of 1 to 1,000,000")
    .trim()
    .isInt({ min: 1, max: 1000000 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a make object with escaped and trimmed data.
    const make = await Make.findById(req.body.make).exec();
    const vehicle = new Vehicle({
      year: req.body.year,
      make: make,
      model: req.body.model,
      trim: req.body.trim,
      vin: req.body.vin,
      price: req.body.price,
      miles: req.body.miles,
    });

    if (!errors.isEmpty()) {
      const allMakes = await Make.find({}, "name").sort({ name: 1 }).exec();
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("vehicle_form", {
        title: "Add Vehicle",
        makes: allMakes,
        year: req.body.year,
        model: req.body.model,
        trim: req.body.trim,
        vin: req.body.vin,
        price: req.body.price,
        miles: req.body.miles,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if vehicle with same vin already exists.
      const vehicleExists = await Vehicle.findOne({ vin: req.body.vin })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (vehicleExists) {
        // Vehicle exists, redirect to its detail page.
        res.redirect(vehicleExists.url);
      } else {
        await vehicle.save();
        // New vehicle saved. Redirect to vehicle detail page.
        res.redirect(vehicle.url);
      }
    }
  }),
];

// Display vehicle delete form on GET.
exports.vehicle_delete_get = asyncHandler(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id).populate("make").exec();

  if (vehicle === null) {
    res.redirect("inventory/vehicles");
  }

  res.render("vehicle_delete", {
    title: "Delete Vehicle",
    vehicle: vehicle,
  });
});

// Handle vehicle delete on POST.
exports.vehicle_delete_post = asyncHandler(async (req, res, next) => {
  await Vehicle.findByIdAndDelete(req.params.id);
  res.redirect("/inventory/vehicles");
});

// Display vehicle update form on GET.
exports.vehicle_update_get = asyncHandler(async (req, res, next) => {
  const [allMakes, vehicle] = await Promise.all([
    Make.find({}, "name").sort({ name: 1 }).exec(),
    Vehicle.findById(req.params.id).populate("make").exec(),
  ]);

  res.render("vehicle_form", {
    title: "Update Vehicle",
    makes: allMakes,
    year: vehicle.year,
    make: vehicle.make,
    model: vehicle.model,
    trim: vehicle.trim,
    vin: vehicle.vin,
    price: vehicle.price,
    miles: vehicle.miles,
  });
});

// Handle vehicle update on POST.
exports.vehicle_update_post = [
  // Validate and sanitize the name field.
  body("year", "Year must be within 1900 and 2025")
    .trim()
    .isInt({ min: 1900, max: 2025 })
    .escape(),
  body("model", "Model must contain at least 1 characters")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("trim", "Trim contain at least 1 characters")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("vin", "VIN must contain 17 characters")
    .trim()
    .isLength({ min: 17, max: 17 })
    .escape(),
  body("price", "Price must be within the range of $1 to $2,000,000")
    .trim()
    .isInt({ min: 1, max: 2000000 })
    .escape(),
  body("miles", "Miles must be within the range of 1 to 1,000,000")
    .trim()
    .isInt({ min: 1, max: 1000000 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a make object with escaped and trimmed data.
    const make = await Make.findById(req.body.make).exec();
    const vehicle = new Vehicle({
      year: req.body.year,
      make: make,
      model: req.body.model,
      trim: req.body.trim,
      vin: req.body.vin,
      price: req.body.price,
      miles: req.body.miles,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const allMakes = await Make.find({}, "name").sort({ name: 1 }).exec();
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("vehicle_form", {
        title: "Update Vehicle",
        makes: allMakes,
        make: make,
        year: req.body.year,
        model: req.body.model,
        trim: req.body.trim,
        vin: req.body.vin,
        price: req.body.price,
        miles: req.body.miles,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      const updatedVehicle = await Vehicle.findByIdAndUpdate(
        req.params.id,
        vehicle,
        {}
      );
      // Redirect to vehicle detail page.
      res.redirect(updatedVehicle.url);
    }
  }),
];
