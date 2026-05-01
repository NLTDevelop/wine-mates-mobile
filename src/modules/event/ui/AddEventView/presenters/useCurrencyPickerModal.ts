import { useCallback, useMemo, useState } from 'react';
import { ICurrencyOption } from '@/modules/event/types/ICurrencyOption';

interface IProps {
    value: string;
    currencies: string[];
    onChange: (value: string) => void;
}

export const useCurrencyPickerModal = ({ value, currencies, onChange }: IProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [draft, setDraft] = useState(value);

    const onOpen = useCallback(() => {
        setDraft(value);
        setIsVisible(true);
    }, [value]);

    const onClose = useCallback(() => {
        setIsVisible(false);
    }, []);

    const onSelect = useCallback((nextValue: string) => {
        setDraft(nextValue);
    }, []);

    const onConfirm = useCallback(() => {
        setIsVisible(false);

        requestAnimationFrame(() => {
            onChange(draft);
        });
    }, [draft, onChange]);

    const createOnSelect = useCallback((nextValue: string) => {
        return () => {
            onSelect(nextValue);
        };
    }, [onSelect]);

    const items = useMemo<ICurrencyOption[]>(() => {
        return currencies.map((itemValue) => {
            return {
                value: itemValue,
                label: itemValue,
                onPress: createOnSelect(itemValue),
            };
        });
    }, [createOnSelect, currencies]);

    return useMemo(() => {
        return {
            isVisible,
            draft,
            items,
            selectedText: value,
            onOpen,
            onClose,
            onConfirm,
        };
    }, [draft, isVisible, items, onClose, onConfirm, onOpen, value]);
};
