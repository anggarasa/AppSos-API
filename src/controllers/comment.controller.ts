import { Request, Response } from "express"
import { deleteCommentById, insertComment, findCommentsByPostId, findCommentsByUserId, updateCommentById, findCommentById } from "../services/comment.service";
import { parsePaginationParams } from "../utils/pagination";

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

// get comments by post with pagination
export const getCommentsByPost = async (req: Request, res: Response) => {
    const postId: string = req.params.postId;

    try {
        const pagination = parsePaginationParams(req.query);
        const result = await findCommentsByPostId(postId, pagination);
        return res.status(200).json({
            status: 200,
            message: "Comments retrieved successfully",
            data: result.data,
            pagination: result.pagination
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: []
        });
    }
}

// get comments by user with pagination
export const getCommentsByUser = async (req: Request, res: Response) => {
    const userId: string = req.params.userId;

    try {
        const pagination = parsePaginationParams(req.query);
        const result = await findCommentsByUserId(userId, pagination);
        return res.status(200).json({
            status: 200,
            message: "User comments retrieved successfully",
            data: result.data,
            pagination: result.pagination
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: []
        });
    }
}

// get comment by id
export const getComment = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    try {
        const comment = await findCommentById(id);
        if (!comment) {
            return res.status(404).json({
                status: 404,
                message: "Comment not found"
            });
        }
        return res.status(200).json({
            status: 200,
            message: "Comment retrieved successfully",
            data: comment
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: {}
        });
    }
}

// update comment
export const updateComment = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const { userId, content } = req.body;

    try {
        const result = await updateCommentById(id, userId, content);
        return res.status(200).json({
            status: 200,
            message: "Comment updated successfully",
            data: result
        });
    } catch (error: any) {
        if (error.message === 'Comment not found') {
            return res.status(404).json({
                status: 404,
                message: error.message,
                data: {}
            });
        } else if (error.message === 'Unauthorized to update this comment') {
            return res.status(403).json({
                status: 403,
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