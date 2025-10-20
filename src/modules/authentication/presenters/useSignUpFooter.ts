import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const useSignUpFooter = (onHide: () => void) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const handleSgnUpNavigation = () => {
        onHide();
        setTimeout(() => {
            navigation.navigate('MyLevelView');
        }, 400);
    };

    return { handleSgnUpNavigation };
};
