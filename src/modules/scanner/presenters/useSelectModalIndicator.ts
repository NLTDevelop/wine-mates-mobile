import { useCallback, useMemo, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { scaleVertical } from '@/utils';

const LIST_MAX_HEIGHT = scaleVertical(300);
const ITEM_MIN_HEIGHT = scaleVertical(48);
const ITEM_GAP = scaleVertical(7);

export const useSelectModalIndicator = (dataLength: number) => {
    const [isScrollableByScrollEvent, setIsScrollableByScrollEvent] = useState(false);
    const [listHeight, setListHeight] = useState(0);

    const estimatedContentHeight = useMemo(() => {
        if (dataLength <= 0) {
            return 0;
        }

        return dataLength * ITEM_MIN_HEIGHT + (dataLength - 1) * ITEM_GAP;
    }, [dataLength]);

    const hasIndicatorOffsetByEstimate = estimatedContentHeight > (listHeight || LIST_MAX_HEIGHT) + 1;
    const hasIndicatorOffset = hasIndicatorOffsetByEstimate || isScrollableByScrollEvent;

    const onListLayout = useCallback((height: number) => {
        setListHeight(height);
    }, []);

    const onListScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentSize, layoutMeasurement } = event.nativeEvent;
        const isScrollable = contentSize.height > layoutMeasurement.height + 1;
        setIsScrollableByScrollEvent(prev => (prev === isScrollable ? prev : isScrollable));
    }, []);

    return {
        hasIndicatorOffset,
        onListLayout,
        onListScroll,
    };
};
