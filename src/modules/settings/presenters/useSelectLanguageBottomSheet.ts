import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCallback, useRef } from 'react';
import { useUiContext } from '@/UIProvider';

export const useSelectLanguageBottomSheet = () => {
    const { setLocale } = useUiContext();
    const selectLanguageModalRef = useRef<BottomSheetModal | null>(null);

    const onClose = useCallback(() => {
        selectLanguageModalRef.current?.dismiss();
    }, []);

    const onOpen = useCallback(() => {
        selectLanguageModalRef.current?.present();
    }, []);

    const onItemPress = useCallback((item: string) => {
        setLocale(item);
        selectLanguageModalRef.current?.dismiss();
    }, [setLocale]);

    return { selectLanguageModalRef, onItemPress, onClose, onOpen };
};
