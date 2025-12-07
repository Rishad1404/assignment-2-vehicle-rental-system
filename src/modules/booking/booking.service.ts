import { pool } from "../../config/db";

const createBooking = async (user: any, payload: any) => {
  if (!user || !user.id) throw new Error("Unauthorized");

  const { vehicle_id, rent_start_date, rent_end_date } = payload;

  const vehicleResult = await pool.query(
    `SELECT * FROM vehicles WHERE id = $1 AND availability_status = 'available'`,
    [vehicle_id]
  );

  if (vehicleResult.rowCount === 0) {
    throw new Error("Vehicle not available");
  }

  const vehicle = vehicleResult.rows[0];

  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);

  if (start >= end) {throw new Error("End date must be after start date")}

  const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const totalPrice = diffDays * Number(vehicle.daily_rent_price);


  const bookingResult = await pool.query(
    `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES ($1, $2, $3, $4, $5, 'active')
     RETURNING *`,
    [user.id, vehicle_id, rent_start_date, rent_end_date, totalPrice]
  );

  const booking = bookingResult.rows[0];

  await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicle_id]
  );

  return {
    id: booking.id,
    customer_id: booking.customer_id,
    vehicle_id: booking.vehicle_id,
    rent_start_date: booking.rent_start_date,
    rent_end_date: booking.rent_end_date,
    total_price: Number(booking.total_price),
    status: booking.status,
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: Number(vehicle.daily_rent_price),
    },
  };
};



const getBookings = async (user: any) => {
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
    return result.rows;
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
    return result.rows;
  }
};

const updateBooking = async (
  user: any,
  bookingId: number,
  status: "cancelled" | "returned"
) => {
  const bookingRes = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [
    bookingId,
  ]);
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
  const updatedBooking = updatedBookingRes.rows[0];

  const vehicleRes = await pool.query(
    `SELECT vehicle_name, registration_number, type FROM vehicles WHERE id=$1`,
    [updatedBooking.vehicle_id]
  );
  const vehicle = vehicleRes.rows[0];

  if (user.role === "admin") {
    const customerRes = await pool.query(
      `SELECT name, email FROM users WHERE id=$1`,
      [updatedBooking.customer_id]
    );
    const customer = customerRes.rows[0];

    return {
      id: updatedBooking.id,
      customer_id: updatedBooking.customer_id,
      vehicle_id: updatedBooking.vehicle_id,
      rent_start_date: updatedBooking.rent_start_date,
      rent_end_date: updatedBooking.rent_end_date,
      total_price: Number(updatedBooking.total_price),
      status: updatedBooking.status,
      customer: {
        name: customer.name,
        email: customer.email,
      },
      vehicle: {
        vehicle_name: vehicle.vehicle_name,
        registration_number: vehicle.registration_number,
      },
    };
  } else {
    return {
      id: updatedBooking.id,
      vehicle_id: updatedBooking.vehicle_id,
      rent_start_date: updatedBooking.rent_start_date,
      rent_end_date: updatedBooking.rent_end_date,
      total_price: Number(updatedBooking.total_price),
      status: updatedBooking.status,
      vehicle: {
        vehicle_name: vehicle.vehicle_name,
        registration_number: vehicle.registration_number,
        type: vehicle.type,
      },
    };
  }
};


export const bookingServices = {
  createBooking,
  getBookings,
  updateBooking,
};
