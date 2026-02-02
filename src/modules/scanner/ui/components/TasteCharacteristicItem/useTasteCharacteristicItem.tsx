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

    const levels = useMemo(() => {
        const originalLevels = item.levels ?? [
            { id: 1, name: '' },
            { id: 2, name: '' },
        ];

        if (originalLevels.length <= 3) {
            return originalLevels;
        }

        const firstIndex = 0;
        const middleIndex = Math.floor((originalLevels.length - 1) / 2);
        const lastIndex = originalLevels.length - 1;

        return [
            originalLevels[firstIndex],
            originalLevels[middleIndex],
            originalLevels[lastIndex],
        ];
    }, [item.levels]);

    const maxIndex = useMemo(() => {
        return Math.max(levels.length - 1, 0);
    }, [levels.length]);

    const safeValue = useMemo(() => {
        if (value > maxIndex) return maxIndex;
        if (value < 0) return 0;
        return value;
    }, [maxIndex, value]);

    const decoratorCount = useMemo(() => {
        return levels.length - 2;
    }, [levels]);

    const sliderLabels = useMemo(() => {
        return levels.map(level => level.name);
    }, [levels]);

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
