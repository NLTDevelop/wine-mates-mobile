import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Button } from '@/UIKit/Button';
import { CustomAlert } from '@/UIKit/CustomAlert/ui';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';

interface IProps {
    visible: boolean;
    wineName: string;
    isLoading: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const AddWineryWineAlert = ({ visible, wineName, isLoading, onClose, onConfirm }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <CustomAlert
            visible={visible}
            onClose={onClose}
            header={<Typography variant="h4" text={t('profile.addWineToWineryTitle')} style={styles.title} />}
            content={
                <Typography
                    variant="body_400"
                    text={t('profile.addWineToWineryMessage', { name: wineName })}
                    style={styles.message}
                />
            }
            footer={
                <View style={styles.buttonsContainer}>
                    <Button
                        text={t('common.confirm')}
                        onPress={onConfirm}
                        type="main"
                        containerStyle={styles.button}
                        inProgress={isLoading}
                    />
                    <Button
                        text={t('common.cancel')}
                        onPress={onClose}
                        type="secondary"
                        containerStyle={styles.button}
                        disabled={isLoading}
                    />
                </View>
            }
        />
    );
};
