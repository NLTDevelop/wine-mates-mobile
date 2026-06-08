import { memo, useMemo, useCallback } from 'react';
import { StyleProp, TextStyle, View } from 'react-native';
import WheelPicker from '@quidone/react-native-wheel-picker';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { getStyles, YEAR_PICKER_ITEM_HEIGHT, YEAR_PICKER_VISIBLE_ITEM_COUNT } from './styles';
import { useYearPicker } from './presenters/useYearPicker';

interface IProps {
    value: number;
    onChange: (year: number) => void;
    minimumYear?: number;
}

export const YearPicker = memo(({ value, onChange, minimumYear }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { data, onValueChange } = useYearPicker({ value, onChange, minimumYear, styles });

    const renderItem = useCallback(({ item, itemTextStyle }: {
        item: { value: number; label: string };
        index: number;
        itemTextStyle: StyleProp<TextStyle>;
    }) => {
        return (
            <View style={styles.itemContainer}>
                <Typography
                    text={item.label}
                    variant="h3"
                    style={itemTextStyle}
                />
            </View>
        );
    }, [styles.itemContainer]);

    return (
        <View style={styles.container}>
            <View style={styles.selectionIndicator} />
            <WheelPicker
                data={data}
                value={value}
                onValueChanged={onValueChange}
                style={styles.picker}
                width="100%"
                itemHeight={YEAR_PICKER_ITEM_HEIGHT}
                visibleItemCount={YEAR_PICKER_VISIBLE_ITEM_COUNT}
                renderItem={renderItem}
                itemTextStyle={styles.itemText}
                overlayItemStyle={styles.overlayHidden}
                enableScrollByTapOnItem
            />
        </View>
    );
});

YearPicker.displayName = 'YearPicker';
