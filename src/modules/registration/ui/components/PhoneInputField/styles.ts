import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) =>
    StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(12),
        },
        countryPill: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            height: scaleVertical(50),
            paddingHorizontal: scaleHorizontal(12),
            backgroundColor: colors.card,
        },
        flagCircle: {
            width: 24,
            height: 24,
            borderRadius: 12,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: scaleHorizontal(8),
        },
        flagImage: {
            width: 24,
            height: 24,
            borderRadius: 12,
        },
        codeText: {
            color: colors.text,
            fontWeight: '600',
        },
        caret: {
            marginLeft: scaleHorizontal(6),
            opacity: 0.6,
        },
    });
