import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { scaleVertical } from '@/utils';
import { useBottomModalInsets } from '@/UIKit/BottomModal/presenters/useBottomModalInsets';

interface IProps {
    optionsCount: number;
    isLoading: boolean;
}

const HEADER_HEIGHT = 56;
const OPTION_HEIGHT = 56;
const SEPARATOR_HEIGHT = 1;
const CONFIRM_BUTTON_HEIGHT = 48;
const CONFIRM_BUTTON_TOP_MARGIN = 12;
const CONTENT_BOTTOM_PADDING = 16;

export const useUniversalPickerBottomModal = ({ optionsCount, isLoading }: IProps) => {
    const { height } = useWindowDimensions();
    const { topInset, bottomInset } = useBottomModalInsets();

    const isFullScreen = useMemo(() => {
        if (isLoading || optionsCount === 0) {
            return false;
        }

        const optionsHeight = optionsCount * scaleVertical(OPTION_HEIGHT);
        const separatorsHeight = Math.max(optionsCount - 1, 0) * scaleVertical(SEPARATOR_HEIGHT);
        const staticHeight = scaleVertical(HEADER_HEIGHT)
            + scaleVertical(CONFIRM_BUTTON_HEIGHT)
            + scaleVertical(CONFIRM_BUTTON_TOP_MARGIN)
            + bottomInset
            + scaleVertical(CONTENT_BOTTOM_PADDING);
        const availableHeight = height - topInset;

        return optionsHeight + separatorsHeight + staticHeight > availableHeight;
    }, [bottomInset, height, isLoading, optionsCount, topInset]);

    return {
        isFullScreen,
    };
};
