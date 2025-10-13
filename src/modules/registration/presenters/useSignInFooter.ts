import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export const useSignInFooter = () => {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const handleSgnInNavigation = () => {
        navigation.navigate('SignInView');
    };

    return { handleSgnInNavigation };
};
