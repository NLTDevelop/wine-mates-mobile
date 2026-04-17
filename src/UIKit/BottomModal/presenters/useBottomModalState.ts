import { useEffect, useState } from 'react';
import { useBottomModal } from './useBottomModal';

interface IUseBottomModalStateProps {
    visible: boolean;
    onClose: () => void;
}

export const useBottomModalState = ({ visible, onClose }: IUseBottomModalStateProps) => {
    const [isVisible, setIsVisible] = useState(visible);

    const { backdropOpacity, slideAnim, handleOpen, handleClose } = useBottomModal({
        onClose: () => {
            setIsVisible(false);
            onClose();
        }
    });

    useEffect(() => {
        if (visible) {
            setIsVisible(true);
            handleOpen();
        } else if (isVisible) {
            handleClose();
        }
    }, [visible, isVisible, handleOpen, handleClose]);

    return {
        isVisible,
        backdropOpacity,
        slideAnim,
        handleClose
    };
};
