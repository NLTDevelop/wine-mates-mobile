import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { Slider } from '@/UIKit/Slider';
import { BlurView } from '@sbaiahmed1/react-native-blur';
import { LockIcon } from '@assets/icons/LockIcon';
import { useIsFocused } from '@react-navigation/native';
import { isIOS } from '@/utils';
import { IWineTasteCharacteristic } from '@/entities/wine/types/IWineTasteCharacteristic';
import { CrownIcon } from '@assets/icons/CrownIcon';

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

    const safeValue = useMemo(() => {
        const max = Math.max(item.levels.length - 1, 0);
        if (value > max) return max;
        if (value < 0) return 0;
        return value;
    }, [item.levels.length, value]);

    const maxIndex = Math.max(item.levels.length - 1, 0);

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Typography text={item.name} variant="h6" />
                {item.isPremium && <CrownIcon />}
            </View>
            <Typography text={item.description} variant="subtitle_12_400" style={styles.description} />
            <Slider
                min={0}
                max={maxIndex}
                value={safeValue}
                onChange={onChange ?? (() => {})}
                selectedColor={item.colorHex}
                disabled={disabled}
            />
            {item.isPremium && isFocused && !isPremiumUser && (
                <>
                    {isIOS ? (
                        <BlurView style={styles.blur} blurType="light" blurAmount={5} />
                    ) : (
                        <View style={styles.fakeBlur} />
                    )}
                    <View style={styles.lockLayer}>
                        <LockIcon />
                    </View>
                </>
            )}
        </View>
    );
};
