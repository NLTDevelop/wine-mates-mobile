import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { Slider } from '@/UIKit/Slider';
import { useIsFocused } from '@react-navigation/native';
import { IWineTasteCharacteristic } from '@/entities/wine/types/IWineTasteCharacteristic';
import { CrownIcon } from '@assets/icons/CrownIcon';
import { BlurContainer } from '@/UIKit/BlurContainer';
import { BottomValues } from '../BottomValues';

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

    const safeValue = useMemo(() => {
        const max = Math.max(levels.length - 1, 0);
        if (value > max) return max;
        if (value < 0) return 0;
        return value;
    }, [levels.length, value]);

    const maxIndex = Math.max(levels.length - 1, 0);
    const middleIndex = Math.floor((levels.length - 1) / 2);

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
            <Slider
                min={0}
                max={maxIndex}
                value={safeValue}
                onChange={onChange ?? (() => {})}
                selectedColor={item.colorHex}
                disabled={disabled}
            />
            <BottomValues
                leftValue={levels[0].name}
                rightValue={levels[levels.length - 1].name}
                middleValue={levels[middleIndex]?.name}
                isTriple={item.isTriple}
            />
            {item.isPremium && isFocused && !isPremiumUser && <BlurContainer />}
        </View>
    );
};
