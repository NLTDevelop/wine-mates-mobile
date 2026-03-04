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
            <Typography text={month} variant="h6" style={styles.monthText} />
            <View style={styles.dayContainer}>
                <Typography text={day} variant="h3" style={styles.dayText} />
            </View>
        </View>
    );
};
