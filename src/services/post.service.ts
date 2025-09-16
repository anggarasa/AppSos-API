import prisma from "../config/db";
import { randomUUID } from "crypto";
import { supabase } from "../config/supabase";

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
        },
        _count: {
            select: {
                comments: true
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
        },
        comments: {
            select: {
                id: true,
                content: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true
                    }
                }
            }
        }
    }
});

// create post
export const insertPost = async (
    userId: string,
    data: {
        content: string,
        imageFile?: Express.Multer.File,
    }
) => {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        });
        if(!existingUser) {
            throw new Error('User not found');
        }

        const createPayload: any = {
            content: data.content
        };

        // handle image file upload to storage
        if (data.imageFile) {
            const bucket = 'post_images';
            const fileExt = (data.imageFile.originalname.split('.').pop() || 'jpg').toLowerCase();
            const fileName = `${randomUUID()}.${fileExt}`;
            const filePath = `${userId}/${fileName}`;

            // upload new post image
            const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from(bucket)
            .upload(filePath, data.imageFile.buffer, {
            contentType: data.imageFile.mimetype,
            upsert: true,
            });

            if (uploadError) {
                throw new Error(`Failed to upload image: ${uploadError.message}`);
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
                authorId: userId,
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

        // Clean up image from storage if exists
        if (existingPost.imageUrl) {
            try {
                const publicUrlPrefix = `/storage/v1/object/public/post_images/`;
                const idx = existingPost.imageUrl.indexOf(publicUrlPrefix);
                if (idx !== -1) {
                    const previousPath = existingPost.imageUrl.substring(idx + publicUrlPrefix.length);
                    await supabase.storage.from('post_images').remove([previousPath]);
                }
            } catch (error) {
                // Log error but don't fail the deletion
                console.error('Failed to delete image from storage:', error);
            }
        }

        await prisma.post.delete({
            where: {id}
        });

        return {
            status: 200,
            message: 'Post deleted successfully'
        };
    } catch (error) {
        throw error;
    }
}