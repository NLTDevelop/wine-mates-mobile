import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors, bottomInset: number) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            backgroundColor: `${colors.background}F0`,
            borderTopWidth: 1,
            borderTopColor: 'rgba(0,0,0,0.05)',
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowOffset: { width: 0, height: -1 },
            shadowRadius: 2,
            elevation: 1,
            paddingBottom: bottomInset,
            minHeight: scaleVertical(61),
            width: '100%',
        },
        tabItem: {
            width: scaleHorizontal(75),
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: scaleVertical(4),
        },
        text: {
            marginTop: scaleVertical(4),
            textAlign: 'center',
        },
    });
