export declare const followUser: (followerId: string, followingId: string) => Promise<{
    following: {
        name: string;
        id: string;
        username: string;
        avatarUrl: string | null;
    };
    follower: {
        name: string;
        id: string;
        username: string;
        avatarUrl: string | null;
    };
} & {
    id: string;
    createdAt: Date;
    followerId: string;
    followingId: string;
}>;
export declare const unfollowUser: (followerId: string, followingId: string) => Promise<{
    status: number;
    message: string;
}>;
export declare const getFollowers: (userId: string) => Promise<{
    name: string;
    id: string;
    username: string;
    bio: string | null;
    avatarUrl: string | null;
}[]>;
export declare const getFollowing: (userId: string) => Promise<{
    name: string;
    id: string;
    username: string;
    bio: string | null;
    avatarUrl: string | null;
}[]>;
export declare const getFollowStats: (userId: string) => Promise<{
    followersCount: number;
    followingCount: number;
}>;
//# sourceMappingURL=follow.service.d.ts.map