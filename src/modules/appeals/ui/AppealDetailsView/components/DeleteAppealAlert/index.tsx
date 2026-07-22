import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { CustomAlert } from '@/UIKit/CustomAlert/ui';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { getStyles } from './styles';

interface IProps {
    visible: boolean;
    isLoading: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteAppealAlert = ({ visible, isLoading, onClose, onConfirm }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <CustomAlert
            visible={visible}
            onClose={onClose}
            header={<Typography text={t('appeals.deleteTitle')} variant="h4" style={styles.title} />}
            content={<Typography text={t('appeals.deleteMessage')} variant="body_400" style={styles.message} />}
            footer={
                <View style={styles.buttons}>
                    <Button
                        text={t('common.yes')}
                        onPress={onConfirm}
                        disabled={isLoading}
                        inProgress={isLoading}
                        containerStyle={styles.button}
                    />
                    <Button
                        text={t('common.no')}
                        onPress={onClose}
                        disabled={isLoading}
                        type="secondary"
                        containerStyle={styles.button}
                    />
                </View>
            }
        />
    );
};
