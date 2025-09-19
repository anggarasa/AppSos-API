export declare const insertSave: (userId: string, postId: string) => Promise<{
    id: string;
    createdAt: Date;
    postId: string;
    userId: string;
}>;
export declare const findSavedPostsByUserId: (userId: string) => import("../../generated/prisma").Prisma.PrismaPromise<{
    id: string;
    createdAt: Date;
    post: {
        id: string;
        createdAt: Date;
        authorId: string;
        content: string;
        imageUrl: string | null;
        author: {
            id: string;
            username: string;
            avatarUrl: string | null;
        };
        _count: {
            comments: number;
            likes: number;
            saves: number;
        };
    };
}[]>;
export declare const hasUserSavedPost: (userId: string, postId: string) => Promise<boolean>;
export declare const getSaveCount: (postId: string) => Promise<number>;
export declare const findSaveById: (id: string) => import("../../generated/prisma").Prisma.Prisma__SaveClient<{
    user: {
        id: string;
        username: string;
        avatarUrl: string | null;
    };
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
    postId: string;
    userId: string;
} | null, null, import("../../generated/prisma/runtime/library").DefaultArgs, import("../../generated/prisma").Prisma.PrismaClientOptions>;
export declare const deleteSaveByUserIdAndPostId: (userId: string, postId: string) => Promise<{
    status: number;
    message: string;
}>;
//# sourceMappingURL=save.service.d.ts.map