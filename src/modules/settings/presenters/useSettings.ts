import { localization } from '@/UIProvider/localization/Localization';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';

export const useSettings = (onShowLogoutModal: () => void, onOpen: () => void, locale: string) => {
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

    const onPaymentsPress = useCallback(() => {
        navigation.navigate('PaymentsView');
    }, [navigation]);

    const onContactInfoPress = useCallback(() => {
        navigation.navigate('ContactInfoView');
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
            text: localization.t('settings.notifications', { locale }),
            onPress: onNotificationPress,
        },
        {
            id: 2,
            text: localization.t('settings.language', { locale }),
            onPress: onLanguagePress,
            description: localization.t(`locale.${locale}`, { locale }),
        },
        {
            id: 3,
            text: localization.t('settings.blockedUser', { locale }),
            onPress: onBlockUserPress,
        },
        {
            id: 4,
            text: localization.t('payments.paymentsMethods', { locale }),
            onPress: onPaymentsPress,
        },
        {
            id: 5,
            text: localization.t('contactInfo.contactInfo', { locale }),
            onPress: onContactInfoPress,
        },
    ];

    const BUTTONS = [
        {
            id: 1,
            text: localization.t('settings.subscription', { locale }),
            onPress: onSubscriptionPress,
        },
        {
            id: 2,
            text: localization.t('settings.FAQ', { locale }),
            onPress: onFAQPress,
        },
        {
            id: 3,
            text: localization.t('settings.rateTheApp', { locale }),
            onPress: onRateTheAppPress,
        },
        {
            id: 4,
            text: localization.t('settings.inviteFriends', { locale }),
            onPress: onInviteFriendsPress,
        },
    ];

    const ACCOUNT_BUTTONS = [
        {
            id: 1,
            text: localization.t('settings.changePassword', { locale }),
            onPress: onChangePasswordPress,
        },
        {
            id: 2,
            text: localization.t('settings.logOut', { locale }),
            onPress: onShowLogoutModal,
            hideIcon: true,
        },
        {
            id: 3,
            text: localization.t('settings.deleteAccount', { locale }),
            onPress: onDeleteAccountPress,
            hideIcon: true,
            isPrimary: true,
        },
    ];

    return { APP_BUTTONS, BUTTONS, ACCOUNT_BUTTONS };
};
