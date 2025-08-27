import { useCallback } from 'react';

export const useValidator = () => {
    const validateEmptyString = useCallback((value: string) => {
        if (!value.trim()) {
            return { isValid: false, error: 'emptyInput' };
        }
        if (value.length > 50) {
            return { isValid: false, error: 'tooLong' };
        }
        return { isValid: true, error: '' };
    }, []);

    const validateEmail = useCallback(
        (email: string) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const emptyCheck = validateEmptyString(email);
            if (!emptyCheck.isValid) return emptyCheck;
            if (!emailRegex.test(email)) {
                return { isValid: false, error: 'invalidEmail' };
            }
            return { isValid: true, error: '' };
        },
        [validateEmptyString],
    );

    const validatePassword = useCallback(
        (password: string) => {
            return validateEmptyString(password);
        },
        [validateEmptyString],
    );

    return { validateEmptyString, validateEmail, validatePassword };
};
