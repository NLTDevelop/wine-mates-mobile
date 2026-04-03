import { useMemo } from 'react';
import { View } from 'react-native';
import { CustomAlert } from './index';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { useUiContext } from '@/UIProvider';
import { StyleSheet } from 'react-native';
import { scaleVertical } from '@/utils';

interface IProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

export const ConfirmAlert = ({
    visible,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    cancelText,
    isLoading,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getLocalStyles(colors), [colors]);

    const header = (
        <Typography variant="h4" text={title} style={styles.title} />
    );

    const content = message ? (
        <Typography variant="body_400" text={message} style={styles.message} />
    ) : null;

    const footer = (
        <View style={styles.buttonsContainer}>
            <Button
                text={confirmText || t('common.yes')}
                onPress={onConfirm}
                type="main"
                containerStyle={styles.button}
                isLoading={isLoading}
                disabled={isLoading}
            />
            <Button
                text={cancelText || t('common.no')}
                onPress={onClose}
                type="secondary"
                containerStyle={styles.button}
                disabled={isLoading}
            />
        </View>
    );

    return <CustomAlert visible={visible} onClose={onClose} header={header} content={content} footer={footer} />;
};

const getLocalStyles = (colors: any) => {
    return StyleSheet.create({
        title: {
            textAlign: 'center',
        },
        message: {
            textAlign: 'center',
            color: colors.textSecondary,
        },
        buttonsContainer: {
            gap: scaleVertical(12),
        },
        button: {
            width: '100%',
        },
    });
};
