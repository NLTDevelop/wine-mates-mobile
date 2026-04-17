import { memo } from 'react';
import { TitledContent } from '@/UIKit/TitledContent';

interface IProps {
    onPress?: () => void;
}

const WineOfTheDayButtonComponent = ({ onPress }: IProps) => {
    return <TitledContent.RoundedButton onPress={onPress} />;
};

export const WineOfTheDayButton = memo(WineOfTheDayButtonComponent);
WineOfTheDayButton.displayName = 'WineOfTheDayButton';
