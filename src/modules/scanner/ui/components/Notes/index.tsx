import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { wineModel } from '@/entities/wine/WineModel';
import { DropdownButton } from '@/UIKit/DropdownButton';

export const Notes = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const smells = useMemo(() => wineModel.selectedSmells?.map(smell => smell.name).join(', '), []);
    const tastes = useMemo(() => wineModel.selectedTastes?.map(taste => taste.name).join(', '), []);

    return (
        <View style={styles.container}>
            <DropdownButton title={t('wine.tastingResult')}>
                <View style={styles.mainContainer}>
                    <View style={styles.row}>
                        <Typography text={t('wine.color')} variant="h6" style={styles.characteristicTitle} />
                        <Typography
                            text={`${wineModel.look?.tone ? t(`wine.${wineModel.look?.tone}`) : '-'} ${wineModel.look?.name || '-'}`}
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
                    {wineModel.tasteCharacteristicDetails?.map((detail, index) => (
                        <View key={detail.id} style={index === wineModel.tasteCharacteristicDetails!.length - 1 ? styles.lastRow : styles.row}>
                            <Typography text={detail.label} variant="h6" style={styles.characteristicTitle} />
                            <Typography text={detail.value} variant="h6" style={styles.characteristic} />
                        </View>
                    ))}
                </View>
            </DropdownButton>
        </View>
    );
};
