import { View } from 'react-native';
import { useMemo } from 'react';
import { getStyles } from './styles';
import { useUiContext } from '../../../../../UIProvider';
import { ErrorIcon } from '../../../../../assets/icons/ErrorIcon';
import { Typography } from '../../../../../UIKit/Typography';

interface IProps {
    warningText: string;
}

export const Warning = ({ warningText }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <ErrorIcon />
            <Typography
                text={warningText}
                variant="subtitle_12_400"
                style={styles.errorText}
            />
        </View>
    );
};
