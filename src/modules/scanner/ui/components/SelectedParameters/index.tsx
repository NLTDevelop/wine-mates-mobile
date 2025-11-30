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

    return (
        <View style={[styles.container, containerStyle]}>
            <TouchableOpacity style={styles.header} onPress={onPress}>
                <Typography variant="h4" text={t('wine.selectedParameters')} />
                <ArrowDownIcon rotate={isOpened ? 180 : 0} />
            </TouchableOpacity>
            {isOpened && (
                <>
                    <View style={styles.itemContainer}>
                        <Typography
                            variant="h6"
                            text={wineModel.base?.typeOfWine?.value || t('wine.typeOfWine')}
                            style={styles.label}
                        />
                    </View>
                    <View style={styles.itemContainer}>
                        <Typography
                            variant="h6"
                            text={wineModel.base?.colorOfWine?.value || t('wine.colorOfWine')}
                            style={styles.label}
                        />
                    </View>
                    <View style={styles.itemContainer}>
                        <Typography
                            variant="h6"
                            text={wineModel.base?.country?.value || t('wine.country')}
                            style={styles.label}
                        />
                    </View>
                    <View style={styles.itemContainer}>
                        <Typography
                            variant="h6"
                            text={wineModel.base?.region?.value || t('wine.region')}
                            style={styles.label}
                        />
                    </View>
                    <View style={styles.itemContainer}>
                        <Typography
                            variant="h6"
                            text={wineModel.base?.winery?.value || t('wine.wineryName')}
                            style={styles.label}
                        />
                    </View>
                    <View style={styles.itemContainer}>
                        <Typography
                            variant="h6"
                            text={wineModel.base?.grapeVariety?.value || t('wine.grapeVariety')}
                            style={styles.label}
                        />
                    </View>
                    <View style={styles.itemContainer}>
                        <Typography
                            variant="h6"
                            text={wineModel.base?.vintageYear?.value || t('wine.vintage')}
                            style={styles.label}
                        />
                    </View>
                    <View style={styles.itemContainer}>
                        <Typography
                            variant="h6"
                            text={wineModel.base?.wineName?.value || t('wine.wineName')}
                            style={styles.label}
                        />
                    </View>
                </>
            )}
        </View>
    );
};
