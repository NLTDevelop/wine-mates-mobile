import { useMemo } from 'react';
import { useUiContext } from '@/UIProvider';

interface IUseDateTimePickerModalProps {
    mode: 'date' | 'time';
    title?: string;
}

type PickerTheme = 'auto' | 'light' | 'dark';

export const useDateTimePickerModal = ({ mode, title }: IUseDateTimePickerModalProps) => {
    const { t, locale, theme } = useUiContext();
    const normalizedLocale = useMemo(() => {
        const preparedLocale = (locale || 'en').trim().replace('_', '-');

        if (!preparedLocale) {
            return 'en';
        }

        return preparedLocale;
    }, [locale]);

    const timePickerLocale = 'en-GB';

    const pickerLocale = mode === 'time' ? timePickerLocale : normalizedLocale;
    const modalTitle = title || (mode === 'date' ? t('event.eventDate') : t('event.eventTime'));
    const pickerTheme: PickerTheme = theme === 'light' ? 'light' : 'dark';

    return {
        pickerLocale,
        modalTitle,
        pickerTheme,
    };
};
