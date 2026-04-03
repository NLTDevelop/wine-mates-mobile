import { favoriteWineListService } from '@/entities/wine/FavoriteWineListService';
import { favoriteWinesListModel } from '@/entities/wine/FavoriteWineListsModel';
import { useCallback, useEffect, useState } from 'react';

export const useFavoriteWineLists = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const loadLists = useCallback(async () => {
        try {
            setIsLoading(true);
            await favoriteWineListService.getAll();
            setIsInitialized(true);
        } catch (error) {
            console.error('useFavoriteWineLists -> loadLists error: ', JSON.stringify(error, null, 2));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isInitialized && !favoriteWinesListModel.lists) {
            loadLists();
        }
    }, [isInitialized, loadLists]);

    return {
        lists: favoriteWinesListModel.lists,
        isLoading,
        loadLists,
    };
};
