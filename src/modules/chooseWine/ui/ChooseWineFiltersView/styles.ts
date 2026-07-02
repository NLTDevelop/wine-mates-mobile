import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        screen: {
            flex: 1,
        },
        loaderContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        content: {
            paddingHorizontal: scaleHorizontal(16),
            paddingBottom: scaleVertical(24),
        },
        resetButton: {
            minWidth: scaleHorizontal(44),
            alignItems: 'flex-end',
        },
        resetText: {
            color: colors.text_primary,
        },
        modeRow: {
            flexDirection: 'row',
            gap: scaleHorizontal(8),
            marginBottom: scaleVertical(16),
        },
        modeCard: {
            flex: 1,
            minHeight: scaleVertical(104),
            borderRadius: 8,
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            backgroundColor: colors.background,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: scaleHorizontal(8),
            paddingVertical: scaleVertical(10),
        },
        modeCardActive: {
            borderColor: colors.primary,
        },
        modeTitle: {
            color: colors.text_primary,
            marginTop: scaleVertical(6),
            textAlign: 'center',
        },
        modeDescription: {
            color: colors.text_primary,
            textAlign: 'center',
            marginTop: scaleVertical(2),
        },
        sectionLabel: {
            color: colors.text,
            marginTop: scaleVertical(12),
            marginBottom: scaleVertical(8),
        },
        segmentRow: {
            flexDirection: 'row',
            gap: scaleHorizontal(8),
        },
        segmentButton: {
            flex: 1,
            minHeight: scaleVertical(44),
            borderRadius: 12,
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            backgroundColor: colors.background,
            alignItems: 'center',
            justifyContent: 'center',
        },
        segmentButtonActive: {
            borderColor: colors.primary,
            backgroundColor: colors.background,
        },
        segmentButtonDisabled: {
            opacity: 0.45,
        },
        segmentText: {
            color: colors.text,
            textAlign: 'center',
        },
        segmentTextDisabled: {
            color: colors.text_light,
        },
        checkboxRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(8),
            marginTop: scaleVertical(16),
            marginBottom: scaleVertical(12),
        },
        checkboxText: {
            color: colors.text,
            flex: 1,
        },
        footer: {
            paddingHorizontal: scaleHorizontal(16),
            paddingTop: scaleVertical(12),
            paddingBottom: scaleVertical(8),
            backgroundColor: colors.background,
        },
    });

    return styles;
};
