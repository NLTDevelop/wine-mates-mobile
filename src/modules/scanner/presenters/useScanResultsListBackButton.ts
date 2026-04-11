import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import { wineModel } from '@/entities/wine/WineModel';

export const useScanResultsListBackButton = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const onPressBack = () => {
        wineModel.clear();

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
    };

    return { onPressBack };
};
