import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { QR_CODE_SHARE_SIZE, scaleFontSize, scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            backgroundColor: colors.background,
            borderRadius: scaleHorizontal(12),
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
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: scaleHorizontal(8),
        },
        metaBadgesRow: {
            flexDirection: 'row',
            gap: scaleHorizontal(8),
            flexShrink: 1,
        },
        statusRow: {
            flexDirection: 'row',
            gap: scaleHorizontal(8),
            flexWrap: 'wrap',
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
        fullSpotsText: {
            color: colors.primary,
        },
        shareButton: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        hiddenQrCodeContainer: {
            position: 'absolute',
            width: scaleHorizontal(QR_CODE_SHARE_SIZE),
            height: scaleHorizontal(QR_CODE_SHARE_SIZE),
            opacity: 0,
            overflow: 'hidden',
        },
        statusText: {
            color: colors.background,
        },
        headerContent: {
            flex: 1,
            gap: scaleVertical(2),
        },
        title: {
            color: colors.text,
            flexShrink: 1,
        },
        timeText: {
            color: colors.text_light,
            flexShrink: 1,
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
