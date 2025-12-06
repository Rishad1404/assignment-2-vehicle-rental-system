import { Request, Response } from "express";
import { authServices } from "./auth.service";

// Login controller
const signinUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authServices.signinUser(email, password);

    if (result === null) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (result === false) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
};

// Signup controller
const signupUser = async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;

  try {
    const result = await authServices.signupUser(name, email, password, phone, role);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
};

export const authController = {
  signinUser,
  signupUser,
};
