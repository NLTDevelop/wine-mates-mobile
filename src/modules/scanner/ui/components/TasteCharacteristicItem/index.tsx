import { View, ViewStyle } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { SmoothSlider } from '@/UIKit/SmoothSlider';
import { IWineTasteCharacteristic } from '@/entities/wine/types/IWineTasteCharacteristic';
import { CrownIcon } from '@assets/icons/CrownIcon';
import { LockContainer } from '@/UIKit/LockContainer/index.tsx';
import { useTasteCharacteristicItem } from './useTasteCharacteristicItem.tsx';

interface IProps {
    item: IWineTasteCharacteristic;
    value: number;
    onChange?: (value: number) => void;
    isPremiumUser: boolean;
    disabled?: boolean;
    hideDescription?: boolean;
    containerStyle?: ViewStyle;
    edgeAlignedLabels?: boolean;
}

export const TasteCharacteristicItem = ({ item, value, onChange, isPremiumUser, disabled = false, hideDescription = false, containerStyle, edgeAlignedLabels = false }: IProps) => {
    const { styles, maxIndex, safeValue, sliderLabels, decorator, showBlur, trackColor } = useTasteCharacteristicItem({
        item,
        value,
        isPremiumUser,
    });

    return (
        <View style={[styles.container, containerStyle]}>
            <View style={styles.infoContainer}>
                <View style={styles.row}>
                    <Typography text={item.name} variant="h6" />
                    {item.isPremium && <CrownIcon />}
                </View>
                {item.description && !hideDescription && (
                    <Typography text={item.description} variant="subtitle_12_400" style={styles.description} />
                )}
            </View>
            <SmoothSlider
                min={0}
                max={maxIndex}
                value={safeValue}
                onChange={onChange}
                selectedStyle={{ backgroundColor: item.colorHex }}
                unselectedStyle={{ backgroundColor: trackColor }}
                disabled={disabled}
                labels={sliderLabels}
                decorator={decorator}
                markerColor={item.colorHex}
                snapped
                edgeAlignedLabels={edgeAlignedLabels}
            />
            {showBlur && <LockContainer />}
        </View>
    );
};

TasteCharacteristicItem.displayName = 'TasteCharacteristicItem';
