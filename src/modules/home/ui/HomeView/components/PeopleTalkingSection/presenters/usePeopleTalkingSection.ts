import { useCallback, useRef, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import type { PanGesture } from 'react-native-gesture-handler';
import { scaleVertical } from '@/utils';
import { IHomePeopleTalking } from '../../../types/IHomeVisibleSection';

const DEFAULT_CAROUSEL_HEIGHT = scaleVertical(150);

export const usePeopleTalkingSection = (data: IHomePeopleTalking[]) => {
    const isFocused = useIsFocused();
    const carouselRef = useRef<ICarouselInstance>(null);
    const dataRef = useRef(data);
    const maxCardHeightRef = useRef(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [carouselHeight, setCarouselHeight] = useState(DEFAULT_CAROUSEL_HEIGHT);
    const itemsCount = data.length;
    const hasItems = itemsCount > 0;
    const carouselKey = isFocused ? 'focused' : 'blurred';
    const carouselDefaultIndex = Math.min(activeIndex, Math.max(0, itemsCount - 1));

    const onConfigurePanGesture = useCallback((panGesture: PanGesture) => {
        panGesture.activeOffsetX([-12, 12]);
        panGesture.failOffsetY([-8, 8]);
    }, []);

    const onProgressChange = useCallback((_offsetProgress: number, absoluteProgress: number) => {
        const maxIndex = Math.max(0, itemsCount - 1);
        const nextIndex = Math.max(0, Math.min(maxIndex, Math.round(absoluteProgress)));

        setActiveIndex((currentIndex) => {
            if (currentIndex === nextIndex) {
                return currentIndex;
            }

            return nextIndex;
        });
    }, [itemsCount]);

    const onCardLayout = useCallback((event: LayoutChangeEvent) => {
        if (dataRef.current !== data) {
            dataRef.current = data;
            maxCardHeightRef.current = 0;
        }

        const nextHeight = Math.ceil(event.nativeEvent.layout.height);

        if (nextHeight <= 0 || nextHeight <= maxCardHeightRef.current) {
            return;
        }

        maxCardHeightRef.current = nextHeight;
        setCarouselHeight(nextHeight);
    }, [data]);

    return {
        carouselRef,
        carouselKey,
        carouselDefaultIndex,
        activeIndex,
        carouselHeight,
        hasItems,
        onProgressChange,
        onCardLayout,
        onConfigurePanGesture,
    };
};
