import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const useWelcome = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const handleSignInPress = () => {
        navigation.navigate('SignInView');
    };

    const handleJoinNowPress = () => {
        navigation.navigate('MyLevelView');
    };

    return { handleSignInPress, handleJoinNowPress };
};
