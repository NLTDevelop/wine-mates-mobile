import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { useRateMedal } from './presenters/useRateMedal';
import { NiceWineIcon } from '@assets/icons/NiceWineIcon';
import { BronzeMedalIcon } from '@assets/icons/BronzeMedalIcon';
import { GoldMedalIcon } from '@assets/icons/GoldMedalIcon';
import { PlatinumMedalIcon } from '@assets/icons/PlatinumMedalIcon';
import { SilverMedalIcon } from '@assets/icons/SilverMedalIcon';
import { scaleVertical } from '@/utils';

interface IProps {
    sliderValue: number;
}

export const RateMedal = ({ sliderValue }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { medalType } = useRateMedal(sliderValue);

    const medalProps = {
        height: scaleVertical(55),
        width: scaleVertical(55),
        text: sliderValue.toString(),
    }

    const renderMedal = () => {
        switch (medalType) {
            case 'nice':
                return <NiceWineIcon />;
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
