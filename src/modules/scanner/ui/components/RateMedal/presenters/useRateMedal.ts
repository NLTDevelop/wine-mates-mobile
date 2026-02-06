import { useMemo } from 'react';

type MedalType = 'nice' | 'bronze' | 'silver' | 'gold' | 'platinum';

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
        } else {
            return 'nice';
        }
    }, [sliderValue]);

    return { medalType };
};
