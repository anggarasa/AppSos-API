export interface TokenPayload {
    userId: string;
    username: string;
    type: 'access' | 'refresh';
}
export declare const generateAccessToken: (userId: string, username: string) => string;
export declare const generateRefreshToken: (userId: string, username: string) => string;
export declare const verifyAccessToken: (token: string) => TokenPayload | null;
export declare const verifyRefreshToken: (token: string) => TokenPayload | null;
export declare const generateTokenPair: (userId: string, username: string) => {
    accessToken: string;
    refreshToken: string;
};
export declare const extractTokenFromHeader: (authHeader: string | undefined) => string | null;
//# sourceMappingURL=tokenUtils.d.ts.map