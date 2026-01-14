import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';

export const getStyles = (colors: IColors, MARKER: number, TRACK_HEIGHT: number, MARKER_INNER: number) =>
    StyleSheet.create({
      markerWrapper: {
        position: 'absolute',
        top: -(MARKER / 2 - TRACK_HEIGHT / 2),
        width: MARKER,
        height: MARKER,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        overflow: 'visible',
      },
      marker: {
        width: MARKER,
        height: MARKER,
        borderRadius: MARKER / 2 + 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border_light,
        shadowColor: colors.shadow,
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        elevation: 3,
      },
      markerInner: {
        width: MARKER_INNER,
        height: MARKER_INNER,
        borderRadius: MARKER_INNER / 2 + 1,
        backgroundColor: colors.primary,
      },
    });
  