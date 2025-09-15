import { Request, Response } from "express";
import { deletePostById, findPostAll, findPostById, insertPost } from "../services/post.service";
import { stat } from "fs";

// get posts
export const getPosts = async (_: Request, res: Response) => {
    try {
        const posts = await findPostAll();
        return res.status(200).json({
            status: 200,
            message: "Success",
            data: posts
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
    const {content, imageUrl, id} = req.body;

    try {
        const result = await insertPost(id, {content, imageUrl});
        return res.status(201).json({
            status: 201,
            message: result
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: {}
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