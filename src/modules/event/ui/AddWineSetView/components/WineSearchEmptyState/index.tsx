import { useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';

interface IProps {
    text: string;
    isLoading: boolean;
}

export const WineSearchEmptyState = ({
    text,
    isLoading,
}: IProps) => {
    const { colors } = useUiContext();
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
                <Typography variant="body_400" text={text} style={styles.text} />
            </View>
        </View>
    );
};
