import { Request, Response } from "express";
import { deleteSaveByUserIdAndPostId, insertSave, findSavedPostsByUserId, hasUserSavedPost, getSaveCount, findSaveById } from "../services/save.service";

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

// get saved posts by user
export const getSavedPostsByUser = async (req: Request, res: Response) => {
    const userId: string = req.params.userId;

    try {
        const savedPosts = await findSavedPostsByUserId(userId);
        return res.status(200).json({
            status: 200,
            message: "Saved posts retrieved successfully",
            data: savedPosts
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: []
        });
    }
}

// check if user has saved a post
export const checkUserSave = async (req: Request, res: Response) => {
    const { userId, postId } = req.params;

    try {
        const hasSaved = await hasUserSavedPost(userId, postId);
        return res.status(200).json({
            status: 200,
            message: "User save status retrieved successfully",
            data: { hasSaved }
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: {}
        });
    }
}

// get save count for a post
export const getPostSaveCount = async (req: Request, res: Response) => {
    const postId: string = req.params.postId;

    try {
        const count = await getSaveCount(postId);
        return res.status(200).json({
            status: 200,
            message: "Save count retrieved successfully",
            data: { saveCount: count }
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: {}
        });
    }
}

// get save by id
export const getSave = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    try {
        const save = await findSaveById(id);
        if (!save) {
            return res.status(404).json({
                status: 404,
                message: "Save not found"
            });
        }
        return res.status(200).json({
            status: 200,
            message: "Save retrieved successfully",
            data: save
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: {}
        });
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