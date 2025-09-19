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
export declare const deleteCommentById: (id: string) => Promise<{
    status: number;
    message: string;
}>;
//# sourceMappingURL=comment.service.d.ts.map