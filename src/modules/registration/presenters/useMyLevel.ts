import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const useMyLevel = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const handleWineLoverPress = () => {
        navigation.navigate('RegistrationView');
    };

    const handleWineExpertPress = () => {
        navigation.navigate('RegistrationView');
    };

    const handleWinemakerPress = () => {
        navigation.navigate('RegistrationView');
    };

    return { handleWineLoverPress, handleWineExpertPress, handleWinemakerPress };
};
