import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { links } from '@/Links';
import { userModel } from '@/entities/users/UserModel';

interface INotificationCountUpdatedPayload {
    count: number;
}

export const useNotificationBadge = () => {
    const token = userModel.token;
    const [notificationState, setNotificationState] = useState({ token, count: 0 });
    const count = notificationState.token === token ? notificationState.count : 0;

    useEffect(() => {
        if (!token) {
            return;
        }

        const socket = io(links.notificationsSocket, {
            auth: { token },
        });
        const onNotificationCountUpdated = ({ count: updatedCount }: INotificationCountUpdatedPayload) => {
            setNotificationState({ token, count: updatedCount });
        };

        socket.on('notification_count_updated', onNotificationCountUpdated);

        return () => {
            socket.off('notification_count_updated', onNotificationCountUpdated);
            socket.disconnect();
        };
    }, [token]);

    const showBadge = count > 0;
    const displayCount = count > 99 ? '99+' : count.toString();

    return {
        showBadge,
        displayCount,
    };
};
