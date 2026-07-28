import { useCallback } from 'react';
import { IFilterTagItem } from '@/modules/wineAndStyles/types/IFilterTagItem';

export const useFilterTag = (
    tag: IFilterTagItem,
    onRemoveTag: (tag: IFilterTagItem) => void,
) => {
    const onRemove = useCallback(() => {
        onRemoveTag(tag);
    }, [onRemoveTag, tag]);

    return { onRemove };
};
