import { error } from "console";
import prisma from "../config/db"
import { CallTracker } from "assert";
import { threadCpuUsage } from "process";

export const insertSave = async (userId: string, postId: string) => {
    try {
        const existingUser = await prisma.user.findUnique({where: {id: userId}});
        const existingPost = await prisma.post.findUnique({where: {id: postId}});

        if (!existingPost) {
            throw new Error('Post not found');
        }

        if (!existingUser) {
            throw new Error('User not found');
        }

        const createSave = await prisma.save.create({
            data: {
                userId: userId,
                postId: postId
            }
        });

        return createSave;
    } catch (error) {
        throw error;
    }
}

// get saved posts by user
export const findSavedPostsByUserId = (userId: string) =>
  prisma.save.findMany({
    where: { userId },
    select: {
      id: true,
      createdAt: true,
      post: {
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
              avatarUrl: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
              saves: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

// check if user has saved a post
export const hasUserSavedPost = async (userId: string, postId: string): Promise<boolean> => {
  try {
    const save = await prisma.save.findFirst({
      where: {
        userId,
        postId,
      },
    });
    return !!save;
  } catch (error) {
    throw error;
  }
};

// get save count for a post
export const getSaveCount = async (postId: string): Promise<number> => {
  try {
    const count = await prisma.save.count({
      where: { postId },
    });
    return count;
  } catch (error) {
    throw error;
  }
};

// get save by id
export const findSaveById = (id: string) =>
  prisma.save.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      postId: true,
      createdAt: true,
      user: {
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

export const deleteSaveByUserIdAndPostId = async (userId: string, postId: string) => {
    try {
        const existingSave = await prisma.save.findFirst({
            where: {
                userId: userId,
                postId: postId
            }
        });

        if (!existingSave) {
            throw new Error('Save not found');
        }

        await prisma.save.delete({
            where: {id: existingSave.id}
        });

        return {
            status: 200,
            message: "Save deleted successfully"
        }
    } catch (error) {
        throw error;
    }
}