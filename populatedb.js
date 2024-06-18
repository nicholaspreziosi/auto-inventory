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
  miles
) {
  const vehicledetail = {
    year: year,
    model: model,
    trim: trim,
    vin: vin,
    price: price,
    miles: miles,
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
    makeCreate(3, "Honda"),
    makeCreate(4, "Ford"),
    makeCreate(5, "BMW"),
  ]);
}

async function createVehicles() {
  console.log("Adding Vehicles");
  await Promise.all([
    vehicleCreate(
      0,
      2021,
      makes[0],
      "Venza",
      "LE AWD",
      "JTEAAAAH2MJ036361",
      26999,
      31100
    ),
    vehicleCreate(
      1,
      2022,
      makes[0],
      "RAV4",
      "XLE AWD",
      "2T3P1RFV1NW268643",
      28495,
      32588
    ),
    vehicleCreate(
      2,
      2023,
      makes[0],
      "Camry",
      "LE",
      "4T1C11BK9PU106444",
      28995,
      10776
    ),

    vehicleCreate(
      3,
      2021,
      makes[0],
      "RAV4",
      "XLE AWD",
      "2T3P1RFV9MW227689",
      29499,
      24686
    ),
    vehicleCreate(
      4,
      2017,
      makes[0],
      "Tacoma",
      "TRD Sport Double Cab 5' Bed V6 4x4 MT",
      "5TFCZ5AN2HX077658",
      31295,
      66903
    ),
    vehicleCreate(
      5,
      2021,
      makes[0],
      "Tundra",
      "4WD SR5 Double Cab 6.5' Bed 5.7L",
      "5TFUY5F14MX976738",
      37995,
      33864
    ),
    vehicleCreate(
      6,
      2023,
      makes[0],
      "Highlander",
      "LE AWD",
      "5TDKDRBH1PS514208",
      40995,
      8193
    ),
    vehicleCreate(
      7,
      2019,
      makes[1],
      "Pathfinder",
      "S",
      "5N1DR2MM5KC585543",
      19295,
      27592
    ),
    vehicleCreate(
      8,
      2017,
      makes[3],
      "CR-V",
      "EX AWD",
      "2HKRW2H56HH623820",
      20499,
      68395
    ),
    vehicleCreate(
      9,
      2018,
      makes[2],
      "Wrangler",
      "Unlimited Sahara 4x4",
      "1C4HJXEG9JW122871",
      31495,
      45765
    ),
    vehicleCreate(
      10,
      2022,
      makes[5],
      "X3",
      "xDrive 30i",
      "5UX53DP00N9M67513",
      40995,
      20569
    ),
    vehicleCreate(
      11,
      2021,
      makes[4],
      "Mustang",
      "GT Premium Convertible",
      "1FATP8FF1M5149809",
      42995,
      5416
    ),
  ]);
}
