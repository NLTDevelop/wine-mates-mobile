import { SelectedItemsListRef } from '@/UIKit/SelectedItemsList/types';
import { useCallback, useRef } from 'react';

export const useAnimatedItemAdd = <T extends (...args: any[]) => number>(
    originalHandler: T
): [T, React.RefObject<SelectedItemsListRef | null>] => {
    const selectedListRef = useRef<SelectedItemsListRef | null>(null);

    const wrappedHandler = useCallback(
        (...args: Parameters<T>) => {
            const newId = originalHandler(...args);
            setTimeout(() => {
                selectedListRef.current?.setNewItemId(newId);
                selectedListRef.current?.scrollToStart();
            }, 50);
            return newId;
        },
        [originalHandler]
    ) as T;

    return [wrappedHandler, selectedListRef];
};
