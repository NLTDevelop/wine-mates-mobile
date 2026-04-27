import { useEffect, useMemo, useReducer } from 'react';
import { useUiContext } from '@/UIProvider';

interface IUseDateTimePickerModalProps {
    mode: 'date' | 'time';
    title?: string;
    visible: boolean;
}

type PickerTheme = 'auto' | 'light' | 'dark';

export const useDateTimePickerModal = ({ mode, title, visible }: IUseDateTimePickerModalProps) => {
    const { t, locale, theme } = useUiContext();
    const [openCounter, increaseOpenCounter] = useReducer((previousValue: number) => previousValue + 1, 0);

    const normalizedLocale = useMemo(() => {
        const preparedLocale = (locale || 'en').trim().replace('_', '-');

        if (!preparedLocale) {
            return 'en';
        }

        return preparedLocale;
    }, [locale]);

    const timePickerLocale = useMemo(() => {
        const languageCode = normalizedLocale.split('-')[0];

        if (!languageCode) {
            return 'en-001';
        }

        return `${languageCode}-001`;
    }, [normalizedLocale]);

    const pickerLocale = mode === 'time' ? timePickerLocale : normalizedLocale;
    const modalTitle = title || (mode === 'date' ? t('event.eventDate') : t('event.eventTime'));
    const pickerTheme: PickerTheme = theme === 'light' ? 'light' : 'dark';

    useEffect(() => {
        if (visible) {
            increaseOpenCounter();
        }
    }, [visible]);

    const pickerKey = useMemo(() => `${mode}-${openCounter}`, [mode, openCounter]);

    return {
        pickerLocale,
        modalTitle,
        pickerTheme,
        pickerKey,
    };
};
