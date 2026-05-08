import { useCallback, useEffect, useState } from 'react';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { wineService } from '@/entities/wine/WineService';
import { wineListModel } from '@/entities/wine/WineListModel';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { wineModel } from '@/entities/wine/WineModel';
import { IAIData } from '@/entities/wine/types/IAIData';
import { IWineSetSearchItem } from '@/entities/wine/types/IWineSetSearchItem';
import { wineSetScannerModel } from '@/entities/events/WineSetScannerModel';

const getWineSetSearchItem = (item: IWineListItem): IWineSetSearchItem => {
    return {
        id: item.id,
        name: item.name || '',
        producer: item.producer,
        vintage: item.vintage,
        grapeVariety: item.grapeVariety,
        country: item.country,
        region: item.region,
        image: item.image || item.defaultImage,
    };
};

export const useScannerResultsList = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [isLoading, setIsLoading] = useState(false);
    const [aiData, setAiData] = useState<IAIData | null>(null);
    const [data, setData] = useState<IWineListItem[] | null>(null);

    const getList = useCallback(async () => {
        setIsLoading(true);

        const formData = new FormData();

        if (wineModel.image) {
            formData.append('image', wineModel.image as any);
        }

        const response = await wineService.list(formData);

        if (response.isError || !response.data) {
            toastService.showError(
                localization.t('common.errorHappened'),
                response.message || localization.t('common.somethingWentWrong'),
            );
        } else {
            setAiData(response.data.aiData);
            setData(response.data.raws);
            if (response.data.raws.length === 0) {
                navigation.navigate('AddWineView', { aiData: response.data.aiData, hasResults: false });
            }
        }

        setIsLoading(false);
    }, [navigation]);

    const onRefresh = useCallback(async () => {
        await getList();
    }, [getList]);

    useEffect(() => {
        Promise.resolve().then(() => {
            onRefresh();
        });
    }, [onRefresh]);

    useEffect(() => {
        return () => wineListModel.clear();
    }, []);

    const onItemPress = useCallback((item: IWineListItem) => {
        const addWineSetScannerState = wineSetScannerModel.state;

        if (addWineSetScannerState) {
            wineSetScannerModel.clear();
            navigation.navigate('AddWineSetView', {
                draft: addWineSetScannerState.draft,
                initialSelectedWines: addWineSetScannerState.selectedWines,
                selectedWine: getWineSetSearchItem(item),
            });
            return;
        }

        navigation.navigate('WineDetailsView', { wineId: item.id, fromScanner: true });
    },[navigation]);

    const onAddWinePress = useCallback(() => {
        navigation.navigate('AddWineView', { aiData, hasResults: true });
    },[navigation, aiData]);

    return { data, isLoading, onRefresh, onItemPress, onAddWinePress };
};
