import { Request, Response } from "express";
export declare const getPosts: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createPost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updatePost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPostsByUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getSavedPostsByUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deletePost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=post.controller.d.ts.map