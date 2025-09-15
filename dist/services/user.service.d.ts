export declare const findAllUsers: () => import("../../generated/prisma").Prisma.PrismaPromise<{
    name: string;
    id: string;
    email: string;
    username: string;
    bio: string | null;
    avatarUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}[]>;
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
export declare const deleteUserById: (id: string) => Promise<{
    status: number;
    message: string;
}>;
//# sourceMappingURL=user.service.d.ts.map