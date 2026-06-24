import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const useChooseWineSection = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const onMyselfPress = useCallback(() => {
        navigation.navigate('ChooseWineFiltersView', { mode: 'myself' });
    }, [navigation]);

    const onFriendPress = useCallback(() => {
        navigation.navigate('ChooseWineFiltersView', { mode: 'friend' });
    }, [navigation]);

    return {
        onMyselfPress,
        onFriendPress,
    };
};
