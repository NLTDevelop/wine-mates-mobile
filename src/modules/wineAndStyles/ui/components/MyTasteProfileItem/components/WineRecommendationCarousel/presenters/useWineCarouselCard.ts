import { useCallback, useEffect, useRef, useState } from 'react';
import { isIOS } from '@/utils';

interface IUseWineCarouselCardParams {
    wineId: number;
    onNext: () => void;
    onPrevious: () => void;
}

export const useWineCarouselCard = ({ wineId, onNext, onPrevious }: IUseWineCarouselCardParams) => {

    const [isShadowVisible, setShadowVisible] = useState(isIOS);
    const hasMountedRef = useRef(false);

    useEffect(() => {
        if (!isIOS) {
            return;
        }

        if (!hasMountedRef.current) {
            hasMountedRef.current = true;
            return;
        }

        const timeoutId = setTimeout(() => {
            setShadowVisible(true);
        }, 300);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [wineId, isIOS]);

    const hideShadowIfNeeded = useCallback(() => {
        if (!isIOS) {
            return;
        }

        setShadowVisible(false);
    }, [isIOS]);

    const handleNextPress = useCallback(() => {
        hideShadowIfNeeded();
        onNext();
    }, [hideShadowIfNeeded, onNext]);

    const handlePreviousPress = useCallback(() => {
        hideShadowIfNeeded();
        onPrevious();
    }, [hideShadowIfNeeded, onPrevious]);

    const shouldShowShadow = isIOS && isShadowVisible;
    const shouldShowBorder = !isIOS || !isShadowVisible;

    return {
        handleNextPress,
        handlePreviousPress,
        shouldShowShadow,
        shouldShowBorder,
    };
};
