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