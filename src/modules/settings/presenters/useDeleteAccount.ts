import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { userService } from '@/entities/users/UserService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { userModel } from '@/entities/users/UserModel';

export const useDeleteAccount = () => {
    const navigation = useNavigation();
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isInProgress, setIsInProgress] = useState(false);

    const onDeleteAccount = useCallback(async () => {
        if (!isConfirmed) return;
        try {
            setIsInProgress(true);

            const response = await userService.delete();

            if (response.isError) {
                toastService.showError(localization.t('common.errorHappened'), response.message);
            } else {
                userModel.token = null;
            }
        } catch (error) {
            console.error('Error: ', JSON.stringify(error, null, 4));
        } finally {
            setIsInProgress(false);
        }
    }, [isConfirmed]);

    const onCancel = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const toggleConfirmation = useCallback(() => {
        setIsConfirmed(prev => !prev);
    }, []);

    return {
        isConfirmed,
        onDeleteAccount,
        onCancel,
        toggleConfirmation,
        isInProgress
    };
};
