import { Request, Response } from "express";
export declare const follow: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const unfollow: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getFollowersList: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getFollowingList: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getFollowStatistics: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=follow.controller.d.ts.map