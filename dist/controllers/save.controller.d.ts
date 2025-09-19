import { Request, Response } from "express";
export declare const savePost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getSavedPostsByUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const checkUserSave: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPostSaveCount: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getSave: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const unSave: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=save.controller.d.ts.map