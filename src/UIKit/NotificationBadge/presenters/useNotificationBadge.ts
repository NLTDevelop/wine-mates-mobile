import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { links } from '@/Links';
import { userModel } from '@/entities/users/UserModel';

interface INotificationCountUpdatedPayload {
    count: number;
}

const SOCKET_LOG_PREFIX = '[NotificationsSocket]';
const IS_NOTIFICATIONS_SOCKET_ENABLED = false;

export const useNotificationBadge = () => {
    const token = userModel.token;
    const [notificationState, setNotificationState] = useState({ token, count: 0 });
    const count = notificationState.token === token ? notificationState.count : 0;

    useEffect(() => {
        if (!IS_NOTIFICATIONS_SOCKET_ENABLED) {
            console.log(`${SOCKET_LOG_PREFIX} temporarily disabled`);
            return;
        }

        if (!token) {
            console.log(`${SOCKET_LOG_PREFIX} connection skipped: token is missing`);
            return;
        }

        console.log(`${SOCKET_LOG_PREFIX} initializing`, { url: links.notificationsSocket });

        const socket = io(links.notificationsSocket, {
            auth: { token },
        });
        const onConnect = () => {
            console.log(`${SOCKET_LOG_PREFIX} connected`, {
                socketId: socket.id,
                transport: socket.io.engine.transport.name,
            });
        };
        const onConnectError = (error: Error) => {
            console.error(`${SOCKET_LOG_PREFIX} connection error`, error);
        };
        const onDisconnect = (reason: string) => {
            console.warn(`${SOCKET_LOG_PREFIX} disconnected`, {
                reason,
                willReconnect: socket.active,
            });
        };
        const onReconnectAttempt = (attempt: number) => {
            console.log(`${SOCKET_LOG_PREFIX} reconnect attempt`, { attempt });
        };
        const onReconnect = (attempt: number) => {
            console.log(`${SOCKET_LOG_PREFIX} reconnected`, {
                attempt,
                socketId: socket.id,
            });
        };
        const onReconnectError = (error: Error) => {
            console.error(`${SOCKET_LOG_PREFIX} reconnect error`, error);
        };
        const onReconnectFailed = () => {
            console.error(`${SOCKET_LOG_PREFIX} reconnect failed`);
        };
        const onNotificationCountUpdated = ({ count: updatedCount }: INotificationCountUpdatedPayload) => {
            console.log(`${SOCKET_LOG_PREFIX} notification_count_updated`, { count: updatedCount });
            setNotificationState({ token, count: updatedCount });
        };

        socket.on('connect', onConnect);
        socket.on('connect_error', onConnectError);
        socket.on('disconnect', onDisconnect);
        socket.on('notification_count_updated', onNotificationCountUpdated);
        socket.io.on('reconnect_attempt', onReconnectAttempt);
        socket.io.on('reconnect', onReconnect);
        socket.io.on('reconnect_error', onReconnectError);
        socket.io.on('reconnect_failed', onReconnectFailed);

        return () => {
            console.log(`${SOCKET_LOG_PREFIX} cleanup`, {
                socketId: socket.id,
                connected: socket.connected,
            });
            socket.off('connect', onConnect);
            socket.off('connect_error', onConnectError);
            socket.off('disconnect', onDisconnect);
            socket.off('notification_count_updated', onNotificationCountUpdated);
            socket.io.off('reconnect_attempt', onReconnectAttempt);
            socket.io.off('reconnect', onReconnect);
            socket.io.off('reconnect_error', onReconnectError);
            socket.io.off('reconnect_failed', onReconnectFailed);
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
