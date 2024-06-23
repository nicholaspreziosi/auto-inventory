#! /usr/bin/env node

console.log(
  'This script populates some test vehicles and makes to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Vehicle = require("./models/vehicle");
const Make = require("./models/make");

const vehicles = [];
const makes = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createMakes();
  await createVehicles();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function makeCreate(index, name) {
  const make = new Make({ name: name });
  await make.save();
  makes[index] = make;
  console.log(`Added make: ${name}`);
}

async function vehicleCreate(
  index,
  year,
  make,
  model,
  trim,
  vin,
  price,
  miles,
  image
) {
  const vehicledetail = {
    year: year,
    model: model,
    trim: trim,
    vin: vin,
    price: price,
    miles: miles,
    image: image,
  };
  if (make != false) vehicledetail.make = make;

  const vehicle = new Vehicle(vehicledetail);
  await vehicle.save();
  vehicles[index] = vehicle;
  console.log(`Added vehicle: ${year} ${make.name} ${model}`);
}

async function createMakes() {
  console.log("Adding makes");
  await Promise.all([
    makeCreate(0, "Toyota"),
    makeCreate(1, "Nissan"),
    makeCreate(2, "Jeep"),
    makeCreate(3, "BMW"),
  ]);
}

async function createVehicles() {
  console.log("Adding Vehicles");
  await Promise.all([
    vehicleCreate(
      0,
      2019,
      makes[1],
      "Pathfinder",
      "S",
      "5N1DR2MM5KC585543",
      19295,
      27592,
      "https://res.cloudinary.com/dhnynl5zt/image/upload/c_fill,h_600,w_800/v1719101563/NissanPathfinder_xclgi2.jpg"
    ),
    vehicleCreate(
      1,
      2021,
      makes[0],
      "RAV4",
      "XLE AWD",
      "2T3P1RFV9MW227689",
      29499,
      24686,
      "https://res.cloudinary.com/dhnynl5zt/image/upload/c_fill,h_600,w_800/v1719101562/2021ToyotaRAV4_fgemmd.jpg"
    ),

    vehicleCreate(
      2,
      2018,
      makes[2],
      "Wrangler",
      "Unlimited Sahara 4x4",
      "1C4HJXEG9JW122871",
      31495,
      45765,
      "https://res.cloudinary.com/dhnynl5zt/image/upload/c_fill,h_600,w_800/v1719101963/2018JeepWrangler_gpwlsa.jpg"
    ),

    vehicleCreate(
      3,
      2021,
      makes[0],
      "Tundra",
      "4WD SR5 Double Cab 6.5' Bed 5.7L",
      "5TFUY5F14MX976738",
      37995,
      33864,
      "https://res.cloudinary.com/dhnynl5zt/image/upload/c_fill,h_600,w_800/v1719101667/2021ToyotaTundra_tj6tzu.jpg"
    ),

    vehicleCreate(
      4,
      2022,
      makes[3],
      "X3",
      "xDrive 30i",
      "5UX53DP00N9M67513",
      40995,
      20569,
      "https://res.cloudinary.com/dhnynl5zt/image/upload/c_fill,h_600,w_800/v1719101563/2022BMW_wthdix.jpg"
    ),

    vehicleCreate(
      5,
      2023,
      makes[0],
      "Highlander",
      "LE AWD",
      "5TDKDRBH1PS514208",
      40995,
      8193,
      "https://res.cloudinary.com/dhnynl5zt/image/upload/c_fill,h_600,w_800/v1719101563/2023ToyotaHighlander_n8u5ld.jpg"
    ),
  ]);
}
