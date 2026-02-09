import { useCallback, useMemo } from 'react';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { useSelectablePressGuard } from '@/hooks/useSelectablePressGuard';

interface IProps {
    item: IWineListItem;
    onPress: (item: IWineListItem) => void;
}

export const useWineListItem = ({ item, onPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const guard = useSelectablePressGuard();
    
    const handleItemPress = useCallback(() => guard.bindPressable.onPress(() => onPress(item)), [item, onPress, guard]);
    
    const similarityText = useMemo(() => {
        if (!item.similarity) return '-';
        return `${Math.round(item.similarity * 100)}%`;
    }, [item.similarity]);

    return {
        styles,
        guard,
        handleItemPress,
        similarityText,
    };
};
