import { Request, Response } from 'express';
declare class NotificationController {
    getUserNotifications(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getUnreadCount(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    markAsRead(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    markAllAsRead(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteNotification(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: NotificationController;
export default _default;
//# sourceMappingURL=notification.controller.d.ts.map