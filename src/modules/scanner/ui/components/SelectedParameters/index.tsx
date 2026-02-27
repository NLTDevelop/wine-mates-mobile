import { useMemo, useState } from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import { useSelectedParameters } from '@/modules/scanner/presenters/useSelectedParameters';
import { wineModel } from '@/entities/wine/WineModel';

interface IProps {
    containerStyle?: ViewStyle;
}

export const SelectedParameters = ({ containerStyle }: IProps) => {
    const { colors, t } = useUiContext();
    const { isOpened, onPress } = useSelectedParameters();
    const [maxLabelWidth, setMaxLabelWidth] = useState(0);

    const parameters = useMemo(() => [
        { key: 'typeOfWine', label: t('wine.typeOfWine'), value: wineModel.base?.typeOfWine?.value || t('wine.typeOfWine') },
        { key: 'colorOfWine', label: t('wine.colorOfWine'), value: wineModel.base?.colorOfWine?.value || t('wine.colorOfWine') },
        { key: 'country', label: t('wine.country'), value: wineModel.base?.country?.value || t('wine.country') },
        { key: 'region', label: t('wine.region'), value: wineModel.base?.region?.value || '–' },
        { key: 'wineryName', label: t('wine.wineryName'), value: wineModel.base?.producer?.value || t('wine.wineryName') },
        { key: 'grapeVariety', label: t('wine.grapeVariety'), value: wineModel.base?.grapeVariety?.value || t('wine.grapeVariety') },
        { key: 'vintage', label: t('wine.vintage'), value: wineModel.base?.vintageYear?.value || '–' },
        { key: 'wineName', label: t('wine.wineName'), value: wineModel.base?.wineName?.value || '–', isBold: true },
    ], [t]);

    const styles = useMemo(() => getStyles(colors, maxLabelWidth), [colors, maxLabelWidth]);

    const handleLabelLayout = (width: number) => {
        setMaxLabelWidth(prev => Math.max(prev, width));
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <TouchableOpacity style={styles.header} onPress={onPress}>
                <Typography variant="h4" text={t('wine.selectedParameters')} />
                <ArrowDownIcon rotate={isOpened ? 180 : 0} />
            </TouchableOpacity>
            {isOpened && (
                <View style={styles.rowsContainer}>
                    {parameters.map((param) => (
                        <View key={param.key} style={styles.row}>
                            <View style={styles.labelContainer}>
                                <Typography
                                    variant="body_400"
                                    text={`${param.label}:`}
                                    style={styles.label}
                                    onLayout={(e) => handleLabelLayout(e.nativeEvent.layout.width)}
                                />
                            </View>
                            <View style={styles.valueContainer}>
                                <Typography
                                    variant="body_500"
                                    text={param.value}
                                    style={styles.value}
                                />
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};
