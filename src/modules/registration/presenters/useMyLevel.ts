import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { registerUserModel } from '@/entities/users/RegisterUserModel';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const useMyLevel = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const handleWineLoverPress = () => {
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
    };

    const handleWineExpertPress = () => {
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
    };

    const handleWinemakerPress = () => {
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
    };

    return { handleWineLoverPress, handleWineExpertPress, handleWinemakerPress };
};
