import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { usePersonalProfile } from '../../presenters/usePersonalProfile';
import { Button } from '@/UIKit/Button';
import { scaleVertical } from '@/utils';

export const PersonalProfileView = () => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { handleLogout } = usePersonalProfile();

    return (
        // <WithErrorHandler error={isAuthError ? ErrorTypeEnum.ERROR : null} onRetry={retrySignIn}>
        <ScreenContainer edges={['top']}>
            <View style={styles.container}>
                <Typography text={'Personal Profile'} variant="h3" />
                <Button text={'LogOut'} onPress={handleLogout} type="secondary" containerStyle={{marginBottom: scaleVertical(16)}}/>
            </View>
        </ScreenContainer>
        // </WithErrorHandler>
    );
};
