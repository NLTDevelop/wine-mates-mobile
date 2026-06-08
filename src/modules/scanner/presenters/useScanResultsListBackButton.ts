import { CommonActions, StackActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { BackHandler } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { wineModel } from '@/entities/wine/WineModel';
import { wineSetScannerModel } from '@/entities/events/WineSetScannerModel';

export const useScanResultsListBackButton = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const onPressBack = useCallback(() => {
        const addWineSetScannerState = wineSetScannerModel.state;

        wineModel.clear();

        if (addWineSetScannerState) {
            wineSetScannerModel.clear();
            navigation.dispatch(
                StackActions.popTo('AddWineSetView', {
                    draft: addWineSetScannerState.draft,
                    initialSelectedWines: addWineSetScannerState.selectedWines,
                    editEventId: addWineSetScannerState.editEventId,
                    isDuplicateEvent: addWineSetScannerState.isDuplicateEvent,
                }),
            );
            return;
        }

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
    }, [navigation]);

    useFocusEffect(
        useCallback(() => {
            const onHardwareBackPress = () => {
                onPressBack();
                return true;
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onHardwareBackPress);

            return () => {
                subscription.remove();
            };
        }, [onPressBack]),
    );

    return { onPressBack };
};
