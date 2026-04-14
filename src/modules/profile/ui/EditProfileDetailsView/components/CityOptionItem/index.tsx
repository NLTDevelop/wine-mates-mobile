import { memo, useMemo } from 'react';
import { Pressable } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { getStyles } from './styles';
import { useCityOptionItem } from './presenters/useCityOptionItem';

interface IProps {
    item: IDropdownItem;
    onSelect: (item: IDropdownItem) => void;
}

export const CityOptionItem = memo(({ item, onSelect }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { onPress } = useCityOptionItem({ item, onSelect });

    return (
        <Pressable style={styles.item} onPress={onPress}>
            <Typography text={item.label} variant="h6" style={styles.itemText} numberOfLines={1} />
        </Pressable>
    );
});

CityOptionItem.displayName = 'CityOptionItem';
