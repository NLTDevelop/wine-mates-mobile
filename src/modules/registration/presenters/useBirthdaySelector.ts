import { useCallback, useState } from 'react';

export const useBirthdaySelector = (onChangeBirthdayDate: (dateISO: string) => void) => {
    const [isOpened, setIsOpened] = useState(false);
    const [pickerDate, setPickerDateState] = useState(new Date());

    const setPickerDate = useCallback(
        (date: Date) => {
            setPickerDateState(date);
            const isoString = date.toISOString();
            onChangeBirthdayDate(isoString);
        },
        [onChangeBirthdayDate]
    );

    const handlePress = useCallback(() => {
        setIsOpened(prev => !prev);
    }, []);

    return { handlePress, isOpened, pickerDate, setPickerDate };
};
