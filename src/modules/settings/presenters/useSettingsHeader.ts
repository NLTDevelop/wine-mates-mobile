import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { userModel } from '@/entities/users/UserModel';

export const useSettingsHeader = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const onProfilePress = useCallback(() => {
        navigation.navigate(userModel.winery ? 'WineryProfileDetailsView' : 'ProfileDetailsView');
    }, [navigation]);

    return {
        onProfilePress,
    };
};
