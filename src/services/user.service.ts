import prisma from "../config/db";
import { supabase } from "../config/supabase";
import { randomUUID } from "crypto";

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


// update user by id
export const updateUserById = async (
  id: string,
  data: {
    name?: string,
    email?: string,
    username?: string,
    bio?: string,
    avatar?: Express.Multer.File,
  }
) => {
  try {
    // Updating user
    
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

    // Prepare update payload
    const updatePayload: any = {};
    
    // Only update fields that are provided
    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.email !== undefined) updatePayload.email = data.email;
    if (data.username !== undefined) updatePayload.username = data.username;
    if (data.bio !== undefined) updatePayload.bio = data.bio;

    // Handle avatar upload to Supabase Storage if provided
    if (data.avatar) {
      // Process avatar upload
      const bucket = 'avatars';
      const fileExt = (data.avatar.originalname.split('.').pop() || 'jpg').toLowerCase();
      const fileName = `${randomUUID()}.${fileExt}`;
      const filePath = `${id}/${fileName}`;

      // Upload new avatar
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from(bucket)
        .upload(filePath, data.avatar.buffer, {
          contentType: data.avatar.mimetype,
          upsert: true, // Changed to true to overwrite if exists
        });

      if (uploadError) {
        throw new Error(`Failed to upload avatar: ${uploadError.message}`);
      }

      // Get public URL
      const { data: publicUrlData } = supabase
        .storage
        .from(bucket)
        .getPublicUrl(filePath);

      // Clean up previous avatar if exists
      if (existingUser.avatarUrl) {
        try {
          const publicUrlPrefix = `/storage/v1/object/public/${bucket}/`;
          const idx = existingUser.avatarUrl.indexOf(publicUrlPrefix);
          if (idx !== -1) {
            const previousPath = existingUser.avatarUrl.substring(idx + publicUrlPrefix.length);
            await supabase.storage.from(bucket).remove([previousPath]);
          }
        } catch (_) {
          // ignore cleanup failures
        }
      }

      updatePayload.avatarUrl = publicUrlData.publicUrl;
    }

    // Update user in database
    const updatedUser = await prisma.user.update({ 
      where: { id }, 
      data: updatePayload,
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

  } catch (error: any) {
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