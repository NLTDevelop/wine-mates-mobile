import { userService } from '@/entities/users/UserService';
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
                console.warn('Apple Sign-In is not supported.');
                return;
            }

            const response = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
            });

            if (response.identityToken) {
                const signInResponse = await userService.appleSignIn({ token: response.identityToken });

                if (signInResponse.isError) {
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        signInResponse.message || localization.t('errors.somethingWentWrong'),
                    );
                    return;
                }

                navigation.reset({ index: 0, routes: [{ name: 'TabNavigator' }] });
            } else {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    localization.t('errors.somethingWentWrong'),
                );
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
