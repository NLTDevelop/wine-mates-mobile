import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';

interface IDateBadgeProps {
    month: string;
    day: string;
}

export const DateBadge = ({ month, day }: IDateBadgeProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.dateBadge}>
            <View style={styles.monthContainer}>
            <Typography text={month} variant="body_400" style={styles.monthText} />
            </View>
            <View style={styles.dayContainer}>
                <Typography text={day} variant="h4" style={styles.dayText} />
            </View>
        </View>
    );
};
