const Reservation = require("../models/reservation");
const Book = require("../models/book");

exports.createReservation = async (req, res) => {
  try {
    const { bookId, endReservationDate } = req.body;
    const userId = req.user._id;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Optional: Check if book is already reserved for the date
    const existingReservation = await Reservation.findOne({ book: bookId });
    if (existingReservation) {
      return res.status(400).json({ message: "Book is already reserved" });
    }

    // Create reservation
    const reservation = await Reservation.create({
      book: bookId,
      reader: userId,
      end_reservation_date: endReservationDate,
    });

    res.status(201).json({
      message: "Book reserved successfully",
      reservation,
    });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getReservationsByReader = async (req, res) => {
  try {
    const readerId = req.user._id;

    const reservations = await Reservation.find({ reader: readerId })
      .populate("book", "title author coverImage")
      .sort({ createdAt: -1 });

    if (reservations.length === 0) {
      return res.status(200).json({ message: "No reservations found" });
    }

    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Only admin or the reader who made it can cancel
    if (
      req.user.role !== "admin" &&
      reservation.reader.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await reservation.deleteOne();
    res.status(200).json({ message: "Reservation cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
