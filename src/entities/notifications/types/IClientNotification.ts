import { INotificationData } from '@/libs/notificationService/types/INotificationData';

export interface IClientNotification {
    id: number;
    userId: number;
    type: string;
    title: string;
    body: string;
    data: INotificationData | null;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}
