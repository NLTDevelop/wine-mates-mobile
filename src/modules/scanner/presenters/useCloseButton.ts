import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const useCloseButton = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const onPress = () => {
        navigation.navigate('ScanResultsListView', undefined, { pop: true });
    };

    return { onPress };
};
