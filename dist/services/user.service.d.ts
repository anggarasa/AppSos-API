import { PaginationParams, PaginationResult } from "../utils/pagination";
export declare const findAllUsers: (pagination: PaginationParams) => Promise<PaginationResult<any>>;
export declare const findUserById: (id: string) => import("../../generated/prisma").Prisma.Prisma__UserClient<{
    name: string;
    id: string;
    email: string;
    username: string;
    bio: string | null;
    avatarUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
} | null, null, import("../../generated/prisma/runtime/library").DefaultArgs, import("../../generated/prisma").Prisma.PrismaClientOptions>;
export declare const updateUserById: (id: string, data: {
    name?: string;
    email?: string;
    username?: string;
    bio?: string;
    avatar?: Express.Multer.File;
}) => Promise<{
    name: string;
    id: string;
    email: string;
    username: string;
    bio: string | null;
    avatarUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const findUserProfileWithStats: (id: string) => import("../../generated/prisma").Prisma.Prisma__UserClient<{
    name: string;
    id: string;
    email: string;
    username: string;
    bio: string | null;
    avatarUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: {
        comments: number;
        likes: number;
        saves: number;
        posts: number;
        following: number;
        followers: number;
    };
} | null, null, import("../../generated/prisma/runtime/library").DefaultArgs, import("../../generated/prisma").Prisma.PrismaClientOptions>;
export declare const findUserByUsername: (username: string) => import("../../generated/prisma").Prisma.Prisma__UserClient<{
    name: string;
    id: string;
    email: string;
    username: string;
    bio: string | null;
    avatarUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: {
        posts: number;
        following: number;
        followers: number;
    };
} | null, null, import("../../generated/prisma/runtime/library").DefaultArgs, import("../../generated/prisma").Prisma.PrismaClientOptions>;
export declare const searchUsers: (query: string, pagination: PaginationParams) => Promise<PaginationResult<any>>;
export declare const getUserPostsCount: (userId: string) => Promise<number>;
export declare const getUserFollowersCount: (userId: string) => Promise<number>;
export declare const getUserFollowingCount: (userId: string) => Promise<number>;
export declare const getUserActivity: (userId: string, pagination: PaginationParams) => Promise<PaginationResult<{
    type: string;
    id: string;
    createdAt: Date;
    content: string;
    imageUrl: string | null;
    _count: {
        comments: number;
        likes: number;
        saves: number;
    };
} | {
    type: string;
    id: string;
    createdAt: Date;
    post: {
        id: string;
        content: string;
        imageUrl: string | null;
    };
    content: string;
} | {
    type: string;
    id: string;
    createdAt: Date;
    post: {
        id: string;
        content: string;
        imageUrl: string | null;
        author: {
            id: string;
            username: string;
            avatarUrl: string | null;
        };
    };
}>>;
export declare const deleteUserById: (id: string) => Promise<{
    status: number;
    message: string;
}>;
//# sourceMappingURL=user.service.d.ts.map