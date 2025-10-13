import { useState } from 'react';

export const useRegistration = () => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isError, setIsError] = useState({ status: false, errorText: '' });

    const onChangePhone = (text: string) => {
        setIsError({ status: false, errorText: '' });
        setPhone(text);
    };

    const onChangeEmail = (text: string) => {
        setIsError({ status: false, errorText: '' });
        setEmail(text);
    };

    return { email, phone, isError, onChangeEmail, onChangePhone };
};
