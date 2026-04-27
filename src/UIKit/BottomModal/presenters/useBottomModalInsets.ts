import { useMemo } from 'react';
import { Dimensions, Platform } from 'react-native';
import { initialWindowMetrics, useSafeAreaInsets } from 'react-native-safe-area-context';

const getAndroidNavigationInset = () => {
    if (Platform.OS !== 'android') {
        return 0;
    }

    const screenHeight = Dimensions.get('screen').height;
    const windowHeight = Dimensions.get('window').height;
    return Math.max(0, screenHeight - windowHeight);
};

export const useBottomModalInsets = () => {
    const { top, bottom } = useSafeAreaInsets();

    const bottomInset = useMemo(() => {
        const initialBottomInset = initialWindowMetrics?.insets.bottom || 0;
        const androidNavigationInset = getAndroidNavigationInset();

        return Math.max(bottom, initialBottomInset, androidNavigationInset);
    }, [bottom]);

    return {
        topInset: top,
        bottomInset,
    };
};
