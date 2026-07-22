import { useMemo } from 'react';
import { useUiContext } from '@/UIProvider';
import { Button } from '@/UIKit/Button';
import { CustomAlert } from '@/UIKit/CustomAlert/ui';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';

interface IProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    isLoading?: boolean;
    description?: string;
    buttonText?: string;
}

export const ConfirmationAlert = ({
    visible,
    onClose,
    onConfirm,
    description,
    isLoading = false,
    title,
    buttonText,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <CustomAlert
            visible={visible}
            onClose={onClose}
            header={title}
            content={
                description ? <Typography style={styles.message} variant="body_400" text={description} /> : undefined
            }
            footer={
                <Button
                    text={buttonText || t('common.agreeAndContinue')}
                    onPress={onConfirm}
                    inProgress={isLoading}
                />
            }
        />
    );
};
