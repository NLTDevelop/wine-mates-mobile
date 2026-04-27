import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { IRadiusOption } from '@/modules/event/ui/EventFiltersView/types/IRadiusOption';
import { getStyles } from './styles';

interface IProps {
    radiusOption1: IRadiusOption;
    radiusOption5: IRadiusOption;
    radiusOption10: IRadiusOption;
    radiusOption50: IRadiusOption;
}

export const RadiusButtons = ({
    radiusOption1,
    radiusOption5,
    radiusOption10,
    radiusOption50,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.row}>
            <TouchableOpacity
                style={radiusOption1.isSelected ? styles.buttonSelected : styles.button}
                onPress={radiusOption1.onPress}
            >
                <Typography
                    text={`+${radiusOption1.value}${t('eventFilters.kmSuffix')}`}
                    variant="h6"
                    style={radiusOption1.isSelected ? styles.textSelected : styles.text}
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={radiusOption5.isSelected ? styles.buttonSelected : styles.button}
                onPress={radiusOption5.onPress}
            >
                <Typography
                    text={`+${radiusOption5.value}${t('eventFilters.kmSuffix')}`}
                    variant="h6"
                    style={radiusOption5.isSelected ? styles.textSelected : styles.text}
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={radiusOption10.isSelected ? styles.buttonSelected : styles.button}
                onPress={radiusOption10.onPress}
            >
                <Typography
                    text={`+${radiusOption10.value}${t('eventFilters.kmSuffix')}`}
                    variant="h6"
                    style={radiusOption10.isSelected ? styles.textSelected : styles.text}
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={radiusOption50.isSelected ? styles.buttonSelected : styles.button}
                onPress={radiusOption50.onPress}
            >
                <Typography
                    text={`+${radiusOption50.value}${t('eventFilters.kmSuffix')}`}
                    variant="h6"
                    style={radiusOption50.isSelected ? styles.textSelected : styles.text}
                />
            </TouchableOpacity>
        </View>
    );
};
