import { IVintage, IWineDetails } from '@/entities/wine/types/IWineDetails';
import { wineModel } from '@/entities/wine/WineModel';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo } from 'react';

export const useResultHeader = (item: IWineDetails) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const vintageData = useMemo(() =>
        item.vintages.map((vintage: IVintage) => {
            const label = String(vintage.vintage);
            return {
                label,
                value: label,
                id: vintage.wineId,
            };
        }),
    [item],);

    const onPress = useCallback(() => {
        wineModel.clear();

        wineModel.wine = {
            id: item.id,
            name: item.name,
            vintage: item.vintage,
        };

        wineModel.base = {
            colorOfWine: {
                id: item.color.id,
                value: item.color.name,
            },
            country: {
                id: item.country.id,
                value: item.country.name,
            },
            region: {
                id: item.region?.id ?? null,
                value: item.region?.name ?? null,
            },
            producer: {
                id: null,
                value: item.producer,
            },
            grapeVariety: {
                id: null,
                value: item.grapeVariety,
            },
            vintageYear: {
                id: null,
                value: item.vintage ? item.vintage.toString() : '',
            },
            wineName: {
                id: null,
                value: item.name,
            },
            typeOfWine: {
                id: item.type.id,
                value: item.type.name,
                isSparkling: item.type.isSparkling,
            },
        };
        navigation.navigate('WineLookView');
    }, [navigation, item]);

    return { vintageData, onPress };
};
