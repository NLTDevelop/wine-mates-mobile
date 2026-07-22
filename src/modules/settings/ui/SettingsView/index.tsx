import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { SettingsHeader } from '../components/SettingsHeader';
import { useSettings } from '../../presenters/useSettings';
import { SettingsItem } from '../components/SettingsItem';
import { LogoutAlert } from '../components/LogoutAlert';
import { useLogoutAlert } from '../../presenters/useLogoutAlert';
import { useSelectLanguageBottomSheet } from '../../presenters/useSelectLanguageBottomSheet';
import { SelectLanguageBottomSheet } from '../components/SelectLanguageBottomSheet';

export const SettingsView = () => {
    const { colors, t, locale } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { isVisible: isLanguageModalVisible, onItemPress, onClose, onOpen } = useSelectLanguageBottomSheet()
    const { isVisible, isLoading, onShowLogoutAlert, onHideLogoutAlert, onLogout } = useLogoutAlert();
    const { APP_BUTTONS, BUTTONS, ACCOUNT_BUTTONS } = useSettings(onShowLogoutAlert, onOpen, locale);

    return (
        <ScreenContainer
            edges={['top']}
            withGradient
            scrollEnabled
            headerComponent={<HeaderWithBackButton title={t('profile.settings')} isCentered={false} />}
        >
            <View style={styles.container}>
                <SettingsHeader />

                <View style={styles.section}>
                    {APP_BUTTONS.map((item, index) => (
                        <SettingsItem key={item.id} item={item} isLast={index === APP_BUTTONS.length - 1} />
                    ))}
                </View>

                <View style={styles.section}>
                    {BUTTONS.map((item, index) => (
                        <SettingsItem key={item.id} item={item} isLast={index === BUTTONS.length - 1} />
                    ))}
                </View>

                <View style={styles.section}>
                    {ACCOUNT_BUTTONS.map((item, index) => (
                        <SettingsItem key={item.id} item={item} isLast={index === ACCOUNT_BUTTONS.length - 1} />
                    ))}
                </View>
            </View>
            <LogoutAlert
                visible={isVisible}
                isLoading={isLoading}
                onClose={onHideLogoutAlert}
                onConfirm={onLogout}
            />
            {isLanguageModalVisible && (
                <SelectLanguageBottomSheet
                    isVisible={isLanguageModalVisible}
                    onClose={onClose}
                    onItemPress={onItemPress}
                />
            )}
        </ScreenContainer>
    );
};
