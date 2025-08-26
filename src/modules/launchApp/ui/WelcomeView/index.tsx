import { useMemo } from 'react';
import { getStyles } from './styles';
import { Linking, TouchableOpacity, View } from 'react-native';
import { useUiContext } from '../../../../UIProvider';
import { ScreenContainer } from '../../../../UIKit/ScreenContainer';
import { Typography } from '../../../../UIKit/Typography';
import { Gradient } from '../../../../UIKit/Gradient';
import FastImage from '@d11/react-native-fast-image';
import { Button } from '../../../../UIKit/Button';

export const WelcomeView = () => {
    const { t, colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <ScreenContainer edges={[]}>
            <Gradient />
            <View style={styles.container}>
                <Typography text={t('authentication.welcome')} variant="h5" style={styles.text} />
                <Typography text={t('common.logo')} variant="h2" style={styles.logo} />
                <Typography
                    text={t('authentication.welcomeDescription')}
                    variant="body_400"
                    style={styles.description}
                />
                <FastImage
                    source={require('../../../../assets/images/welcome.png')}
                    style={styles.image}
                    resizeMode={'cover'}
                />
                <View style={styles.buttonContainer}>
                    <Button text={t('authentication.join')} onPress={() => {}} />
                    <Button text={t('authentication.signIn')} onPress={() => {}} type="secondary" />
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
        </ScreenContainer>
    );
};
