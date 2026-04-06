import { favoriteWineService } from '@/entities/wine/FavoriteWineService';
import { favoriteWinesListModel } from '@/entities/wine/FavoriteWineListsModel';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';

const LIMIT = 10;

export const useSavedWineListItem = (listId: number) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [isLoading, setIsLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [wines, setWines] = useState<IWineListItem[]>([]);

    const getWines = useCallback(async () => {
        try {
            setIsLoading(true);

            const response = await favoriteWineService.getWinesByListId(listId, {
                offset: 0,
                limit: LIMIT,
            });

            if (response.isError) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
            } else {
                setWines(response.data?.rows || []);
            }
        } catch (error) {
            console.error('getWines error: ', JSON.stringify(error, null, 2));
        } finally {
            setIsLoading(false);
        }
    }, [listId]);

    const onExpand = useCallback(async () => {
        setIsExpanded(true);
        if (wines.length === 0) {
            await getWines();
        }
    }, [wines.length, getWines]);

    const onCollapse = useCallback(() => {
        setIsExpanded(false);
    }, []);

    const onWinePress = useCallback(
        (item: IWineListItem) => {
            navigation.navigate('WineDetailsView', { wineId: item.id });
        },
        [navigation],
    );

    return { wines, isLoading, onWinePress, onExpand, onCollapse };
};
