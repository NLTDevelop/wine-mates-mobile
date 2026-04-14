import { useCallback } from 'react';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';

interface IProps {
    item: IDropdownItem;
    onSelect: (item: IDropdownItem) => void;
}

export const useCityOptionItem = ({ item, onSelect }: IProps) => {
    const onPress = useCallback(() => {
        onSelect(item);
    }, [item, onSelect]);

    return {
        onPress,
    };
};
