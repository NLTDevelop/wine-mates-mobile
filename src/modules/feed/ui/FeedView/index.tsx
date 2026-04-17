import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { WinePeakPicker } from '@/modules/scanner/ui/components/WinePeakPicker';

import { getStyles } from './styles';

export const FeedView = () => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    return (
        <ScreenContainer edges={['top']}>
            <View style={styles.container}>
                <Typography text={'Feed Screen'} variant="h3" />
            </View>
        </ScreenContainer>
    );
};
