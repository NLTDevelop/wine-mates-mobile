import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { scaleVertical } from '@/utils';
import { useBottomModalInsets } from '@/UIKit/BottomModal/presenters/useBottomModalInsets';
import { IUniversalPickerOption } from '../types/IUniversalPickerOption';

interface IProps {
    options: IUniversalPickerOption[];
    isLoading: boolean;
}

const HEADER_HEIGHT = 56;
const OPTION_HEIGHT = 56;
const OPTION_WITH_SUBTITLE_HEIGHT = 88;
const SEPARATOR_HEIGHT = 1;
const CONFIRM_BUTTON_HEIGHT = 48;
const CONFIRM_BUTTON_TOP_MARGIN = 12;
const CONTENT_BOTTOM_PADDING = 16;

export const useUniversalPickerBottomModal = ({ options, isLoading }: IProps) => {
    const { height } = useWindowDimensions();
    const { topInset, bottomInset } = useBottomModalInsets();
    const staticHeight = scaleVertical(HEADER_HEIGHT)
        + scaleVertical(CONFIRM_BUTTON_HEIGHT)
        + scaleVertical(CONFIRM_BUTTON_TOP_MARGIN)
        + bottomInset
        + scaleVertical(CONTENT_BOTTOM_PADDING);
    const availableListHeight = Math.max(height - topInset - staticHeight, scaleVertical(120));

    const regularListHeight = useMemo(() => {
        if (isLoading || options.length === 0) {
            return scaleVertical(120);
        }

        const optionsHeight = options.reduce((heightSum, item) => {
            const itemHeight = item.subtitle ? OPTION_WITH_SUBTITLE_HEIGHT : OPTION_HEIGHT;
            return heightSum + scaleVertical(itemHeight);
        }, 0);
        const separatorsHeight = Math.max(options.length - 1, 0) * scaleVertical(SEPARATOR_HEIGHT);

        return Math.min(optionsHeight + separatorsHeight, availableListHeight);
    }, [availableListHeight, isLoading, options]);

    const isRegularListScrollEnabled = useMemo(() => {
        if (isLoading || options.length === 0) {
            return false;
        }

        const optionsHeight = options.reduce((heightSum, item) => {
            const itemHeight = item.subtitle ? OPTION_WITH_SUBTITLE_HEIGHT : OPTION_HEIGHT;
            return heightSum + scaleVertical(itemHeight);
        }, 0);
        const separatorsHeight = Math.max(options.length - 1, 0) * scaleVertical(SEPARATOR_HEIGHT);

        return optionsHeight + separatorsHeight > availableListHeight;
    }, [availableListHeight, isLoading, options]);

    const isFullScreen = useMemo(() => {
        return false;
    }, []);

    return {
        isFullScreen,
        regularListHeight,
        isRegularListScrollEnabled,
    };
};
