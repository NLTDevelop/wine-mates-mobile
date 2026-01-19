import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { SmoothSlider } from '@/UIKit/SmoothSlider';
import { useIsFocused } from '@react-navigation/native';
import { IWineTasteCharacteristic } from '@/entities/wine/types/IWineTasteCharacteristic';
import { CrownIcon } from '@assets/icons/CrownIcon';
import { BlurContainer } from '@/UIKit/BlurContainer';

interface IProps {
    item: IWineTasteCharacteristic;
    value: number;
    onChange?: (value: number) => void;
    isPremiumUser: boolean;
    disabled?: boolean;
}

export const TasteCharacteristicItem = ({ item, value, onChange, isPremiumUser, disabled = false }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const isFocused = useIsFocused();
    const levels = item.levels ?? [
        { id: 1, name: '' },
        { id: 2, name: '' },
    ];

    const maxIndex = useMemo(() => {
        const baseMax = Math.max(levels.length - 1, 0);
        return item.isTriple ? baseMax * 2 : baseMax;
    }, [item.isTriple, levels.length]);

    const safeValue = useMemo(() => {
        if (value > maxIndex) return maxIndex;
        if (value < 0) return 0;
        return value;
    }, [maxIndex, value]);

    const decoratorCount = useMemo(() => {
        return item.isTriple ? Math.max(levels.length - 1, 0) : 0;
    }, [item.isTriple, levels.length]);

    const sliderLabels = useMemo(() => {
        if (!item.isTriple) {
            return levels.map(level => level.name);
        }

        const extended: string[] = [];
        levels.forEach((level, index) => {
            extended.push(level.name);
            if (index < levels.length - 1) {
                extended.push('');
            }
        });

        return extended;
    }, [item.isTriple, levels]);

    const decorator = useMemo(() => {
        if (decoratorCount === 0) return undefined;
        return {
            item: <View style={styles.decoratorItem} />,
            count: decoratorCount + 1,
        };
    }, [decoratorCount, styles.decoratorItem]);

    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <View style={styles.row}>
                    <Typography text={item.name} variant="h6" />
                    {item.isPremium && <CrownIcon />}
                </View>
                {item.description && (
                    <Typography text={item.description} variant="subtitle_12_400" style={styles.description} />
                )}
            </View>
            <SmoothSlider
                min={0}
                max={maxIndex}
                value={safeValue}
                onChange={onChange}
                selectedStyle={{ backgroundColor: item.colorHex }}
                disabled={disabled}
                labels={sliderLabels}
                decorator={decorator}
                snapped
            />
            {item.isPremium && isFocused && !isPremiumUser && <BlurContainer />}
        </View>
    );
};
