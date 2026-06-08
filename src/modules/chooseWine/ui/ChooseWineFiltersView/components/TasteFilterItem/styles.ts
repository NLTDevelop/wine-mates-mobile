import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            marginBottom: scaleVertical(16),
        },
        title: {
            color: colors.text,
        },
        description: {
            color: colors.text_light,
            marginTop: scaleVertical(2),
        },
        slider: {
            marginTop: scaleVertical(8),
        },
        labelsRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: scaleVertical(4),
        },
        labelText: {
            flex: 1,
            color: colors.text,
            textAlign: 'center',
        },
        leftLabelText: {
            textAlign: 'left',
        },
        rightLabelText: {
            textAlign: 'right',
        },
    });

    return styles;
};
