import { useCallback, useState } from 'react';

export const useConfirmationAlert = () => {
    const [isVisible, setIsVisible] = useState(false);

    const onShowAlert = useCallback(() => {
        setIsVisible(true);
    }, []);

    const onCloseAlert = useCallback(() => {
        setIsVisible(false);
    }, []);

    return {
        isVisible,
        onShowAlert,
        onCloseAlert,
    };
};
