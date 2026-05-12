import { useCallback, useMemo, useState } from 'react';
import { ICurrencyOption } from '../types/ICurrencyOption';

interface IProps {
    value: string;
    currencies: string[];
    onChange: (value: string) => void;
    isDisabled?: boolean;
}

export const useCurrencyPickerModal = ({ value, currencies, onChange, isDisabled = false }: IProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [draft, setDraft] = useState(value);

    const onOpen = useCallback(() => {
        if (isDisabled) {
            return;
        }

        setDraft(value);
        setIsVisible(true);
    }, [isDisabled, value]);

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

    const createOnSelect = useCallback(
        (nextValue: string) => {
            return () => {
                onSelect(nextValue);
            };
        },
        [onSelect],
    );

    const items = useMemo<ICurrencyOption[]>(() => {
        return currencies.map(itemValue => {
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
