const express = require("express");
const app = express();
const cors = require('cors')
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary");
const fileUpload = require("express-fileupload");
const errorMiddleware = require("./middlewares/errors");

// Define a route to display content on the webpage
app.get('/', (req, res) => {
  const htmlContent = `
    <html>
      <head>
        <title>Welcome to My Server</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f0f8ff;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            text-align: center;
            color: #333;
          }
          .container {
            background: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #4CAF50;
          }
          p {
            font-size: 1.2em;
          }
          .footer {
            margin-top: 20px;
            font-size: 0.8em;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to My Server</h1>
          <p>The server is live and running!</p>
          <div class="footer">Thank you for visiting.</div>
        </div>
      </body>
    </html>
  `;
  res.send(htmlContent);
});

// app.use(cors(
//   {
//     origin: ['https://food-app.vercel.app'],
//     method: ['POST', 'GET'],
//     credentials: true
//   }
// ))

app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieParser());
app.use(fileUpload());
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const foodRouter = require("./routes/foodItem");
const restaurant = require("./routes/restaurant");
const menuRouter = require("./routes/menu");
const coupon = require("./routes/couponRoutes");
const review = require("./routes/reviewsRoutes");
const order = require("./routes/order");
const auth = require("./routes/auth");
const payment = require("./routes/payment");

app.use(express.json({
  limit: "30kb"
}));
app.use(express.urlencoded({
  extended: true,
  limit: "30kb"
}));
app.use("/api/v1/eats", foodRouter);
app.use("/api/v1/eats/menus", menuRouter);
app.use("/api/v1/eats/stores", restaurant);
app.use("/api/v1/eats/orders", order);
app.use("/api/v1/reviews", review);
app.use("/api/v1/users", auth);
app.use("/api/v1", payment);
app.use("/api/v1/coupon", coupon);
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "Can't find " + req.originalUrl + " on this server !"
  });
});
app.use(errorMiddleware);
module.exports = app;