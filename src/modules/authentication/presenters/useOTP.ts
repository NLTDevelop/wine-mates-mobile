import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useEffect, useState } from 'react';
import { useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { localization } from '../../../UIProvider/localization/Localization';

const CELL_COUNT = 4;

export const useOTP = () => {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const { email } = useRoute().params as { email: string };
    const [value, setValue] = useState('');
    const [isError, setIsError] = useState({ status: false, errorText: '' });
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });
    const [isLoading, setIsLoading] = useState(false);

    const [timer, setTimer] = useState(59);
    const [isResendDisabled, setIsResendDisabled] = useState(true);

    useEffect(() => {
        if (timer === 0) {
            setIsResendDisabled(false);
            return;
        }

        setIsResendDisabled(true);

        const timeout = setTimeout(() => {
            setTimer(prevState => prevState - 1);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [timer]);

    const handleOTPValueChange = (otp: string) => {
        setIsError({ status: false, errorText: '' });
        setValue(otp);
    };

    const handleResetPress = useCallback(() => {
        try {
            if (value.length < CELL_COUNT) {
                setIsError({ status: true, errorText: localization.t('authentication.incompleteCode') });
                return;
            }
              
            setIsLoading(true);
            //TODO
            navigation.navigate('CreateNewPasswordView');
        } finally {
            setIsLoading(false);
        }
    }, [navigation, value]);

    const handleResendCode = useCallback(() => {
        try {
            //TODO
            setTimer(59);
        } finally {
        }
    }, []);

    return { 
        email, props, getCellOnLayoutHandler, ref, value, handleOTPValueChange, isError, isLoading, handleResetPress, 
        CELL_COUNT, timer, isResendDisabled, handleResendCode
    };
};
