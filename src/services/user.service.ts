import prisma from "../config/db";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'; ``

// find all users
export const findAllUsers = () => prisma.user.findMany();

// find user by username
export const findUserByUsername = (username: string) => prisma.user.findUnique({ where: { username } });

// create new user
export const insertUser = async (
  data: {
    name: string,
    username: string,
    email: string,
    password: string,
  }
) => {
  try {
    const existingUsername = await prisma.user.findUnique({ where: { username: data.username } })
    const existingEmail = await prisma.user.findUnique({ where: { email: data.email } })

    if (existingEmail || existingUsername) {
      throw new Error('Username or Email already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        username: data.username,
        password: passwordHash,
      }
    });

    // generate token
    const token = jwt.sign(
      {
        userId: newUser.id,
        username: newUser.username,
      },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
      },
      token
    }

  } catch (error) {
    throw error;
  }
}

// update user by username
export const updateUserById = (
  id: string,
  data: {
    name?: string,
    email?: string,
    username?: string,
    bio?: string,
    avatarUrl?: string,
  }
) => prisma.user.update({ where: { id }, data });

// delete user
export const deleteUserById = (id: string) => prisma.user.delete({ where: { id } });