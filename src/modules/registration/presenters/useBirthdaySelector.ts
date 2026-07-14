import { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardAwareScrollViewRef } from 'react-native-keyboard-controller';

export const useBirthdaySelector = (onChangeBirthdayDate: (dateISO: string) => void) => {
    const [isOpened, setIsOpened] = useState(false);
    const [pickerDate, setPickerDateState] = useState(new Date());
    const scrollRef = useRef<KeyboardAwareScrollViewRef | null>(null);

    useEffect(() => {
        if (!isOpened) {
            return;
        }
        const frame = requestAnimationFrame(() => {
            scrollRef.current?.scrollToEnd({ animated: true });
        });
        return () => cancelAnimationFrame(frame);
    }, [isOpened]);

    const setPickerDate = useCallback(
        (date: Date) => {
            setPickerDateState(date);
            const isoString = date.toISOString();
            onChangeBirthdayDate(isoString);
        },
        [onChangeBirthdayDate],
    );

    const onPress = useCallback(() => {
        setIsOpened(prev => !prev);
    }, []);

    const onInputFocus = useCallback(() => {
        setIsOpened(false);
    }, []);

    return { onPress, onInputFocus, isOpened, pickerDate, setPickerDate, scrollRef };
};
