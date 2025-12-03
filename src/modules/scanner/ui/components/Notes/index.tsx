import { useMemo } from 'react';
import { getStyles } from './styles';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import { wineModel } from '@/entities/wine/WineModel';
import { featuresModel } from '@/entities/features/FeaturesModel';
import { FeaturesKeysEnum } from '@/entities/features/enums/FeaturesKeysEnum';

interface IProps {
    isOpened: boolean;
    toggleNotes: () => void;
}

export const Notes = ({ isOpened, toggleNotes }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const details = (() => {
        if (!wineModel.tasteCharacteristics?.length) return '';
    
        const isPremiumUser =
            featuresModel.features?.find(feature => feature.key === FeaturesKeysEnum.TASTING_NOTES)?.isEnabled || false;
    
        const available = isPremiumUser
            ? wineModel.tasteCharacteristics
            : wineModel.tasteCharacteristics.filter(c => !c.isPremium);
    
        return available
            .map(item => item.levels[item.selectedIndex ?? 0]?.name)
            .join(', ');
    })();

    const smells = useMemo(() => wineModel.selectedSmells?.map(smell => smell.name).join(', '), []);
    const tastes = useMemo(() => wineModel.selectedTastes?.map(taste => taste.name).join(', '), []);

    return (
        <View style={styles.container}>
            <Typography text={t('wine.tastingResult')} variant="subtitle_20_500" style={styles.title} />
            <TouchableOpacity style={styles.button} onPress={toggleNotes}>
                <Typography variant="h6" text={t('wine.notes')} />
                <ArrowDownIcon rotate={isOpened ? 180 : 0} />
            </TouchableOpacity>

            {isOpened && (
                <View style={styles.mainContainer}>
                    <View style={styles.row}>
                        <Typography text={t('wine.color')} variant="h6" style={styles.characteristicTitle} />
                        <Typography
                            text={wineModel.base?.colorOfWine.value}
                            variant="h6"
                            style={styles.characteristic}
                        />
                    </View>
                    <View style={styles.row}>
                        <Typography text={t('wine.aroma')} variant="h6" style={styles.characteristicTitle} />
                        <Typography text={smells} variant="h6" style={styles.characteristic} />
                    </View>
                    <View style={styles.row}>
                        <Typography text={t('wine.taste')} variant="h6" style={styles.characteristicTitle} />
                        <Typography text={tastes} variant="h6" style={styles.characteristic} />
                    </View>
                    <View style={styles.lastRow}>
                        <Typography text={t('wine.details')} variant="h6" style={styles.characteristicTitle} />
                        <Typography text={details} variant="h6" style={styles.characteristic} />
                    </View>
                </View>
            )}
        </View>
    );
};
