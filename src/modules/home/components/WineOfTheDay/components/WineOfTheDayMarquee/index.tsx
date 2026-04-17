import { memo, useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { MarqueeText } from '@/UIKit/MarqueeText';
import { getStyles } from './styles';

const WineOfTheDayMarqueeComponent = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <MarqueeText isEverlasting speed={30}>
                <Typography
                    text={t('home.mostTastedWine')}
                    variant="subtitle_12_400"
                    style={styles.text}
                />
            </MarqueeText>
        </View>
    );
};

export const WineOfTheDayMarquee = memo(WineOfTheDayMarqueeComponent);
WineOfTheDayMarquee.displayName = 'WineOfTheDayMarquee';
