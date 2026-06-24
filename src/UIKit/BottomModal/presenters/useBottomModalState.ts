import { createElement, useCallback, useEffect, useRef } from 'react';
import { Keyboard } from 'react-native';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal } from '@gorhom/bottom-sheet';

interface IUseBottomModalStateProps {
    visible: boolean;
    onClose: () => void;
}

export const useBottomModalState = ({ visible, onClose }: IUseBottomModalStateProps) => {
    const modalRef = useRef<BottomSheetModal | null>(null);

    const onRenderBackdrop = useCallback((props: BottomSheetBackdropProps) => {
        return createElement(BottomSheetBackdrop, {
            ...props,
            appearsOnIndex: 0,
            disappearsOnIndex: -1,
            pressBehavior: 'close',
        });
    }, []);

    const onRenderHandle = useCallback(() => {
        return null;
    }, []);

    const onClosePress = useCallback(() => {
        modalRef.current?.dismiss();
    }, []);

    const onDismiss = useCallback(() => {
        onClose();
    }, [onClose]);

    useEffect(() => {
        if (visible) {
            Keyboard.dismiss();
            modalRef.current?.present();
            return;
        }

        modalRef.current?.dismiss();
    }, [visible]);

    return {
        modalRef,
        onRenderBackdrop,
        onRenderHandle,
        onDismiss,
        onClosePress,
    };
};
