import { useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { toastService } from '@/libs/toast/toastService';
import { userService } from '@/entities/users/UserService';
import { localization } from '@/UIProvider/localization/Localization';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const useGoogleSignIn = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [isGoogleLoginLoading, setIsGoogleLoginLoading] = useState<boolean>(false);

    const handleGoogleSignIn = useCallback(async () => {
        try {
            setIsGoogleLoginLoading(true);
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            await GoogleSignin.signIn();

            const token = (await GoogleSignin.getTokens()).accessToken;

            await GoogleSignin.hasPlayServices();

            const response = await userService.googleSignIn({ token });

            if (response.isError) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('errors.somethingWentWrong'),
                );
                return;
            }

            navigation.reset({ index: 0, routes: [{ name: 'TabNavigator' }] });
        } catch (error) {
            console.warn('Error in handleGoogleSignIn: ', JSON.stringify(error));
            toastService.showError(localization.t('common.errorHappened'), localization.t('errors.somethingWentWrong'));
        } finally {
            setIsGoogleLoginLoading(false);
        }
    }, [navigation]);

    return { isGoogleLoginLoading, handleGoogleSignIn };
};
