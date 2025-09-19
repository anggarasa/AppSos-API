export declare const insertLike: (userId: string, postId: string) => Promise<{
    id: string;
    createdAt: Date;
    postId: string;
    userId: string;
}>;
export declare const deleteLikeById: (id: string) => Promise<{
    status: number;
    message: string;
    data: {};
}>;
export declare const deleteLikeByUserAndPost: (userId: string, postId: string) => Promise<{
    status: number;
    message: string;
    data: {};
}>;
export declare const getLikeCount: (postId: string) => Promise<number>;
export declare const hasUserLikedPost: (userId: string, postId: string) => Promise<boolean>;
export declare const findLikedPostsByUserId: (userId: string) => import("../../generated/prisma").Prisma.PrismaPromise<{
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
export declare const findLikesByUserId: (userId: string) => import("../../generated/prisma").Prisma.PrismaPromise<{
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
}[]>;
export declare const findLikeById: (id: string) => import("../../generated/prisma").Prisma.Prisma__LikeClient<{
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
//# sourceMappingURL=like.service.d.ts.map