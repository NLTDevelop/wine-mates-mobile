import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { ShadeSelector } from '@/modules/scanner/ui/components/ShadeSelector';

import { getStyles } from './styles';

export const FeedView = () => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const [shade, setShade] = useState(2);

    const mockColorShade = {
        id: 1,
        colorId: 1,
        name: 'Red Wine',
        tonePale: '#E8B4B8',
        toneMedium: '#C73E47',
        toneDeep: '#6B1419',
        colorHex: '#C73E47',
        sortNumber: 1,
    };

    return (
        <ScreenContainer edges={['top']}>
            <View style={styles.container}>
                <Typography text={'Feed Screen'} variant="h3" />
                <ShadeSelector
                    value={shade}
                    onChange={(v) => {
                        console.log('Shade changed:', v);
                        setShade(v);
                    }}
                    colorShades={mockColorShade}
                />
            </View>
        </ScreenContainer>
    );
};
