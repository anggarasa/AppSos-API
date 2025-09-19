"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostById = exports.insertPost = exports.findPostById = exports.findPostAll = void 0;
const db_1 = __importDefault(require("../config/db"));
const crypto_1 = require("crypto");
const supabase_1 = require("../config/supabase");
const findPostAll = () => db_1.default.post.findMany({
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
});
exports.findPostAll = findPostAll;
const findPostById = (id) => db_1.default.post.findUnique({
    where: { id },
    select: {
        id: true,
        authorId: true,
        content: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
        author: {
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                avatarUrl: true,
            },
        },
        comments: {
            select: {
                id: true,
                content: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true,
                    },
                },
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
});
exports.findPostById = findPostById;
const insertPost = async (userId, data) => {
    try {
        const existingUser = await db_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!existingUser) {
            throw new Error("User not found");
        }
        const createPayload = {
            content: data.content,
        };
        if (data.imageFile) {
            const bucket = "post_images";
            const fileExt = (data.imageFile.originalname.split(".").pop() || "jpg").toLowerCase();
            const fileName = `${(0, crypto_1.randomUUID)()}.${fileExt}`;
            const filePath = `${userId}/${fileName}`;
            const { data: uploadData, error: uploadError } = await supabase_1.supabase.storage
                .from(bucket)
                .upload(filePath, data.imageFile.buffer, {
                contentType: data.imageFile.mimetype,
                upsert: true,
            });
            if (uploadError) {
                throw new Error(`Failed to upload image: ${uploadError.message}`);
            }
            const { data: publicUrlData } = supabase_1.supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);
            createPayload.imageUrl = publicUrlData.publicUrl;
        }
        const createPost = await db_1.default.post.create({
            data: {
                authorId: userId,
                content: createPayload.content,
                imageUrl: createPayload.imageUrl,
            },
        });
        return createPost;
    }
    catch (error) {
        throw error;
    }
};
exports.insertPost = insertPost;
const deletePostById = async (id) => {
    try {
        const existingPost = await db_1.default.post.findUnique({ where: { id } });
        if (!existingPost) {
            throw new Error("Post not found");
        }
        if (existingPost.imageUrl) {
            try {
                const publicUrlPrefix = `/storage/v1/object/public/post_images/`;
                const idx = existingPost.imageUrl.indexOf(publicUrlPrefix);
                if (idx !== -1) {
                    const previousPath = existingPost.imageUrl.substring(idx + publicUrlPrefix.length);
                    await supabase_1.supabase.storage.from("post_images").remove([previousPath]);
                }
            }
            catch (error) {
                console.error("Failed to delete image from storage:", error);
            }
        }
        await db_1.default.post.delete({
            where: { id },
        });
        return {
            status: 200,
            message: "Post deleted successfully",
        };
    }
    catch (error) {
        throw error;
    }
};
exports.deletePostById = deletePostById;
//# sourceMappingURL=post.service.js.map