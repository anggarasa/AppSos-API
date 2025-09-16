import { Request, Response } from "express";
import { deleteLikeById, insertLike } from "../services/like.service";

export const createLike = async (req: Request, res: Response) => {
    const { userId, postId } = req.body;

    try {
        const result = await insertLike(userId, postId);
        return res.status(201).json({
            status: 201,
            message: "Like created successfully",
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
        } else if (error.message === "User or Post already exists") {
            return res.status(409).json({
                status: 409,
                message: error.message,
                data: {}
            })
        } else {
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
                data: {}
            });
        }
    }
}

export const deleteLike = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    try {
        const result = await deleteLikeById(id);
        return res.status(200).json(result);
    } catch (error: any) {
        if (error.message === 'Like not found') {
            return res.status(404).json({
                status: 404,
                message: error.message,
            });
        } else {
            return res.status(500).json({
                status: 500,
                message: "Internal server error"
            })
        }
    }
}