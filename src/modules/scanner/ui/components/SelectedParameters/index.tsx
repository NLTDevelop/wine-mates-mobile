import { useMemo } from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import { useSelectedParameters } from '@/modules/scanner/presenters/useSelectedParameters';

interface IProps {
    containerStyle?: ViewStyle;
}

export const SelectedParameters = ({ containerStyle }: IProps) => {
    const { colors, t } = useUiContext();
    const { isOpened, onPress, parameters, maxLabelWidth, handleLabelLayout } = useSelectedParameters();
    const styles = useMemo(() => getStyles(colors, maxLabelWidth), [colors, maxLabelWidth]);

    return (
        <View style={[styles.container, containerStyle]}>
            <TouchableOpacity style={styles.header} onPress={onPress}>
                <Typography variant="h4" text={t('wine.wineDetails')} />
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
