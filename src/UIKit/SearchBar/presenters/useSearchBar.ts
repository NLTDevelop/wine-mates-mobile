import { useCallback, useState } from 'react';
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';

export const useSearchBar = (
    onChangeText?: (text: string) => void,
    onFocus?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void,
    onBlur?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void,
) => {
    const [isFocused, setIsFocused] = useState(false);

    const onFocusInput = useCallback((event: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setIsFocused(true);
        onFocus?.(event);
    }, [onFocus]);

    const onBlurInput = useCallback((event: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setIsFocused(false);
        onBlur?.(event);
    }, [onBlur]);

    const onClearText = useCallback(() => onChangeText?.(''), [onChangeText]);

    return { isFocused, onFocusInput, onBlurInput, onClearText };
};
