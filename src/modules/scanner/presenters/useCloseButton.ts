import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { clearTasteCharacteristicsCache } from '@/libs/storage/cacheUtils';
import { clearWineModel } from '@/entities/wine/services/WineModelService';

type NavigationSource = 'scanner' | 'wineDetails';

export const useCloseButton = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute();
    const params = route.params as { source?: NavigationSource; wineId?: number } | undefined;
    const source = params?.source ?? 'scanner';

    const onPress = () => {
        clearTasteCharacteristicsCache();
        clearWineModel();

        if (source === 'wineDetails') {
            const wineId = (route.params as { wineId?: number } | undefined)?.wineId;
            
            navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [
                        {
                            name: 'TabNavigator',
                            state: {
                                index: 2,
                                routes: [
                                    { name: 'ScannerStack' },
                                    { name: 'EventStack' },
                                    { name: 'ProfileStack' },
                                ],
                            },
                        },
                        { name: 'WineDetailsView', params: { wineId, vintages: 'All' } },
                    ],
                }),
            );
        } else {
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
        }
    };

    return { onPress };
};
