import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export const useWelcome = () => {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const handleSignInPress = () => {
        navigation.navigate('SignInView');
    };

    return { handleSignInPress };
};
