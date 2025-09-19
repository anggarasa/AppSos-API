import { Request, Response } from "express";
export declare const getUsers: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const findUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getUserProfileWithStats: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getUserByUsername: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const searchUsersList: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getUserActivityFeed: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=user.controller.d.ts.map