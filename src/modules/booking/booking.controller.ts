import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

// Create booking
const createBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { vehicle_id, rent_start_date, rent_end_date } = req.body;

    const booking = await bookingServices.createBooking(
      { id: user.id, role: user.role },
      { vehicle_id, rent_start_date, rent_end_date }
    );

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// Get bookings
const getBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const result = await bookingServices.getBookings({
      id: user.id,
      role: user.role,
    });

    res.status(200).json({
      success: true,
      message:
        user.role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update booking
const updateBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const bookingId = Number(req.params.bookingId);
    const { status } = req.body;

    const updatedBooking = await bookingServices.updateBooking(
      { id: user.id, role: user.role },
      bookingId,
      status
    );

    res.status(200).json({
      success: true,
      message:
        status === "cancelled"
          ? "Booking cancelled successfully"
          : "Booking marked as returned. Vehicle is now available",
      data: updatedBooking,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const bookingControllers = {
  createBooking,
  getBookings,
  updateBooking,
};
