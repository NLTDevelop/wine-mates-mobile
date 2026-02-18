import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

interface IUseWineCarouselCardParams {
    wineId: number;
    onNext: () => void;
    onPrevious: () => void;
}

export const useWineCarouselCard = ({ wineId, onNext, onPrevious }: IUseWineCarouselCardParams) => {
    const isIos = Platform.OS === 'ios';
    const [isShadowVisible, setShadowVisible] = useState(isIos);
    const hasMountedRef = useRef(false);

    useEffect(() => {
        if (!isIos) {
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
    }, [wineId, isIos]);

    const hideShadowIfNeeded = useCallback(() => {
        if (!isIos) {
            return;
        }

        setShadowVisible(false);
    }, [isIos]);

    const handleNextPress = useCallback(() => {
        hideShadowIfNeeded();
        onNext();
    }, [hideShadowIfNeeded, onNext]);

    const handlePreviousPress = useCallback(() => {
        hideShadowIfNeeded();
        onPrevious();
    }, [hideShadowIfNeeded, onPrevious]);

    const shouldShowShadow = isIos && isShadowVisible;
    const shouldShowBorder = !isIos || !isShadowVisible;

    return {
        handleNextPress,
        handlePreviousPress,
        shouldShowShadow,
        shouldShowBorder,
    };
};
