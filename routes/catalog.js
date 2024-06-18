const express = require("express");
const router = express.Router();

// Require controller modules.
const make_controller = require("../controllers/makeController");
const vehicle_controller = require("../controllers/vehicleController");

/// MAKE ROUTES ///
// GET request for creating a make. NOTE This must come before route that displays make (uses id).
router.get("/make/create", make_controller.make_create_get);

//POST request for creating make.
router.post("/make/create", make_controller.make_create_post);

// GET request to delete make.
router.get("/make/:id/delete", make_controller.make_delete_get);

// POST request to delete make.
router.post("/make/:id/delete", make_controller.make_delete_post);

// GET request to update make.
router.get("/make/:id/update", make_controller.make_update_get);

// POST request to update make.
router.post("/make/:id/update", make_controller.make_update_post);

// GET request for one make.
router.get("/make/:id", make_controller.make_detail);

// GET request for list of all make.
router.get("/makes", make_controller.make_list);

/// VEHICLE ROUTES ///
// GET catalog home page.
router.get("/", vehicle_controller.index);

// GET request for creating a vehicle. NOTE This must come before routes that display vehicle (uses id).
router.get("/vehicle/create", vehicle_controller.vehicle_create_get);

// POST request for creating vehicle.
router.post("/vehicle/create", vehicle_controller.vehicle_create_post);

// GET request to delete vehicle.
router.get("/vehicle/:id/delete", vehicle_controller.vehicle_delete_get);

// POST request to delete vehicle.
router.post("/vehicle/:id/delete", vehicle_controller.vehicle_delete_post);

// GET request to update vehicle.
router.get("/vehicle/:id/update", vehicle_controller.vehicle_update_get);

// POST request to update vehicle.
router.post("/vehicle/:id/update", vehicle_controller.vehicle_update_post);

// GET request for one vehicle.
router.get("/vehicle/:id", vehicle_controller.vehicle_detail);

// GET request for list of all vehicle items.
router.get("/vehicles", vehicle_controller.vehicle_list);

module.exports = router;
