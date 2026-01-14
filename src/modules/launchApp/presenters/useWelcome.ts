import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const useWelcome = (onHide: () => void) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const handleSignInPress = () => {
        navigation.navigate('SignInView');
    };

    const handleJoinNowPress = () => {
        onHide();
        setTimeout(() => {
            navigation.navigate('MyLevelView');
        }, 400);
    };

    return { handleSignInPress, handleJoinNowPress };
};
