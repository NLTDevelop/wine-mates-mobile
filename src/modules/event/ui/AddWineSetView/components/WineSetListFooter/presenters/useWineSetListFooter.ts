import { useMemo } from 'react';

interface IProps {
    repeatRuleLabel: string;
    repeatTitle: string;
}

export const useWineSetListFooter = ({ repeatRuleLabel, repeatTitle }: IProps) => {
    const repeatValueText = useMemo(() => {
        return repeatRuleLabel;
    }, [repeatRuleLabel]);

    const repeatTitleText = useMemo(() => {
        return `${repeatTitle}:`;
    }, [repeatTitle]);

    return {
        repeatValueText,
        repeatTitleText,
    };
};
