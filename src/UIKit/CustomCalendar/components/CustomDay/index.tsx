import { Typography } from '@/UIKit/Typography';
import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';
import { useCustomDay } from './presenters/useCustomDay';
import { IProps } from './types';

export const CustomDay = ({ date, state, marking, colors, onPress, minDate, maxDate }: IProps) => {
    const { styleDetails, onDayPress, shouldRenderFillers, leftFillerStyle, rightFillerStyle,
        dayNumber } = useCustomDay({ date, state, marking, colors, onPress, minDate, maxDate });
    const styles = useMemo(() => getStyles(colors, styleDetails), [colors, styleDetails]);

    return (
        <TouchableOpacity onPress={onDayPress} style={styles.wrapper} disabled={styleDetails.isDisabled}>
            {shouldRenderFillers && (
                <View style={styles.fillers} pointerEvents="none">
                    <View style={[styles.filler, leftFillerStyle]} />
                    <View style={[styles.filler, rightFillerStyle]} />
                </View>
            )}
            <View style={styles.container}>
                <Typography text={dayNumber} variant="h6" style={styles.text} />
            </View>
        </TouchableOpacity>
    );
};
