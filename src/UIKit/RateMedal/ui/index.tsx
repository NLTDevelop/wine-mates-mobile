import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles.ts';
import { useUiContext } from '@/UIProvider';
import { useRateMedal } from '../presenters/useRateMedal.ts';
import { BronzeMedalIcon } from '@assets/icons/BronzeMedalIcon.tsx';
import { GoldMedalIcon } from '@assets/icons/GoldMedalIcon.tsx';
import { PlatinumMedalIcon } from '@assets/icons/PlatinumMedalIcon.tsx';
import { SilverMedalIcon } from '@assets/icons/SilverMedalIcon.tsx';
import { SimpleMedalIcon } from '@assets/icons/SimpleMedalIcon.tsx';
import { WeakMedalIcon } from '@assets/icons/WeakMedalIcon.tsx';
import { scaleHorizontal } from '@/utils';
import { NiceMedalIcon } from '@assets/icons/NiceMedalIcon.tsx';

interface IProps {
    sliderValue: number;
    size?: number;
    titleFontSize?: number;
    mainFontSize?: number;
    nameFontSize?: number;
    hideText?: boolean;
}

export const RateMedal = ({ sliderValue, size, titleFontSize, mainFontSize, nameFontSize, hideText }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { medalType } = useRateMedal(sliderValue);

    const medalSize = size || 54;

    const medalProps = useMemo(() => ({
        height: scaleHorizontal(medalSize),
        width: scaleHorizontal(medalSize),
        text: sliderValue ? sliderValue.toString() : '0',
        titleFontSize,
        mainFontSize,
        nameFontSize,
        hideText
    }), [hideText, mainFontSize, medalSize, nameFontSize, sliderValue, titleFontSize]);

    const renderMedal = useCallback(() => {
        if (medalType === 'nice') {
            return <NiceMedalIcon {...medalProps} />;
        }

        if (medalType === 'bronze') {
            return <BronzeMedalIcon {...medalProps} />;
        }

        if (medalType === 'silver') {
            return <SilverMedalIcon {...medalProps} />;
        }

        if (medalType === 'gold') {
            return <GoldMedalIcon {...medalProps} />;
        }

        if (medalType === 'platinum') {
            return <PlatinumMedalIcon {...medalProps} />;
        }

        if (medalType === 'simple') {
            return <SimpleMedalIcon {...medalProps} />;
        }

        return <WeakMedalIcon {...medalProps} />;
    }, [medalProps, medalType]);

    return <View style={styles.container}>{renderMedal()}</View>;
};
