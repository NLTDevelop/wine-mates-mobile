import { useCallback, useMemo, useState } from 'react';
import { localization } from '@/UIProvider/localization/Localization';

interface IItem {
    value: boolean;
    label: string;
    onPress: () => void;
}

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

    const onSelect = useCallback((nextValue: boolean) => {
        setDraft(nextValue);
    }, []);

    const onConfirm = useCallback(() => {
        setIsVisible(false);

        requestAnimationFrame(() => {
            onChange(draft);
        });
    }, [draft, onChange]);

    const createOnSelect = useCallback((nextValue: boolean) => {
        return () => {
            onSelect(nextValue);
        };
    }, [onSelect]);

    const items = useMemo<IItem[]>(() => {
        return [
            {
                value: true,
                label: localization.t('eventDetails.confirmationRequired'),
                onPress: createOnSelect(true),
            },
            {
                value: false,
                label: localization.t('eventDetails.noConfirmation'),
                onPress: createOnSelect(false),
            },
        ];
    }, [createOnSelect]);

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
            isVisible,
            draft,
            items,
            selectedText,
            onOpen,
            onClose,
            onConfirm,
        };
    }, [draft, isVisible, items, onClose, onConfirm, onOpen, selectedText]);
};
