import { StyleSheet } from 'react-native';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { IColors } from '@/UIProvider/theme/IColors';

const TRACK_H = scaleVertical(16);

export const getStyles = (colors: IColors, MARKER: number) => StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaleVertical(24),
  },
  wrap: {
    width: scaleHorizontal(311),
    height: MARKER,
  },
  slider: {
    width: scaleHorizontal(311),
    height: MARKER,
    justifyContent: 'center',
  },
  track: {
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    backgroundColor: 'transparent',
  },
  unselected: {
    backgroundColor: '#E2E2E2',
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: (MARKER - TRACK_H) / 2,
    height: TRACK_H,
    backgroundColor: colors.primary,
    borderRadius: TRACK_H / 2,
    overflow: 'hidden',
    zIndex: 0,
  },
  pattern: {
    position: 'absolute',
    width: 3000,
    height: TRACK_H,
    opacity: 1,
  },
});
