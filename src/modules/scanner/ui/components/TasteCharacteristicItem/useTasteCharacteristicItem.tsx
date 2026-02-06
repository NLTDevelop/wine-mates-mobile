import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { useIsFocused } from '@react-navigation/native';
import { IWineTasteCharacteristic } from '@/entities/wine/types/IWineTasteCharacteristic';
import { getStyles } from './styles';

interface UseTasteCharacteristicItemParams {
    item: IWineTasteCharacteristic;
    value: number;
    isPremiumUser: boolean;
}

export const useTasteCharacteristicItem = ({ item, value, isPremiumUser }: UseTasteCharacteristicItemParams) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const isFocused = useIsFocused();

    const originalLevels = useMemo(() => {
        return item.levels ?? [
            { id: 1, name: '' },
            { id: 2, name: '' },
        ];
    }, [item.levels]);

    const maxIndex = useMemo(() => {
        return Math.max(originalLevels.length - 1, 0);
    }, [originalLevels.length]);

    const safeValue = useMemo(() => {
        if (value > maxIndex) return maxIndex;
        if (value < 0) return 0;
        return value;
    }, [maxIndex, value]);

    const displayLabelIndices = useMemo(() => {
        const firstIndex = 0;
        const lastIndex = originalLevels.length - 1;

        if (item.isTriple) {
            const middleIndex = Math.floor((originalLevels.length - 1) / 2);
            return [firstIndex, middleIndex, lastIndex];
        }

        return [firstIndex, lastIndex];
    }, [originalLevels, item.isTriple]);

    const decoratorCount = useMemo(() => {
        return originalLevels.length - 2;
    }, [originalLevels.length]);

    const sliderLabels = useMemo(() => {
        return displayLabelIndices.map(index => ({
            label: originalLevels[index].name,
            index: index,
        }));
    }, [displayLabelIndices, originalLevels]);

    const decorator = useMemo(() => {
        if (decoratorCount === 0) return undefined;
        return {
            item: <View style={styles.decoratorItem} />,
            count: decoratorCount,
        };
    }, [decoratorCount, styles.decoratorItem]);

    const showBlur = item.isPremium && isFocused && !isPremiumUser;

    return {
        styles,
        maxIndex,
        safeValue,
        sliderLabels,
        decorator,
        showBlur,
    };
};
