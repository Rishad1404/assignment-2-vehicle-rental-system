import { pool } from "../../config/db";


interface User {
  id: number;
  role: "admin" | "customer";
}

const createBooking = async (user: { id: number; role: string }, payload: any) => {
  const { vehicle_id, rent_start_date, rent_end_date } = payload;


  const vehicleRes = await pool.query(`SELECT daily_rent_price, availability_status FROM vehicles WHERE id=$1`, [vehicle_id]);
  const vehicle = vehicleRes.rows[0];

  if (!vehicle) throw new Error("Vehicle not found");
  if (vehicle.availability_status !== "available") throw new Error("Vehicle not available");

  const startDate = new Date(rent_start_date);
  const endDate = new Date(rent_end_date);
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const total_price = vehicle.daily_rent_price * days;

  const result = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
    [user.id, vehicle_id, rent_start_date, rent_end_date, total_price, "active"]
  );

  await pool.query(`UPDATE vehicles SET availability_status='booked' WHERE id=$1`, [vehicle_id]);

  return {
    ...result.rows[0],
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    }
  };
};


const getBookings = async (user: User) => {
  if (user.role === "admin") {
    const result = await pool.query(
      `SELECT 
         b.id,
         b.customer_id,
         b.vehicle_id,
         b.rent_start_date,
         b.rent_end_date,
         b.total_price,
         b.status,
         json_build_object('name', u.name, 'email', u.email) AS customer,
         json_build_object('vehicle_name', v.vehicle_name, 'registration_number', v.registration_number) AS vehicle
       FROM bookings b
       JOIN users u ON b.customer_id = u.id
       JOIN vehicles v ON b.vehicle_id = v.id
       ORDER BY b.id ASC`
    );
    return result;
  } else {
    const result = await pool.query(
      `SELECT 
         b.id,
         b.vehicle_id,
         b.rent_start_date,
         b.rent_end_date,
         b.total_price,
         b.status,
         json_build_object('vehicle_name', v.vehicle_name, 'registration_number', v.registration_number, 'type', v.type) AS vehicle
       FROM bookings b
       JOIN vehicles v ON b.vehicle_id = v.id
       WHERE b.customer_id=$1
       ORDER BY b.id ASC`,
      [user.id]
    );
    return result;
  }
};

const updateBooking = async (
  user: User,
  bookingId: number,
  status: "cancelled" | "returned"
) => {

  const bookingRes = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [bookingId]);
  if (bookingRes.rows.length === 0) throw new Error("Booking not found");

  const booking = bookingRes.rows[0];

  if (status === "cancelled") {
    if (user.role !== "customer" || booking.customer_id !== user.id) {
      throw new Error("Unauthorized to cancel this booking");
    }
    const now = new Date();
    if (new Date(booking.rent_start_date) <= now) {
      throw new Error("Cannot cancel booking after start date");
    }
  }


  if (status === "returned") {
    if (user.role !== "admin") throw new Error("Only admin can mark returned");
    await pool.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
      [booking.vehicle_id]
    );
  }


  const updatedBookingRes = await pool.query(
    `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
    [status, bookingId]
  );

  return updatedBookingRes.rows[0];
};

export const bookingServices = {
  createBooking,
  getBookings,
  updateBooking,
};
