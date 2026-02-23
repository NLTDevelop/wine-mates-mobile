import { memo, useMemo, useCallback } from 'react';
import { View } from 'react-native';
import WheelPicker from '@quidone/react-native-wheel-picker';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';
import { useYearPicker } from './presenters/useYearPicker';

interface IProps {
    value: number;
    onChange: (year: number) => void;
    minimumYear?: number;
}

export const YearPicker = memo(({ value, onChange, minimumYear }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { data, handleValueChange } = useYearPicker({ value, onChange, minimumYear, styles });

    const renderItem = useCallback(({ item }: { item: { value: number; label: string }; index: number }) => {
        return (
            <Typography
                text={item.label}
                variant="h3"
                style={styles.itemText}
            />
        );
    }, [styles]);

    return (
        <View style={styles.container}>
            <View style={styles.selectionIndicator} />
            <WheelPicker
                data={data}
                value={value}
                onValueChanged={handleValueChange}
                style={styles.picker}
                itemHeight={50}
                renderItem={renderItem}
                itemTextStyle={styles.itemText}
                selectedItemTextStyle={styles.selectedItemText}
                overlayItemStyle={styles.overlayHidden}
                enableScrollByTapOnItem={true}
            />
        </View>
    );
});

YearPicker.displayName = 'YearPicker';
