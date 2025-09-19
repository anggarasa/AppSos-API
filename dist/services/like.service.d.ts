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
//# sourceMappingURL=like.service.d.ts.map