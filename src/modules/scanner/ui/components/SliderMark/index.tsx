import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';

interface IProps {
    size: number,
    trackHeight: number,
    innerSize: number,
}

export const SliderMark = ({ size, trackHeight, innerSize }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, size, trackHeight, innerSize), [colors, size, trackHeight, innerSize]);

    return (
        <View style={styles.markerWrapper}>
            <View style={styles.marker}>
                <View style={styles.markerInner} />
            </View>
        </View>
    );
};
