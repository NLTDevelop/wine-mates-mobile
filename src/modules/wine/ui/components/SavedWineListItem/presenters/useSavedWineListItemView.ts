import { useCallback } from 'react';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';

export const useSavedWineListItemView = () => {
    const keyExtractor = useCallback((item: IWineListItem, index: number) => `${item.id}-${index}`, []);

    const renderFooterData = useCallback((item: IWineListItem) => {
        return item.myReview || item.lastReview || null;
    }, []);

    return {
        keyExtractor,
        renderFooterData,
    };
};
