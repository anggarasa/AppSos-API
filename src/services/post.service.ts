import { error } from "console";
import prisma from "../config/db";
import { randomUUID } from "crypto";
import { supabase } from "../config/supabase";
import { create } from "domain";
import { stat } from "fs";

// find all posts
export const findPostAll =  () => prisma.post.findMany({
    select: {
        id: true,
        authorId: true,
        content: true,
        imageUrl: true,
        createdAt: true,
        author: {
            select: {
                id: true,
                username: true,
                avatarUrl: true
            }
        }
    }
});

// find post by id
export const findPostById = (id: string) => prisma.post.findUnique({
    where: {id},
    select: {
        id: true,
        authorId: true,
        content: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
        author: {
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                avatarUrl: true
            }
        }
    }
});

// create post
export const insertPost = async (
    id: string,
    data: {
        content: string,
        imageUrl?: Express.Multer.File,
    }
) => {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { id }
        });
        if(!existingUser) {
            throw new Error('User not found');
        }

        const createPayload: any = {};

        if (data.content !== undefined) createPayload.content = data.content;
        if (data.imageUrl !== undefined) createPayload.imageUrl = data.imageUrl;

        // handle imageurl untuk di simpan ke storage
        if (data.imageUrl) {
            const bucket = 'post_images';
            const fileExt = (data.imageUrl.originalname.split('.').pop() || 'jpg').toLocaleLowerCase();
            const fileName = `${randomUUID()}.${fileExt}`;
            const filePath = `${id}/${fileName}`;

            // upload new post image
            const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from(bucket)
            .upload(filePath, data.imageUrl.buffer, {
            contentType: data.imageUrl.mimetype,
            upsert: true,
            });

            if (uploadError) {
                throw new Error(`Failed to upload avatar: ${uploadError.message}`);
            }

            // Get public URL
            const { data: publicUrlData } = supabase
            .storage
            .from(bucket)
            .getPublicUrl(filePath);

            createPayload.imageUrl = publicUrlData.publicUrl;
        }

        const createPost = await prisma.post.create({
            data: {
                authorId: id,
                content: createPayload.content,
                imageUrl: createPayload.imageUrl
            }
        });

        return createPost;
    } catch (error: any) {
        throw error;
    }
}


// delete post
export const deletePostById = async (id: string) => {
    try {
        const existingPost = await prisma.post.findUnique({where: {id}});
        if(!existingPost) {
            throw new Error('Post not found');
        }

        // Clean up previous imageUrl if exists
      if (existingPost.imageUrl) {
        try {
          const publicUrlPrefix = `/storage/v1/object/public/post_images/`;
          const idx = existingPost.imageUrl.indexOf(publicUrlPrefix);
          if (idx !== -1) {
            const previousPath = existingPost.imageUrl.substring(idx + publicUrlPrefix.length);
            await supabase.storage.from('post_images').remove([previousPath]);
          }
        } catch (_) {
          // ignore cleanup failures
        }
      }

        await prisma.post.delete({
            where: {id}
        });

        return {
            status: 200,
            message: 'Post delete successfully'
        };
    } catch (error) {
        throw error;
    }
}