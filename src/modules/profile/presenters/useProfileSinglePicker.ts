import { useCallback, useMemo, useState } from 'react';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { IUniversalPickerOption } from '@/UIKit/UniversalPickerBottomModal/types/IUniversalPickerOption';

interface IProps {
    title: string;
    value: string | number | null;
    items: IDropdownItem[];
    onChange: (item: IDropdownItem) => void;
    isDisabled?: boolean;
    isLoading?: boolean;
}

export const useProfileSinglePicker = ({
    title,
    value,
    items,
    onChange,
    isDisabled = false,
    isLoading = false,
}: IProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [draft, setDraft] = useState<string | number | null>(value);

    const onOpen = useCallback(() => {
        if (isDisabled) return;

        setDraft(value);
        setIsVisible(true);
    }, [isDisabled, value]);

    const onClose = useCallback(() => setIsVisible(false), []);

    const createOnSelect = useCallback((nextValue: string | number | null) => {
        return () => setDraft(nextValue);
    }, []);

    const options = useMemo<IUniversalPickerOption[]>(() => {
        return items.map(item => ({
            id: String(item.id ?? item.value),
            title: item.label,
            isSelected: item.value === draft,
            onPress: createOnSelect(item.value),
        }));
    }, [createOnSelect, draft, items]);

    const selectedText = useMemo(() => {
        return items.find(item => item.value === value)?.label || '';
    }, [items, value]);

    const onConfirm = useCallback(() => {
        const selectedItem = items.find(item => item.value === draft);
        setIsVisible(false);

        if (!selectedItem) return;

        requestAnimationFrame(() => onChange(selectedItem));
    }, [draft, items, onChange]);

    return {
        title,
        selectedText,
        options,
        isVisible,
        isDisabled,
        isLoading,
        onOpen,
        onClose,
        onConfirm,
    };
};
