import { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useAnimatedRef } from 'react-native-reanimated';
import { scaleVertical } from '@/utils';

const SECTIONS_GAP = 16;
const AUTO_SCROLL_ACTIVATION_OFFSET = 220;
const AUTO_SCROLL_MAX_VELOCITY = 1800;
const DRAG_ACTIVATION_DELAY = 120;

export const useHomeConfiguredSections = () => {
    const scrollableRef = useAnimatedRef<ScrollView>();
    const rowGap = scaleVertical(SECTIONS_GAP);
    const autoScrollActivationOffset = useMemo<[number, number]>(() => {
        const offset = scaleVertical(AUTO_SCROLL_ACTIVATION_OFFSET);

        return [offset, offset];
    }, []);
    const autoScrollMaxVelocity = scaleVertical(AUTO_SCROLL_MAX_VELOCITY);

    return {
        autoScrollActivationOffset,
        autoScrollMaxVelocity,
        dragActivationDelay: DRAG_ACTIVATION_DELAY,
        rowGap,
        scrollableRef,
    };
};
