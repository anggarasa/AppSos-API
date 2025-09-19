import prisma from "../config/db";
import bcrypt from "bcryptjs";
import { generateTokenPair, verifyRefreshToken } from "../utils/tokenUtils";

// Register new user
export const registerUser = async (
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

    // generate tokens
    const { accessToken, refreshToken } = generateTokenPair(newUser.id, newUser.username);

    return {
      accessToken,
      refreshToken,
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

// Login user
export const loginUser = async (
  data: {
    username: string,
    password: string,
  }
) => {
  try {
    // Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: data.username },
          { email: data.username }
        ]
      }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokenPair(user.id, user.username);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
      },
    }

  } catch (error) {
    throw error;
  }
}

// Refresh access token
export const refreshAccessToken = async (refreshToken: string) => {
  try {
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    if (!decoded) {
      throw new Error('Invalid refresh token');
    }

    // Get user from database to ensure user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        bio: true,
        avatarUrl: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Generate new access token
    const { accessToken } = generateTokenPair(user.id, user.username);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
      },
    };

  } catch (error) {
    throw error;
  }
}
