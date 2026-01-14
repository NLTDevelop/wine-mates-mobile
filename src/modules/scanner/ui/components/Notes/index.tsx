import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { wineModel } from '@/entities/wine/WineModel';
import { userModel } from '@/entities/users/UserModel';
import { DropdownButton } from '@/UIKit/DropdownButton';

export const Notes = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const details = (() => {
        if (!wineModel.tasteCharacteristics?.length) return '';

        const isPremiumUser = userModel.user?.hasPremium || false;

        const available = isPremiumUser
            ? wineModel.tasteCharacteristics
            : wineModel.tasteCharacteristics.filter(c => !c.isPremium);

        return available.map(item => item.levels[item.selectedIndex ?? 0]?.name).join(', ');
    })();

    const smells = useMemo(() => wineModel.selectedSmells?.map(smell => smell.name).join(', '), []);
    const tastes = useMemo(() => wineModel.selectedTastes?.map(taste => taste.name).join(', '), []);

    return (
        <View style={styles.container}>
            <Typography text={t('wine.tastingResult')} variant="subtitle_20_500" style={styles.title} />
            <DropdownButton title={t('wine.notes')}>
                <View style={styles.mainContainer}>
                    <View style={styles.row}>
                        <Typography text={t('wine.color')} variant="h6" style={styles.characteristicTitle} />
                        <Typography
                            text={wineModel.base?.colorOfWine?.value || '-'}
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
            </DropdownButton>
        </View>
    );
};
