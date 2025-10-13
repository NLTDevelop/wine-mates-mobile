import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export const useMyLevel = () => {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const handleWineLoverPress = () => {
        navigation.navigate('');
    };

    const handleWineExpertPress = () => {
        navigation.navigate('');
    };

    const handleWinemakerPress = () => {
        navigation.navigate('');
    };

    return { handleWineLoverPress, handleWineExpertPress, handleWinemakerPress };
};
