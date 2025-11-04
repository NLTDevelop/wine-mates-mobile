import { memo, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { ShadeSliderMark } from '../ShadeSliderMark';
import { Typography } from '@/UIKit/Typography';

const MIN = 1;
const MAX = 3;
const MARKER = scaleVertical(48);
const TRACK_HEIGHT = scaleVertical(48);
const MARKER_INNER = scaleVertical(32);
const SLIDER_LENGTH = scaleHorizontal(343) - MARKER;

interface IProps {
    value?: number;
    onChange?: (v: number) => void;
    selectedColor: string;
}

export const ShadeSelector = memo(({ value = MIN, onChange, selectedColor }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors, MARKER, TRACK_HEIGHT, SLIDER_LENGTH), [colors]);

    const customMarker = useCallback(
        () => <ShadeSliderMark size={MARKER} innerSize={MARKER_INNER} selectedColor={selectedColor} trackHeight={TRACK_HEIGHT}/>,
        [selectedColor],
    );

    return (
        <View style={styles.container}>
            <View style={styles.trackBackground}>
                <View style={[ styles.leftSide, { backgroundColor: value === 1 ? colors.unselectedSlider : selectedColor }]}/>
                <View style={[styles.rightSide, { backgroundColor: colors.unselectedSlider }]} />
            </View>
            <MultiSlider
                values={[value]}
                onValuesChange={vals => onChange?.(vals[0])}
                min={MIN}
                max={MAX}
                step={1}
                snapped
                sliderLength={SLIDER_LENGTH}
                containerStyle={styles.slider}
                trackStyle={styles.track}
                selectedStyle={{ backgroundColor: selectedColor }}
                unselectedStyle={styles.unselected}
                customMarker={customMarker}
            />
            <View style={styles.labelsContainer}>
                <Typography text={t('wine.pale')} variant="h6" style={styles.label} />
                <View style={styles.labelWrapper}>
                    <Typography text={t('wine.medium')} variant="h6" style={styles.label} />
                </View>
                <Typography text={t('wine.deep')} variant="h6" style={styles.label} />
            </View>
        </View>
    );
});

ShadeSelector.displayName = 'ShadeSelector';
