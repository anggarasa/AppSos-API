import prisma from "../config/db";

// create comment
export const insertComment = async (
    userId: string,
    postId: string,
    content: string
) => {
    try {
        const existingPost = await prisma.post.findUnique({where: {id: postId}});
        const existingUser = await prisma.user.findUnique({where: {id: userId}});

        if (!existingPost) {
            throw new Error('Post not found');
        }
        if (!existingUser) {
            throw new Error('User not found');
        }

        const createComment = await prisma.comment.create({
            data: {
                authorId: userId,
                postId: postId,
                content: content,
            },
            select: {
                id: true,
                authorId: true,
                postId: true,
                content: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                    }
                },
            }
        });

        return createComment;
    } catch (error) {
        throw error;
    }
}

// delete comment
export const deleteCommentById = async (id: string) => {
    try {
        const existingComment = await prisma.comment.findUnique({
            where: {id}
        })
        if (!existingComment) {
            throw new Error('Comment not found');
        }


        await prisma.comment.delete({where: {id}});

        return {
            status: 200,
            message: 'Comment deleted successfully'
        };
    } catch (error) {
        throw error;
    }
}