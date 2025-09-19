import { Request, Response } from "express";
import { registerUser, loginUser, refreshAccessToken } from "../services/auth.service";

// Register user
export const register = async (req: Request, res: Response) => {
  const {
    name,
    username,
    email,
    password
  } = req.body;

  try {
    const result = await registerUser({ name, username, email, password });
    return res.status(201).json({
      status: 201,
      message: "User registration successful",
      data: result,
    });
  } catch (error: any) {
    if (error.message === 'Username or Email already exists') {
      return res.status(409).json({ 
        status: 409,
        message: error.message
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  }
}

// Login user
export const login = async (req: Request, res: Response) => {
  const {
    username,
    password
  } = req.body;

  try {
    const result = await loginUser({ username, password });
    return res.status(200).json({
      status: 200,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ 
        status: 401,
        message: error.message
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  }
}

// Refresh access token
export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  try {
    if (!refreshToken) {
      return res.status(400).json({
        status: 400,
        message: "Refresh token is required"
      });
    }

    const result = await refreshAccessToken(refreshToken);
    return res.status(200).json({
      status: 200,
      message: "Token refreshed successfully",
      data: result,
    });
  } catch (error: any) {
    if (error.message === 'Invalid refresh token' || error.message === 'User not found') {
      return res.status(401).json({ 
        status: 401,
        message: error.message
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  }
};

// Logout user
export const logout = async (req: Request, res: Response) => {
    return res.status(200).json({
      status: 200,
      message: "Logout successful"
    });
  };
