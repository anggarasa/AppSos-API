import { Request, Response } from "express";
import { deleteUserById, findAllUsers, findUserById, updateUserById } from "../services/user.service";

// get users
export const getUsers = async (_: Request, res: Response) => {
  try {
    const users = await findAllUsers();
    return res.status(200).json({
      status: 200,
      message: "Success",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error"
    });
  }
}

// get user by username
export const findUser = async (req: Request, res: Response) => {
  const id: string = req.params.id;

  try {
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found"
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Success",
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
}


// update user
export const updateUser = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const { name, username, email, bio } = req.body;
  const avatar = req.file as Express.Multer.File;

  console.log('Update request for user:', id);
  console.log('Request body:', { name, username, email, bio });
  console.log('Avatar file:', avatar ? 'Present' : 'Not present');

  try {
    const updatedUser = await updateUserById(id, { name, username, email, bio, avatar });
    
    return res.status(200).json({
      status: 200,
      message: "User update successful",
      data: updatedUser
    });
  } catch (error: any) {
    console.error('Update user error:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({
        status: 404,
        message: error.message
      });
    } else if (error.message === 'Username already exists' || error.message === 'Email already exists') {
      return res.status(409).json({
        status: 409,
        message: error.message
      });
    } else if (error.message.includes('Supabase configuration')) {
      return res.status(500).json({
        status: 500,
        message: "Server configuration error"
      });
    } else if (error.message.includes('Failed to upload avatar')) {
      return res.status(500).json({
        status: 500,
        message: "Avatar upload failed",
        error: error.message
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }
};

// delete user
export const deleteUser = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  try {
    const result = await deleteUserById(id);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        status: 404,
        message: error.message
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: "Internal server error"
      });
    }
  }
}