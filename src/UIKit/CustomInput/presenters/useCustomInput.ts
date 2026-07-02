import { useCallback, useImperativeHandle, useRef, useState } from 'react';
import { type TextInput, type TextInputProps } from 'react-native';

interface UseCustomInputParams extends TextInputProps {
    secureTextEntry?: boolean;
}

export const useCustomInput = (props: UseCustomInputParams, ref: React.Ref<TextInput>) => {
    const { secureTextEntry = false, onFocus, onBlur } = props;
    const [isFocused, setFocused] = useState(false);
    const [isPasswordVisible, setPasswordVisible] = useState(secureTextEntry);
    const inputRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => inputRef.current as TextInput);

    const onInputFocus: TextInputProps['onFocus'] = e => {
        setFocused(true);
        onFocus?.(e);
    };

    const onInputBlur: TextInputProps['onBlur'] = e => {
        setFocused(false);
        onBlur?.(e);
    };

    const onPasswordVisibilityPress = useCallback(() => {
        setPasswordVisible(prev => !prev);
    }, []);

    return { isFocused, isPasswordVisible, onPasswordVisibilityPress, onInputFocus, onInputBlur, inputRef };
};
