import { useMemo } from 'react';
import { View } from 'react-native';
import { Switch } from 'react-native-switch';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { useReviewVisibilitySwitch } from './presenters/useReviewVisibilitySwitch';
import { getStyles } from './styles';

interface IProps {
    value: boolean;
    onChange: (value: boolean) => void;
}

export const ReviewVisibilitySwitch = ({ value, onChange }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { switchCircleSize, switchBarHeight } = useReviewVisibilitySwitch();

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Typography text={t('wine.publicReview')} variant="body_500" />
                <Typography
                    text={t('wine.publicReviewDescription')}
                    variant="subtitle_12_400"
                    style={styles.description}
                />
            </View>
            <Switch
                value={value}
                onValueChange={onChange}
                circleSize={switchCircleSize}
                barHeight={switchBarHeight}
                circleBorderWidth={0}
                backgroundActive={colors.primary}
                backgroundInactive={colors.border}
                circleActiveColor={colors.background}
                circleInActiveColor={colors.background}
                circleBorderActiveColor={colors.background}
                circleBorderInactiveColor={colors.background}
                changeValueImmediately
                innerCircleStyle={styles.switchInnerCircle}
                renderActiveText={false}
                renderInActiveText={false}
                switchWidthMultiplier={2.2}
            />
        </View>
    );
};
