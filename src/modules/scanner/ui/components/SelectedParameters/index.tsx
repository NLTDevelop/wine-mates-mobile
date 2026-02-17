import { useMemo } from 'react';
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
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { isOpened, onPress } = useSelectedParameters();

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

    return (
        <View style={[styles.container, containerStyle]}>
            <TouchableOpacity style={styles.header} onPress={onPress}>
                <Typography variant="h4" text={t('wine.selectedParameters')} />
                <ArrowDownIcon rotate={isOpened ? 180 : 0} />
            </TouchableOpacity>
            {isOpened && (
                <>
                    <View style={styles.columnsContainer}>
                        <View style={styles.leftColumn}>
                            {parameters.map((param) => (
                                <Typography
                                    key={param.key}
                                    variant="body_400"
                                    text={`${param.label}:`}
                                    style={styles.label}
                                    numberOfLines={1}
                                />
                            ))}
                        </View>
                        <View style={styles.rightColumn}>
                            {parameters.map((param) => (
                                <Typography
                                    key={param.key}
                                    variant={'body_500'}
                                    text={param.value}
                                    style={styles.value}
                                    numberOfLines={1}
                                />
                            ))}
                        </View>
                    </View>
                </>
            )}
        </View>
    );
};
