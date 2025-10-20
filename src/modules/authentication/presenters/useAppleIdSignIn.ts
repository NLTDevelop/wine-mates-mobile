import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';

export const useAppleIdSignIn = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [isAppleLoginLoading, setIsAppleLoginLoading] = useState(false);

    const handleAppleSignIn = async () => {
        try {
            setIsAppleLoginLoading(true);

            if (!appleAuth.isSupported) {
                console.warn('Apple Sign-In не поддерживается на этом устройстве');
                return;
            }

            const response = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
            });

            if (response.identityToken) {
                console.log('✅ Авторизация успешна');
                console.log('User ID:', response.user);

                console.log('Identity token:', response.identityToken);

                navigation.reset({ index: 0, routes: [{ name: 'TabNavigator'}] });
            } else {
                console.log('❌ Токен не получен — возможно, отмена пользователем.');
            }
        } catch (error: any) {
            console.warn('Error in handleAppleSignIn: ', JSON.stringify(error));
            toastService.showError(localization.t('common.errorHappened'), localization.t('errors.somethingWentWrong'));
        } finally {
            setIsAppleLoginLoading(false);
        }
    };

    return { handleAppleSignIn, isAppleLoginLoading };
};
