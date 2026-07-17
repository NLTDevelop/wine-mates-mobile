import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';

const WINERY_WINES: IWineListItem[] = [];

export const useMyWineryWines = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const onPressBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const onItemPress = useCallback(
        (item: IWineListItem) => {
            navigation.navigate('WineDetailsView', { wineId: item.id });
        },
        [navigation],
    );

    const onAddWinePress = useCallback(() => {
        navigation.navigate('AddWineryWinesView');
    }, [navigation]);

    return {
        data: WINERY_WINES,
        isLoading: false,
        onPressBack,
        onItemPress,
        onAddWinePress,
    };
};
