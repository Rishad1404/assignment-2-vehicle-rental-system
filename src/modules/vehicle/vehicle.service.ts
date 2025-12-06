import { pool } from "../../config/db";

const addVehicle = async (vehicle: {
  vehicle_name: string;
  type: string;
  registration_number: string;
  daily_rent_price: number;
  availability_status: string;
}) => {
  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [
      vehicle.vehicle_name,
      vehicle.type,
      vehicle.registration_number,
      vehicle.daily_rent_price,
      vehicle.availability_status,
    ]
  );
  return result;
};

const getVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result;
};

const getVehicle = async (id: number) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);
  return result;
};

const updateVehicle = async (id: number, data: {vehicle_name?: string;type?: string; registration_number?: string; daily_rent_price?: number; availability_status?: string;}) => {
  const fields = [];
  const values: any[] = [];
  let idx = 1;

  for (const key in data) {
    fields.push(`${key}=$${idx}`);
    values.push((data as any)[key]);
    idx++;
  }

  values.push(id);

  const result = await pool.query(
    `UPDATE vehicles SET ${fields.join(", ")} WHERE id=$${idx} RETURNING *`,
    values
  );
  return result;
};

const deleteVehicle = async (id: number) => {
  const result = await pool.query(`DELETE FROM vehicles WHERE id=$1`, [id]);
  return result;
};

export const vehicleServices = {
  addVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
};
