import { Request, Response } from "express";
export declare const follow: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const unfollow: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getFollowersList: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getFollowingList: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getFollowStatistics: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const checkFollowStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getMutualFollowsList: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getFollow: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getFollowSuggestionsList: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=follow.controller.d.ts.map