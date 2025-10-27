const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes = require("../src/routes/auth");
const bookRoutes = require("../src/routes/book");
const cateogoryRoutes = require("./routes/category");
const reservationRoutes = require("../src/routes/reservation");

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/category", cateogoryRoutes);
app.use("/api/reservation", reservationRoutes);

module.exports = app;
