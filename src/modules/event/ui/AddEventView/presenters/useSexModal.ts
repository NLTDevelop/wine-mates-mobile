import { useCallback, useMemo, useState } from 'react';
import { localization } from '@/UIProvider/localization/Localization';
import { Sex } from '@/entities/events/enums/Sex';
import { ISingleSelectModalItem } from '../types/ISingleSelectModalItem';

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

    const onConfirm = useCallback(() => {
        setIsVisible(false);

        requestAnimationFrame(() => {
            onChange(draft);
        });
    }, [draft, onChange]);

    const onSelectAll = useCallback(() => {
        setDraft(Sex.All);
    }, []);

    const onSelectMen = useCallback(() => {
        setDraft(Sex.Men);
    }, []);

    const onSelectWomen = useCallback(() => {
        setDraft(Sex.Women);
    }, []);

    const items = useMemo<ISingleSelectModalItem[]>(() => {
        return [
            {
                key: Sex.All,
                label: localization.t('eventFilters.all'),
                isSelected: draft === Sex.All,
                onPress: onSelectAll,
            },
            {
                key: Sex.Men,
                label: localization.t('eventFilters.men'),
                isSelected: draft === Sex.Men,
                onPress: onSelectMen,
            },
            {
                key: Sex.Women,
                label: localization.t('eventFilters.women'),
                isSelected: draft === Sex.Women,
                onPress: onSelectWomen,
            },
        ];
    }, [draft, onSelectAll, onSelectMen, onSelectWomen]);

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
            title: localization.t('eventFilters.sex'),
            isVisible,
            selectedText,
            items,
            onOpen,
            onClose,
            onConfirm,
        };
    }, [isVisible, items, onClose, onConfirm, onOpen, selectedText]);
};
