import { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { WineLoverIcon } from '@assets/icons/WineLoverIcon';
import { WineExpertIcon } from '@assets/icons/WineExpertIcon';
import { WinemakerIcon } from '@assets/icons/WinemakerIcon';
import { NextArrowIcon } from '@assets/icons/NextArrowIcon';
import { getStyles } from './styles';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';

interface IProps {
    expertiseLevel: WineExperienceLevelEnum;
    onPress: () => void;
}

export const ExpertiseSelectorRow = ({ expertiseLevel, onPress }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <Typography text={t('settings.expertise')} variant="body_500" style={styles.title} />
            <Pressable style={styles.row} onPress={onPress}>
                {expertiseLevel === WineExperienceLevelEnum.LOVER && <WineLoverIcon />}
                {expertiseLevel === WineExperienceLevelEnum.EXPERT && <WineExpertIcon />}
                {expertiseLevel === WineExperienceLevelEnum.CREATOR && <WinemakerIcon />}
                <Typography
                    text={t(`wineLevel.${expertiseLevel}`)}
                    variant="h5"
                    style={styles.value}
                />
                <NextArrowIcon />
            </Pressable>
        </View>
    );
};

