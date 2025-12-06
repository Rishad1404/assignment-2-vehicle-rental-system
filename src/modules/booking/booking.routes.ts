import { Router } from "express";
import { bookingControllers } from "./booking.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth("customer", "admin"), bookingControllers.createBooking);

router.get("/", auth("customer", "admin"), bookingControllers.getBookings);

router.put("/:bookingId", auth("customer", "admin"), bookingControllers.updateBooking);

export const bookingRoutes = router;
