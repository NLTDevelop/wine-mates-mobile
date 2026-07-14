import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { userModel } from '@/entities/users/UserModel';

export const useScreenHeader = () => {
    const navigation = useNavigation<any>();

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
        onProfilePress,
        onNotificationsPress,
    };
};
