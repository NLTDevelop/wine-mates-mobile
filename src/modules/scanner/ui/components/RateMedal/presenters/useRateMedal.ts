import { useMemo } from 'react';

type MedalType = 'nice' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'simple' | 'weak';

export const useRateMedal = (sliderValue: number) => {
    const medalType: MedalType = useMemo(() => {
        if (sliderValue >= 97) {
            return 'platinum';
        } else if (sliderValue >= 94) {
            return 'gold';
        } else if (sliderValue >= 90) {
            return 'silver';
        } else if (sliderValue >= 86) {
            return 'bronze';
        } else if (sliderValue >= 80) {
            return 'nice';
        } else if (sliderValue >= 75) {
            return 'simple';
        } else if (sliderValue >= 70) {
            return 'weak';
        } else {
            return 'weak';
        }
    }, [sliderValue]);

    return { medalType };
};
