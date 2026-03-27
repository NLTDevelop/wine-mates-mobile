import { userModel } from '@/entities/users/UserModel';
import { userService } from '@/entities/users/UserService';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect } from 'react';

export const useSplash = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    useEffect(() => {
        setTimeout(() => {
            (async () => {
                if (userModel.token) {
                    const response = await userService.me();
                    if (response.isError) {
                        userModel.clear();
                        navigation.reset({ index: 0, routes: [{ name: 'WelcomeView' }] });
                        return;
                    }
                    navigation.reset({ index: 0, routes: [{ name: 'TabNavigator' }] });
                } else {
                    navigation.reset({ index: 0, routes: [{ name: 'WelcomeView' }] });
                }
            })();
        }, 2000);
    }, [navigation]);
};
