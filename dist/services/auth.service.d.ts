export declare const registerUser: (data: {
    name: string;
    username: string;
    email: string;
    password: string;
}) => Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        name: string;
        username: string;
        email: string;
    };
}>;
export declare const loginUser: (data: {
    username: string;
    password: string;
}) => Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        name: string;
        username: string;
        email: string;
        bio: string | null;
        avatarUrl: string | null;
    };
}>;
export declare const refreshAccessToken: (refreshToken: string) => Promise<{
    accessToken: string;
    user: {
        id: string;
        name: string;
        username: string;
        email: string;
        bio: string | null;
        avatarUrl: string | null;
    };
}>;
//# sourceMappingURL=auth.service.d.ts.map