import { useCallback, useMemo } from 'react';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { Marker } from './components/Marker';

const MARKER = scaleVertical(20);
const TRACK_HEIGHT = scaleVertical(8);
const SLIDER_LENGTH = scaleHorizontal(343) - MARKER;

interface UseSliderProps {
    min: number;
    max: number;
}

export const useSlider = ({ min, max }: UseSliderProps) => {
    const customMarker = useCallback(() => <Marker size={MARKER} trackHeight={TRACK_HEIGHT} />, []);

    const sectionsCount = useMemo(() => {
        const raw = max - 1;
        const normalized = raw > 20 ? 9 : raw;
        return normalized < 0 ? 0 : normalized;
    }, [max]);

    const sections = useMemo(
        () =>
            Array.from({ length: sectionsCount }).map((_, i) => {
                const left = ((i + 1) / (sectionsCount + 1)) * SLIDER_LENGTH;
                return { key: i, left };
            }),
        [sectionsCount]
    );

    return {
        MARKER,
        TRACK_HEIGHT,
        SLIDER_LENGTH,
        customMarker,
        sections,
    };
};
