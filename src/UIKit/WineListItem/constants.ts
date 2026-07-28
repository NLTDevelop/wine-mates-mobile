import { isAndroid } from '@/utils';

export const WINE_LIST_PERFORMANCE_PROPS = {
    initialNumToRender: 4,
    maxToRenderPerBatch: 4,
    updateCellsBatchingPeriod: 50,
    windowSize: 5,
    removeClippedSubviews: isAndroid,
};
