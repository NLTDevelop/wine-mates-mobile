import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles.ts';
import { useUiContext } from '@/UIProvider';
import { useRateMedal } from '../presenters/useRateMedal.ts';
import { NiceWineIcon } from '@assets/icons/NiceWineIcon.tsx';
import { BronzeMedalIcon } from '@assets/icons/BronzeMedalIcon.tsx';
import { GoldMedalIcon } from '@assets/icons/GoldMedalIcon.tsx';
import { PlatinumMedalIcon } from '@assets/icons/PlatinumMedalIcon.tsx';
import { SilverMedalIcon } from '@assets/icons/SilverMedalIcon.tsx';
import { SimpleMedalIcon } from '@assets/icons/SimpleMedalIcon.tsx';
import { WeakMedalIcon } from '@assets/icons/WeakMedalIcon.tsx';
import { scaleHorizontal } from '@/utils';

interface IProps {
    sliderValue: number;
    size?: number;
    titleFontSize?: number;
    mainFontSize?: number;
    nameFontSize?: number;
}

export const RateMedal = ({ sliderValue, size, titleFontSize, mainFontSize, nameFontSize }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { medalType } = useRateMedal(sliderValue);

    const medalSize = size || 54;

    const medalProps = {
        height: scaleHorizontal(medalSize),
        width: scaleHorizontal(medalSize),
        text: sliderValue ? sliderValue.toString() : '0',
        titleFontSize,
        mainFontSize,
        nameFontSize
    };

    const renderMedal = () => {
        switch (medalType) {
            case 'nice':
                return <NiceWineIcon {...medalProps} />;
            case 'bronze':
                return <BronzeMedalIcon {...medalProps} />;
            case 'silver':
                return <SilverMedalIcon {...medalProps} />;
            case 'gold':
                return <GoldMedalIcon {...medalProps} />;
            case 'platinum':
                return <PlatinumMedalIcon {...medalProps} />;
            case 'simple':
                return <SimpleMedalIcon {...medalProps} />;
            case 'weak':
                return <WeakMedalIcon {...medalProps} />;
            default:
                return <WeakMedalIcon {...medalProps} />;
        }
    };

    return <View style={styles.container}>{renderMedal()}</View>;
};
