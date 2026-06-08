import { Typography } from '@/UIKit/Typography';
import { useUiContext } from '@/UIProvider';
import { memo, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';
import { ICustomRepeatWeekDayItem } from '@/modules/event/types/ICustomRepeatWeekDayItem';

interface IProps {
    weekDayItems: ICustomRepeatWeekDayItem[];
}

const CustomRepeatEventDaysRepetitionComponent = ({ weekDayItems }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <Typography text={t('repeatEvent.daysOfRepetition')} variant="h6" style={styles.label} />
            <View style={styles.weekDaysRow}>
                {weekDayItems.map(item => (
                    <TouchableOpacity
                        key={item.value}
                        onPress={item.onPress}
                        style={[styles.weekDayButton, item.isSelected && styles.weekDayButtonSelected]}
                    >
                        <Typography
                            text={item.label}
                            variant="h6"
                            style={[styles.weekDayText, item.isSelected && styles.weekDayTextSelected]}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export const CustomRepeatEventDaysRepetition = memo(CustomRepeatEventDaysRepetitionComponent);
