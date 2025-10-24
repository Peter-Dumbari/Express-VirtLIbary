const mongoose = require("mongoose");

const reservationSchema = mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    reader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    end_reservation_date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.export = mongoose.model("Reservation", reservationSchema);
