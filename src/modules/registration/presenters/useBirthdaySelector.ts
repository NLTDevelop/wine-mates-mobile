import { useCallback, useMemo, useState } from 'react';

const MIN_AGE = 18;

const getMaximumBirthdayDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - MIN_AGE);

    return date;
};

const getPickerDate = (birthday: string, fallbackDate: Date) => {
    if (!birthday) {
        return fallbackDate;
    }

    const date = new Date(birthday);

    if (Number.isNaN(date.getTime()) || date > fallbackDate) {
        return fallbackDate;
    }

    return date;
};

export const useBirthdaySelector = (birthday: string, onChangeBirthdayDate: (dateISO: string) => void) => {
    const [isOpened, setIsOpened] = useState(false);
    const maximumBirthdayDate = useMemo(() => getMaximumBirthdayDate(), []);
    const [pickerDate, setPickerDate] = useState(() => getPickerDate(birthday, maximumBirthdayDate));

    const onDateChange = useCallback((date: Date) => {
        setPickerDate(date);
    }, []);

    const onPress = useCallback(() => {
        setPickerDate(getPickerDate(birthday, maximumBirthdayDate));
        setIsOpened(true);
    }, [birthday, maximumBirthdayDate]);

    const onClose = useCallback(() => {
        setIsOpened(false);
    }, []);

    const onConfirm = useCallback(() => {
        onChangeBirthdayDate(pickerDate.toISOString());
        setIsOpened(false);
    }, [onChangeBirthdayDate, pickerDate]);

    const onInputFocus = useCallback(() => {
        setIsOpened(false);
    }, []);

    return {
        onPress,
        onClose,
        onConfirm,
        onInputFocus,
        onDateChange,
        isOpened,
        pickerDate,
        maximumBirthdayDate,
    };
};
