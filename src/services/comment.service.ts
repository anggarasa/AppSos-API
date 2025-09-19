import prisma from "../config/db";
import notificationService from "./notification.service";
import { PaginationParams, PaginationResult, createPaginationResult } from "../utils/pagination";

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

        // Create notification for the post author
        try {
            await notificationService.createCommentNotification(createComment.id, userId);
        } catch (notificationError) {
            console.error('Error creating comment notification:', notificationError);
            // Don't throw error here, just log it
        }

        return createComment;
    } catch (error) {
        throw error;
    }
}

// get comments by post with pagination
export const findCommentsByPostId = async (postId: string, pagination: PaginationParams): Promise<PaginationResult<any>> => {
  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: { postId },
      select: {
        id: true,
        authorId: true,
        postId: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
      skip: pagination.offset,
      take: pagination.limit,
      orderBy: { createdAt: 'asc' },
    }),
    prisma.comment.count({ where: { postId } }),
  ]);

  return createPaginationResult(comments, total, pagination.page, pagination.limit);
};

// get comments by user with pagination
export const findCommentsByUserId = async (userId: string, pagination: PaginationParams): Promise<PaginationResult<any>> => {
  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: { authorId: userId },
      select: {
        id: true,
        authorId: true,
        postId: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        post: {
          select: {
            id: true,
            content: true,
            imageUrl: true,
            author: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      skip: pagination.offset,
      take: pagination.limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.comment.count({ where: { authorId: userId } }),
  ]);

  return createPaginationResult(comments, total, pagination.page, pagination.limit);
};

// update comment
export const updateCommentById = async (
  id: string,
  userId: string,
  content: string
) => {
  try {
    const existingComment = await prisma.comment.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!existingComment) {
      throw new Error('Comment not found');
    }

    if (existingComment.authorId !== userId) {
      throw new Error('Unauthorized to update this comment');
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
      select: {
        id: true,
        authorId: true,
        postId: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    return updatedComment;
  } catch (error: any) {
    throw error;
  }
};

// get comment by id
export const findCommentById = (id: string) =>
  prisma.comment.findUnique({
    where: { id },
    select: {
      id: true,
      authorId: true,
      postId: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
      post: {
        select: {
          id: true,
          content: true,
          imageUrl: true,
          author: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });

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