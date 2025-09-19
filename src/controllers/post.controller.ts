import { Request, Response } from "express";
import { deletePostById, findPostAll, findPostById, insertPost, updatePostById, findPostsByUserId, findSavedPostsByUserId } from "../services/post.service";
import { parsePaginationParams } from "../utils/pagination";

// get posts with pagination
export const getPosts = async (req: Request, res: Response) => {
    try {
        const pagination = parsePaginationParams(req.query);
        const result = await findPostAll(pagination);
        return res.status(200).json({
            status: 200,
            message: "Success",
            data: result.data,
            pagination: result.pagination
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            data: []
        });
    }
}

// get post by id
export const getPost = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    try {
        const post = await findPostById(id);
        if (!post) {
            return res.status(404).json({
                status: 404,
                message: "Post not found"
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Success",
            data: post
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: {}
        });
    }
}

// create post
export const createPost = async (req: Request, res: Response) => {
    const { userId, content } = req.body;
    const imageFile = req.file as Express.Multer.File | undefined;

    try {
        const result = await insertPost(userId, { content, imageFile });
        return res.status(201).json({
            status: 201,
            message: "Post created successfully",
            data: result
        });
    } catch (error: any) {
        if (error.message === 'User not found') {
            return res.status(404).json({
                status: 404,
                message: error.message,
                data: {}
            });
        }
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: {}
        });
    }
}

// update post
export const updatePost = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const { userId, content } = req.body;
    const imageFile = req.file as Express.Multer.File | undefined;

    try {
        const result = await updatePostById(id, userId, { content, imageFile });
        return res.status(200).json({
            status: 200,
            message: "Post updated successfully",
            data: result
        });
    } catch (error: any) {
        if (error.message === 'Post not found') {
            return res.status(404).json({
                status: 404,
                message: error.message,
                data: {}
            });
        } else if (error.message === 'Unauthorized to update this post') {
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

// get posts by user with pagination
export const getPostsByUser = async (req: Request, res: Response) => {
    const userId: string = req.params.userId;

    try {
        const pagination = parsePaginationParams(req.query);
        const result = await findPostsByUserId(userId, pagination);
        return res.status(200).json({
            status: 200,
            message: "User posts retrieved successfully",
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

// get saved posts by user with pagination
export const getSavedPostsByUser = async (req: Request, res: Response) => {
    const userId: string = req.params.userId;

    try {
        const pagination = parsePaginationParams(req.query);
        const result = await findSavedPostsByUserId(userId, pagination);
        return res.status(200).json({
            status: 200,
            message: "Saved posts retrieved successfully",
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

// delete post
export const deletePost = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    try {
        const result = await deletePostById(id);
        return res.status(200).json(result);
    } catch (error: any) {
        if(error.message === 'Post not found') {
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