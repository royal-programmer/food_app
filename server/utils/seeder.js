const Fooditem = require("../models/foodItem");
const dotenv = require("dotenv");
const connectDatabase = require("../config/database");
const fooditems = require("../data/foodItem.json");
dotenv.config({
  path: "backend/config/config.env"
});
connectDatabase();
const seedFooditems = async () => {
  try {
    await Fooditem.deleteMany();
    await Fooditem.insertMany(fooditems);
    process.exit();
  } catch (_0xe89cb2) {
    console.log(_0xe89cb2.message);
    process.exit();
  }
};
seedFooditems();