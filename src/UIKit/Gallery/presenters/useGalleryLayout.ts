import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scaleVertical } from '@/utils';

export const useGalleryLayout = () => {
    const { width: viewerWidth } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    const viewerPhotoStyle = useMemo(() => {
        return { width: viewerWidth };
    }, [viewerWidth]);

    const closeViewerButtonInsetStyle = useMemo(() => {
        return { top: insets.top + scaleVertical(8) };
    }, [insets.top]);

    return {
        viewerWidth,
        viewerPhotoStyle,
        closeViewerButtonInsetStyle,
    };
};
