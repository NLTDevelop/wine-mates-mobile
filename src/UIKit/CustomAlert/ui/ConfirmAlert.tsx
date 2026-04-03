import { useMemo, ReactNode } from 'react';
import { View } from 'react-native';
import { CustomAlert } from './index';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './ConfirmAlertStyles';

interface IProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    customHeader?: ReactNode | string;
    customContent?: ReactNode | string;
    customFooter?: ReactNode;
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
    customHeader,
    customContent,
    customFooter,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const header = customHeader ? (
        typeof customHeader === 'string' ? (
            <Typography variant="h4" text={customHeader} style={styles.title} />
        ) : (
            customHeader
        )
    ) : title ? (
        <Typography variant="h4" text={title} style={styles.title} />
    ) : null;

    const content = customContent ? (
        typeof customContent === 'string' ? (
            <Typography variant="body_400" text={customContent} style={styles.message} />
        ) : (
            customContent
        )
    ) : message ? (
        <Typography variant="body_400" text={message} style={styles.message} />
    ) : null;

    const footer = customFooter ? (
        customFooter
    ) : (
        <View style={styles.buttonsContainer}>
            <Button
                text={confirmText || t('common.yes')}
                onPress={onConfirm}
                type="main"
                containerStyle={styles.button}
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
