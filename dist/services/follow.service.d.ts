import { PaginationParams, PaginationResult } from "../utils/pagination";
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
export declare const getFollowers: (userId: string, pagination: PaginationParams) => Promise<PaginationResult<any>>;
export declare const getFollowing: (userId: string, pagination: PaginationParams) => Promise<PaginationResult<any>>;
export declare const getFollowStats: (userId: string) => Promise<{
    followersCount: number;
    followingCount: number;
}>;
export declare const isUserFollowing: (followerId: string, followingId: string) => Promise<boolean>;
export declare const getMutualFollows: (userId1: string, userId2: string, pagination: PaginationParams) => Promise<PaginationResult<any>>;
export declare const findFollowById: (id: string) => import("../../generated/prisma").Prisma.Prisma__FollowClient<{
    id: string;
    createdAt: Date;
    followerId: string;
    followingId: string;
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
} | null, null, import("../../generated/prisma/runtime/library").DefaultArgs, import("../../generated/prisma").Prisma.PrismaClientOptions>;
export declare const getFollowSuggestions: (userId: string, pagination: PaginationParams) => Promise<PaginationResult<any>>;
//# sourceMappingURL=follow.service.d.ts.map