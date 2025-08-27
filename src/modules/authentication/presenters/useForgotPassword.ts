import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useState } from 'react';

export const useForgotPassword = () => {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onChangeEmail = (text: string) => {
        setEmail(text);
    };

    const handleSendPress = useCallback(() => {
        try {
            setIsLoading(true);
            //TODO
            navigation.navigate('OTPView', { email });
        } finally {
            setIsLoading(false);
        }
    }, [navigation]);

    return { email, onChangeEmail, isLoading, handleSendPress };
};
