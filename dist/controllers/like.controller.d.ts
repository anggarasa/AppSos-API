import { Request, Response } from "express";
export declare const createLike: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteLike: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const unlikePost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPostLikeCount: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const checkUserLike: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=like.controller.d.ts.map