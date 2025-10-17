import { useCallback, useState } from 'react';

export const useBirthdaySelector = (onChangeBirthdayDate: (date: string) => void) => {
    const [isOpened, setIsOpened] = useState(false);

    const handleSelect = useCallback((date: string) => {
        setIsOpened(false);
        onChangeBirthdayDate(date)
    }, [onChangeBirthdayDate]);

    const handlePress = useCallback(() => {
        setIsOpened(true);
    }, []);

    return { handleSelect, handlePress, isOpened };
};
