import { useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const usePersonalDetails = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [form, setForm] = useState({ firstName: '', lastName: '', birthDay: '', occupation: '', wineryName: '' });
    const [isError, setIsError] = useState({ status: false, errorText: '' });

    const onChangeFirstName = useCallback((value: string) => {
        setForm(prev => ({ ...prev, firstName: value || '' }));
        setIsError({ status: false, errorText: '' });
    }, []);

    const onChangeLastName = useCallback((value: string) => {
        setForm(prev => ({ ...prev, lastName: value || '' }));
        setIsError({ status: false, errorText: '' });
    }, []);

    const onChangeBirthDay = useCallback((value: string) => {
        setForm(prev => ({ ...prev, birthDay: value || '' }));
        setIsError({ status: false, errorText: '' });
    }, []);

    const onChangeOccupation = useCallback((value: string) => {
        setForm(prev => ({ ...prev, occupation: value || '' }));
        setIsError({ status: false, errorText: '' });
    }, []);

    const onChangeWineryName = useCallback((value: string) => {
        setForm(prev => ({ ...prev, wineryName: value || '' }));
        setIsError({ status: false, errorText: '' });
    }, []);

    const handleNextPress = useCallback(async () => {
            // if (form.password.length === 0) {
            //     return setIsError({ status: true, errorText: localization.t('authentication.newPasswordIsRequired') });
            // }

            // if (form.confirmPassword.length === 0) {
            //     return setIsError({
            //         status: true,
            //         errorText: localization.t('authentication.confirmNewPasswordIsRequired'),
            //     });
            // }

            // if (form.password !== form.confirmPassword) {
            //     return setIsError({ status: true, errorText: localization.t('authentication.confirmPasswordError') });
            // }
            navigation.navigate('')
    }, [navigation]);

    return { 
        form, onChangeFirstName, onChangeLastName, onChangeBirthDay, onChangeOccupation, handleNextPress, onChangeWineryName,
        isError
    };
};
