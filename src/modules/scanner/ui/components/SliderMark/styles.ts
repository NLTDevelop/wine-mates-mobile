import { StyleSheet } from 'react-native';
import { scaleVertical } from '@/utils';
import { IColors } from '@/UIProvider/theme/IColors';

const TRACK_H = scaleVertical(16);
const MARKER = scaleVertical(34);
const MARKER_INNER = scaleVertical(22);

export const getStyles = (colors: IColors) =>
    StyleSheet.create({
      markerWrapper: {
        position: 'absolute',
        top: -(MARKER / 2 - TRACK_H / 2),
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
        elevation: 6,
      },
      markerInner: {
        width: MARKER_INNER,
        height: MARKER_INNER,
        borderRadius: MARKER_INNER / 2 + 1,
        backgroundColor: colors.primary,
      },
    });
  