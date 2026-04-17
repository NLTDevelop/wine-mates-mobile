import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import { wineModel } from '@/entities/wine/WineModel';

export const useAddWineBackButton = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute();
    const params = route.params as { hasResults?: boolean } | undefined;
    const hasResults = params?.hasResults ?? false;

    const onPressBack = () => {
        wineModel.clear();

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
