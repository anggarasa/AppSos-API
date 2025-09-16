import { Request, Response } from "express"
import { deleteCommentById, insertComment } from "../services/comment.service";

// create comment
export const createComment = async (req: Request, res: Response) => {
    const {userId, postId, content} = req.body;

    try {
        const result = await insertComment(userId, postId, content);
        return res.status(201).json({
            status: 201,
            message: "Comment created successfully",
            data: result
        });
    } catch (error: any) {
        if (error.message === 'User not found') {
            return res.status(404).json({
                status: 404,
                message: error.message,
                data: {}
            });
        } else if (error.message === 'Post not found') {
            return res.status(404).json({
                status: 404,
                message: error.message,
                data: {}
            });
        } else {
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
                data: {}
            });
        }
    }
}

// delete comment
export const deleteComment = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    try {
        const result = await deleteCommentById(id);
        return res.status(200).json(result);
    } catch (error: any) {
        if (error.message === 'Comment not found') {
            return res.status(404).json({
                status: 404,
                message: error.message,
            });
        } else {
            return res.status(500).json({
                status: 500,
                message: "Internal server error"
            });
        }
    }
}