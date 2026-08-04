import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { BackHandler } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { wineSetScannerModel } from '@/entities/events/WineSetScannerModel';
import { clearWineModel } from '@/entities/wine/services/WineModelService';
import { getWineScannerReturnAction } from '@/modules/scanner/utils/getWineScannerReturnAction';

export const useScanResultsListBackButton = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const onPressBack = useCallback(() => {
        const addWineSetScannerState = wineSetScannerModel.state;

        clearWineModel();

        if (addWineSetScannerState) {
            wineSetScannerModel.clear();
            navigation.dispatch(getWineScannerReturnAction(addWineSetScannerState));
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
