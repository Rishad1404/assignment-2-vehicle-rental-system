import express, {  Request, Response } from "express";
import initDB from "./config/db";
import logger from "./middleware/logger";
import { authRoutes } from "./modules/auth/auth.route";
import { userRoutes } from "./modules/user/user.routes";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";
import { bookingRoutes } from "./modules/booking/booking.routes";


const app = express();


// parser
app.use(express.json());


// Initializing DataBase
initDB();


app.get("/", logger, (req: Request, res: Response) => {
  res.send("This is assignment no.2 !");
});

// user routes
app.use("/api/v1/users",userRoutes)

// auth routes
app.use("/api/v1/auth",authRoutes)


// vehicles routes
app.use("/api/v1/vehicles",vehicleRoutes)

// bookings routes
app.use("/api/v1/bookings",bookingRoutes)



app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app

