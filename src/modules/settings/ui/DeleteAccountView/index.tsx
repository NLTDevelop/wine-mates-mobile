import { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { Checkbox } from '@/UIKit/Checkbox';
import { useDeleteAccount } from '../../presenters/useDeleteAccount';

export const DeleteAccountView = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { isConfirmed, handleDeleteAccount, handleCancel, toggleConfirmation } = useDeleteAccount();

    return (
        <ScreenContainer
            edges={['top', 'bottom']}
            withGradient
            headerComponent={<HeaderWithBackButton title={t('settings.deleteAccount')} isCentered={false} />}
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.warningBlock}>
                        <Typography variant="body_500" style={styles.warningText}>
                            {t('settings.deleteAccountWarning1')}
                        </Typography>

                        <View style={styles.listContainer}>
                            <Typography variant="body_500" style={styles.listItem}>
                                {t('settings.deleteAccountListItem1')}
                            </Typography>
                            <Typography variant="body_500" style={styles.listItem}>
                                {t('settings.deleteAccountListItem2')}
                            </Typography>
                            <Typography variant="body_500" style={styles.listItem}>
                                {t('settings.deleteAccountListItem3')}
                            </Typography>
                        </View>

                        <Typography variant="body_500" style={styles.warningText}>
                            {t('settings.deleteAccountWarning2')}
                        </Typography>
                    </View>

                    <Typography variant="body_500" style={styles.questionText}>
                        {t('settings.deleteAccountQuestion')}
                    </Typography>

                    <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={toggleConfirmation}
                        activeOpacity={0.7}
                    >
                        <Checkbox isChecked={isConfirmed} onPress={toggleConfirmation} />
                        <Typography
                            text={t('settings.deleteAccountConfirm')}
                            variant="body_500"
                            style={styles.checkboxLabel}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        text={t('settings.deleteAccountButton')}
                        onPress={handleDeleteAccount}
                        containerStyle={styles.deleteButton}
                        disabled={!isConfirmed}
                        type="main"
                    />
                    <Button
                        text={t('common.cancel')}
                        onPress={handleCancel}
                        containerStyle={styles.cancelButton}
                        type="secondary"
                    />
                </View>
            </View>
        </ScreenContainer>
    );
};
