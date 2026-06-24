import { useMemo } from 'react';
import { scaleVertical } from '@/utils';

interface IProps {
    repeatRuleLabel: string;
    repeatTitle: string;
}

export const useWineSetListFooter = ({ repeatRuleLabel, repeatTitle }: IProps) => {
    const switchCircleSize = scaleVertical(18);
    const switchBarHeight = scaleVertical(24);

    const repeatValueText = useMemo(() => {
        return repeatRuleLabel;
    }, [repeatRuleLabel]);

    const repeatTitleText = useMemo(() => {
        return `${repeatTitle}:`;
    }, [repeatTitle]);

    return {
        repeatValueText,
        repeatTitleText,
        switchCircleSize,
        switchBarHeight,
    };
};
