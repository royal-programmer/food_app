const mongoose = require("mongoose");
const connectDatabase = () => {
  mongoose.connect(process.env.DB_LOCAL_URI, {}).then(_0x3c1038 => {
    console.log("MongoDB Database connected with HOST: " + _0x3c1038.connection.host);
  });
};
module.exports = connectDatabase;