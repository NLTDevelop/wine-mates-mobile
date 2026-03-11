import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

export const useDeleteAccount = () => {
    const navigation = useNavigation();
    const [isConfirmed, setIsConfirmed] = useState(false);

    const handleDeleteAccount = useCallback(() => {
        if (!isConfirmed) return;
        // TODO: Implement delete account logic
    }, [isConfirmed]);

    const handleCancel = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const toggleConfirmation = useCallback(() => {
        setIsConfirmed(prev => !prev);
    }, []);

    return {
        isConfirmed,
        handleDeleteAccount,
        handleCancel,
        toggleConfirmation,
    };
};
