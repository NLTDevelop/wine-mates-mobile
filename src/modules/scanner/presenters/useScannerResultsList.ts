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
        } else if (response.data && 'aiData' in response.data) {
            setAiData(response.data.aiData);
            navigation.navigate('AddWineView', { aiData: response.data.aiData });
        } else {
            setData(response.data.raws);
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

    const handleItemPress = useCallback((item: IWineListItem) => {
        navigation.navigate('WineDetailsView', {wineId: item.id});
    },[navigation]);

    const handleAddWinePress = useCallback(() => {
        navigation.navigate('AddWineView', { aiData });
    },[navigation, aiData]);

    return { data, isLoading, onRefresh, handleItemPress, handleAddWinePress };
};
