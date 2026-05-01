import { useCallback, useMemo, useState } from 'react';
import { localization } from '@/UIProvider/localization/Localization';
import { Sex } from '@/entities/events/enums/Sex';

interface IProps {
    value?: Sex;
    onChange: (value?: Sex) => void;
}

export const useSexModal = ({ value, onChange }: IProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [draft, setDraft] = useState<Sex | undefined>(value);

    const onOpen = useCallback(() => {
        setDraft(value);
        setIsVisible(true);
    }, [value]);

    const onClose = useCallback(() => {
        setIsVisible(false);
    }, []);

    const onSelect = useCallback((nextValue: Sex) => {
        setDraft(nextValue);
    }, []);

    const onConfirm = useCallback(() => {
        setIsVisible(false);

        requestAnimationFrame(() => {
            onChange(draft);
        });
    }, [draft, onChange]);

    const selectedText = useMemo(() => {
        if (!value) {
            return localization.t('eventFilters.selectSex');
        }

        if (value === Sex.Men) {
            return localization.t('eventFilters.men');
        }

        if (value === Sex.Women) {
            return localization.t('eventFilters.women');
        }

        return localization.t('eventFilters.all');
    }, [value]);

    return useMemo(() => {
        return {
            isVisible,
            draft,
            selectedText,
            onOpen,
            onClose,
            onSelect,
            onConfirm,
        };
    }, [draft, isVisible, onClose, onConfirm, onOpen, onSelect, selectedText]);
};
