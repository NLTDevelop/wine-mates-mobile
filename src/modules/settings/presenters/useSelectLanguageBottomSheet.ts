import { useCallback, useState } from 'react';
import { useUiContext } from '@/UIProvider';

export const useSelectLanguageBottomSheet = () => {
    const { setLocale } = useUiContext();
    const [isVisible, setIsVisible] = useState(false);

    const onClose = useCallback(() => {
        setIsVisible(false);
    }, []);

    const onOpen = useCallback(() => {
        setIsVisible(true);
    }, []);

    const onItemPress = useCallback((item: string) => {
        setLocale(item);
        setIsVisible(false);
    }, [setLocale]);

    return { isVisible, onItemPress, onClose, onOpen };
};
