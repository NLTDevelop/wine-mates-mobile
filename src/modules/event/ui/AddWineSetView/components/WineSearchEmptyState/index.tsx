import { useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Button } from '@/UIKit/Button';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';

interface IProps {
    text: string;
    isLoading: boolean;
    shouldShowScannerButton: boolean;
    onOpenScannerPress: () => void;
}

export const WineSearchEmptyState = ({
    text,
    isLoading,
    shouldShowScannerButton,
    onOpenScannerPress,
}: IProps) => {
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
                <Typography variant="body_400" text={text} style={styles.text} />
            </View>
            {shouldShowScannerButton && (
                <Button
                    text={t('event.searchWineWithScanner')}
                    onPress={onOpenScannerPress}
                    type="secondary"
                    containerStyle={styles.scannerButton}
                />
            )}
        </View>
    );
};
