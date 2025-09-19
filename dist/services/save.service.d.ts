export declare const insertSave: (userId: string, postId: string) => Promise<{
    id: string;
    createdAt: Date;
    postId: string;
    userId: string;
}>;
export declare const deleteSaveByUserIdAndPostId: (userId: string, postId: string) => Promise<{
    status: number;
    message: string;
}>;
//# sourceMappingURL=save.service.d.ts.map