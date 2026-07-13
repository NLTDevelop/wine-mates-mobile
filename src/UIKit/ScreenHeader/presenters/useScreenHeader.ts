import { useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { notificationsModel } from '@/entities/notifications/NotificationsModel';
import { notificationsService } from '@/entities/notifications/NotificationsService';
import { userModel } from '@/entities/users/UserModel';

export const useScreenHeader = () => {
    const navigation = useNavigation<any>();

    useFocusEffect(
        useCallback(() => {
            notificationsService.getCount();
        }, []),
    );

    const onProfilePress = useCallback(() => {
        navigation.navigate('ProfileDetailsView');
    }, [navigation]);

    const onNotificationsPress = useCallback(() => {
        navigation.navigate('NotificationsView');
    }, [navigation]);

    const firstName = userModel.user?.firstName || '';
    const fullname = `${firstName} ${userModel.user?.lastName || ''}`.trim();
    const greeting = `Hi, ${firstName} 👋🏻`;

    return {
        avatarUrl: userModel.user?.avatarUrl ?? null,
        fullname,
        greeting,
        notificationsCount: notificationsModel.notificationsCount,
        onProfilePress,
        onNotificationsPress,
    };
};
