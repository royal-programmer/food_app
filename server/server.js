const app = require("./app");
const connectDatabase = require("./config/database");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary");
const ErrorHandler = require("./utils/errorHandler");

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

process.on("uncaughtException", (err) => {
  console.log("ERROR: " + err.stack);
  console.log("Shutting down server due to uncaught exception");
  process.exit(1);
});

dotenv.config({
  path: "./config/config.env"
});

connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const server = app.listen(process.env.PORT, () => {
  console.log("Server started on PORT: " + process.env.PORT + " in " + process.env.NODE_ENV + " mode.");
});

process.on("unhandledRejection ", (err) => {
  console.log("ERROR: " + err.message);
  console.log("Shutting down the server due to Unhandled Promise rejection");
  server.close(() => {
    process.exit(1);
  });
});