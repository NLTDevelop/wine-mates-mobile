import { useMemo } from 'react';
import { View } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { SomethingWentWrongIcon } from '@/assets/icons/SomethingWentWrongIcon';
import { ConnectionErrorIcon } from '@/assets/icons/ConnectionErrorIcon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/UIKit/Button';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';

interface IProps {
    type: ErrorTypeEnum;
    onRetry: () => void;
    isLoading?: boolean;
}

export const ErrorStateView = ({ type, onRetry, isLoading = false }: IProps) => {
    const { colors, t } = useUiContext();
    const { bottom, top } = useSafeAreaInsets();
    const styles = useMemo(() => getStyles(colors, bottom, top), [colors, bottom, top]);

    const { icon, title, subtitle, buttonText } = useMemo(() => {
        const data = {
            error: {
                icon: <SomethingWentWrongIcon />,
                title: t('errors.somethingWentWrong') || 'Sorry, something went wrong',
                subtitle: t('errors.tryAgain') || 'Please try again',
                buttonText: t('common.tryAgain') || 'Try again',
            },
            noInternet: {
                icon: <ConnectionErrorIcon />,
                title: t('errors.noConnection') || 'No connection',
                subtitle: t('errors.reconnect') || "It looks like you're offline. Reconnect to continue",
                buttonText: t('common.retry') || 'Retry',
            },
        };
        return data[type];
    }, [t, type]);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <HeaderWithBackButton />
            </View>
            <View style={styles.mainContainer}>
                {icon}
                <Typography variant="h4" text={title} style={styles.title} />
                <Typography variant="body_400" text={subtitle} style={styles.subtitle} />
            </View>
            <Button text={buttonText} onPress={onRetry} type='secondary' inProgress={isLoading}/>
        </View>
    );
};
