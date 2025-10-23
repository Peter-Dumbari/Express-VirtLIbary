require("dotenv").config();
const http = require("http");
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 3500;

connectDB(process.env.MONGO_URL);

const server = http.createServer(app);
server.listen(PORT, function () {
  console.log("(----------------------------------------)");
  console.log("|          Server Started at...          |");
  console.log("|          http://localhost:" + PORT + "         |");
  console.log("(----------------------------------------)");
});
