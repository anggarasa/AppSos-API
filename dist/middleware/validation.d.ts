import { Request, Response, NextFunction } from 'express';
export declare const validateCreateUser: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateUpdateUser: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateLogin: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateCreatePost: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateCreateComment: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateCreateLike: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateUnlikePost: (req: Request, res: Response, next: NextFunction) => void;
export declare const isValidUUID: (uuid: string) => boolean;
export declare const validateUUIDs: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateCreateSave: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateUnSavePost: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateFollowUser: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateUnfollowUser: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validation.d.ts.map