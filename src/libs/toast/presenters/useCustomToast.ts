import { useCallback } from 'react';
import Toast from 'react-native-toast-message';

export const useCustomToast = () => {
    const onHide = useCallback(() => {
        Toast.hide();
    }, []);

    return { onHide };
};
