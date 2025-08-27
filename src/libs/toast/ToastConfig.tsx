import { useMemo } from 'react';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { useUiContext } from '../../UIProvider';
import { getStyles } from './styles';

export const ToastConfig = () => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const toastConfig = useMemo(() => {
        return {
            success: (props: any) => (
                <BaseToast
                    {...props}
                    text1NumberOfLines={4}
                    text2NumberOfLines={4}
                    style={styles.container}
                    contentContainerStyle={[styles.content, { backgroundColor: colors.success }]}
                    text1Style={styles.text}
                    text2Style={styles.text}
                />
            ),
            info: (props: any) => (
                <BaseToast
                    {...props}
                    text1NumberOfLines={4}
                    text2NumberOfLines={4}
                    style={styles.container}
                    contentContainerStyle={[styles.content, { backgroundColor: colors.info }]}
                    text1Style={styles.text}
                    text2Style={styles.text}
                />
            ),
            error: (props: any) => {
                return (
                    <ErrorToast
                        {...props}
                        text1NumberOfLines={4}
                        text2NumberOfLines={4}
                        style={styles.container}
                        contentContainerStyle={[
                            styles.content,
                            { backgroundColor: colors.error },
                        ]}
                        text1Style={styles.text}
                        text2Style={styles.text}
                    />
                );
            },
            warning: (props: any) => {
                return (
                    <ErrorToast
                        {...props}
                        text1NumberOfLines={4}
                        text2NumberOfLines={4}
                        style={styles.container}
                        contentContainerStyle={[
                            styles.content,
                            { backgroundColor: colors.warning },
                        ]}
                        text1Style={styles.text}
                        text2Style={styles.text}
                    />
                );
            },
        };
    }, [colors, styles]);

    return <Toast config={toastConfig} />;
};

