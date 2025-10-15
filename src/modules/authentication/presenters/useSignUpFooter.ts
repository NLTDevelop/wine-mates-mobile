import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const useSignUpFooter = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const handleSgnUpNavigation = () => {
        navigation.navigate('MyLevelView');
    };

    return { handleSgnUpNavigation };
};
