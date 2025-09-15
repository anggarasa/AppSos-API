"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserById = exports.updateUserById = exports.findUserById = exports.findAllUsers = void 0;
const db_1 = __importDefault(require("../config/db"));
const supabase_1 = require("../config/supabase");
const crypto_1 = require("crypto");
const findAllUsers = () => db_1.default.user.findMany({
    select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true
    }
});
exports.findAllUsers = findAllUsers;
const findUserById = (id) => db_1.default.user.findUnique({
    where: { id },
    select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true
    }
});
exports.findUserById = findUserById;
const updateUserById = async (id, data) => {
    try {
        console.log('Updating user with ID:', id);
        const existingUser = await db_1.default.user.findUnique({ where: { id } });
        if (!existingUser) {
            throw new Error('User not found');
        }
        console.log('Existing user found:', existingUser.username);
        if (data.username && data.username !== existingUser.username) {
            const existingUsername = await db_1.default.user.findUnique({
                where: { username: data.username }
            });
            if (existingUsername) {
                throw new Error('Username already exists');
            }
        }
        if (data.email && data.email !== existingUser.email) {
            const existingEmail = await db_1.default.user.findUnique({
                where: { email: data.email }
            });
            if (existingEmail) {
                throw new Error('Email already exists');
            }
        }
        const updatePayload = {};
        if (data.name !== undefined)
            updatePayload.name = data.name;
        if (data.email !== undefined)
            updatePayload.email = data.email;
        if (data.username !== undefined)
            updatePayload.username = data.username;
        if (data.bio !== undefined)
            updatePayload.bio = data.bio;
        if (data.avatar) {
            console.log('Processing avatar upload...');
            const bucket = 'avatars';
            const fileExt = (data.avatar.originalname.split('.').pop() || 'jpg').toLowerCase();
            const fileName = `${(0, crypto_1.randomUUID)()}.${fileExt}`;
            const filePath = `${id}/${fileName}`;
            console.log('Uploading to path:', filePath);
            console.log('File info:', {
                originalname: data.avatar.originalname,
                mimetype: data.avatar.mimetype,
                size: data.avatar.buffer.length
            });
            const { data: uploadData, error: uploadError } = await supabase_1.supabase
                .storage
                .from(bucket)
                .upload(filePath, data.avatar.buffer, {
                contentType: data.avatar.mimetype,
                upsert: true,
            });
            if (uploadError) {
                console.error('Supabase upload error:', uploadError);
                throw new Error(`Failed to upload avatar: ${uploadError.message}`);
            }
            console.log('Upload successful:', uploadData);
            const { data: publicUrlData } = supabase_1.supabase
                .storage
                .from(bucket)
                .getPublicUrl(filePath);
            console.log('Public URL:', publicUrlData.publicUrl);
            if (existingUser.avatarUrl) {
                try {
                    const publicUrlPrefix = `/storage/v1/object/public/${bucket}/`;
                    const idx = existingUser.avatarUrl.indexOf(publicUrlPrefix);
                    if (idx !== -1) {
                        const previousPath = existingUser.avatarUrl.substring(idx + publicUrlPrefix.length);
                        console.log('Removing previous avatar:', previousPath);
                        await supabase_1.supabase.storage.from(bucket).remove([previousPath]);
                    }
                }
                catch (cleanupError) {
                    console.warn('Failed to cleanup previous avatar:', cleanupError);
                }
            }
            updatePayload.avatarUrl = publicUrlData.publicUrl;
        }
        console.log('Update payload:', updatePayload);
        const updatedUser = await db_1.default.user.update({
            where: { id },
            data: updatePayload,
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                bio: true,
                avatarUrl: true,
                createdAt: true,
                updatedAt: true
            }
        });
        console.log('User updated successfully:', updatedUser.id);
        return updatedUser;
    }
    catch (error) {
        console.error('UpdateUserById error:', error);
        throw error;
    }
};
exports.updateUserById = updateUserById;
const deleteUserById = async (id) => {
    try {
        const existingUser = await db_1.default.user.findUnique({ where: { id } });
        if (!existingUser) {
            throw new Error('User not found');
        }
        await db_1.default.user.delete({ where: { id } });
        return {
            status: 200,
            message: 'User deleted successfully'
        };
    }
    catch (error) {
        throw error;
    }
};
exports.deleteUserById = deleteUserById;
//# sourceMappingURL=user.service.js.map