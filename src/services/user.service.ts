import prisma from "../config/db";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'; ``

// find all users
export const findAllUsers = () => prisma.user.findMany({
  select: {
    id: true,
    name: true,
    username: true,
    email: true,
    bio: true,
    avatarUrl: true,
    createdAt: true,
    updatedAt: true
  }
});

// find user by username
export const findUserById = (id: string) => prisma.user.findUnique({ 
  where: { id },
  select: {
    id: true,
    name: true,
    username: true,
    email: true,
    bio: true,
    avatarUrl: true,
    createdAt: true,
    updatedAt: true
  }
});

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
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
      },
    }

  } catch (error) {
    throw error;
  }
}

// update user by id
export const updateUserById = async (
  id: string,
  data: {
    name?: string,
    email?: string,
    username?: string,
    bio?: string,
    avatarUrl?: string,
  }
) => {
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Check for duplicate username if username is being updated
    if (data.username && data.username !== existingUser.username) {
      const existingUsername = await prisma.user.findUnique({ 
        where: { username: data.username } 
      });
      if (existingUsername) {
        throw new Error('Username already exists');
      }
    }

    // Check for duplicate email if email is being updated
    if (data.email && data.email !== existingUser.email) {
      const existingEmail = await prisma.user.findUnique({ 
        where: { email: data.email } 
      });
      if (existingEmail) {
        throw new Error('Email already exists');
      }
    }

    const updatedUser = await prisma.user.update({ 
      where: { id }, 
      data,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return updatedUser;
  } catch (error) {
    throw error;
  }
};

// delete user
export const deleteUserById = async (id: string) => {
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new Error('User not found');
    }

    await prisma.user.delete({ where: { id } });
    return {
      status: 200,
      message: 'User deleted successfully'
    };
  } catch (error) {
    throw error;
  }
};