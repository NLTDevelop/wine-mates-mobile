import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { SettingsHeader } from '../components/SettingsHeader';
import { useSettings } from '../../presenters/useSettings';
import { SettingsItem } from '../components/SettingsItem';
import { LogoutModal } from '../components/LogoutModal';
import { useLogoutModal } from '../../presenters/useLogoutModal';
import { useSelectLanguageBottomSheet } from '../../presenters/useSelectLanguageBottomSheet';
import { SelectLanguageBottomSheet } from '../components/SelectLanguageBottomSheet';

export const SettingsView = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { selectLanguageModalRef, onItemPress, onClose, onOpen } = useSelectLanguageBottomSheet()
    const { isVisible, onShowLogoutModal, onHideLogoutModal, onLogout } = useLogoutModal();
    const { APP_BUTTONS, BUTTONS, ACCOUNT_BUTTONS } = useSettings(onShowLogoutModal, onOpen);

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
            <LogoutModal isVisible={isVisible} onHide={onHideLogoutModal} onLogout={onLogout}/>
            <SelectLanguageBottomSheet modalRef={selectLanguageModalRef} onClose={onClose} onItemPress={onItemPress}/>
        </ScreenContainer>
    );
};
