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

interface IProps {
    item: IWineTasteCharacteristic;
    value: number;
    onChange: (value: number) => void;
    isPremiumUser: boolean;
}

export const TasteCharacteristicItem = ({ item, value, onChange, isPremiumUser }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const isFocused = useIsFocused();

    const safeValue = useMemo(() => {
        const max = Math.max(item.levels.length, 1);
        if (value > max) return max;
        if (value < 1) return 1;
        return value;
    }, [item.levels.length, value]);

    return (
        <View style={styles.container}>
            <Typography text={item.name} variant="h6" />
            <Typography text={item.description} variant="subtitle_12_400" style={styles.description} />
            <Slider
                min={1}
                max={Math.max(item.levels.length, 1)}
                value={safeValue}
                onChange={onChange}
                selectedColor={item.colorHex}
                
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
