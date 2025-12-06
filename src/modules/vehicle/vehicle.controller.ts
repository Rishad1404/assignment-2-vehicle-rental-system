import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";


const addVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.addVehicle(req.body);
    res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ 
        success: false, 
        message: err.message 
    });
  }
};


const getVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getVehicles();
    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({ 
        success: false, 
        message: err.message 
    });
  }
};


const getVehicle = async (req: Request, res: Response) => {
  const id = Number(req.params.vehicleId);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid vehicle ID" });

  try {
    const result = await vehicleServices.getVehicle(id);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.status(200).json({ 
        success: true,
        message: "Vehicle retrieved successfully", 
        data: result.rows[0] 
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};


const updateVehicle = async (req: Request, res: Response) => {
  const id = Number(req.params.vehicleId);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid vehicle ID" });

  try {
    const result = await vehicleServices.updateVehicle(id, req.body);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.status(200).json({ 
        success: true,
        message: "Vehicle updated successfully", 
        data: result.rows[0] 
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};


const deleteVehicle = async (req: Request, res: Response) => {
  const id = Number(req.params.vehicleId);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid vehicle ID" });

  try {
    const result = await vehicleServices.deleteVehicle(id);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.status(200).json({ 
        success: true, 
        message: "Vehicle deleted successfully" 
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const vehicleControllers = {
  addVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
};
