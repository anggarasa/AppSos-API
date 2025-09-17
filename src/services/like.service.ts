// service file - FIXED VERSION
import prisma from "../config/db"

export const insertLike = async (
    userId: string,
    postId: string
) => {
    try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        });
        
        // Check if post exists
        const existingPost = await prisma.post.findUnique({
            where: { id: postId }
        });

        if (!existingUser) {
            throw new Error('User not found');
        }
        
        if (!existingPost) {
            throw new Error('Post not found');
        }

        // Check if user already liked this post
        const existingLike = await prisma.like.findFirst({
            where: {
                userId: userId,
                postId: postId
            }
        });

        if (existingLike) {
            throw new Error('User already liked this post');
        }

        const createLike = await prisma.like.create({
            data: {
                postId: postId,
                userId: userId
            }
        });

        return createLike;
    } catch (error) {
        throw error;
    }
}

export const deleteLikeById = async (id: string) => {
    try {
        const existingLike = await prisma.like.findUnique({
            where: { id: id }
        });

        if (!existingLike) {
            throw new Error('Like not found');
        }

        await prisma.like.delete({ 
            where: { id } 
        });

        return {
            status: 200,
            message: "Like deleted successfully",
            data: {}
        }
    } catch (error) {
        throw error;
    }
}

// Alternative: Delete like by userId and postId (more practical)
export const deleteLikeByUserAndPost = async (
    userId: string, 
    postId: string
) => {
    try {
        const existingLike = await prisma.like.findFirst({
            where: {
                userId: userId,
                postId: postId
            }
        });

        if (!existingLike) {
            throw new Error('Like not found');
        }

        await prisma.like.delete({
            where: { id: existingLike.id }
        });

        return {
            status: 200,
            message: "Like deleted successfully",
            data: {}
        }
    } catch (error) {
        throw error;
    }
}

// Get like count for a post
export const getLikeCount = async (postId: string) => {
    try {
        const count = await prisma.like.count({
            where: { postId: postId }
        });

        return count;
    } catch (error) {
        throw error;
    }
}

// Check if user has liked a post
export const hasUserLikedPost = async (userId: string, postId: string) => {
    try {
        const like = await prisma.like.findFirst({
            where: {
                userId: userId,
                postId: postId
            }
        });

        return !!like; // return boolean
    } catch (error) {
        throw error;
    }
}