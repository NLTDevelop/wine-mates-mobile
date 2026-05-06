import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleFontSize, scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            backgroundColor: colors.background,
            borderRadius: scaleHorizontal(20),
            padding: scaleHorizontal(16),
            gap: scaleVertical(12),
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
        },
        selectedContainer: {
            borderColor: colors.primary,
            borderWidth: scaleHorizontal(2),
        },
        pressedContainer: {
            transform: [{ scale: 0.985 }],
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(12),
        },
        metaRow: {
            flexDirection: 'row',
            gap: scaleHorizontal(8),
        },
        metaBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: scaleHorizontal(6),
            paddingHorizontal: scaleHorizontal(8),
            paddingVertical: scaleVertical(6),
            gap: scaleHorizontal(6),
            backgroundColor: colors.background_middle
        },
        eventStatusFinished: {
            paddingHorizontal: scaleHorizontal(8),
            paddingVertical: scaleVertical(6),
            backgroundColor: colors.finishStatus,
            borderRadius: scaleHorizontal(6),
            justifyContent: 'center',
        },
        eventStatusCanceled: {
            paddingHorizontal: scaleHorizontal(8),
            paddingVertical: scaleVertical(6),
            backgroundColor: colors.text_light,
            borderRadius: scaleHorizontal(6),
            justifyContent: 'center',
        },
        appliedStatusContainer: {
            borderRadius: scaleHorizontal(6),
            paddingHorizontal: scaleHorizontal(8),
            paddingVertical: scaleVertical(6),
            justifyContent: 'center',
        },
        appliedEventStatusCanceled: {
            backgroundColor: colors.background_grey,
        },
        appliedEventStatusRejected:{
            backgroundColor: colors.error,
        },
        appliedEventStatusPending:{
            backgroundColor:colors.stars,
        },
        appliedEventStatusConfirmed:{
            backgroundColor: colors.success,
        },
        metaText: {
            color: colors.text,
        },
        statusText: {
            color: colors.background,
        },
        headerContent: {
            gap: scaleVertical(2),
        },
        title: {
            color: colors.text,
            maxWidth: scaleHorizontal(255)
        },
        timeText: {
            color: colors.text_light,
            fontSize: scaleFontSize(16),
        },
        descriptionText: {
            color: colors.text_light,
            fontSize: scaleFontSize(18),
            lineHeight: scaleFontSize(26),
        },
        mapContainer: {
            height: scaleVertical(140),
            borderRadius: scaleHorizontal(14),
            overflow: 'hidden',
        },
        map: {
            ...StyleSheet.absoluteFill,
        },
        footer: {
            flexDirection: 'row',
            gap: scaleHorizontal(12),
        },
        readMoreButton: {
            flex: 1,
            borderRadius: scaleHorizontal(16),
        },
        modalContentContainer: {
            paddingTop: scaleVertical(8),
        },
    });
    return styles;
};
