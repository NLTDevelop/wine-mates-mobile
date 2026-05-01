import { useCallback, useMemo, useState } from 'react';
import { localization } from '@/UIProvider/localization/Localization';
import { ISingleSelectModalItem } from '../types/ISingleSelectModalItem';

interface IProps {
    value?: boolean;
    onChange: (value?: boolean) => void;
}

export const useConfirmationRequiredModal = ({ value, onChange }: IProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [draft, setDraft] = useState<boolean | undefined>(value);

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

    const onSelectConfirmationRequired = useCallback(() => {
        setDraft(true);
    }, []);

    const onSelectNoConfirmation = useCallback(() => {
        setDraft(false);
    }, []);

    const items = useMemo<ISingleSelectModalItem[]>(() => {
        return [
            {
                key: 'confirmation-required',
                label: localization.t('eventDetails.confirmationRequired'),
                isSelected: draft === true,
                onPress: onSelectConfirmationRequired,
            },
            {
                key: 'no-confirmation',
                label: localization.t('eventDetails.noConfirmation'),
                isSelected: draft === false,
                onPress: onSelectNoConfirmation,
            },
        ];
    }, [draft, onSelectConfirmationRequired, onSelectNoConfirmation]);

    const selectedText = useMemo(() => {
        if (typeof value === 'undefined') {
            return localization.t('eventDetails.confirmationAvailability');
        }

        if (value) {
            return localization.t('eventDetails.confirmationRequired');
        }

        return localization.t('eventDetails.noConfirmation');
    }, [value]);

    return useMemo(() => {
        return {
            title: localization.t('eventDetails.confirmationAvailability'),
            isVisible,
            items,
            selectedText,
            onOpen,
            onClose,
            onConfirm,
        };
    }, [isVisible, items, onClose, onConfirm, onOpen, selectedText]);
};
