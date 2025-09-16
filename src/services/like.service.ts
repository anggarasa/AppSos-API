import prisma from "../config/db"

export const insertLike = async (
    userId: string,
    postId: string
) => {
    try {
        const existingPost = await prisma.post.findUnique({
            where: {id: postId}
        });
        const existingUser = await prisma.user.findUnique({
            where: {id: userId}
        });
        if (existingUser || existingPost) {
            throw new Error('User or Post already exists');
        }
        if (!existingUser) {
            throw new Error('User not found');
        }
        if (!existingPost) {
            throw new Error('Post not found');
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
            where: {id: id}
        });

        if (!existingLike) {
            throw new Error('Like not found');
        }

        await prisma.like.delete({where: {id}})

        return {
            status: 200,
            message: "Like deleted successfully"
        }
    } catch (error) {
        throw error;
    }
}