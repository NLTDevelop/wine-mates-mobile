import { favoriteWineService } from '@/entities/wine/FavoriteWineService';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

export const useFavoriteWineListView = (listId: number) => {
    const [wines, setWines] = useState<IWineListItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const navigation = useNavigation();

    const loadWines = useCallback(async () => {
        try {
            setIsLoading(true);
            setIsError(false);
            const response = await favoriteWineService.getWinesByListId(listId, {
                offset: 0,
                limit: 100,
            });

            if (response.isError) {
                setIsError(true);
            } else {
                setWines(response.data?.rows || []);
            }
        } catch (error) {
            console.error('useFavoriteWineListView -> loadWines error: ', JSON.stringify(error, null, 2));
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }, [listId]);

    useEffect(() => {
        loadWines();
    }, [loadWines]);

    const onWinePress = useCallback(
        (item: IWineListItem) => {
            navigation.navigate('WineDetailsView', { wineId: item.id });
        },
        [navigation],
    );

    return {
        wines,
        isLoading,
        isError,
        onWinePress,
        loadWines,
    };
};
