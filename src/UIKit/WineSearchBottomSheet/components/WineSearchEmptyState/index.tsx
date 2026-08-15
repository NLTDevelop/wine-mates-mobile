import { useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { EmptyWineListIcon } from '@assets/icons/EmptyWineListIcon';
import { getStyles } from './styles';

interface IProps {
    text: string;
    isLoading: boolean;
}

export const WineSearchEmptyState = ({ text, isLoading }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator color={colors.primary} size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <EmptyWineListIcon />
                <Typography variant="h5" text={text} style={styles.title} />
                <Typography
                    variant="body_500"
                    text={t('wine.noResultsDescription')}
                    style={styles.description}
                />
            </View>
        </View>
    );
};
