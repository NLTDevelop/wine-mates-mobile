import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const useSettingsHeader = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const onProfilePress = useCallback(() => {
        navigation.navigate('ProfileDetailsView');
    }, [navigation]);

    return {
        onProfilePress,
    };
};
