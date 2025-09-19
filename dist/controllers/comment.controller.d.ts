import { Request, Response } from "express";
export declare const createComment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getCommentsByPost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getCommentsByUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getComment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateComment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteComment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=comment.controller.d.ts.map