import { useMemo } from 'react';

type MedalType = 'nice' | 'bronze' | 'silver' | 'gold' | 'platinum';

export const useRateMedal = (sliderValue: number) => {
    const medalType: MedalType = useMemo(() => {
        if (sliderValue < 86) {
            return 'nice';
        } else if (sliderValue >= 86 && sliderValue <= 89.99) {
            return 'bronze';
        } else if (sliderValue >= 90 && sliderValue <= 94.99) {
            return 'silver';
        } else if (sliderValue >= 95 && sliderValue <= 96.99) {
            return 'gold';
        } else {
            return 'platinum';
        }
    }, [sliderValue]);

    return { medalType };
};
