import { wineModel } from '@/entities/wine/WineModel';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { clearTasteCharacteristicsCache } from '@/libs/storage/cacheUtils';

export const useCloseButton = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const onPress = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: 'TabNavigator',
                        state: {
                            index: 0,
                            routes: [
                                {
                                    name: 'ScannerStack',
                                    state: {
                                        index: 1,
                                        routes: [{ name: 'ScannerView' }, { name: 'ScanResultsListView' }],
                                    },
                                },
                            ],
                        },
                    },
                ],
            }),
        );
        clearTasteCharacteristicsCache();
        wineModel.clear();
    };

    return { onPress };
};
