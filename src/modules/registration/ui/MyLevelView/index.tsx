import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { SignInFooter } from '@/modules/registration/ui/components/SignInFooter';
import { LevelButton } from '@/modules/registration/ui/components/LevelButton';
import { WineLoverIcon } from '@/assets/icons/WineLoverIcon';
import { WineExpertIcon } from '@/assets/icons/WineExpertIcon';
import { WinemakerIcon } from '@/assets/icons/WinemakerIcon';
import { useMyLevel } from '@/modules/registration/presenters/useMyLevel';

export const MyLevelView = () => {
    const { t, colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { handleWineLoverPress, handleWineExpertPress, handleWinemakerPress } = useMyLevel();

    return (
        <ScreenContainer edges={['top', 'bottom']} headerComponent={<HeaderWithBackButton />}>
            <View style={styles.container}>
                <View style={styles.mainContainer}>
                    <Typography text={`${t('registration.myLevelInWine')}`} variant="h3" style={styles.title} />
                    <Typography text={t('registration.myLevelDescription')} variant="body_400" style={styles.text} />
                    <View style={styles.buttonsContainer}>
                        <LevelButton
                            text={t('registration.wineLover')}
                            typeIcon={<WineLoverIcon />}
                            onPress={handleWineLoverPress}
                        />
                        <LevelButton
                            text={t('registration.wineExpert')}
                            typeIcon={<WineExpertIcon />}
                            onPress={handleWineExpertPress}
                        />
                        <LevelButton
                            text={t('registration.winemaker')}
                            typeIcon={<WinemakerIcon />}
                            onPress={handleWinemakerPress}
                        />
                    </View>
                </View>
                <SignInFooter />
            </View>
        </ScreenContainer>
    );
};
