import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { registerUserModel } from '@/entities/users/RegisterUserModel';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';

export const useMyLevel = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const handleWineLoverPress = useCallback(() => {
        registerUserModel.user = {
            email: '',
            password: '',
            phoneNumber: '',
            country: '',
            wineExperienceLevel: WineExperienceLevelEnum.LOVER,
            firstName: '',
            lastName: '',
            birthday: '',
        }
        navigation.navigate('RegistrationView');
    }, [navigation]);

    const handleWineExpertPress = useCallback(() => {
        registerUserModel.user = {
            email: '',
            password: '',
            phoneNumber: '',
            country: '',
            wineExperienceLevel: WineExperienceLevelEnum.EXPERT,
            firstName: '',
            lastName: '',
            birthday: '',
            occupation: '',
        }
        navigation.navigate('RegistrationView');
    }, [navigation]);

    const handleWinemakerPress = useCallback(() => {
        registerUserModel.user = {
            email: '',
            password: '',
            phoneNumber: '',
            country: '',
            wineExperienceLevel: WineExperienceLevelEnum.CREATOR,
            firstName: '',
            lastName: '',
            birthday: '',
            wineryName: '',
        }
        navigation.navigate('RegistrationView');
    }, [navigation]);

    return { handleWineLoverPress, handleWineExpertPress, handleWinemakerPress };
};
