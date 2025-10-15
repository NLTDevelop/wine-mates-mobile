import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { localization } from '@/UIProvider/localization/Localization';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useOTPTimer } from '@/modules/authentication/presenters/useOTPTimer';

const CELL_COUNT = 4;

export const useOTP = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { email } = useRoute().params as { email: string };
    const [value, setValue] = useState('');
    const [isError, setIsError] = useState({ status: false, errorText: '' });
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });
    const [isLoading, setIsLoading] = useState(false);

    const { remaining, isActive, start: startTimer } = useOTPTimer();

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
            startTimer();
        } finally {
        }
    }, [startTimer]);

    return { 
        email, props, getCellOnLayoutHandler, ref, value, handleOTPValueChange, isError, isLoading, handleResetPress, 
        CELL_COUNT, timer: remaining, isResendDisabled: isActive, handleResendCode
    };
};
