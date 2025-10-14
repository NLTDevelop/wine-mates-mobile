import { useCallback, useState } from "react";

export const useSearchBar = (onChangeText?: (text: string) => void) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = useCallback(() => setIsFocused(true), []);
    const handleBlur = useCallback(() => setIsFocused(false), []);
    const onClearText = useCallback(() => onChangeText?.(''), [onChangeText])
  
    return { isFocused, handleFocus, handleBlur, onClearText };
}