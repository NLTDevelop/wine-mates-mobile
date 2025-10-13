import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const useSignInFooter = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const handleSgnInNavigation = () => {
        navigation.navigate('SignInView');
    };

    return { handleSgnInNavigation };
};
