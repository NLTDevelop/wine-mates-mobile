import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { wineModel } from '@/entities/wine/WineModel';
import { wineService } from '@/entities/wine/WineService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';

export const useResultHeader = (item: IWineDetails) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [isCreating, setIsCreating] = useState(false);

    const onPress = useCallback(async () => {
        try {
            const isNewVintage = item.currentVintage === null;

            if (isNewVintage) {
                setIsCreating(true);

                const formData = new FormData();
                if (item.name) {
                    formData.append('name', item.name);
                }
                if (item.vintage) {
                    formData.append('vintage', item.vintage);
                }
                formData.append('countryId', item.country?.id ?? 0);
                if (item.region?.id) {
                    formData.append('regionId', item.region.id);
                }
                formData.append('producer', item.producer ?? '');
                formData.append('grapeVariety', item.grapeVariety ?? '');
                formData.append('typeId', item.type?.id ?? 0);
                formData.append('colorId', item.color?.id ?? 0);

                if (item.image?.originalUrl) {
                    try {
                        const imageResponse = await fetch(item.image.originalUrl);
                        const imageBlob = await imageResponse.blob();
                        const imageFile = {
                            uri: item.image.originalUrl,
                            type: imageBlob.type || 'image/jpeg',
                            name: `wine_${item.id}_${item.vintage}.jpg`,
                        };
                        formData.append('image', imageFile as any);
                    } catch (error) {
                        console.error('Failed to fetch image:', error);
                    }
                }

                const response = await wineService.createWine(formData);

                setIsCreating(false);

                if (response.isError && response.status !== 409) {
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        response.message || localization.t('common.somethingWentWrong'),
                    );
                    return;
                }

                const wineId = response.status === 409 
                    ? Number(response.errors?.wineId || item.id)
                    : response.data?.id || item.id;

                wineModel.clear();
                wineModel.wine = {
                    id: wineId,
                    name: item.name,
                    vintage: item.vintage,
                };
            } else {
                wineModel.clear();
                wineModel.wine = {
                    id: item.id,
                    name: item.name,
                    vintage: item.vintage,
                };
            }

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
                    value: item.vintage != null ? item.vintage.toString() : '',
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
            wineModel.customVintage = null;
            navigation.navigate('WineLookView');
        } catch (error) {
            setIsCreating(false);
            console.error('Create wine for new vintage error:', error);
            toastService.showError(
                localization.t('common.errorHappened'),
                localization.t('common.somethingWentWrong'),
            );
        }
    }, [navigation, item]);

    return { onPress, isCreating };
};
