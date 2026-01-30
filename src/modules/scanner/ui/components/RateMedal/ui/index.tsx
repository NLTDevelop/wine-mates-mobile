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

interface IProps {
    sliderValue: number;
    size?: number;
}

export const RateMedal = ({ sliderValue, size }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { medalType } = useRateMedal(sliderValue);

    const medalProps = {
        height: size ? size : 55,
        width: size ? size : 55,
        text: sliderValue.toString(),
    }

    const renderMedal = () => {
        switch (medalType) {
            case 'nice':
                return <NiceWineIcon {...medalProps}/>;
            case 'bronze':
                return <BronzeMedalIcon {...medalProps} />;
            case 'silver':
                return <SilverMedalIcon {...medalProps} />;
            case 'gold':
                return <GoldMedalIcon {...medalProps} />;
            case 'platinum':
                return <PlatinumMedalIcon {...medalProps} />;
            default:
                return <NiceWineIcon />;
        }
    };

    return <View style={styles.container}>{renderMedal()}</View>;
};
