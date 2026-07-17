import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { IAppeal } from '@/entities/appeals/types/IAppeal';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';
import { useAppealListItem } from './presenters/useAppealListItem';

interface IProps {
    appeal: IAppeal;
    onPress: () => void;
}

export const AppealListItem = ({ appeal, onPress }: IProps) => {
    const { colors, locale } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { date, statusLabel } = useAppealListItem(appeal, locale);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <Typography text={appeal.subject} variant="h5" numberOfLines={2} style={styles.subject} />
                    <View style={styles.status}>
                        <Typography text={statusLabel} variant="subtitle_10_400" style={styles.statusText} />
                    </View>
                </View>
                {!!appeal.description && (
                    <Typography
                        text={appeal.description}
                        variant="body_400"
                        numberOfLines={3}
                        style={styles.description}
                    />
                )}
                <Typography text={date} variant="subtitle_12_400" style={styles.date} />
            </View>
        </TouchableOpacity>
    );
};
