import { useCallback, useState } from 'react';
import { TextInputProps } from 'react-native';

export const useSearchBar = (
    onChangeText?: TextInputProps['onChangeText'],
    onFocus?: TextInputProps['onFocus'],
    onBlur?: TextInputProps['onBlur'],
) => {
    const [isFocused, setIsFocused] = useState(false);

    const onFocusInput = useCallback<NonNullable<TextInputProps['onFocus']>>(event => {
        setIsFocused(true);
        onFocus?.(event);
    }, [onFocus]);

    const onBlurInput = useCallback<NonNullable<TextInputProps['onBlur']>>(event => {
        setIsFocused(false);
        onBlur?.(event);
    }, [onBlur]);

    const onClearText = useCallback(() => onChangeText?.(''), [onChangeText]);

    return { isFocused, onFocusInput, onBlurInput, onClearText };
};
