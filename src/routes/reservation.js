const express = require("express");
const auth = require("../middlewares/auth");
const {
  createReservation,
  getReservationsByReader,
  cancelReservation,
} = require("../controllers/reservationController");
const router = express.Router();

router.post("/", auth, createReservation);
router.get("/my-reservations", auth, getReservationsByReader);
router.delete("/:id", auth, cancelReservation);

module.exports = router;
