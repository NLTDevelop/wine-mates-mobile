import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Button } from '@/UIKit/Button';
import { CustomAlert } from '@/UIKit/CustomAlert/ui';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';

interface IProps {
    visible: boolean;
    isLoading: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const LogoutAlert = ({ visible, isLoading, onClose, onConfirm }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <CustomAlert
            visible={visible}
            onClose={onClose}
            header={<Typography style={styles.title} variant="h3" text={t('logout.logout')} />}
            content={<Typography style={styles.message} variant="body_400" text={t('logout.description')} />}
            footer={
                <View style={styles.buttons}>
                    <Button
                        text={t('common.confirm')}
                        onPress={onConfirm}
                        inProgress={isLoading}
                        containerStyle={styles.button}
                    />
                    <Button
                        text={t('common.cancel')}
                        onPress={onClose}
                        type="secondary"
                        disabled={isLoading}
                        containerStyle={styles.button}
                    />
                </View>
            }
        />
    );
};
