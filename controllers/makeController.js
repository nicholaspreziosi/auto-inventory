const Make = require("../models/make");
const Vehicle = require("../models/vehicle");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all Makes.
exports.make_list = asyncHandler(async (req, res, next) => {
  const allMakes = await Make.find({}, "name").sort({ name: 1 }).exec();
  res.render("make_list", {
    title: "Pre-Owned Vehicle Makes",
    make_list: allMakes,
  });
});

// Display detail page for a specific Make.
exports.make_detail = asyncHandler(async (req, res, next) => {
  // Get details of Make and all associated vehicles (in parallel)
  const [make, vehiclesInMake] = await Promise.all([
    Make.findById(req.params.id).exec(),
    Vehicle.find({ make: req.params.id }, "year make model price trim vin")
      .sort({ price: 1 })
      .exec(),
  ]);

  if (make === null) {
    // No results.
    const err = new Error("Make not found");
    err.status = 404;
    return next(err);
  }
  res.render("make_detail", {
    title: "Make Detail",
    make: make,
    make_vehicles: vehiclesInMake,
  });
});

// Display Make create form on GET.
exports.make_create_get = asyncHandler(async (req, res, next) => {
  res.render("make_form", { title: "Add Make" });
});

// Handle Make create on POST.
exports.make_create_post = [
  // Validate and sanitize the name field.
  body("name", "Make name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a make object with escaped and trimmed data.
    const make = new Make({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("make_form", {
        title: "Add Make",
        make: make,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if make with same name already exists.
      const makeExists = await Make.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (makeExists) {
        // Make exists, redirect to its detail page.
        res.redirect(makeExists.url);
      } else {
        await make.save();
        // New make saved. Redirect to make detail page.
        res.redirect(make.url);
      }
    }
  }),
];

// Display Make delete form on GET.
exports.make_delete_get = asyncHandler(async (req, res, next) => {
  const [make, allVehiclesByMake] = await Promise.all([
    Make.findById(req.params.id).exec(),
    Vehicle.find({ make: req.params.id }, "year model trim vin").exec(),
  ]);

  if (make === null) {
    res.redirect("inventory/makes");
  }

  res.render("make_delete", {
    title: "Delete Make",
    make: make,
    make_vehicles: allVehiclesByMake,
  });
});

// Handle Make delete on POST.
exports.make_delete_post = asyncHandler(async (req, res, next) => {
  const [make, allVehiclesByMake] = await Promise.all([
    Make.findById(req.params.id).exec(),
    Vehicle.find({ make: req.params.id }, "year model trim vin").exec(),
  ]);

  if (allVehiclesByMake.length > 0) {
    res.render("make_delete", {
      title: "Delete Make",
      make: make,
      make_vehicles: allVehiclesByMake,
    });
    return;
  } else {
    await Make.findByIdAndDelete(req.params.id);
    res.redirect("/inventory/makes");
  }
});

// Display Make update form on GET.
exports.make_update_get = asyncHandler(async (req, res, next) => {
  const make = await Make.findById(req.params.id).exec();
  res.render("make_form", {
    title: "Update Make",
    make: make,
  });
});

// Handle Make update on POST.
exports.make_update_post = [
  // Validate and sanitize the name field.
  body("name", "Make name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a make object with escaped and trimmed data.
    const make = new Make({ name: req.body.name, _id: req.params.id });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("make_form", {
        title: "Update Make",
        make: make,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if make with same name already exists.
      const makeExists = await Make.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (makeExists) {
        // Make exists, redirect to its detail page.
        res.redirect(makeExists.url);
      } else {
        // Update the record.
        const updatedMake = await Make.findByIdAndUpdate(
          req.params.id,
          make,
          {}
        );
        res.redirect(updatedMake.url);
      }
    }
  }),
];
