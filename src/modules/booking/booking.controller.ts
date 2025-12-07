import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user || !user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const booking = await bookingServices.createBooking(user, req.body);

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

const getBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user || !user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const bookings = await bookingServices.getBookings(user);

    res.status(200).json({
      success: true,
      message:
        user.role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
      data: bookings,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user || !user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const bookingId = Number(req.params.bookingId);
    const { status } = req.body;

    const updatedBooking = await bookingServices.updateBooking(
      user,
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
    res.status(400).json({ success: false, message: err.message });
  }
};

export const bookingControllers = {
  createBooking,
  getBookings,
  updateBooking,
};
