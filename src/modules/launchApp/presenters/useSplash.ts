import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect } from 'react';

export const useSplash = () => {
    const navigation = useNavigation<StackNavigationProp<any>>();

    useEffect(() => {
        setTimeout(() => {
            // if (userModel.token) {
            //     navigation.reset({ index: 0, routes: [{ name: 'TabNavigator', params: { screen: 'Home' } }] });
            // } else {
            //     navigation.reset({ index: 0, routes: [{ name: 'WelcomeView' }] });
            // }
            navigation.reset({ index: 0, routes: [{ name: 'WelcomeView' }] });
        }, 2000);
    }, [navigation]);
};
