import { Request, Response } from "express";
import { deleteUserById, findAllUsers, findUserByUsername, insertUser, updateUserById } from "../services/user.service";

// get users
export const getUsers = async (_: Request, res: Response) => {
  try {
    const users = await findAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
}

// get user by username
export const findUser = async (req: Request, res: Response) => {
  const username: string = req.params.username;

  try {
    const user = await findUserByUsername(username);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
}

// create user
export const createUser = async (req: Request, res: Response) => {
  const {
    name,
    username,
    email,
    password
  } = req.body;

  try {
    const result = await insertUser({ name, username, email, password });
    res.status(201).json(result);
  } catch (error: any) {
    if (error.message === 'Username or Email already exists') {
      res.status(409).send({ message: error.message });
    } else {
      res.status(500).send({ message: "Internal server error", error });
    }
  }
}

// update user
export const updateUser = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const { name, username, email, bio, avatarUrl } = req.body;

  try {
    const updatedUser = await updateUserById(id, { name, username, email, bio, avatarUrl });
    res.status(200).json(updatedUser);
  } catch (error: any) {
    if (error.message === 'Username or Email already exists') {
      res.status(409).send({ message: error.message });
    } else {
      res.status(500).send({ message: "Internal server error", error });
    }
  }
}

// delete user
export const deleteUser = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  try {
    await deleteUserById(id);
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
}