import { useMemo } from 'react';
import { View } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { RangeSlider } from '@/UIKit/RangeSlider';
import { useUiContext } from '@/UIProvider';
import { IChooseWineTasteFilterItem } from '@/modules/chooseWine/types/IChooseWineTasteFilterItem';
import { getStyles } from './styles';

interface IProps {
    item: IChooseWineTasteFilterItem;
}

export const TasteFilterItem = ({ item }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <Typography variant="h6" text={item.title} style={styles.title} />
            <Typography variant="subtitle_12_400" text={item.description} style={styles.description} />
            <RangeSlider
                min={item.minValue}
                max={item.maxValue}
                minValue={item.minSortNumber}
                maxValue={item.maxSortNumber}
                onChange={item.onChange}
                step={1}
                activeColor={item.colorHex}
                inactiveColor={item.inactiveColor}
                showValueLabels={false}
                showTrackDividers
                containerStyle={styles.slider}
            />
            <View style={styles.labelsRow}>
                {item.labels.map(label => (
                    <Typography
                        key={label.id}
                        variant="subtitle_12_400"
                        text={label.name}
                        style={[
                            styles.labelText,
                            label.sortNumber === item.minValue ? styles.leftLabelText : undefined,
                            label.sortNumber === item.maxValue ? styles.rightLabelText : undefined,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};
