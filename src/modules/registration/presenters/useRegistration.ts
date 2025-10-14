import { useCallback, useState } from 'react';

export const useRegistration = () => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isError, setIsError] = useState({ status: false, errorText: '' });

    const onChangePhone = useCallback((text: string) => {
        setIsError({ status: false, errorText: '' });
        setPhone(text);
    }, []);

    const onChangeEmail = useCallback((text: string) => {
        setIsError({ status: false, errorText: '' });
        setEmail(text);
    }, []);

    const clearPhone = useCallback(() => {
        setPhone('');
    }, []);

    return { email, phone, isError, onChangeEmail, onChangePhone, clearPhone };
};
