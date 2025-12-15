import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCallback, useMemo, useRef, useState } from 'react';

export interface IFavoriteItem {
    id: number;
    title: string;
    isSelected: boolean;
}

const MOCK_FAVORITES: IFavoriteItem[] = [
    { id: 1, title: 'Autumn selection', isSelected: false },
    { id: 2, title: 'Picnic wines', isSelected: false },
    { id: 3, title: 'Picnic wines', isSelected: false },
    { id: 4, title: 'Taste later', isSelected: false },
    { id: 5, title: 'Autumn selection', isSelected: false },
    { id: 6, title: 'Picnic wines', isSelected: false },
    { id: 7, title: 'Picnic wines', isSelected: false },
    { id: 8, title: 'Taste later', isSelected: false },
];

export const useAddToFavoriteBottomSheet = () => {
    const addToFavoriteModalRef = useRef<BottomSheetModal | null>(null);
    const [favoriteData, setFavoriteData] = useState<IFavoriteItem[]>(MOCK_FAVORITES);

    const onClose = useCallback(() => {
        addToFavoriteModalRef.current?.dismiss();
    }, []);

    const onOpen = useCallback(() => {
        addToFavoriteModalRef.current?.present();
    }, []);

    const onItemPress = useCallback((item: IFavoriteItem) => {
        setFavoriteData(prev =>
            prev.map(favorite =>
                favorite.id === item.id ? { ...favorite, isSelected: !favorite.isSelected } : favorite,
            ),
        );
    }, []);

    const sortedFavorites = useMemo(
        () => [...favoriteData].sort((a, b) => a.id - b.id),
        [favoriteData],
    );

    return { favoriteData: sortedFavorites, addToFavoriteModalRef, onItemPress, onClose, onOpen };
};
