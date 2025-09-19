export declare const insertComment: (userId: string, postId: string, content: string) => Promise<{
    id: string;
    authorId: string;
    content: string;
    postId: string;
    author: {
        id: string;
        username: string;
    };
}>;
export declare const findCommentsByPostId: (postId: string) => import("../../generated/prisma").Prisma.PrismaPromise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    content: string;
    postId: string;
    author: {
        id: string;
        username: string;
        avatarUrl: string | null;
    };
}[]>;
export declare const findCommentsByUserId: (userId: string) => import("../../generated/prisma").Prisma.PrismaPromise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
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
    authorId: string;
    content: string;
    postId: string;
    author: {
        id: string;
        username: string;
        avatarUrl: string | null;
    };
}[]>;
export declare const updateCommentById: (id: string, userId: string, content: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    content: string;
    postId: string;
    author: {
        id: string;
        username: string;
        avatarUrl: string | null;
    };
}>;
export declare const findCommentById: (id: string) => import("../../generated/prisma").Prisma.Prisma__CommentClient<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
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
    authorId: string;
    content: string;
    postId: string;
    author: {
        id: string;
        username: string;
        avatarUrl: string | null;
    };
} | null, null, import("../../generated/prisma/runtime/library").DefaultArgs, import("../../generated/prisma").Prisma.PrismaClientOptions>;
export declare const deleteCommentById: (id: string) => Promise<{
    status: number;
    message: string;
}>;
//# sourceMappingURL=comment.service.d.ts.map