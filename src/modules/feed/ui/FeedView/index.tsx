import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { PartitionedSlider } from '@/UIKit/PartitionedSlider';

import { getStyles } from './styles';

export const FeedView = () => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const [sliderValue, setSliderValue] = useState(50);

    const decorators = useMemo(() => {
        return {
            item: <View style={{ width: 2, backgroundColor: colors.background, height: '100%' }} />,
            count: 9
        };
    }, [colors.background]);

    return (
        <ScreenContainer edges={['top']}>
            <View style={styles.container}>
                <Typography text={'Feed Screen'} variant="h3" />

                <View style={{ marginTop: 40, paddingHorizontal: 16 }}>
                    <Typography text={`Partitioned Slider Example`} variant="h6" style={{ marginBottom: 8 }} />
                    <Typography text={`Value: ${sliderValue}`} variant="body_400" style={{ marginBottom: 16 }} />
                    <Typography
                        text={`First half (0-50%): values 0-70`}
                        variant="body_400"
                        style={{ marginBottom: 4, opacity: 0.7 }}
                    />
                    <Typography
                        text={`Second half (50-100%): values 71-100`}
                        variant="body_400"
                        style={{ marginBottom: 16, opacity: 0.7 }}
                    />

                    <PartitionedSlider
                        parts={[
                            [70, 75],
                            [76, 80],
                            [81, 85],
                            [86, 90],
                            [91, 96],
                            [97, 100],
                        ]}
                        value={sliderValue}
                        onChange={setSliderValue}
                        selectedStyle={{ backgroundColor: colors.primary }}
                        decorator={decorators}
                    />
                </View>
            </View>
        </ScreenContainer>
    );
};
