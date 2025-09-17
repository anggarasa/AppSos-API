import { Request, Response } from "express";
import { deleteSaveByUserIdAndPostId, insertSave } from "../services/save.service";
import { STATUS_CODES } from "http";

export const savePost = async (req: Request, res: Response) => {
    const {userId, postId} = req.body;

    try {
        const result = await insertSave(userId, postId);
        return res.status(201).json({
            status: 201,
            message: "Save post successfully",
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

export const unSave = async (req: Request, res: Response) => {
    const {userId, postId} = req.body;

    try {
        const result = await deleteSaveByUserIdAndPostId(userId, postId);
        return res.status(200).json(result);
    } catch (error: any) {
        if (error.message === 'Save not found') {
            return res.status(404).json({
                status: 404,
                message: error.message
            });
        } else {
            return res.status(500).json({
                status: 500,
                message: "Internal server error"
            });
        }
    }
}