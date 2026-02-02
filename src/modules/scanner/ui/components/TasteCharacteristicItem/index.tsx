import { View } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { SmoothSlider } from '@/UIKit/SmoothSlider';
import { IWineTasteCharacteristic } from '@/entities/wine/types/IWineTasteCharacteristic';
import { CrownIcon } from '@assets/icons/CrownIcon';
import { BlurContainer } from '@/UIKit/BlurContainer';
import { useTasteCharacteristicItem } from './useTasteCharacteristicItem.tsx';

interface IProps {
    item: IWineTasteCharacteristic;
    value: number;
    onChange?: (value: number) => void;
    isPremiumUser: boolean;
    disabled?: boolean;
}

export const TasteCharacteristicItem = ({ item, value, onChange, isPremiumUser, disabled = false }: IProps) => {
    const { styles, maxIndex, safeValue, sliderLabels, decorator, showBlur } = useTasteCharacteristicItem({
        item,
        value,
        isPremiumUser,
    });

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
            {showBlur && <BlurContainer />}
        </View>
    );
};
