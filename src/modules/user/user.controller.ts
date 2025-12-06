import { Request, Response } from "express";
import { userServices } from "./user.service";

// Get all users (Admin only)
const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUsers();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
};

// Get single user by ID
const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUser(req.params.userId as string);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
};

// Update user
const updateUser = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const { name, email, phone, role } = req.body;

  if (req.user.role !== "admin" && req.user.id !== req.params.userId) {
    return res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  }

  try {
    const updatedRole = req.user.role === "admin" ? role : undefined;

    const result = await userServices.updateUser(
      name,
      email,
      phone,
      updatedRole,
      req.params.userId as string
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
};

// Delete user
const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.deleteUser(req.params.userId as string);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: result.rows,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
};

export const userControllers = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
