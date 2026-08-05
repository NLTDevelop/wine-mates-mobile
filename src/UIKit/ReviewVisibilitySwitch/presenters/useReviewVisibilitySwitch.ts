import { scaleHorizontal, scaleVertical } from '@/utils';

export const useReviewVisibilitySwitch = () => {
    return {
        switchCircleSize: scaleHorizontal(22),
        switchBarHeight: scaleVertical(26),
    };
};
