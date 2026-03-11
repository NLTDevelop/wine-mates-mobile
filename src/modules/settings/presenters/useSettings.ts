import { localization } from '@/UIProvider/localization/Localization';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';

export const useSettings = (onShowLogoutModal: () => void, onOpen: () => void) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const onNotificationPress = useCallback(() => {
        navigation.navigate('');
    }, [navigation]);

    const onLanguagePress = useCallback(() => {
        onOpen();
    }, [onOpen]);

    const onBlockUserPress = useCallback(() => {
        navigation.navigate('');
    }, [navigation]);

    const onSubscriptionPress = useCallback(() => {
        navigation.navigate('');
    }, [navigation]);

    const onFAQPress = useCallback(() => {
        navigation.navigate('FAQView');
    }, [navigation]);

    const onRateTheAppPress = useCallback(() => {
        navigation.navigate('');
    }, [navigation]);

    const onInviteFriendsPress = useCallback(() => {
        navigation.navigate('');
    }, [navigation]);

    const onChangePasswordPress = useCallback(() => {
        navigation.navigate('ForgotPasswordView', { isFromSettings: true });
    }, [navigation]);

    const onDeleteAccountPress = useCallback(() => {
        navigation.navigate('DeleteAccountView');
    }, [navigation]);

    const APP_BUTTONS = [
        {
            id: 1,
            text: localization.t('settings.notifications'),
            onPress: onNotificationPress,
        },
        {
            id: 2,
            text: localization.t('settings.language'),
            onPress: onLanguagePress,
            description: localization.t(`locale.${localization.locale}`) ,
        },
        {
            id: 3,
            text: localization.t('settings.blockedUser'),
            onPress: onBlockUserPress,
        },
    ];

    const BUTTONS = [
        {
            id: 1,
            text: localization.t('settings.subscription'),
            onPress: onSubscriptionPress,
        },
        {
            id: 2,
            text: localization.t('settings.FAQ'),
            onPress: onFAQPress,
        },
        {
            id: 3,
            text: localization.t('settings.rateTheApp'),
            onPress: onRateTheAppPress,
        },
        {
            id: 4,
            text: localization.t('settings.inviteFriends'),
            onPress: onInviteFriendsPress,
        },
    ];

    const ACCOUNT_BUTTONS = [
        {
            id: 1,
            text: localization.t('settings.changePassword'),
            onPress: onChangePasswordPress,
        },
        {
            id: 2,
            text: localization.t('settings.logOut'),
            onPress: onShowLogoutModal,
            hideIcon: true,
        },
        {
            id: 3,
            text: localization.t('settings.deleteAccount'),
            onPress: onDeleteAccountPress,
            hideIcon: true,
            isPrimary: true,
        },
    ];

    return { APP_BUTTONS, BUTTONS, ACCOUNT_BUTTONS };
};
