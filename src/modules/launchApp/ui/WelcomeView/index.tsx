import { useMemo } from 'react';
import { getStyles } from './styles';
import { Linking, TouchableOpacity, View, Image } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { Gradient } from '@/UIKit/Gradient';
import { Button } from '@/UIKit/Button';
import { useWelcome } from '@/modules/launchApp/presenters/useWelcome';
import { RedLineIcon } from '@/assets/icons/RedLineIcon';
import { ConfirmationModal } from '@/UIKit/ConfirmationModal';
import { useConfirmationModal } from '@/UIKit/ConfirmationModal/presenters/useConfirmationModal';

export const WelcomeView = () => {
    const { t, colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { isVisible, onShowModal, onHide } = useConfirmationModal();
    const { handleSignInPress, handleJoinNowPress } = useWelcome(onHide);

    return (
        <ScreenContainer edges={[]}>
            <Gradient />
            <View style={styles.container}>
                <View>
                    <Typography text={t('authentication.welcome')} variant="h5" style={styles.text} />
                    <Typography text={t('common.logo')} variant="h2" style={styles.logo} />
                    <Typography
                        text={t('authentication.welcomeDescription')}
                        variant="body_400"
                        style={styles.description}
                    />
                    <View style={styles.redLineContainer}>
                        <RedLineIcon />
                    </View>
                    <View style={styles.imageWrapper}>
                        <Image
                            source={require('@/assets/images/welcome.png')}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </View>
                </View>
                <View style={styles.footer}>
                    <View style={styles.buttonContainer}>
                        <Button text={t('authentication.join')} onPress={onShowModal} />
                        <Button text={t('authentication.signIn')} onPress={handleSignInPress} type="secondary" />
                    </View>
                    <View style={styles.termsContainer}>
                        <Typography
                            variant="subtitle_12_400"
                            style={styles.termsText}
                            text={t('authentication.terms_part1')}
                        />
                        <TouchableOpacity onPress={() => Linking.openURL(`https://www.google.com/`)}>
                            <Typography
                                variant="subtitle_12_400"
                                style={styles.linkText}
                                text={t('authentication.terms_part2')}
                            />
                        </TouchableOpacity>
                        <Typography
                            variant="subtitle_12_400"
                            style={styles.termsText}
                            text={t('authentication.terms_part3')}
                        />
                        <TouchableOpacity onPress={() => Linking.openURL(`https://www.google.com/`)}>
                            <Typography
                                variant="subtitle_12_400"
                                style={styles.linkText}
                                text={t('authentication.terms_part4')}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <ConfirmationModal
                isVisible={isVisible}
                onHide={onHide}
                onConfirm={handleJoinNowPress}
                title={t('registration.birthdayTitle')}
                description={t('registration.birthdayDescription')}
            />
        </ScreenContainer>
    );
};
