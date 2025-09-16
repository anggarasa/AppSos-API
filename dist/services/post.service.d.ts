export declare const findPostAll: () => import("../../generated/prisma").Prisma.PrismaPromise<{
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
}[]>;
export declare const findPostById: (id: string) => import("../../generated/prisma").Prisma.Prisma__PostClient<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    content: string;
    imageUrl: string | null;
    author: {
        name: string;
        id: string;
        email: string;
        username: string;
        avatarUrl: string | null;
    };
} | null, null, import("../../generated/prisma/runtime/library").DefaultArgs, import("../../generated/prisma").Prisma.PrismaClientOptions>;
export declare const insertPost: (userId: string, data: {
    content: string;
    imageFile?: Express.Multer.File;
}) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    content: string;
    imageUrl: string | null;
}>;
export declare const deletePostById: (id: string) => Promise<{
    status: number;
    message: string;
}>;
//# sourceMappingURL=post.service.d.ts.map