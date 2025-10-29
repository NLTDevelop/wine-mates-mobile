import { featuresModel } from '@/entities/features/FeaturesModel';
import { userModel } from '@/entities/users/UserModel';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect } from 'react';

export const useIsUserAuthorized = () => {
    const token = userModel.token;
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    useEffect(() => {
        if (!token) {
            onExit();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const onExit = async () => {
        try {
            userModel.clear();
            featuresModel.clear();

            await GoogleSignin.signOut().catch(() => {});
        } finally {
            navigation.reset({ index: 0, routes: [{ name: 'WelcomeView' }] });
        }
    };
};
