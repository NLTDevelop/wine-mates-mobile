import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { featuresService } from '@/entities/features/FeaturesService';
import { userService } from '@/entities/users/UserService';

export const completeAuthorization = async (navigation: NativeStackNavigationProp<any>) => {
    await Promise.all([
        userService.me(),
        featuresService.list(),
    ]);

    navigation.reset({ index: 0, routes: [{ name: 'TabNavigator' }] });
};
