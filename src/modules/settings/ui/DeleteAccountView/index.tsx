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
    const { isConfirmed, onDeleteAccount, onCancel, toggleConfirmation, isInProgress } = useDeleteAccount();

    return (
        <ScreenContainer
            edges={['top', 'bottom']}
            withGradient
            headerComponent={<HeaderWithBackButton title={t('settings.deleteAccount')} isCentered={false} />}
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    <Typography variant="h6" style={styles.warningText}>
                        {t('settings.deleteAccountWarning1')}
                    </Typography>

                    <View style={styles.listContainer}>
                        <Typography variant="h6" style={styles.listItem}>
                            {t('settings.deleteAccountListItem1')}
                        </Typography>
                        <Typography variant="h6" style={styles.listItem}>
                            {t('settings.deleteAccountListItem2')}
                        </Typography>
                        <Typography variant="h6" style={styles.listItem}>
                            {t('settings.deleteAccountListItem3')}
                        </Typography>
                    </View>

                    <Typography variant="h6" style={styles.warningText}>
                        {t('settings.deleteAccountWarning2')}
                    </Typography>

                    <Typography variant="h6" style={styles.questionText}>
                        {t('settings.deleteAccountQuestion')}
                    </Typography>

                    <TouchableOpacity style={styles.checkboxContainer} onPress={toggleConfirmation} activeOpacity={0.7}>
                        <Checkbox isChecked={isConfirmed} onPress={toggleConfirmation} />
                        <Typography
                            text={t('settings.deleteAccountConfirm')}
                            variant="h6"
                            style={styles.checkboxLabel}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        text={t('settings.deleteAccountButton')}
                        onPress={onDeleteAccount}
                        containerStyle={styles.deleteButton}
                        disabled={!isConfirmed}
                        type="main"
                    />
                    <Button
                        text={t('common.cancel')}
                        onPress={onCancel}
                        containerStyle={styles.cancelButton}
                        type="secondary"
                        inProgress={isInProgress}
                    />
                </View>
            </View>
        </ScreenContainer>
    );
};
