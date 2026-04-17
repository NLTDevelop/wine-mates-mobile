import { memo } from 'react';
import { View } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { getContrastColor } from '@/utils';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';

interface IProps {
    backgroundColor: string;
    label: string;
    count: string;
}

export const StatisticCard = memo(({ backgroundColor, label, count }: IProps) => {
    const { colors } = useUiContext();
    const styles = getStyles(colors);
    const textColor = getContrastColor(backgroundColor || colors.background_grey);

    return (
        <View style={[styles.card, { backgroundColor: backgroundColor || colors.background_grey }]}>
            <Typography text={label} style={{ color: textColor }} />
            <Typography
                text={count}
                variant="subtitle_12_500"
                style={[styles.countText, { color: `${textColor}B3` }]}
            />
        </View>
    );
});

StatisticCard.displayName = 'StatisticCard';
