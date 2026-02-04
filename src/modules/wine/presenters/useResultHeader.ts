import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { wineModel } from '@/entities/wine/WineModel';
import { localization } from '@/UIProvider/localization/Localization';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo } from 'react';

export const useResultHeader = (item: IWineDetails) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const vintageData = useMemo(
        () => {
            const data = item.vintages.map(vintage => {
                return {
                    label: String(vintage.vintage),
                    value: String(vintage.vintage),
                    id: vintage.wineId,
                    averageUserRating: vintage.averageUserRating,
                    totalReviews: vintage.totalReviews,
                };
            });

            if (item.currentVintage && !data.some(vintage => vintage.id === item.currentVintage?.wineId)) {
                data.unshift({
                    label: String(item.currentVintage.vintage),
                    value: String(item.currentVintage.vintage),
                    id: item.currentVintage.wineId,
                    averageUserRating: item.currentVintage.averageUserRating,
                    totalReviews: item.currentVintage.totalReviews,
                });
            }

            return data;
        },
        [item.vintages, item.currentVintage],
    );

    const onPress = useCallback(() => {
        wineModel.clear();

        console.log("Check item", item);

        wineModel.wine = {
            id: item.id,
            name: item.name,
            vintage: item.currentVintage?.vintage ?? 0,
        };

        wineModel.base = {
            colorOfWine: {
                id: item.color?.id ?? null,
                value: item.color?.name ?? '',
            },
            country: {
                id: item.country?.id ?? null,
                value: item.country?.name ?? '',
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
                value: item.currentVintage?.vintage != null ? item.currentVintage.vintage.toString() : '',
            },
            wineName: {
                id: null,
                value: item.name,
            },
            typeOfWine: {
                id: item.type?.id ?? null,
                value: item.type?.name ?? '',
                isSparkling: item.type?.isSparkling ?? false,
            },
        };
        navigation.navigate('WineLookView');
    }, [navigation, item]);

    const selectedVintageValue = item.currentVintage?.vintage != null ? item.currentVintage.vintage.toString() : null;
    const vintagePlaceholder =
        item.currentVintage?.vintage != null ? localization.t('wine.vintage') : localization.t('wine.nonVintage');

    return { onPress, vintageData, selectedVintageValue, vintagePlaceholder };
};
