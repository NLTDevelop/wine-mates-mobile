import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';

interface IProps {
    label: string;
    value: string;
    isLast?: boolean;
}

export const AppealDetailsField = ({ label, value, isLast = false }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={isLast ? styles.lastContainer : styles.container}>
            <Typography text={label} variant="subtitle_12_400" style={styles.label} />
            <Typography text={value} variant="body_400" />
        </View>
    );
};
