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
      default: function () {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1); // add one day
        return tomorrow;
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Reservation", reservationSchema);
