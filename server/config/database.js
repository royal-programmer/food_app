const mongoose = require("mongoose");
const connectDatabase = () => {
  mongoose.connect(process.env.DB_LOCAL_URI, {}).then(connection => {
    console.log("MongoDB Database connected with HOST: " + connection.connection.name);
  });
};
module.exports = connectDatabase;