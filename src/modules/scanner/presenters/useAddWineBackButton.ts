import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { wineModel } from '@/entities/wine/WineModel';
import { wineSetScannerModel } from '@/entities/events/WineSetScannerModel';

export const useAddWineBackButton = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute();
    const params = route.params as { hasResults?: boolean } | undefined;
    const hasResults = params?.hasResults ?? false;

    const onPressBack = () => {
        const addWineSetScannerState = wineSetScannerModel.state;

        wineModel.clear();

        if (addWineSetScannerState) {
            wineSetScannerModel.clear();
            navigation.navigate('AddWineSetView', {
                draft: addWineSetScannerState.draft,
                initialSelectedWines: addWineSetScannerState.selectedWines,
            });
            return;
        }

        if (hasResults) {
            navigation.goBack();
        } else {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'TabNavigator',
                            state: {
                                index: 0,
                                routes: [{ name: 'HomeStack' }],
                            },
                        },
                    ],
                }),
            );
        }
    };

    return { onPressBack };
};
