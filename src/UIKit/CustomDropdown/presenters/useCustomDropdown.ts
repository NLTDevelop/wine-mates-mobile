import { useState, useMemo, useEffect, useCallback } from 'react';
import { IDropdownItem } from '../types/IDropdownItem';
import { useDropdownLiftOffset } from './useDropdownLiftOffset';

interface IProps {
    onPress: (item: IDropdownItem) => void;
    data: IDropdownItem[];
    onSelect?: () => Promise<boolean>;
    selectedValue?: string | number | null;
    emptyStateLabel?: string;
    withSearch?: boolean;
}

const EMPTY_STATE_VALUE = '__EMPTY_STATE__';
export const useCustomDropdown = ({ onPress, data, onSelect, selectedValue = null, emptyStateLabel, withSearch = false }: IProps) => {
    const [value, setValue] = useState<string | number | null>(selectedValue);
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const { triggerContainerRef, dropdownLiftOffset, onMeasureTrigger } = useDropdownLiftOffset(isOpen);

    useEffect(() => {
        Promise.resolve().then(() => setValue(selectedValue ?? null));
    }, [selectedValue]);

    const filteredData = useMemo(() => {
        const query = search.trim().toLowerCase();
    
        const baseData = !query
            ? data
            : data.filter(item => {
                  return (
                      item.label.toLowerCase().includes(query) ||
                      String(item.value).toLowerCase().includes(query)
                  );
              });
    
        if (emptyStateLabel) {
            return [{ label: emptyStateLabel, value: EMPTY_STATE_VALUE }, ...baseData];
        }
    
        return baseData;
    }, [search, data, emptyStateLabel]);

    const selectedItem = useMemo(
        () => data.find(item => item.value === value) || null,
        [data, value],
    );

    const shouldShowSearch = useMemo(() => withSearch && data.length > 10, [withSearch, data.length]);

    const handleSelect = useCallback((item: IDropdownItem) => {
        if (item.value === EMPTY_STATE_VALUE) {
            setValue(null);
            onPress({ label: '', value: '', id: null });
        } else {
            setValue(item.value);
            onPress(item);
        }
        setIsOpen(false);
        onSelect?.();
    }, [onPress, onSelect]);

    const handleOpen = useCallback(() => {
        setIsOpen(true);
    }, []);

    const onBlurDropdown = useCallback(() => {
        setIsOpen(false);
        setSearch('');
    }, []);

    const onPressDropdown = useCallback((disabled: boolean, dropdownRef: { open?: () => void } | null) => {
        if (disabled || !dropdownRef?.open) {
            return;
        }

        onMeasureTrigger(() => {
            dropdownRef.open?.();
        });
    }, [onMeasureTrigger]);

    const onCloseDropdown = useCallback((dropdownRef: { close?: () => void } | null) => {
        dropdownRef?.close?.();
        setIsOpen(false);
    }, []);

    const onOpenDropdown = useCallback((disabled: boolean, dropdownRef: { open?: () => void } | null) => {
        if (disabled || !dropdownRef?.open) {
            return;
        }

        onMeasureTrigger(() => {
            dropdownRef.open?.();
        });
    }, [onMeasureTrigger]);

    return {
        value,
        isOpen,
        search,
        filteredData,
        selectedItem,
        triggerContainerRef,
        dropdownLiftOffset,
        shouldShowSearch,
        handleSelect,
        setSearch,
        onBlurDropdown,
        onPressDropdown,
        onCloseDropdown,
        onOpenDropdown,
        handleOpen,
    };
};
