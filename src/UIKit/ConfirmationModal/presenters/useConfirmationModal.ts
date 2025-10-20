import { useCallback, useState } from 'react';

export const useConfirmationModal = () => {
    const [isVisible, setIsVisible] = useState(false);

    const onShowModal = useCallback(() => {
        setIsVisible(true);
    }, []);

    const onHide = useCallback(() => {
        setIsVisible(false);
    }, []);

    return { isVisible, onShowModal, onHide };
};
